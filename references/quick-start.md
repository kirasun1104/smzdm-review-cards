# Quick Start

Use this file as the default operating guide for speed. Read the longer references only when the task hits a special case.

## Fast Workflow

1. Read `intake-contract.md`, then ask for one style route first unless the user explicitly asks for fast / one-shot generation or already named a route. Include one recommended route.
2. Ask one palette question for every multi-palette route; skip only fixed-palette routes or explicit fast / one-shot requests. Include one recommended palette.
3. If no concrete source copy exists, ask the missing-copy mode question before generation: `由 AI 一键完成内容` or `用户提供内容`. A product name alone is not enough.
4. Ask the evidence-source question only when no credible assets exist and evidence images would materially affect the deck.
5. Build `deck-data.json` first: compact fact model, `quantified_evidence`, `asset_usage`, omitted page types, unresolved facts, and source URLs.
6. If the source contains tables, measured numbers, benchmarks, ratings, or competitor specs, plan one visible evidence layer before choosing final page copy.
7. Choose page types and fit visible copy to budgets before writing HTML.
8. Copy one seed template, replace `<!-- POSTERS_HERE -->`, and remove the seed `.template-preview` block from the generated deck.
9. Run text preflight before rendering.
10. During iteration, render only the changed pages when possible.
11. Run full validation only before final delivery or when the user asks for validation. For final delivery, prefer `--validate-first` so blocker failures are caught before exporting a full PNG set.
12. In the final response, always include the exported image directory path: `<task-dir>/output/`. Also include the contact sheet or preview HTML, but do not omit the image directory.

`render-review-deck.mjs` writes individual page PNGs, `output/contact-sheet.png`, and a quick image gallery at `output/index.html` for opening or downloading generated images.

Commands:

```bash
npm run validate:text -- <task-dir>
npm run render -- <task-dir>
npm run validate -- <task-dir>
npm run validate:strict -- <task-dir>
npm run validate -- <task-dir> -- --pages 3
npm run render -- <task-dir> -- --pages 1,3,7
npm run build:fast -- <task-dir> -- --pages 3
npm run build -- <task-dir> -- --pages 3
npm run build -- <task-dir> -- --validate-first
npm run build:strict -- <task-dir>
```

Shortcut:

```bash
npm run build -- <task-dir>
```

Use `build:fast` / `--fast` while iterating when you only need text preflight plus fresh renders. Use `build -- --pages 3` or `validate -- --pages 3` when only one poster changed and you want rendered checks for that page. Run full validation before final delivery; use `build -- --validate-first` for the last pass so rendered-check blockers are caught before exporting a full PNG set. Use `build:strict` / `validate:strict` only when advisory warnings should block delivery.

## Speed Discipline Without Cutting Questions

Do not reduce required setup questions to save time. Instead, save time after the user has answered them:

- Batch all source/fact lookups into one parallel pass immediately after the final setup answer.
- Extract hard tables and numbers into `quantified_evidence` during that same pass.
- Prefer 1-3 strong evidence images and stop after the focused image round; do not keep probing official CDNs or broad image searches.
- Create `deck-data.json`, `SOURCES.md`, and the HTML in one edit pass before first render.
- Run `validate:text` before any render; it catches cheap blockers without launching a browser.
- Iterate with `build:fast -- --pages <n>` for changed pages only.
- Use `build -- --validate-first` for final delivery, then inspect `output/contact-sheet.png` once.

The scripts should be callable without dummy positional arguments. They auto-detect the bundled Codex Playwright package where possible; set `PLAYWRIGHT_MODULE_PATH` only when using a nonstandard local Playwright install.

`npm run validate` and `npm run build` fail only on FAIL items. WARN items are advisory by default, following the social-card validator pattern. Use `validate:strict` or `build:strict` when warnings should be treated as blockers.

## Question Flow

Use `intake-contract.md` as the source of truth for setup-question behavior, single-select rules, recommendation language, and evidence-source wording. Use the examples below only as copy patterns.

Default behavior: ask setup questions unless the user explicitly asks for fast / one-shot generation (`快速生成`, `一键生成`, `直接生成`, `不用问`, `按推荐来`, `你定`, `自动选择`, `speed`, `quick`, `one-shot`, or equivalent). In Claude / Claude Code, use the native popup question UI whenever available; otherwise use the simplest numbered text menu.

