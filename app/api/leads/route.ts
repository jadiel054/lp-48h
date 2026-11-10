import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { Resend } from "resend";
import crypto from "crypto";
import { leadSchema, escapeHtml, sanitizePhone } from "@/app/lib/lead-validation";

// Tamanho máximo do payload recebido em bytes (32 KB)
const MAX_PAYLOAD_BYTES = 32 * 1024;

// Rate limiting: máximo 5 submissões a cada 10 minutos por IP
const RATE_LIMIT_WINDOW_SECONDS = 10 * 60;
const RATE_LIMIT_MAX_REQUESTS = 5;

type RateLimitStatus = "enforced" | "degraded" | "blocked";

/**
 * Aplica rate limit persistente no Neon usando hash de IP.
 * Se a tabela não existir ou o banco estiver inacessível, registra o estado 'degraded'
 * de forma explícita, sem declarar falsamente que a proteção está ativa.
 */
async function checkPersistentRateLimit(
  databaseUrl: string,
  clientIp: string
): Promise<{ allowed: boolean; remaining: number; status: RateLimitStatus }> {
  try {
    const sql = neon(databaseUrl);
    // Hash com salt para não armazenar IPs crus no banco
    const key = crypto
      .createHash("sha256")
      .update(`lead_rl:${clientIp}`)
      .digest("hex");

    const now = new Date();
    const windowEnd = new Date(Date.now() + RATE_LIMIT_WINDOW_SECONDS * 1000);

    // Upsert atômico no PostgreSQL: se expirado, reinicia janela; se ativo, incrementa
    const result = await sql`
      INSERT INTO rate_limits (key, count, reset_at)
      VALUES (${key}, 1, ${windowEnd.toISOString()})
      ON CONFLICT (key) DO UPDATE
      SET
        count = CASE
          WHEN rate_limits.reset_at < ${now.toISOString()} THEN 1
          ELSE rate_limits.count + 1
        END,
        reset_at = CASE
          WHEN rate_limits.reset_at < ${now.toISOString()} THEN ${windowEnd.toISOString()}
          ELSE rate_limits.reset_at
        END
      RETURNING count, reset_at;
    `;

    if (result && result.length > 0) {
      const currentCount = Number(result[0].count);
      if (currentCount > RATE_LIMIT_MAX_REQUESTS) {
        return { allowed: false, remaining: 0, status: "blocked" };
      }
      return {
        allowed: true,
        remaining: Math.max(0, RATE_LIMIT_MAX_REQUESTS - currentCount),
        status: "enforced",
      };
    }
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1, status: "enforced" };
  } catch (err: unknown) {
    const errMsg = (err as Error)?.message || "desconhecido";
    // Log explícito indicando que a persistência está DEGRADADA (tabela não criada no Neon)
    console.warn(
      `[RATE_LIMIT_DEGRADED] Tabela rate_limits inoperante no Neon (${errMsg}). ` +
      `Proteção de taxa persistente NÃO está sendo aplicada. Execute migrations/001_create_rate_limits.sql.`
    );
    // Retorna status 'degraded' explícito. A requisição não é bloqueada para não derrubar o cliente legítimo,
    // mas o sistema não declara a proteção como verificada ou ativa.
    return { allowed: true, remaining: 0, status: "degraded" };
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Limitar tamanho do payload
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_BYTES) {
      return NextResponse.json(
        { message: "Tamanho da requisição excede o limite permitido (32KB)" },
        { status: 413 }
      );
    }

    // 2. Extrair IP do cliente
    const forwarded = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const clientIp = forwarded?.split(",")[0]?.trim() || realIp || "127.0.0.1";

    // 3. Obter dados do body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { message: "Formato de dados inválido (JSON esperado)" },
        { status: 400 }
      );
    }

    // 4. Honeypot check antecipado
    if (body && typeof body === "object" && "hp_field" in body) {
      const hp = (body as Record<string, unknown>).hp_field;
      if (hp && typeof hp === "string" && hp.trim().length > 0) {
        // Honeypot disparado: responder com sucesso simulado para enganar bots
        return NextResponse.json({ ok: true, message: "Recebido com sucesso." });
      }
    }

    // 5. Validação com Zod
    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { message: firstIssue?.message || "Dados inválidos." },
        { status: 400 }
      );
    }

    const { name, whatsapp, email, niche, about } = parsed.data;

    // 6. Configuração do Neon e Rate Limiting persistente
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error("Configuração ausente: DATABASE_URL não definida");
      return NextResponse.json(
        { message: "Erro de configuração do servidor" },
        { status: 500 }
      );
    }

    // Rate limiting persistente
    const rateLimit = await checkPersistentRateLimit(databaseUrl, clientIp);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          message:
            "Muitas tentativas em pouco tempo. Por favor, aguarde alguns minutos antes de tentar novamente.",
        },
        { status: 429 }
      );
    }

    // 7. Persistência do lead no Neon
    const sql = neon(databaseUrl);
    await sql`
      INSERT INTO leads (name, whatsapp, email, niche, about, status)
      VALUES (
        ${name},
        ${sanitizePhone(whatsapp)},
        ${email ? email.toLowerCase() : null},
        ${niche},
        ${about || null},
        'new'
      )
    `;

    // 8. Notificação Resend com tratamento seguro de erros e HTML escaping
    try {
      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey) {
        const resend = new Resend(resendKey);
        const fromEmail = process.env.RESEND_FROM_EMAIL || "LP 48h <onboarding@resend.dev>";
        const toEmail = process.env.NOTIFICATION_EMAIL || "jadielindonesia84@gmail.com";

        const safeName = escapeHtml(name);
        const safeWhatsapp = escapeHtml(whatsapp);
        const safeEmail = email ? escapeHtml(email) : "—";
        const safeNiche = escapeHtml(niche);
        const safeAbout = about ? escapeHtml(about).replace(/\n/g, "<br>") : "—";

        const emailResult = await resend.emails.send({
          from: fromEmail,
          to: [toEmail],
          subject: `Novo lead — ${safeName} (${safeNiche})`,
          html: `
            <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #1e293b;">
              <h2 style="color: #1e40af;">Novo lead registrado</h2>
              <p style="font-size: 14px; color: #64748b;">Uma nova solicitação foi registrada no sistema.</p>
              <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
                <tr><td style="padding: 8px 0; color: #64748b; width: 120px;">Nome</td><td style="padding: 8px 0;"><strong>${safeName}</strong></td></tr>
                <tr><td style="padding: 8px 0; color: #64748b;">WhatsApp</td><td style="padding: 8px 0;"><strong>${safeWhatsapp}</strong></td></tr>
                <tr><td style="padding: 8px 0; color: #64748b;">E-mail</td><td style="padding: 8px 0;">${safeEmail}</td></tr>
                <tr><td style="padding: 8px 0; color: #64748b;">Nicho</td><td style="padding: 8px 0;"><strong>${safeNiche}</strong></td></tr>
                <tr><td style="padding: 8px 0; color: #64748b; vertical-align: top;">Sobre o negócio</td><td style="padding: 8px 0;">${safeAbout}</td></tr>
              </table>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
              <p style="font-size: 12px; color: #94a3b8;">
                Registro salvo no Neon · Notificação operacional LP 48h
              </p>
            </div>
          `,
        });

        if (emailResult.error) {
          // Log sem expor PII
          console.error("Resend API retornou erro:", {
            name: emailResult.error.name,
            message: emailResult.error.message,
          });
        }
      } else {
        // Log seguro informando que e-mail não está ativo no ambiente atual
        console.warn("RESEND_API_KEY não configurada. Notificação por e-mail ignorada.");
      }
    } catch (emailError: unknown) {
      // Tratar e registrar erros da API sem vazar dados pessoais
      console.error("Falha ao despachar e-mail pelo Resend:", (emailError as Error)?.message || "Erro desconhecido");
    }

    return NextResponse.json({
      ok: true,
      message: "Solicitação registrada com sucesso.",
      rateLimitStatus: rateLimit.status,
    });
  } catch (error: unknown) {
    // Tratar erro geral sem expor dados sensíveis
    console.error("Erro interno ao processar lead:", (error as Error)?.message || "Erro desconhecido");
    return NextResponse.json(
      { message: "Erro ao registrar solicitação. Tente novamente ou use o WhatsApp direto." },
      { status: 500 }
    );
  }
}
