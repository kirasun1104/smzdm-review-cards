# Page Types And Guizang Layout Primitives

Use semantic page types as the deck contract. Guizang recipe names are internal layout primitives, not user-facing names.

## Default 7-Page Deck

| Page type | Borrowed primitive | Required content | Layout principle |
| --- | --- | --- | --- |
| `cover-verdict` | `M01 Magazine Issue Cover` | product, core question, one-line verdict, 2-3 hooks | Cover has title, product/sample signal, and bottom issue strip. |
| `evidence-sample` | `M10 Evidence Feature` | evidence image/sample/screenshot, effect claim, 2-3 notes | Evidence image occupies 45%-65% of canvas; text interprets the evidence. |
| `before-after-effect` or mechanism page | `M15 Before / After` / mechanism primitive | before/after states or product mechanism/tradeoff | Use `before-after-effect` only for source-valid A/B; otherwise use `mechanism-explainer` or `mechanism-tradeoff`. |
| `variant-comparison` | `S02 Two Signals / Comparison` | variants, tradeoff, who each fits | Two options sit side by side or stacked symmetrically. |
| `audience-fit` | `M08 Tall Ledger` | buy_if, wait_if, skip_if, avoid_if | High-density rows; each audience has a consequence. |
| `spec-price-ledger` | `S11 Stacked Ledger` | price/spec/selling-point rows with source state | One row per anchor: price, spec, feature, risk. |
| `final-verdict` | `M07 Closing Note` or `M04 Pull Quote` | buy/wait/skip final decision and reason | End with action, not summary. Use M04 only for a strong single sentence. |

## Minimum Content Capacity

These floors prevent 3:4 cards from feeling thin. If a page cannot meet the floor, merge it, change the primitive, or mark it explicitly omitted in `deck-data.json`.

| Page type | Minimum capacity |
| --- | --- |
| `cover-verdict` | Title + lead + product/sample signal + 2-3 bottom hooks or judgment points. |
| `evidence-sample` | One evidence image/screenshot occupying 45%-65% canvas height, plus interpretation and limitation/caption. |
| `before-after-effect` / mechanism page | If A/B exists: two source-valid states, one change statement, one limitation row, and 1-2 consequence notes. If not: one mechanism/tradeoff claim plus 3-5 decision-bearing rows. |
| `variant-comparison` | At least 3 comparison dimensions, or 2 dimensions plus a decision strip. |
| `audience-fit` | At least 4 audience rows total; preferred 3 buy/fit rows and 3 skip/misfit rows. If the lower third is empty, add a three-column audience-archetype `.issue-strip` rather than decorative imagery. |
| `spec-price-ledger` | At least 5 ledger rows: price, core spec, feature gain, tradeoff/risk, competitor/context. |
| `final-verdict` | Verdict pill or big action + 3 action recommendations (`建议买/建议等/不建议`) + 3 risk/limitation items. |

Density applies before styling: each page should have a visible upper, middle, and lower content job. If a page looks thin, add a real decision layer from the source material (cost rule, risk, audience split, variant rule, checklist, or evidence interpretation) before adding route decoration.

## Quantified Evidence Retention

When the source includes hard data such as a spec table, measured numbers, benchmark scores, rating counts, competitor distance/weight/noise figures, or price tiers, plan one visible evidence layer around the strongest numbers before writing HTML.

- `mechanism-explainer`: use when numbers explain why the product works or where it fails, e.g. `250m / 200m / 50m`, `72dB / 22dBA`, or `32-bit / 24-bit`. Pair every number with a consequence.
- `spec-price-ledger`: use when numbers anchor the buying decision. It should keep at least 2-4 verified figures from `quantified_evidence` when available, plus price/spec uncertainty as actions rather than disclaimers.
- `variant-comparison`: if the source compares 3 products or variants, do not collapse it into a 2-way contrast unless the third option is irrelevant to the buying decision. Use three compact comparison cells, a decision matrix, or move the third option into a clear boundary row.
- `audience-fit` and `final-verdict`: can reference a number only when it changes the action, such as "250m 标称不等于展会稳连"; do not fill these pages with loose specs.
- If a source table is too dense for one card, retain the top 2-4 decisive values and move the rest to `deck-data.json.quantified_evidence` / `unused_quantified_evidence`.

Do not soften central figures into vague claims such as `更远`, `更稳`, `参数更强`, or `按环境打折` when the source gives concrete comparable numbers and they are verified or clearly source-bounded.

## Page Copy Budgets

These budgets keep content inside the registered templates. They are maximum visible text lengths after whitespace is removed. They are not writing targets; shorter is often better.

