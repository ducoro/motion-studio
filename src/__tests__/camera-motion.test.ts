import { expect, test } from 'bun:test'
import geometry from '../../assets/reference-geometry.json'
import { getCameraMotion } from '../camera-motion.ts'

test('整排固定中心高度、平滑单向推进，到位后保持稳定', () => {
  const shots = Array.from({ length: 390 }, (_, frame) => getCameraMotion(frame))
  for (let frame = 0; frame < shots.length; frame++) {
    const shot = shots[frame]
    expect(shot.y).toBe(540)
    expect(Math.abs(shot.scale * 197 - geometry[frame].size)).toBeLessThanOrEqual(
      frame < 330 ? 10 : 15,
    )
    if (frame > 0 && frame < 331) {
      expect(shot.scale).toBeGreaterThanOrEqual(shots[frame - 1].scale)
      expect(shot.x).toBeLessThanOrEqual(shots[frame - 1].x)
      if (frame > 1) {
        const acceleration =
          (shot.scale - 2 * shots[frame - 1].scale + shots[frame - 2].scale) * 197
        expect(Math.abs(acceleration)).toBeLessThan(0.055)
      }
    }
    if (frame >= 330) expect(shot).toEqual(shots[330])
  }
})
