@echo off
echo Abrindo o site da Lancheria 3 Aliança...

:: Iniciar o servidor se não estiver rodando
pm2 list | findstr "dashboard" >nul
if errorlevel 1 (
    echo Iniciando o servidor...
    call pm2 start ecosystem.config.js
    timeout /t 2 /nobreak >nul
)

:: Abrir o site no navegador padrão
start http://localhost:8080

echo.
echo Site aberto com sucesso!
echo.
echo URLs disponíveis:
echo 1. Local: http://localhost:8080
echo 2. Rede: http://192.168.1.28:8080
echo 3. Admin: http://localhost:8080/admin
echo.
echo Comandos úteis:
echo - Para ver os logs: pm2 logs dashboard
echo - Para parar o servidor: pm2 stop dashboard
echo - Para reiniciar o servidor: pm2 restart dashboard
echo.
pause 