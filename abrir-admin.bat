@echo off
echo Abrindo o Painel Administrativo da Lancheria 3 Aliança...

:: Iniciar o servidor se não estiver rodando
pm2 list | findstr "dashboard" >nul
if errorlevel 1 (
    echo Iniciando o servidor...
    call pm2 start ecosystem.config.js
    timeout /t 2 /nobreak >nul
)

:: Abrir o painel administrativo no navegador padrão
start http://localhost:8080/admin

echo.
echo Painel Administrativo aberto com sucesso!
echo.
echo URLs disponíveis:
echo 1. Admin: http://localhost:8080/admin
echo 2. Login: http://localhost:8080/login
echo 3. Site: http://localhost:8080
echo.
echo Comandos úteis:
echo - Para ver os logs: pm2 logs dashboard
echo - Para parar o servidor: pm2 stop dashboard
echo - Para reiniciar o servidor: pm2 restart dashboard
echo.
echo Dicas:
echo - Use Ctrl+F5 para atualizar a página
echo - Se não conseguir acessar, tente fazer logout e login novamente
echo.
pause Iniciar
