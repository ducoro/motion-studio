import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { deflateSync } from 'node:zlib'
import { GLASS, glassSample } from '../src/glass/optics.ts'

function pngChunk(type: string, data: Buffer) {
  const body = Buffer.concat([Buffer.from(type), data])
  let crc = 0xffffffff
  for (const byte of body) {
    crc ^= byte
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0)
  }
  const result = Buffer.alloc(data.length + 12)
  result.writeUInt32BE(data.length, 0)
  body.copy(result, 4)
  result.writeUInt32BE((crc ^ 0xffffffff) >>> 0, result.length - 4)
  return result
}

function png(width: number, height: number, rows: Buffer) {
  const header = Buffer.alloc(13)
  header.writeUInt32BE(width, 0)
  header.writeUInt32BE(height, 4)
  header[8] = 8
  header[9] = 6
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk('IHDR', header),
    pngChunk('IDAT', deflateSync(rows)),
    pngChunk('IEND', Buffer.alloc(0)),
  ])
}

const width = Math.ceil(GLASS.width)
const height = Math.ceil(GLASS.height)
const stride = width * 4 + 1
const displacement = Buffer.alloc(stride * height)
const highlights = Buffer.alloc(stride * height)
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const sample = glassSample(
      ((x + 0.5) * GLASS.width) / width,
      ((y + 0.5) * GLASS.height) / height,
    )
    const position = y * stride + 1 + x * 4
    displacement[position] = Math.round(128 + (sample.dx / GLASS.displacementScale) * 255)
    displacement[position + 1] = Math.round(128 + (sample.dy / GLASS.displacementScale) * 255)
    displacement[position + 2] = 128
    displacement[position + 3] = 255
    highlights.fill(255, position, position + 3)
    highlights[position + 3] = Math.round(sample.highlight * 255)
  }
}
const directory = resolve(import.meta.dir, '../assets/glass')
await mkdir(directory, { recursive: true })
await writeFile(
  resolve(directory, 'optics.json'),
  JSON.stringify({
    width,
    height,
    material: GLASS,
    displacement: `data:image/png;base64,${png(width, height, displacement).toString('base64')}`,
    highlights: `data:image/png;base64,${png(width, height, highlights).toString('base64')}`,
  }) + '\n',
)
process.stdout.write('曲面玻璃折射与高光贴图已按固定 Dock 几何生成。\n')
