document.addEventListener("DOMContentLoaded", function() {
    const userId = obterUserId();
    if (userId) {
        visualizarUsuario(userId);
    } else {
        redirecionarParaListagem();
    }
});

// Função para obter o ID do usuário a ser visualizado
function obterUserId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Função para visualizar o usuário
async function visualizarUsuario(userId) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            redirecionarParaLogin();
            return;
        }

        const usuario = await buscarUsuarioAPI(userId, token);
        if (usuario) {
            exibirDetalhesUsuario(usuario);
        } else {
            exibirMensagemErro('Usuário não encontrado.');
        }
    } catch (error) {
        exibirMensagemErro('Erro ao buscar o usuário.');
    }
}

// Função para buscar o usuário pela API
async function buscarUsuarioAPI(userId, token) {
    const response = await fetch(`http://localhost:8000/api/user/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });

    if (response.ok) {
        const data = await response.json();
        return data.user;
    } else {
        return null;
    }
}

// Função para exibir os detalhes do usuário
function exibirDetalhesUsuario(usuario) {
    document.getElementById('name').textContent = usuario.name;
    document.getElementById('email').textContent = usuario.email;
    document.getElementById('dataCriacao').textContent = formatarData(usuario.created_at);
}

// Função para formatar a data
function formatarData(dataString) {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Função para exibir mensagens de erro
function exibirMensagemErro(mensagem) {
    const mensagemErro = document.getElementById('mensagemErro');
    mensagemErro.textContent = mensagem;
    mensagemErro.classList.remove('d-none');
}

// Função para redirecionar para a página de login
function redirecionarParaLogin() {
    window.location.href = 'login.html';
}

// Função para redirecionar para a listagem de usuários
function redirecionarParaListagem() {
    window.location.href = 'listar.html';
}
