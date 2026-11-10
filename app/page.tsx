"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

/** WhatsApp comercial — (49) 99994-0482 */
const WA_E164 = "5549999940482";
const WA_DISPLAY = "(49) 99994-0482";
const PIX_KEY = "49999940482";
const PRICE = "R$ 1.497";

const WA_DEFAULT_LINK =
  `https://wa.me/${WA_E164}?text=` +
  encodeURIComponent(
    "Olá! Quero uma Landing Page em 48h. Pode me explicar o próximo passo?"
  );

const faqs = [
  {
    question: "Funciona para qualquer nicho?",
    answer:
      "Sim. O modelo funciona especialmente bem para serviços locais, profissionais liberais e negócios que vendem por WhatsApp ou anúncio (clínicas, salões, reformas, estética, advocacia, etc.).",
  },
  {
    question: "Preciso ter domínio registrado?",
    answer:
      "Não é obrigatório para começar. Sua landing page é entregue e publicada de imediato em um link de demonstração funcional (.vercel.app). Se você já possuir ou adquirir um domínio próprio (.com.br ou .com), orientamos como realizar o apontamento de DNS.",
  },
  {
    question: "O que está incluído no valor de R$ 1.497?",
    answer:
      "Está inclusa a criação de 1 landing page completa e responsiva (mobile e desktop), botão direto para seu WhatsApp, configuração da chave ou QR Code PIX acordada, 1 rodada de revisão de ajustes e a entrega do link pronto no ar. Não estão inclusos custos com compra de domínio próprio, serviços de anúncios ou integrações externas não acordadas.",
  },
  {
    question: "Como funciona o prazo de 48 horas?",
    answer:
      "O prazo é de até 2 dias úteis, contados a partir do momento em que recebemos e aprovamos todos os materiais e informações necessárias do briefing (textos base, dados de contato e fotos).",
  },
  {
    question: "Como funciona o pagamento após a aprovação?",
    answer:
      "Desenvolvemos a sua página primeiro. Você recebe o link funcional, avalia o layout e o funcionamento online e só realiza a transferência via PIX após aprovar o projeto entregue.",
  },
];

