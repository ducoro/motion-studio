/**
 * OpenCode 官方品牌标（取自 paperclip.ing works-with 区块的原始矢量）。
 * 路径数据为品牌资产原样保留，仅做 JSX 属性名转换，不手改形状。
 */
export function OpenCodeMark({ className }: { className?: string }) {
  return (
    <svg role="img" aria-hidden viewBox="0 0 240 300" fill="none" className={className}>
      <g clipPath="url(#clip0_opencode_light)">
        <mask
          id="mask0_opencode_light"
          style={{ maskType: 'luminance' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="240"
          height="300"
        >
          <path d="M240 0H0V300H240V0Z" fill="white" />
        </mask>
        <g mask="url(#mask0_opencode_light)">
          <path d="M180 240H60V120H180V240Z" fill="#CFCECD" />
          <path d="M180 60H60V240H180V60ZM240 300H0V0H240V300Z" fill="currentColor" />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_opencode_light">
          <rect width="240" height="300" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}