| Page type | Hard max visible chars | Per-component guidance |
| --- | ---: | --- |
| `cover-verdict` | 180 | Title 8-18 Chinese chars; lead 22-42 chars; each hook 10-22 chars. |
| `evidence-sample` | 260 | Title 12-24 chars; interpretation notes 18-36 chars each; limitation 18-34 chars. |
| `before-after-effect` | 300 | A/B labels 4-10 chars; change notes 12-24 chars each; limitation 18-34 chars. |
| `variant-comparison` | 360 | Dimension labels 2-6 chars; row body 18-34 chars; decision strip 18-38 chars. |
| `audience-fit` | 380 | Audience label 3-8 chars; each row 18-36 chars; no paragraph rows. |
| `spec-price-ledger` | 420 | Row key 2-8 chars; row value 18-42 chars; only verified mainland China hard prices may appear. |
| `final-verdict` | 360 | Action labels use `建议买 / 建议等 / 不建议`; each action 18-36 chars; each risk 12-28 chars. |

Text-role budgets:

| Class | Max chars | Use |
| --- | ---: | --- |
| `.h-xl` | 30 | cover-scale headline |
| `.h-md` | 36 | page headline |
| `.lead` | 58 | one concise explanatory sentence |
| `.body` | 90 | body paragraph inside roomy modules only |
| `.bento-copy` | 54 | short card explanation |
| `.image-caption` | 42 | image caption or evidence limit |
| `.punch-strip` | 42 | one-line action |
| `.zoom-cell` | 34 | compact observation |

If a page exceeds its budget, choose a fit action before writing HTML:

- Shorten judgment copy to the buying consequence.
- Move proof detail, market basis, source notes, caveats, and exact provenance into `deck-data.json` / `assets/SOURCES.md`.
- Split a crowded page into two existing page types.
- Switch to a higher-capacity existing primitive.
- Omit weak material and record the omission.

Never solve over-budget copy by reducing font size, shrinking line-height, tightening tracking, adding inline layout styles, or inventing a new local component.

## Chinese Line-End Discipline

Avoid visible Chinese widows/orphans. In rendered cards, no text line should end with only one Chinese character, or one Chinese character plus punctuation such as `。`, `，`, `；`, `？`, `！`, `：`.

Also avoid semantically broken title wraps. Do not let product/category compounds, fixed phrases, or action units split across lines, such as `混合 / 砂`, `不粘 / 底`, `等大 / 促`, or `确认后 / 再囤`. When a headline may wrap awkwardly, write it as explicit semantic lines using spans that templates support:

```html
<h2 class="h-md"><span>纯木薯还是混合砂？</span><span>先看痛点。</span></h2>
```

Preferred break points are after strong punctuation or thought boundaries: `？`, `：`, `；`, `，`, or between complete clauses. If there is still enough horizontal room, widen the registered text container or shorten the copy before accepting a mid-phrase wrap.

When a line ends this way, fix it through copy or component choice:

- Rewrite the sentence shorter so the final word group stays together.
- Move the last qualifier into another row/card or into `deck-data.json` / `assets/SOURCES.md`.
- Split a dense sentence into two registered rows/cards.
- Prefer natural two- to four-character closing phrases such as `再下单`, `先试穿`, `不急买`, `等好价`.

Do not fix single-character widows by shrinking font size, tightening letter spacing, adding manual `<br>` for only one viewport, inserting invisible characters, or using one-off inline layout styles.

## Fit Ladder

When content does not fit, use the first action that preserves the buying judgment:

| Failure | First exit | Second exit | Last exit |
| --- | --- | --- | --- |
| Page over budget | Shorten to the buying consequence | Move proof/source detail to data files | Split or omit weak material |
| Component text clips or touches edges | Rewrite shorter | Move to a roomier registered component | Split across two rows/cards |
| Single Chinese character left on last line | Rewrite shorter | Move qualifier to another row/card | Switch to a roomier component |
| Sparse lower half | Add a real ledger/risk/decision layer | Use `.base-layer` on the final content block | Merge the page into a stronger page |
| Footer position drifts | Shorten or remove the last support layer | Split crowded content into another page type | Reduce image-led pages or merge weak material |
| Too many comparison dimensions | Convert to ledger/matrix | Split into two existing page types | Omit minor dimensions |
| Price/spec uncertainty | Remove hard price from HTML | Turn into a buying action | Record unresolved fields in `unverified` |
| No source-valid image | Switch to a no-image ledger/mechanism/verdict page | Record `no_image_reason` | Omit image-only page type |

Do not get trapped between deleting useful content and violating the template. If a page repeatedly needs local CSS, the correct exit is `switch`, `split`, or a seed-template improvement used by future decks.

## Template Fit Contract

The page type and selected route template are the layout contract. Content must adapt to the contract; do not create a new layout rule because a sentence, table, or note does not fit.

Before writing HTML, make an internal page plan:

