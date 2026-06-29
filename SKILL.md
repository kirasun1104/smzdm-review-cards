---
name: smzdm-review-cards
description: 生成什么值得买风格的 3:4 产品评测结论卡组。适用于评测文章、导购链接、产品参数、截图、样张和笔记，输出封面结论、证据页、版本对比、适合人群、价格/参数账本，以及买/等/跳判断；整套卡片使用统一视觉路线和配色。
---

# SMZDM Review Cards

生成 1080×1440 的什么值得买风格评测结论卡组，帮助读者判断：建议买、建议等，还是不建议。

不要编辑 `guizang-social-card-skill` 或 `smzdm-product-comparison-skill`。生成的卡组应放在当前工作区，或用户指定的输出目录。

## 快速加载路径

只读取当前任务真正需要的内容：

1. 常规生成时，读取 `references/quick-start.md`。
2. 提问前，读取 `references/intake-contract.md`。
3. 需要选择视觉路线或配色时，同时读取 `references/style-routes.md`。
4. 来源材料较长、混合或事实密集时，写页面文案前读取 `references/fact-model.md`。
5. 遇到详细 intake、图片 sourcing、不稳定事实或用户提供证据时，再读取对应的聚焦参考文件。
6. 最终交付前，或用户要求说明校验细节时，读取 `references/qa-checklist.md`。

避免读取 `node_modules/`。不要默认把所有参考文件都读一遍。

## 核心规则

- 一套卡组只能使用一个视觉路线和一个配色。
- 产品图、样张、截图必须是真实证据：用户提供、来源文章、官方/授权来源、为任务截取的截图，或记录在 `assets/SOURCES.md` 中的公开来源。
- 对使用场景敏感的产品，优先使用可信的场景/使用环境图片，而不是无场景白底图。如果官方场景图不可用，可以做一次聚焦的公开评测/社区 fallback，包括什么值得买等平台，但来源和限制必须记录在卡片外。
- 同一套卡组里不要重复使用同一张来源图片，包括原图、近似重复图、不同尺寸下载、裁切、细节裁切，或同一图片在一页/多页重复出现。除非用户明确要求重复展示自己提供的素材，否则不要把证据图加入 `allowed_repeated_assets`。
- 不要使用带大面积平台、电商或促销水印的来源图作为卡片证据。小且不遮挡主体的来源标记可以接受；但中央 JD/Tmall/平台水印、优惠券覆盖、促销价格面板、平台文字横跨产品等必须拒绝，或改成无图信息布局。
- 不要创建或绘制假的产品/样张/UI/价格证据。禁止 AI 生成产品图、手绘占位图、CSS/canvas 产品图、SVG 证据图。
- SMZDM 输出默认以中国大陆/RMB 为价格、库存、优惠、补贴、保修、发布和渠道事实的基准。
- 如果价格、规格、库存等事实可能变化，必须核实，或写入 `deck-data.json.unverified`；未核实的硬价格不要印在图片上。
- 免责声明写在 `deck-data.json` 或 `assets/SOURCES.md`，不要写在卡片上。市场基准类文字不应作为免责声明标签出现；只有在必要的产品/版本语境中才保留。
- 完整图片 URL、平台名、作者、抓取说明和来源解释默认放在 `deck-data.json` 或 `assets/SOURCES.md`。可见卡片只在必要时使用短证据角色标签，例如 `晒单场景`、`官方产品图`、`评测样张`、`价格截图`。
- 页面文案必须来自结构化 fact/verdict model，不要直接自由总结文章。
- 页面和组件字数预算以 `references/page-types.md` 为准；它也是 fit action 的权威来源。
- 避免中文单字 widow/orphan：可见卡片中不要让一行只以一个汉字或一个汉字加标点结尾。通过改短文案、调整断句或移动细节解决，不要用极小字号、挤压间距或单页 inline 样式修。
- 不要用 inline layout、极小字号、压缩间距或临时组件来拯救过长文案。使用 `references/page-types.md` 中的 fit ladder。
- Validation FAIL 是最终交付前的阻断项。
- 最终交付必须包含导出图片目录 `<task-dir>/output/`，同时可以附 HTML 预览、contact sheet 或源文件链接。该目录包含每张 1080×1440 PNG，是主要交付物。

## Intake 与视觉选择

提问规则在 `references/intake-contract.md`。视觉路线定义、选项标签、配色名和推荐映射在 `references/style-routes.md`。在询问路线、配色、证据来源或事实核查问题前，先读取这些文件。

默认生成前先提问：先问视觉路线并给一个推荐；多配色路线再问配色并给一个推荐；如果用户没有提供具体文章、笔记、URL、文档、截图或产品事实，再问 missing-copy mode。missing-copy mode 是单选：`由 AI 一键完成内容` 或 `用户提供内容`。AI 模式应查资料、整理事实模型，并尽量寻找高质量真实图片；用户提供模式应请求内容，并建议附上产品图、样张或截图以增强效果。只有用户明确要求快速/一次性生成时，才跳过风格、配色和证据问题，例如 `快速生成`、`一键生成`、`直接生成`、`不用问`、`按推荐来`、`你定`、`自动选择`、`speed`、`quick`。如果宿主是 Claude / Claude Code 且支持弹窗问题，使用弹窗；否则使用最简单的编号文本菜单。

