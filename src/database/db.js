import sqlite3 from "sqlite3";
import { open } from "sqlite";

let db;

async function conectar() {
    if (!db) {
        db = await open({
        filename: "./src/database/historico.db",
        driver: sqlite3.Database,
        });

        await db.exec(`
        CREATE TABLE IF NOT EXISTS historico (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tipo TEXT,
            dados TEXT,
            data TEXT
        )
        `);
    }
    return db;
}

export async function salvarHistorico(tipo, dados) {
    const dbConn = await conectar();
    const data = new Date().toISOString();
    await dbConn.run("INSERT INTO historico (tipo, dados, data) VALUES (?, ?, ?)", [
        tipo,
        JSON.stringify(dados),
        data,
    ]);
}
