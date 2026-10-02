import { expect, test } from 'bun:test'
import { GlassDock } from '../GlassDock.tsx'
import { Children, type ReactElement, type ReactNode } from 'react'
import { inflateSync } from 'node:zlib'
import maps from '../../assets/glass/optics.json'
import { GLASS, glassSample, refractedOffset } from '../glass/optics.ts'
import { LensFilter } from '../glass/LensFilter.tsx'

test('玻璃材质通过 SVG 镜片折射背景，容器尺寸与前景保持独立', () => {
  const glass = GlassDock({ opacity: 1 })
  expect(glass.props.style.backdropFilter).toContain('url(')
  expect(glass.props.style.filter).toBeUndefined()
  expect(glass.props.style.inset).toBe(0)
})

test('实际镜片贴图与光学参数同步，SVG 按 RG 通道采样且中心零偏置', () => {
  expect(maps.material).toEqual(GLASS)
  const definition = LensFilter().props.children.props.children
  const nodes = Children.toArray(definition.props.children) as ReactElement<
    Record<string, unknown>
  >[]
  const displacement = nodes.find((node) => node.type === 'feDisplacementMap')!
  const image = nodes.find((node) => node.type === 'feImage')!
  const transfer = nodes.find((node) => node.type === 'feComponentTransfer')!
  const functions = Children.toArray(transfer.props.children as ReactNode) as ReactElement<
    Record<string, unknown>
  >[]
  const channels = ['feFuncR', 'feFuncG'].map(
    (type) => functions.find((node) => node.type === type)!.props,
  )
  const shift = (encoded: number, axis: number) =>
    Number(displacement.props.scale) *
    ((Number(channels[axis].slope) * encoded) / 255 + Number(channels[axis].intercept) - 0.5)
  expect(definition.props.colorInterpolationFilters).toBe('sRGB')
  expect(displacement.props.in2).toBe(transfer.props.result)
  expect(transfer.props.in).toBe(image.props.result)
  const png = Buffer.from(maps.displacement.split(',')[1], 'base64')
  expect(png.readUInt32BE(16)).toBe(Math.ceil(GLASS.width))
  expect(png.readUInt32BE(20)).toBe(Math.ceil(GLASS.height))
  const chunks: Buffer[] = []
  for (let offset = 8; offset < png.length;) {
    const length = png.readUInt32BE(offset)
    if (png.toString('ascii', offset + 4, offset + 8) === 'IDAT')
      chunks.push(png.subarray(offset + 8, offset + 8 + length))
    offset += length + 12
  }
  const pixels = inflateSync(Buffer.concat(chunks))
  const stride = maps.width * 4 + 1
  const center = Math.floor(maps.height / 2) * stride + 1 + Math.floor(maps.width / 2) * 4
  expect([...pixels.subarray(center, center + 4)]).toEqual([128, 128, 128, 255])
  expect(shift(pixels[center], 0)).toBeCloseTo(0, 10)
  expect(shift(pixels[center + 1], 1)).toBeCloseTo(0, 10)
  for (const [x, y, axis] of [
    [4, Math.floor(maps.height / 2), 0],
    [Math.floor(maps.width / 2), 4, 1],
  ]) {
    const distance =
      axis === 0 ? ((x + 0.5) * GLASS.width) / maps.width : ((y + 0.5) * GLASS.height) / maps.height
    const t = distance / GLASS.bezel
    const height = (1 - (1 - t) ** 4) ** 0.25
    const slope = (GLASS.surfaceHeight / GLASS.bezel) * (1 - t) ** 3 * (1 - (1 - t) ** 4) ** -0.75
    const angle = Math.atan(slope)
    const reference =
      (GLASS.thickness + height * GLASS.surfaceHeight) *
      Math.tan(angle - Math.asin(Math.sin(angle) / GLASS.refractionIndex))
    const encoded = pixels[y * stride + 1 + x * 4 + axis]
    expect(Math.abs(shift(encoded, axis) - reference)).toBeLessThan(0.2)
  }
  expect(displacement.props.scale).toBe(GLASS.displacementScale)
  expect(displacement.props.xChannelSelector).toBe('R')
  expect(displacement.props.yChannelSelector).toBe('G')
  expect(image.props.href).toBe(maps.displacement)
})

test('镜片遵守折射角关系，平坦中心清晰，边缘位移有限且镜像对称', () => {
  for (const slope of [0, 0.1, 0.5, 1, 2, 10]) {
    for (const index of [1, 1.2, 1.45, 1.8]) {
      const incidence = Math.atan(slope)
      const refraction = Math.asin(Math.sin(incidence) / index)
      expect(refractedOffset(slope, 22, index)).toBeCloseTo(
        22 * Math.tan(incidence - refraction),
        10,
      )
    }
  }
  expect(glassSample(GLASS.width / 2, GLASS.height / 2)).toEqual({ dx: 0, dy: 0, highlight: 0 })
  expect(glassSample(0, 0)).toEqual({ dx: 0, dy: 0, highlight: 0 })
  expect(glassSample(4, GLASS.height / 2).dx).toBeGreaterThan(5)
  expect(glassSample(GLASS.width / 2, 4).dy).toBeGreaterThan(5)
  for (const x of [0.5, 4, 15, 27, 50, GLASS.width / 2]) {
    for (const y of [0.5, 4, 15, 27, 50, GLASS.height / 2]) {
      const point = glassSample(x, y)
      const oppositeX = glassSample(GLASS.width - x, y)
      const oppositeY = glassSample(x, GLASS.height - y)
      expect(point.dx).toBeCloseTo(-oppositeX.dx, 8)
      expect(point.dy).toBeCloseTo(-oppositeY.dy, 8)
      expect(Math.hypot(point.dx, point.dy)).toBeLessThan(GLASS.displacementScale / 2)
      expect(point.highlight).toBeGreaterThanOrEqual(0)
      expect(point.highlight).toBeLessThanOrEqual(1)
    }
  }
})