## 种子模板

复制一个 seed template 到任务目录，替换 `<!-- POSTERS_HERE -->`，并移除生成卡组中的 `.template-preview` 区块，除非是在更新复用模板模式：

- `assets/template-swiss-guide.html` — 瑞士导购 · 白底信息板
  - 适合价格/规格决策、版本对比、购买账本，以及清晰的买/等/跳判断。需要理性、干净、最接近 SMZDM 导购信息板时使用。
- `assets/template-geek-bench.html` — Geek · Dark Data Bench
  - 适合硬件测试、手机/相机/PC 性能、光学/规格变化、benchmark 和技术读者。数据、差异、分数和深色实验台气质是核心时使用。
- `assets/template-warm-review.html` — 暖刊测评 · 暖纸杂志
  - 适合样张、真实体验、相机、咖啡、家居、户外、手作和审美导向测评。需要温暖编辑部笔记感时使用。
- `assets/template-bauhaus-bright.html` — 包豪斯导购 · 几何信息海报
  - 适合强观点、无图信息卡、产品/证据模块、价格/规格/人群判断和高传播购买结论。需要用几何结构组织论点时使用。
- `assets/template-digital-pop.html` — 数字波普 · 高饱和会员卡
  - 适合 AI 工具、App、软件订阅、游戏服务、会员权益、创作者资源、课程和年轻数字产品。需要高能、转化导向、产品化气质时使用。
- `assets/template-blue-stack.html` — 蓝栈 · 蓝黑构建系统（使用时同步复制 `assets/icon/icons.js` 到任务目录）
  - 适合 Web3 基础设施、开发者平台、AI/数据基础设施、链上生态、SDK/tooling 和技术产品策略。需要高级蓝黑平台站气质时使用。
- `assets/template-seasonal-editorial.html` — 季节编辑 · 美妆时尚拼贴
  - 适合美妆、时尚、香氛、配饰、穿搭/生活方式零售、色板、试用、材质和编辑型电商。真实视觉证据和拼贴节奏重要时使用。

使用 `assets/template-swiss-guide.html` 时，如果本地有授权字体文件，还要把 `assets/fonts/Aeonik-Regular.woff2`、`assets/fonts/Aeonik-Medium.woff2`、`assets/fonts/AeonikFono-Regular.woff2` 复制到任务目录的 `assets/fonts/`。如果字体不存在，保留模板系统 fallback，不要阻塞生成。

推荐输出结构：

```text
review-verdict-<slug>/
  index.html
  deck-data.json
  assets/
    SOURCES.md
  output/
```

## 脚本

迭代时优先使用快速路径：

```bash
node <skill>/scripts/validate-review-deck.mjs <task-dir> --text-only
node <skill>/scripts/render-review-deck.mjs <task-dir>
node <skill>/scripts/render-review-deck.mjs <task-dir> --pages 1,3,7
node <skill>/scripts/build-review-deck.mjs <task-dir> --fast
node <skill>/scripts/build-review-deck.mjs <task-dir> --fast --pages 3
```

脚本会在可用时自动检测 Playwright（skill 依赖、当前项目依赖或 Codex bundled runtime）。不要添加无意义的占位参数；如果某个命令需要占位参数，应修脚本，而不是绕过它。

最终交付前运行完整校验：

```bash
node <skill>/scripts/validate-review-deck.mjs <task-dir>
```

一条命令完整构建：

```bash
node <skill>/scripts/build-review-deck.mjs <task-dir>
```

构建后，最终回复必须同时链接：

- `<task-dir>/output/` — 包含单张 PNG 的导出图片目录。
- `<task-dir>/output/contact-sheet.png` 或 `<task-dir>/output/index.html` — 总览/预览页面。

## 参考文件地图

- `references/quick-start.md` — 默认工作流、菜单、规则权威映射、组件清单、图片时间预算、快速命令。
- `references/intake-contract.md` — 提问契约、单选 wording、证据问题、推荐语。
- `references/review-intake.md` — 详细 intake、问题顺序、中国市场来源优先级。
- `references/fact-model.md` — 紧凑 fact/verdict model 契约。
- `references/page-types.md` — 7 页骨架、页面/组件字数预算、fit ladder、fallback 字段。
- `references/example-patterns.md` — 本地示例轻量模式，避免打包完整渲染卡组。
- `references/style-routes.md` — 路线身份、配色、风格规则。
- `references/layout-discipline.md` — 注释、页脚、图注、base-layer、公式、risk/issue strips。
- `references/image-evidence.md` — 证据图片来源、sourcing、裁切、禁止伪造规则。
- `references/qa-checklist.md` — 最终 QA 和 validator 预期。