```text
PAGE PLAN
01 / page-type / purpose / content shape / chosen skeleton / image slot / density / fit action
02 / ...
```

Write or update `deck-data.json` before HTML, not after. At minimum include `style_route`, `palette`, fact/verdict fields, `sources`, `unverified`, `asset_usage` for every main visual, and `omitted_page_types` for any required page type you intentionally skip. Default review decks have at most 7 posters; set `allow_extra_posters:true` only when the user explicitly asks for a longer carousel. This prevents late validation churn around repeated images, missing evidence relationships, and price discipline.

Fit actions:

- `keep`: content fits the registered skeleton as-is.
- `shorten`: shorten copy to fit the component budget.
- `move-out`: move provenance, production notes, or long caveats to `deck-data.json`, `SOURCES.md`, or final response.
- `switch`: use another existing page type or primitive from this file.
- `split`: split overloaded content into two existing page types.
- `merge`: merge a thin page into another page.
- `omit`: omit a page and record it in `deck-data.json.omitted_page_types`.

Forbidden:

- Adding task-specific layout classes to make overlong content fit.
- Adding one-off inline `margin`, `padding`, `border`, `position`, `height`, or `font-size` patches.
- Creating a new row/list/card/component family when `.split-row`, `.minimal-row`, `.numbered-item`, `.metric-box`, `.compare-card`, `.risk-strip`, `.decision-cell`, `.verdict-pill`, or another registered component already covers the meaning.
- Shrinking text below route standards to keep extra copy.
- Turning source notes, disclaimers, or production notes into visible graphic content to fill space.

## Copyable HTML Skeletons

Use these skeletons inside the selected route template. Keep the class names; replace only content, image paths, and page numbers. A deck must still use one route and one palette.

### `cover-verdict`

```html
<section class="poster" data-page-type="cover-verdict">
  <div class="content">
    <div class="kicker">购买判断</div>
    <h1 class="h-xl">万元值不值？</h1>
    <p class="lead">一句话判断：适合买谁，不适合买谁。</p>
    <div class="image-well"><img src="assets/product.jpg" alt="产品主图" style="object-position:50% 50%;"></div>
    <div class="issue-strip">
      <span>买点：填写 1 条真实收益</span>
      <span>代价：填写 1 条关键取舍</span>
      <span>动作：建议买 / 建议等 / 不建议，给出明确倾向</span>
    </div>
    <div class="foot"><span>SMZDM REVIEW</span><span>01</span></div>
  </div>
</section>
```

### `evidence-sample`

```html
<section class="poster" data-page-type="evidence-sample">
  <div class="content">
    <div class="kicker">样张证据</div>
    <h2 class="h-md">样张证据：它到底改变了什么</h2>
    <div class="image-well"><img src="assets/sample.jpg" alt="证据样张" style="object-position:50% 48%;"></div>
    <p class="image-caption">把图片里的可见证据翻译成购买判断，不写来源说明。</p>
    <div class="grid-2">
      <div class="panel"><p class="body">观察：来自证据的可见变化。</p></div>
      <div class="panel"><p class="body">购买意义：它会改变哪类使用场景。</p></div>
    </div>
    <!-- In swiss-guide, these evidence interpretation panels stay square; rounded media/action surfaces keep the large radius. -->
    <div class="issue-strip"><span>边界：不把单张样张扩展成所有场景结论。</span></div>
    <div class="foot"><span>SMZDM REVIEW</span><span>02</span></div>
  </div>
</section>
```

### `before-after-effect`

```html
<section class="poster" data-page-type="before-after-effect">
  <div class="content">
    <div class="kicker">同场对比</div>
    <h2 class="h-md">普通直出 vs HDF 氛围</h2>
    <div class="sample-compare">
      <figure class="sample-pair"><img src="assets/before.jpg" alt="同场景 A" style="object-position:50% 50%;"><figcaption>A：标准状态</figcaption></figure>
      <figure class="sample-pair"><img src="assets/after.jpg" alt="同场景 B" style="object-position:50% 50%;"><figcaption>B：HDF 状态</figcaption></figure>
    </div>
    <div class="zoom-strip">
      <div class="zoom-cell">高光：填写可见变化</div>
      <div class="zoom-cell">反差：填写可见变化</div>
      <div class="zoom-cell">细节：填写可见变化</div>
    </div>
    <div class="split-row"><div class="label">变化</div><p class="body">只写证据能支持的画面变化。</p></div>
    <div class="risk-strip"><div class="risk">边界：不把局部画面变化写成基础画质提升。</div></div>
    <div class="foot"><span>SMZDM REVIEW</span><span>03</span></div>
  </div>
</section>
```

### `variant-comparison`

