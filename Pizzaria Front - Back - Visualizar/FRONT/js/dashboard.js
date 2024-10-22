document.addEventListener("DOMContentLoaded", function() {
    const token = getToken();
    if (token) {
        getUserData(token)
            .then(data => updateWelcomeMessage(data.usuario.name))
            .catch(handleError);
    } else {
        redirectToLogin();
    }
});

// Função de abstração para pegar o token
function getToken() {
    return localStorage.getItem('token');
}

// Função que faz a chamada à API
async function getUserData(token) {
    const response = await fetch('http://localhost:8000/api/user', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        throw new Error('Falha ao obter os dados do usuário');
    }
    return response.json();
}

// Função para atualizar o DOM com o nome do usuário
function updateWelcomeMessage(userName) {
    const welcomeMessage = document.getElementById('welcomeMessage');
    welcomeMessage.textContent = `Bem-vindo, ${userName}!`;
}

// Função para redirecionar para o login
function redirectToLogin() {
    window.location.href = 'login.html';
}

// Função para lidar com erros
function handleError(error) {
    console.error("Erro ao obter os dados do usuário:", error);
    redirectToLogin();
}
