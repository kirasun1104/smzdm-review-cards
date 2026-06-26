# Layout Discipline

This file converts mature layout and data-annotation principles into hard rules for 1080×1440 SMZDM review verdict cards. It is adapted from proven ideas in IBM/Carbon grid and spacing systems, Material spacing hierarchy, Apple alignment/readability guidance, Datawrapper annotation/source separation, and FT's intent-first visual vocabulary.

Use this file whenever a page has notes, sources, limitations, annotations, footers, evidence captions, or any element that feels like it is "floating".

## 1. Grid First

Every poster has one inner content box. All visible elements must align to it or to a declared column inside it.

Default 1080×1440 card geometry:

```text
canvas:       1080 × 1440
outer margin: 78-96 px
inner width:  888-924 px
columns:      1 / 2 / 3 depending on page type
column gap:   24 / 32 / 40 px
section gap:  48 / 64 px
footer row:   fixed bottom band inside content box
```

Rules:

- Align left edges of title, image well, ledger rows, verdict cards, notes, and footer to the same grid unless the recipe explicitly defines a second column.
- Do not place support text in arbitrary whitespace.
- Do not use one-off `position:absolute` for notes, sources, or limitations. Use a component row inside the content flow.
- If absolute positioning is necessary for a fixed footer or overlay, reserve the space in the layout and document it in the template; do not improvise per page.

## 1.5. Template Before Content

The selected route template and registered page skeletons are the source of truth. When content does not fit the style, change the content plan, not the template rules.

Rules:

- Pick from existing page types and components before writing HTML.
- If a sentence is too long, shorten it or move detail out of the image.
- If a component is too crowded, switch to a wider existing component or split the page.
- If a page is too thin, merge it, add a decision-relevant registered component, or use an existing fallback page type.
- Page copy budgets in `page-types.md` are hard maximums. When a page exceeds the budget, edit the content before touching layout.
- Do not add new component classes, arbitrary wrappers, custom grid systems, or inline spacing/border patches just to make one page work.
- Do not change route typography, line system, card padding, or footer behavior per page.
- If the existing template cannot support a recurring content shape, update the seed template and references first; do not solve it inside one generated deck.
- `swiss-guide`, `geek-bench`, `warm-review`, `digital-pop`, and `blue-stack` support the same structural `.base-layer` bottom anchor as `bauhaus-bright`. Use it on the last content-bearing block to avoid an empty lower third while preserving each route's own line weight, texture, and typography.
- In `warm-review`, prefer magazine flow over card stacking: issue/meta row, large serif title, one image or one decision body, then a bottom editorial index. If a page starts to look like a dashboard or promo grid, convert boxed modules into `mag-row`, `mag-index`, `mag-timeline`, or `photo-caption` before adding decoration.

## 2. Spacing Hierarchy

Spacing must show relationships:

```text
inside one component:       8 / 12 / 16 px
between related elements:   18 / 24 / 32 px
between page sections:      48 / 64 px
before footer/support band: 32 / 48 px
```

Rules:

- Put explanations close to what they explain.
- A note about an image belongs near the image/caption, not near the footer.
- A note about the final verdict belongs below the verdict block and above the footer.
- A source/provenance note usually belongs outside the image, in `SOURCES.md` and final response.
- If the distance between a note and its target is larger than the distance to unrelated content, the note is misplaced.

## 2.1. Rule And Row Discipline

Repeated rows must be built from one component, not hand-tuned per line.

Rules:

