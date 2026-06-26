# Style Routes

Pick exactly one route and one palette/accent per deck. Do not mix routes inside a review.

## Route Menu

Use `intake-contract.md` for setup-question mechanics and recommendation wording. This file is the source of truth for route labels, route fit, palettes, and content-based route recommendation.

| No. | Route | Display name | Good fits | Default palette |
| --- | --- | --- | --- | --- |
| `1` | `swiss-guide` | 瑞士导购 · 白底信息板 | good deals, price/spec decisions, variant comparison, buy/wait/skip | white/cool grey + SMZDM red accent |
| `2` | `geek-bench` | Geek · Dark Data Bench | hardware testing, camera/phone/PC performance, benchmark-like evidence | near-black + bottom particle glow + electric blue data accent |
| `3` | `warm-review` | 暖刊测评 · 暖纸杂志 | sample photos, lifestyle experience, cameras, coffee, home, outdoor, taste-led reviews | 3200-inspired orange-red + warm cream typography |
| `4` | `bauhaus-bright` | 包豪斯导购 · 几何信息海报 | high-share verdict cards, image or no-image review logic, price/spec/audience decisions | Bauhaus paper + black + red/yellow/blue semantic blocks |
| `5` | `digital-pop` | 数字波普 · 高饱和会员卡 | AI tools, apps, software subscriptions, game services, memberships, creator resources, young digital products | high-saturation paired color + black/white CTA card language |
| `6` | `blue-stack` | 蓝栈 · 蓝黑构建系统 | Web3 infra, developer platforms, AI/data platforms, chain ecosystems, technical product strategy | black/white + core blue + dotted system lines |
| `7` | `seasonal-editorial` | 季节编辑 · 美妆时尚拼贴 | beauty, fashion, fragrance, lifestyle products, real swatches, try-on, editorial commerce | alternating coral/cream surfaces + giant condensed titles + real-photo collage |

Choice UI labels:

```text
1. 瑞士导购 · 白底信息板 — 价格、参数、版本选择、买/等/跳判断；最清楚、最像导购信息板。
2. Geek · Dark Data Bench — 硬件测试、参数变化、性能/光学/规格对比；更像深色实验台。
3. 暖刊测评 · 暖纸杂志 — 样张、体验、生活方式、审美偏好；更像温暖杂志测评。
4. 包豪斯导购 · 几何信息海报 — 强观点、无图信息卡、传播感强的购买结论；更像几何海报。
5. 数字波普 · 高饱和会员卡 — AI 工具、App、软件订阅、游戏服务、会员权益；更像年轻数字产品落地页。
6. 蓝栈 · 蓝黑构建系统 — Web3、开发者平台、AI/数据基础设施、链上生态；更像技术平台官网。
7. 季节编辑 · 美妆时尚拼贴 — 美妆、时尚、香氛、穿搭、生活方式；更像高能编辑部首页。
```

Plain-text fallback prompt:

```text
先选这套图的视觉风格，直接回 1/2/3/4/5/6/7 就行：

1. 瑞士导购 · 白底信息板
   适合：价格、参数、版本选择、买/等/跳判断。最清楚、最像导购信息板。

2. Geek · Dark Data Bench
   适合：硬件测试、参数变化、性能/光学/规格对比。更像深色实验台。

3. 暖刊测评 · 暖纸杂志
   适合：样张、体验、生活方式、审美偏好。更像温暖杂志测评。

4. 包豪斯导购 · 几何信息海报
   适合：强观点、无图信息卡、传播感强的购买结论。更像几何海报。

5. 数字波普 · 高饱和会员卡
   适合：AI 工具、App、软件订阅、游戏服务、会员权益、创作者资源。更像年轻数字产品落地页。

6. 蓝栈 · 蓝黑构建系统
   适合：Web3、开发者平台、AI/数据基础设施、链上生态、技术平台。更像蓝黑技术平台官网。

7. 季节编辑 · 美妆时尚拼贴
   适合：美妆、时尚、香氛、穿搭、生活方式实拍证据。更像高能编辑部首页。

不确定就回推荐，我会按内容帮你选。
```

## Style Lock

After route selection:

