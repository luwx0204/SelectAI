<div align="center">
  <img src="./build/icon.png" alt="SelectAI 图标" width="88" />

  <h1>SelectAI</h1>

  <p>划词、截图、问 AI——少切几次窗口，多省几次复制粘贴。</p>

  <p>
    <img src="https://img.shields.io/badge/Platform-macOS%20%7C%20Windows-2f6fed?style=flat-square" alt="Platform" />
    <img src="https://img.shields.io/badge/Electron-33-3e4a5f?style=flat-square" alt="Electron 33" />
    <img src="https://img.shields.io/badge/React-18-2d9cdb?style=flat-square" alt="React 18" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square" alt="TypeScript 5" />
    <img src="https://img.shields.io/badge/API-OpenAI%20%7C%20Anthropic-3a7f52?style=flat-square" alt="API Support" />
    <img src="https://img.shields.io/badge/License-MIT-c9a227?style=flat-square" alt="MIT License" />
  </p>

  <p>
    <a href="https://github.com/luwx0204/SelectAI/releases/latest"><img src="https://img.shields.io/github/v/release/luwx0204/SelectAI?style=for-the-badge&label=Latest%20Release&color=2f6fed" alt="Latest release" /></a>
    <a href="https://github.com/luwx0204/SelectAI/releases"><img src="https://img.shields.io/github/downloads/luwx0204/SelectAI/total?style=for-the-badge&label=Downloads&color=c9a227" alt="Total downloads" /></a>
  </p>
</div>

SelectAI 是一个常驻系统托盘的桌面小工具（Electron + React + TypeScript）。在任意应用里选中一段文字，旁边会浮出一条工具栏，点一下就能解释、翻译、总结、润色、搜索或复制；不想用工具栏，也可以走全局快捷键。工具栏动作可以新增、重命名、换图标、改提示词、排序或删除，也能给某个动作单独绑定模型、调整思考强度，或者配置快捷键后先弹出输入框再执行。润色这类要改写原文的动作，结果窗上还会多一个「替换」按钮——点一下就把 AI 的结果写回原应用里被选中的位置，不用再复制粘贴（目前限 Windows 的润色动作）。

除了划词，它还内置区域截图：拖拽框选一块屏幕，可以画线、画箭头标注。截完可以保存 PNG、复制到剪贴板、钉在桌面，或者直接交给 AI 识图。

结果窗口本身就是个独立对话——回答完了可以接着追问，AI 看得到之前的上下文；也能把划词内容作为引用带进对话，或者直接把图片发出去。输出是流式的，可以随时打断。思考型模型回复时，思维链会实时显示，结束后折叠成「思考了 Xs」的摘要，点击可展开/收起。需要查实时信息时可打开联网搜索，AI 会自己抓网页，并在回答里附上来源链接（链接在系统浏览器打开，不会跳进应用窗口）。

## 功能要点

- **划词工具条**：任意应用选中文字即浮出，动作可自由增删改、排序、单独配模型/提示词/快捷键
- **多窗口结果**：每次划词动作开独立结果窗口（最多 8 个），多次划词可并排对照；设置里可关掉回到单窗口复用
- **预选池**：先把多段文字攒进暂存池，再一次性带进对话；每段可圈出关键片段编号，对话时用 @ 引用
- **连续对话**：结果窗可追问，上下文保留；划词内容、图片都可作为引用带入
- **思考过程**：推理内容实时显示，答完自动折叠为「思考了 Xs」，点击展开/收起（需模型返回 reasoning）
- **截图**：区域截图 + 标注，可保存/复制/钉屏/AI 识图
- **替换回填**：润色结果一键写回原应用的选中位置（Windows）
- **多服务商**：OpenAI-compatible（官方、DeepSeek、月之暗面、智谱、自建中转等）与 Anthropic 官方 API；多套模板一键切换，每个动作可指定模板
- **本地优先**：API Key 只存在本地设置文件；对话内容只在内存，不保存聊天记录
- **外观**：亮 / 暗 / 跟随系统主题，中英双语，结果窗口尺寸、字号可在设置里调整

目前支持 Windows 与 macOS，主要在 Windows 上使用和验证。

## 下载

