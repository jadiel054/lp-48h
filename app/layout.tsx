import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Landing Page em 48h | Página pronta + PIX + WhatsApp",
  description:
    "Receba uma landing page de alta conversão pronta em até 48 horas. Botão PIX e WhatsApp já configurados. Ideal para pequenos negócios e profissionais liberais.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}