Missing-copy question example:

```text
还缺少生成卡片的具体内容。请选择一种方式：
1. 由 AI 一键完成内容（推荐：适合只给了产品名/主题，AI 会查资料、整理事实模型，并尽量抓取优质图片素材）
2. 用户提供内容（适合你有文章、笔记、链接、截图或产品事实；最好同时提供产品图/样张/截图，效果更好）
```

After style selection, follow the palette policy exactly:

- Ask palette for every multi-palette route: `swiss-guide`, `geek-bench`, `warm-review`, `digital-pop`, and `seasonal-editorial`.
- Do not ask palette for `bauhaus-bright` or `blue-stack`.
- If the user already named a palette or asks for speed, proceed without another palette question.

Palette question example:

```text
选一个 Geek 风格的数据强调色，直接回 1/2/3：

1. electric-blue：蓝紫粉底部粒子光，更像硬件跑分/性能台
2. aurora-cyan：青蓝绿，更像功耗、效率、散热、低噪声测试（推荐）
3. terminal-green：绿青蓝，更像服务器、开发者、稳定性/运维工具

这题建议选 2：NAS / 轻量服务器的核心是效率、功耗和稳定性。
```

Swiss palette example:

```text
选一个瑞士导购强调色，直接回 1/2/3/4/5：

1. smzdm-red：默认值得买红，适合通用值不值、价格和最终动作
2. ikb-blue：更理性，适合参数、规格、技术对比
3. lemon-yellow：更轻快，适合生活方式清单和轻零售
4. vivid-green：适合清洁、健康、效率、环保取向（清洁/宠物用品推荐）
5. safety-orange：适合避坑、价格风险、警示型导购
```

Swiss palette recommendation map:

- 清洁、宠物清洁、健康、效率、环保：推荐 `vivid-green`。
- 参数、规格、理性技术比较：推荐 `ikb-blue`。
- 避坑、风险、价格警示、易踩坑品类：推荐 `safety-orange`。
- 生活方式清单、轻零售、礼物/小物：推荐 `lemon-yellow`。
- 普通值不值、价格判断、SMZDM 默认导购：使用 `smzdm-red`。

Warm-review palette example:

```text
选一个暖刊测评色彩方向，直接回 1/2/3/4：

1. kelvin-glow：默认橙红场，适合情绪、生活方式、审美体验
2. cream-orange：更明亮轻盈，适合橙色/奶油色杂志感
3. indigo-paper：适合更克制的相机/科技编辑感
4. forest-paper：适合户外、咖啡、家居、自然取向
```

Digital Pop palette example:

```text
选一个数字波普配色，直接回 1/2/3：

1. violet-lime：电紫 + 荧光绿，适合 AI 工具、会员权益、创作者资源、软件订阅（推荐）
2. lime-blue：酸性绿 + 亮蓝，适合游戏、课程、性能工具、更新发布
3. violet-pink：亮紫 + 糖果粉，适合美妆 App、生活方式订阅、创作者社区、轻松 SaaS
```

Seasonal Editorial palette example:

```text
选一个季节编辑配色，直接回 1/2：

1. coral-cream：珊瑚红 + 暖奶油，适合明亮直接的美妆/时尚/生活方式导购（推荐）
2. approach-red：强红 + 黑 + 暖白，适合更锋利、更图形化、少一点粉感的编辑部视觉
```

## Style Route Menu

Use `references/style-routes.md` as the single source of truth for route labels, descriptions, palette choices, and the plain-text fallback menu. One deck uses one route and one palette.

## Rule Authority

Use this map to avoid drift between references:

| Rule family | Source of truth |
| --- | --- |
| Setup question flow, recommendation wording, evidence-source question | `intake-contract.md` |
| Style route labels, palette names, route recommendation | `style-routes.md` |
| Page types, minimum capacity, page and component copy budgets, fit actions | `page-types.md` |
| Fact model, verified/unverified fields, price/disclaimer discipline | `fact-model.md` |
| Evidence image provenance, cropping, object-position, no-fake-image rules | `image-evidence.md` |
| Local example patterns and package-size discipline | `example-patterns.md` |
| Route-independent layout mechanics and component rhythm notes | `layout-discipline.md` |
| Final QA checklist and validator expectations | `qa-checklist.md` |

