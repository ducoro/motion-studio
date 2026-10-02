import { DOCK_LAYOUT } from '../dock-layout.ts'

export const GLASS = {
  width: DOCK_LAYOUT.width,
  height: DOCK_LAYOUT.height,
  radius: DOCK_LAYOUT.size * 0.41,
  bezel: 28,
  thickness: 32,
  surfaceHeight: 18,
  refractionIndex: 1.45,
  displacementScale: 96,
  blur: 2.4,
  filterId: 'ducoro-dock-liquid-lens',
} as const

/** 单次空气到镜片的折射，返回沿内法线方向的背景采样距离。 */
export function refractedOffset(slope: number, depth: number, index: number) {
  const normalLength = Math.hypot(slope, 1)
  const normalZ = 1 / normalLength
  const eta = 1 / index
  const coefficient = eta * normalZ - Math.sqrt(1 - eta * eta * (1 - normalZ * normalZ))
  const rayX = (-coefficient * slope) / normalLength
  const rayZ = -eta + coefficient * normalZ
  return (depth * rayX) / -rayZ
}

/** 圆角矩形的曲面边缘弯曲背景；平坦中心返回零位移。 */
export function glassSample(x: number, y: number) {
  const px = x - GLASS.width / 2
  const py = y - GLASS.height / 2
  const qx = Math.abs(px) - (GLASS.width / 2 - GLASS.radius)
  const qy = Math.abs(py) - (GLASS.height / 2 - GLASS.radius)
  const outsideLength = Math.hypot(Math.max(qx, 0), Math.max(qy, 0))
  const distance = GLASS.radius - outsideLength - Math.min(Math.max(qx, qy), 0)
  if (distance < 0 || distance >= GLASS.bezel) return { dx: 0, dy: 0, highlight: 0 }
  const nx = qx > 0 && qy > 0 ? (Math.sign(px) * qx) / outsideLength : qx > qy ? Math.sign(px) : 0
  const ny = qx > 0 && qy > 0 ? (Math.sign(py) * qy) / outsideLength : qy >= qx ? Math.sign(py) : 0
  const t = Math.max(0.001, distance / GLASS.bezel)
  const arc = 1 - (1 - t) ** 4
  const height = arc ** 0.25
  const slope = (GLASS.surfaceHeight / GLASS.bezel) * (1 - t) ** 3 * arc ** -0.75
  const offset = refractedOffset(
    slope,
    GLASS.thickness + height * GLASS.surfaceHeight,
    GLASS.refractionIndex,
  )
  const normalLength = Math.hypot(slope, 1)
  const specular = Math.max(0, (-nx * slope * 0.32 - ny * slope * 0.42 + 0.85) / normalLength) ** 24
  const rim = Math.exp(-distance / 1.8) * (0.35 + 0.3 * Math.max(0, -nx * 0.6 - ny * 0.8))
  return { dx: -nx * offset, dy: -ny * offset, highlight: Math.min(0.8, rim + specular * 0.5) }
}
