import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade e LGPD | LP 48h",
  description:
    "Transparência sobre a coleta, armazenamento e tratamento de dados pessoais no serviço LP 48h, em conformidade com a LGPD.",
};

export default function PrivacidadePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="border-b border-slate-800 pb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-blue-400 hover:text-blue-300 mb-4 transition-colors"
          >
            ← Voltar para a página inicial
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Política de Privacidade e Proteção de Dados
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Última atualização: {new Date().toLocaleDateString("pt-BR")}
          </p>
        </div>

        <div className="rounded-xl bg-blue-950/40 border border-blue-800/50 p-4 text-sm text-blue-200">
          <strong>Aviso de transparência:</strong> Esta política foi elaborada com base nas diretrizes da Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD). Informamos que esta página não constitui parecer jurídico definitivo e reflete as práticas operacionais e de boa-fé adotadas para proteger a privacidade dos seus dados.
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">1. Finalidade da Coleta de Dados</h2>
          <p className="text-slate-300 leading-relaxed">
            Coletamos apenas as informações estritamente necessárias para viabilizar a prestação de serviços do projeto <strong>LP 48h</strong>.
          </p>
          <p className="text-slate-300 leading-relaxed">
            Os dados fornecidos por meio do formulário de contato têm as seguintes finalidades exclusivas:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-300 pl-2">
            <li>Entrar em contato para apresentação da proposta e esclarecimento de dúvidas sobre a criação da sua Landing Page.</li>
            <li>Compreender o nicho e as necessidades do seu negócio para elaboração do briefing e do modelo inicial.</li>
            <li>Enviar links de acompanhamento e o resultado final da página desenvolvida.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">2. Dados Pessoais Coletados</h2>
          <p className="text-slate-300 leading-relaxed">
            Ao utilizar o formulário presente em nossa landing page, coletamos:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-300 pl-2">
            <li><strong>Nome:</strong> para identificação no atendimento e personalização do projeto.</li>
            <li><strong>WhatsApp (telefone com DDD):</strong> meio principal de comunicação rápida, envio de atualizações e suporte.</li>
            <li><strong>E-mail (opcional):</strong> meio secundário de comunicação e envio de comprovantes ou acessos.</li>
            <li><strong>Nicho e informações sobre o negócio:</strong> dados contextuais para a estruturação do layout e copy da sua landing page.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">3. Armazenamento e Segurança</h2>
          <p className="text-slate-300 leading-relaxed">
            Seus dados são armazenados de forma segura em banco de dados hospedado no <strong>Neon</strong> (PostgreSQL serverless em nuvem com criptografia em trânsito e repouso).
          </p>
          <p className="text-slate-300 leading-relaxed">
            Implementamos salvaguardas técnicas como hashes criptográficos para limitação de taxa de requisições (rate limiting), validação e sanitização estrita de dados para prevenir injeções de código ou acessos não autorizados.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">4. Compartilhamento com Provedores de Serviço</h2>
          <p className="text-slate-300 leading-relaxed">
            Nós <strong>não vendemos, alugamos ou comercializamos</strong> seus dados pessoais com terceiros para fins de marketing. O compartilhamento ocorre exclusivamente com os provedores de infraestrutura necessários para a operação do serviço:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-300 pl-2">
            <li><strong>Vercel:</strong> hospedagem e execução da aplicação web.</li>
            <li><strong>Neon Database:</strong> banco de dados para armazenamento persistente das solicitações.</li>
            <li><strong>Resend:</strong> envio transacional de notificações operacionais para a equipe responsável.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">5. Direitos do Titular de Dados</h2>
          <p className="text-slate-300 leading-relaxed">
            De acordo com o artigo 18 da LGPD, você possui o direito de:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-300 pl-2">
            <li>Confirmar a existência de tratamento de seus dados.</li>
            <li>Acessar seus dados pessoais sob nossa guarda.</li>
            <li>Solicitar a correção de dados incompletos, inexatos ou desatualizados.</li>
            <li>Solicitar a eliminação dos dados tratados com base em seu consentimento.</li>
            <li>Revogar o seu consentimento a qualquer momento.</li>
          </ul>
          <p className="text-slate-300 leading-relaxed">
            Para exercer qualquer um destes direitos, basta nos contatar via WhatsApp oficial no número <strong>(49) 99994-0482</strong> ou pelo e-mail <strong>jadielindonesia84@gmail.com</strong> com a mensagem informando a solicitação de privacidade.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">6. Consentimento</h2>
          <p className="text-slate-300 leading-relaxed">
            Ao marcar a caixa de consentimento e enviar o formulário, você declara ter lido esta política e concorda expressamente com o tratamento dos dados informados para a finalidade de atendimento e orçamento do serviço <strong>LP 48h</strong>.
          </p>
        </section>

        <div className="pt-8 border-t border-slate-800 text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors"
          >
            Retornar ao formulário
          </Link>
        </div>
      </div>
    </main>
  );
}
