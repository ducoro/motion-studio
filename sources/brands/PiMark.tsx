/**
 * Pi Agent 官方品牌标（取自 paperclip.ing works-with 区块的原始矢量）。
 * 路径数据为品牌资产原样保留，仅做 JSX 属性名转换，不手改形状。
 */
export function PiMark({ className }: { className?: string }) {
  // viewBox 按字形实测 bbox 收紧（原 800² 画布留白 ~30%）
  return (
    <svg role="img" aria-hidden viewBox="160 160 480 480" fill="currentColor" className={className}>
      <path
        fillRule="evenodd"
        d="M165.29 165.29 H517.36 V400 H400 V517.36 H282.65 V634.72 H165.29 Z M282.65 282.65 V400 H400 V282.65 Z"
      ></path>{' '}
      <path d="M517.36 400 H634.72 V634.72 H517.36 Z"></path>
    </svg>
  )
}
