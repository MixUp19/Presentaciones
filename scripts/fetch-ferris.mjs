#!/usr/bin/env node
/**
 * Descarga los SVG de Ferris desde rustacean.net a public/ferris/.
 *
 * Todos los assets de rustacean.net son CC0 (dominio público). Ver README.
 *
 * Si la red falla, NO rompe el build: genera un cangrejo geométrico con la
 * misma viewBox que el asset original para que la presentación siga viéndose
 * bien sin conexión.
 */
import { mkdir, writeFile, access } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'public/ferris');
const BASE = 'https://rustacean.net/assets';

/**
 * name      -> nombre del archivo generado
 * sources   -> URLs candidatas (se prueban en orden)
 * viewBox   -> usado por el fallback
 * style     -> variante del fallback
 */
const ASSETS = [
  { name: 'cuddlyferris', viewBox: '0 0 4417 3259', style: 'face',   sources: [`${BASE}/cuddlyferris.svg`] },
  { name: 'flat-happy',   viewBox: '0 0 1200 800',    style: 'happy',  sources: [`${BASE}/rustacean-flat-happy.svg`] },
  { name: 'flat-gesture', viewBox: '0 0 1200 800',    style: 'gesture',sources: [`${BASE}/rustacean-flat-gesture.svg`] },
  { name: 'flat-orig',    viewBox: '0 0 1200 800',    style: 'orig',   sources: [`${BASE}/rustacean-orig-noshadow.svg`] },
  { name: 'corro',        viewBox: '0 0 1055.378 862.309', style: 'run', sources: [`${BASE}/corro.svg`] },
];

const exists = (p) => access(p).then(() => true, () => false);

function placeholder({ viewBox, style }) {
  // Cangrejo geométrico con la misma viewBox, para no romper el layout.
  const body = style === 'run'
    // versión "corriendo": cuerpo inclinado
    ? `<g transform="rotate(-8 600 560)">
         <rect x="380" y="470" width="440" height="300" rx="150" fill="#dea584" stroke="#b7410e" stroke-width="14"/>
         <rect x="250" y="530" width="150" height="26"  rx="13" fill="#b7410e"/>
         <rect x="250" y="620" width="150" height="26"  rx="13" fill="#b7410e"/>
         <rect x="800" y="530" width="150" height="26"  rx="13" fill="#b7410e"/>
         <rect x="800" y="620" width="150" height="26"  rx="13" fill="#b7410e"/>
         <circle cx="600" cy="410" r="20" fill="#3f2a1e"/>
         <rect x="470" y="360" width="70" height="90" rx="35" fill="#fff" stroke="#3f2a1e" stroke-width="12"/>
         <rect x="660" y="360" width="70" height="90" rx="35" fill="#fff" stroke="#3f2a1e" stroke-width="12"/>
         <circle cx="512" cy="405" r="18" fill="#3f2a1e"/>
         <circle cx="688" cy="405" r="18" fill="#3f2a1e"/>
       </g>`
    // versión de pie
    : `<rect x="380" y="470" width="440" height="300" rx="150" fill="#dea584" stroke="#b7410e" stroke-width="14"/>
       <rect x="250" y="530" width="150" height="26" rx="13" fill="#b7410e"/>
       <rect x="250" y="620" width="150" height="26" rx="13" fill="#b7410e"/>
       <rect x="800" y="530" width="150" height="26" rx="13" fill="#b7410e"/>
       <rect x="800" y="620" width="150" height="26" rx="13" fill="#b7410e"/>
       <rect x="470" y="360" width="70" height="90" rx="35" fill="#fff" stroke="#3f2a1e" stroke-width="12"/>
       <rect x="660" y="360" width="70" height="90" rx="35" fill="#fff" stroke="#3f2a1e" stroke-width="12"/>
       <circle cx="512" cy="405" r="18" fill="#3f2a1e"/>
       <circle cx="688" cy="405" r="18" fill="#3f2a1e"/>
       <path d="M540 500 Q600 560 660 500" stroke="#3f2a1e" stroke-width="14" fill="none" stroke-linecap="round"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-label="Ferris">
  <g>${body}</g>
</svg>
`;
}

async function download(url, timeoutMs = 12000) {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(timeoutMs),
    headers: { 'user-agent': 'presentacion-fetch-ferris' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  if (!/<svg[\s>]/i.test(text)) throw new Error('la respuesta no es un SVG');
  if (text.length < 200) throw new Error('SVG sospechosamente vacío');
  return text;
}

await mkdir(OUT, { recursive: true });

let downloaded = 0;
let reused = 0;
let fallback = 0;

for (const asset of ASSETS) {
  const file = resolve(OUT, `${asset.name}.svg`);

  // Conserva lo ya descargado: no re-descargar en cada `astro dev`.
  if (await exists(file)) {
    reused++;
    continue;
  }

  let svg = null;
  for (const url of asset.sources) {
    try {
      svg = await download(url);
      break;
    } catch (err) {
      console.warn(`  ! ${asset.name}: ${url} -> ${err.message}`);
    }
  }

  if (svg) {
    await writeFile(file, svg, 'utf8');
    downloaded++;
  } else {
    await writeFile(file, placeholder(asset), 'utf8');
    fallback++;
    console.warn(`  ! ${asset.name}: sin red, se usó el placeholder`);
  }
}

console.log(`[ferris] ${downloaded} descargados · ${reused} en caché · ${fallback} placeholder(s)`);
if (fallback > 0) {
  console.warn('[ferris] Revisa tu conexión y ejecuta `npm run fetch:ferris` para reintentar.');
}
