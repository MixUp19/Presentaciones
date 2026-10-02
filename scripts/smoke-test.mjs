/**
 * Prueba funcional de la presentación con Chromium headless.
 * Uso: node scripts/smoke-test.mjs
 */
import { chromium } from 'playwright-core';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:4321';
const results = [];

const check = (name, pass, detail = '') => {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASA' : 'FALLA'}  ${name}${detail ? ` — ${detail}` : ''}`);
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(String(e)));

await page.goto(BASE, { waitUntil: 'networkidle' });

const total = await page.locator('[data-slide]').count();
check('slides renderizadas', total > 0, `${total} slides`);

// --- Ferris visible y con imagen cargada realmente
await page.waitForFunction(() => {
  const img = document.querySelector('[data-ferris-img]');
  return img && img.complete && img.naturalWidth > 0;
}, null, { timeout: 5000 });
check('Ferris carga la imagen real', true);

// --- Slide activa inicial
const activeCount = await page.locator('[data-slide][data-active="true"]').count();
check('exactamente una slide activa', activeCount === 1);

// --- Teclado: avanzar
await page.keyboard.press('ArrowRight');
await page.waitForTimeout(120);
let idx = await page.evaluate(() =>
  [...document.querySelectorAll('[data-slide]')].findIndex((s) => s.dataset.active === 'true')
);
check('flecha derecha avanza', idx === 1, `slide ${idx + 1}`);

// --- Ferris cambia de pose (slide 2 = "Contenido" -> flat-happy)
const assetAfter = await page.getAttribute('[data-ferris-img]', 'data-asset');
check('Ferris cambia de pose', assetAfter === 'flat-happy', assetAfter);

// --- Retroceder
await page.keyboard.press('ArrowLeft');
await page.waitForTimeout(120);
idx = await page.evaluate(() =>
  [...document.querySelectorAll('[data-slide]')].findIndex((s) => s.dataset.active === 'true')
);
check('flecha izquierda retrocede', idx === 0, `slide ${idx + 1}`);

// --- Barra de progreso y contador
const width = await page.evaluate(() => document.querySelector('[data-progress]').style.width);
check('barra de progreso avanza', parseFloat(width) > 0, width);

const counterText = await page.textContent('[data-counter-current]');
check('contador marca la slide', counterText === '1', counterText ?? '');

// --- El asset corresponde a la slide 11 ("Trashing" -> cuddlyferris)
await page.locator('[data-nav-link="10"]').click();
await page.waitForTimeout(150);
const asset11 = await page.getAttribute('[data-ferris-img]', 'data-asset');
check('pose sigue a la slide', asset11 === 'cuddlyferris', asset11);

// --- Índice lateral: la slide activa queda marcada
const current = await page.locator('[data-nav-link][aria-current="true"]').count();
check('índice marca la slide activa', current === 1);

// --- La inclinación de Ferris se actualiza (tilt = -1 en trashing)
const tilt = await page.getAttribute('[data-ferris]', 'data-tilt');
check('Ferris inclina el cuerpo', tilt === '-1', `data-tilt=${tilt}`);

// --- La burbuja aparece y muestra exactamente lo que declara la slide.
// No se comprueba contra una palabra fija: si se edita el texto de la burbuja,
// la prueba debe seguir comparando el DOM con el dato, no con un literal.
const expectedBubble = await page.getAttribute('[data-slide][data-active="true"]', 'data-ferris-bubble');
const bubbleText = await page.textContent('.ferris__bubble').catch(() => null);
check(
  'burbuja de Ferris aparece',
  !!expectedBubble && bubbleText?.trim() === expectedBubble.trim(),
  `${bubbleText?.slice(0, 42)} vs ${expectedBubble?.slice(0, 42)}`
);

// --- Y desaparece al pasar a una slide sin burbuja
await page.keyboard.press('ArrowRight');
await page.waitForTimeout(200);
const bubbleGone = await page.evaluate(() => !document.querySelector('.ferris__bubble'));
check('la burbuja se retira si no aplica', bubbleGone);

