import { Img, staticFile } from 'remotion'
import { BRAND_TILES, type BrandTileId } from './brands.ts'

export function BotTile({
  id,
  size,
  opacity = 1,
}: {
  id: BrandTileId | 'ducoro-app-icon'
  size: number
  opacity?: number
}) {
  if (id === 'ducoro-app-icon') {
    // 下载页原生图标的底板占 200/256；保留整张图里的高光、留白与投影。
    const canvas = (size * 256) / 200
    return (
      <Img
        src={staticFile('ducoro-app-icon.png')}
        style={{
          width: canvas,
          height: canvas,
          position: 'absolute',
          left: (size - canvas) / 2,
          top: (size - canvas) / 2,
          opacity,
        }}
      />
    )
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.252,
        opacity,
        background: BRAND_TILES[id].background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        boxShadow: 'inset 0 1px 2px rgba(255,255,255,.3)',
      }}
    >
      <Img
        src={staticFile(`${id}.svg`)}
        style={{ width: '76%', height: '76%', objectFit: 'contain' }}
      />
    </div>
  )
}
