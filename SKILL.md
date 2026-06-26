---
name: smzdm-review-cards
description: Generate SMZDM-style 3:4 product review verdict carousels from reviews, buying-guide articles, product links, screenshots, specs, sample photos, or notes. Use for cover verdicts, evidence pages, variant comparisons, audience fit, price/spec ledgers, and buy-wait-skip conclusions with one locked style route and palette.
---

# SMZDM Review Cards

Generate 1080×1440 SMZDM-style review verdict carousels that help readers decide: buy, wait, or skip.

Do not edit `guizang-social-card-skill` or `smzdm-product-comparison-skill`. Generated decks belong in the current workspace or a user-requested output folder.

## Fast Load Path

Read only what the task needs:

1. For normal generation, read `references/quick-start.md`.
2. Before asking setup questions, read `references/intake-contract.md`.
3. For route or palette choice, also read `references/style-routes.md`.
4. For long, mixed, or fact-heavy sources, read `references/fact-model.md` before writing page copy.
5. For detailed intake, image sourcing, unstable facts, or user-supplied evidence, read the relevant focused reference below.
6. Before final delivery or when the user asks for validation details, read `references/qa-checklist.md`.

Avoid reading `node_modules/`. Avoid reading every reference file by default.

## Core Rules

- One deck uses exactly one style route and one palette.
- Product/sample/screenshot images must be real evidence: user-supplied, source-article, official/authorized, screenshot captured for the task, or public source recorded in `assets/SOURCES.md`.
- For context-sensitive products, prefer credible scene/use-environment images over sterile packshots when the scene changes the buying judgment. If official scene images are unavailable, one focused public review/community fallback pass is allowed, including 什么值得买 and similar platforms, as long as provenance and limitations are recorded outside the cards.
- Do not reuse the same source image anywhere in the same deck, including exact files, near-duplicate files, alternate downloads, crops, detail crops, or multiple placements on one page or across pages. Do not use `allowed_repeated_assets` for evidence images unless the user explicitly requests visible repetition of their own supplied asset.
- Do not use source images with large platform, marketplace, or promotional watermarks as card evidence. Small unobtrusive source marks may be acceptable, but large marks such as central JD/Tmall/marketplace watermarks, coupon overlays, promo price panels, or platform text across the product must be rejected or the page must switch to a no-image information layout.
- Do not create or draw fake product/sample/UI/price evidence in any format. No generated product images, hand-drawn placeholders, CSS/canvas product drawings, or SVG evidence.
- Default price, availability, coupons, subsidies, warranty, launch, and channel facts to mainland China/RMB for SMZDM outputs.
- If price/spec/availability facts may have changed, verify them or mark them in `deck-data.json.unverified`; do not print unverified hard prices on the image.
- Disclaimer wording stays in `deck-data.json` or `assets/SOURCES.md`, not on cards. Market-basis wording should not appear as a disclaimer label, but may remain when necessary product/version context.
- Full image URLs, platform names, authors, crawl notes, and provenance explanations stay in `deck-data.json` or `assets/SOURCES.md` by default. Visible cards may use only short evidence-role labels such as `晒单场景`, `官方产品图`, `评测样张`, or `价格截图` when helpful.
- Page copy must come from the structured fact/verdict model, not free-form article summary.
- Stay within page/component copy budgets from `references/page-types.md`; it is the source of truth for budgets and fit actions.
- Avoid Chinese single-character widows/orphans in visible card text: no line should end with only one Chinese character or one Chinese character plus punctuation. Rewrite shorter, change the break point, or move detail to another row/card; do not fix it with tiny type, squeezed spacing, or one-off inline layout.
- Do not rescue overlong copy with inline layout styles, tiny type, compressed spacing, or one-off component families. Use the fit ladder in `references/page-types.md`.
- Validation FAIL items are blockers before final delivery.
- Final delivery must include the exported image directory path (`<task-dir>/output/`) in addition to any HTML preview, contact sheet, or source file links. This directory contains the individual 1080×1440 PNG exports and is the primary handoff for using the cards.

## Intake And Style

Setup-question rules live in `references/intake-contract.md`. Route definitions, choice labels, palette names, and recommendation mapping live in `references/style-routes.md`. Read those files before asking route, palette, evidence-source, or fact-check questions.

By default, ask setup questions before generating: style route first with one recommendation, then palette for multi-palette routes with one recommendation, then a missing-copy mode question if no concrete article/notes/URL/document/screenshot/product facts were supplied. The missing-copy mode question is single-select: `由 AI 一键完成内容` or `用户提供内容`; AI mode should research facts and try to source high-quality real images, while user-provided mode should ask for content and recommend attaching product/sample/screenshot images for stronger results. Skip style/palette/evidence questions only when the user explicitly asks for fast or one-shot generation (for example `快速生成`, `一键生成`, `直接生成`, `不用问`, `按推荐来`, `你定`, `自动选择`, `speed`, `quick`). If the active host is Claude / Claude Code and supports popup questions, use popups; otherwise use the simplest numbered text menu.

