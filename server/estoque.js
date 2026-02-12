const express = require("express");
const pool = require("../db"); // Verifique se o caminho está correto

const router = express.Router();

// 1. LISTAR ESTOQUE (Com Filtros e Ordenação)
router.get("/", async (req, res) => {
  try {
    let { categoria, ordem } = req.query;

    categoria = categoria ? '%' + categoria + '%' : '%';
    ordem = ordem && ordem.toLowerCase() === "asc" ? "ASC" : "DESC";

    const query = `
      SELECT * FROM estoque 
      WHERE categoria ILIKE $1 
      ORDER BY id ${ordem}
    `;

    const result = await pool.query(query, [categoria]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar estoque", detalhes: err.message });
  }
});

// 2. BUSCAR ITEM POR ID (Primary Key)
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await pool.query("SELECT * FROM estoque WHERE id = $1", [id]);
    
    if (result.rows.length === 0) {
        return res.status(404).json({ error: "Item não encontrado no estoque" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar item" });
  }
});

// 3. CADASTRAR NO ESTOQUE (POST)
router.post("/", async (req, res) => {
  try {
    // Usando as colunas exatas da sua tabela: item, quantidade, categoria, produto_id
    const { item, quantidade, categoria, produto_id } = req.body;
    
    if (!item || quantidade === undefined) {
        return res.status(400).json({ error: "Item e quantidade são obrigatórios" });
    }

    const result = await pool.query(
      "INSERT INTO estoque (item, quantidade, categoria, produto_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [item, quantidade, categoria, produto_id || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao inserir no estoque", detalhes: err.message });
  }
});

// 4. ATUALIZAR ITEM (PUT usando a Primary Key /id)
router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { item, quantidade, categoria } = req.body;
    
    const result = await pool.query(
      "UPDATE estoque SET item=$1, quantidade=$2, categoria=$3 WHERE id=$4 RETURNING *",
      [item, quantidade, categoria, id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: "Item não encontrado para atualizar" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar estoque" });
  }
});

// 5. DELETAR ITEM (DELETE usando a Primary Key /id)
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await pool.query("DELETE FROM estoque WHERE id = $1 RETURNING *", [id]);
    
    if (result.rows.length === 0) {
        return res.status(404).json({ error: "Item não encontrado" });
    }
    res.status(204).send(); 
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar item" });
  }
});