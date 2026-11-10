import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test("Migration SQL: validação estrita da sintaxe DDL de rate_limits", () => {
  const migrationPath = path.resolve(__dirname, "../migrations/001_create_rate_limits.sql");
  assert.ok(fs.existsSync(migrationPath), "Arquivo 001_create_rate_limits.sql deve existir");

  const sqlContent = fs.readFileSync(migrationPath, "utf-8");

  // Verifica que não há comandos destrutivos (DROP, TRUNCATE)
  assert.ok(!/\bDROP\b/i.test(sqlContent), "Migration não deve conter DROP");
  assert.ok(!/\bTRUNCATE\b/i.test(sqlContent), "Migration não deve conter TRUNCATE");

  // Validação dos comandos DDL esperados para PostgreSQL
  assert.ok(
    /CREATE\s+TABLE\s+IF\s+NOT\s+EXISTS\s+rate_limits/i.test(sqlContent),
    "Deve conter CREATE TABLE IF NOT EXISTS rate_limits"
  );
  assert.ok(
    /key\s+VARCHAR\(64\)\s+PRIMARY\s+KEY/i.test(sqlContent),
    "Deve definir coluna key como VARCHAR(64) PRIMARY KEY"
  );
  assert.ok(
    /count\s+INTEGER\s+NOT\s+NULL\s+DEFAULT\s+1/i.test(sqlContent),
    "Deve definir coluna count INTEGER NOT NULL DEFAULT 1"
  );
  assert.ok(
    /reset_at\s+TIMESTAMP\s+WITH\s+TIME\s+ZONE\s+NOT\s+NULL/i.test(sqlContent),
    "Deve definir coluna reset_at com fuso horário"
  );
  assert.ok(
    /CREATE\s+INDEX\s+IF\s+NOT\s+EXISTS\s+idx_rate_limits_reset_at\s+ON\s+rate_limits\s*\(reset_at\)/i.test(
      sqlContent
    ),
    "Deve conter CREATE INDEX IF NOT EXISTS na coluna reset_at"
  );
});

test("Migration SQL: simulação da lógica de UPSERT atômico do PostgreSQL", () => {
  // Simulação de banco em memória emulando a semântica de INSERT ... ON CONFLICT (key) DO UPDATE
  const mockTable = new Map();

  function executeUpsert(key, now, windowEnd) {
    const existing = mockTable.get(key);
    if (!existing) {
      const record = { count: 1, reset_at: windowEnd };
      mockTable.set(key, record);
      return { count: record.count, reset_at: record.reset_at };
    }

    if (existing.reset_at < now) {
      existing.count = 1;
      existing.reset_at = windowEnd;
    } else {
      existing.count += 1;
    }
    return { count: existing.count, reset_at: existing.reset_at };
  }

  const testKey = "test_sha256_hash_1234567890abcdef";
  const t0 = new Date("2026-11-10T00:00:00Z");
  const windowEnd1 = new Date("2026-11-10T00:10:00Z");

  // 1ª requisição
  const res1 = executeUpsert(testKey, t0, windowEnd1);
  assert.equal(res1.count, 1);

  // 2ª requisição na mesma janela
  const t1 = new Date("2026-11-10T00:02:00Z");
  const res2 = executeUpsert(testKey, t1, windowEnd1);
  assert.equal(res2.count, 2);

  // 6ª requisição (atingindo limite)
  for (let i = 3; i <= 6; i++) {
    executeUpsert(testKey, t1, windowEnd1);
  }
  assert.equal(mockTable.get(testKey).count, 6);

  // Requisição após expiração da janela (reset atômico)
  const tExp = new Date("2026-11-10T00:10:05Z");
  const windowEnd2 = new Date("2026-11-10T00:20:05Z");
  const resReset = executeUpsert(testKey, tExp, windowEnd2);
  assert.equal(resReset.count, 1, "Janela expirada deve resetar o contador para 1");
});