- A row group should use internal separators only: line between row 1/2, row 2/3, and so on. Do not add both a group top rule and a first-row top rule, or both a group bottom rule and a last-row bottom rule.
- Do not stack two horizontal rules from adjacent components. If a colored block, ledger, punch strip, and footer sit near each other, only one of the touching edges may draw a line.
- In `warm-review`, the line system is dashed by default. Keep `mag-meta`, `photo-caption`, `essay-note`, `mag-row`, `mag-index`, `mag-timeline`, and footer rules dashed unless a route update explicitly changes the whole system. If `photo-caption + essay-note` creates two adjacent horizontal rules, clear the note's top rule and use spacing instead.
- When a component changes direction from vertical list to horizontal grid, clear the old direction's separators inside that state. For example, a `.risk-strip` that becomes a three-column grid must neutralize `.risk + .risk` top borders, otherwise columns 2/3 inherit extra top rules and look heavier than column 1.
- Numbered lists must keep one rhythm: same number column, same text column, same vertical padding, same separator style for every `01/02/03/04` row.
- Label/value rows must align on the same baseline or centerline. Short labels such as `变焦`, `收音`, `画质` should not float above or below their value text.
- Colored callout blocks must have four-side borders and internal padding. A colored block with missing side borders or flush-left text fails visual QA.
- `risk`, `minimal-row`, `numbered-item`, `decision-row`, and `bar-row` should not receive one-off inline margins or borders unless the page documents a deliberate exception.

## 2.5. Portrait Density Discipline

3:4 buying-decision cards have more vertical space than a horizontal slide. A page can be neat and still feel thin. Use density rules before styling.

This rule follows the same low-information discipline used in `guizang-social-card-skill`: the goal is not to fill the page with decoration, but to make sparse content become a stronger visual argument. A 3:4 review card must normally carry enough real decision material to survive a fast swipe.

Think of a 1080×1440 card as five vertical zones:

| Zone | Typical height | Role |
| --- | --- | --- |
| Header/meta | 56-90px | route label, page type, issue marker |
| Title/lead | 240-420px | buying question and claim |
| Evidence/body | 520-760px | image, A/B, ledger, matrix, decision grid |
| Bottom strip | 90-180px | limitation, risk strip, source qualifier, summary |
| Footer | 52-86px | page metadata only |

Hard rules:

- Active composition should occupy at least 78% of the canvas height.
- Active composition should usually stay below 90%-92% of the canvas height unless the page is an intentional full-bleed evidence/photo page.
- A table, ledger, or comparison block should occupy at least 45% of the canvas height unless it is paired with a large image or verdict stamp.
- Evidence/sample imagery should occupy 45%-65% of the canvas height when image inspection matters.
- The lower 25% of a page must not be empty unless the recipe is intentionally atmospheric and the title/statement is the focal object.
- If the lower third is empty, anchor the final real content block with `.base-layer` before adding more decoration or text.
- If the page is still thin after anchoring, add real decision content: 2-4 ledger rows, risk/limitation rows, a decision matrix, or an action formula. Do not use `.base-layer` as a license to leave the middle half empty.
- Do not push a short content block to the bottom with `margin-top:auto` when the middle of the poster is still empty. First add or expand the real decision layer directly after the previous module, then use bottom anchoring only for the last substantial layer.
- The footer is not content. Reserve a footer band and keep at least 24px breathing room between the last content/support block and the footer rule.
- Footer position must be consistent across pages in the same deck. Rendered footer-top drift greater than 8px is a validation failure across all routes/templates. If one page's footer is visibly lower/higher than the others, the page is over-packed, the final content layer is too tall, or the footer has wrapped.
- Do not repeat `title + lead + 3 short rows` more than twice in one deck.
- If two adjacent 25% horizontal bands are visually empty, the page is under-filled.
- If the page has fewer than 3 decision-bearing modules after the title, add content before rendering: a consequence row, limitation row, audience archetype, formula step, or evidence caption. The footer, route label, decorative background, and icon-only blocks do not count.
- Before styling, assign a real job to the upper, middle, and lower content zones. At least two of those zones must carry product-specific decision content, and the lower zone must not be filled only by route decoration.
- Borrow Guizang's portrait-fill discipline for all routes: turn thin material into a clearer visual argument with one-glance verdict, evidence interpretation, reader consequence, or price/action logic. Do not stretch empty cards, background grids, color fields, icons, or footer treatments to fake density.
- In `geek-bench`, the bottom particle/glow field may count as a justified atmosphere band, but only for the lower quarter. It must not excuse empty middle content.
- In `warm-review`, deliberate negative space may count as atmosphere only when the page has a magazine spine: `mag-meta`, large serif title, a substantial image/letter/timeline/ledger, and a bottom `mag-index` or footer band. Empty space without that spine fails the route identity.
- For `warm-review` variant, audience, and final-verdict pages, the lower `mag-index` should normally be the final content-bearing layer with `base-layer`. This matches the image/caption/interpretation rhythm used on evidence pages and prevents the index from feeling like a detached footer module. Treat it as a substantial editorial band, not a thin footer: it needs enough height and internal padding to read as content.
- Rendered text must not be clipped inside its own box, escape the poster, or touch the 1080×1440 canvas edge. The validator treats these as failures because they usually mean content was forced into the wrong component.

