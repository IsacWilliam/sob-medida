import * as SQLite from "expo-sqlite";

const database = SQLite.openDatabaseSync("sobmedida.db");

export function initializeDatabase() {
  // Necessário para o ON DELETE CASCADE funcionar (o SQLite deixa desligado por padrão).
  // Precisa rodar fora de transação.
  database.execSync(`PRAGMA foreign_keys = ON;`);

  database.execSync(`
    CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      telefone TEXT,
      email TEXT,
      observacoes TEXT
    );
  `);

  database.execSync(`
    CREATE TABLE IF NOT EXISTS encomendas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente_id INTEGER,
      peca TEXT NOT NULL,
      valor TEXT,
      prazo TEXT,
      status TEXT,
      observacoes TEXT
    );
  `);

  migrarMedidas();
}

function migrarMedidas() {
  const versao = database.getFirstSync<{ user_version: number }>("PRAGMA user_version") ?.user_version ?? 0;

  if (versao >= 1) return;

  // Garante que a tabela antiga exista (instalação nova ou já existente)
  database.execSync(`
    CREATE TABLE IF NOT EXISTS medidas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente_id INTEGER,
      busto TEXT,
      cintura TEXT,
      quadril TEXT,
      ombro TEXT,
      comprimento TEXT
    );
  `);

  // SQLite não permite adicionar FK/UNIQUE via ALTER, então recriamos a tabela.
  // - Mantém só a linha mais recente de cada cliente (remove duplicatas)
  // - Descarta medidas órfãs (cliente que não existe mais)
  // - Converte texto para número ("70,5" -> 70.5; vazio -> NULL)
  database.execSync(`
    BEGIN;

    CREATE TABLE medidas_nova (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente_id INTEGER NOT NULL UNIQUE REFERENCES clientes(id) ON DELETE CASCADE,
      busto REAL,
      cintura REAL,
      quadril REAL,
      ombro REAL,
      comprimento REAL,
      atualizado_em TEXT NOT NULL DEFAULT (datetime('now'))
    );

    INSERT INTO medidas_nova (cliente_id, busto, cintura, quadril, ombro, comprimento)
    SELECT
      cliente_id,
      CAST(REPLACE(NULLIF(TRIM(busto), ''), ',', '.') AS REAL),
      CAST(REPLACE(NULLIF(TRIM(cintura), ''), ',', '.') AS REAL),
      CAST(REPLACE(NULLIF(TRIM(quadril), ''), ',', '.') AS REAL),
      CAST(REPLACE(NULLIF(TRIM(ombro), ''), ',', '.') AS REAL),
      CAST(REPLACE(NULLIF(TRIM(comprimento), ''), ',', '.') AS REAL)
    FROM medidas
    WHERE id IN (
      SELECT MAX(id) FROM medidas WHERE cliente_id IS NOT NULL GROUP BY cliente_id
    )
    AND cliente_id IN (SELECT id FROM clientes);

    DROP TABLE medidas;
    ALTER TABLE medidas_nova RENAME TO medidas;

    PRAGMA user_version = 1;

    COMMIT;
  `);
}

export default database;
