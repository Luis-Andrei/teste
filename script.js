// Função para carregar dados do perfil
function loadProfileData() {
    const name = localStorage.getItem('profileName') || 'Lancheria 3 Aliança';
    const bio = localStorage.getItem('profileBio') || 'Bem-vindo à nossa lanchonete!';
    const profileImage = localStorage.getItem('profileImage') || 'https://via.placeholder.com/150?text=LA';
    const backgroundImage = localStorage.getItem('backgroundImage') || 'https://via.placeholder.com/1920x1080?text=Lancheria+3+Aliança';

    document.getElementById('profileName').textContent = name;
    document.getElementById('profileBio').textContent = bio;

    // Carregar imagem de perfil com fallback
    const profileImg = document.getElementById('profileImage');
    profileImg.src = profileImage;
    profileImg.onerror = function () {
        this.src = 'https://via.placeholder.com/150?text=LA';
    };

    // Aplicar imagem de fundo com fallback
    if (backgroundImage) {
        document.body.style.backgroundImage = `url('${backgroundImage}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundAttachment = 'fixed';
    }
}

// Função para carregar links
function loadLinks() {
    const links = JSON.parse(localStorage.getItem('links')) || [
        {
            title: 'Cardápio',
            url: '#menu',
            icon: 'fa-utensils',
            description: 'Confira nosso cardápio completo'
        },
        {
            title: 'WhatsApp',
            url: '#',
            icon: 'fa-whatsapp',
            description: 'Fale conosco pelo WhatsApp'
        },
        {
            title: 'Instagram',
            url: '#',
            icon: 'fa-instagram',
            description: 'Siga-nos no Instagram'
        }
    ];

    const linksContainer = document.getElementById('linksContainer');
    linksContainer.innerHTML = '';

    links.forEach(link => {
        const linkElement = createLinkElement(link);
        linksContainer.appendChild(linkElement);
    });
}

function createLinkElement(link) {
    const a = document.createElement('a');
    a.href = link.url;
    a.className = 'link-item';
    a.innerHTML = `
        <div class="link-icon">
            <i class="fab ${link.icon}"></i>
        </div>
        <div class="link-info">
            <h3 class="link-title">${link.title}</h3>
            <p class="link-description">${link.description}</p>
        </div>
    `;
    return a;
}

// Função para carregar imagens do menu
function loadMenuImages() {
    const menuContainer = document.querySelector('.menu-images');
    const menuImages = JSON.parse(localStorage.getItem('menuImages') || '[]');

    menuContainer.innerHTML = '';
    menuImages.forEach(image => {
        const imageElement = document.createElement('div');
        imageElement.className = 'menu-image-item';
        imageElement.innerHTML = `
            <img src="${image.url}" alt="${image.title}">
            <div class="menu-image-info">
                <h3>${image.title}</h3>
                <p>${image.description}</p>
            </div>
        `;
        menuContainer.appendChild(imageElement);
    });
}

// Função para fechar o modal
function closeModal() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    modal.style.display = "none";
    modalImg.classList.remove('zoomed');
    modalImg.style.transform = 'scale(1)';
}

// Função para carregar tema
function loadTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', theme);
}

// Função para scroll suave
function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Função para animações de scroll
function scrollAnimations() {
    const elements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.5s ease-out';
        observer.observe(element);
    });
}

// Função para carregar a imagem de fundo
function loadBackgroundImage() {
    const backgroundImage = localStorage.getItem('backgroundImage');
    if (backgroundImage) {
        document.body.style.setProperty('--background-image', `url(${backgroundImage})`);
    }
}

// Função para carregar cardápio
function loadMenu() {
    const menuItems = JSON.parse(localStorage.getItem('menuImages')) || [];
    const menuContainer = document.getElementById('menuContainer');
    menuContainer.innerHTML = '';

    menuItems.forEach(item => {
        const menuElement = createMenuElement(item);
        menuContainer.appendChild(menuElement);
    });
}

function createMenuElement(item) {
    const div = document.createElement('div');
    div.className = 'menu-item';
    div.innerHTML = `
        <img src="${item.url}" alt="${item.title}" class="menu-image">
        <div class="menu-content">
            <h3 class="menu-title">${item.title}</h3>
            <p class="menu-description">${item.description}</p>
            <p class="menu-price">R$ ${parseFloat(item.price).toFixed(2)}</p>
            <span class="menu-category">${item.category}</span>
        </div>
    `;
    return div;
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    loadProfileData();
    loadLinks();
    loadMenu();
    loadTheme();
    smoothScroll();
    scrollAnimations();
    loadBackgroundImage();

    // Adicionar evento para fechar o modal
    const modal = document.getElementById('imageModal');
    const closeBtn = document.querySelector('.close-modal');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Fechar modal ao clicar fora da imagem
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Fechar modal com a tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}); 