Fix under-filled pages by changing structure, not by adding decoration:

1. Increase ledger row height to 118-170px.
2. Add 2-4 compact judgment rows under short card groups.
3. Add a left marginal column with large keywords, numbers, or audience labels.
4. Add a pull-quote or verdict-stamp column.
5. Use `.price-formula` as a tall formula layer when the page is about cost, workflow, or tradeoff logic.
6. Add a bottom `risk-strip`, `limitation-row`, or `source-band` when it carries real decision value.
7. Add a route-owned solid decision band when it summarizes `Buy / Wait / Skip`, `Rule / Test / Save`, or another real action split.
8. Merge adjacent thin pages.
9. Switch a thin table to `M08 Tall Ledger`, `M04 Pull Quote`, or a full evidence page.

Good density additions are specific to the buying decision: a cost threshold, a risk boundary, an audience split, a variant rule, a before-buy checklist, or an interpretation of a real image/spec. Bad density additions are generic slogans, source/provenance text, empty rounded rectangles, repeated labels, or decorative visual systems with no decision payload.

Low-information rescue order:

1. Add decision content that changes the buying action.
2. Add evidence interpretation that explains a real image, screenshot, or spec.
3. Add audience segmentation that changes who should buy, wait, or skip.
4. Enlarge a true verdict into a hero statement only when it is the point of the page.
5. Merge the page if it still cannot justify its own 1080x1440 surface.

Do not rescue sparse pages with route logos, floating icons, oversized empty cards, repeated screenshots, decorative gradients, or source/provenance text.

### price-formula

`.price-formula` is a focal module for price, cost stack, workflow stack, or tradeoff chain. It should read as a substantial layer in the page, especially when the surrounding content is sparse.

- Formula steps should use the route template's generous min-height and padding; as a default, the formula layer should feel closer to a 200px+ content band than a 90px divider strip.
- Keep large values/actions such as `¥4499`, `外置`, `自担`, `渠道`, or `保修` visually dominant, but use the route's light/regular display weight instead of heavy bold.
- On sparse mechanism pages, wrap the formula and its follow-up ledger/risk rows in `.formula-stack` so they act as one lower content group above the footer instead of leaving the formula floating directly under the title.
- Do not override formula steps with a short height, tiny type, or compressed padding.
- If the formula is followed by only one short row, add 2-3 real judgment rows or a risk strip so the page does not feel hollow.

Fix over-packed pages by removing or moving content, not by shrinking type:

1. Move production/source notes to `SOURCES.md` or the final response.
2. Shorten the lead before shrinking body text.
3. Convert a long bottom note into a 1-line `source-band`, or remove it if it is provenance.
4. Split the page if two focal devices compete.
5. Change to a higher-capacity recipe only if the page still has one focal point.
6. Keep `.foot` in the flex flow with `margin-top:auto`; do not push it down with absolute positioning.

## 3. Support Information Types

Classify every small note before placing it.

