import { z } from "zod";

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function sanitizePhone(raw: string): string {
  return raw.replace(/\D/g, "");
}

export function isValidBRPhone(raw: string): boolean {
  const digits = sanitizePhone(raw);
  // Aceita 10 dígitos (fixo/móvel antigo) ou 11 dígitos (celular) ou com código 55 (12 ou 13 dígitos)
  if (digits.length === 10 || digits.length === 11) {
    const ddd = parseInt(digits.slice(0, 2), 10);
    return ddd >= 11 && ddd <= 99;
  }
  if (digits.length === 12 || digits.length === 13) {
    if (digits.startsWith("55")) {
      const ddd = parseInt(digits.slice(2, 4), 10);
      return ddd >= 11 && ddd <= 99;
    }
  }
  return false;
}

export const leadSchema = z.object({
  name: z
    .string({ required_error: "Nome é obrigatório" })
    .trim()
    .min(2, "Nome muito curto")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  whatsapp: z
    .string({ required_error: "WhatsApp é obrigatório" })
    .trim()
    .refine((val) => isValidBRPhone(val), {
      message: "Número de WhatsApp inválido com DDD (ex: 11 99999-9999)",
    }),
  email: z
    .string()
    .trim()
    .max(255, "E-mail muito longo")
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || z.string().email().safeParse(val).success, {
      message: "E-mail inválido",
    }),
  niche: z
    .string({ required_error: "Informe o nicho" })
    .trim()
    .min(2, "Nicho muito curto")
    .max(100, "Nicho inválido"),
  about: z
    .string()
    .trim()
    .max(5000, "Máximo de 5000 caracteres")
    .optional()
    .or(z.literal("")),
  consent: z
    .boolean({
      required_error: "O consentimento com a Política de Privacidade é obrigatório",
    })
    .refine((val) => val === true, {
      message: "Você deve aceitar a Política de Privacidade para continuar",
    }),
  // Campo honeypot (deve vir vazio de usuários humanos)
  hp_field: z.string().max(0, "Submissão rejeitada").optional().or(z.literal("")),
});
