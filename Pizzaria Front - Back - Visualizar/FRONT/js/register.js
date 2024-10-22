document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('registerForm');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const dadosRegistro = capturarDadosRegistro();
        const validacao = validarDadosRegistro(dadosRegistro);

        if (!validacao.isValid) {
            exibirMensagemErro(validacao.message);
            return;
        }

        try {
            const resultado = await registrarUsuario(dadosRegistro);
            if (resultado.sucesso) {
                redirecionarParaLogin();
            } else {
                exibirMensagemErro(resultado.message);
            }
        } catch (error) {
            exibirMensagemErro('Erro ao registrar o usuário. Tente novamente.');
        }
    });
});

// Função para capturar os dados de registro
function capturarDadosRegistro() {
    return {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value
    };
}

// Função para validar os dados de registro
function validarDadosRegistro(dados) {
    if (!dados.name || !dados.email || !dados.password || !dados.confirmPassword) {
        return { isValid: false, message: 'Todos os campos são obrigatórios' };
    }

    if (dados.password !== dados.confirmPassword) {
        return { isValid: false, message: 'As senhas não coincidem' };
    }

    return { isValid: true, message: '' };
}

// Função para enviar os dados de registro para a API
async function registrarUsuario(dados) {
    const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados)
    });
    
    const data = await response.json();
    return {
        sucesso: data.status === 201,
        message: data.message
    };
}

// Função para exibir a mensagem de erro
function exibirMensagemErro(message) {
    const mensagem = document.getElementById('mensagemErro');
    mensagem.textContent = 'Erro no registro: ' + message;
    mensagem.classList.remove('d-none');
}

// Função para redirecionar para a página de login
function redirecionarParaLogin() {
    window.location.href = 'login.html';
}