| Type | Purpose | Goes in image? | Placement |
| --- | --- | --- | --- |
| `risk-note` | Affects buying decision | Yes | Directly under the verdict, aligned to verdict grid |
| `limitation-note` | Limits evidence interpretation | Yes, if short | Under evidence/caption or comparison block |
| `source-band` | Short visual metadata or content-facing qualifier | Rarely | Above footer, one line, hairline separated |
| `production-note` | Explains how the deck was made | No | Final response or `SOURCES.md` |
| `provenance` | Full source URLs, image origins | No by default | `assets/SOURCES.md` |
| `attribution` | Required image credit | Yes if user chooses | Small caption attached to that image |

Examples:

- In image: `官方样张，非同场景 A/B`.
- Not in image: `SMZDM 页面正文未能抓取，本版用于测试 skill`.
- Not in image: `来源已记录在 SOURCES.md`.
- Not in image: market basis, unresolved price state, fallback price notes, and disclaimer wording.

## 4. Support Components

Use fixed components, not loose text.

### risk-strip

Use for buying-relevant cautions:

```html
<div class="risk-strip">
  先等价格稳定 · 样张证据不足时不建议盲买
</div>
```

Placement:

- Below `verdict-grid`.
- Same left/right edges as verdict grid.
- Hairline above.
- Max 1-2 lines.

### limitation-row

Use for evidence limitations:

```html
<p class="limitation-row">官方样张，非同场景 A/B；仅用于观察 HDF 高光扩散倾向。</p>
```

Placement:

- Directly below image caption or comparison block.
- Same width as image/comparison block.
- Smaller than body text; readable but subdued.

### source-band

Do not use a visible source band for market basis, fallback pricing, unresolved prices, or disclaimer wording. Put that material in `deck-data.json` and `assets/SOURCES.md`.

If a task needs a short visual metadata band, keep it non-legalistic and content-facing:

```html
<div class="source-band">
  样张观察 · 画面变化
</div>
```

Placement:

- Above footer issue strip.
- Same width as content box.
- One line preferred, two lines max.
- Hairline above or below.

### issue-strip / footer

Use only for metadata:

```text
SMZDM REVIEW · WARM REVIEW        07 / 07
```

Do not put long source notes, production notes, or paragraph explanations in the footer.

Issue-strip bullets are part of the module, not edge marks. Keep the dot inside the strip padding with visible breathing room before the left edge. If a dot touches the background/module boundary, fix the seed template or component CSS, not the individual page.

Dot bullets in `.issue-strip` and `.risk-strip` should be vertically centered against the first line of the text they introduce. For multi-line text, align to the first line, not the total text block height.

When a cover, final verdict, or risk section has exactly three compact points, use the three-column information-band treatment rather than a plain bullet list. The band must preserve the selected route's rule system: one visual rule weight for the band perimeter and internal dividers, no mixed thin/thick borders in the same module. In `swiss-guide`, this treatment matches the rounded black `.solid-band`: internal dividers are parent-level inset rules with top/bottom breathing room, never full-height child borders. For `bauhaus-bright`, draw the closed hard-edge band as one grid system: black parent background, 4px gap, and paper-filled cells. Do not combine a parent outline with child divider borders, because T-joints can visually double or make columns appear misaligned at browser scale. Clear any stacked-list separators on the child cells in this state, especially `.risk + .risk` top borders, so the second and third columns do not receive an extra top rule. For routes that intentionally use an open information band, keep the open sides but still keep internal and horizontal dividers optically consistent. Place it as a lower content layer and keep a stable safe gap before the footer rule. The layout is title-led: each column has a short heading and one sentence. Control the copy to fit the band:

- Title: 2-5 Chinese characters.
- Sentence: roughly 14-22 Chinese characters.
- If the sentence is too short, add useful decision context.
- If the sentence wraps too much, cut proof detail and keep only the buying consequence.
- Do not use colon-style strings such as `风险 1：...` in the three-column treatment; split them into `<strong>` and `<em>` content.

