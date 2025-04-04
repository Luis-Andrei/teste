// Verificar autenticação
document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('adminLoggedIn')) {
        window.location.href = '/login';
        return;
    }

    // Carregar dados do perfil
    loadProfileData();
    loadLinks();
    loadMenu();
    loadContactInfo();

    // Configurar navegação
    setupNavigation();

    // Configurar logout
    setupLogout();

    // Configurar tema
    loadTheme();
});

// Configurar navegação
function setupNavigation() {
    const navLinks = document.querySelectorAll('.admin-nav a');
    const sections = document.querySelectorAll('.admin-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);

            // Atualizar navegação ativa
            navLinks.forEach(a => a.classList.remove('active'));
            link.classList.add('active');

            // Mostrar seção ativa
            sections.forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(targetId).classList.add('active');
        });
    });
}

// Configurar logout
function setupLogout() {
    const logoutBtn = document.querySelector('.logout-button');
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // Limpar dados da sessão
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminToken');

        // Mostrar mensagem de despedida
        showMessage('Até logo! Redirecionando...', 'info');

        // Redirecionar após um breve delay
        setTimeout(() => {
            window.location.href = '/login';
        }, 1000);
    });
}

// Funções para carregar dados
async function loadProfileData() {
    try {
        const response = await fetch('/api/profile');
        const data = await response.json();

        document.getElementById('profileName').value = data.name;
        document.getElementById('profileBio').value = data.bio;
        document.getElementById('profileImage').value = data.image;
        document.getElementById('profileImagePreview').src = data.image;

        document.getElementById('adminName').textContent = data.name || 'Administrador';
    } catch (error) {
        console.error('Erro ao carregar perfil:', error);
    }
}

async function loadLinks() {
    try {
        const response = await fetch('/api/links');
        const links = await response.json();
        const container = document.getElementById('linksContainer');
        container.innerHTML = '';

        links.forEach((link, index) => {
            const linkElement = createLinkElement(index, link);
            container.appendChild(linkElement);
        });
    } catch (error) {
        console.error('Erro ao carregar links:', error);
    }
}

async function loadMenu() {
    try {
        const response = await fetch('/api/menu');
        const menuItems = await response.json();
        const container = document.getElementById('menuContainer');
        container.innerHTML = '';

        menuItems.forEach((item, index) => {
            const menuElement = createMenuElement(index, item);
            container.appendChild(menuElement);
        });
    } catch (error) {
        console.error('Erro ao carregar cardápio:', error);
    }
}

// Funções para salvar dados
async function saveProfile() {
    const name = document.getElementById('profileName').value;
    const bio = document.getElementById('profileBio').value;
    const image = document.getElementById('profileImage').value;

    try {
        const response = await fetch('/api/profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, bio, image })
        });

        if (response.ok) {
            alert('Perfil salvo com sucesso!');
            document.getElementById('adminName').textContent = name || 'Administrador';
        } else {
            throw new Error('Erro ao salvar perfil');
        }
    } catch (error) {
        console.error('Erro ao salvar perfil:', error);
        alert('Erro ao salvar perfil. Tente novamente.');
    }
}

async function saveLinks() {
    const links = [];
    document.querySelectorAll('.link-item-template').forEach(template => {
        links.push({
            title: template.querySelector('.link-title').value,
            url: template.querySelector('.link-url').value,
            icon: template.querySelector('.link-icon').value,
            description: template.querySelector('.link-description').value
        });
    });

    try {
        const response = await fetch('/api/links', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(links)
        });

        if (response.ok) {
            alert('Links salvos com sucesso!');
        } else {
            throw new Error('Erro ao salvar links');
        }
    } catch (error) {
        console.error('Erro ao salvar links:', error);
        alert('Erro ao salvar links. Tente novamente.');
    }
}

async function saveMenu() {
    const menuItems = [];
    document.querySelectorAll('.menu-item-template').forEach(template => {
        menuItems.push({
            title: template.querySelector('.menu-title').value,
            description: template.querySelector('.menu-description').value,
            price: parseFloat(template.querySelector('.menu-price').value),
            category: template.querySelector('.menu-category').value,
            image: template.querySelector('.menu-image').value
        });
    });

    try {
        const response = await fetch('/api/menu', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(menuItems)
        });

        if (response.ok) {
            alert('Cardápio salvo com sucesso!');
        } else {
            throw new Error('Erro ao salvar cardápio');
        }
    } catch (error) {
        console.error('Erro ao salvar cardápio:', error);
        alert('Erro ao salvar cardápio. Tente novamente.');
    }
}

