const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 8080;

// Configurar CORS para permitir acesso de qualquer origem
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 86400 // 24 horas
}));

// Servir arquivos estáticos com cache e headers para acesso público
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: '1d',
    setHeaders: (res, path) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        res.setHeader('Access-Control-Expose-Headers', 'Content-Range, X-Content-Range');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Cache-Control', 'public, max-age=86400');
    }
}));

app.use(express.json());

// Middleware para logging de requisições
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const ip = req.ip || req.connection.remoteAddress;
    console.log(`${timestamp} - ${req.method} ${req.url} - IP: ${ip}`);
    next();
});

// Rota principal
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    console.log('Servindo página inicial:', indexPath);
    res.sendFile(indexPath);
});

// Rota do painel administrativo
app.get('/admin', (req, res) => {
    const adminPath = path.join(__dirname, 'public', 'admin.html');
    console.log('Servindo painel administrativo:', adminPath);
    res.sendFile(adminPath);
});

// Rota de login
app.get('/login', (req, res) => {
    const loginPath = path.join(__dirname, 'public', 'login.html');
    console.log('Servindo página de login:', loginPath);
    res.sendFile(loginPath);
});

// Rota da página de registro
app.get('/register', (req, res) => {
    const registerPath = path.join(__dirname, 'public', 'register.html');
    console.log('Servindo página de registro:', registerPath);
    res.sendFile(registerPath);
});

// API para salvar dados do perfil
app.post('/api/profile', express.json(), (req, res) => {
    try {
        const { name, bio } = req.body;
        res.json({ success: true, message: 'Perfil atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao salvar perfil:', error);
        res.status(500).json({ success: false, message: 'Erro ao salvar perfil' });
    }
});

// API para salvar links
app.post('/api/links', (req, res) => {
    // Aqui você implementaria a lógica para salvar no banco de dados
    res.json({ success: true });
});

// API para salvar configurações
app.post('/api/settings', (req, res) => {
    // Aqui você implementaria a lógica para salvar no banco de dados
    res.json({ success: true });
});

// Função para obter o IP local
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const interface of interfaces[name]) {
            if (interface.family === 'IPv4' && !interface.internal) {
                return interface.address;
            }
        }
    }
    return 'localhost';
}

// Função para obter o IP público
function getPublicIP() {
    try {
        const interfaces = os.networkInterfaces();
        for (const name of Object.keys(interfaces)) {
            for (const interface of interfaces[name]) {
                if (interface.family === 'IPv4' && !interface.internal) {
                    return interface.address;
                }
            }
        }
    } catch (error) {
        console.error('Erro ao obter IP público:', error);
    }
    return '0.0.0.0';
}

// Tratamento de erros 404
app.use((req, res) => {
    console.log('404 - Arquivo não encontrado:', req.url);
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Tratamento de erros 500
app.use((err, req, res, next) => {
    console.error('Erro:', err);
    res.status(500).sendFile(path.join(__dirname, 'public', '500.html'));
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    const localIP = getLocalIP();
    console.log('\nServidor rodando em:');
    console.log(`- Local: http://localhost:${PORT}`);
    console.log(`- Network: http://${localIP}:${PORT}`);
    console.log(`- External: http://${getPublicIP()}:${PORT}`);
    console.log(`Diretório público: ${path.join(__dirname, 'public')}`);
    console.log('\nPara acessar o site:');
    console.log(`1. Localmente: http://localhost:${PORT}`);
    console.log(`2. Na rede: http://${localIP}:${PORT}`);
    console.log(`3. Externamente: http://${getPublicIP()}:${PORT}`);
    console.log(`4. Painel Admin: http://${getPublicIP()}:${PORT}/admin`);
    console.log(`5. Login: http://${getPublicIP()}:${PORT}/login`);
    console.log('\nImportante:');
    console.log('- Certifique-se de que a porta 8080 está liberada no firewall');
    console.log('- Para acesso externo, configure port forwarding na sua roteador');
});

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
    console.error('Erro não capturado:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Promessa rejeitada não tratada:', reason);
}); 