import { buscarHistorico } from "../database/db.js";

export async function listarHistorico(req, res) {
    try {
        const historico = await buscarHistorico();
        const historicoFormatado = historico.map(item => ({
            ...item,
            resposta: JSON.parse(item.resposta) 
        }));

        return res.status(200).json(historicoFormatado);
    } catch (error) {
        console.error("Erro ao buscar histórico:", error.message);
        return res.status(500).json({ erro: "Falha ao acessar o histórico de consultas." });
    }
}