Before writing page copy, read the budget and fit-action sections in `page-types.md`. Do not maintain a second budget table in this file.

Rendered validation also checks text fit inside registered component containers. Text must remain fully visible, stay inside the component safe inset, and keep route-owned spacing between labels and body copy. If visible text does not fit, fix it in this order:

1. Rewrite shorter or move detail to `deck-data.json` / `assets/SOURCES.md`.
2. Split the claim into another registered row/card or switch to a roomier page type.
3. Let normal wrapping happen inside the component when the text is body copy.
4. Use only route-owned compact variants already defined in the seed template, such as smaller numeric treatment for dense price chips.

Do not rescue text with inline `font-size`, `line-height`, negative spacing, ad hoc padding, or one-off CSS patches. If a text role repeatedly needs a new size or spacing, update the seed template and validator together.

For stacked metric cards such as `label/chip + price/number`, use the route-owned card rhythm: a normal grid stack with visible breathing room between the label and the value. Do not place label chips flush against large numerals, and do not fix that case per card with inline margins.

## Component Checklist

Use registered classes only:

```text
compare-card / split-row / verdict-pill / stamp / risk / risk-strip / issue-strip
price-formula / formula-step / bws-card / sample-compare / zoom-cell
bauhaus-band / metric-box / decision-matrix / decision-cell / bar-row
minimal-ledger / minimal-row / numbered-list / numbered-item / punch-strip
image-caption
object-frame / evidence-frame / image-module / image-well
decision-button / mono-pill-row / mono-pill / benefit-row / benefit-number
media-stack / avatar-ring
bracket-note / dashed-rail / decorative-point / glow-line
```

Do not invent one-off layout classes unless updating the seed template for a recurring pattern.

Use `.verdict-pill` for short verdict phrases, especially on `final-verdict`. Its shape, radius, fill, and typography are route-owned by the seed template: do not override it per page. Swiss uses a sharp filled verdict block; Geek uses a glowing data pill; Warm uses a paper/editorial badge; Bauhaus uses a hard geometric block.

Use `.risk` items inside `.risk-strip` and plain `<span>` items inside `.issue-strip`; templates render both with route-matched dot bullets. Dot bullets must sit inside the module padding, never flush against the module edge, and align to the optical vertical center of the first text line. Do not add vertical bar decorations manually.

When `.issue-strip` or `.risk-strip` has exactly three items, use the template's three-column information-band layout. In `swiss-guide`, this band visually matches the rounded black `.solid-band`: same large radius, black surface, route accent labels, and internal dividers that stop short of the top and bottom rounded edges. Do not use child `border-left` rules that run full-height into the corners. In `bauhaus-bright`, build the three-column band with a single black grid background, 4px gaps, and paper-filled cells instead of combining a parent outline with child divider borders; this avoids doubled T-joints and browser-scaling artifacts. Also clear stacked-list separators such as `.risk + .risk { border-top: ... }` inside this three-column state, otherwise the second and third cells get an extra top rule. Anchor this band as a lower content layer and leave a safe gap before the footer rule. Each item should be `short title + one controlled sentence`, e.g. `<strong>性能能效</strong><em>小体积强算力，适合常开轻服务。</em>`. Keep titles 2-5 Chinese characters and explanations around 14-22 Chinese characters. If copy is too short, add decision value; if too long, cut to the consequence.

On `final-verdict`, avoid stacking two rounded bands in the lower half. Use one dominant rounded support module only: merge risks and next actions into one three-column `.risk-strip`, or keep the rounded band for the final action and express limitations as linear ledger/split rows above it. If both rounded modules seem necessary, the page is overloaded; move one layer to the previous page or shorten the final.

Use `.split-row` for label/value rows. The label and the first line of body copy are optically aligned by the template for both single-line and multi-line bodies. Do not add per-row margins, padding, line-height, or position patches to correct alignment.

For `swiss-guide`, `geek-bench`, `warm-review`, `digital-pop`, `blue-stack`, and `seasonal-editorial`, use `.base-layer` on the last real content block when a page would otherwise leave the lower third empty. Good base-layer targets:

```text
ledger / risk-strip / issue-strip / bws-grid / decision-matrix / minimal-ledger
```

Do not add new top rules to `.base-layer`; let the component keep its own route-specific line, glass, or paper treatment.