// Funções auxiliares
function createLinkElement(index, link = {}) {
    const div = document.createElement('div');
    div.className = 'link-item-template';
    div.innerHTML = `
        <div class="form-group">
            <label>Título</label>
            <input type="text" class="form-control link-title" value="${link.title || ''}" placeholder="Título do link">
        </div>
        <div class="form-group">
            <label>URL</label>
            <input type="text" class="form-control link-url" value="${link.url || ''}" placeholder="URL do link">
        </div>
        <div class="form-group">
            <label>Ícone (Font Awesome)</label>
            <input type="text" class="form-control link-icon" value="${link.icon || ''}" placeholder="fa-icon">
        </div>
        <div class="form-group">
            <label>Descrição</label>
            <input type="text" class="form-control link-description" value="${link.description || ''}" placeholder="Descrição do link">
        </div>
        <button class="btn-secondary remove-link" data-index="${index}">
            <i class="fas fa-trash"></i> Remover Link
        </button>
    `;
    return div;
}

function createMenuElement(index, item = {}) {
    const div = document.createElement('div');
    div.className = 'menu-item-template';
    div.innerHTML = `
        <div class="form-group">
            <label>Nome do Item</label>
            <input type="text" class="form-control menu-title" value="${item.title || ''}" placeholder="Nome do item">
        </div>
        <div class="form-group">
            <label>Descrição</label>
            <textarea class="form-control menu-description" placeholder="Descrição do item">${item.description || ''}</textarea>
        </div>
        <div class="form-group">
            <label>Preço</label>
            <input type="text" class="form-control menu-price" value="${item.price || ''}" placeholder="R$ 0,00">
        </div>
        <div class="form-group">
            <label>Categoria</label>
            <select class="form-control menu-category">
                <option value="lanches" ${item.category === 'lanches' ? 'selected' : ''}>Lanches</option>
                <option value="bebidas" ${item.category === 'bebidas' ? 'selected' : ''}>Bebidas</option>
                <option value="porcoes" ${item.category === 'porcoes' ? 'selected' : ''}>Porções</option>
                <option value="sobremesas" ${item.category === 'sobremesas' ? 'selected' : ''}>Sobremesas</option>
            </select>
        </div>
        <div class="form-group">
            <label>URL da Imagem</label>
            <input type="text" class="form-control menu-image" value="${item.image || ''}" placeholder="URL da imagem">
            <div class="menu-image-preview">
                <img src="${item.image || ''}" alt="Preview da imagem">
            </div>
        </div>
        <button class="btn-secondary remove-menu-item" data-index="${index}">
            <i class="fas fa-trash"></i> Remover Item
        </button>
    `;
    return div;
}

// Configurações
function loadTheme() {
    const theme = localStorage.getItem('adminTheme') || 'light';
    const primaryColor = localStorage.getItem('adminPrimaryColor') || '#4a90e2';

    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.getElementById('theme').value = theme;
    document.getElementById('primaryColor').value = primaryColor;
}

function saveTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('adminTheme', theme);
}

function savePrimaryColor(color) {
    document.documentElement.style.setProperty('--primary-color', color);
    localStorage.setItem('adminPrimaryColor', color);
}

function saveSettings() {
    const theme = document.getElementById('theme').value;
    const primaryColor = document.getElementById('primaryColor').value;

    saveTheme(theme);
    savePrimaryColor(primaryColor);

    showMessage('Configurações salvas com sucesso!');
}

// Utilitários
function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Carregar informações de contato
function loadContactInfo() {
    const phone = localStorage.getItem('contactPhone') || '(XX) XXXX-XXXX';
    const phone2 = localStorage.getItem('contactPhone2') || '(XX) XXXX-XXXX';
    const address = localStorage.getItem('contactAddress') || 'Rua Exemplo, 123 - Centro';
    const weekdayHours = localStorage.getItem('weekdayHours') || '10h às 22h';
    const sundayHours = localStorage.getItem('sundayHours') || '11h às 21h';

    document.getElementById('contactPhone').value = phone;
    document.getElementById('contactPhone2').value = phone2;
    document.getElementById('contactAddress').value = address;
    document.getElementById('weekdayHours').value = weekdayHours;
    document.getElementById('sundayHours').value = sundayHours;
}