## Seed Templates

Copy one seed template to the task folder, replace `<!-- POSTERS_HERE -->`, and remove the seed `.template-preview` block from generated decks unless updating a recurring template pattern:

- `assets/template-swiss-guide.html` — 瑞士导购 · 白底信息板
  - Best for price/spec decisions, variant comparison, buying ledgers, and clear buy/wait/skip guidance. Use when the deck should feel rational, clean, and closest to a SMZDM shopping board.
- `assets/template-geek-bench.html` — Geek · Dark Data Bench
  - Best for hardware tests, phone/camera/PC performance, optical/spec changes, benchmarks, and technical readers. Use when data devices, deltas, scores, and dark lab energy are central.
- `assets/template-warm-review.html` — 暖刊测评 · 暖纸杂志
  - Best for sample photos, lived experience, cameras, coffee, home, outdoor, craft, and taste-led reviews. Use when the deck should feel like warm editorial field notes.
- `assets/template-bauhaus-bright.html` — 包豪斯导购 · 几何信息海报
  - Best for strong shareable verdicts, no-image information cards, product/evidence modules, price/spec/audience decisions, and punchy structured logic. Use when geometry should organize the argument.
- `assets/template-digital-pop.html` — 数字波普 · 高饱和会员卡
  - Best for AI tools, apps, software subscriptions, game services, memberships, creator resources, courses, and young digital products. Use when the deck should feel energetic, conversion-oriented, and product-led.
- `assets/template-blue-stack.html` — 蓝栈 · 蓝黑构建系统（使用时同步复制 `assets/icon/icons.js` 到任务目录）
  - Best for Web3 infrastructure, developer platforms, AI/data infrastructure, chain ecosystems, SDK/tooling, and technical product strategy. Use when the deck should feel like a premium blue-black platform site.
- `assets/template-seasonal-editorial.html` — 季节编辑 · 美妆时尚拼贴
  - Best for beauty, fashion, fragrance, accessories, outfit/lifestyle retail, swatches, try-on, texture, and editorial commerce. Use when real visual proof and collage rhythm matter.

When using `assets/template-swiss-guide.html`, also copy `assets/fonts/Aeonik-Regular.woff2`, `assets/fonts/Aeonik-Medium.woff2`, and `assets/fonts/AeonikFono-Regular.woff2` into the task folder at `assets/fonts/` when those licensed local font files are available. If they are not present, keep the template's system fallbacks and do not block generation.

Recommended output structure:

```text
review-verdict-<slug>/
  index.html
  deck-data.json
  assets/
    SOURCES.md
  output/
```

## Scripts

Use the fast path during iteration:

```bash
node <skill>/scripts/validate-review-deck.mjs <task-dir> --text-only
node <skill>/scripts/render-review-deck.mjs <task-dir>
node <skill>/scripts/render-review-deck.mjs <task-dir> --pages 1,3,7
node <skill>/scripts/build-review-deck.mjs <task-dir> --fast
node <skill>/scripts/build-review-deck.mjs <task-dir> --fast --pages 3
```

The scripts auto-detect the bundled Codex Playwright package when available. Do not add dummy positional arguments; if a command needs one, fix the script instead of working around it.

Run full validation before final delivery:

```bash
node <skill>/scripts/validate-review-deck.mjs <task-dir>
```

One-command full build:

```bash
node <skill>/scripts/build-review-deck.mjs <task-dir>
```

After build, final response must link both:

- `<task-dir>/output/` — exported image directory with individual PNGs.
- `<task-dir>/output/contact-sheet.png` or `<task-dir>/output/index.html` — review preview/contact sheet.

## Reference Map

- `references/quick-start.md` — default workflow, menus, rule authority map, component checklist, image budget, fast commands.
- `references/intake-contract.md` — setup-question contract, single-select wording, evidence question, recommendation language.
- `references/review-intake.md` — detailed intake, question sequence, China-market source priority.
- `references/fact-model.md` — compact fact/verdict model contract.
- `references/page-types.md` — 7-page skeletons, page/component budgets, fit ladder, fallback fields.
- `references/example-patterns.md` — lightweight patterns for local examples without shipping full rendered decks.
- `references/style-routes.md` — route identity, palettes, style-specific rules.
- `references/layout-discipline.md` — notes, footers, captions, base-layer, formula, risk/issue strips.
- `references/image-evidence.md` — evidence image provenance, sourcing, cropping, no-fake rules.
- `references/qa-checklist.md` — final QA and validator expectations.
