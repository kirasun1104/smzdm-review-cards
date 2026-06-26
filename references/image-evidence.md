# Review Evidence Image Rules

Use this when a page uses product photos, official samples, screenshots, UI captures, sample crops, or same-scene A/B evidence.

## Evidence First

- Treat images as proof, not decoration. Do not add fake grading, simulated filters, invented bokeh, or AI-edited A/B states.
- If credible product/sample/screenshot assets are available, use at least one image-led page or image module. Do not default to an all-text/no-image deck unless the user explicitly chooses no-image or the available assets fail the evidence gate.
- If a visual is illustrative rather than evidentiary, label it plainly in the caption.
- Do not reuse the same source image anywhere in the same deck: not twice on a cover, not as both cover and evidence, and not across pages. This applies to exact files, near-duplicate files, alternate-size downloads, crops, detail crops, and visually identical marketplace listing variants.
- Reusing the exact same image file is a validation failure unless the user explicitly requests visible repetition of their own supplied asset and the file is listed in `deck-data.json.allowed_repeated_assets`.
- Do not turn one source image into multiple evidence assets by cropping or making detail crops. If only one usable source image exists, use it once and switch other pages to ledger, mechanism, audience, or verdict layouts.

## Watermark And Promo Overlay Gate

- Reject source images with large platform, marketplace, or promotional watermarks as visible evidence. Examples include central JD/Tmall/marketplace marks, large translucent platform text across the product, coupon panels, promo price panels, live-commerce banners, or seller-layout text that dominates the image.
- Reject text-heavy retail detail images as visible evidence when their embedded copy, callouts, arrows, parameter labels, or long promotional text would be cropped, unreadable at 360px width, or visually compete with the card's own interpretation copy. A recorded source is not enough; the image must be inspectable and card-native. If the image's value is the product mechanism rather than the picture itself, translate the mechanism into ledger/stat/decision modules and record the source in `deck-data.json` / `assets/SOURCES.md` instead of placing the text-heavy image.
- Small unobtrusive source marks may be acceptable when they do not cover the product, sample, UI, or buying-relevant detail. Acceptable marks include corner brand/project signatures, small photographer/source marks, or official event marks that sit in an open area and read as provenance rather than promotion. For example, a lower-corner `深睡乐园` mark on a clean landscape scene is acceptable if it does not obscure the subject and remains visually secondary.
- Distinguish mark types before rejecting: brand/project signatures can stay; platform/channel watermarks are conditional; promotional overlays, coupon/price marks, live-commerce banners, central translucent text, and watermarks crossing the product or face are blockers.
- Do not remove, blur, clone, or generatively erase watermarks from evidence images. If the only available image has a large watermark or promo overlay, use a no-image information page or ask the user for cleaner assets.

## Allowed Image Sources

- Use images only when they are user-supplied, from the source article, from an official/authorized product page, from an official sample set, from a screenshot supplied or captured for the task, or from a public source recorded in `assets/SOURCES.md`.
- For product reviews, first look for user-supplied/source/official/public images before choosing a no-image structure.
- Prefer real scene/use-environment images when the product's buying value depends on context, handling, installation, carry, fit, scale, texture, sample output, or workflow. Good examples: cameras, pocket gimbals, outdoor gear, home appliances, furniture, beauty/fashion, coffee, vehicles, pet products, and travel tools. Use clean official packshots only when they answer the page's job better, or when scene images cannot be sourced credibly.
- Before placing a downloaded public image, inspect it at card size for dominant watermarks, coupon/price panels, platform overlays, and near-duplicate relationship to already selected images. Small corner brand/project signatures may pass when they do not compete with the subject or card copy.
- For ecommerce detail-page assets, prefer clean scene/product photos over sliced long-detail graphics. Do not place a detail graphic just because it contains useful claims; extract the claim into the fact model, keep provenance in sources, and use a no-image mechanism/ledger page unless the graphic remains clean, uncropped, and readable as image evidence.
- Automatic image finding has a hard budget. Official sites are often JS-rendered, hotlink-protected, or blocked, and clean transparent product PNGs are especially unreliable. Try one focused round only; if it fails, switch to a no-image card structure and record `deck-data.json.no_image_reason`.
- Do not repeat WebFetch/curl attempts, guess CDN PNG paths, scrape multiple image search sites, or keep probing hotlink-protected official pages. More attempts usually cost time without improving trust.
- Do not create, draw, generate, trace, or stylize product photos, sample photos, UI screenshots, before/after states, or price evidence yourself.
- Do not use AI-generated images as review evidence. If a generated visual is ever used for a clearly non-evidence mood/cover experiment, it must not be labeled as product, sample, screenshot, or A/B proof.
- If no credible image source exists, use a no-image card: ledger, mechanism explainer, audience fit, or verdict structure.

