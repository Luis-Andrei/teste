// Sistema de atualização automática
class AutoUpdater {
    constructor() {
        this.lastUpdate = null;
        this.updateInterval = 5 * 60 * 1000; // 5 minutos
        this.init();
    }

    async init() {
        // Verifica atualizações imediatamente
        await this.checkForUpdates();
        
        // Configura verificação periódica
        setInterval(() => this.checkForUpdates(), this.updateInterval);
    }

    async checkForUpdates() {
        try {
            const response = await fetch(window.location.href, {
                method: 'HEAD',
                cache: 'no-cache'
            });
            
            const lastModified = new Date(response.headers.get('Last-Modified'));
            
            if (!this.lastUpdate || lastModified > this.lastUpdate) {
                this.lastUpdate = lastModified;
                this.showUpdateNotification();
            }
        } catch (error) {
            console.error('Erro ao verificar atualizações:', error);
        }
    }

    showUpdateNotification() {
        // Cria elemento de notificação
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        
        const message = document.createElement('p');
        message.textContent = 'Nova atualização disponível!';
        
        const button = document.createElement('button');
        button.textContent = 'Atualizar';
        button.onclick = () => window.location.reload();
        
        notification.appendChild(message);
        notification.appendChild(button);
        
        // Adiciona ao documento
        document.body.appendChild(notification);
        
        // Remove após 10 segundos
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 10000);
    }
}

// Inicializa o sistema de atualização
document.addEventListener('DOMContentLoaded', () => {
    new AutoUpdater();
}); 