- Use one template only.
- Use one palette/accent only. `bauhaus-bright` uses one fixed Bauhaus palette per deck; red/yellow/blue blocks are semantic roles inside that palette, not page-by-page skins. `digital-pop` uses one fixed high-saturation paired-color language per deck; paired hues plus black/white roles are semantic, not random page skins.
- Keep one footer/page-number system.
- Keep one typography system.
- Keep one image treatment.
- Keep one border/radius/shadow language.

## Palette Prompt Policy

After the route is selected, ask for a palette whenever the selected route has more than one palette. Fixed-identity routes skip the palette question.

| Route | Palette behavior |
| --- | --- |
| `swiss-guide` | Ask: `smzdm-red`, `ikb-blue`, `lemon-yellow`, `vivid-green`, `safety-orange`. Mark at most one content-specific recommendation. |
| `geek-bench` | Ask: `electric-blue`, `aurora-cyan`, `terminal-green`. Recommend by content, not by default status. |
| `warm-review` | Ask: `kelvin-glow`, `cream-orange`, `indigo-paper`, `forest-paper`. |
| `bauhaus-bright` | Do not ask. Use `classic`. |
| `digital-pop` | Ask: `violet-lime`, `lime-blue`, `violet-pink`. Recommend by product mood and audience. |
| `blue-stack` | Do not ask. Use `blue-core`. |
| `seasonal-editorial` | Ask: `coral-cream` or `approach-red`, because they noticeably change the deck mood. |

If the user already named a palette, do not ask again. If the user asks for speed, choose the route default or a clear content-specific recommendation and proceed.

## Route Recommendation

If the user replies `推荐`, says they are unsure, or gives an unclear answer:

- Choose `warm-review` for review articles where sample images, use experience, field observation, or aesthetic judgment are central.
- Choose `swiss-guide` for "值不值", pricing, specs, variants, shopping advice, and cleaner SMZDM decision boards.
- Choose `geek-bench` for hard tests, parameters, performance, deltas, benchmarks, and technical readers.
- Choose `bauhaus-bright` for high-share cards where a strong buying judgment needs geometric structure, product/evidence modules, metrics, ledgers, or no-image information cards.
- Choose `digital-pop` for AI tools, apps, software memberships, game services, creator-resource bundles, young digital products, or subscription/benefit decisions where the card should feel high-energy and conversion-oriented.
- Choose `blue-stack` for Web3 infrastructure, developer platforms, AI/data infrastructure, chain ecosystems, SDK/tooling, and technical product strategy where the deck should feel like a premium blue-black platform site.
- Choose `seasonal-editorial` for beauty, fashion, fragrance, outfit, lifestyle, and visual proof-led shopping where real swatches, try-ons, product texture, styling, or editorial image rhythm matters.

For Ricoh GR4 HDF-like content:

- `warm-review` if the deck leads with HDF sample feel and street/photo experience.
- `swiss-guide` if the deck leads with "万元值不值" and variant choice.
- `geek-bench` only if the source has hard optical/parameter comparisons.
- `bauhaus-bright` for a punchy share-first version that still needs structured buying logic; it works with real images or without images.
- `digital-pop` only if the product is a digital service, creator tool, app membership, or community/resource bundle; do not use it for traditional camera sample proof or price-heavy hardware judgment.
- `blue-stack` only if the subject is a technical platform, developer system, data/AI infrastructure, Web3 product, or ecosystem/tooling decision; do not use it for lifestyle products, camera sample proof, or ordinary retail price comparisons.
- `seasonal-editorial` for beauty/fashion/lifestyle products when the deck can use real product, swatch, try-on, outfit, texture, or scene evidence; do not use it to fake try-on/sample proof.

## Identity Tests

### swiss-guide

Pass only if:

- Surface is white/cool grey.
- SMZDM red or chosen accent is used only for price, verdict, warning, or one highlight.
- Large titles are light, not 700-900 weight.
- Tables/ledgers use hairlines and tight label columns.
- Use a Flabbergast-inspired case-study structure when the deck needs more energy: left title/right evidence grids, giant condensed/tabular numbers, compact mono labels, rounded media wells, bottom solid action bands, and subtle glass information surfaces.
- Numeric modules follow the Flabbergast source relationship: small mono label above, large value below, and the corner-line detail on the value only when the value has a real label/caption. The label and value should be a compact pair, not separated to opposite ends of a tall box. Standalone values such as `15s` must either get a label such as `CLUMP` or lose the corner line. Do not add random arrows or decorative connector lines that are not attached to a labelled number, step, or decision.
- Use local `Aeonik-Regular`, `Aeonik-Medium`, and `AeonikFono-Regular` font files when available; remote `@font-face` URLs are too easy to miss in file-based previews. Latin numbers and uppercase labels should visibly use Aeonik/Aeonik Fono, while Chinese falls back safely.
- Image wells and sample pairs should use rounded, full-bleed media containers. Keep evidence images real and cropped intentionally; do not use rounded blocks as empty placeholders.
- Glass effects are allowed only for information surfaces such as compare cards, formula steps, issue strips, and zoom cells. Keep blur subtle and legibility high.
- Rounded information surfaces in `swiss-guide` share the same large media radius as the bottom solid action band: compare cards, formula steps, image wells, verdict pills, three-column issue/risk bands, and rounded final action bands should feel like one family. Linear ledgers, split rows, and plain grid panels stay square.
- Do not create a global black strip at the canvas bottom. Footers sit on the page surface with readable muted ink unless a page intentionally changes background color.
- Bottom solid color bands should carry action, risk, or reader classification content; do not use them as a purely decorative footer block. Black solid bands are for white/cool-grey pages only; on red or other colored backgrounds, switch the same rounded module to a white-stroked transparent band with white text so it stays integrated with the field. Solid bands must use the same large radius as media wells and stay inside the content flow, away from the top edge and footer. Internal dividers should stop short of the top and bottom rounded edges. When the lower third would otherwise feel empty, use the solid band as the final content-bearing layer with `.base-layer`; if this creates a hollow middle, add real rows above it instead of moving the band back into the middle.
- Three-column `.issue-strip` / `.risk-strip` modules in `swiss-guide` use the same rounded black solid-band geometry as `.solid-band`. Their internal dividers must be parent-level inset rules with breathing room from the top and bottom rounded edges, matching `.solid-band`; do not use child `border-left` rules that run full-height into the corners.
- On `final-verdict`, do not stack two rounded information bands in the lower half, such as a black `.risk-strip` immediately followed by an outlined or filled `.solid-band`. Pick one dominant final support module. If both risks and next actions are needed, merge them into one three-column `risk-strip` with `strong + em`, convert the secondary content to linear `.split-row` / `.ledger-row` rules above the band, or move the weaker module to the prior page.
- Comparison cards and formula steps may use filled accent-red rounded rectangles when plain glass cards feel weak. Their radius should match media wells; labels and notes must stay high-contrast.
- Do not default to `margin-top:auto` for middle content groups; it creates an empty middle and a crowded footer. Use continuous reading flow first, and reserve `.base-layer` only for the final content-bearing layer when anchoring the lower third is necessary.
- For high-impact final pages, `swiss-guide` may use a pure accent-red field, but it should stay single-color and undecorated. Continue the route's normal content structure, grid rhythm, and buy/wait/skip/check content; do not add background grid blocks, stray lines, or a centered rounded card.
- No full-page red skin, decorative blobs, nested SaaS cards, or heavy shadows.

### geek-bench

Pass only if:

- Surface is dark and data-bench-like, not plain black.
- Background has the Gemini-like bottom particle field: multi-hue glow from the lower edge, 58% height, 12px dot grid, fading upward.
- One data accent dominates numbers/verdicts; no red.
- Numeric/spec elements use mono/tabular treatment.
- At least one data device exists: bars, chips, score cells, delta row, or benchmark block.
- Glow/glass is restrained and never hurts table legibility.

### warm-review

Pass only if:

