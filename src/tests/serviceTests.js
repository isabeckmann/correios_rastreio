import request from "supertest";
import app from "../app.js";
import nock from "nock";

describe("Serviço de Entregas - Integração", () => {
    it("Deve calcular o frete com sucesso", async () => {
        const res = await request(app)
        .post("/api/frete")
        .send({ cepOrigem: "01001000", cepDestino: "30140071", peso: 2 });

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe("sucesso");
    });

    it("Deve rastrear uma encomenda com sucesso", async () => {
        const res = await request(app).get("/api/rastreio/AA123456789BR");
        expect(res.statusCode).toBe(200);
        expect(res.body.dados.codigo).toBe("AA123456789BR");
    });

    it("Deve simular falha na API", async () => {
        nock("https://viacep.com.br").get(/.*/).replyWithError("Falha simulada");

        const res = await request(app)
        .post("/api/frete")
        .send({ cepOrigem: "01001000", cepDestino: "99999999", peso: 2 });

        expect(res.statusCode).toBe(500);
    });
});