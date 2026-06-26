# SMZDM Review Cards · 值得买测评结论卡

一个适配 Claude Code / Codex 等 Agent 环境的测评卡片技能,用于从测评文章、购买建议、商品链接、截图、规格表、样张或笔记生成 **1080x1440 的什么值得买风格 3:4 结论组图**。

它不只是把长文排成海报,而是把材料压缩成读者真正关心的购买判断:

- **值不值得买**
- **适合谁 / 不适合谁**
- **现在买 / 等降价 / 直接跳过**
- **证据是什么 / 风险在哪里**

> 这个 Skill 和 `smzdm-product-comparison-skill`、`guizang-social-card-skill` 分开维护。前者偏多商品横评和选购指南,后者偏小红书/公众号通用图文;这里专注单品或少量版本的“测评结论 carousel”。

## 30 秒开始

## 安装

Codex:

```bash
git clone https://github.com/kirasun1104/smzdm-review-cards.git ~/.codex/skills/smzdm-review-cards
```

Claude Code:

```bash
git clone https://github.com/kirasun1104/smzdm-review-cards.git ~/.claude/skills/smzdm-review-cards
```

Claude.ai 网页版可以把仓库内容打包为 zip 上传,确保 zip 根目录直接包含 `SKILL.md`。

> `assets/fonts/` 下的本地商业字体默认不随公开仓库分发。Swiss 模板会使用系统字体回退;如果你有合法授权,可自行把对应字体文件放回 `assets/fonts/`。

把测评材料、商品链接、截图或笔记发给 Agent,然后说:

```text
用 smzdm-review-cards 做一套 7 页测评结论卡,帮我判断值不值得买。
```

也可以直接指定风格:

```text
这篇相机测评做暖刊测评风,重点讲样张和使用感。
这个 Mac Studio 购买建议用蓝栈风,偏技术平台和配置判断。
这个 AI 工具订阅值不值,用数字波普风。
这个粉底液试色测评,用季节编辑风。
```

如果不确定风格,说“推荐”,Agent 会按内容自动选。

## 效果

- **7 页测评骨架**:封面结论、证据样张/截图、机制取舍、版本对比、适合人群、价格规格账本、最终买/等/跳。
- **7 套视觉路线**:瑞士导购、Geek 数据台、暖刊测评、包豪斯导购、数字波普、蓝栈、季节编辑。
- **真实证据优先**:商品图、样张、截图、试色、价格、参数必须来自用户材料、官方/授权来源、任务截图或记录到 `assets/SOURCES.md` 的公共来源。
- **结构化事实模型**:页面文案从 `deck-data.json` 的事实/结论模型生成,不靠自由发挥的文章摘要。
- **价格事实保护**:价格、库存、券、补贴、保修、渠道等容易变化的信息要核验;未核验不能直接印硬价格。
- **图片不重复规则**:同一套图默认不能重复使用同一张证据图,除非写入 `deck-data.json.allowed_repeated_assets`。
- **自动渲染和校验**:Playwright 渲染 PNG,validator 检查溢出、重复图片、证据来源、文案预算和阻塞项。
- **单文件 HTML 交付**:拷贝 seed template 后替换 `<!-- POSTERS_HERE -->`,不需要前端构建链。

## 适合 / 不适合

**合适**:单品测评 / 值不值得买 / 新旧款变化 / 多版本怎么选 / 价格账本 / 参数取舍 / 样张对比 / App 或 AI 工具订阅判断 / 美妆试色 / 生活方式产品体验。

**不合适**:纯商品横评大矩阵 / 通用小红书图文或公众号封面 / 没有证据的商品图生成 / 纯修图 / 未核验价格硬广。

## 模板风格怎么选

| 模板 | 路线 | 适合内容 | 视觉气质 |
| --- | --- | --- | --- |
| `assets/template-swiss-guide.html` | 瑞士导购 · 白底信息板 | 价格、参数、版本选择、购买账本、买/等/跳判断。 | 白底冷灰信息板,红色或指定强调色只用于价格、结论和风险。 |
| `assets/template-geek-bench.html` | Geek · Dark Data Bench | 硬件测试、手机/相机/PC 性能、光学/规格变化、跑分和技术读者。 | 深色实验台,等宽数字、分数块、delta、条形和底部粒子辉光。 |
| `assets/template-warm-review.html` | 暖刊测评 · 暖纸杂志 | 样张、使用体验、相机、咖啡、家居、户外、手作和审美偏好。 | 温暖杂志田野笔记,衬线大标题、虚线规则、图片注释和慢节奏阅读。 |
| `assets/template-bauhaus-bright.html` | 包豪斯导购 · 几何信息海报 | 强观点、无图信息卡、商品/证据模块、价格/参数/人群决策。 | 暖纸几何海报,黑色结构线和红/黄/蓝语义色块组织论点。 |
| `assets/template-digital-pop.html` | 数字波普 · 高饱和会员卡 | AI 工具、App、软件订阅、游戏服务、会员权益、课程、创作者资源。 | 高饱和数字产品卡,大圆角模块和 CTA 式结论,更年轻、更转化。 |
| `assets/template-blue-stack.html` | 蓝栈 · 蓝黑构建系统 | Web3 基础设施、开发者平台、AI/数据基础设施、链上生态、SDK/工具链。 | 蓝黑技术平台官网感,蓝色方形 icon 模块、点阵规则和建筑感大标题。 |
| `assets/template-seasonal-editorial.html` | 季节编辑 · 美妆时尚拼贴 | 美妆、时尚、香氛、配饰、穿搭、试色、试穿、质地和生活方式零售。 | 高能编辑部首页,珊瑚/奶油或红/黑背景交替,真实照片拼贴节奏。 |