- Surface is editorial and warm, with `kelvin-glow` as the default: full orange-red field, warm cream serif typography, local dot fields, and large editorial text. Use paper palettes only when the review needs a quieter magazine page.
- Display titles use serif/Songti-like tone.
- Image wells, editorial captions, marginalia, or ledger rows create magazine-review pace.
- Covers should feel like editorial field notes: mono metadata, large serif title, generous negative space, and either one real scene/sample/use-environment image or a pure text layout. Prefer atmospheric scene evidence over transparent-background product cutouts on `warm-review` covers.
- If no credible scene/sample/use-environment image exists, use a no-image cover with title, subhead, and bottom note/timeline rows. Do not force a transparent product PNG or fake placeholder into the cover.
- Interior pages should keep the same magazine system as the cover: `mag-meta` issue row, large serif title, photo/caption or ledger body, and a bottom `mag-index` / `mag-row` / `mag-timeline` band. Avoid reverting to promo cards, pill stickers, transparent boxes, or repeated boxed panels.
- Rulework in `warm-review` should be dashed by default, including metadata rules, captions, note rows, index dividers, timelines, and footer rules. Do not mix solid and dashed line systems in the same warm-review deck.
- Avoid stacked adjacent rules. When `photo-caption` is followed by `essay-note`, remove the note's top rule or add a clear gap so the two modules do not create twin horizontal lines.
- Use image-led pages for sample feel and A/B evidence: `mag-photo` + `photo-caption` for one image, `sample-compare mag-compare` + real figcaptions for paired images. Use `essay-note` only for a real interpretive limitation, not decoration.
- Use no-image magazine pages for variant, audience, price, and final verdict: `compare-card` for two strong alternatives, `mag-row` for editorial rows, `mag-timeline` for price/spec sequences, `verdict-letter` for the final decision, and `mag-index` for bottom reader/action notes.
- When `mag-index` is the final content layer on variant, audience, or final-verdict pages, pair it with `base-layer` so it behaves like page 03's lower interpretation band: anchored as the last content-bearing block with a stable gap before the footer, not floating as an arbitrary footer decoration.
- Accent is warm and restrained.
- `kelvin-glow` should feel close to the orange 3200 Kelvin visual system without copying site-specific content: full orange-red field, warm cream serif text, local dot fields, bracketed notes, and functional cream-orange panels. Use full-page vertical dashed grids only in rare data/axis pages; by default they interfere with review content. A horizontal axis is optional and should appear only when the review content itself needs a scale, progression, or timeline. Do not include fixed Kelvin values, `3200 K`, site navigation labels, or circular tick/orbit motifs unless they are required by the specific review content.
- No neon/glass, no cheap promo banner, no random stickers.

### bauhaus-bright

Pass only if:

- Surface uses warm paper/near-white, black structure, and semantic Bauhaus red/yellow/blue.
- Geometry has a job: section, number, data, image module, verdict, warning, or comparison. No free-floating decorative shapes.
- Modules align to a strict 12-column or modular grid with strong borders and clear baseline rhythm.
- Images are allowed and encouraged when credible. They sit inside `.image-module`, `.object-frame`, `.evidence-frame`, or `.sample-compare`, not as fake backgrounds.
- No credible image means no-image information cards: `.metric-box`, `.bauhaus-band`, `.bar-row`, `.decision-matrix`, `.minimal-ledger`. Do not default to no-image when product/sample/screenshot assets are available.
- Red, yellow, and blue have semantic roles. Do not randomly rotate colors or make every block loud.
- Keep color rhythm across the deck. Adjacent Bauhaus pages should not reuse the same three-block color sequence for equivalent bottom grids or decision matrices. Preserve meaning first, then vary order or emphasis, for example `red/yellow/blue`, `blue/red/yellow`, `yellow/blue/paper`, rather than repeating `yellow/blue/paper` page after page.
- Text contrast is excellent; long body copy stays on paper/near-white, not on busy color blocks.

### digital-pop

Pass only if:

- Surface uses a high-saturation digital card language: one vivid paired-color system plus black/white, not muted pastel, SMZDM red, or ordinary SaaS blue.
- The poster background fills the full 1080×1440 canvas with one pure color: violet, lime, black, or white. Do not use an outer rounded poster shell, translucent border, shadowed card frame, or gradient wallpaper.
- Rounded geometry appears inside the page: screenshot/media stage, plan cards, benefit rows, pill labels, or button-like verdict blocks. Images should not be the only rounded objects.
- Rounded rectangles should be visibly large-radius filled surfaces, not outlined cards. Avoid stroked/transparent-outline rectangles in Digital Pop unless the source screenshot itself contains them.
- Because Digital Pop uses large rounded rectangles, multi-card rows need generous top and bottom safe space. In 2-up or 3-up cards, leave visibly larger vertical padding than ordinary routes so labels, titles, and body copy do not feel trapped by the corner radius.
- The cover should preferably show all four route colors at once: one pure full-page surface plus black, white, and lime/violet filled modules or CTA blocks. Do not leave the first page as a two-color poster.
- Evidence images and screenshots should fill their rounded container. If UI legibility would be damaged by cover-cropping, change the container ratio or crop the source first instead of leaving padded letterbox space.
- On black-background pages or black filled modules, palette hues may be used as tags, arrows, small emphasis, media-stage color, or action accents; they must not carry body copy, large numbers, large verdict words, or other primary information blocks. Main content on black must be white or near-white.
- Non-black/white pages should still include at least one palette hue if the background is not already a palette hue: label, CTA, formula number, media stage, benefit number, or compact module.
- Display type is oversized, clean sans, and light/regular weight; mono labels are used as product-state tags such as `会员权益`, `一次买断`, `试用门槛`, or `适合谁`.
- At least one digital-commerce device exists: large CTA verdict button, benefit ledger, stacked screenshot stage, membership/plan card, unlock/progress row, avatar/community ring, or app/resource preview.
- The visual mood is young and energetic but still buying-decision oriented. It must answer value, subscription, renewal, trial, feature, or audience-fit questions.
- No random neon gradients, decorative blobs, fake avatars, fake community proof, fake UI screenshots, or generated UI evidence.
- Do not use `digital-pop` for serious medical/health claims, car safety, warranty/legal decisions, traditional camera image-quality proof, or dense hardware benchmark pages.

### blue-stack

Pass only if:

- Surface language comes from blue-stack platform design: stark black/white pages, core blue square modules, oversized sans titles, dotted horizontal rules, and dark technical cards.
- Use `blue-core` as the only palette: black, white/light grey, dark graphite modules, and `#2f8cff` accent. Do not add SMZDM red, warm magazine orange, Bauhaus yellow/red/blue, or Digital Pop neon pairs.
- Titles can be very large and architectural. They should feel like platform positioning, not retail coupons.
- Icon tiles are square blue modules, preferably from `assets/icon/icons.js` via `data-icon`. Do not use decorative random emoji or hand-drawn SVG.
- Use dotted separators for feature lists, ledger rows, and bottom bands. Match the Sui-inspired dot rhythm: 2px dots, 8px horizontal gaps, 10px vertical gaps. Implement with shared CSS gradients; avoid browser-default `border-style:dotted`, which is too dense and soft. Keep all dotted rules on one neutral grey-blue token (`--dot-rule`, about rgba(124,133,147,.56) on dark pages), with only a slightly stronger alpha for page footers. Do not mix white, blue, and graphite dotted lines on the same page.
- Dark pages should use graphite cards with blue action squares, corner-list markers, and dotted internal rules. Light pages should use black typography with blue square highlights.
- Cover pages may use the blue glow platform hero; implement it as `.blue-gradient-field` with three oversized blurred fields (`light`, `core`, `ink`), a bottom `.blue-cutout`, and one `.blue-color-wash`. Prefer pseudo-elements for oversized fields so real DOM elements do not escape the 1080×1440 canvas. Do not fake it with a single visible circular radial-gradient blob. The visible shape should read as black -> blue -> pale blue vertical atmosphere with a softened lower mirror/cutout, not a full circle. Keep the deck validator clean: no inline SVG or `data:image/svg+xml` masks in generated review HTML.
- Interior pages should mostly alternate black, white/light grey, and dark graphite modules rather than repeating the cover gradient.
- At least one route-owned device must appear: `stack-topbar`, `glow-title`, `inline-icon`, `feature-row`, `stack-card`, `step-row`, `wide-cta`, `metric-grid`, or `verdict-panel`.
- Best for Web3/developer/infra/platform reviews. Do not use it for lifestyle, beauty, home, camera sample aesthetics, or price-only shopping guides.

### seasonal-editorial

Pass only if:

