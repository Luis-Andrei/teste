@echo off
echo Configurando o Firewall do Windows...

:: Verificar se está rodando como administrador
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Este script precisa ser executado como administrador.
    echo Por favor, clique com o botão direito e selecione "Executar como administrador".
    pause
    exit /b 1
)

:: Liberar porta 8080 no firewall
echo Liberando porta 8080 no firewall...
netsh advfirewall firewall add rule name="Lancheria 3 Aliança" dir=in action=allow protocol=TCP localport=8080
netsh advfirewall firewall add rule name="Lancheria 3 Aliança" dir=out action=allow protocol=TCP localport=8080

:: Verificar se a porta está aberta
echo Verificando configuração do firewall...
netsh advfirewall firewall show rule name="Lancheria 3 Aliança"

echo.
echo Configuração concluída!
echo.
echo Para acessar o site:
echo 1. Localmente: http://localhost:8080
echo 2. Na rede: http://192.168.1.28:8080
echo 3. Externamente: http://0.0.0.0:8080
echo.
echo Importante:
echo - Certifique-se de que seu roteador está configurado para permitir conexões na porta 8080
echo - Para acesso externo, configure port forwarding na sua roteador
echo.
pause 