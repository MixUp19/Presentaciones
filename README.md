# Adaptación — presentación

Presentación del capítulo **"Adaptación"** (resumen en `Resumen.txt`), con
**Ferris**, la mascota de Rust, como apoyo visual.

## Arrancar

```bash
npm install
npm run dev        # http://localhost:4321
```

La primera vez (y en cada `dev`/`build`) se ejecuta `scripts/fetch-ferris.mjs`,
que descarga los SVG de Ferris a `public/ferris/`. Si no hay red, genera
placeholders geométricos para que la presentación nunca se rompa.

```bash
npm run build      # genera dist/
npm run preview    # sirve dist/ para probar el build
```

## Presentar

| Tecla | Acción |
|---|---|
| `→` `↓` `espacio` | siguiente |
| `←` `↑` | anterior |
| `Inicio` / `Fin` | primera / última |
| `F` | pantalla completa (y oculta el índice lateral) |
| `M` | muestra u oculta el índice |

También funciona con clic en la mitad derecha/izquierda de la pantalla y con
*swipe* en móvil. Se puede saltar a cualquier slide con el índice lateral, con
la slide de contenido o con una URL directa: `/#blue-green`.

## Cómo está armado

```
scripts/fetch-ferris.mjs   descarga los SVG de rustacean.net (+ fallback)
scripts/smoke-test.mjs     24 pruebas en Chromium headless
src/data/slides.ts         TODO el contenido: 27 slides tipadas
src/components/            SideNav, Ferris, Blocks
src/styles/global.css      tema claro
src/pages/index.astro      render de las slides + navegación
```

### Editar el contenido

Todo vive en **`src/data/slides.ts`**. Cada slide declara su pose de Ferris y
qué hacer con ella:

```ts
{
  id: 'trashing',
  title: 'Cuidado: el trashing',
  ferris: 'cuddlyferris',      // asset de /public/ferris
  tilt: -1,                    // -1 izquierda, 0 neutro, 1 derecha
  bubble: 'Esa versión salió antes de leer el feedback. Ya valió.',
  blocks: [ ... ],
}
```

Tipos de `block`: `text`, `list`, `quote`, `highlight`, `contrast`, `steps`, `note`.

Después de tocar el contenido conviene correr las pruebas (ver abajo).

## Ferris

Ferris es persistente en la esquina inferior derecha: **cambia de pose según la
slide** y **inclina el cuerpo** hacia el lado del contenido destacado. En 7
slides tiene además una burbuja de comentario.

Poses disponibles: `cuddlyferris`, `flat-happy`, `flat-gesture`, `flat-orig`, `corro`.

> **Nota sobre la mirada:** se pidió que los ojos de Ferris siguieran al elemento
> clave de cada slide. No es viable: los SVG de rustacean.net son *paths* planos
> sin `id` ni `class` (lo único identificable son grupos llamados `Layer 1`).
> Se sustituyó por la inclinación del cuerpo, que da el mismo efecto de "te está
> señalando" sin depender de la geometría interna del dibujo.

## Pruebas

```bash
npm run build
npm run preview &
node scripts/smoke-test.mjs
```

Cubren navegación por teclado, índice, deep-links, poses y burbuja de Ferris, y
que **ninguna de las 27 slides desborde** en horizontal ni vertical, tanto en
escritorio (1440×900) como en móvil (390×844).

## Créditos

Los gráficos de Ferris son de [rustacean.net](https://rustacean.net) y están
bajo licencia **CC0** (dominio público).
