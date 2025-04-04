@echo off
echo Iniciando o servidor...

:: Criar diretórios necessários
if not exist "logs" mkdir logs
if not exist "public\images" mkdir public\images

:: Instalar dependências se necessário
if not exist "node_modules" (
    echo Instalando dependências...
    call npm install
)

:: Parar e remover instância existente do servidor
echo Parando servidor existente...
call pm2 stop dashboard
call pm2 delete dashboard

:: Iniciar o servidor com PM2
echo Iniciando o servidor com PM2...
call pm2 start ecosystem.config.js

:: Mostrar mensagem de sucesso
echo.
echo Servidor iniciado com sucesso!
echo.
echo Para acessar o site:
echo 1. Localmente: http://localhost:8080
echo 2. Na rede: http://192.168.1.28:8080
echo 3. Externamente: http://0.0.0.0:8080
echo.
echo Comandos úteis:
echo - Para ver os logs: pm2 logs dashboard
echo - Para parar o servidor: pm2 stop dashboard
echo - Para reiniciar o servidor: pm2 restart dashboard
echo.
pause 