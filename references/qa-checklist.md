# QA Checklist

Run before final delivery or whenever the user asks for validation.

During iteration, use `build:fast`, `render -- --pages <n>`, or `validate -- --pages <n>` for speed. Do not treat fast iteration output as final QA; run full validation before delivery. Use strict validation only when WARN items should block.

## Delivery

- Final response includes the exported image directory path: `<task-dir>/output/`.
- Final response includes a preview path: `<task-dir>/output/contact-sheet.png` or `<task-dir>/output/index.html`.
- Final response includes the source HTML path when the user may want to edit or reopen the deck: `<task-dir>/index.html`.
- Do not deliver only the HTML preview or contact sheet; the individual PNG export folder is required.

## Content

- Every visible claim exists in `deck-data.json` or the source notes.
- `deck-data.json` is prepared before HTML with `asset_usage`, `sources`, `unverified`, and intentional omissions so validation does not require late data backfill.
- Price, specs, release info, coupons, and availability are verified or marked `待核实`.
- Price, availability, coupons, subsidies, sale channel, warranty, and launch info default to mainland China/RMB. Any overseas data is clearly labeled as fallback and does not masquerade as domestic pricing.
- Market-basis and disclaimer wording stay in `deck-data.json` or `assets/SOURCES.md`, not on the card image.
- Unverified hard prices and overseas fallback hard prices are not printed in HTML. The card turns them into buying actions such as wait, skip, or compare later.
- Only verified mainland China prices may appear on the image, without market/disclaimer labels.
- Every page answers a buying question, not just "what the article said".
- Visible copy stands alone as social-platform content. It does not say `文章里`, `原文`, `资料显示`, `素材指出`, `用户提供`, `根据链接`, or similar production/source-frame wording.
- Source tables, measured numbers, benchmark scores, rating counts, and competitor specs are reviewed as `quantified_evidence` before page copy is written.
- If the source has high-density quantitative evidence, at least 2-4 decisive verified figures appear on suitable cards, each paired with buying meaning.
- Any unused central table/number is recorded in `deck-data.json.unused_quantified_evidence` or `unverified` with a reason; it is not silently softened into vague claims.
- `buy_if`, `wait_if`, and `skip_if` are not contradictory.
- Final verdict includes limitation/risk when it changes the decision.
- Any A/B or before/after page uses source-valid paired evidence. Unrelated samples, agent-edited images, or visual simulations are not presented as real comparisons.

## Style Lock

- Exactly one style route is used.
- Exactly one palette/accent is used across the deck.
- Footer, labels, title treatment, image treatment, and borders are consistent.
- A borrowed `S` or `M` primitive does not leak its original visual skin.

## Layout

- Images are `1080 x 1440`.
- Content adapts to the selected template. No page invents a new layout system, one-off component family, or inline spacing/border/font-size patch because copy did not fit.
- If a page does not fit, the output uses a documented fit action: shorten, move-out, switch, split, merge, or omit.
- Visible copy stays under the page-type budgets in `page-types.md`; budgets are hard limits, not targets.
- Content fills the 3:4 canvas intentionally; active composition should occupy at least 78% of page height.
- Content does not overfill the 3:4 canvas; most pages should leave a real footer band and not exceed roughly 90%-92% active occupancy.
- Run the 4-band density check: divide the card into four 360px bands. Filled or justified-empty bands must cover the page; no two adjacent middle bands may be under-filled.
- For `geek-bench`, the bottom particle/glow field can justify the lower quarter as atmosphere; the middle two bands still need real content.
- Footer top position is consistent across pages in one deck; rendered footer-top drift greater than 8px is a validation failure for every route/template.
- Footer breathing room: the last content/support block stays at least 24px above the footer rule.
- Each page has one focal device.
- Notes, sources, limitations, captions, and footers follow `layout-discipline.md`; no loose absolutely-positioned support text.
- Row groups use internal separators only; no doubled horizontal rules from adjacent ledgers, punch strips, colored blocks, or footers.
- Components that switch from vertical list to horizontal grid clear old list separators; no column should inherit an extra top border from adjacent-sibling row rules.
- Numbered rows (`01/02/03/04`) keep the same label column, vertical padding, and separator rhythm on a page.
- Colored callout blocks have four-side borders and internal padding; text is never flush against the color edge.
- Evidence/sample page gives the image enough area to inspect.
- `evidence-sample` is used only when real image/screenshot evidence is present; otherwise the page type is changed and `no_image_reason` is recorded.
- Before/after and variant comparison pages preserve symmetry.
- Ledger pages use enough rows to fill the canvas without tiny text; `spec-price-ledger` normally needs at least 5 rows.
- Final page clearly says `建议买 / 建议等 / 不建议` or equivalent and includes 3 buying-relevant risks/limitations when they change the decision.

## Text

