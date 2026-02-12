-- 1. Criar o banco de dados
CREATE DATABASE prontolook_db;

-- 2. Conecte-se ao banco prontolook_db antes de rodar o código abaixo

-- Criar a tabela de Lojas
CREATE TABLE lojas (
    id SERIAL PRIMARY KEY,
    nome_loja VARCHAR(100) NOT NULL,
    whatsapp VARCHAR(20),
    cidade VARCHAR(50)
);

-- Criar a tabela de Produtos
CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    loja_id INTEGER REFERENCES lojas(id) ON DELETE CASCADE,
    nome_peca VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    categoria VARCHAR(50)
);

-- Criar a tabela de Estoque
CREATE TABLE estoque (
    id SERIAL PRIMARY KEY,
    produto_id INTEGER REFERENCES produtos(id) ON DELETE CASCADE,
    tamanho VARCHAR(10) NOT NULL,
    cor VARCHAR(30) NOT NULL,
    quantidade INTEGER DEFAULT 0
);

-- 3. Inserir dados iniciais para teste
INSERT INTO lojas (nome_loja, whatsapp, cidade) VALUES 
('ProntoLook Matriz', '11999999999', 'São Paulo');

INSERT INTO produtos (loja_id, nome_peca, preco, categoria) VALUES
(1, 'Camiseta Streetwear', 89.90, 'Masculino'),
(1, 'Calça Jeans Slim', 129.90, 'Masculino'),
(1, 'Vestido Florido', 159.90, 'Feminino'),
(1, 'Jaqueta Corta Vento', 189.00, 'Inverno'),
(1, 'Tênis Casual', 249.99, 'Calçados');

INSERT INTO estoque (produto_id, tamanho, cor, quantidade) VALUES
(1, 'G', 'Preta', 15),
(2, '42', 'Azul', 10),
(3, 'M', 'Rosa', 8),
(4, 'P', 'Verde', 5),
(5, '40', 'Branco', 12);