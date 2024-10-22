document.addEventListener('DOMContentLoaded', listarUsuarios);

async function listarUsuarios() {
    const token = getToken();
    if (token) {
        try {
            const usuarios = await getUsuarios(token);
            renderUsuarios(usuarios);
            bindUserActions();
        } catch (error) {
            handleListError();
        }
    } else {
        redirectToLogin();
    }
}

async function getUsuarios(token) {
    const response = await fetch('http://localhost:8000/api/user/listar', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Erro ao buscar os usuários');
    }
    return response.json();
}

function renderUsuarios(usuarios) {
    const tabelaUsuarios = document.getElementById('tabelaUsuarios');
    tabelaUsuarios.innerHTML = ''; // Limpa a tabela
    usuarios.user.data.forEach((usuario, index) => {
        const row = createTableRow(usuario, index);
        tabelaUsuarios.appendChild(row);
    });
}

function createTableRow(usuario, index) {
    const dataFormatada = formatarData(new Date(usuario.created_at));
    const userIdLogado = localStorage.getItem('userId');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${index + 1}</td>
        <td>${usuario.name}</td>
        <td>${usuario.email}</td>
        <td>${dataFormatada}</td>
        <td>
            <button class="btn btn-info btn-sm visualizar-usuario" data-id="${usuario.id}">
                <i class="fas fa-eye"></i>
            </button>
            ${usuario.id != userIdLogado ? `
                <button class="btn btn-danger btn-sm excluir-usuario" data-id="${usuario.id}">
                    <i class="fas fa-trash-alt"></i>
                </button>` : ''}
        </td>
    `;
    return row;
}

function bindUserActions() {
    document.querySelectorAll('.excluir-usuario').forEach(button => {
        button.addEventListener('click', async function() {
            const userId = this.getAttribute('data-id');
            const confirmar = confirm('Tem certeza que deseja excluir este usuário?');
            if (confirmar) {
                await excluirUsuario(userId);
                listarUsuarios();
            }
        });
    });

    document.querySelectorAll('.visualizar-usuario').forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-id');
            visualizarUsuario(userId);
        });
    });
}

function formatarData(data) {
    return data.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
}

function handleListError() {
    const mensagemErro = document.getElementById('mensagemErro');
    mensagemErro.textContent = 'Erro ao carregar a lista de usuários';
    mensagemErro.classList.remove('d-none');
}

async function excluirUsuario(userId) {
    const token = getToken();
    const response = await fetch(`http://localhost:8000/api/user/deletar/${userId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Erro ao excluir o usuário');
    }
    alert('Usuário excluído com sucesso!');
}
