const express = require("express");
require("dotenv").config();
const cors = require('cors');

// Importação das rotas de Produtos e do Middleware de Segurança
const produtosRouter = require("./routes/catalogos");
const autenticarAPIkey = require("./autorizar");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// =====================
// Rotas principais
// =====================

// Aplica a segurança em todas as rotas abaixo
app.use(autenticarAPIkey); 

// Rota para gerenciar o catálogo de roupas
app.use("/catalogos", produtosRouter);

// Rota raiz para verificar se a API está online
app.get("/", (req, res) => {
  res.send("👔 API ProntoLook rodando! Acesse /produtos para ver o catálogo.");
});

// =====================
// Servidor
// =====================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);

});