- Surface alternates between warm neutral and vivid coral fields across pages; the deck must not stay on one background color.
- Giant condensed sans headlines dominate the page like an editorial homepage, with tight line-height and no negative letter spacing.
- Body copy is secondary and sits in clear modules, rows, or quiet zones.
- Images are real evidence: product photos, swatches, try-on, fabric, texture, styling, shelf/store, or screenshot proof. No generated beauty/product/try-on evidence.
- Photo rhythm uses stacked rectangular image cards, slight rotation, tape-like translucent strips, or hard editorial crops. Do not use soft lifestyle bokeh, gradient blobs, or ornamental florals.
- Utility modules use thin currentColor borders, small radius, translucent fields, mono labels, and simple icon/button-like blocks.
- Good for beauty, fashion, fragrance, accessories, lifestyle retail, editorial commerce, and visual comparison where evidence can be inspected.
- Do not copy Spring/Summer brand marks, logo, exact text, or proprietary imagery. Borrow only the layout language: alternating backgrounds, giant headlines, grid, bordered widgets, and photo collage.

## Palette Notes

Use only named palettes from the selected seed template unless the user provides brand constraints.

### swiss-guide

- `smzdm-red` / default: 白底冷灰 + SMZDM red accent for price/verdict/warning.
- `ikb-blue`: more analytical / spec-led.
- `lemon-yellow`: light retail / lifestyle lists.
- `vivid-green`: efficiency, health, cleaning, future-facing comparisons.
- `safety-orange`: risk, price-warning, avoid/pitfall pages.
- In `lemon-yellow`, the small `.kicker` label uses a black field with yellow text for contrast; do not use yellow text on the default pale chip.
- In `swiss-guide`, three-column `.issue-strip` / `.risk-strip` modules should visually match the rounded black `.solid-band` family rather than the older T-junction glass grid. For audience archetypes or final risk trios, prefer `strong + em` content inside this shared band language.
- On `lemon-yellow` final accent pages, use black text, black rules, and black verdict-pill surfaces on the yellow field. Do not inherit the white-on-accent final-page treatment used by red, blue, green, or orange palettes.

Swiss palette recommendation map:

- Use `vivid-green` for cleaning, pet cleaning, health, efficiency, eco, and future-facing comparison topics.
- Use `ikb-blue` for analytical spec, parameter, technology, and rational variant comparisons.
- Use `safety-orange` for pitfall, risk, price-warning, avoid/skip, or caution-led buying guides.
- Use `lemon-yellow` for lighter retail, lifestyle lists, gifts, and small-object shopping guides.
- Use `smzdm-red` for default SMZDM-style value judgments, price decisions, and general buy/wait/skip decks.

### geek-bench

Geek palettes change the data accent and bottom particle glow only; they do not change layout, typography, or the dark surface.

- `electric-blue` / default: blue -> violet -> pink bottom glow; best for benchmark/performance.
- `aurora-cyan`: cyan/blue/green glow; best for efficiency, power, cooling, clean technical readouts.
- `terminal-green`: green/cyan/blue glow; best for developer, engineering, reliability, tool-like reviews.

The multi-hue particles are atmosphere only. Winner cells, score bars, verdict marks, and hero numbers use the single `--data` accent.

When asking the user to choose a Geek palette, do not mark `electric-blue` as recommended just because it is the default. For server, NAS, reliability, cooling, or efficiency topics, choose exactly one task-specific recommendation (`aurora-cyan` for efficiency / power / cooling, or `terminal-green` for server / operations / developer reliability) and mark only that option.

### warm-review

- `kelvin-glow` / default: orange-red field, warm cream serif typography, field-notes cover rhythm, bracket notes, and functional cream-orange panels. Best for emotional/lifestyle reviews, coffee/home/beauty/outdoor, craft products, and experience-led verdicts.
- `cream-orange`: warm cream field, vivid orange typography, dotted vertical grid, soft dot fields, capsule notes, and generous negative space. Use when the same 3200 Kelvin-inspired system should feel brighter, lighter, and less dramatic than `kelvin-glow`.
- `indigo-paper`: quieter camera/tech editorial route.
- `forest-paper`: outdoor/home/coffee/nature-leaning reviews.

Warm-review layout hints:

