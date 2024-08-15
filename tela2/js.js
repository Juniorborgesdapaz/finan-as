// Theme Toggle
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;

themeToggleBtn.addEventListener('click', function() {
    if (body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        themeToggleBtn.textContent = 'Modo Escuro';
    } else {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        themeToggleBtn.textContent = 'Modo Claro';
    }
});

// Adicionar Nova Transação
document.getElementById('transaction-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const description = document.getElementById('inputDescription').value;
    const amount = parseFloat(document.getElementById('inputAmount').value);
    const category = document.getElementById('inputCategory').value;

    const transactionList = document.getElementById('transaction-list');
    const newTransaction = document.createElement('li');
    newTransaction.className = 'list-group-item d-flex justify-content-between align-items-center';
    
    let badgeClass;
    let sign;
    
    if (category === 'income') {
        badgeClass = 'badge-success';
        sign = '+';
    } else {
        badgeClass = 'badge-danger';
        sign = '-';
    }

    newTransaction.innerHTML = `
        ${description} - ${category.charAt(0).toUpperCase() + category.slice(1)}
        <span class="badge ${badgeClass} badge-pill">${sign}$${amount.toFixed(2)}</span>
    `;

    transactionList.appendChild(newTransaction);

    updateSummary(category, amount);
    document.getElementById('transaction-form').reset();
});

