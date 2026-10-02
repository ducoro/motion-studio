import maps from '../../assets/glass/optics.json'
import { GLASS } from './optics.ts'

export function LensFilter() {
  return (
    <svg width={0} height={0} aria-hidden="true" style={{ position: 'absolute' }}>
      <defs>
        <filter
          id={GLASS.filterId}
          filterUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={GLASS.width}
          height={GLASS.height}
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation={GLASS.blur} result="soft-backdrop" />
          <feImage
            href={maps.displacement}
            x={0}
            y={0}
            width={GLASS.width}
            height={GLASS.height}
            preserveAspectRatio="none"
            result="lens-map"
          />
          {/* 将 8 位中性通道 128/255 归到 0.5，保持平坦中心的背景位置。 */}
          <feComponentTransfer in="lens-map" result="centered-map">
            <feFuncR type="linear" slope={1} intercept={-1 / 510} />
            <feFuncG type="linear" slope={1} intercept={-1 / 510} />
          </feComponentTransfer>
          <feDisplacementMap
            in="soft-backdrop"
            in2="centered-map"
            scale={GLASS.displacementScale}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  )
}