- Use `cover-verdict` as a field-notes cover: `cover-meta`, `cover-title`, optional real `cover-scene`, one `cover-copy`, and bottom `cover-note-row`.
- Use `evidence-sample` as `mag-meta` + `mag-title` + `mag-photo` + `photo-caption` + one `essay-note`.
- Use `before-after-effect` as `mag-meta` + `mag-title` + `sample-compare mag-compare` + 1-2 `mag-row` interpretation rows.
- Use `variant-comparison` as two strong `compare-card` alternatives plus `mag-index base-layer` for price/function/conclusion.
- Use `audience-fit` as 4-5 `mag-row` reader rows plus `mag-index base-layer`; avoid large decorative portraits unless they are real evidence.
- Use `spec-price-ledger` as `mag-timeline` or `mag-row` ledgers. Prefer timeline/rule systems over boxed price cards.
- Use `final-verdict` as `mag-meta` + large title + a high-impact `verdict-letter` + `mag-index base-layer`; do not use a top pill label when the title and letter already carry the conclusion.

### bauhaus-bright

- `classic` only: Bauhaus paper + black + yellow/red/steel blue semantic blocks.
- Do not ask for a Bauhaus palette. The route identity depends on the fixed classic color system.
- Red / yellow / blue are semantic roles inside the one palette, not optional skins.

### digital-pop

- `violet-lime` / default: electric violet + neon lime + black/white surfaces. Best for AI tools, memberships, creator-resource bundles, and software subscriptions.
- `lime-blue`: acid lime + bright blue + black/white surfaces, extended from split lime/blue reference. Best for games, courses, performance tools, update announcements, and energetic "learn/use now" offers.
- `violet-pink`: vivid violet + soft candy pink + black/white surfaces, extended from split violet/pink reference. Best for beauty apps, lifestyle subscriptions, creator communities, playful SaaS, and softer digital products.

Ask for a Digital Pop palette unless the user already chose one or asked for speed. Recommend `violet-lime` for AI tools, memberships, creator-resource bundles, and software subscriptions; `lime-blue` for games, courses, performance tools, update announcements, and energetic "learn/use now" offers; `violet-pink` for beauty apps, lifestyle subscriptions, creator communities, playful SaaS, and softer digital products.

### blue-stack

- `blue-core` only: black/white/light grey, graphite modules, core blue square accents, and dotted system rules. Use for Web3, developer platforms, technical ecosystems, and AI/data infrastructure decks.

### seasonal-editorial

- `coral-cream` / default: vivid coral text + warm cream fields, with inverse cream-on-coral pages, currentColor borders, and mono utility labels. Use when the deck should feel bright, direct, and closer to the Spring/Summer home-page screenshot.
- `approach-red`: Approach-page red pushed into a sharper red/black system: red field `#fe3939`, black field `#0a0605`, and warm off-white text `#f8f5e7` on black pages. Use when the same layout should feel more graphic, editorial, and less “beauty pink”; examples should usually open on the red field, then alternate red/black.

Do not ask for a Blue Stack palette. The route identity depends on the fixed core-blue system.

Ask for a Seasonal Editorial palette unless the user already chose one or asked for speed. Recommend `coral-cream` for bright beauty/fashion/lifestyle shopping and `approach-red` for sharper graphic editorial decks that should feel less pink and more red/black.

Digital-pop layout hints:

- Use `cover-verdict` as a full-bleed pure-color page with a mono pill row, oversized title, and a button-like verdict or CTA action.
- Use `evidence-sample` for real app screenshots, feature previews, resource libraries, or membership dashboards. Put screenshots inside `.image-well`, `.evidence-frame`, or `.image-module`; prefer contain-fit if UI text matters.
- Use `variant-comparison` for free vs paid, monthly vs lifetime, standard vs pro, or app A vs app B decisions. The cards can read like membership/plan cards.
- Use `audience-fit` as "适合谁 / 先别买 / 先试用" benefit rows, optionally with an avatar/community ring only when real user/community evidence exists.
- Use `spec-price-ledger` for subscription math, lifetime price, feature unlocks, plan limits, refund/trial rules, or renewal risks. Prefer a large CTA-style `price-formula` over a tiny price row.
- Use `final-verdict` as a large decision button plus three action cards: `建议买断 / 先试用 / 不建议续费`, adapted to the product.
- Keep rounded media stages functional: screenshots, app previews, resource grids, product UI, or verified public images. Do not use big rounded image blocks as empty decoration.
- The two palette hues plus black and white can each become full-page backgrounds or filled modules. Alternate them intentionally by page role: first hue for hero/value, second hue for action/offer, black for app/media proof, white for comparison/ledger readability. Do not randomly invert every page. The cover should usually contain the paired hues plus black/white through background, CTA, and lower modules; later pages that are not black/white should include at least one clear palette accent or module.

