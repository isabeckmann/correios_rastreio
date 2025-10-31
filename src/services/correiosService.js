import axios from 'axios';
import retry from 'p-retry'; 
import { openDb, salvarHistorico } from '../database/db.js'; 

const RASTREIO_API_URL = 'https://api.linketrack.com/track/json'; 
const RASTREIO_USER = process.env.RASTREIO_USER || 'teste'; 
const RASTREIO_TOKEN = process.env.RASTREIO_TOKEN || '1abcd00b2731640e886fb41a8a9671ad1434c599dbaa0a0de9a5aa619f29a83f'; 

export async function calcularFrete({ cepOrigem, cepDestino, peso }) {
    let resultadoAPI;
    
    try {
        resultadoAPI = { 
            servico: "SEDEX", valor: parseFloat((Math.random() * 50 + 10).toFixed(2)), 
            prazo: Math.floor(Math.random() * 7) + 2, sucesso: true
        }; 

        await salvarHistorico({
            tipo: 'frete', origem: cepOrigem, destino: cepDestino, resposta: JSON.stringify(resultadoAPI)
        });

        return resultadoAPI;

    } catch (err) {
        console.error('Erro ao calcular frete:', err.message);
        throw new Error('Falha no cálculo de frete. Tente novamente mais tarde.');
    }
}

async function _realizarRastreio(codigoRastreio) {
    const url = `${RASTREIO_API_URL}`;
    
    const { data } = await axios.get(url, {
         params: {
            user: RASTREIO_USER,
            token: RASTREIO_TOKEN,
            codigo: codigoRastreio
        }
    });

    if (data.status !== 'success') {
        throw { status: 404, message: data.message || 'Código de rastreio não encontrado.' };
    }
    return data;
}

export async function rastrearEncomenda(codigoRastreio) {
    let resultadoAPI;

    try {
        resultadoAPI = await retry(() => _realizarRastreio(codigoRastreio), { 
            retries: 3, 
            minTimeout: 1000 
        });

        await salvarHistorico({
            tipo: 'rastreio', codigo: codigoRastreio, resposta: JSON.stringify(resultadoAPI)
        });

        return resultadoAPI.eventos;

    } catch (err) {
        if (err.status) {
            throw err;
        }
        
        console.error('Erro irrecuperável ou de rede:', err.message);
        throw { 
            status: 503, 
            message: 'Falha ao consultar rastreio após várias tentativas. API Externa indisponível.'
        };
    }
}