import { calcularFrete } from '../services/correiosService.js';

export async function getFrete(req, res) {
    try {
        const { cepOrigem, cepDestino, peso } = req.query;
        const resultado = await calcularFrete({ cepOrigem, cepDestino, peso });
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}