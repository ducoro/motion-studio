import sources from '../assets/backgrounds/sources.json'

// 切点取参考片上下边缘的逐帧差分，避开中间不断更换的图标。
export const BACKGROUND_CUTS = [
  0, 20, 32, 40, 50, 58, 66, 76, 84, 92, 102, 110, 120, 128, 136, 146, 154, 164, 174, 184, 192, 202,
  214, 224, 234, 246, 258, 272, 286, 306,
] as const

export const BACKGROUNDS = sources
export const BACKGROUND_BLEND_FRAMES = 3
export const BACKGROUND_FADE_START = 333
export const BACKGROUND_FADE_END = 365
