import { expect, test } from 'bun:test'
import { Children, type CSSProperties, type ReactElement } from 'react'
import { BackgroundScene } from '../BackgroundScene.tsx'
import { BACKGROUNDS, BACKGROUND_CUTS, BACKGROUND_FADE_START } from '../backgrounds.ts'

type ImageLayer = ReactElement<{ src: string; style: CSSProperties }>

function layers(frame: number) {
  return Children.toArray(BackgroundScene({ frame }).props.children) as ImageLayer[]
}

test('背景图片常驻，交叉渐变全程覆盖底色，100 毫秒后完成换图', () => {
  expect(BackgroundScene({ frame: 21 }).props.style.isolation).toBe('isolate')
  const initial = layers(0).map((layer) => [layer.key, layer.props.src])
  expect(initial).toHaveLength(BACKGROUNDS.length)
  for (let frame = 0; frame < BACKGROUND_FADE_START; frame++) {
    const images = layers(frame)
    expect(images.map((layer) => [layer.key, layer.props.src])).toEqual(initial)
    const uncovered = images.reduce(
      (remaining, layer) => remaining * (1 - Number(layer.props.style.opacity ?? 1)),
      1,
    )
    expect(uncovered).toBe(0)
  }
  for (const [index, cut] of BACKGROUND_CUTS.entries()) {
    if (index === 0) continue
    const current = index % BACKGROUNDS.length
    const previous = (index - 1) % BACKGROUNDS.length
    for (const offset of [1, 2]) {
      const images = layers(cut + offset)
      expect(images[current].props.style.opacity).toBeGreaterThan(0)
      expect(images[current].props.style.opacity).toBeLessThan(1)
      expect(images[previous].props.style.opacity).toBe(1)
      expect(images[current].props.style.zIndex).toBeGreaterThan(
        Number(images[previous].props.style.zIndex),
      )
    }
    const settled = layers(cut + 3)
    expect(settled[current].props.style.opacity).toBe(1)
    expect(settled[previous].props.style.opacity).toBe(0)
  }
})
