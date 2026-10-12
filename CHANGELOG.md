# Changelog

## 0.8.0 - 2026-10-12

### Added

- 润色结果替换回填：结果窗口上新增「替换」按钮，把 AI 生成的文本直接写回原应用中被选中的位置（结果写入剪贴板 → 焦点回到来源窗口 → 复核选区 → 合成 Ctrl+V）。校验失败时降级为「已复制，请手动粘贴」，降低误贴风险。**目前仅 Windows x64，且只接在润色动作上。**
- 润色改用结构化输出：默认 `json_schema`，可切换为 `json_object` 或关闭服务端格式约束；结果拆分为 `replacement` / `note` 两个字段，替换与复制只取正文，说明不再混入原文；解析失败时保留原始回答全文。流式期间增量渲染替换结果。
- 预选上下文：划词内容可以作为引用带入对话窗，支持预选面板与标记选择器，面板开局占固定槽位、布局不跳动。
- 对话支持发图：图片随会话历史保留，追问时模型仍能看到之前的图。
- Windows：Ctrl+A 全选可唤出工具栏（默认开启），复用钩子键盘管道，通过纯函数状态机处理按键重复。
- 发送键可配置为 Enter / Ctrl+Enter / Shift+Enter，默认纯 Enter。
- 应用内快捷键冲突检测：全局热键与动作快捷键重复时拒绝保存并就地提示。
- 动作窗单实例复用池；可选的动作窗预建降低首次触发延迟（默认开启，可关闭）。
- `raceResponse` 设置项：流被新请求覆盖或其窗口销毁时，由用户选择中止还是继续跑完。
- 可选上下文注入（默认关闭）：在请求 system prompt 中附加来源应用、本地时间、IANA 时区三项。
- 可选本地使用统计（默认关闭）：开启后每次完成或中止的 AI 动作会向 `userData/stats.jsonl` 追加一条 JSONL 记录（含该次请求原文与回答，流被中止时保存已生成部分）。该文件不上传，也不会被读回用于 AI 请求。

### Changed

- 内置原生模块 fork（`third_party/selection-hook`），新增带 hwnd 的窗口级 API：`getSelectionOfWindow`、`focusWindow`、`sendPasteKey`；与上游的差异记录在 `FORK.md`。
- `react-markdown` 全家桶改为懒加载，首屏 bundle 缩减约 368 kB（minified）。
- 忽略来自应用自身窗口的划词事件。
- electron-builder 配置更新：原生模块从 asar 解包，附带 selection-hook prebuilds 的打包脚本。
- 所有输入框补齐输入法组合态（IME composing）的 Enter 保护。
- 空态与标题栏打磨，Windows 采用原生观感的自绘标题栏与窗控按钮。

### Fixed

- 修复 React StrictMode 重复读取初始数据导致的空白动作窗。

## 0.7.0 - 2026-08-30

### Added

- AI 回复时实时显示思维链：思考过程中展示模型推理内容的最新片段，自动换行并在约三行高度的窗口内垂直滚动、始终钉在最新内容底部，结束后折叠为"思考了 Xs"摘要。
- 支持 OpenAI-compatible API 的 `reasoning_content` / `reasoning` / `thinking` 流式字段，以及 Anthropic 的 `thinking_delta` 事件。
- AI 对话、划词动作结果窗口和 AI 识图窗口均生效；模型不输出思维链时自动退化为原有的"正在思考"提示。

### Fixed

- 修复思维链流式解析在部分供应商返回不完整 JSON 分片时可能导致整块流中断的问题。

## 0.6.2 - 2026-07-05

### Fixed

- 修复划词悬浮工具栏在显示时可能抢占原应用文本焦点的问题，降低与鼠标手势、剪贴板增强等工具的冲突概率。

## 0.6.1 - 2026-06-16

### Fixed

- 修复设置页服务名称输入中文时被异步设置刷新打断，导致 IME 组合输入异常的问题。
- 修复服务名称清空后会自动恢复为 `Template 1`，导致默认名称首字母无法删除的问题。
- 修复 Windows 便携版中模型列表获取、模型测活和翻译请求可能因 Node `fetch` 未走 Electron 网络栈而报 `fetch failed` 的问题。
- 兼容 OpenAI-compatible 配置中粘贴完整 `/chat/completions` 或 `/models` endpoint 的常见用法。

### Tests

- 增加服务名称清空、OpenAI-compatible URL 规范化、供应商请求 fetcher 注入和 Web Search 预判请求的回归测试。
