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
}

export default database;