```html
<section class="poster" data-page-type="variant-comparison">
  <div class="content">
    <div class="kicker">版本选择</div>
    <h2 class="h-md">标准版 vs HDF 版</h2>
    <div class="compare-grid">
      <article class="compare-card"><div class="label">标准版</div><div class="value">更稳妥</div><p class="note">填写适合人群和取舍。</p></article>
      <article class="compare-card"><div class="label">HDF 版</div><div class="value">更有氛围</div><p class="note">填写适合人群和取舍。</p></article>
    </div>
    <div class="split-row"><div class="label">成本</div><p class="body">填写已经核实的价差或价格动作。</p></div>
    <div class="split-row"><div class="label">功能</div><p class="body">填写真实差异。</p></div>
    <div class="split-row"><div class="label">场景</div><p class="body">填写哪类场景更受益。</p></div>
    <div class="split-row"><div class="label">结论</div><p class="body">哪类用户选哪一版。</p></div>
    <div class="foot"><span>SMZDM REVIEW</span><span>04</span></div>
  </div>
</section>
```

### `audience-fit`

```html
<section class="poster" data-page-type="audience-fit">
  <div class="content">
    <div class="kicker">人群匹配</div>
    <h2 class="h-md">谁适合买 / 谁别买</h2>
    <div class="ledger">
      <div class="split-row"><div class="label">适合买</div><p class="body">人群 + 原因 + 代价。</p></div>
      <div class="split-row"><div class="label">适合买</div><p class="body">人群 + 原因 + 代价。</p></div>
      <div class="split-row"><div class="label">可以等</div><p class="body">人群 + 等待触发条件。</p></div>
      <div class="split-row"><div class="label">先别买</div><p class="body">人群 + 原因 + 替代动作。</p></div>
      <div class="split-row"><div class="label">先别买</div><p class="body">人群 + 原因 + 替代动作。</p></div>
    </div>
    <div class="issue-strip">
      <span><strong>人群一</strong><em>填写读者类型 + 适配理由。</em></span>
      <span><strong>人群二</strong><em>填写读者类型 + 等待条件。</em></span>
      <span><strong>人群三</strong><em>填写读者类型 + 避免原因。</em></span>
    </div>
    <div class="foot"><span>SMZDM REVIEW</span><span>05</span></div>
  </div>
</section>
```

For sparse `audience-fit` pages, the bottom `.issue-strip` should be an audience-classification layer, not a second final verdict. Good labels are reader archetypes such as `氛围党 / 价格党 / 清晰党`, `轻量党 / 性能党 / 等等党`, or `通勤党 / 家用党 / 专业党`. Avoid repeating `建议买 / 建议等 / 不建议`; reserve those final actions for `final-verdict`.

### `spec-price-ledger` / `Z01 Price Formula`

```html
<section class="poster" data-page-type="spec-price-ledger">
  <div class="content">
    <div class="kicker">价格规格</div>
    <h2 class="h-md">价格、参数、卖点 ledger</h2>
    <div class="price-formula">
      <div class="formula-step"><div class="label">标价</div><div class="num">¥--</div></div>
      <div class="formula-arrow">→</div>
      <div class="formula-step"><div class="label">优惠</div><div class="num">-¥--</div></div>
      <div class="formula-arrow">→</div>
      <div class="formula-step"><div class="label">到手</div><div class="num">¥--</div></div>
    </div>
    <div class="ledger">
      <div class="ledger-row"><strong>价格动作</strong><span>填写买/等/跳的触发条件。</span></div>
      <div class="ledger-row"><strong>核心参数</strong><span>填写真实参数。</span></div>
      <div class="ledger-row"><strong>卖点</strong><span>填写与购买相关的收益。</span></div>
      <div class="ledger-row"><strong>风险</strong><span>填写会改变购买动作的限制。</span></div>
      <div class="ledger-row"><strong>替代</strong><span>填写同价位参照。</span></div>
    </div>
    <div class="foot"><span>SMZDM REVIEW</span><span>06</span></div>
  </div>
</section>
```

### `final-verdict` / `Z02 Buy Wait Skip`

```html
<section class="poster" data-page-type="final-verdict">
  <div class="content">
    <div class="kicker">最终动作</div>
    <div class="verdict-pill">建议买 / 建议等 / 不建议</div>
    <h2 class="h-md">最终结论：给出一个行动</h2>
    <div class="bws-grid">
      <article class="bws-card"><div class="tag">建议买</div><p class="body">满足什么条件就买。</p></article>
      <article class="bws-card"><div class="tag">建议等</div><p class="body">什么价格/信息出现再买。</p></article>
      <article class="bws-card"><div class="tag">不建议</div><p class="body">什么用户不建议。</p></article>
    </div>
    <div class="risk-strip">
      <div class="risk">风险 1：填写购买限制。</div>
      <div class="risk">风险 2：填写供应或版本限制。</div>
      <div class="risk">风险 3：填写证据边界。</div>
    </div>
    <div class="foot"><span>SMZDM REVIEW</span><span>07</span></div>
  </div>
</section>
```

