import axios from 'axios';
import retry from 'p-retry'; 
import { openDb, salvarHistorico } from '../database/db.js'; 

const RASTREIO_API_URL = 'https://api-labs.wonca.com.br/wonca.labs.v1.LabsService/Track'; 
const RASTREIO_USER = process.env.RASTREIO_USER || 'teste'; 
const API_KEY_TOKEN = process.env.RASTREIO_TOKEN;

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
    const { data } = await axios.post(
        'https://api-labs.wonca.com.br/wonca.labs.v1.LabsService/Track',
        {
            code: codigoRastreio 
        },
        { 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Apikey ${API_KEY_TOKEN}` 
            }
        }
    );

    if (!data || data.error) {
        throw { 
            status: data.error.code || 404, 
            message: data.error.message || 'Erro ao rastrear encomenda.'
        };
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