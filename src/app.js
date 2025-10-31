import express from "express";
import cors from "cors";
import "dotenv/config";
import routes from "./routes.js";
import { initDb } from "./database/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.get('/', (req, res) => {
    res.status(200).json({ status: "ServiçoEntregas UP", env: process.env.NODE_ENV || 'development' });
});

async function startServer() {
    try {
        await initDb(); 

        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
            console.log(`Acesso: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Falha crítica ao iniciar a aplicação:", error);
        process.exit(1); 
    }
}

startServer();
export default app;