// --- deep-link por hash en carga
await page.goto(`${BASE}/#contexto-implicito`, { waitUntil: 'networkidle' });
await page.waitForTimeout(200);
const hashTitle = await page.textContent('.slide[data-active="true"] .slide__title');
check('deep-link por hash funciona', hashTitle?.includes('contexto implícito'), hashTitle);

// --- Índice lateral: enlace activo y salto por click
await page.locator('[data-nav-link="10"]').click();
await page.waitForTimeout(150);
idx = await page.evaluate(() =>
  [...document.querySelectorAll('[data-slide]')].findIndex((s) => s.dataset.active === 'true')
);
check('índice lateral salta a la slide', idx === 10, `slide ${idx + 1}`);

// --- Ninguna slide desborda la pantalla (desktop ni móvil)
// Importante: hay que activar cada slide antes de medir. Las inactivas tienen
// display:none y su getBoundingClientRect() devuelve ceros -> no se detectarían.
async function layoutReport(viewport) {
  await page.setViewportSize(viewport);
  await page.waitForTimeout(250);
  const vOverflow = [];
  const hOverflow = [];
  const ids = await page.evaluate(() =>
    [...document.querySelectorAll('[data-slide]')].map((s) => s.id)
  );

  for (const id of ids) {
    await page.evaluate((x) => { location.hash = `#${x}`; }, id);
    // Espera a que la slide quede activa y termine la animación de entrada.
    await page.waitForFunction(
      (x) => document.querySelector(`#${CSS.escape(x)}`)?.dataset.active === 'true',
      id,
      { timeout: 3000 }
    );
    await page.waitForTimeout(340);

    const m = await page.evaluate((x) => {
      const inner = document.querySelector(`#${CSS.escape(x)} .slide__inner`);
      return {
        v: Math.round(inner.getBoundingClientRect().bottom - innerHeight),
        h: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    }, id);

    if (m.v > 1) vOverflow.push(`${id} (+${m.v}px)`);
    if (m.h > 1) hOverflow.push(`${id} (+${m.h}px)`);
  }
  return { vOverflow, hOverflow };
}

const desktopLayout = await layoutReport({ width: 1440, height: 900 });
check(
  'desktop: ninguna slide desborda en vertical',
  desktopLayout.vOverflow.length === 0,
  desktopLayout.vOverflow.join(', ')
);
check(
  'desktop: ninguna slide desborda en horizontal',
  desktopLayout.hOverflow.length === 0,
  desktopLayout.hOverflow.join(', ')
);

const mobileLayout = await layoutReport({ width: 390, height: 844 });
check(
  'móvil: ninguna slide desborda en vertical',
  mobileLayout.vOverflow.length === 0,
  mobileLayout.vOverflow.join(', ')
);
check(
  'móvil: ninguna slide desborda en horizontal',
  mobileLayout.hOverflow.length === 0,
  mobileLayout.hOverflow.join(', ')
);

// --- Móvil: índice colapsado y hamburguesa visible
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(500);
const toggleVisible = await page.locator('[data-nav-toggle]').isVisible();
check('móvil: botón de índice visible', toggleVisible);

const navHidden = await page.evaluate(
  () => document.querySelector('.sidenav').getBoundingClientRect().right <= 1
);
check('móvil: índice colapsado', navHidden);

await page.locator('[data-nav-toggle]').click();
await page.waitForTimeout(300);
const navOpen = await page.evaluate(
  () => document.querySelector('.sidenav').getBoundingClientRect().left >= -1
);
check('móvil: índice se abre', navOpen);

// --- Imágenes de Ferris: ninguna rota en todo el recorrido
const broken = await page.evaluate(async () => {
  const urls = ['cuddlyferris', 'flat-happy', 'flat-gesture', 'flat-orig', 'corro'];
  const bad = [];
  for (const u of urls) {
    const res = await fetch(`/ferris/${u}.svg`);
    if (!res.ok) bad.push(`${u} (${res.status})`);
  }
  return bad;
});
check('los 5 assets de Ferris responden 200', broken.length === 0, broken.join(', ') || 'todos ok');

check('sin errores de consola', errors.length === 0, errors.slice(0, 3).join(' | '));

await browser.close();

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} pruebas pasaron`);
process.exit(failed.length ? 1 : 0);