到 [GitHub Releases](https://github.com/luwx0204/SelectAI/releases) 下载最新版：

| 平台 | 包 | 说明 |
| --- | --- | --- |
| Windows x64 | `SelectAI-Portable-<版本>-win-x64.zip` | 绿色版，解压后运行 `SelectAI.exe`，免安装 |

> 包未做代码签名：Windows SmartScreen 提示时选「仍要运行」即可。macOS 需自行按下方开发步骤打包，首次打开请到「系统设置 → 隐私与安全性」放行。

## 快速开始（使用）

1. 解压 zip，运行 `SelectAI.exe`，程序常驻系统托盘。
2. 托盘图标右键 →「设置」，在服务商里填入 API 地址与 API Key（支持任意 OpenAI-compatible 中转/官方地址，或 Anthropic）。
3. 在任意应用里选中文字，工具条浮出后点动作即可；或点工具条上的「对话」进入聊天窗口。

设置文件位置：Windows 为 `%APPDATA%\select-ai\settings.json`，macOS 为 `~/Library/Application Support/select-ai/settings.json`。

## 开发指南（在其他设备上继续开发）

### 环境要求

- Node.js 20+（当前开发环境为 Node 24）
- pnpm（仓库使用 `pnpm-lock.yaml` 锁定依赖，请勿用 npm/yarn 安装以免锁文件漂移）
- 原生模块 `selection-hook` 使用 npm 包内的预编译二进制，正常情况下不需要本地编译工具链

### 克隆与运行

```bash
git clone https://github.com/luwx0204/SelectAI.git
cd SelectAI
pnpm install
pnpm dev        # 开发模式（electron-vite，带热更新）
```

### 检查与测试

```bash
pnpm typecheck  # 主进程 + 渲染进程两套 tsconfig
pnpm test       # vitest 单元测试
pnpm build      # typecheck + 构建到 out/
```

### 打包

在 Windows 上打正式包：

```bash
pnpm dist:win   # NSIS 安装版 + portable 版（x64）
pnpm dist:mac   # macOS dmg + zip（需在 macOS 上执行）
```

只打绿色版 zip（当前 Release 的做法）：

```bash
npx electron-vite build
npx electron-builder --win --dir
# 把 dist/win-unpacked 整个目录压缩为 SelectAI-Portable-<版本>-win-x64.zip
```

注意事项：

- 在 Linux 上交叉打 Windows 包时，NSIS 安装版需要 wine，通常只打 `--dir` 绿色版。
- exe 的图标与版本信息由 `scripts/after-pack.mjs` 在打包后用 `resedit` 纯 JS 盖章（`electron-builder.yml` 里 `signAndEditExecutable: false`，不要指望 electron-builder 自带改图标）；图标源文件在 `build/`（`icon.png` 透明版、`icon-win.png` / `icon-win.ico` Windows 版、`tray-icon.png` 托盘版）。
- 托盘图标最终为 16px 显示，细节多的图会糊；换托盘图时先按 16px 预览确认可辨认。

### 项目结构

```
src/main/       主进程：窗口管理、划词服务（SelectionService）、截图、设置存储、窗口安全（外链拦截）
src/preload/    预加载脚本（IPC 桥）
src/renderer/   渲染进程：toolbar（工具条）、action（结果窗）、chat（对话窗）、settings（设置）、screenshot
src/shared/     主/渲染共用：types、defaults、actions、ipc 通道、brand（图标资源）；i18n 在 renderer 下
build/          图标与打包资源
scripts/        after-pack.mjs（exe 盖章）、prepare-selection-hook.js
```

### 发布流程

1. 改 `package.json` 的 `version`（每次迭代必须递增，不要复用版本号）。
2. `pnpm build` 通过后按上面步骤打绿色版 zip，文件名带新版本号。
3. 源码提交并 push 到本仓库 `main`。
4. 在 GitHub 建 Release：tag 用 `v<版本>`（如 `v1.0.5`），把 zip 作为附件上传（zip 超过 git 单文件 100MB 上限，不要直接提交进仓库）。

## 与原项目的关系

本项目基于 [zcx960/AIA-selection-assistan](https://github.com/zcx960/AIA-selection-assistan)（MIT 协议）二次开发：更名为 SelectAI，更换全套图标，并做了多窗口结果、去除朗读（TTS）、外链跳转修复、托盘提示修复等改动。原仓库在本仓库中保留为 `upstream` remote，可按需同步上游更新。

## License

MIT，见 [LICENSE](./LICENSE)。
