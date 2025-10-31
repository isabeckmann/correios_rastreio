import { calcularFrete } from "../services/correiosService.js";

export async function calcular(req, res) {
    const { cepOrigem, cepDestino, peso } = req.body; 

    if (!cepOrigem || !cepDestino) {
        return res.status(400).json({ erro: "CEP de origem e destino são obrigatórios" });
    }

    try {
        const resultado = await calcularFrete({ cepOrigem, cepDestino, peso }); 
        return res.json(resultado);
    } catch (error) {
        return res.status(error.status || 503).json({ erro: error.message }); 
    }
}