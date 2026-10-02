import { createHash } from 'node:crypto'
import { readFile, stat } from 'node:fs/promises'
import { resolve } from 'node:path'
import {
  CAPTION_STEPS,
  CLOSING_FRAME,
  FILM,
  REFERENCE_CLOSING_FRAME,
  REFERENCE_DURATION_IN_FRAMES,
  REVIEW_FRAMES,
} from '../src/film.ts'

const root = resolve(import.meta.dir, '..')
const output = resolve(root, 'exports/ducoro-agent-group-v1-en.mp4')
const result = Bun.spawnSync([
  'ffprobe',
  '-v',
  'error',
  '-count_frames',
  '-show_streams',
  '-show_format',
  '-of',
  'json',
  output,
])
if (result.exitCode !== 0) throw new Error(result.stderr.toString())
const probe = JSON.parse(result.stdout.toString())
const video = probe.streams.find((s: { codec_type: string }) => s.codec_type === 'video')
const audio = probe.streams.find((s: { codec_type: string }) => s.codec_type === 'audio')
if (
  !video ||
  video.width !== FILM.width ||
  video.height !== FILM.height ||
  video.r_frame_rate !== `${FILM.fps}/1` ||
  Number(video.nb_read_frames) !== FILM.durationInFrames ||
  video.codec_name !== 'h264' ||
  video.pix_fmt !== 'yuv420p'
)
  throw new Error('Film format mismatch')
if (!audio || audio.codec_name !== 'aac') throw new Error('Film audio missing')
const sourceAudioPath = resolve(root, 'assets/music/film-music.m4a')
const sourceProbe = Bun.spawnSync([
  'ffprobe',
  '-v',
  'error',
  '-show_streams',
  '-of',
  'json',
  sourceAudioPath,
])
if (sourceProbe.exitCode !== 0) throw new Error(sourceProbe.stderr.toString())
const sourceAudio = JSON.parse(sourceProbe.stdout.toString()).streams[0]
if (
  Math.abs(Number(audio.duration) - Number(sourceAudio.duration)) > 0.04 ||
  Math.abs(Number(audio.start_time) - Number(sourceAudio.start_time)) > 0.04
)
  throw new Error('Music audio timing mismatch')
const audioHashes = [sourceAudioPath, output].map((path) => {
  const packets = Bun.spawnSync([
    'ffmpeg',
    '-v',
    'error',
    '-i',
    path,
    '-map',
    '0:a:0',
    '-c:a',
    'copy',
    '-f',
    'data',
    '-',
  ])
  if (packets.exitCode !== 0) throw new Error(packets.stderr.toString())
  return createHash('sha256').update(packets.stdout).digest('hex')
})
if (audioHashes[0] !== audioHashes[1]) throw new Error('Music audio packets mismatch')
if (Math.abs(Number(probe.format.duration) - FILM.durationInFrames / FILM.fps) > 0.04)
  throw new Error('Film duration mismatch')
const beats = [
  ...CAPTION_STEPS,
  { frame: CLOSING_FRAME, referenceFrame: REFERENCE_CLOSING_FRAME },
  { frame: FILM.durationInFrames, referenceFrame: REFERENCE_DURATION_IN_FRAMES },
]
for (let index = 0; index < beats.length - 1; index++) {
  const start = beats[index]
  const end = beats[index + 1]
  if (end.frame - start.frame - (end.referenceFrame - start.referenceFrame) !== 9)
    throw new Error(`Reading hold mismatch: beat ${index}`)
}
for (const shot of REVIEW_FRAMES)
  if ((await stat(resolve(root, `review/${shot.name}.png`))).size === 0)
    throw new Error(`Empty review frame: ${shot.name}`)
const provenance = JSON.parse(await readFile(resolve(root, 'provenance.json'), 'utf8'))
for (const asset of provenance.assets as { path: string; sha256: string }[]) {
  const actual = createHash('sha256')
    .update(await readFile(resolve(root, asset.path)))
    .digest('hex')
  if (actual !== asset.sha256) throw new Error(`Asset checksum mismatch: ${asset.path}`)
}
process.stdout.write(
  `交付核验通过：${video.nb_read_frames} 帧，${probe.format.duration}s，1920 × 1080，H.264 + AAC；配乐数据与时序一致，素材摘要与关键画面齐全。\n`,
)