- No overflow, edge touching, or footer collision.
- No clipped text inside a fixed-height box.
- Text inside cards, formulas, chips, verdict pills, risk strips, image wells, and other registered containers keeps a safe inset from component edges.
- Light text must not sit on light grey, paper, pale accent, or translucent light modules. Use dark ink on light surfaces, or move white/light text onto a dark/accent surface with clear contrast.
- When a text/background contrast check fails, fix the text color first. Do not add a new background, plate, tint, shadow, overlay, or filled surface just to pass contrast unless the selected route template already defines that surface for the component's visual role.
- If rendered visual evidence shows the text is already on the correct visual surface but the validator misreads the background, fix the validator or route template rule narrowly. Do not alter the deck composition with extra background layers as a validator workaround.
- Metric labels/chips keep visible breathing room from large numbers or prices.
- Action labels such as `建议买 / 建议等 / 不建议` keep clear vertical spacing from their explanatory copy.
- If text does not fit, use the documented fit actions: rewrite shorter, wrap normal body copy, split into another registered component, switch page type, or use a route-owned compact variant. Do not patch with inline font-size or squeezed spacing.
- No visible element escapes the 1080×1440 poster canvas.
- No text or media touches the canvas edge; content stays inside the route's safe area.
- Chinese line breaks are intentional.
- No visible Chinese text line ends with only one Chinese character, or one Chinese character plus punctuation. Fix by rewriting, splitting, or moving detail; do not use tiny type, squeezed spacing, invisible characters, or one-off inline layout patches.
- Body/caption text remains readable on a phone.
- Product names, model names, and English feature names are spelled consistently.
- Visible card text does not contain hard disclaimer wording such as `待核实`, `以官方为准`, `以页面为准`, or `仅作参考`.
- Market-basis wording such as `中国大陆`, `国行`, `海外`, `美国`, or `B&H` is reviewed in context. It should not be used as a disclaimer label on card surfaces; valid product/version context may remain if it is necessary to the judgment.

## Images

- Every image has a real provenance: user-supplied, source-article, official/authorized, screenshot captured for the task, or public source recorded in `assets/SOURCES.md`.
- For context-sensitive products, scene/use-environment images were attempted before falling back to packshots or no-image layouts, unless user-supplied or official assets already answer the page job.
- Public review/community images such as 什么值得买, 少数派, IT之家, media reviews, creator reviews, or user posts are recorded as public review/community evidence, not official evidence.
- Full image provenance, platform/author, source URL, deck use, evidence role, and limitations are recorded in `assets/SOURCES.md` / `deck-data.json`; visible cards use only short evidence-role labels when needed.
- If credible raster images exist in `assets/`, at least one page or module uses them unless `deck-data.json` declares `no_image_reason`.
- No self-made product/sample/UI/price evidence is used: no generated image, hand-drawn placeholder, traced product art, CSS/canvas illustration, or illustrative A/B state.
- No SVG is used in the deck: no inline `<svg>`, no `.svg` asset references, no CSS SVG backgrounds, and no `data:image/svg+xml`.
- All placed images are raster evidence assets: PNG, JPG/JPEG, or WebP.
- Product body, lens, screen, UI text, sample detail, or price evidence is not accidentally cropped.
- Important crops have deliberate `object-position`; use `contain` or framed crops when losing an edge would damage trust.
- Text, stamps, overlays, and gradients do not cover faces, products, UI labels, price evidence, or sample details.
- Evidence images pass a 360px-wide thumbnail check: subject, A/B labels, captions, and source notes remain readable.
- Text-heavy ecommerce detail images, parameter graphics, callout diagrams, and long promotional image slices are rejected when embedded text is cropped, unreadable at thumbnail size, or competes with the card's own copy. Convert their claims into ledger/stat/mechanism modules and keep provenance in `deck-data.json` / `assets/SOURCES.md`.
- Sample images are not stretched.
- Image pages do not place long text over busy photos; if text must sit on an image, it uses a quiet zone or localized plate.
- The same source image is not reused as the main visual on multiple pages. Alternate-size downloads, visually identical listing variants, crops, and detail crops count as the same source image.
- Visible evidence images do not contain large platform/marketplace watermarks, coupon panels, promo price panels, or dominant seller-layout overlays. Small unobtrusive marks are acceptable when they sit in a corner/open area, do not cover evidence, and read as brand/project/source provenance rather than promotion.
- Web-sourced images are recorded in `assets/SOURCES.md`.

## Validator Expectations

`scripts/validate-review-deck.mjs` checks:

- `deck-data.json` exists and contains `style_route` and `palette`.
- HTML contains posters.
- All posters share the same `data-style` and `data-palette`.
- Every poster is 1080x1440 by DOM box size when rendered.
- Required page types are present or explicitly omitted in `deck-data.json`.
- Available raster assets are not ignored without `no_image_reason`.
- Repeated exact image use across multiple poster pages fails unless explicitly allowed in `deck-data.json`.
- Inline layout patch styles inside posters fail; content must adapt to registered template components.
- Page copy that exceeds the page-type budget fails.
- Rendered overflow, clipped text, escaped elements, edge-touching text/media, and Chinese single-character widow lines fail.
- 3:4 rendered density via 4-band occupancy (requires Playwright). Full validation fails if rendered checks cannot run; use `--allow-render-skip` only for drafts and mark the output QA-incomplete.
- Page-type minimum capacity warnings for thin ledger, audience, evidence, comparison, and final verdict pages.
- Footer breathing warnings and footer-position drift failures.

Treat script failures as blockers before final delivery.
