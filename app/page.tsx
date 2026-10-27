"use client";

import { useState, useMemo } from "react";

const faqs = [
  {
    question: "Funciona para qualquer nicho?",
    answer:
      "Sim. O modelo funciona especialmente bem para serviços locais, profissionais liberais e negócios que vendem por WhatsApp ou anúncio (clínicas, salões, reformas, estética, advocacia, etc.).",
  },
  {
    question: "Preciso ter domínio?",
    answer:
      "Não é obrigatório. Podemos entregar em um link .vercel.app ou você aponta o seu domínio depois.",
  },
  {
    question: "Posso pedir alterações depois?",
    answer:
      "Sim. Está inclusa 1 rodada de revisão. Alterações extras podem ser combinadas à parte.",
  },
  {
    question: "Como funciona o pagamento?",
    answer:
      "Eu monto a página primeiro. Você recebe o link, avalia o resultado no ar e só faz o PIX se gostar. Risco zero para você.",
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
      setError("Selecione um nicho");
      setLoading(false);
      return;
    }

    if (aboutExceeded) {
      setError("O campo sobre o negócio ultrapassou 5000 caracteres");
      setLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      whatsapp: formData.get("whatsapp") as string,
      email: formData.get("email") as string,
      niche: selectedNiche,
      about: about,
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Erro ao enviar");
      }

      setSuccess(true);
      (e.target as HTMLFormElement).reset();
      setSelectedNiche("");
      setNicheSearch("");
      setAbout("");
    } catch (err: any) {
      setError(err.message || "Algo deu errado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
        <div className="relative max-w-5xl mx-auto px-4 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-sm font-medium rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Entrega garantida em até 48 horas
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Landing Page pronta em{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              48 horas
            </span>
            <br />
            + botão PIX + WhatsApp
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            Pare de perder clientes todos os dias porque não tem uma página profissional.
            Eu entrego uma landing page de alta conversão pronta para rodar anúncio
            ou WhatsApp em até 2 dias úteis.
          </p>

          <a
            href="#formulario"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
          >
            Quero minha Landing Page em 48h
          </a>

          <p className="mt-6 text-sm text-slate-400">
            Sem mensalidade · Sem contrato longo · Você só paga depois de ver o resultado
          </p>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            O que você recebe
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 text-2xl mb-4">
                ⚡
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Entrega em 48h</h3>
              <p className="text-slate-400">
                Você preenche o briefing e em até 2 dias úteis a página está no ar.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-green-500/10 text-green-400 text-2xl mb-4">
                💳
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">PIX + WhatsApp prontos</h3>
              <p className="text-slate-400">
                Botão de pagamento PIX e link direto pro seu WhatsApp já configurados.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 text-2xl mb-4">
                🎯
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Foco em conversão</h3>
              <p className="text-slate-400">
                Design pensado para gerar leads e vendas, não só para "ficar bonito".
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Como funciona</h2>
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">1</div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">Você preenche o formulário</h3>
                <p className="text-slate-400">Conta o básico do seu negócio (nicho, oferta principal e WhatsApp).</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">2</div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">Eu monto a página em até 48h</h3>
                <p className="text-slate-400">Você recebe o link da página pronta para avaliar.</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">3</div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">Você aprova e só então paga</h3>
                <p className="text-slate-400">Viu o resultado no ar? Gostou? Aí sim faz o PIX. Risco zero para você.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preço + Formulário */}
      <section id="formulario" className="py-20 bg-slate-900/50">
        <div className="max-w-xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-3">Investimento</h2>
            <div className="text-5xl font-bold text-white mb-2">R$ 1.497</div>
            <p className="text-slate-400 mb-3">Pagamento único · Entrega em 48h · 1 revisão inclusa</p>
            <p className="text-sm text-green-400 font-medium">
              Você só paga depois de ver a página no ar e aprovar o resultado
            </p>
          </div>

          {success ? (
            <div className="p-8 rounded-2xl bg-green-500/10 border border-green-500/30 text-center">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-semibold text-green-300 mb-2">Recebemos seu pedido!</h3>
              <p className="text-slate-300">Em breve você recebe uma mensagem no WhatsApp com o próximo passo.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-slate-800/60 border border-slate-700/50 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Seu nome</label>
                <input
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Como você se chama?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">WhatsApp (com DDD)</label>
                <input
                  name="whatsapp"
                  required
                  type="tel"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="11 99999-9999"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">E-mail (opcional)</label>
                <input
                  name="email"
                  type="email"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="seu@email.com"
                />
              </div>

              {/* Nicho com busca */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Qual o seu nicho?</label>
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
                  placeholder="Digite ou selecione o nicho..."
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

              {/* Sobre o negócio */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Conte mais sobre o seu negócio / ideal (opcional)
                </label>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-900 border text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y ${
                    aboutExceeded ? "border-red-500" : "border-slate-600"
                  }`}
                  placeholder="Ex: principais serviços, diferencial, público-alvo, o que você quer destacar na página..."
                />
                <div className={`text-right text-xs mt-1 ${
                  aboutExceeded ? "text-red-400" : "text-slate-500"
                }`}>
                  {aboutLength}/5000
                  {aboutExceeded && " — Limite de caracteres ultrapassado"}
                </div>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading || aboutExceeded}
                className="w-full py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold text-lg transition-colors"
              >
                {loading ? "Enviando..." : "Quero minha Landing Page em 48h"}
              </button>

              <p className="text-center text-xs text-slate-500">
                Ao enviar você concorda em ser contactado via WhatsApp sobre este serviço.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* FAQ Accordion */}
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
                {openFaq === index && (
                  <div className="px-5 pb-4 text-slate-400 leading-relaxed">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-slate-800 text-center text-slate-500 text-sm">
        <p>Landing Page em 48h · Entrega rápida · Você só paga depois de aprovar</p>
      </footer>

      {/* Floating round CTA */}
      <a
        href="#formulario"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/50 transition-all hover:scale-110 active:scale-95"
        aria-label="Quero minha Landing Page em 48h"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" clipRule="evenodd" />
        </svg>
      </a>
    </main>
  );
}