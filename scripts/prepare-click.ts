import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const sampleRate = 44100
const samples = Math.round(sampleRate * 0.15)
const wav = Buffer.alloc(44 + samples * 2)
wav.write('RIFF', 0)
wav.writeUInt32LE(wav.length - 8, 4)
wav.write('WAVEfmt ', 8)
wav.writeUInt32LE(16, 16)
wav.writeUInt16LE(1, 20)
wav.writeUInt16LE(1, 22)
wav.writeUInt32LE(sampleRate, 24)
wav.writeUInt32LE(sampleRate * 2, 28)
wav.writeUInt16LE(2, 32)
wav.writeUInt16LE(16, 34)
wav.write('data', 36)
wav.writeUInt32LE(samples * 2, 40)

let seed = 593
let previousNoise = 0
for (let index = 0; index < samples; index++) {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
  const noise = seed / 0x80000000 - 1
  const highNoise = (noise - previousNoise) / 2
  previousNoise = noise
  let value = 0
  for (const [onset, gain] of [
    [0, 0.38],
    [0.09, 0.23],
  ]) {
    const t = index / sampleRate - onset
    if (t < 0) continue
    const attack = 1 - Math.exp(-t / 0.0003)
    const snap = highNoise * Math.exp(-t / 0.0035)
    const body =
      0.36 * Math.sin(2 * Math.PI * 1850 * t) * Math.exp(-t / 0.004) +
      0.24 * Math.sin(2 * Math.PI * 920 * t) * Math.exp(-t / 0.007) +
      0.16 * Math.sin(2 * Math.PI * 340 * t) * Math.exp(-t / 0.01)
    value += gain * attack * (snap + body)
  }
  wav.writeInt16LE(Math.round(Math.max(-1, Math.min(1, value)) * 32767), 44 + index * 2)
}

const directory = resolve(import.meta.dir, '../assets/sfx')
await mkdir(directory, { recursive: true })
await writeFile(resolve(directory, 'mouse-click.wav'), wav)
process.stdout.write('鼠标机械点击音效已合成，包含按下与松开两段短促瞬态。\n')
