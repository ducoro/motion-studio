import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import { copyFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { ClaudeMark } from '../sources/brands/ClaudeMark.tsx'
import { CodexMark } from '../sources/brands/CodexMark.tsx'
import { CursorMark } from '../sources/brands/CursorMark.tsx'
import { OpenClawMark } from '../sources/brands/OpenClawMark.tsx'
import { OpenCodeMark } from '../sources/brands/OpenCodeMark.tsx'
import { PiMark } from '../sources/brands/PiMark.tsx'
import { GeminiMark } from '../sources/brands/GeminiMark.tsx'
import BRAND_GLYPH_PATHS from '../sources/brands/glyph-paths.json'
import { BRAND_TILES, type BrandTileId } from '../src/brands.ts'

const root = resolve(import.meta.dir, '..')
await copyFile(
  resolve(root, 'sources/brands/ducoro-app-icon.png'),
  resolve(root, 'assets/ducoro-app-icon.png'),
)
for (const [name, component] of Object.entries({
  claude: ClaudeMark,
  codex: CodexMark,
  cursor: CursorMark,
  openclaw: OpenClawMark,
  opencode: OpenCodeMark,
  pi: PiMark,
  gemini: GeminiMark,
})) {
  const ink = BRAND_TILES[name as BrandTileId].ink
  let svg = renderToStaticMarkup(createElement(component, {})).replace(
    '<svg ',
    `<svg xmlns="http://www.w3.org/2000/svg" style="color:${ink}" `,
  )
  if (name === 'claude') svg = svg.replace('fill="#D97757"', 'fill="#fff"')
  await writeFile(resolve(root, `assets/${name}.svg`), svg + '\n')
}

for (const [name, brand] of Object.entries({
  grok: 'xai',
  kimi: 'moonshot',
  glm: 'zai',
  qwen: 'qwen',
  deepseek: 'deepseek',
  mistral: 'mistral',
  minimax: 'minimax',
})) {
  const shape = BRAND_GLYPH_PATHS[brand as keyof typeof BRAND_GLYPH_PATHS] as {
    path: string
    viewBox?: string
    fillRule?: 'evenodd' | 'nonzero'
  }
  if (!shape) throw new Error(`Missing brand glyph: ${brand}`)
  const ink = BRAND_TILES[name as BrandTileId].ink
  const svg = renderToStaticMarkup(
    createElement(
      'svg',
      { xmlns: 'http://www.w3.org/2000/svg', viewBox: shape.viewBox ?? '0 0 24 24' },
      createElement('path', { d: shape.path, fill: ink, fillRule: shape.fillRule }),
    ),
  )
  await writeFile(resolve(root, `assets/${name}.svg`), svg + '\n')
}
