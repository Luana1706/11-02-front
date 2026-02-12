require("dotenv").config();
const pool = require('./db');

async function autenticarAPIKey(req, res, next) {
    const api_key_front = req.header('minha-chave');


    if (!api_key_front) {
        return res.status(401).json({ mensagem: "Chave da API não fornecida" });
    }

    try {

        const result = await pool.query(
            `SELECT consumo, limite FROM public.api_keys WHERE api_key ILIKE $1`,
            [api_key_front]
        );

        if (result.rows.length === 0) {
            console.log("CHAVE INVALIDA", api_key_front);
            return res.status(401).json({ mensagem: "Chave inválida da API" });
        }

        const { consumo, limite } = result.rows[0];


       /* if (consumo >= limite) {
            console.log("CHAVE EXPIRADA - LIMITE ATINGIDO", api_key_front);
            return res.status(403).json({ mensagem: "Limite de consumo da API atingido" });
        }*/


        await pool.query(
           ` UPDATE public.api_keys SET consumo = consumo + 1 WHERE api_key ILIKE $1`,
            [api_key_front]
        );

        next();

    } catch (error) {
        console.error("ERRO NO MIDDLEWARE DE AUTENTICAÇÃO:", error);
        return res.status(500).json({ mensagem: "Erro interno ao validar API Key." });
    }
}

module.exports = autenticarAPIKey;