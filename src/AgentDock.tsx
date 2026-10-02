import { BotTile } from './BotTile.tsx'
import { GlassDock } from './GlassDock.tsx'
import { getCameraMotion } from './camera-motion.ts'
import { DOCK_LAYOUT } from './dock-layout.ts'
import type { BrandTileId } from './brands.ts'

export function AgentDock({
  frame,
  opacity,
  ids,
}: {
  frame: number
  opacity: number
  ids: readonly (BrandTileId | 'ducoro-app-icon')[]
}) {
  const camera = getCameraMotion(frame)
  const { width, height, tileSize, step } = DOCK_LAYOUT
  return (
    <div
      data-film-layer="agent-dock"
      style={{
        position: 'absolute',
        width,
        height,
        left: camera.x,
        top: camera.y,
        transform: `translate(-50%, -50%) scale(${camera.scale})`,
        transformOrigin: 'center',
      }}
    >
      <GlassDock opacity={opacity} />
      {ids.map((id, slot) => (
        <div
          key={slot}
          style={{
            position: 'absolute',
            width: tileSize,
            height: tileSize,
            left: width / 2 + (slot - 3) * step - tileSize / 2,
            top: height / 2 - tileSize / 2,
          }}
        >
          <BotTile key={id} id={id} size={tileSize} opacity={slot === 3 ? 1 : opacity} />
        </div>
      ))}
    </div>
  )
}
