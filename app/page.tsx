"use client";

import { useState, useMemo } from "react";

/** WhatsApp comercial — (49) 99994-0482 */
const WA_E164 = "5549999940482";
const WA_DISPLAY = "(49) 99994-0482";
const PIX_KEY = "49999940482";
const PRICE = "R$ 1.497";

const WA_LINK =
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
      "Eu monto a página primeiro. Você recebe o link, avalia o resultado no ar e só faz o PIX se gostar. Risco zero para você. Chave PIX: o mesmo número do WhatsApp.",
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
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Algo deu errado. Tente novamente.";
      setError(message);
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

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#formulario"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
            >
              Quero minha Landing Page em 48h
            </a>
            <a
              href={WA_LINK}
              target="_blank"
 transitivity="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-green-600 hover:bg-green-500 rounded-xl shadow-lg shadow-green-600/30 transition-all hover:scale-105"
            >
              <span aria-hidden>💬</span> Falar no WhatsApp
            </a>
          </div>

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
                Design pensado para gerar leads e vendas, não só para &quot;ficar bonito&quot;.
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
                <h3 className="text-xl font-semibold text-white mb-1">Você preenche o formulário ou chama no WhatsApp</h3>
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
                <h3 className="text-xl font-semibold text-white mb-1">Você aprova e só então paga no PIX</h3>
                <p className="text-slate-400">
                  Viu o resultado no ar? Gostou? Aí sim faz o PIX de {PRICE}. Risco zero para você.
                </p>
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
            <div className="text-5xl font-bold text-white mb-2">{PRICE}</div>
            <p className="text-slate-400 mb-3">Pagamento único · Entrega em 48h · 1 revisão inclusa</p>
            <p className="text-sm text-green-400 font-medium">
              Você só paga depois de ver a página no ar e aprovar o resultado
            </p>
          </div>

          {success ? (
            <div className="p-8 rounded-2xl bg-green-500/10 border border-green-500/30 text-center space-y-4">
              <div className="text-4xl">✅</div>
              <h3 className="text-xl font-semibold text-green-300">Recebemos seu pedido!</h3>
              <p className="text-slate-300">
                Em breve você recebe uma mensagem no WhatsApp. Se preferir, chame agora:
              </p>
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold"
              >
                Abrir WhatsApp {WA_DISPLAY}
              </a>
              <p className="text-xs text-slate-500 pt-2">
                Pagamento só após você aprovar a página · PIX: {PIX_KEY}
              </p>
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

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Conte mais sobre o seu negócio (opcional)
                </label>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-900 border text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y ${
                    aboutExceeded ? "border-red-500" : "border-slate-600"
                  }`}
                  placeholder="Ex: principais serviços, diferencial, público-alvo..."
                />
                <div
                  className={`text-right text-xs mt-1 ${
                    aboutExceeded ? "text-red-400" : "text-slate-500"
                  }`}
                >
                  {aboutLength}/5000
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

              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-3 rounded-xl border border-green-500/40 text-green-300 hover:bg-green-500/10 font-medium"
              >
                Prefiro falar no WhatsApp agora
              </a>

              <p className="text-center text-xs text-slate-500">
                Ao enviar você concorda em ser contactado via WhatsApp sobre este serviço.
              </p>
            </form>
          )}

          {/* PIX info card */}
          <div className="mt-8 p-5 rounded-2xl bg-slate-800/40 border border-slate-700/50 text-center">
            <p className="text-sm text-slate-400 mb-1">Pagamento após aprovação · PIX</p>
            <p className="text-lg font-mono font-semibold text-white tracking-wide">{PIX_KEY}</p>
            <p className="text-xs text-slate-500 mt-2">Mesma chave do WhatsApp · {WA_DISPLAY}</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
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

      <footer className="py-10 border-t border-slate-800 text-center text-slate-500 text-sm space-y-2">
        <p>Landing Page em 48h · Entrega rápida · Você só paga depois de aprovar</p>
        <a href={WA_LINK} className="text-green-400 hover:text-green-300" target="_blank" rel="noopener noreferrer">
          WhatsApp {WA_DISPLAY}
        </a>
      </footer>

      {/* Floating WhatsApp */}
      <a
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 text-white shadow-lg shadow-green-600/50 transition-all hover:scale-110 active:scale-95"
        aria-label="WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </main>
  );
}
