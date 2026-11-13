import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
await mkdir('assets',{recursive:true}); await mkdir('public',{recursive:true});
// Typographic placeholder mark, kept inside Android's central safe area.
function svg(size,markSize) { return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="100%" height="100%" fill="#211e1a"/><text x="50%" y="50%" dy=".34em" text-anchor="middle" font-family="Georgia,serif" font-weight="bold" font-size="${markSize}" fill="#f5f0e7">BS</text></svg>`); }
await sharp(svg(1024,350)).png().toFile('assets/icon.png');
await sharp(svg(2732,640)).png().toFile('assets/splash.png');
await sharp('assets/icon.png').resize(64).png().toFile('public/favicon.png');
console.log('Ícone 1024×1024 e splash 2732×2732 gerados com fundo opaco e monograma central.');
