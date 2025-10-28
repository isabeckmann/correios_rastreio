// src/services/correiosService.js
import axios from 'axios';
import { parseStringPromise } from 'xml2js';

const BASE_URL = 'https://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx';

export async function calcularFrete({ cepOrigem, cepDestino, peso }) {
    const params = {
        nCdEmpresa: '',
        sDsSenha: '',
        nCdServico: '04014', // SEDEX
        sCepOrigem: cepOrigem,
        sCepDestino: cepDestino,
        nVlPeso: peso || 1,
        nCdFormato: 1,
        nVlComprimento: 20,
        nVlAltura: 5,
        nVlLargura: 15,
        nVlDiametro: 0,
        sCdMaoPropria: 'N',
        nVlValorDeclarado: 0,
        sCdAvisoRecebimento: 'N',
        StrRetorno: 'xml',
    };

    try {
        const { data } = await axios.get(`${BASE_URL}/CalcPrecoPrazo`, { params });
        const json = await parseStringPromise(data);
        return json.cResultado.Servicos[0].cServico[0];
    } catch (err) {
        console.error('Erro ao calcular frete:', err.message);
        throw new Error('Falha na integração com os Correios');
    }
    }

    export async function rastrearEncomenda(codigoRastreio) {
    const url = `https://proxyapp.correios.com.br/v1/sro-rastro/${codigoRastreio}`;

    try {
        const { data } = await axios.get(url);
        return data.objetos[0];
    } catch (err) {
        console.error('Erro ao rastrear encomenda:', err.message);
        throw new Error('Falha ao consultar rastreio');
    }
}