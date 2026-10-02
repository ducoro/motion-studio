export const BRAND_TILES = {
  claude: { name: 'Claude', background: '#D97757', ink: '#fff' },
  codex: { name: 'Codex', background: '#fff', ink: '#111' },
  cursor: { name: 'Cursor', background: '#171717', ink: '#fff' },
  openclaw: { name: 'OpenClaw', background: '#fff', ink: '#111' },
  opencode: { name: 'OpenCode', background: '#171717', ink: '#fff' },
  pi: { name: 'Pi', background: '#171717', ink: '#fff' },
  grok: { name: 'Grok', background: '#171717', ink: '#fff' },
  kimi: { name: 'Kimi', background: '#fff', ink: '#000' },
  glm: { name: 'GLM / Z.ai', background: '#fff', ink: '#2D2D2D' },
  qwen: { name: 'Qwen', background: '#6950EF', ink: '#fff' },
  deepseek: { name: 'DeepSeek', background: '#fff', ink: '#5786FE' },
  gemini: { name: 'Gemini', background: '#fff', ink: '#fff' },
  mistral: { name: 'Mistral', background: '#FA520F', ink: '#fff' },
  minimax: { name: 'MiniMax', background: '#E73562', ink: '#fff' },
} as const

export type BrandTileId = keyof typeof BRAND_TILES
