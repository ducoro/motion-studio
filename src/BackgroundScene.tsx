import { AbsoluteFill, Img, interpolate, staticFile } from 'remotion'
import {
  BACKGROUNDS,
  BACKGROUND_BLEND_FRAMES,
  BACKGROUND_CUTS,
  BACKGROUND_FADE_END,
  BACKGROUND_FADE_START,
} from './backgrounds.ts'

export function BackgroundScene({ frame }: { frame: number }) {
  const cutIndex = BACKGROUND_CUTS.filter((start) => frame >= start).length - 1
  const current = cutIndex % BACKGROUNDS.length
  const previous = (cutIndex - 1 + BACKGROUNDS.length) % BACKGROUNDS.length
  const start = BACKGROUND_CUTS[cutIndex]
  const end = BACKGROUND_CUTS[cutIndex + 1] ?? BACKGROUND_FADE_START
  const scale = interpolate(frame, [start, end], [1.02, 1.038], {
    extrapolateRight: 'clamp',
  })
  const opacity = interpolate(frame, [BACKGROUND_FADE_START, BACKGROUND_FADE_END], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const blend = cutIndex === 0 ? 1 : Math.min(1, (frame - start) / BACKGROUND_BLEND_FRAMES)
  return (
    <AbsoluteFill style={{ opacity, overflow: 'hidden', isolation: 'isolate' }}>
      {BACKGROUNDS.map((source, index) => (
        <Img
          key={source.file}
          data-film-layer="licensed-background"
          src={staticFile(`backgrounds/${source.file}`)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${index === current ? scale : 1.038})`,
            // 旧图保持不透明垫底，新图在上方淡入，合成过程中始终覆盖白底。
            opacity: index === current ? blend : index === previous && blend < 1 ? 1 : 0,
            zIndex: index === current ? 1 : 0,
          }}
        />
      ))}
    </AbsoluteFill>
  )
}
