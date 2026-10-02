import { bundle } from '@remotion/bundler'
import { ensureBrowser, renderMedia, renderStill, selectComposition } from '@remotion/renderer'
import { resolve } from 'node:path'
import { rename } from 'node:fs/promises'
import { FILM, REVIEW_FRAMES } from '../src/film.ts'

const root = resolve(import.meta.dir, '..')
const mode = process.argv[2]
if (mode !== 'video' && mode !== 'stills') throw new Error('Use video or stills')
const serveUrl = await bundle({
  entryPoint: resolve(root, 'src/register.ts'),
  outDir: resolve(root, 'dist/bundle'),
  publicDir: resolve(root, 'assets'),
})
const browser = await ensureBrowser()
if (browser.type !== 'local-puppeteer-browser' && browser.type !== 'user-defined-path')
  throw new Error('Rendering browser unavailable')
const browserExecutable = browser.path
const composition = await selectComposition({ serveUrl, id: FILM.id, browserExecutable })
if (mode === 'stills') {
  for (const shot of REVIEW_FRAMES) {
    await renderStill({
      serveUrl,
      composition,
      frame: shot.frame,
      output: resolve(root, `review/${shot.name}.png`),
      imageFormat: 'png',
      browserExecutable,
    })
    process.stdout.write(`关键画面 ${shot.name}\n`)
  }
} else {
  const output = resolve(root, 'exports/ducoro-agent-group-v1-en.mp4')
  let previous = -1
  await renderMedia({
    serveUrl,
    composition,
    codec: 'h264',
    crf: 17,
    pixelFormat: 'yuv420p',
    imageFormat: 'png',
    concurrency: 4,
    browserExecutable,
    outputLocation: output,
    onProgress: ({ progress }) => {
      const step = Math.floor(progress * 10)
      if (step > previous) {
        process.stdout.write(`渲染 ${step * 10}%\n`)
        previous = step
      }
    },
  })
  // 直接封装剪接后的 AAC 数据，Studio 与导出播放同一份配乐和点击混音。
  const restored = resolve(root, 'dist/ducoro-agent-group-muxed.mp4')
  const mux = Bun.spawnSync([
    'ffmpeg',
    '-hide_banner',
    '-loglevel',
    'error',
    '-y',
    '-i',
    output,
    '-i',
    resolve(root, 'assets/music/film-music.m4a'),
    '-map',
    '0:v:0',
    '-map',
    '1:a:0',
    '-c',
    'copy',
    '-movflags',
    '+faststart',
    restored,
  ])
  if (mux.exitCode !== 0) throw new Error(mux.stderr.toString())
  await rename(restored, output)
}
