const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// --- 1. ROTA DA VITRINE (Atualizada com imagem_url) ---
app.get('/vitrine', async (req, res) => {
  try {
    const query = `
      SELECT 
        p.id,
        p.nome_peca, 
        p.preco, 
        p.categoria, 
        p.imagem_url, 
        e.quantidade, 
        e.item AS detalhe_estoque
      FROM produtos p
      LEFT JOIN estoque e ON p.id = e.produto_id
      ORDER BY p.id DESC;
    `;
    
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("Erro na query de vitrine:", err.message);
    res.status(500).json({ error: "Erro ao buscar vitrine" });
  }
});

// --- 2. ROTA DE CADASTRO (O que você precisava!) ---
app.post('/cadastrar', async (req, res) => {
  const { nome_peca, preco, categoria, imagem_url, quantidade, item } = req.body;

  try {
    // Inicia uma transação (garante que salve nos dois ou em nenhum)
    await pool.query('BEGIN');

    // Insere na tabela de PRODUTOS
    const novoProduto = await pool.query(
      "INSERT INTO produtos (nome_peca, preco, categoria, imagem_url) VALUES ($1, $2, $3, $4) RETURNING id",
      [nome_peca, preco, categoria, imagem_url]
    );

    const produtoId = novoProduto.rows[0].id;

    // Insere na tabela de ESTOQUE usando o ID do produto acima
    await pool.query(
      "INSERT INTO estoque (produto_id, quantidade, item) VALUES ($1, $2, $3)",
      [produtoId, quantidade, item]
    );

    await pool.query('COMMIT');

    res.status(201).json({ message: "Produto cadastrado com sucesso!", id: produtoId });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error("Erro ao cadastrar:", err.message);
    res.status(500).json({ error: "Erro ao salvar no banco de dados" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});