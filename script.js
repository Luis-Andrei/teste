// Animação das bolas de futebol
class Ball {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        // Velocidade inicial entre 4 e 10
        const initialSpeed = 4 + Math.random() * 6;
        const angle = Math.random() * Math.PI * 2;
        this.dx = Math.cos(angle) * initialSpeed;
        this.dy = Math.sin(angle) * initialSpeed;
        this.mass = radius;
        this.isDragging = false;
        this.image = new Image();
        this.image.src = 'https://cdn-icons-png.flaticon.com/512/53/53283.png';
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.3;
        this.lastX = x;
        this.lastY = y;
        this.minSpeed = 4; // Velocidade mínima
        this.maxSpeed = 10; // Velocidade máxima
    }

    draw(ctx) {
        if (this.image.complete) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            
            ctx.drawImage(
                this.image,
                -this.radius,
                -this.radius,
                this.radius * 2,
                this.radius * 2
            );
            ctx.restore();
        } else {
            // Desenhar bola branca quando a imagem não estiver carregada
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff'; // Cor branca
            ctx.fill();
            ctx.strokeStyle = '#000000'; // Borda preta
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    update(balls, canvas) {
        // Atualizar rotação
        this.rotation += this.rotationSpeed;

        // Mover a bola independentemente do arrasto
        if (!this.isDragging) {
            this.x += this.dx;
            this.y += this.dy;
        }

        // Colisão com as paredes
        if (this.x + this.radius > canvas.width) {
            this.x = canvas.width - this.radius;
            this.dx = -Math.abs(this.dx) * 0.98;
            this.rotationSpeed = -this.rotationSpeed;
        }
        if (this.x - this.radius < 0) {
            this.x = this.radius;
            this.dx = Math.abs(this.dx) * 0.98;
            this.rotationSpeed = -this.rotationSpeed;
        }
        if (this.y + this.radius > canvas.height) {
            this.y = canvas.height - this.radius;
            this.dy = -Math.abs(this.dy) * 0.98;
            this.rotationSpeed = -this.rotationSpeed;
        }
        if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.dy = Math.abs(this.dy) * 0.98;
            this.rotationSpeed = -this.rotationSpeed;
        }

        // Colisão com outras bolas
        balls.forEach(ball => {
            if (ball === this) return;

            const dx = ball.x - this.x;
            const dy = ball.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.radius + ball.radius) {
                // Calcular ângulo de colisão
                const angle = Math.atan2(dy, dx);
                const sin = Math.sin(angle);
                const cos = Math.cos(angle);

                // Separar as bolas
                const overlap = (this.radius + ball.radius - distance) / 2;
                this.x -= overlap * cos;
                this.y -= overlap * sin;
                ball.x += overlap * cos;
                ball.y += overlap * sin;

                // Se não estiver arrastando, calcular colisão
                if (!this.isDragging && !ball.isDragging) {
                    // Rotacionar velocidades
                    const vx1 = this.dx * cos + this.dy * sin;
                    const vy1 = this.dy * cos - this.dx * sin;
                    const vx2 = ball.dx * cos + ball.dy * sin;
                    const vy2 = ball.dy * cos - ball.dx * sin;

                    // Calcular velocidades finais com elasticidade aumentada
                    const elasticity = 0.98;
                    const finalVx1 = ((this.mass - ball.mass) * vx1 + 2 * ball.mass * vx2) / (this.mass + ball.mass) * elasticity;
                    const finalVx2 = ((ball.mass - this.mass) * vx2 + 2 * this.mass * vx1) / (this.mass + ball.mass) * elasticity;

                    // Rotacionar de volta
                    this.dx = finalVx1 * cos - vy1 * sin;
                    this.dy = vy1 * cos + finalVx1 * sin;
                    ball.dx = finalVx2 * cos - vy2 * sin;
                    ball.dy = vy2 * cos + finalVx2 * sin;

                    // Atualizar rotação baseado na colisão
                    this.rotationSpeed = (Math.random() - 0.5) * 0.4;
                    ball.rotationSpeed = (Math.random() - 0.5) * 0.4;
                }
            }
        });

        // Aplicar fricção mínima e manter velocidade entre mínimo e máximo
        if (!this.isDragging) {
            this.dx *= 0.999;
            this.dy *= 0.999;

            // Calcular velocidade atual
            const currentSpeed = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
            
            // Ajustar velocidade se estiver fora dos limites
            if (currentSpeed < this.minSpeed || currentSpeed > this.maxSpeed) {
                const angle = Math.atan2(this.dy, this.dx);
                const targetSpeed = currentSpeed < this.minSpeed ? this.minSpeed : this.maxSpeed;
                this.dx = Math.cos(angle) * targetSpeed;
                this.dy = Math.sin(angle) * targetSpeed;
            }
        }

        // Atualizar posição anterior
        this.lastX = this.x;
        this.lastY = this.y;
    }
}