## Scene Image Source Ladder

When a scene/use-environment image would make the deck materially more useful, try sources in this order:

1. User-supplied scene photo, sample, screenshot, or price screenshot.
2. Brand-owned assets: official brand site, official product page, official press kit, brand-owned social post, official sample gallery, or launch/newsroom media.
3. High-quality authorized/editorial launch coverage: brand-provided images in credible media or brand-story platforms, such as Brandstar/品牌星球, 36氪, IT之家, 少数派, 界面新闻, 新京报, or comparable publisher pages. Use these only when the image appears to be brand-provided/editorial and the page URL, platform, and limits are recorded.
4. Authorized storefront assets: Tmall flagship, JD flagship/self-operated, Douyin/Kuaishou official shop, brand mini-program store, or other authorized retail pages. Prefer clean product/scene photos; reject dominant channel watermarks, promo overlays, coupon panels, seller-layout screenshots, and text-heavy detail slices. Small corner brand/project signatures may pass.
5. Curated deal/community sources: 什么值得买, credible review/community posts, public user posts, or creator reviews. Treat these as public review/community evidence, not official evidence, and use them only for visible scene, handling, scale, setup, or usage context.
6. Video screenshots from official or credible review videos, only when the frame clearly identifies the product and scene and the screenshot is recorded as a screenshot source.
7. No-image information layout when the above fails or image provenance is unclear.

Source priority never overrides visual quality. If a higher-priority source only offers dominant watermarks, promotional, text-heavy, cropped, or unreadable images, skip that asset and move to the next source tier. A clean Brandstar/official media image is better than a JD image with a dominant watermark; a clean Tmall flagship product photo is better than a cropped official detail graphic; a curated SMZDM scene image can be acceptable when official/authorized assets are unusable, but it must not be presented as official evidence.

For SMZDM/community/editorial images:

- Treat them as public review/community evidence, not official product evidence.
- Use them only for the scene, handling, scale, setup, or usage context shown by that source. Do not use them to prove official specs, universal sample quality, all-market pricing, rankings, or broad claims beyond the source.
- Do not present user-generated or community images as official images.
- Do not use a community image for before/after or A/B proof unless the source itself provides a valid same-scene comparison.
- If the source image appears copied from an official page or another platform and provenance cannot be traced, prefer the original source or skip the image.
- Do not scrape many community pages. One focused public-source fallback pass is enough; if it fails, proceed with official packshots or no-image layouts.

## Provenance Placement

Full source and provenance information belongs in `assets/SOURCES.md` and `deck-data.json`, not in visible card copy by default.

Visible card copy may include short evidence roles only when useful for reader interpretation, such as `官方产品图`, `晒单场景`, `评测样张`, `价格截图`, or `非同场景样张`. Keep these labels short and attached to the image/caption. Do not place long URLs, author names, platform disclaimers, crawl notes, or copyright explanations on the cards unless the user explicitly requests visible attribution.

Every web-sourced image entry in `assets/SOURCES.md` should record:

```md
- File: assets/example.jpg
  Source title:
  Source URL:
  Platform / author:
  Retrieved:
  Deck use:
  Evidence role:
  Limits:
```

Every matching `deck-data.json.asset_usage` item should include the file path, page number(s), evidence role, source URL or source id, and any limitation that changes the buying interpretation.

## Allowed Image Formats

- Use only raster assets in generated decks: `png`, `jpg/jpeg`, or `webp`.
- Do not place SVG through `<svg>`, `<img src="*.svg">`, CSS `url(*.svg)`, `data:image/svg+xml`, icon packs, or vector placeholders.
- If a brand/product source provides only SVG/vector material, do not use it as product/sample evidence. Use it only as a documented brand/logo source when truly necessary, rasterized to PNG and clearly separated from evidence.
- Never use a hand-drawn SVG or a generated raster image as a substitute for product evidence, sample evidence, UI evidence, or a before/after state.
- For no-image cases, switch to a ledger, mechanism, or verdict layout instead of inventing an illustration.