### split-row

Use `.split-row` for compact label + body rows. The label column is smaller type, so it should align optically with the first line of the right-side body, not float halfway between rows or sit on the raw top edge. Templates enforce this with `.split-row .body { margin: 0 }` and a small label top offset that works for both one-line and multi-line body text.

Do not solve split-row alignment with inline styles, one-off `margin-top`, absolute positioning, or page-specific classes. If the alignment looks wrong in a route, update that route's seed template so every page inherits the same row rhythm.

## 5. Page-Type Placement Rules

### `cover-verdict`

- No long source notes.
- If a limitation is necessary, convert it into a buying action in the bottom issue strip area, e.g. `先等成交价稳定`.
- Keep production notes out of the image.

### `evidence-sample`

- Evidence limitation belongs under the image caption.
- If the image is not a strict comparison, say so: `官方样张，非同场景 A/B`.
- Do not move evidence notes to the bottom just because there is space.

### `before-after-effect`

- A/B limitation belongs directly under the A/B block.
- If no source-valid paired evidence exists, do not use visual before/after.
- Never use `source-band` to rescue a misleading A/B; fix the page type.

### `variant-comparison`

- Market/source qualifier may use `source-band` after the comparison block.
- It must align with the comparison block, not the page edge.

### `audience-fit`

- Put risk notes as a ledger row, not as a floating note.
- If a caution affects only one audience, attach it to that row.
- If the lower third is empty after the audience ledger, add a bottom three-column `.issue-strip` that classifies reader archetypes. Keep it distinct from `final-verdict`: labels should be audience types (`氛围党 / 价格党 / 清晰党`), not actions (`建议买 / 建议等 / 不建议`). Do not add a product/sample image solely to fill this space unless the image is real evidence and changes the audience decision.

### `spec-price-ledger`

- Put source state in `deck-data.json` / `assets/SOURCES.md`, not inside the affected ledger row.
- If a price is unverified or overseas-only, do not print the hard number; turn it into a buying action such as `等成交价稳定`.
- Do not add a separate paragraph unless it affects multiple rows.

### `final-verdict`

- Only buying-relevant limitations may enter the image.
- Place them as a `risk-strip` below the verdict grid.
- Do not place a rounded `risk-strip` and a rounded `solid-band` one after another on the same final page. Use one of these layouts instead: `verdict-pill + bws-grid + risk-strip base-layer` with next actions merged into the risk headings; `verdict-pill + bws-grid + split-row/ledger limitations + solid-band base-layer`; or a larger `risk-strip base-layer` when the risk module already carries final checks.
- Keep production notes in final response or `SOURCES.md`.
- If a note exceeds two lines, move it out of the image.

## 6. Intent Before Form

Borrow from the FT-style visual vocabulary principle: choose structure by what the reader needs to understand.

```text
comparison     -> paired modules / variant comparison
evidence       -> large image + caption + limitation-row
ranking        -> ordered bars / ledger
flow           -> pipeline / steps
final decision -> buy-wait-skip / verdict grid
source/limits  -> support component, not main layout
```

If a support note becomes the most visually complex part of the page, the page is trying to say too much.

## 7. Anti-Patterns

Do not:

- Place `.source-note { position:absolute; bottom:116px; }` as a per-page patch.
- Float a note between unrelated modules.
- Put production process notes inside final graphics.
- Let notes align to neither the image nor the verdict grid.
- Use footer metadata as a paragraph container.
- Hide a buying-critical limitation in tiny text.
- Use repeated source images to create the impression of richer evidence.

## 8. Quick Check

Before delivery, ask:

1. What object does this note explain?
2. Is the note physically closest to that object?
3. Does its left edge align with that object or the main content grid?
4. Is it a risk/limitation/source/production note?
5. If it is production/provenance, why is it inside the image?
6. If it is more than two lines, can it move to final response or `SOURCES.md`?
