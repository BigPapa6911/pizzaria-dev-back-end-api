document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('loginForm');
    const mensagem = document.getElementById('mensagem');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const loginData = capturarDadosLogin();
        const validacao = validarDadosLogin(loginData);
        
        if (!validacao.isValid) {
            exibirMensagemErro(validacao.message);
            return;
        }
        
        try {
            const resultado = await enviarDadosLogin(loginData);
            if (resultado.sucesso) {
                redirecionarParaDashboard(resultado.usuario);
            } else {
                exibirMensagemErro(resultado.message);
            }
        } catch (error) {
            exibirMensagemErro('Erro ao realizar o login. Tente novamente.');
        }
    });
});

// Função para capturar os dados de login
function capturarDadosLogin() {
    return {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };
}

// Função para validar os dados de login
function validarDadosLogin(loginData) {
    if (!loginData.email || !loginData.password) {
        return { isValid: false, message: 'Email e senha são obrigatórios' };
    }
    return { isValid: true, message: '' };
}

// Função para enviar os dados para a API
async function enviarDadosLogin(loginData) {
    const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    });
    const data = await response.json();

    return {
        sucesso: data.status === 200,
        message: data.message,
        usuario: data.usuario
    };
}

// Função para exibir a mensagem de erro
function exibirMensagemErro(message) {
    const mensagem = document.getElementById('mensagem');
    mensagem.textContent = 'Erro no login: ' + message;
}

// Função para redirecionar para o dashboard
function redirecionarParaDashboard(usuario) {
    localStorage.setItem('token', usuario.token);
    localStorage.setItem('userId', usuario.id);
    window.location.href = 'dashboard.html';
}
