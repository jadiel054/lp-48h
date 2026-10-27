import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { z } from "zod";
import { Resend } from "resend";

const leadSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  whatsapp: z.string().min(10, "WhatsApp inválido"),
  email: z.string().email().optional().or(z.literal("")),
  niche: z.string().min(2, "Informe o nicho"),
  about: z.string().max(5000, "Máximo de 5000 caracteres").optional().or(z.literal("")),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, whatsapp, email, niche, about } = parsed.data;

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error("DATABASE_URL não configurada");
      return NextResponse.json(
        { message: "Erro de configuração do servidor" },
        { status: 500 }
      );
    }

    const sql = neon(databaseUrl);

    await sql`
      INSERT INTO leads (name, whatsapp, email, niche, about, status)
      VALUES (${name}, ${whatsapp}, ${email || null}, ${niche}, ${about || null}, 'new')
    `;

    // Envia notificação por e-mail (não bloqueia o sucesso do lead se falhar)
    try {
      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey) {
        const resend = new Resend(resendKey);

        await resend.emails.send({
          from: "LP 48h <onboarding@resend.dev>",
          to: ["jadielindonesia84@gmail.com"],
          subject: `Novo lead — ${name} (${niche})`,
          html: `
            <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
              <h2 style="color: #1e40af;">Novo lead recebido</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #64748b;">Nome</td><td style="padding: 8px 0;"><strong>${name}</strong></td></tr>
                <tr><td style="padding: 8px 0; color: #64748b;">WhatsApp</td><td style="padding: 8px 0;"><strong>${whatsapp}</strong></td></tr>
                <tr><td style="padding: 8px 0; color: #64748b;">E-mail</td><td style="padding: 8px 0;">${email || "—"}</td></tr>
                <tr><td style="padding: 8px 0; color: #64748b;">Nicho</td><td style="padding: 8px 0;"><strong>${niche}</strong></td></tr>
                <tr><td style="padding: 8px 0; color: #64748b; vertical-align: top;">Sobre</td><td style="padding: 8px 0;">${about ? about.replace(/\n/g, "<br>") : "—"}</td></tr>
              </table>
              <p style="margin-top: 24px; color: #64748b; font-size: 14px;">
                Lead salvo no Neon · LP 48h
              </p>
            </div>
          `,
        });
      }
    } catch (emailError) {
      console.error("Erro ao enviar e-mail de notificação:", emailError);
      // Não falha o request por causa do e-mail
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao salvar lead:", error);
    return NextResponse.json(
      { message: "Erro interno. Tente novamente." },
      { status: 500 }
    );
  }
}