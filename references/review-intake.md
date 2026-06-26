# Review Intake

Gather only missing information that affects the deck. Prefer proceeding with marked placeholders over blocking on minor gaps.

## First Question: Style Route

For every new deck, ask the style question first unless the user already named a route or explicitly asked for fast / one-shot generation. The style question must include one content-specific recommended route.

Use `intake-contract.md` as the source of truth for setup-question mechanics, recommendation wording, and evidence-source wording. Use `style-routes.md` as the source of truth for popup labels, plain-text fallback copy, reply mapping, route recommendation rules, and palette options.

After the route is selected, pick or ask for the route palette using the Palette Prompt Policy in `references/style-routes.md` and `references/intake-contract.md`. Ask palette questions for every multi-palette route: `swiss-guide`, `geek-bench`, `warm-review`, `digital-pop`, and `seasonal-editorial`, unless the user already named a palette or explicitly asked for fast / one-shot generation. The palette question must include one recommended palette. Skip palette questions for fixed-palette routes: `bauhaus-bright` (`classic`) and `blue-stack` (`blue-core`). If the user wants speed, use the route's default palette or a clear content-specific recommendation.

The recommended setup sequence is defined in `intake-contract.md`: style route, palette when needed, missing-copy mode when source copy is absent, evidence source when needed, then fact-check scope when unstable facts affect the verdict.

## Missing Copy Gate

If the user has not supplied concrete source copy, ask a single-select missing-copy mode question before generating. Do not jump straight to "please paste content" unless the user chooses `用户提供内容`.

Missing-copy mode question:

```text
还缺少生成卡片的具体内容。请选择一种方式：
A. 由 AI 一键完成内容（推荐：适合只给了产品名/主题，AI 会查资料、整理事实模型，并尽量抓取优质图片素材）
B. 用户提供内容（适合你有文章、笔记、链接、截图或产品事实；最好同时提供产品图/样张/截图，效果更好）
```

Concrete source copy means at least one of:

- Article text, pasted notes, review outline, spec table, or product comparison notes.
- A product URL / article URL that the agent can inspect.
- Screenshots, documents, or local files containing the product facts.
- A clear product name plus buying question plus enough facts to build verdict pages.

If the user chooses `由 AI 一键完成内容`, treat that as permission to research and synthesize the source copy, try one focused round to source high-quality product/sample/screenshot images when useful, then record source URLs, image provenance, and unresolved facts in `deck-data.json` / `assets/SOURCES.md`. If the user chooses `用户提供内容`, ask one concise free-form follow-up for article text, notes, URL, screenshot/document, spec table, or product facts, and suggest attaching product photos, sample images, screenshots, price screenshots, or source-article images for better visual quality. In Claude / Claude Code, use the popup question UI when available; in other tools, ask with a plain numbered prompt for the mode choice.

## Required Inputs

- Product and exact variant/model name.
- Source: article text, URL, screenshots, notes, or review outline.
- Core buying question: "值不值", "买标准版还是 HDF", "是否值得升级", "等降价吗".
- Evidence assets: product photo, sample photos, screenshots, official spec page, price screenshot.
- Market/pricing basis: default mainland China / RMB for SMZDM unless user says otherwise.
- Desired platform: default 3:4 carousel, `1080 x 1440`.

## China-Market Priority

For SMZDM-oriented decks, default to mainland China information:

- Price: mainland China official price, Tmall/JD/authorized store price, SMZDM deal price, or user-provided RMB screenshot.
- Availability: mainland China sale status, stock, pre-order, channel, warranty, and region limits.
- Promotion: China-market coupons, subsidies, member prices, payment discounts, and activity deadlines.
- Specs/variant differences: prefer China official product pages when available; use global specs only to fill stable technical gaps.

Use overseas information only when no reliable China-market information is available. If used, label it as fallback in the fact model and sources, not on the card image:

```text
price_basis: overseas_fallback
source_note: overseas price is reference-only; mainland China price is unresolved
graphic_action: 等成交价稳定 / 先看本地上市价
```

Do not convert overseas prices into RMB and present them as domestic prices. Do not make a China-market buy/wait/skip conclusion primarily from overseas pricing unless the user explicitly asks for overseas buying.

