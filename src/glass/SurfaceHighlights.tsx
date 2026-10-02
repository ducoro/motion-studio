import maps from '../../assets/glass/optics.json'

export function SurfaceHighlights() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: 'inherit',
        pointerEvents: 'none',
        backgroundImage: `url("${maps.highlights}")`,
        backgroundSize: '100% 100%',
        mixBlendMode: 'screen',
      }}
    />
  )
}
