import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Landing Page Profissional em 48h | Página Pronta + WhatsApp + PIX",
  description:
    "Receba uma landing page responsiva de alta conversão entregue em até 2 dias úteis após recebimento dos materiais. Botão WhatsApp e opção PIX prontos. Pagamento após aprovação.",
  openGraph: {
    title: "Landing Page Profissional em 48h | LP 48h",
    description:
      "Landing page de alta conversão pronta para anúncios e Instagram em até 2 dias úteis. Pagamento somente após ver e aprovar o projeto no ar.",
    url: "https://lp-48h.vercel.app",
    siteName: "LP 48h",
    locale: "pt_BR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-blue-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
