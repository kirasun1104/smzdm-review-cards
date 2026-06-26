# Intake Contract

Use this before asking setup questions for route, palette, evidence source, or fact-check scope.

## Question Rules

- Ask setup questions one at a time.
- Route, palette, missing-copy mode, evidence-source, and fact-check setup questions must be single-select. If the user chooses to provide content, the follow-up content collection may be free-form because the user needs to paste or point to source material.
- Ask setup questions by default. Do not silently choose style, palette, evidence source, or missing copy fields unless the user explicitly asks for fast generation.
- Use the host's native single-select choice UI when available for single-select setup questions. If the active tool is Claude / Claude Code and it supports a user-question popup, use that popup for setup and missing-copy mode questions. Use numbered text menus only as the plain-text fallback for AI tools that do not support popups; use a one-line free-form prompt only after the user chooses to provide content.
- Stop asking once the next answer would not change the deck.
- If the user already named a route, palette, evidence source, or fact-check scope, do not ask again.

## Fast-Generation Exception

Skip setup questions only when the user clearly asks for speed or one-shot output, such as:

```text
快速生成 / 一键生成 / 直接生成 / 先出一版 / 不用问 / 按推荐来 / 你定 / 自动选择 / speed / quick / one-shot
```

When this exception applies:

- Choose the content-specific recommended route from `style-routes.md`.
- Choose the route default or content-specific recommended palette.
- If evidence is missing, use no-image information cards and record `deck-data.json.no_image_reason` instead of asking.
- If copy/source material is missing, ask one concise content question anyway; there is no reliable deck without product/source text.

## Required Question Gates

Unless the Fast-Generation Exception applies, use these gates:

1. **Style gate**: Ask the style route first whenever the user has not explicitly named a route. Include exactly one recommended option based on the supplied content.
2. **Palette gate**: After a multi-palette route is selected, ask the palette question whenever the user has not explicitly named a palette. Include exactly one recommended palette.
3. **Copy gate**: If no concrete source copy is supplied, ask a single-select missing-copy mode question before generation: `由 AI 一键完成内容` or `用户提供内容`. Concrete source copy means at least one of: article text, product notes, product link, screenshot/document, review outline, spec table, or a clear product + buying question + key facts. A product name alone is not enough.
4. **Evidence gate**: Ask the evidence-source question only when the deck would benefit from product/sample/screenshot evidence and no credible assets are supplied.

## Missing Copy Question

Ask this when the user has not supplied concrete source copy and has not explicitly asked for fast / one-shot generation:

```text
还缺少生成卡片的具体内容。请选择一种方式：
A. 由 AI 一键完成内容（推荐：适合只给了产品名/主题，AI 会查资料、整理事实模型，并尽量抓取优质图片素材）
B. 用户提供内容（适合你有文章、笔记、链接、截图或产品事实；最好同时提供产品图/样张/截图，效果更好）
```

If the user chooses A:

- Treat this as permission to research and synthesize the source copy.
- Do a focused fact-gathering pass for product facts, current/unstable facts, and credible source URLs.
- Try to source high-quality product/sample/screenshot images when useful, following `image-evidence.md`: official/authorized/source-article/public assets only, record provenance, and stop after one focused round if blocked.
- Record source URLs, unresolved facts, and AI-synthesized basis in `deck-data.json` / `assets/SOURCES.md`.
- Do not invent hard prices, evidence images, sample results, review scores, rankings, or availability.

If the user chooses B:

- Ask one concise free-form follow-up for article text, notes, URL, screenshot/document, spec table, or product facts, and explicitly suggest attaching product photos, sample images, screenshots, price screenshots, or source-article images because the deck will look better with real evidence visuals.
- Do not generate the deck until the user supplies enough content or switches to AI one-click completion.

## Recommendation Language

- A setup question may mark zero or one option as `推荐`.
- If an option is marked `推荐`, the closing recommendation sentence must point to that same option.
- Do not recommend another option or a range in the closing sentence.
- Use `适合：` or `用于：` for option descriptions.
- Reserve `推荐` for the single active recommendation.
- Default palette and recommended palette are different concepts. If the content-specific recommendation differs from the template default, say `默认是 X；这题建议选 Y`.

## Option Labels

Option labels must describe explicit roles or actions. Avoid ambiguous first-person labels.

Good labels:

```text
上传产品图 / 样张 / 截图
由 AI 助手查找官方 / 公开图
先做无图信息版
```

Avoid labels that begin with vague first-person wording such as `我来找图` or `我没有图`.

## Recommended Question Order

1. Style route.
2. Palette, if the selected route has more than one palette.
3. Missing-copy mode, if no concrete source copy exists.
4. Evidence source, only if no credible assets exist and the deck would benefit from evidence images.
5. Fact-check scope, only if unstable facts affect the verdict.

## Palette Question Policy

After the user selects a style route, use this policy before asking a palette question:

| Route | Ask palette after route? | Rule |
| --- | --- | --- |
| `swiss-guide` | Yes | Ask one single-select palette question unless the user already named a palette or asked for speed. |
| `geek-bench` | Yes | Ask one single-select data-accent question unless the user already named a palette or asked for speed. |
| `warm-review` | Yes | Ask one single-select color-direction question unless the user already named a palette or asked for speed. |
| `bauhaus-bright` | No | Use `classic`; never ask for palette. |
| `digital-pop` | Yes | Ask one single-select palette question unless the user already named a palette or asked for speed. |
| `blue-stack` | No | Use `blue-core`; never ask for palette. |
| `seasonal-editorial` | Yes | Ask one single-select palette question unless the user already named `coral-cream` / `approach-red` or asked for speed. |

If the user asks for speed, use the route default or the content-specific recommendation from `style-routes.md` without another question. In all palette questions, mark at most one recommended option and keep the recommendation consistent with the closing sentence.

## Evidence Question

Ask once when no credible assets are supplied:

```text
这组评测结论卡需要 1-3 张证据图。三种走法：
A. 上传产品图 / 样张 / 截图（推荐，最可信）
B. 由 AI 助手查找官方 / 公开图并记录来源
C. 先做无图信息版
```

If B is chosen, do one focused search/download round only: one official/authorized source pass, one public product-image fallback if needed, and direct downloads only for assets whose provenance can be recorded in `assets/SOURCES.md`.

If blocked or unreliable, switch to no-image information cards and record `deck-data.json.no_image_reason`. Do not keep retrying image search, probing official CDNs, or widening the search indefinitely.
