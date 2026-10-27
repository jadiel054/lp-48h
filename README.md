# LP 48h — Landing Page de Alta Conversão em 48 horas

MVP do serviço productizado de Landing Page pronta em 48h + PIX + WhatsApp.

## Stack

- Next.js 14 (App Router)
- Tailwind CSS
- Neon (PostgreSQL serverless)
- Deploy na Vercel

## Setup local

```bash
npm install
cp .env.example .env.local
# preencha DATABASE_URL com a connection string do projeto lp-48h-mvp no Neon
npm run dev
```

## Tabelas no Neon

Já criadas:
- `leads`
- `orders`

## Deploy

O projeto está preparado para deploy automático na Vercel. Basta conectar o repositório e adicionar a variável de ambiente `DATABASE_URL`.
