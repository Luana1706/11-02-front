// 1. FUNÇÃO PARA SALVAR O PRODUTO
const btnSalvar = document.getElementById('btnSalvar');

if (btnSalvar) {
    btnSalvar.onclick = async () => {
        const produto = {
            nome_peca: document.getElementById('campoPeca').value,
            preco: parseFloat(document.getElementById('campoPreco').value),
            categoria: document.getElementById('campoCategoria').value,
            imagem_url: document.getElementById('campoImagem').value,
            quantidade: parseInt(document.getElementById('campoQuantidade').value),
            detalhes: document.getElementById('campoItemEstoque').value // Alinhado com o seu banco
        };

        if (!produto.nome_peca || isNaN(produto.preco)) {
            alert("⚠️ Por favor, preencha ao menos Nome e Preço.");
            return;
        }

        try {
            const resposta = await fetch('http://localhost:3000/cadastrar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(produto)
            });

            if (resposta.ok) {
                alert("✅ Sucesso! O produto já está no sistema.");
                document.querySelectorAll('input').forEach(i => i.value = '');
                atualizarInterface(); 
                atualizarListaEstoque();
            }
        } catch (erro) {
            console.error("Erro ao salvar:", erro);
        }
    };
}

// 2. VITRINE (Cards de visualização rápida)
async function atualizarInterface() {
    const containerVitrine = document.getElementById('listagem');
    if (!containerVitrine) return;

    try {
        const resposta = await fetch('http://localhost:3000/vitrine');
        const produtos = await resposta.json();
        containerVitrine.innerHTML = ''; 

        produtos.forEach(item => {
            containerVitrine.innerHTML += `
                <div class="product-card-mini">
                    <img src="${item.imagem_url || 'https://via.placeholder.com/150'}" alt="Foto">
                    <div class="info">
                        <h6>${item.nome_peca}</h6>
                        <p>R$ ${item.preco}</p>
                    </div>
                </div>`;
        });
    } catch (erro) { console.error(erro); }
}

// 3. TABELA DE ESTOQUE (O coração do Dashboard)
async function atualizarListaEstoque() {
    const listaEstoque = document.getElementById('listagemEstoque');
    const contador = document.getElementById('contadorItens');
    if (!listaEstoque) return;
    
    try {
        const resposta = await fetch('http://localhost:3000/vitrine'); 
        const dados = await resposta.json();

        listaEstoque.innerHTML = ''; 
        if (contador) contador.innerText = `${dados.length} itens cadastrados`;

        dados.forEach(item => {
            const fotoUrl = item.imagem_url || 'https://via.placeholder.com/50';

            // Ajustado para bater exatamente com as colunas do seu CSS: Foto | Nome | Categoria | Qtd | Ações
            listaEstoque.innerHTML += `
                <div class="estoque-item">
                    <div class="col-img">
                        <img src="${fotoUrl}" class="img-estoque-thumb">
                    </div>
                    <div class="col-nome">
                        <strong>${item.nome_peca}</strong>
                        <br><small>R$ ${item.preco}</small>
                    </div>
                    <div class="col-cat">${item.categoria}</div>
                    <div class="col-qtd"><span class="badge">${item.quantidade}</span></div>
                    <div class="col-acao">
                        <button onclick="prepararEdicao(${item.id})" class="btn-edit-small">✏️</button>
                        <button onclick="deletarProduto(${item.id})" class="btn-delete-small">🗑️</button>
                    </div>
                </div>
            `;
        });
    } catch (erro) { console.error(erro); }
}

// Inicializar ao carregar a página
window.onload = () => {
    atualizarInterface();
    atualizarListaEstoque();
};