// Atualizar Resumo
function updateSummary(category, amount) {
    let balance = parseFloat(document.getElementById('balance').textContent.replace(/[$,]/g, ''));
    let income = parseFloat(document.getElementById('income').textContent.replace(/[$,]/g, ''));
    let expenses = parseFloat(document.getElementById('expenses').textContent.replace(/[$,]/g, ''));

    if (category === 'income') {
        income += amount;
        balance += amount;
    } else {
        expenses += amount;
        balance -= amount;
    }

    document.getElementById('balance').textContent = `$${balance.toFixed(2)}`;
    document.getElementById('income').textContent = `$${income.toFixed(2)}`;
    document.getElementById('expenses').textContent = `$${expenses.toFixed(2)}`;
}

    // Gráfico de Despesas
    const ctx = document.getElementById('expensesChart').getContext('2d');
    const expensesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Transporte', 'Alimentação', 'Lazer', 'Educação', 'Saúde'],
            datasets: [{
                label: 'Despesas',
                data: [120, 200, 150, 100, 80],
                backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#4bc0c0'],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Filtro de Transações
    document.getElementById('filterInput').addEventListener('keyup', function() {
        const filterValue = this.value.toLowerCase();
        const transactionItems = document.querySelectorAll('#transaction-list .list-group-item');
        
        transactionItems.forEach(function(item) {
            const text = item.textContent.toLowerCase();
            if (text.includes(filterValue)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    });

    // Função para salvar os dados no localStorage
function salvarDados() {
    localStorage.setItem('saldoAtual', saldoAtual);
    localStorage.setItem('rendimentos', rendimentos);
    localStorage.setItem('despesas', despesas);
}

// Chamar salvarDados sempre que houver uma alteração nos dados
document.getElementById('definirSaldo').addEventListener('click', function() {
    const saldoInicial = parseFloat(document.getElementById('saldoInicial').value);
    if (!isNaN(saldoInicial) && saldoInicial > 0) {
        saldoAtual = saldoInicial;
        document.getElementById('saldoAtual').textContent = `R$ ${saldoAtual.toFixed(2)}`;
        alert('Saldo inicial definido com sucesso!');
        salvarDados(); // Salvar dados no localStorage
    } else {
        alert('Por favor, insira um valor válido para o saldo inicial.');
    }
});

document.getElementById('transactionForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const tipo = document.getElementById('tipo').value;
    const descricao = document.getElementById('descricao').value;
    const valor = parseFloat(document.getElementById('valor').value);

    if (descricao && !isNaN(valor) && valor > 0) {
        let transactionItem = document.createElement('li');
        transactionItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        
        if (tipo === 'rendimento') {
            rendimentos += valor;
            saldoAtual += valor;
            transactionItem.textContent = `${descricao}: R$ ${valor.toFixed(2)} (Rendimento)`;
        } else if (tipo === 'despesa') {
            despesas += valor;
            saldoAtual -= valor;
            transactionItem.textContent = `${descricao}: R$ ${valor.toFixed(2)} (Despesa)`;

            let pagarButton = document.createElement('button');
            pagarButton.className = 'btn btn-sm btn-outline-success ms-2';
            pagarButton.textContent = 'Pagar Dívida';
            pagarButton.addEventListener('click', function() {
                saldoAtual += valor;
                despesas -= valor;
                document.getElementById('saldoAtual').textContent = `R$ ${saldoAtual.toFixed(2)}`;
                document.getElementById('despesas').textContent = `R$ ${despesas.toFixed(2)}`;
                transactionItem.remove();
                salvarDados(); // Salvar dados no localStorage
            });

            transactionItem.appendChild(pagarButton);
        }

        document.getElementById('saldoAtual').textContent = `R$ ${saldoAtual.toFixed(2)}`;
        document.getElementById('rendimentos').textContent = `R$ ${rendimentos.toFixed(2)}`;
        document.getElementById('despesas').textContent = `R$ ${despesas.toFixed(2)}`;

        document.getElementById('transaction-list').appendChild(transactionItem);
        document.getElementById('transactionForm').reset();
        salvarDados(); // Salvar dados no localStorage
    } else {
        alert('Por favor, preencha todos os campos corretamente.');
    }
});
// Função para carregar os dados do localStorage
function carregarDados() {
    saldoAtual = parseFloat(localStorage.getItem('saldoAtual')) || 0;
    rendimentos = parseFloat(localStorage.getItem('rendimentos')) || 0;
    despesas = parseFloat(localStorage.getItem('despesas')) || 0;

    document.getElementById('saldoAtual').textContent = `R$ ${saldoAtual.toFixed(2)}`;
    document.getElementById('rendimentos').textContent = `R$ ${rendimentos.toFixed(2)}`;
    document.getElementById('despesas').textContent = `R$ ${despesas.toFixed(2)}`;
}

// Chamar carregarDados quando a página é carregada
window.addEventListener('load', carregarDados);

// Para remover um item específico
localStorage.removeItem('saldoAtual');

// Para remover todos os itens
localStorage.clear();
// Verificar se o valor é positivo e não nulo
if (valor <= 0 || isNaN(valor)) {
    alert('O valor deve ser um número positivo.');
    return;
}
// Função para salvar transações
function salvarTransacoes(transacoes) {
    localStorage.setItem('transacoes', JSON.stringify(transacoes));
}

// Função para carregar transações
function carregarTransacoes() {
    const transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];
    transacoes.forEach(function(transacao) {
        adicionarTransacaoNaLista(transacao);
    });
}
// Função para editar uma transação
function editarTransacao(item, descricao, valor) {
    // Lógica para editar transação
}

// Função para excluir uma transação
function excluirTransacao(item) {
    // Lógica para excluir transação
}
// Função para alternar entre modo claro e escuro
document.getElementById('darkModeToggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    // Salvar preferência do usuário
    localStorage.setItem('modoEscuro', document.body.classList.contains('dark-mode'));
});

// Carregar preferência do usuário
if (localStorage.getItem('modoEscuro') === 'true') {
    document.body.classList.add('dark-mode');
}
function mostrarMensagem(tipo, mensagem) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${tipo}`;
    alert.textContent = mensagem;
    document.body.prepend(alert);
    setTimeout(() => alert.remove(), 3000);
}
// Exemplo básico de uso do Chart.js
const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Rendimentos', 'Despesas'],
        datasets: [{
            label: 'Total',
            data: [rendimentos, despesas],
            backgroundColor: ['#6f42c1', '#e83e8c']
        }]
    }
});

