export const FILM = {
  id: 'DucoroAgentGroup',
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 626,
} as const

export const CAPTION_STEPS = [
  { frame: 390, referenceFrame: 390, text: 'Any Bot.' },
  { frame: 412, referenceFrame: 403, text: 'Any Bot. Any agent.' },
  { frame: 434, referenceFrame: 416, text: 'Any Bot. Any agent. One group.' },
  { frame: 471, referenceFrame: 444, text: 'Friends' },
  { frame: 490, referenceFrame: 454, text: 'Friends with' },
  { frame: 511, referenceFrame: 466, text: 'Friends with every agent.' },
] as const

export const CLOSING_FRAME = 545
export const ICON_PRESS_START = 48
export const CLICK_FRAME = CLOSING_FRAME + ICON_PRESS_START
export const REFERENCE_CLOSING_FRAME = 491
export const REFERENCE_DURATION_IN_FRAMES = 563

export const REVIEW_FRAMES = [
  { name: '01-dock', frame: 4 },
  { name: '02-oil-painting', frame: 30 },
  { name: '03-zoom', frame: 230 },
  { name: '04-bots', frame: 309 },
  { name: '05-ducoro', frame: 371 },
  { name: '06-group', frame: 448 },
  { name: '07-friends', frame: 525 },
  { name: '08-signature', frame: 589 },
  { name: '09-click-down', frame: 596 },
  { name: '10-click-settled', frame: 609 },
  { name: '11-model-brands', frame: 18 },
  { name: '12-grok-kimi', frame: 40 },
  { name: '13-bot-friends', frame: 54 },
] as const

export const BOT_ORDERS = [
  ['claude', 'cursor', 'codex', 'grok', 'kimi', 'pi'],
  ['qwen', 'glm', 'deepseek', 'gemini', 'minimax', 'mistral'],
  ['cursor', 'grok', 'kimi', 'qwen', 'glm', 'claude'],
  ['codex', 'kimi', 'grok', 'gemini', 'pi', 'qwen'],
  ['openclaw', 'opencode', 'grok', 'qwen', 'cursor', 'kimi'],
  ['gemini', 'glm', 'claude', 'deepseek', 'minimax', 'codex'],
  ['kimi', 'cursor', 'qwen', 'pi', 'mistral', 'grok'],
  ['deepseek', 'claude', 'glm', 'opencode', 'openclaw', 'gemini'],
] as const satisfies readonly (readonly BrandTileId[])[]
import type { BrandTileId } from './brands.ts'