## 使用流程

Skill 本身是结构化工作流,Agent 通常按 7 步走:

1. **Intake** - 明确产品、目标读者、材料来源、是否需要核验价格/参数。
2. **Route & Palette** - 从 7 条路线里选 1 条;凡是多配色路线都追问一次配色并给推荐,一套图只允许一个风格和一个 palette。
3. **Fact Model** - 把长文、截图、规格、价格、样张整理成结构化事实和结论。
4. **Asset Prep** - 下载或整理真实证据图,写入 `assets/SOURCES.md`,避免重复使用同一资产。
5. **Compose** - 拷贝 seed template 到任务目录,替换 `<!-- POSTERS_HERE -->`,生成 `index.html` 和 `deck-data.json`。
6. **Render** - 用脚本渲染 PNG 和 contact sheet。
7. **Validate & Iterate** - 跑文字/图片/布局校验,修掉阻塞项后交付。

详细规则见 [`SKILL.md`](./SKILL.md),深度细节按需阅读 `references/*.md`。

## 推荐目录结构

```text
review-verdict-<slug>/
  index.html
  deck-data.json
  assets/
    SOURCES.md
  output/
```

`local-tests/` 只放真实实验、下载证据和渲染结果,不要当成发布包内容。

## 常用命令

迭代时优先快检:

```bash
node scripts/validate-review-deck.mjs <task-dir> --text-only
node scripts/render-review-deck.mjs <task-dir>
node scripts/render-review-deck.mjs <task-dir> --pages 1,3,7
node scripts/build-review-deck.mjs <task-dir> --fast
node scripts/build-review-deck.mjs <task-dir> --fast --pages 3
```

交付前跑完整校验:

```bash
node scripts/validate-review-deck.mjs <task-dir>
```

一键完整构建:

```bash
node scripts/build-review-deck.mjs <task-dir>
```

测试 validator fixtures:

```bash
npm run test:fixtures
```

## 目录结构

```text
smzdm-review-cards/
├── SKILL.md                              # Agent 入口:快读路径、核心规则、模板列表
├── README.md                             # 本文件
├── package.json
├── agents/
│   └── openai.yaml
├── assets/
│   ├── template-swiss-guide.html         # 瑞士导购
│   ├── template-geek-bench.html          # Geek 数据台
│   ├── template-warm-review.html         # 暖刊测评
│   ├── template-bauhaus-bright.html      # 包豪斯导购
│   ├── template-digital-pop.html         # 数字波普
│   ├── template-blue-stack.html          # 蓝栈
│   ├── template-seasonal-editorial.html  # 季节编辑
│   ├── fonts/                            # 可选本地授权字体,公开仓库默认不分发
│   └── icon/                             # Blue Stack icon set
├── references/
│   ├── quick-start.md                    # 默认工作流、菜单、命令和规则地图
│   ├── intake-contract.md                # setup 问题契约
│   ├── review-intake.md                  # 详细 intake 和中国市场信源优先级
│   ├── fact-model.md                     # 事实/结论模型
│   ├── page-types.md                     # 7 页骨架、文案预算和 fit ladder
│   ├── style-routes.md                   # 路线、palette、推荐映射和身份测试
│   ├── layout-discipline.md              # 注释、页脚、底层、风险条等版式纪律
│   ├── image-evidence.md                 # 真实图片来源和 no-fake 规则
│   ├── example-patterns.md               # 本地例子的轻量模式
│   └── qa-checklist.md                   # 最终 QA 和 validator 预期
├── scripts/
│   ├── validate-review-deck.mjs
│   ├── render-review-deck.mjs
│   ├── build-review-deck.mjs
│   └── playwright-loader.mjs
└── tests/
    └── fixtures/
```

## 核心设计原则

1. **购买判断优先** - 每页都要回答一个具体决策问题,不是装饰性总结。
2. **证据不能伪造** - 不生成假商品图、假样张、假 UI、假价格或假口碑。
3. **事实先结构化** - 文案来自 fact/verdict model,再进入页面骨架。
4. **一套图一个风格** - 不混 route、不混 palette、不临时发明组件家族。
5. **价格谨慎** - 不稳定事实要核验或标 unverified,未核验硬价格不上图。
6. **图片少而准** - 真实证据图优先,同图默认不复用,裁切要服务判断。
7. **中文排版要稳** - 避免单字尾行,过长文案走 fit ladder,不靠小字和挤压硬塞。
8. **校验是交付门槛** - validator 的 FAIL 项是阻塞项,修完再交。
