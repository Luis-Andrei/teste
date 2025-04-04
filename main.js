// Mobile Navigation Toggle
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

burger.addEventListener('click', () => {
    // Toggle Navigation
    nav.classList.toggle('nav-active');

    // Animate Links
    navLinks.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });

    // Burger Animation
    burger.classList.toggle('toggle');
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Form Submission
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    // Here you would typically send the data to a server
    console.log('Form submitted:', data);

    // Show success message
    alert('Mensagem enviada com sucesso!');
    contactForm.reset();
});

// Scroll Animation
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Add CSS for nav-active class
const style = document.createElement('style');
style.textContent = `
    .nav-active {
        display: flex;
        flex-direction: column;
        position: fixed;
        right: 0;
        top: 0;
        height: 100vh;
        background: var(--background);
        padding: 2rem;
        box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    }

    .nav-active li {
        margin: 1rem 0;
    }

    .toggle .line1 {
        transform: rotate(-45deg) translate(-5px, 6px);
    }

    .toggle .line2 {
        opacity: 0;
    }

    .toggle .line3 {
        transform: rotate(45deg) translate(-5px, -6px);
    }

    @keyframes navLinkFade {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    section {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }

    section.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Profile Image Upload
const profileImg = document.getElementById('profile-img');
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'image/*';

// Adicionar cursor pointer à imagem
profileImg.style.cursor = 'pointer';

// Adicionar título ao passar o mouse
profileImg.title = 'Clique para alterar a foto';

profileImg.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        // Verificar o tamanho do arquivo (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('A imagem deve ter no máximo 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            profileImg.src = e.target.result;
            // Salvar a imagem no localStorage
            localStorage.setItem('profileImage', e.target.result);
            alert('Foto atualizada com sucesso!');
        };
        reader.readAsDataURL(file);
    }
});

// Carregar imagem salva do localStorage
const savedImage = localStorage.getItem('profileImage');
if (savedImage) {
    profileImg.src = savedImage;
}

// Adicionar efeito hover na imagem
profileImg.addEventListener('mouseenter', () => {
    profileImg.style.opacity = '0.8';
    profileImg.style.transform = 'scale(1.05)';
});

profileImg.addEventListener('mouseleave', () => {
    profileImg.style.opacity = '1';
    profileImg.style.transform = 'scale(1)';
});

// Add hover effect to link cards
document.querySelectorAll('.link-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-2px)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
}); 