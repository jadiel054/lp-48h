import assert from "node:assert/strict";
import test from "node:test";
import { escapeHtml, leadSchema } from "../app/lib/lead-validation.ts";

test("API Leads: escapeHtml sanitiza todos os caracteres perigosos", () => {
  const input = `<script>alert("XSS")</script>&'test'`;
  const escaped = escapeHtml(input);
  assert.equal(
    escaped,
    "&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;&amp;&#039;test&#039;"
  );
  assert.ok(!escaped.includes("<"));
  assert.ok(!escaped.includes(">"));
  assert.ok(!escaped.includes('"'));
  assert.ok(!escaped.includes("'"));
});

test("API Leads: leadSchema aceita leads válidos", () => {
  const validLead = {
    name: "Jadiel Teste",
    whatsapp: "(49) 99994-0482",
    email: "cliente@teste.com",
    niche: "Arquitetura",
    about: "Projetos residenciais modernos",
    consent: true,
    hp_field: "",
  };

  const parsed = leadSchema.safeParse(validLead);
  assert.equal(parsed.success, true);
  if (parsed.success) {
    assert.equal(parsed.data.name, "Jadiel Teste");
    assert.equal(parsed.data.consent, true);
  }
});

test("API Leads: leadSchema aceita e-mail opcional vazio", () => {
  const validLead = {
    name: "Jadiel Sem Email",
    whatsapp: "49999940482",
    email: "",
    niche: "Consultoria",
    consent: true,
    hp_field: "",
  };

  const parsed = leadSchema.safeParse(validLead);
  assert.equal(parsed.success, true);
});

test("API Leads: leadSchema rejeita telefone inválido", () => {
  const invalidPhones = ["123", "0000000000", "(01) 99999-9999", "abc"];
  for (const phone of invalidPhones) {
    const res = leadSchema.safeParse({
      name: "Teste",
      whatsapp: phone,
      niche: "Consultoria",
      consent: true,
      hp_field: "",
    });
    assert.equal(res.success, false, `Telefone ${phone} deveria ter sido rejeitado`);
  }
});

test("API Leads: leadSchema rejeita e-mail com formato inválido", () => {
  const res = leadSchema.safeParse({
    name: "Teste",
    whatsapp: "(49) 99994-0482",
    email: "invalido@@email..com",
    niche: "Consultoria",
    consent: true,
    hp_field: "",
  });
  assert.equal(res.success, false);
});

test("API Leads: leadSchema exige consentimento explícito LGPD", () => {
  const res = leadSchema.safeParse({
    name: "Teste Sem Consentimento",
    whatsapp: "(49) 99994-0482",
    niche: "Consultoria",
    consent: false,
    hp_field: "",
  });
  assert.equal(res.success, false);
  assert.match(res.error.issues[0].message, /Política de Privacidade/i);
});

test("API Leads: leadSchema rejeita honeypot preenchido", () => {
  const res = leadSchema.safeParse({
    name: "Spam Bot",
    whatsapp: "(49) 99994-0482",
    niche: "Consultoria",
    consent: true,
    hp_field: "http://spam-link.com",
  });
  assert.equal(res.success, false);
});

test("API Leads: leadSchema rejeita texto 'about' com mais de 5000 caracteres", () => {
  const res = leadSchema.safeParse({
    name: "Texto Longo",
    whatsapp: "(49) 99994-0482",
    niche: "Consultoria",
    consent: true,
    about: "A".repeat(5001),
    hp_field: "",
  });
  assert.equal(res.success, false);
  assert.match(res.error.issues[0].message, /5000/);
});