// Inicializar bolas de futebol
function initSoccerBalls() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'auto';
    canvas.style.zIndex = '0';
    canvas.style.userSelect = 'none'; // Evitar seleção de texto
    canvas.style.webkitUserSelect = 'none'; // Para navegadores WebKit
    canvas.style.msUserSelect = 'none'; // Para Internet Explorer
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const balls = [];
    let isDragging = false;
    let draggedBall = null;

    // Ajustar tamanho do canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Criar 4 bolas
    for (let i = 0; i < 4; i++) {
        const radius = 30;
        const x = Math.random() * (canvas.width - radius * 2) + radius;
        const y = Math.random() * (canvas.height - radius * 2) + radius;
        balls.push(new Ball(x, y, radius));
    }

    // Eventos do mouse
    canvas.addEventListener('mousedown', (e) => {
        e.preventDefault(); // Prevenir comportamento padrão
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        balls.forEach(ball => {
            const dx = x - ball.x;
            const dy = y - ball.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < ball.radius) {
                isDragging = true;
                draggedBall = ball;
                ball.isDragging = true;
                ball.dragStartX = x;
                ball.dragStartY = y;
                ball.dragStartTime = Date.now();
            }
        });
    });

    canvas.addEventListener('mousemove', (e) => {
        if (isDragging && draggedBall) {
            e.preventDefault(); // Prevenir comportamento padrão
            const rect = canvas.getBoundingClientRect();
            draggedBall.x = e.clientX - rect.left;
            draggedBall.y = e.clientY - rect.top;
        }
    });

    canvas.addEventListener('mouseup', (e) => {
        if (draggedBall) {
            const rect = canvas.getBoundingClientRect();
            const endX = e.clientX - rect.left;
            const endY = e.clientY - rect.top;
            const dragTime = Date.now() - draggedBall.dragStartTime;
            
            // Calcular velocidade baseada no movimento do arrasto
            const dragDistance = Math.sqrt(
                Math.pow(endX - draggedBall.dragStartX, 2) + 
                Math.pow(endY - draggedBall.dragStartY, 2)
            );
            
            // Velocidade máxima para evitar lançamentos muito fortes
            const maxSpeed = 15;
            const speed = Math.min(dragDistance / (dragTime / 100), maxSpeed);
            
            // Calcular direção do lançamento
            const angle = Math.atan2(
                endY - draggedBall.dragStartY,
                endX - draggedBall.dragStartX
            );
            
            // Aplicar velocidade
            draggedBall.dx = Math.cos(angle) * speed;
            draggedBall.dy = Math.sin(angle) * speed;
            
            draggedBall.isDragging = false;
        }
        isDragging = false;
        draggedBall = null;
    });

    // Animação
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        balls.forEach(ball => {
            ball.update(balls, canvas);
            ball.draw(ctx);
        });

        requestAnimationFrame(animate);
    }

    animate();
}

// Mostrar notificação de atualização
function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
        <p>Nova atualização disponível!</p>
        <button onclick="this.parentElement.classList.add('fade-out')">Fechar</button>
    `;
    document.body.appendChild(notification);
    
    // Remover notificação após 10 segundos
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}

// Efeito de máquina de escrever
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = ''; // Limpar o conteúdo antes de começar
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Efeito Matrix Rain
class MatrixRain {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        this.fontSize = 14;
        this.columns = 0;
        this.drops = [];
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = Array(this.columns).fill(1);
    }

    draw() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#0F0';
        this.ctx.font = this.fontSize + 'px monospace';

        for (let i = 0; i < this.drops.length; i++) {
            const text = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;

            this.ctx.fillStyle = '#0F0';
            this.ctx.fillText(text, x, y);

            if (y > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
    }

    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Inicializar tudo quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
    // Inicializar Matrix Rain
    const matrix = new MatrixRain();
    matrix.animate();

    // Título e descrição
    const title = document.querySelector(".profile h1");
    const description = document.querySelector(".profile p");
    
    if (title) {
        typeWriter(title, "@Luis Andrei", 120);
    }
    
    if (description) {
        typeWriter(description, "Olá! Bem-vindo à minha página de links\nEstudando Back-end / Front-end com Python, JavaScript e Go.", 50);
    }

    // Links
    const links = document.querySelectorAll(".link-card");
    links.forEach((link, index) => {
        const span = link.querySelector("span");
        const p = link.querySelector("p");
        
        if (span) {
            setTimeout(() => {
                typeWriter(span, span.textContent, 30);
            }, 1000 + (index * 200));
        }
        
        if (p) {
            setTimeout(() => {
                typeWriter(p, p.textContent, 20);
            }, 1200 + (index * 200));
        }
    });

    // Rodapé
    const footer = document.querySelector("footer p");
    if (footer) {
        setTimeout(() => {
            typeWriter(footer, footer.textContent, 30);
        }, 2000);
    }

    // Confetes ao clicar nos links
    document.querySelectorAll('.link-card').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const url = link.getAttribute('href');
            
            // Criar confetes
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });

            // Redirecionar após animação
            setTimeout(() => {
                window.open(url, '_blank');
            }, 500);
        });
    });

    // Efeito de pulso nos ícones
    document.querySelectorAll('.link-card i').forEach(icon => {
        icon.style.animation = 'pulse 2s infinite';
    });

    // Adicionar tags de código flutuantes
    const createFloatingCode = () => {
        const code = document.createElement('div');
        code.className = 'code-float';
        code.textContent = '<code>const vida = "desenvolvimento";</code>';
        document.body.appendChild(code);

        setTimeout(() => {
            code.remove();
        }, 5000);
    };

    setInterval(createFloatingCode, 3000);

    // Verificar atualizações
    const checkForUpdates = () => {
        const lastUpdate = localStorage.getItem('lastUpdate');
        const currentDate = new Date().toISOString().split('T')[0];

        if (!lastUpdate || lastUpdate !== currentDate) {
            showUpdateNotification();
            localStorage.setItem('lastUpdate', currentDate);
        }
    };

    // Verificar atualizações ao carregar
    checkForUpdates();
}); 