### `Z03 Sample Zoom Compare`

Use inside `evidence-sample` or source-valid `before-after-effect`:

```html
<div class="sample-compare">
  <figure class="sample-pair"><img src="assets/a.jpg" alt="样张 A" style="object-position:50% 50%;"><figcaption>A：填写画面状态</figcaption></figure>
  <figure class="sample-pair"><img src="assets/b.jpg" alt="样张 B" style="object-position:50% 50%;"><figcaption>B：填写画面状态</figcaption></figure>
</div>
<div class="zoom-strip">
  <div class="zoom-cell">高光：填写观察</div>
  <div class="zoom-cell">肤色/色彩：填写观察</div>
  <div class="zoom-cell">细节：填写观察</div>
</div>
```

## Fallbacks

- `cover-verdict`: use image-led cover only when the product/sample photo has a clean quiet zone.
- `evidence-sample`: must contain real image/screenshot evidence. If no credible image exists, do not use this page type; use a ledger, mechanism explainer, or audience/verdict page and record `no_image_reason`.
- `before-after-effect`: if no explicit same-scene/same-subject A/B evidence, do not use visual before/after. Downgrade to `evidence-sample`, `mechanism-explainer`, or a text-only workflow tradeoff and label the limitation.
- `variant-comparison`: for 3+ alternatives, create a matrix or split into two pages.
- `spec-price-ledger`: if price is missing or unstable, keep that state in `deck-data.json` / sources and write a buying action on the card, not an unresolved price label.
- `final-verdict`: for nuanced reviews, use three actions: `建议买 / 建议等 / 不建议`.

## Style Mapping Rule

The primitive controls structure only. The selected style route controls all visual treatment:

- `M01` in `geek-bench` is still dark bench, not warm magazine.
- `S02` in `warm-review` is still warm paper, not Swiss white.
- `S11` in `bauhaus-bright` is still Bauhaus geometry, not a Swiss ledger.
- `S11` in `digital-pop` is still a high-saturation digital card, not a Swiss SaaS table.
- `S11` in `blue-stack` is still a blue-black technical platform system, not a Swiss SaaS table.
- `S11` in `seasonal-editorial` is still a high-contrast fashion/editorial surface, not a Swiss table.

If the page looks like a different route than the selected route, it fails.

## Blue Stack Override

When the selected route is `blue-stack`, keep the same review semantics but express them as a blue-stack technical platform interface:

- Use `blue-stack` for Web3 infrastructure, developer platforms, AI/data infrastructure, chain ecosystems, SDK/tooling, technical product strategy, and platform capability reviews. Do not use it for lifestyle, camera sample feel, beauty, pet, fashion, food, or warm consumer stories.
- The fixed palette is black, white, pale system grey, graphite, and core blue `#2f8cff`. Do not ask for another palette, and do not introduce SMZDM red, warm orange, Bauhaus primaries, or Digital Pop neon pairs.
- Use `.stack-topbar` for platform context, `.brand`, `.drop`, `.nav`, `.plus`, and `.cta` for the nav rhythm. It can appear on light or white statement pages; it is not required on every card.
- Use `.hero-blue` + `.blue-gradient-field` + `.glow-title` for the cover or section opener. The cover background must be a layered blue platform field: oversized blurred light/core/ink balls, bottom cutout, and blue color wash. Avoid a visible full radial circle, and do not use inline SVG/data-URI masks in review HTML. Interior pages should alternate black, white/light grey, and graphite modules.
- Use `.giant-statement` for one dominant architecture-level claim. It should read like platform positioning or product logic, not a coupon headline.
- Use `.inline-icon`, `.tile-icon`, `.blue-square`, and `.card-icon` for core-blue square icon tiles. Icons must come from the shared `assets/icon/icons.js` library via `data-icon`, not emoji, inline SVG, or hand-drawn one-off symbols.
- Use `.dot-rule`, `.feature-row`, `.step-row`, and `.stack-card` separators for dotted system lines. Match the reference rhythm with 2px dots, 8px horizontal gaps, and 10px vertical gaps. All dotted rules on a page should share the same neutral grey-blue color token, with only a small alpha increase allowed for footers. Avoid CSS default dotted borders and dense vertical guide lines; they interfere with reading in 3:4 review cards.
- On black pages, place the main body in white or near-white. Core blue is an action, icon, marker, or connector color, not the main paragraph color.
- On light pages, use black type, core-blue square highlights, and dotted horizontal row separators. Avoid rounded SaaS cards, glass effects, bokeh, soft shadows, and marketing-gradient shells.
- For `cover-verdict`, use one of two cover directions: a no-image blue glow title card, or a platform cover with one real scene/screenshot image inside a dark module. If images are used, prefer contextual product scenes, dashboards, developer consoles, or event/site screenshots over transparent product cutouts.
- For `mechanism-explainer` and `mechanism-tradeoff`, use giant statement blocks, feature rows, or dark two-card grids. Put each claim in a row/module with a blue icon tile or corner marker.
- For `variant-comparison`, use `.compare-grid` or `.dark-grid` with `.stack-card` pairs. The comparison should feel like capability A vs capability B, old stack vs new stack, or user group vs user group. When there is a bottom metric grid, add 3-4 dotted `feature-row` judgement rows between the cards and metrics; if only 2-3 rows are available, add a real upgrade-order or decision-rule row instead of leaving a tall empty middle band.
- For `audience-fit`, use `.steps` and `.step-row` lanes. Put the role/scenario on the left and the decision implication on the right; dotted separators create the rhythm.
- For `spec-price-ledger`, use `.metric-grid`, `.feature-list`, or dotted ledger rows. If hard prices are missing or unstable, keep the card as a decision framework rather than inventing exact numbers.
- For `final-verdict`, use `.verdict-panel` and a bottom `.metric-grid`, action band, or compact `.step-row` checklist. The final conclusion can be very large; it should look like a platform decision, not a small label repeated from the body. Fill the lower third with 3-4 buying-relevant confirmation checks instead of decorative atmosphere.
- If a Blue Stack page has too little content, add real decision-bearing material before adding visual atmosphere: capability rows, tradeoff cards, metric grid, evidence interpretation, or audience lanes. Do not use loose icon tiles, repeated labels, or empty graphite boxes as filler.
- When generating a task folder from this route, copy `assets/icon/icons.js` into `assets/icon/icons.js` and keep the script link in the HTML.

