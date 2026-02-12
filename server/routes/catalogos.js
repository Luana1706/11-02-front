const express = require("express");
const pool = require("../db"); // Garanta que o caminho para o db.js está correto

const router = express.Router();

// 1. LISTAR PRODUTOS (Com Filtros, Ordenação e Paginação)
router.get("/", async (req, res) => {
  try {
    let { categoria, ordem, offset, limit } = req.query;

    // Ajuste de filtros
    categoria = categoria ? '%' + categoria + '%' : '%';
    ordem = ordem && ordem.toLowerCase() === "asc" ? "ASC" : "DESC";
    offset = parseInt(offset) || 0;
    limit = parseInt(limit) || 100;

    const query = `
      SELECT * FROM produtos
      WHERE categoria ILIKE $1
      ORDER BY id ${ordem}
      LIMIT $2
      OFFSET $3
    `;

    const result = await pool.query(query, [categoria, limit, offset]);
    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ 
      error: "Erro ao listar produtos", 
      detalhes: err.message 
    });
  }
});

// 2. BUSCAR UM PRODUTO POR ID
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await pool.query("SELECT * FROM produtos WHERE id = $1", [id]);
    
    if (result.rows.length === 0) {
        return res.status(404).json({ error: "Produto não encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar produto" });
  }
});

// 3. CADASTRAR NOVO PRODUTO
router.post("/", async (req, res) => {
  try {
    const { loja_id, nome_peca, preco, categoria } = req.body;
    
    // Validação básica
    if (!nome_peca || !preco) {
        return res.status(400).json({ error: "Nome da peça e preço são obrigatórios" });
    }

    const result = await pool.query(
      "INSERT INTO produtos (loja_id, nome_peca, preco, categoria) VALUES ($1, $2, $3, $4) RETURNING *",
      [loja_id || 1, nome_peca, preco, categoria]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao inserir produto", detalhes: err.message });
  }
});

// 4. ATUALIZAR PRODUTO
router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nome_peca, preco, categoria } = req.body;
    
    const result = await pool.query(
      "UPDATE produtos SET nome_peca=$1, preco=$2, categoria=$3 WHERE id=$4 RETURNING *",
      [nome_peca, preco, categoria, id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: "Produto não encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
});

// 5. DELETAR PRODUTO
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await pool.query("DELETE FROM produtos WHERE id = $1 RETURNING *", [id]);
    
    if (result.rows.length === 0) {
        return res.status(404).json({ error: "Produto não encontrado" });
    }
    res.status(204).send(); // Sucesso, sem conteúdo
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar produto" });
  }
});

module.exports = router;