import { rastrearEncomenda } from "../services/correiosService.js";

export async function rastrear(req, res) {
    const { codigo } = req.body;

    if (!codigo) {
        return res.status(400).json({ erro: "O código de rastreio é obrigatório" });
    }

    try {
        const resultado = await rastrearEncomenda(codigo);
        return res.json(resultado);
    } catch (error) {
        return res.status(error.status || 503).json({ erro: error.message });
    }
}