@echo off
echo Atualizando todos os arquivos...

:: Criar diretórios necessários
if not exist "logs" mkdir logs
if not exist "public\images" mkdir public\images
if not exist "public\css" mkdir public\css
if not exist "public\js" mkdir public\js

:: Instalar/atualizar dependências
echo Instalando dependências...
call npm install
call npm install -g pm2

:: Parar e remover instância existente do servidor
echo Parando servidor existente...
call pm2 stop dashboard
call pm2 delete dashboard

:: Limpar cache do navegador
echo Limpando cache...
del /s /q "%LOCALAPPDATA%\Google\Chrome\User Data\Default\Cache\*.*"
del /s /q "%LOCALAPPDATA%\Microsoft\Edge\User Data\Default\Cache\*.*"

:: Iniciar o servidor com PM2
echo Iniciando o servidor com PM2...
call pm2 start ecosystem.config.js

:: Mostrar mensagem de sucesso
echo.
echo Atualização concluída com sucesso!
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
echo Importante:
echo - Limpe o cache do seu navegador (Ctrl+F5)
echo - Se necessário, reinicie o computador
echo.
pause 