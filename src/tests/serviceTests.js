import request from "supertest";
import app from "../app.js";
import nock from "nock";
import { openDb, initDb, buscarHistorico } from "../database/db.js"; 

const RASTREIO_API_BASE = 'https://api.linketrack.com'; 

process.env.RASTREIO_USER = 'teste'; 
process.env.RASTREIO_TOKEN = '1abcd00b2731640e886fb41a8a9671ad1434c599dbaa0a0de9a5aa619f29a83f';

describe("ServiçoEntregas: Testes de Integração e Mocks", () => {
    beforeAll(async () => {
        await initDb();
    });

    afterEach(() => {
        nock.cleanAll();
    });

    afterAll(async () => {
        const db = await openDb();
        await db.exec("DELETE FROM historico");
    });

    it("1. Deve calcular o frete e salvar no histórico", async () => {
        const freteData = { cepOrigem: "01001000", cepDestino: "30140071", peso: 2 };

        const res = await request(app)
            .post("/api/frete")
            .send(freteData);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('valor'); 

        const historico = await buscarHistorico();
        expect(historico.some(h => h.tipo === 'frete')).toBe(true);
        expect(historico[0].origem).toBe(freteData.cepOrigem);
    });

    it("2. Deve rastrear uma encomenda com sucesso e salvar no histórico", async () => {
        const codigo = "AA123456789BR";
        
        nock(RASTREIO_API_BASE)
            .get(/.*/) 
            .reply(200, {
                status: "success",
                eventos: [{ data: "31/10/2025", local: "Curitiba", status: "Objeto entregue" }],
                codigo: codigo
            });

        const res = await request(app)
            .post("/api/rastrear")
            .send({ codigo });

        expect(res.statusCode).toBe(200);
        expect(res.body[0].status).toBe("Objeto entregue");
        
        const historico = await buscarHistorico();
        expect(historico.some(h => h.tipo === 'rastreio' && h.codigo === codigo)).toBe(true);
    });
    
    it("3. Deve simular falha na API de Rastreio e retornar 503 (Mock de falhas)", async () => {
        const codigo = "FALHA123BR";
        nock(RASTREIO_API_BASE)
            .get(/.*/) 
            .reply(500, { message: "Internal server error" }); 

        const res = await request(app)
            .post("/api/rastrear")
            .send({ codigo });

        expect(res.statusCode).toBe(503); 
        expect(res.body.erro).toContain('Falha ao consultar rastreio'); 
    });

    it("4. Deve simular falha na API e acionar o Retry Pattern (se p-retry estiver implementado)", async () => {
        const codigo = "RETRY456BR";
        nock(RASTREIO_API_BASE)
            .get(/.*/) 
            .times(2) 
            .reply(500, { message: "Erro temporário no servidor externo" });
        
        nock(RASTREIO_API_BASE)
            .get(/.*/) 
            .reply(200, { status: "success", eventos: [{ status: "Recuperado na 3ª tentativa" }] });

        const res = await request(app)
            .post("/api/rastrear")
            .send({ codigo });

        expect(res.statusCode).toBe(200);
        expect(res.body[0].status).toBe("Recuperado na 3ª tentativa");
    });
});