import { createServer } from 'vite';

async function startServer() {
    try {
        const server = await createServer({
            server: {
                host: '0.0.0.0',
                port: 8080,
                strictPort: true,
                hmr: {
                    overlay: false
                },
                watch: {
                    usePolling: true,
                    interval: 1000
                },
                cors: true,
                proxy: {
                    '/api': {
                        target: 'http://localhost:8080',
                        changeOrigin: true
                    }
                }
            }
        });

        await server.listen();
        console.log('Servidor rodando em:');
        console.log('Local: http://localhost:8080/');
        console.log('Rede: http://192.168.1.28:8080/');
        console.log('\nPara acessar de outros dispositivos na rede, use o endereço:');
        console.log('http://192.168.1.28:8080/');
    } catch (error) {
        console.error('Erro ao iniciar o servidor:', error);
    }
}

startServer();