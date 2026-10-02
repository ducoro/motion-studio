import { GLASS } from './glass/optics.ts'
import { LensFilter } from './glass/LensFilter.tsx'
import { SurfaceHighlights } from './glass/SurfaceHighlights.tsx'

export function GlassDock({ opacity }: { opacity: number }) {
  return (
    <div
      data-film-layer="glass-dock"
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: GLASS.radius,
        opacity,
        background: 'linear-gradient(180deg, #ffffff16, #ffffff06 55%, #ffffff12)',
        backdropFilter: `url(#${GLASS.filterId}) saturate(1.08)`,
        border: '1px solid #ffffff55',
        boxShadow:
          'inset 0 1.5px 2px #ffffff80, inset 0 -1.5px 2px #ffffff45, inset 0 0 8px #00000012, 0 12px 32px #00000026',
      }}
    >
      <LensFilter />
      <SurfaceHighlights />
    </div>
  )
}
