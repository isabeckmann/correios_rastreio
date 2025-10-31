import express from "express";
import { calcular } from "./controllers/freteController.js";
import { rastrear } from "./controllers/rastreioController.js";
// Assumindo que você adicione o endpoint para Gerenciar Histórico
import { listarHistorico } from "./controllers/historicoController.js"; 

const router = express.Router();

// 1. Calcular frete
router.post("/frete", calcular);
// 2. Rastrear encomendas
router.post("/rastrear", rastrear); 
// 3. Gerenciar histórico de consultas (NOVO ENDPOINT)
router.get("/historico", listarHistorico); 

export default router;