import express from 'express';
import { getFrete } from './controllers/freteController.js';
import { getRastreio } from './controllers/rastreioController.js';

const router = express.Router();

router.get('/frete', getFrete);
router.get('/rastreio/:codigo', getRastreio);
router.get('/ping', (req, res) => {
    res.json({ message: 'API dos Correios funcionando' });
});

export default router;