Graphic surface rule: fallback labels and unresolved price status stay in `deck-data.json` and `assets/SOURCES.md`. Do not print hard disclaimer labels such as `待核实`, `以官方为准`, or `仅作参考` on the card. Market wording such as `中国大陆`, `国行`, or `海外` should not appear as a disclaimer label, but may remain when it is necessary product/version context. Do not print unverified hard prices or overseas fallback hard prices; turn them into buying judgment copy instead. Only verified mainland China prices may appear on the card.

## Evidence Image Gate

For review decks, photos and screenshots are evidence, not decoration. If the user supplies no assets, ask the evidence-source question from `intake-contract.md` once.

If B is chosen:

- Use the image source ladder from `image-evidence.md`: user/source assets first, then brand-owned official assets, high-quality brand/editorial launch coverage, authorized storefronts such as Tmall/JD official shops, curated deal/community sources such as 什么值得买, and finally credible video screenshots. Do not let source priority override visual quality; skip JD/Tmall/store images with dominant watermarks, promo overlays, coupon panels, text-heavy detail slices, or unreadable/cropped embedded copy. Small corner brand/project signatures can pass when they do not cover the subject.
- Try one focused image-finding round only. If the image is blocked by JS rendering, hotlink protection, missing media URLs, or unreliable CDN guessing, stop immediately.
- Do not keep trying WebFetch, curl, guessed PNG paths, broad image-search scraping, or multiple mirror sites.
- If the focused round fails, set `deck-data.json.no_image_reason` and switch to no-image information cards.
- Save images under `assets/` by purpose, e.g. `product-hero.jpg`, `sample-hdf.jpg`.
- Record provenance in `assets/SOURCES.md`.
- Disclose sources in the final response.

If C is chosen:

- Use diagram/data/ledger structures.
- Do not pretend an image comparison exists.

## Evidence Relationship Rule

Before choosing a page type, classify each asset's evidence relationship:

- `single-sample`: one official/user sample showing a result.
- `same-scene-ab`: source explicitly labels same-scene/same-subject A/B comparison, e.g. HDF OFF vs HDF ON.
- `variant-product`: two product/variant images, not proof of performance difference.
- `mechanism`: diagram, official explanation, spec table, or feature illustration.
- `decorative`: visually relevant but not evidence; avoid using as the main proof.

Only use `before-after-effect` when the assets are `same-scene-ab` or the user explicitly provides a valid paired comparison. Do not simulate an A/B by editing a photo, color grading it, blurring it, or pairing unrelated samples. If the source is only `single-sample`, use `evidence-sample` and write "官方样张，非同场景 A/B" when the distinction matters. If an image is a mechanism/feature illustration, do not label it as a real-world sample.

## Asset Variety Rule

Do not repeat the same source image as the main visual across a deck. This includes alternate-size downloads, marketplace variants, crops, and detail crops derived from one original image. If only one usable image exists, use it once, reduce image-led pages, and switch later pages to ledgers, mechanisms, or verdict structures. Do not pad the deck by reusing the same photo.

## Unstable Fact Rule

Verify or mark as `待核实`:

- Current prices, coupons, stock, sale dates, subsidies.
- Official specs, release dates, regional availability.
- Product version differences and feature removals.
- Review scores, rankings, sales volume, and "historical low" claims.

Never invent these values for the image. If unresolved, write "待核实" or "以页面为准" in the fact model and avoid printing a hard claim in the graphic.

### One-Round Fact Check Batch

When browsing or searching is needed, batch the fields before the first lookup and try to resolve them together:

```text
price_cn / availability_cn / launch_or_release_cn / variants_cn
official_specs / video_specs / battery_or_weight / key_competitor_context
coupon_or_subsidy / warranty_or_channel / source_urls
```

Do not write half the deck and then open a second search just for one forgotten field such as `8K`, weight, or launch status. If a field is still unresolved after the first focused round, put it in `deck-data.json.unverified` and turn the visible card copy into a buying action.

## Source Notes

Keep routine source notes out of the image. Record them in `assets/SOURCES.md` and mention in the final response. Do not put cross-region pricing, unverified price labels, or disclaimer text on the card; use decision copy instead.
