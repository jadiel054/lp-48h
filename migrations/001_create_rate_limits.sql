-- Migration: 001_create_rate_limits.sql
-- Description: Cria tabela de controle de taxa de requisições persistente no Neon (PostgreSQL serverless)
-- Esta tabela armazena contadores por hash de identificador (IP com salt ou hash SHA-256) com timestamp de expiração.

CREATE TABLE IF NOT EXISTS rate_limits (
    key VARCHAR(64) PRIMARY KEY,
    count INTEGER NOT NULL DEFAULT 1,
    reset_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Índice para acelerar a busca e expiração de registros antigos
CREATE INDEX IF NOT EXISTS idx_rate_limits_reset_at ON rate_limits (reset_at);
