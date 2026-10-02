# Ducoro Motion Studio

![Ducoro 动画的开场画面](docs/banner.png)

这就是 Ducoro 这支约 21 秒产品视频的完整制作工程。你可以克隆下来，看看运镜、换图、曲面玻璃和配乐是怎么做的，再换成自己的内容。

[查看成片](exports/ducoro-agent-group-v1-en.mp4) · [试用 Ducoro](https://ducoro.ai/download/) · [English](README.md)

Ducoro：**把你的 Bot 收进 Ducoro。让你的事情持续运转，把注意力还给你。**

## 启动预览

先安装 [Bun](https://bun.sh)，然后运行：

```sh
git clone https://github.com/ducoro/motion-studio.git
cd motion-studio
bun install --frozen-lockfile
bun run studio
```

打开 **http://localhost:3142/DucoroAgentGroup**，点击播放，也可以拖动时间轴逐帧查看。图标、油画、音乐、玻璃贴图与镜头测量表都已随工程带齐，预览直接使用这些素材。

## 导出视频

导出和媒体核验使用 FFmpeg 与 ffprobe。macOS 可以运行 `brew install ffmpeg` 安装。

```sh
bun run typecheck
bun run test
bun run stills
bun run render
bun run verify
```

首次导出会下载 Remotion 的 Chrome Headless Shell，需要网络。成片输出到 `exports/ducoro-agent-group-v1-en.mp4`，关键帧在 `review/`。规格为 1920 × 1080、30 fps、626 帧、20.867 秒，H.264 + AAC。

## 换成自己的内容

| 要换什么 | 文件 |
| --- | --- |
| 中央软件图标 | `sources/brands/ducoro-app-icon.png` |
| 片尾文案、关键帧、周围图标的组合 | `src/film.ts` |
| 图标配色 | `src/brands.ts` |
| 图标生成源文件 | `sources/brands/` |
| 背景图片及来源记录 | `assets/backgrounds/` |
| 换图节奏与渐变时间 | `src/backgrounds.ts` |
| 图标整排宽高与间距 | `src/dock-layout.ts` |
| 运镜 | `src/camera-motion.ts` |
| 玻璃曲面、厚度、折射参数 | `src/glass/optics.ts` |
| 配乐与来源记录 | `assets/music/` |
| 鼠标点击音效 | `scripts/prepare-click.ts` |

修改图标、玻璃、音乐或点击时间后，运行 `bun run assets:prepare` 重新生成素材与摘要，再导出和核验。直接更换油画时，可以保持文件名，更新来源记录后运行 `bun run checksums`。新增素材还需要把路径加到 `provenance.json`。摘要记录你准备好的素材，`verify` 会核对记录与实际文件。

图标使用带透明留白的正方形 PNG，留白比例参考工程现有图标。工程按固定 16:9 布局制作，修改画幅时需要一起调整排版与运镜。

## 实现思路

- React + Remotion 按帧编排，预览与导出共用同一条时间线。
- Dock 固定宽高，整排一起缩放，品牌轮换保持布局稳定。
- 玻璃通过圆角曲面法线与 Snell 折射生成位移贴图，SVG 滤镜采样背景，弧边叠加高光；图标作为独立前景。
- 14 张油画常驻，每次换图旧图垫底、新图用 3 帧交叉渐变覆盖。
- 字幕额外留出 300 毫秒阅读时间，片尾图标下沉与点击声共用起始帧。
- 古典配乐按原速混音，导出直接封装相同 AAC 数据。

完整结构、原理参考和素材来源见 [英文 README](README.md)、[素材说明](ASSETS.md) 与 `provenance.json`。这是一次独立的制作快照，后续在本仓库里演进。

Ducoro 自有动画和工具代码按 [MIT](LICENSE) 许可开放。油画与巴赫录音按各自 CC0 记录使用，品牌图形保留对应权利人的权利与商标身份，依赖遵循各自许可。制作自己的产品视频时，替换成自己的品牌。

喜欢这个视频，也欢迎试试 [Ducoro](https://ducoro.ai/download/)。当前试用权益以 [价格页](https://ducoro.ai/pricing/) 为准。