## Digital Pop Override

When the selected route is `digital-pop`, use the same semantic page types but express them as high-saturation full-canvas digital product cards:

- Each page background should be one pure surface: violet, lime, black, or white. Use `.tone-violet`, `.tone-lime`, `.tone-black`, or `.tone-white` on the `.poster` to alternate page roles. Do not add an outer rounded card, transparent page border, page shadow, or gradient wallpaper.
- Use `.mono-pill-row` / `.mono-pill` for plan state, product category, trial status, membership terms, app platform, or creator-resource tags.
- Use `.decision-button` for the strongest action: `建议买断`, `先试用`, `不建议续费`, `等活动价`, or `适合轻量用户`. It should read like a CTA but still be a buying verdict.
- Use `.image-well` for large rounded media stages. Screenshots, app previews, dashboards, game-service pages, and resource libraries belong here; prefer `object-fit: contain` in local CSS only if UI text would be cropped by the route's rounded stage.
- Use `.media-stack` when one real screenshot or product preview needs a stacked-page / course / resource-library feel. Do not invent fake UI screens.
- Use `.benefit-row` + `.benefit-number` for benefits, feature counts, vault/resource size, included updates, plan limits, or renewal risks.
- Use `.compare-card` as membership/plan cards for free vs paid, monthly vs lifetime, app A vs app B, or old workflow vs new workflow.
- Use `.price-formula` as a subscription or lifetime-value chain: `月付 -> 年付 -> 买断`, `原价 -> 优惠 -> 到手`, `免费 -> 试用 -> 付费`.
- Use `.avatar-ring` only with real user/community imagery supplied or sourced for the task. Do not generate fake users, fake testimonials, or fake community proof.
- Keep the page composition simple: top mono tags, oversized title, one media/decision focal object, and one lower benefit/CTA layer. Rounded corners should appear across cards, buttons, media wells, formula blocks, and benefit rows, not only on images. Rounded rectangles should use generous large radii and filled surfaces without decorative outlines.
- For 2-up and 3-up rows, protect the large radius with extra vertical padding. Labels, titles, numbers, and short body copy should sit inside a comfortable inner field, not close to the top or bottom arc of the rounded rectangle.
- On `cover-verdict`, try to include all four Digital Pop roles in one glance: the full-page background plus black, white, and the two active palette hues through filled modules, CTA blocks, or lower cards. This is the route's visual signature.
- On black-background pages and black filled modules, keep main body copy, large numbers, and verdict words white or near-white. Use the active palette hues only for small tags, labels, arrows, action accents, or media staging; do not make them the main content color.
- On pages whose background is not black or white, include at least one active palette hue unless that page background already supplies the hue. Good places: mono pill, formula number, benefit number, CTA, media stage, or one compact filled module.
- Images should fill rounded containers. If important UI text would be cropped, prepare a better source crop or use a roomier media stage rather than padding the image inside the container.

