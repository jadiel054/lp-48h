import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { z } from "zod";

const leadSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  whatsapp: z.string().min(10, "WhatsApp inválido"),
  email: z.string().email().optional().or(z.literal("")),
  niche: z.string().min(2, "Informe o nicho"),
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

    const { name, whatsapp, email, niche } = parsed.data;

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
      INSERT INTO leads (name, whatsapp, email, niche, status)
      VALUES (${name}, ${whatsapp}, ${email || null}, ${niche}, 'new')
    `;

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao salvar lead:", error);
    return NextResponse.json(
      { message: "Erro interno. Tente novamente." },
      { status: 500 }
    );
  }
}