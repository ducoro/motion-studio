import geometry from '../assets/reference-geometry.json'
import { DOCK_LAYOUT } from './dock-layout.ts'

const BASE_SIZE = DOCK_LAYOUT.size
const anchors = [18, 60, 120, 180, 240, 300, 330].map((frame) => ({
  frame,
  size: frame === 18 ? BASE_SIZE : geometry[frame].size,
}))
const rates = anchors.slice(1).map((point, index) => {
  const previous = anchors[index]
  return (point.size - previous.size) / (point.frame - previous.frame)
})
const slopes = anchors.map((_, index) => {
  if (index === 0 || index === anchors.length - 1) return 0
  const before = rates[index - 1]
  const after = rates[index]
  return (2 * before * after) / (before + after)
})

/** 保留参考推进节奏，消除逐帧轮廓测量的像素跳变；整排只消费同一个变换。 */
export function getCameraMotion(frame: number) {
  const clamped = Math.max(18, Math.min(330, frame))
  const index = Math.min(
    anchors.filter((point) => clamped >= point.frame).length - 1,
    anchors.length - 2,
  )
  const start = anchors[index]
  const end = anchors[index + 1]
  const duration = end.frame - start.frame
  const t = (clamped - start.frame) / duration
  const t2 = t * t
  const t3 = t2 * t
  const size =
    (2 * t3 - 3 * t2 + 1) * start.size +
    (t3 - 2 * t2 + t) * duration * slopes[index] +
    (-2 * t3 + 3 * t2) * end.size +
    (t3 - t2) * duration * slopes[index + 1]
  return { x: 947.5 - ((size - BASE_SIZE) * 10) / 147, y: 540, scale: size / BASE_SIZE }
}