## Seasonal Editorial Page Guidance

When the selected route is `seasonal-editorial`, keep the same review semantics but express them as a beauty/fashion editorial commerce system:

- Use `seasonal-editorial` for beauty, fashion, fragrance, accessories, outfit, and lifestyle retail decks where real evidence images can carry texture, swatch, try-on, fit, finish, or styling.
- Alternate `.tone-cream` and `.tone-coral` across pages. The surface switch is part of the rhythm; do not keep every page on the same background.
- Use `.h-xl` and `.h-md` as giant condensed Chinese statements. Small English labels belong in topbars or metadata, not above the main title.
- Use `.photo-stack`, `.photo-card`, `.image-well`, `.evidence-frame`, and `.sample-compare` for real photos. Slight rotation is allowed only for photo cards, not for text blocks.
- Use `.seasonal-frame`, `.glass-panel`, `.topbar`, `.issue-strip`, `.risk-strip`, `.minimal-ledger`, and `.price-formula` for buying logic.
- For `cover-verdict`, tune the vertical rhythm between giant title, real photo stack, lead, and footer. The lead should read as a bottom judgment layer above the footer, not sit on top of the photo evidence. If the lead touches imagery, enlarge/reposition the photo stack and move the lead lower rather than shrinking type.
- For `evidence-sample`, the image must be inspectable: swatch, texture, fit, finish, screenshot, or product detail gets enough vertical area.
- For `variant-comparison`, compare shade, cut, fabric, finish, sizing, wear occasion, or user fit as decision rows, not vague style adjectives.
- For `audience-fit`, classify readers by use case such as `通勤淡妆 / 派对亮面 / 敏感肌`, each with a buying consequence.
- For `spec-price-ledger`, avoid hard price chips unless verified; use action rows such as `等套装价`, `先试小样`, or `确认尺码`.
- Do not use generated models, fake try-ons, fake swatches, fake before/after, or AI-created product evidence.

Seasonal Editorial is inspired by Spring/Summer-style web composition: alternating page fields, huge type, thin bordered widgets, and photo collage. It must not copy Spring/Summer brand marks, exact text, or proprietary imagery.
- The lower third still needs real content. Use `.base-layer` on a benefit ledger, issue strip, decision grid, or final CTA rather than leaving a large neon field empty.

## Bauhaus Bright Override

When the selected route is `bauhaus-bright`, use the same semantic page types but prefer Bauhaus information-poster primitives over normal ledgers:

- Use `.layout-grid` as the structural frame.
- Use `.meta-row` for sparse mono metadata.
- Use `.statement` for the dominant message.
- Use `.bauhaus-band` for title, section, or core judgment bands.
- Use `.metric-box` for short buying reasons, indicators, scene scores, and constraints.
- Use `.decision-matrix` + `.decision-cell` for clear actions such as `建议买` / `建议等` / `不建议`, and for variant decisions.
- Use `.bar-list` + `.bar-row` for simple visible comparisons where real numeric data is not required.
- Use `.object-frame`, `.evidence-frame`, `.image-module`, or `.sample-compare` for real product/sample/screenshot evidence. Every image must carry inline `object-position`.
- Use `.metric-pair` for compact reason -> consequence rows inside a bento cell.
- Use `.numbered-list` + `.numbered-item` for buy/avoid lists.
- Use `.punch-strip` for the one-line action or "why it matters".
- Use `.minimal-ledger` for price/spec logic when a ledger is unavoidable.
- Use `.poster-mark` and `.final-stack` / `.decision-row` for the final verdict.
- Use `.verdict-pill` for short final verdict phrases such as `氛围党可买`; the visual shape is route-specific and must come from the seed template. Do not add a one-off circle, capsule, square, or inline style on an individual final page.
- Use `.tone-red`, `.tone-yellow`, `.tone-blue`, `.tone-black`, and `.tone-paper` only for semantic roles: risk/verdict, opportunity/benefit, comparison/spec, final action, neutral reading.
- For repeated three-cell modules such as `.decision-matrix`, vary the color sequence between neighboring pages while preserving semantic meaning. Do not let two adjacent pages use the same `tone-yellow / tone-blue / tone-paper` pattern unless the repetition is intentionally part of a series and documented in `deck-data.json`.
- Avoid decorative geometry, corner marks, shadows, and background graphics. Geometry must carry content.
- Pages should feel finished through grid, scale, spacing, content-bearing modules, thick borders, and semantic color blocks.
- No-image Bauhaus pages need at least three content layers after the meta row: dominant judgment band, compact cards or matrix, and a bottom ledger / bar-list / risk strip. A page with only one band and two short cards will look unfinished.
- Add `.base-layer` to the final ledger / bar-list / risk strip when the page would otherwise leave an empty lower half. The base layer anchors the lower third as content, while the footer remains fixed below it.
- Use real images when credible product/sample/screenshot assets exist. `bauhaus-bright` supports images; do not default to no-image just because the style is geometric.
- Line discipline is strict: `.minimal-ledger`, `.numbered-list`, `.final-stack`, and `.risk-strip` should draw a single coherent rule system. Do not mix thin internal rules with thick outer rules inside the same visible module, and do not create double rules by placing a top/bottom ruled component immediately next to another ruled component. When a list component becomes a grid, clear the list separators for that grid state; do not let adjacent-sibling rules such as `.risk + .risk` leak into horizontal cells. Head and tail edges belong to the outer module border or footer, not to every row group.
- Colored callout blocks must use complete four-side borders and internal padding. Do not create a color block with only left/right borders, and do not put text flush against the colored edge.
- Numbered rows must use one repeated row rhythm across the page: same label column width, same vertical padding, same separator logic. Do not hand-tune `01/02/03/04` gaps per row.

