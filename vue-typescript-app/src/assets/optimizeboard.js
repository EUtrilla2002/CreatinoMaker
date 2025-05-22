import fs from 'fs';
import path from 'path';
import { optimize } from 'svgo';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const svgPath = path.resolve(__dirname, 'board.svg');
const svgContent = fs.readFileSync(svgPath, 'utf8');

// Regex para capturar IDs de paths con GPIO o GND
const regexId = /<path[^>]*id="([^"]*(GPIO|GND)[^"]*)"[^>]*>/gi;

const ids = [];
let match;
while ((match = regexId.exec(svgContent)) !== null) {
  ids.push(match[1]);
}

console.log('IDs encontrados para mantener:', ids);

const svgoConfig = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // Mantener IDs de los paths GPIO/GND
          removeUnknownsAndDefaults: {
            keepIds: ids
          }
        }
      }
    },
    'convertShapeToPath',    // Convierte todo a paths planos
    'removeUselessDefs',
    'convertStyleToAttrs',
    'mergePaths'
  ]
};

const result = optimize(svgContent, { path: svgPath, ...svgoConfig });

fs.writeFileSync(path.resolve(__dirname, 'board_plain.svg'), result.data);

console.log('SVG optimizado y plano con paths GPIO/GND intactos');
