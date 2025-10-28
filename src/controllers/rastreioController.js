import { rastrearEncomenda } from '../services/correiosService.js';

export async function getRastreio(req, res) {
    try {
        const { codigo } = req.params;
        const resultado = await rastrearEncomenda(codigo);
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}