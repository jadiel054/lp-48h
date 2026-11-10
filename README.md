# LP 48h — Landing Page de Alta Conversão em 48 horas

MVP do serviço productizado de Landing Page pronta em 48h + PIX + WhatsApp.

## Stack

- Next.js 14 (App Router)
- Tailwind CSS
- Neon (PostgreSQL serverless)
- Resend (E-mail transacional)
- Deploy na Vercel

## Setup local

```bash
npm install
cp .env.example .env.local
# preencha DATABASE_URL com a connection string do projeto lp-48h-mvp no Neon
npm run dev
```

## Banco de Dados no Neon

Tabelas existentes no banco `neondb` (projeto `lp-48h-mvp`):
- `leads`
- `orders`

### Migrações e Rate Limiting no Neon

Para habilitar o rate limiting persistente em ambiente serverless, foi preparada a migração `migrations/001_create_rate_limits.sql`.

> **Atenção:** Nenhuma migração é executada automaticamente ou de forma destrutiva no banco de dados. A aplicação deve ser realizada com aprovação do proprietário seguindo os passos abaixo.

#### SQL Exato da Migração

```sql
-- Migration: 001_create_rate_limits.sql
-- Description: Cria tabela de rate limit persistente para controle de taxa em serverless

CREATE TABLE IF NOT EXISTS rate_limits (
    key VARCHAR(64) PRIMARY KEY,
    count INTEGER NOT NULL DEFAULT 1,
    reset_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_reset_at ON rate_limits (reset_at);
```

#### Passos para Aplicação no Neon (Produção)

1. Acesse o console do Neon: [https://console.neon.tech](https://console.neon.tech).
2. Selecione o projeto `lp-48h-mvp`, branch `main`, database `neondb`.
3. Abra a aba **SQL Editor**.
4. Cole o SQL da migração acima e clique em **Run**.
5. Verificação da criação executando no SQL Editor:
   ```sql
   SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
   ```
   A tabela `rate_limits` deverá constar na listagem ao lado de `leads` e `orders`.
6. Após a execução, o endpoint `/api/leads` passará de status `degraded` para `enforced` automaticamente, sem necessidade de novo deploy.

## Testes

Executar suíte de testes unitários e de integração:

```bash
npx tsx tests/api-leads.test.mjs
npx tsx tests/migration.test.mjs
```

## Deploy

O projeto está preparado para deploy na Vercel conectado à branch principal após revisão e aprovação.
Variáveis de ambiente requeridas:
- `DATABASE_URL`
- `RESEND_API_KEY` (opcional para notificações por e-mail)
- `NOTIFICATION_EMAIL` (opcional, padrão: jadielindonesia84@gmail.com)
