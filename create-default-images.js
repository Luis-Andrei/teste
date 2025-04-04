const fs = require('fs');
const path = require('path');

// Criar diretório de imagens se não existir
const imagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// Imagem padrão do perfil (SVG)
const profileSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <rect width="200" height="200" fill="#eeeeee"/>
    <text x="100" y="100" font-family="Arial" font-size="24" fill="#999999" text-anchor="middle" dominant-baseline="middle">Perfil</text>
</svg>`;

// Imagem padrão do fundo (SVG)
const backgroundSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
    <rect width="1920" height="1080" fill="#eeeeee"/>
    <text x="960" y="540" font-family="Arial" font-size="48" fill="#999999" text-anchor="middle" dominant-baseline="middle">Fundo</text>
</svg>`;

// Salvar imagens
fs.writeFileSync(path.join(imagesDir, 'profile.svg'), profileSvg);
fs.writeFileSync(path.join(imagesDir, 'background.svg'), backgroundSvg);

console.log('Imagens padrão criadas com sucesso!'); 