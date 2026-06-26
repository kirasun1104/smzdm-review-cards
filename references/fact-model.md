# Fact Model

Build this model before writing page copy. All visible page text should be traceable to this model.

## Minimal Model

```json
{
  "product": "",
  "variants": [],
  "core_question": "",
  "core_claim": "",
  "price_basis": "",
  "market_basis": "mainland China / RMB unless user specifies otherwise",
  "graphic_price_policy": "only verified mainland China hard prices may appear in HTML; unverified or overseas fallback prices stay in data/sources",
  "evidence": [],
  "quantified_evidence": [],
  "effect_change": "",
  "variant_tradeoff": "",
  "buy_if": [],
  "wait_if": [],
  "skip_if": [],
  "audience_fit": [],
  "avoid_if": [],
  "spec_price_ledger": [],
  "risks": [],
  "sources": [],
  "unverified": []
}
```

## Copy Rules

- Convert facts into buying judgments, not article summaries.
- Write visible card copy as a standalone social post. Readers should not need to know there was an article, source note, prompt, markdown file, or production process behind the deck.
- Do not use source-frame wording on cards, such as `文章里`, `原文`, `资料显示`, `素材指出`, `用户提供`, `根据链接`, or `我们查到`. Translate those into reader-facing claims: `强风场景要配毛套`, `先看成交价`, `高密射频环境更适合上阶方案`.
- Preserve the hardest evidence layer. If the source contains a table, measured numbers, benchmark scores, rating counts, variant specs, or competitor distances/weights/noise figures, extract them into `quantified_evidence` before writing copy.
- Visible cards should carry 2-4 of the most decision-relevant verified numbers when the source has strong quantitative evidence. Each number must be paired with a buying meaning, not printed as a loose spec.
- If a high-density table or number is not used on the card surface, record why in `deck-data.json.unused_quantified_evidence` or `unverified`; valid reasons include unstable price, source conflict, unverifiable claim, too minor for the buying decision, or page budget pressure after stronger evidence is retained.
- Keep each page to one claim.
- Use clear action language such as "建议买 / 建议等 / 不建议" or "适合 / 不适合 / 等等党"; avoid bare "买 / 等 / 跳" labels when they sound cryptic.
- Prefer concrete tradeoffs over adjectives: "换来一键柔焦，失去/弱化某项能力" is better than "更有氛围".
- Use `unverified` fields instead of invented detail.
- Keep China-market price and availability primary in the data model. Overseas prices are fallback only and must be labeled with market/source in `deck-data.json` or `assets/SOURCES.md`.
- Do not print disclaimer wording, unverified hard prices, or overseas fallback hard prices in HTML. Convert unresolved prices into buying actions such as "先等价格稳定", "等首发价回落", or "看成交价再判断".
- Market-basis labels such as "中国大陆", "国行", or "海外" should not appear as disclaimer labels. They may remain only when they are necessary product/version context.
- Only verified mainland China prices may appear on the card image, and they should appear as direct price facts without "以官方为准" or similar disclaimer labels.

## Page Copy Must Not

- Invent sample effects not shown by evidence.
- Invent prices, discounts, availability, review scores, official statements, or rankings.
- Drop source tables or measured numbers into vague wording when those numbers are central to the buying decision.
- Convert overseas prices into RMB and present them as domestic selling prices.
- Print `待核实`, `以官方为准`, overseas fallback price labels, or market-basis disclaimer labels on the card image.
- Print a hard price on the card when it is unverified or based only on overseas fallback data.
- Mention the production/source frame in visible copy, such as "文章里的关键判断", "资料显示", "用户提供的素材", or "来源说". Put provenance in `deck-data.json` / `assets/SOURCES.md`; card text should stand alone for social publishing.
- Turn a nuanced review into universal "闭眼买".
- Hide limitations in small footnotes when they affect the decision.

## Example: Ricoh GR4 HDF

```json
{
  "product": "理光 GR4 HDF",
  "variants": ["GR4 标准版", "GR4 HDF"],
  "core_question": "万元值不值？",
  "core_claim": "HDF 买的是一键柔化高光和直出氛围，不是基础画质提升。",
  "market_basis": "中国大陆 / RMB 优先；若无国内价格，海外价格仅作参考",
  "effect_change": "高光更柔，反差更低，画面更有雾化/胶片感。",
  "buy_if": ["喜欢街拍直出", "常拍人像/逆光/夜景", "不想外接柔焦滤镜"],
  "wait_if": ["首发价格偏高", "还没有足够同场景样张"],
  "skip_if": ["追求锐度", "需要更强可控性", "已有外置滤镜方案"],
  "unverified": ["当前国内到手价", "正式发售信息", "标准版与 HDF 版完整规格差异"]
}
```