## Subject Avoidance

Before placing text, identify the image's protected zones:

- Human faces, hands, product bodies, labels, screens, price/coupon text, sample details, and UI controls.
- Avoid putting text, stamps, big gradients, or dark overlays on protected zones.
- If text must sit on an image, reserve a quiet zone and use a localized text plate or edge fade; never cover the evidence subject.

## Cropping And `object-position`

Every evidence image crop must be deliberate:

- Use `object-fit: cover` only when the subject remains readable.
- Set inline `object-position` explicitly on every evidence image when using `object-fit: cover`, for example `<img style="object-position: 58% 42%;" ...>`.
- `object-position: 50% 50%` is only a fallback for truly centered subjects; it is not the recommended default for review evidence.
- Prefer `object-fit: contain` or a framed crop for product bodies, screenshots, price screenshots, UI labels, and A/B samples where losing edges damages trust.
- For sample comparisons, keep both cells the same crop logic and label the relationship.

### Object-Position Discipline

Choose the crop from the protected subject, not from what looks decorative. When in doubt, keep more context and reduce text.

| Subject position / evidence need | Recommended `object-position` | Use when |
| --- | --- | --- |
| Centered product body or centered sample detail | `50% 50%` | The product/sample is genuinely centered with safe margins on all sides. |
| Product body sits left, empty copy space on right | `38% 50%` | Camera body, appliance, shoe, bag, or device is left-weighted and must not lose its edge. |
| Product body sits right, empty copy space on left | `62% 50%` | Product or key feature is right-weighted. |
| Lens, button cluster, port, watch face, or small hardware detail | `50% 42%` or the measured subject center | Detail is above visual center and should remain in the upper inspection zone. |
| Screen UI, price screenshot, coupon, app interface | `50% 50%` with `object-fit: contain` preferred | Text/UI edges matter more than full-bleed drama. Avoid cover crops unless all UI text survives. |
| Tall product, standing appliance, bottle, tripod, camera front | `50% 48%` with contain if needed | Top and bottom edges are both evidentiary. |
| Food, coffee, texture, material sample, crop-level detail | measured subject center, e.g. `54% 46%` | The evidence is a texture or sample area, not the whole photo. |
| Same-scene A/B comparison | same value on both images | Both cells must use matching crop logic so the comparison is not biased. |

Operational steps:

1. Mark the protected subject: product edges, lens, screen UI, price/coupon text, face/hand, or sample detail.
2. Estimate the subject center as a percentage from left/top and write it as inline `object-position`.
3. Render once and check that the protected subject is not touched by frame edges, captions, stamps, or overlays.
4. If the crop still cuts evidence, switch that image to `object-fit: contain` or use a framed crop instead of forcing full-bleed cover.

## Thumbnail Readability Test

Check the rendered card at about 360px wide:

- Product or sample subject is still recognizable.
- Caption/source text remains readable.
- Any text already embedded inside the source image is either fully readable and intentionally relevant, or the image is rejected. Cropped headline fragments, half-visible callouts, tiny parameter labels, and seller-detail copy that competes with card text are blockers.
- A/B labels are visible without zooming.
- No overlay hides the thing the page is using as evidence.

If it fails at thumbnail size, enlarge the image, reduce copy, move text out of the image, or convert the page to ledger/decision format.

### Text-On-Image Self-Test

Use this whenever a title, stamp, caption, or note sits on a sample/product image:

1. Render the card at `1080 x 1440`.
2. View or export a 360px-wide version.
3. Confirm the title is still readable in one glance and does not compete with the product/sample subject.
4. Confirm the overlay does not hide protected zones: faces, product labels, UI text, price/coupon proof, lens/body details, or the sample area being discussed.
5. If title and image fight, fix in this order: move the title to a quiet zone; choose another crop or image; add a localized tint plate behind only the text area.

Do not solve text conflict with a full-canvas dark/light mask. Full-frame masks weaken evidence and make sample comparisons look manipulated.