When a page has sparse content, add a real content-bearing module before relying on whitespace: a ledger with 2-4 judgment rows, a risk strip, a decision matrix, or a price/action formula. Do not ship a page that is only a headline, three short cards, and a single bottom line.

For `audience-fit` pages such as `谁适合买 / 谁别买`, if the ledger leaves the lower third empty, prefer a three-column `.issue-strip` with audience archetypes rather than adding a decorative image. The strip should classify readers, not repeat the final buy/wait/skip action from `final-verdict`: e.g. `氛围党 / 价格党 / 清晰党`, each with one decision-relevant sentence. Use this as the default sparse-page rescue for audience pages.

Use `.price-formula` as a major content layer, not a tiny divider. On sparse pages, the formula steps should occupy meaningful vertical area through the template's default min-height, padding, and large numeric/action text. Prefer light/regular display weight for the big values/actions. When the formula belongs with a bottom ledger or risk explanation, wrap them in `.formula-stack` so the whole group sits lower with a safe footer gap.

## Image Time Budget

Image search must not become the project.

- Prefer user-supplied images, source-article images, or already available assets.
- If the product is context-sensitive, first try to find a real scene/use-environment image, not only a clean packshot. Examples: pocket cameras/gimbals, outdoor gear, appliances, beauty/fashion, furniture, vehicles, travel tools, and products where hand scale, setup, sample output, or use context changes the verdict.
- If the user asks the agent to find official/public images, try one focused round only.
- Official sites are often JS-rendered, hotlink-protected, or blocked; do not keep trying WebFetch, curl, guessed PNG paths, or broad image-site searches.
- Follow the image source ladder in `image-evidence.md`: user/source assets, brand-owned official assets, high-quality brand/editorial launch coverage, authorized storefronts such as Tmall/JD official shops, curated deal/community sources such as 什么值得买, then credible video screenshots. Source priority never overrides visual quality: skip dominant watermarked JD/Tmall/store assets, promo overlays, coupon panels, seller-layout screenshots, and text-heavy detail slices if they are unreadable or cropped. Small corner brand/project signatures can pass when they do not cover the subject. If official/authorized sources do not provide usable scene images, one public review/community fallback pass is allowed.
- Public review/community images are not official evidence. Use them for the visible scene/context they show, not for official specs, universal sample quality, rankings, or broad performance claims.
- Keep provenance off the card surface by default. Use only short evidence-role labels when helpful, such as `晒单场景`, `官方产品图`, `评测样张`, or `价格截图`; put full URLs, authors, and platform notes in `assets/SOURCES.md`.
- If one focused round fails, switch to no-image information cards and set `deck-data.json.no_image_reason`.
- Never draw/generate product, sample, UI, price, or A/B evidence.

For image-source option B, define "one focused round" as: one official/authorized source pass, one source-article pass if the user supplied a source, and one public review/community fallback if needed. Download only assets whose provenance can be recorded in `assets/SOURCES.md`. Stop after that and proceed.

## Fact Check Batch

When facts are unstable, gather them in one batch before writing copy:

```text
price_cn / availability_cn / launch_or_release_cn / variants_cn
official_specs / video_specs / battery_or_weight / key_competitor_context
coupon_or_subsidy / warranty_or_channel / source_urls
```

If a field cannot be verified quickly, record it in `deck-data.json.unverified` and turn it into a buying action instead of printing a hard number.

## Preflight Gates

Run text preflight before rendering:

```bash
npm run validate:text -- <task-dir>
```

It catches route/palette mismatch, over-budget copy, inline layout patches, SVG use, repeated images, missing data files, and market/disclaimer wording without launching a browser.

Render only changed pages during iteration:

```bash
npm run render -- <task-dir> --pages 3
```

Full validation is still required before delivery because only Playwright can catch visual overflow, component escape, clipping, footer drift, and density.

## Final Delivery Links

Every final delivery must include these paths:

- `图片目录`: `<task-dir>/output/` — the folder containing individual exported PNG cards.
- `预览`: `<task-dir>/output/contact-sheet.png` or `<task-dir>/output/index.html`.
- `源文件`: `<task-dir>/index.html` and, when useful, `<task-dir>/deck-data.json`.

Do not only link the HTML preview. The exported image directory is required because it is where the user retrieves the final card PNGs.
