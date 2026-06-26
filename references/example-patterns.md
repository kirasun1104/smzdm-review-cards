# Example Patterns

Use this file to guide local examples without shipping full rendered decks or large evidence assets in the skill package.

## Repository Policy

- Keep tiny validator fixtures in `tests/fixtures/`.
- Put realistic working examples, downloaded evidence, rendered PNGs, and contact sheets in `local-tests/`.
- `local-tests/` is intentionally ignored by `.gitignore` and `.codexignore`.
- Do not add full rendered output, large product images, or one-off task folders to the skill package.
- If a local example teaches a reusable rule, summarize the pattern here instead of copying the whole deck into `examples/`.

Recommended local structure:

```text
local-tests/
  no-image-info/
    index.html
    deck-data.json
    assets/
      SOURCES.md
    output/

  uncertain-price/
    index.html
    deck-data.json
    assets/
      SOURCES.md
    output/

  image-review/
    index.html
    deck-data.json
    assets/
      SOURCES.md
      product-hero.webp
      sample-01.webp
    output/
```

## Pattern: No-Image Information Deck

Use when the user chooses no-image, or when one focused image-source round fails.

Required data:

- `deck-data.no_image_reason`
- `omitted_page_types` includes `evidence-sample` unless another source-valid evidence page exists
- `sources` records user notes or source text
- `asset_usage` is empty or omitted only when no images are placed

Page mix:

- `cover-verdict`
- `mechanism-explainer` or `mechanism-tradeoff`
- `variant-comparison`
- `audience-fit`
- `spec-price-ledger`
- `final-verdict`

Visible copy should explain buying consequences, not apologize for missing images. Do not add fake product art, generated product images, SVG placeholders, or decorative evidence panels.

## Pattern: Uncertain-Price Deck

Use when price, stock, coupons, launch date, warranty, or channel facts may have changed and cannot be verified quickly.

Required data:

- `unverified` lists unresolved fields, such as current street price, sale date, coupon stack, or channel stock
- `sources` records what was checked or what the user supplied
- `graphic_price_policy` states that only verified mainland China hard prices may appear in HTML

Visible copy:

- Do not print hard unverified prices.
- Do not print `待核实`, `以官方为准`, `以页面为准`, or `仅作参考` on cards.
- Convert uncertainty into buying actions: `等成交价稳定`, `先看本地上市价`, `确认保修渠道再下单`, `活动价再判断`.

Good page choices:

- `spec-price-ledger` with action-led rows instead of hard price chips
- `final-verdict` with `建议等` when price is the deciding variable
- `risk-strip` or `issue-strip` for channel, warranty, or coupon-stack risk

## Pattern: Image Review Deck

Use when the user supplies credible product photos, samples, screenshots, or when one focused public-source round finds usable evidence.

Required data:

- `asset_usage` for every main visual
- `assets/SOURCES.md` for public or web-sourced images
- `evidence_relationships.before-after-effect: "same-scene-ab"` when using `before-after-effect`
- `allowed_repeated_assets` only when the user explicitly requests visible repetition of their own supplied asset

Image rules:

- Prefer 1-3 strong evidence images over many weak ones.
- Do not reuse the same source image as the main visual on multiple pages, including alternate downloads, crops, or detail crops.
- Use deliberate `object-position` on evidence images.
- Use `object-fit: contain` or framed crops when UI text, product edges, labels, prices, or A/B details matter.
- Do not generate, draw, trace, or edit evidence images to simulate product, sample, UI, price, or before/after proof.

Page mix:

- `cover-verdict` with one product or sample signal
- `evidence-sample` for one real image/screenshot and interpretation
- `before-after-effect` only for source-valid same-scene A/B
- Ledger, audience, price, and final pages for decision logic

## Local Validation

For local examples, use the same commands as real tasks:

```bash
npm run validate:text -- local-tests/<example>
npm run build:fast -- local-tests/<example>
npm run validate -- local-tests/<example>
```

Use `tests/fixtures/` for validator regression tests. Use `local-tests/` for realistic design QA.