Blue Stack layout hints:

- Use `cover-verdict` as a blue glow platform hero: `blue-gradient-field`, `glow-title`, short subhead, and two rectangular actions. The background should be built from layered blurred fields and a masked bottom cutout, not a one-piece gradient wallpaper.
- Use `mechanism-explainer` or `evidence-sample` as a light page with a giant black statement, inline blue icon squares, and dotted feature rows.
- Use `variant-comparison` as dark `stack-card` pairs with card-head icons, dotted inner rules, and corner-list bullets.
- Use `audience-fit` as `step-row` reader/action lanes; use a `wide-cta` only when it carries the main action.
- Use `spec-price-ledger` as `metric-grid` and dotted ledgers. If facts are unstable, avoid hard numbers and describe capability layers instead.
- Use `final-verdict` as a large `verdict-panel` plus bottom `metric-grid`, action band, or compact `step-row` checklist. The blue module should carry enough conclusion text to feel decisive, not one short sentence floating in empty space. Avoid decorative bottom atmosphere if the page can be completed with buying-relevant checks.
- When using icons, copy `assets/icon/icons.js` from the skill into the task `assets/icon/` folder and reference icons with `<i data-icon="..."></i>`. Validate icon names against that file; a missing icon breaks the route because blue icon tiles are primary structure, not decoration.
- Blue Stack pages must not feel sparse. If a page has only a title, one image, and one short caption, add a lower decision layer: metric grid, capability rows, tradeoff cards, audience lanes, or one evidence interpretation row. Do not fill the lower half with decorative blue squares or repeated labels.
- In header rows such as `build-head`, leave at least 32px between the blue icon tile and the title. Put explanatory copy on its own row or column rather than squeezing it into the title line.
- `build-head` should not default to a pale graphite banner. Keep the header background transparent unless a specific content module requires a filled surface; align the blue icon tile with the large title, then place the explanatory copy below the title.
- When a `wide-cta` follows `build-head`, align the CTA with the text column, not the icon column. The icon is a left anchor; title, copy, and CTA should share one vertical grid line.

Bauhaus-bright layout hints:

- Use `cover-verdict` as `.bauhaus-band` + `.metric-box` hooks, optionally with a real product `.image-module`.
- Use `evidence-sample` as one large `.image-module` / `.evidence-frame` plus `.metric-box` interpretation and limitation.
- Use `before-after-effect` as `.sample-compare` plus `.bar-row` or `.metric-pair` changes; only with source-valid paired images.
- Use `variant-comparison` as two `.compare-card` blocks or a `.decision-matrix` with semantic color roles.
- Use `audience-fit` as `.numbered-list`, `.metric-box`, or `.decision-matrix`, not a loose paragraph page.
- Use `spec-price-ledger` as `.minimal-ledger`, `.price-formula`, `.bar-list`, or metric boxes.
- Use `final-verdict` as `.decision-matrix` for `建议买 / 建议等 / 不建议` plus `.risk-strip` / `.minimal-ledger` limitations.
- In `.bauhaus-band`, the number rail, headline, and lead must share a clear top alignment. Do not add ad hoc top margins to `.h-xl`, `.h-md`, or `.lead` inside the band.
- Keep major color blocks at natural content height with generous internal padding; distribute modules with grid gaps and page rhythm, not by stretching a large color block until its contents look empty.
- For no-image Bauhaus pages, use three content layers after the meta row: dominant judgment band, compact cards/matrix, and a bottom ledger/bar/risk layer. Do not stop after a band plus two short cards.
- When the bottom half feels empty, put `.base-layer` on the final content-bearing layer so the lower third is anchored by information, not decoration.
- Use only internal row separators in Bauhaus ledgers/lists; avoid components that create a line at both their top and bottom when adjacent to other ruled modules.
- Numbered rows (`01/02/03/04`) must share one repeated row rhythm and label column. Do not vary row spacing by hand from item to item.