function saveContactInfo() {
    const phone = document.getElementById('contactPhone').value;
    const phone2 = document.getElementById('contactPhone2').value;
    const address = document.getElementById('contactAddress').value;
    const weekdayHours = document.getElementById('weekdayHours').value;
    const sundayHours = document.getElementById('sundayHours').value;

    localStorage.setItem('contactPhone', phone);
    localStorage.setItem('contactPhone2', phone2);
    localStorage.setItem('contactAddress', address);
    localStorage.setItem('weekdayHours', weekdayHours);
    localStorage.setItem('sundayHours', sundayHours);

    showMessage('Informações de contato salvas com sucesso!');
}

// Salvar todas as alterações
function saveAllChanges() {
    // Salvar perfil
    const profileName = document.getElementById('profileName').value;
    const profileBio = document.getElementById('profileBio').value;
    const profileImage = document.getElementById('profileImage').value;

    localStorage.setItem('profileName', profileName);
    localStorage.setItem('profileBio', profileBio);
    localStorage.setItem('profileImage', profileImage);

    // Salvar links
    const links = [];
    document.querySelectorAll('.link-item-template').forEach(template => {
        links.push({
            title: template.querySelector('.link-title').value,
            url: template.querySelector('.link-url').value,
            icon: template.querySelector('.link-icon').value,
            description: template.querySelector('.link-description').value
        });
    });
    localStorage.setItem('links', JSON.stringify(links));

    // Salvar cardápio
    const menuItems = [];
    document.querySelectorAll('.menu-item-template').forEach(template => {
        menuItems.push({
            title: template.querySelector('.menu-title').value,
            description: template.querySelector('.menu-description').value,
            price: parseFloat(template.querySelector('.menu-price').value),
            category: template.querySelector('.menu-category').value,
            image: template.querySelector('.menu-image').value
        });
    });
    localStorage.setItem('menuItems', JSON.stringify(menuItems));

    // Salvar informações de contato
    const phone = document.getElementById('contactPhone').value;
    const phone2 = document.getElementById('contactPhone2').value;
    const address = document.getElementById('contactAddress').value;
    const weekdayHours = document.getElementById('weekdayHours').value;
    const sundayHours = document.getElementById('sundayHours').value;

    localStorage.setItem('contactPhone', phone);
    localStorage.setItem('contactPhone2', phone2);
    localStorage.setItem('contactAddress', address);
    localStorage.setItem('weekdayHours', weekdayHours);
    localStorage.setItem('sundayHours', sundayHours);

    showMessage('Todas as alterações foram salvas com sucesso!');
}

// Limpar cache
function clearCache() {
    localStorage.clear();
    showMessage('Cache limpo com sucesso!', 'info');
    setTimeout(() => {
        location.reload();
    }, 1000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadProfileData();
    loadLinks();
    loadMenu();
    loadContactInfo();

    // Preview da imagem do perfil
    document.getElementById('profileImage').addEventListener('input', function () {
        document.getElementById('profileImagePreview').src = this.value;
    });

    // Adicionar novo link
    document.getElementById('addLink').addEventListener('click', addLink);

    // Adicionar novo item ao cardápio
    document.getElementById('addMenuItem').addEventListener('click', addMenuItem);

    // Remover link
    document.getElementById('linksContainer').addEventListener('click', (e) => {
        if (e.target.closest('.remove-link')) {
            const index = e.target.closest('.remove-link').dataset.index;
            deleteLink(index);
        }
    });

    // Remover item do cardápio
    document.getElementById('menuContainer').addEventListener('click', (e) => {
        if (e.target.closest('.remove-menu-item')) {
            const index = e.target.closest('.remove-menu-item').dataset.index;
            deleteMenuItem(index);
        }
    });

    // Preview de imagens do cardápio
    document.getElementById('menuContainer').addEventListener('input', (e) => {
        if (e.target.classList.contains('menu-image')) {
            const preview = e.target.closest('.menu-item-template').querySelector('.menu-image-preview img');
            preview.src = e.target.value;
        }
    });

    // Salvar alterações
    document.getElementById('saveChanges').addEventListener('click', saveAllChanges);

    // Limpar cache
    document.getElementById('clearCache').addEventListener('click', clearCache);
}); 