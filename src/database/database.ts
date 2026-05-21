import * as SQLite from "expo-sqlite";

const database = SQLite.openDatabaseSync("sobmedida.db");

export function initializeDatabase(){
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
}

export default database;
