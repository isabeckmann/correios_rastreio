import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function openDb() {
    const dbDir = path.join(__dirname, '..', '..', 'db'); 
    const dbPath = path.join(dbDir, 'correios.db'); 
    return open({
        filename: dbPath,
        driver: sqlite3.Database
    });
}

export async function initDb() {
    const db = await openDb();
    await db.exec(`
        CREATE TABLE IF NOT EXISTS historico (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo TEXT,
        codigo TEXT,
        origem TEXT,
        destino TEXT,
        data_consulta TEXT, 
        resposta TEXT
        )
    `);
    console.log("Banco SQLite inicializado");
}

export async function salvarHistorico({ tipo, codigo = null, origem = null, destino = null, resposta }) {
    const db = await openDb();
    const dataConsulta = new Date().toISOString(); 
    const result = await db.run(
        `INSERT INTO historico (tipo, codigo, origem, destino, resposta, data_consulta) VALUES (?, ?, ?, ?, ?, ?)`,
        [tipo, codigo, origem, destino, resposta, dataConsulta]
    );
    return result;
}

export async function buscarHistorico() {
    const db = await openDb();
    return db.all('SELECT * FROM historico ORDER BY data_consulta DESC');
}