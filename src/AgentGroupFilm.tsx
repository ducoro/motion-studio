import { AbsoluteFill, Audio, Img, interpolate, staticFile, useCurrentFrame } from 'remotion'
import { BackgroundScene } from './BackgroundScene.tsx'
import { AgentDock } from './AgentDock.tsx'
import { BOT_ORDERS, CAPTION_STEPS, CLOSING_FRAME, ICON_PRESS_START } from './film.ts'
import type { BrandTileId } from './brands.ts'
import './film.css'

export function AgentGroupFilm() {
  const frame = useCurrentFrame()
  const group = frame < 313 ? Math.floor(frame / 12) % BOT_ORDERS.length : 2
  const ids: (BrandTileId | 'ducoro-app-icon')[] = [
    ...BOT_ORDERS[group].slice(0, 3),
    'ducoro-app-icon',
    ...BOT_ORDERS[group].slice(3),
  ]
  const sideOpacity = interpolate(frame, [333, 352], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const caption = [...CAPTION_STEPS].reverse().find((step) => frame >= step.frame)?.text
  const closingFrame = frame - CLOSING_FRAME
  const cursorProgress = interpolate(closingFrame, [19, 33], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const press = interpolate(closingFrame, [ICON_PRESS_START, 51, 56, 60], [1, 0.93, 1.025, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill
      style={{
        background: frame < CLOSING_FRAME ? '#fff' : '#f8f8f5',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <Audio src={staticFile('music/film-music.m4a')} />
      {frame < 390 ? (
        <>
          <BackgroundScene frame={frame} />
          <AgentDock frame={frame} opacity={sideOpacity} ids={ids} />
        </>
      ) : frame < CLOSING_FRAME ? (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: 64, fontWeight: 600, letterSpacing: -2.1 }}>{caption}</div>
        </AbsoluteFill>
      ) : (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Img
            src={staticFile('ducoro-app-icon.png')}
            style={{ width: 248.32, height: 248.32, transform: `scale(${press})` }}
          />
          {closingFrame >= 19 && (
            <svg
              width="70"
              height="82"
              viewBox="0 0 35 41"
              style={{
                position: 'absolute',
                left: 1100 - cursorProgress * 70,
                top: 727 - cursorProgress * 115,
                filter: 'drop-shadow(0 2px 1px #0003)',
              }}
            >
              <path
                d="M2 1 L2 31 L10 24 L17 39 L23 36 L16 21 L29 21 Z"
                fill="#111"
                stroke="white"
                strokeWidth="2"
              />
            </svg>
          )}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  )
}