Minimal Bauhaus judgment card with optional real image slot:

```html
<section class="poster" data-page-type="cover-verdict">
  <div class="content">
    <div class="layout-grid">
      <div class="meta-row"><span>购买判断</span><span>01</span></div>
      <div class="bauhaus-band tone-yellow">
        <div class="rail">01</div>
        <div class="copy">
          <h1 class="h-xl">先看使用场景，再决定值不值。</h1>
          <p class="lead">一句话说清核心判断，不把未核实数字印到图面。</p>
        </div>
      </div>
      <div class="bento-grid">
        <div class="bento-cell bento-object tone-paper">
          <div class="bento-label">IMAGE</div>
          <div class="object-frame"><img src="assets/product.png" alt="产品图" style="object-position:50% 50%;"></div>
          <div class="image-caption">只放真实来源图片；没有可信图就改成 metric-box。</div>
        </div>
        <div class="bento-cell bento-main tone-paper">
          <div class="bento-label">WHY IT MATTERS</div>
          <div class="metric-pair"><span class="key">收益</span><span class="val">填写真实、可解释的体验收益。</span></div>
          <div class="metric-pair"><span class="key">代价</span><span class="val">填写会影响购买判断的取舍。</span></div>
          <div class="metric-pair"><span class="key">动作</span><span class="val">建议买 / 建议等 / 不建议，给出明确下一步。</span></div>
        </div>
      </div>
      <div class="minimal-ledger base-layer">
        <div class="minimal-row"><span class="k">SCENE</span><span>填写最适合的真实使用场景。</span></div>
        <div class="minimal-row"><span class="k">TRADE</span><span>填写用户需要接受的关键取舍。</span></div>
        <div class="minimal-row"><span class="k">MOVE</span><span>填写建议买 / 建议等 / 不建议的下一步条件。</span></div>
      </div>
      <div class="foot"><span>SMZDM BAUHAUS</span><span>01</span></div>
    </div>
  </div>
</section>
```

## Missing Worth-Buying-Specific Primitives

If a task clearly needs one of these, create a task-scoped block while preserving the selected style:

- `Z01 Price Formula`: original price -> coupon/subsidy -> payment discount -> final price.
- `Z02 Buy Wait Skip`: three-action verdict page.
- `Z03 Sample Zoom Compare`: A/B sample plus crop zoom plus conclusion strip.

Use these as semantic additions, not random visual inventions.

## Evidence Pair Rule For M15

`M15 Before / After` is fragile in product reviews. Use it only when the source relationship is real:

- PASS: official or user-supplied paired images labeled HDF OFF / HDF ON from the same scene.
- PASS: user-supplied screenshots of the same UI before and after a setting.
- FAIL: two different official samples that merely show the same feature category.
- FAIL: one photo edited by the agent to imitate a mode/effect.
- FAIL: product render on one side and sample photo on the other.

When the evidence fails, use a safer page:

- `evidence-sample`: "HDF 官方样张观察".
- `mechanism-explainer`: "HDF 如何改变高光".
- `variant-comparison`: "标准版 vs HDF 版的功能取舍".

If a comparison is illustrative rather than evidentiary, the image must say so plainly: `效果机制说明，非实拍 A/B`. Prefer avoiding illustrative pseudo-comparisons in buying guides.

## Asset Reuse Rule

Track `asset_usage` in `deck-data.json` when building image-heavy decks. Each major page should use a distinct main visual where possible.

Suggested maximums:

- Main product hero: once as cover hero; later only as small supporting image or crop.
- Sample photo: once as main evidence; later only as annotated crop/detail if needed.
- Same-scene A/B pair: once as the before/after page.

If a deck would reuse the same image as main visual more than once, shorten the deck or convert a page to ledger/decision format.
