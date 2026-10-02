import { resolve } from 'node:path'
import { CLICK_FRAME, FILM } from '../src/film.ts'
import './prepare-click.ts'

const root = resolve(import.meta.dir, '..')
const duration = FILM.durationInFrames / FILM.fps
const result = Bun.spawnSync([
  'ffmpeg',
  '-hide_banner',
  '-loglevel',
  'error',
  '-y',
  '-i',
  resolve(root, 'assets/music/bach-goldberg-variation-1-source.mp3'),
  '-i',
  resolve(root, 'assets/sfx/mouse-click.wav'),
  '-filter_complex',
  `[0:a:0]afade=t=in:st=0:d=0.04,afade=t=out:st=${duration - 1.15}:d=1.15[music];[1:a:0]adelay=${Math.round((CLICK_FRAME / FILM.fps) * 44100)}S:all=1[click];[music][click]amix=inputs=2:duration=first:normalize=0[mix]`,
  '-map',
  '[mix]',
  '-vn',
  '-t',
  String(duration),
  '-c:a',
  'aac',
  '-b:a',
  '256k',
  resolve(root, 'assets/music/film-music.m4a'),
])
if (result.exitCode !== 0) throw new Error(result.stderr.toString())
process.stdout.write(`古典钢琴配乐已按原速裁切，点击音效对齐第 ${CLICK_FRAME} 帧。\n`)