const NICHES = [
  "Advocacia",
  "Arquitetura",
  "Autopeças",
  "Barbearia",
  "Café / Cafeteria",
  "Clínica de Estética",
  "Clínica Médica",
  "Clínica Odontológica",
  "Construção Civil",
  "Consultoria",
  "Contabilidade",
  "Corretora de Imóveis",
  "Corretora de Seguros",
  "Cursos Online",
  "Delivery / Restaurante",
  "Educação / Escola",
  "Eletricista",
  "Encanador",
  "Estética / Beleza",
  "Farmácia",
  "Fisioterapia",
  "Fotografia",
  "Gás / Água",
  "Gestão de Tráfego",
  "Hotel / Pousada",
  "Informática / TI",
  "Jardinagem",
  "Lavanderia",
  "Loja de Roupas",
  "Manicure / Pedicure",
  "Marketing Digital",
  "Mecânica / Oficina",
  "Nutrição",
  "Padaria",
  "Personal Trainer",
  "Pet Shop",
  "Pintura",
  "Podologia",
  "Psicologia",
  "Reformas em Geral",
  "Salão de Beleza",
  "Serralheria",
  "Serviços Domésticos",
  "Software / SaaS",
  "Tapete / Carpetes",
  "Veterinária",
  "Vidraçaria",
  "Outro",
].sort((a, b) => a.localeCompare(b, "pt-BR"));

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [nicheSearch, setNicheSearch] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("");
  const [showNicheList, setShowNicheList] = useState(false);
  const [about, setAbout] = useState("");
  const [consent, setConsent] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<{
    name: string;
    niche: string;
  } | null>(null);

  const filteredNiches = useMemo(() => {
    if (!nicheSearch.trim()) return NICHES;
    return NICHES.filter((n) =>
      n.toLowerCase().includes(nicheSearch.toLowerCase())
    );
  }, [nicheSearch]);

  const aboutLength = about.length;
  const aboutExceeded = aboutLength > 5000;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!selectedNiche) {
      setError("Por favor, selecione um nicho da lista.");
      setLoading(false);
      return;
    }

    if (aboutExceeded) {
      setError("O campo sobre o negócio ultrapassou 5000 caracteres.");
      setLoading(false);
      return;
    }

    if (!consent) {
      setError("Você precisa concordar com a Política de Privacidade para enviar o formulário.");
      setLoading(false);
      return;
    }

    const formEl = e.currentTarget;
    const formData = new FormData(formEl);

    const data = {
      name: (formData.get("name") as string)?.trim(),
      whatsapp: (formData.get("whatsapp") as string)?.trim(),
      email: (formData.get("email") as string)?.trim() || "",
      niche: selectedNiche,
      about: about.trim(),
      consent: consent,
      hp_field: (formData.get("hp_field") as string) || "",
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.message || "Erro ao registrar solicitação.");
      }

      setSubmittedLead({
        name: data.name,
        niche: data.niche,
      });
      setSuccess(true);
      formEl.reset();
      setSelectedNiche("");
      setNicheSearch("");
      setAbout("");
      setConsent(false);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Algo deu errado. Tente novamente ou use o WhatsApp.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  // Gera link personalizado para o lead iniciar a conversa manualmente após envio
  const successWaLink = useMemo(() => {
    if (!submittedLead) return WA_DEFAULT_LINK;
    const msg = `Olá! Acabei de registrar meu pedido de Landing Page pelo site.\nNome: ${submittedLead.name}\nNicho: ${submittedLead.niche}\nPodemos conversar sobre o projeto?`;
    return `https://wa.me/${WA_E164}?text=` + encodeURIComponent(msg);
  }, [submittedLead]);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
        <div className="relative max-w-5xl mx-auto px-4 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-sm font-medium rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Entrega em até 2 dias úteis após envio dos materiais
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Landing Page profissional em{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              48 horas
            </span>
            <br />
            + botão PIX + WhatsApp
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Pare de perder clientes por falta de uma página estruturada. Receba uma landing page responsiva, rápida e pronta para campanhas de anúncios ou divulgação no Instagram em até 2 dias úteis após a aprovação do briefing.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#formulario"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
            >
              Quero solicitar minha Landing Page
            </a>
            <a
              href={WA_DEFAULT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-green-600 hover:bg-green-500 rounded-xl shadow-lg shadow-green-600/30 transition-all hover:scale-105"
            >
              <span aria-hidden>💬</span> Falar no WhatsApp
            </a>
          </div>

          <p className="mt-6 text-sm text-slate-400">
            Sem mensalidade recorrente · Sem fidelidade · Você só paga após aprovar a página no ar
          </p>
        </div>
      </section>

      {/* O que está incluído */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">O que está incluído no pacote</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
              Transparência completa: saiba exatamente o que você recebe pelo investimento único de {PRICE}.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 text-2xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold text-white mb-2">Página 100% Responsiva</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Estrutura otimizada para smartphones e computadores, com carregamento rápido e design profissional voltado para conversão.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-green-500/10 text-green-400 text-2xl mb-4">💳</div>
                <h3 className="text-xl font-semibold text-white mb-2">WhatsApp + Opção PIX</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Botão de contato direto com mensagem personalizada e integração da opção PIX acordada (chave ou QR Code) para facilitar pagamentos.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 text-2xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-white mb-2">1 Revisão + Link no Ar</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Publicação do link funcional e 1 rodada de revisão completa para ajustar textos, fotos e detalhes antes da sua aprovação final.
                </p>
              </div>
            </div>
          </div>

          {/* Limites do serviço */}
          <div className="mt-10 p-6 rounded-2xl bg-slate-800/30 border border-slate-700/40 text-sm text-slate-400 leading-relaxed">
            <strong className="text-slate-200 block mb-1">Limites do serviço e escopo técnico:</strong>
            A entrega inclui a hospedagem no subdomínio Vercel. Não estão inclusos: taxas de registro ou compra de domínio próprio (ex: Registro.br), gerenciamento de campanhas de tráfego pago, criação de identidade visual do zero (logo) ou integrações com sistemas externos complexos. Se você desejar apontar um domínio próprio, fornecemos as orientações de DNS.
          </div>
        </div>
      </section>

      {/* Modelo Demonstrativo */}
      <section className="py-16 border-t border-b border-slate-800/70 bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800 mb-3">
            Modelo Demonstrativo
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Exemplo demonstrativo de estrutura
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto mb-6">
            Esta própria página é um exemplo demonstrativo da velocidade de carregamento, clareza das seções e responsividade que aplicamos ao seu nicho. Cada projeto é adaptado com a identidade, cores e informações fornecidas pelo cliente.
          </p>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Como funciona o processo</h2>
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">1</div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">Briefing e envio de informações</h3>
                <p className="text-slate-400">Você preenche o formulário ou envia os dados pelo WhatsApp (nicho, serviços principais, contato e fotos).</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">2</div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">Desenvolvimento em até 2 dias úteis</h3>
                <p className="text-slate-400">O prazo de até 48h úteis se inicia após a confirmação e aprovação do recebimento de todos os materiais necessários.</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">3</div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">Avaliação e pagamento após aprovação</h3>
                <p className="text-slate-400">Você acessa o link publicado, avalia o resultado online e, após a aprovação final com a revisão inclusa, realiza o pagamento de {PRICE} via PIX.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Formulário */}
      <section id="formulario" className="py-20 bg-slate-900/50">
        <div className="max-w-xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-3">Investimento</h2>
            <div className="text-5xl font-bold text-white mb-2">{PRICE}</div>
            <p className="text-slate-400 mb-3">Pagamento único · Entrega em até 2 dias úteis · 1 rodada de revisão inclusa</p>
            <p className="text-sm text-green-400 font-medium">
              Pagamento realizado após você avaliar a página publicada e aprovar o resultado
            </p>
          </div>

          {success ? (
            <div className="p-8 rounded-2xl bg-green-500/10 border border-green-500/30 text-center space-y-4">
              <div className="text-4xl">✅</div>
              <h3 className="text-xl font-semibold text-green-300">Solicitação registrada com sucesso!</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Seus dados foram recebidos. Para agilizar o atendimento e combinarmos os detalhes do seu projeto agora mesmo, clique no botão abaixo para iniciar a conversa:
              </p>
              <div className="pt-2">
                <a
                  href={successWaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold shadow-lg shadow-green-600/30 transition-all hover:scale-105"
                >
                  <span aria-hidden>💬</span> Iniciar conversa no WhatsApp agora
                </a>
              </div>
              <p className="text-xs text-slate-400 pt-2">
                Número oficial de atendimento: {WA_DISPLAY} · Pagamento após aprovação via PIX ({PIX_KEY})
              </p>
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="text-xs text-blue-400 hover:text-blue-300 underline pt-2 block mx-auto"
              >
                Enviar outra solicitação
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-slate-800/60 border border-slate-700/50 space-y-5">
              {/* Campo Honeypot para proteção contra robôs (oculto para humanos) */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="hp_field">Não preencha este campo</label>
                <input
                  type="text"
                  id="hp_field"
                  name="hp_field"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Seu nome *</label>
                <input
                  name="name"
                  required
                  maxLength={100}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Como você se chama?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">WhatsApp com DDD *</label>
                <input
                  name="whatsapp"
                  required
                  type="tel"
                  maxLength={20}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: (49) 99994-0482"
                />
                <span className="text-xs text-slate-400 mt-1 block">Insira o DDD e número (celular com 9 dígitos).</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">E-mail (opcional)</label>
                <input
                  name="email"
                  type="email"
                  maxLength={255}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="seu@email.com"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Qual o seu nicho? *</label>
                <input
                  type="text"
                  value={selectedNiche || nicheSearch}
                  onChange={(e) => {
                    setNicheSearch(e.target.value);
                    setSelectedNiche("");
                    setShowNicheList(true);
                  }}
                  onFocus={() => setShowNicheList(true)}
                  onBlur={() => setTimeout(() => setShowNicheList(false), 200)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Selecione ou busque o nicho..."
                  autoComplete="off"
                />
                {showNicheList && (
                  <div className="absolute z-20 w-full mt-1 max-h-56 overflow-y-auto rounded-xl bg-slate-900 border border-slate-600 shadow-xl">
                    {filteredNiches.length === 0 ? (
                      <div className="px-4 py-3 text-slate-400 text-sm">Nenhum nicho encontrado</div>
                    ) : (
                      filteredNiches.map((niche) => (
                        <button
                          key={niche}
                          type="button"
                          onMouseDown={() => {
                            setSelectedNiche(niche);
                            setNicheSearch(niche);
                            setShowNicheList(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-slate-200 hover:bg-blue-600/30 transition-colors"
                        >
                          {niche}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Conte mais sobre o seu negócio (opcional)</label>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  rows={4}
                  maxLength={5000}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-900 border text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y ${aboutExceeded ? "border-red-500" : "border-slate-600"}`}
                  placeholder="Ex: serviços prestados, região de atendimento, principais diferenciais..."
                />
                <div className={`text-right text-xs mt-1 ${aboutExceeded ? "text-red-400" : "text-slate-500"}`}>{aboutLength}/5000</div>
              </div>

              {/* Consentimento LGPD */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    required
                    className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
                  />
                  <span className="text-xs text-slate-300 leading-relaxed">
                    Concordo com a coleta e tratamento dos meus dados para fins de contato e elaboração da proposta de Landing Page, conforme a{" "}
                    <Link
                      href="/privacidade"
                      target="_blank"
                      className="text-blue-400 hover:text-blue-300 underline font-medium"
                    >
                      Política de Privacidade (LGPD)
                    </Link>
                    .
                  </span>
                </label>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading || aboutExceeded || !consent}
                className="w-full py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold text-lg transition-colors shadow-lg shadow-blue-600/30"
              >
                {loading ? "Registrando solicitação..." : "Quero minha Landing Page em 48h"}
              </button>

              <a
                href={WA_DEFAULT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-3 rounded-xl border border-green-500/40 text-green-300 hover:bg-green-500/10 font-medium transition-colors"
              >
                Prefiro falar no WhatsApp agora
              </a>
            </form>
          )}

          <div className="mt-8 p-5 rounded-2xl bg-slate-800/40 border border-slate-700/50 text-center">
            <p className="text-sm text-slate-400 mb-1">Pagamento após aprovação · PIX</p>
            <p className="text-lg font-mono font-semibold text-white tracking-wide">{PIX_KEY}</p>
            <p className="text-xs text-slate-500 mt-2">Mesma chave do WhatsApp · {WA_DISPLAY}</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Perguntas frequentes</h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="rounded-xl border border-slate-700/60 bg-slate-800/40 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="font-semibold text-white pr-4">{faq.question}</span>
                  <span className="text-slate-400 text-xl flex-shrink-0">{openFaq === index ? "−" : "+"}</span>
                </button>
                {openFaq === index && <div className="px-5 pb-4 text-slate-400 leading-relaxed text-sm sm:text-base">{faq.answer}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-slate-800 text-center text-slate-500 text-sm space-y-3 px-4">
        <p>LP 48h · Landing Page responsiva em até 2 dias úteis após recebimento dos materiais.</p>
        <div className="flex flex-wrap justify-center items-center gap-4 text-xs">
          <Link href="/privacidade" className="text-slate-400 hover:text-white underline">
            Política de Privacidade (LGPD)
          </Link>
          <span>·</span>
          <a
            href={WA_DEFAULT_LINK}
            className="text-green-400 hover:text-green-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp {WA_DISPLAY}
          </a>
        </div>
        <p className="text-xs text-slate-600">
          Pagamento condicionado à aprovação do projeto online. Chave PIX: {PIX_KEY}
        </p>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href={WA_DEFAULT_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 text-white shadow-lg shadow-green-600/50 transition-all hover:scale-110 active:scale-95"
        aria-label="Atendimento no WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </main>
  );
}
