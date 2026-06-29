#!/usr/bin/env node
import { readFileSync, existsSync, statSync, readdirSync } from "node:fs";
import path from "node:path";
import { chromeExecutablePath, loadChromium } from "./playwright-loader.mjs";

const args = process.argv.slice(2);
const textOnly = args.includes("--text-only");
const failOnWarn = args.includes("--fail-on-warn") || args.includes("--strict-warnings");
const allowRenderSkip = args.includes("--allow-render-skip");
const pagesArgIndex = args.findIndex(arg => arg === "--pages");
const pagesArg = pagesArgIndex >= 0 ? args[pagesArgIndex + 1] : args.find(arg => arg.startsWith("--pages="))?.slice("--pages=".length);
const selectedPageTokens = new Set((pagesArg || "")
  .split(",")
  .map(value => value.trim())
  .filter(Boolean));
const ignoredArgIndexes = new Set();
if (pagesArgIndex >= 0) {
  ignoredArgIndexes.add(pagesArgIndex);
  if (args[pagesArgIndex + 1]) ignoredArgIndexes.add(pagesArgIndex + 1);
}
const taskDir = args.find((arg, index) => !ignoredArgIndexes.has(index) && !arg.startsWith("-"));
if (!taskDir) {
  console.error("Usage: validate-review-deck.mjs <task-dir|index.html> [--text-only] [--pages 1,3,7] [--fail-on-warn] [--allow-render-skip]");
  process.exit(1);
}

const target = path.resolve(taskDir);
const root = statSync(target).isDirectory() ? target : path.dirname(target);
const htmlPath = statSync(target).isDirectory() ? path.join(root, "index.html") : target;
const dataPath = path.join(root, "deck-data.json");
let fail = 0;
let warn = 0;

function FAIL(message) {
  fail += 1;
  console.error(`FAIL ${message}`);
}

function WARN(message) {
  warn += 1;
  console.warn(`WARN ${message}`);
}

function PASS(message) {
  console.log(`PASS ${message}`);
}

if (!existsSync(htmlPath)) FAIL("index.html is missing.");
if (!existsSync(dataPath)) FAIL("deck-data.json is missing.");

let html = "";
let data = {};

if (existsSync(htmlPath)) html = readFileSync(htmlPath, "utf8");
if (existsSync(dataPath)) {
  try {
    data = JSON.parse(readFileSync(dataPath, "utf8"));
  } catch (error) {
    FAIL(`deck-data.json is invalid JSON: ${error.message}`);
  }
}

const style = html.match(/<html[^>]*data-style=["']([^"']+)["']/)?.[1];
const palette = html.match(/<html[^>]*data-palette=["']([^"']+)["']/)?.[1];
const allowedStyles = new Set(["swiss-guide", "geek-bench", "warm-review", "bauhaus-bright", "digital-pop", "blue-stack", "seasonal-editorial"]);

if (!style) FAIL("html data-style is missing.");
else if (!allowedStyles.has(style)) FAIL(`unknown data-style: ${style}`);
else PASS(`style route: ${style}`);

if (!palette) FAIL("html data-palette is missing.");
else PASS(`palette: ${palette}`);

const allowedPalettesByStyle = {
  "swiss-guide": new Set(["smzdm-red", "ikb-blue", "lemon-yellow", "vivid-green", "safety-orange"]),
  "geek-bench": new Set(["electric-blue", "aurora-cyan", "terminal-green"]),
  "warm-review": new Set(["kelvin-glow", "cream-orange", "indigo-paper", "forest-paper"]),
  "bauhaus-bright": new Set(["classic"]),
  "digital-pop": new Set(["violet-lime", "lime-blue", "violet-pink"]),
  "blue-stack": new Set(["blue-core"]),
  "seasonal-editorial": new Set(["coral-cream", "approach-red"]),
};
if (style && palette && allowedPalettesByStyle[style] && !allowedPalettesByStyle[style].has(palette)) {
  FAIL(`palette '${palette}' is not a named ${style} palette.`);
}

if (data.style_route && style && data.style_route !== style) {
  FAIL(`deck-data style_route (${data.style_route}) does not match html data-style (${style}).`);
}
if (data.palette && palette && data.palette !== palette) {
  FAIL(`deck-data palette (${data.palette}) does not match html data-palette (${palette}).`);
}

const allPosterMatches = [...html.matchAll(/<section\b[^>]*class=["'][^"']*\bposter\b[^"']*["'][^>]*>/g)];
const templatePreviewMatches = allPosterMatches.filter(match => /\btemplate-preview\b/.test(match[0]));
const realPosterMatches = allPosterMatches.filter(match => !/\btemplate-preview\b/.test(match[0]));
const posterMatches = realPosterMatches.length ? realPosterMatches : templatePreviewMatches;
if (templatePreviewMatches.length && realPosterMatches.length) {
  FAIL("template preview poster is still present beside generated posters; remove .template-preview after replacing <!-- POSTERS_HERE -->.");
}
if (!posterMatches.length) FAIL("no .poster sections found.");
else PASS(`${posterMatches.length} poster sections found.`);
if (posterMatches.length > 7 && !data.allow_extra_posters) {
  FAIL(`${posterMatches.length} poster sections found; default review decks should have at most 7 posters unless deck-data.allow_extra_posters is true.`);
}

const pageTypes = posterMatches.map(match => match[0].match(/data-page-type=["']([^"']+)["']/)?.[1]).filter(Boolean);
const required = ["cover-verdict", "evidence-sample", "variant-comparison", "audience-fit", "spec-price-ledger", "final-verdict"];
const requiredOneOf = ["before-after-effect", "mechanism-explainer", "mechanism-tradeoff"];
const omitted = new Set(data.omitted_page_types || []);
const copyBudgets = {
  "cover-verdict": 180,
  "evidence-sample": 260,
  "before-after-effect": 300,
  "variant-comparison": 360,
  "audience-fit": 380,
  "spec-price-ledger": 420,
  "final-verdict": 360,
  "mechanism-explainer": 300,
  "mechanism-tradeoff": 340,
};
const classCopyBudgets = {
  "h-xl": 30,
  "h-md": 36,
  "lead": 58,
  "body": 90,
  "bento-copy": 54,
  "image-caption": 42,
  "punch-strip": 42,
  "zoom-cell": 34,
};

function visibleCopyLength(fragment) {
  return fragment
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, "")
    .trim()
    .length;
}

for (const type of required) {
  if (!pageTypes.includes(type) && !omitted.has(type)) {
    WARN(`page type missing and not explicitly omitted: ${type}`);
  }
}
if (!requiredOneOf.some(type => pageTypes.includes(type)) && !requiredOneOf.every(type => omitted.has(type))) {
  WARN(`page type group missing and not explicitly omitted: one of ${requiredOneOf.join(" / ")}`);
}

const sectionStyleLeaks = [...html.matchAll(/<section\b[^>]*data-style=["']([^"']+)["']/g)].map(m => m[1]);
const leakedStyles = [...new Set(sectionStyleLeaks.filter(s => s !== style))];
if (leakedStyles.length) FAIL(`poster-level data-style leaks found: ${leakedStyles.join(", ")}`);
else PASS("no mixed poster-level style routes.");

const sectionPalettes = posterMatches
  .map(match => match[0].match(/data-palette=["']([^"']+)["']/)?.[1])
  .filter(Boolean);
const leakedPalettes = [...new Set(sectionPalettes.filter(p => p !== palette))];
const uniqueSectionPalettes = [...new Set(sectionPalettes)];
if (leakedPalettes.length) {
  FAIL(`poster-level data-palette leaks found: ${leakedPalettes.join(", ")}`);
} else if (uniqueSectionPalettes.length > 1) {
  FAIL(`multiple poster-level palettes found in one deck: ${uniqueSectionPalettes.join(", ")}`);
} else {
  PASS("no mixed poster-level palettes.");
}

const dangerousInlineStyles = [];
for (const section of html.matchAll(/<section\b[^>]*class=["'][^"']*\bposter\b[^"']*["'][\s\S]*?<\/section>/gi)) {
  const sectionHtml = section[0];
  const type = sectionHtml.match(/data-page-type=["']([^"']+)["']/)?.[1] || "unknown-page";
  for (const styleAttr of sectionHtml.matchAll(/\sstyle\s*=\s*["']([^"']+)["']/gi)) {
    const value = styleAttr[1];
    if (/(?:^|;)\s*(?:margin|padding|border|position|top|right|bottom|left|height|min-height|max-height|font-size|line-height)\s*:/i.test(value)) {
      dangerousInlineStyles.push(`${type}: ${value.slice(0, 120)}`);
    }
  }
}
if (dangerousInlineStyles.length) {
  FAIL(`inline layout patch styles found inside posters; adapt content to template components instead of inventing per-page layout rules: ${dangerousInlineStyles.slice(0, 6).join(" | ")}${dangerousInlineStyles.length > 6 ? " ..." : ""}`);
} else {
  PASS("no dangerous inline layout patch styles inside posters.");
}

const threeColumnStripRadiusViolations = [];
let hasThreeColumnStripChildBorderLeft = false;
let hasThreeColumnStripRule = false;
let hasRoundedThreeColumnStrip = false;
for (const rule of html.matchAll(/([^{}]*?(?:risk-strip|issue-strip):has\(\s*>\s*:nth-child\(3\)\):not\(:has\(\s*>\s*:nth-child\(4\)\)\)[^{}]*?)\{([\s\S]*?)\}/g)) {
  hasThreeColumnStripRule = true;
  const selector = rule[1].replace(/\s+/g, " ").trim();
  const body = rule[2];
  const radiusValues = [...body.matchAll(/border-radius\s*:\s*([^;}\n]+)/g)].map(match => match[1].trim());
  const nonSquareRadius = radiusValues.find(value => !/^0(?:px|rem|em|%)?$/i.test(value));
  if (nonSquareRadius) hasRoundedThreeColumnStrip = true;
  if (nonSquareRadius) threeColumnStripRadiusViolations.push(`${selector}: border-radius ${nonSquareRadius}`);
  if (selector.includes("> * + *") && /border-left\s*:\s*1px/i.test(body)) {
    hasThreeColumnStripChildBorderLeft = true;
  }
}
if (style === "swiss-guide") {
  const hasInsetThreeColumnDivider =
    /(?:risk-strip|issue-strip):has\(\s*>\s*:nth-child\(3\)\):not\(:has\(\s*>\s*:nth-child\(4\)\)\)::before[\s\S]*?top\s*:\s*24px[\s\S]*?bottom\s*:\s*24px/s.test(html) ||
    /(?:risk-strip|issue-strip):has\(\s*>\s*:nth-child\(3\)\):not\(:has\(\s*>\s*:nth-child\(4\)\)\)::after[\s\S]*?top\s*:\s*24px[\s\S]*?bottom\s*:\s*24px/s.test(html);
  if (!hasInsetThreeColumnDivider) {
    FAIL("swiss-guide three-column issue/risk bands must use inset parent-level dividers with top/bottom breathing room, matching .solid-band.");
  } else if (hasThreeColumnStripRule && !hasRoundedThreeColumnStrip) {
    FAIL("swiss-guide three-column issue/risk bands must use the rounded solid-band geometry; set border-radius to var(--radius-media), not 0.");
  } else if (hasThreeColumnStripChildBorderLeft) {
    FAIL("swiss-guide three-column issue/risk bands must not use full-height child border-left dividers; use inset parent pseudo-elements.");
  } else {
    PASS("swiss-guide three-column issue/risk bands use rounded solid-band geometry with inset dividers.");
  }
} else if (threeColumnStripRadiusViolations.length) {
  FAIL(`three-column issue/risk T-junction modules must stay square-cornered in every route: ${threeColumnStripRadiusViolations.slice(0, 4).join(" | ")}`);
} else {
  PASS("three-column issue/risk T-junction modules are square-cornered.");
}

if (style === "bauhaus-bright") {
  const threeColumnChildRule = /\.risk-strip:has\(\s*>\s*:nth-child\(3\)\):not\(:has\(\s*>\s*:nth-child\(4\)\)\)\s*>\s*\*/s;
  const clearsThreeColumnTopBorder = threeColumnChildRule.test(html) && /border-top\s*:\s*0\b/.test(html);
  if (/\.risk\s*\+\s*\.risk\s*\{[\s\S]*?border-top\s*:/s.test(html) && !clearsThreeColumnTopBorder) {
    FAIL("bauhaus three-column .risk-strip must clear stacked-list separators: add border-top:0 to the three-column child rule so columns 2/3 do not get extra top rules.");
  }
}

for (const section of html.matchAll(/<section\b[^>]*class=["'][^"']*\bposter\b[^"']*["'][\s\S]*?<\/section>/gi)) {
  const sectionHtml = section[0];
  const type = sectionHtml.match(/data-page-type=["']([^"']+)["']/)?.[1] || "unknown-page";
  const budget = copyBudgets[type];
  if (!budget) continue;
  const text = visibleCopyLength(sectionHtml);
  if (text > budget) {
    FAIL(`${type}: visible copy length is ${text} chars, over the ${budget}-char page budget. Shorten, split, move out, or switch page type.`);
  }
}

for (const [className, budget] of Object.entries(classCopyBudgets)) {
  const pattern = new RegExp(`<([a-z][\\w:-]*)\\b(?=[^>]*\\bclass=["'][^"']*\\b${className}\\b[^"']*["'])[^>]*>([\\s\\S]*?)<\\/\\1>`, "gi");
  for (const match of html.matchAll(pattern)) {
    const length = visibleCopyLength(match[2]);
    if (length > budget) {
      FAIL(`.${className}: visible copy length is ${length} chars, over the ${budget}-char component budget. Shorten the copy before rendering.`);
    }
  }
}

const visibleText = html
  .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
  .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
  .replace(/<!--[\s\S]*?-->/g, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ")
  .trim();
const hardForbiddenSurfaceTerms = [
  "fallback",
  "待核实",
  "以官方为准",
  "官方为准",
  "以页面为准",
  "仅作参考",
  "文章里",
  "原文",
  "资料显示",
  "素材指出",
  "用户提供",
  "根据链接",
  "我们查到",
];
const hardForbiddenSurfacePatterns = [
  /以[^，。；、\s]{0,16}为准/g,
  /(?:待|未)(?:核实|确认|验证)/g,
  /仅(?:供|作)参考/g,
  /(?:文章|原文|资料|素材|来源)(?:里|中)?(?:提到|显示|指出|写到|写明|说明|给出)/g,
  /中文(?:零售)?页(?:可见|常见|显示|标注|写明)?/g,
  /(?:官方)?(?:海外|境外)(?:页|页面|官网|版本)(?:可见|常见|显示|标注|写明)?/g,
  /零售页(?:可见|常见|显示|标注|写明)?/g,
];
const softMarketSurfaceTerms = [
  "中国大陆",
  "大陆",
  "国行",
  "国内价",
  "海外",
  "美国",
  "B&H",
];
const forbiddenHits = hardForbiddenSurfaceTerms.filter(term => visibleText.includes(term));
for (const pattern of hardForbiddenSurfacePatterns) {
  const matches = visibleText.match(pattern) || [];
  forbiddenHits.push(...matches);
}
if (forbiddenHits.length) {
  FAIL(`visible card text contains disclaimer/unverified/source-note wording that belongs in deck-data/SOURCES only: ${[...new Set(forbiddenHits)].join(", ")}`);
} else {
  PASS("visible card text has no hard-blocked disclaimer wording.");
}
const softMarketHits = softMarketSurfaceTerms.filter(term => visibleText.includes(term));
if (softMarketHits.length) {
  WARN(`visible card text contains possible market-basis wording; check context and move disclaimers to deck-data/SOURCES if needed: ${softMarketHits.join(", ")}`);
} else {
  PASS("visible card text has no market-basis wording.");
}

const svgFindings = [];
if (/<svg\b/i.test(html)) svgFindings.push("inline <svg>");
if (/data:image\/svg\+xml/i.test(html)) svgFindings.push("data:image/svg+xml");
const svgAssetMatches = [
  ...html.matchAll(/\b(?:src|href|xlink:href)\s*=\s*["']([^"']*\.svg(?:[?#][^"']*)?)["']/gi),
  ...html.matchAll(/url\(\s*["']?([^"')]+\.svg(?:[?#][^"')]+)?)["']?\s*\)/gi),
].map(match => match[1]);
for (const asset of svgAssetMatches) svgFindings.push(asset);
const dataSvgMatches = JSON.stringify(data).match(/[^"'\s,{}[\]]+\.svg(?:[?#][^"'\s,{}[\]]*)?/gi) || [];
for (const asset of dataSvgMatches) svgFindings.push(`deck-data:${asset}`);
if (svgFindings.length) {
  FAIL(`SVG assets are not allowed in review decks; use PNG/JPG/WebP raster evidence instead: ${[...new Set(svgFindings)].join(", ")}`);
} else {
  PASS("no SVG assets or inline SVG found.");
}

if (pageTypes.includes("before-after-effect")) {
  const relationships = data.evidence_relationships || {};
  const beforeAfter = relationships["before-after-effect"] || relationships.before_after_effect;
  if (!beforeAfter) {
    FAIL("before-after-effect is present but deck-data.json does not declare evidence_relationships.before-after-effect.");
  } else if (beforeAfter !== "same-scene-ab") {
    FAIL(`before-after-effect evidence relationship is '${beforeAfter}', not 'same-scene-ab'. Do not present it as real A/B.`);
  } else {
    PASS("before-after evidence relationship declared as same-scene-ab.");
  }
}

const assetUsage = data.asset_usage || [];
const placedImgSrcs = [...html.matchAll(/<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi)]
  .map(match => match[1])
  .filter(Boolean);
const cssRasterAssets = [...html.matchAll(/url\(\s*["']?([^"')]+\.(?:png|jpe?g|webp)(?:[?#][^"')]+)?)["']?\s*\)/gi)]
  .map(match => match[1])
  .filter(Boolean);
const hasRasterAssets = placedImgSrcs.length > 0 || cssRasterAssets.length > 0;

const sectionImageUses = [];
for (const section of html.matchAll(/<section\b[^>]*class=["'][^"']*\bposter\b[^"']*["'][\s\S]*?<\/section>/gi)) {
  const sectionHtml = section[0];
  if (/\btemplate-preview\b/.test(sectionHtml.match(/<section\b[^>]*>/)?.[0] || "")) continue;
  const type = sectionHtml.match(/data-page-type=["']([^"']+)["']/)?.[1] || "unknown-page";
  for (const img of sectionHtml.matchAll(/<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi)) {
    sectionImageUses.push({ src: img[1], type });
  }
}
const repeatedSectionImages = new Map();
for (const item of sectionImageUses) {
  const list = repeatedSectionImages.get(item.src) || [];
  list.push(item.type);
  repeatedSectionImages.set(item.src, list);
}
const allowedRepeatedAssets = data.allowed_repeated_assets || [];
for (const [src, types] of repeatedSectionImages.entries()) {
  if (types.length > 1 && !allowedRepeatedAssets.includes(src)) {
    const uniqueTypes = [...new Set(types)];
    const location = uniqueTypes.length > 1 ? `pages ${uniqueTypes.join(", ")}` : `${uniqueTypes[0]} (${types.length} placements)`;
    FAIL(`same image asset is reused in the deck (${src}: ${location}). Use distinct assets, documented crop/detail files, or convert one placement to a ledger; only user-requested repetition may be listed in deck-data.allowed_repeated_assets.`);
  }
}

const assetsDir = path.join(root, "assets");
let availableRasterAssetCount = 0;
if (existsSync(assetsDir)) {
  const walk = dir => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith(".")) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(?:png|jpe?g|webp)$/i.test(entry.name)) availableRasterAssetCount += 1;
    }
  };
  walk(assetsDir);
}
if (availableRasterAssetCount > 0 && !hasRasterAssets && !data.no_image_reason) {
  FAIL(`assets/ contains ${availableRasterAssetCount} raster image(s), but the deck places no images. Use credible images when available, or set deck-data.no_image_reason.`);
}

if (Array.isArray(assetUsage) && assetUsage.length) {
  const mainUses = new Map();
  for (const item of assetUsage) {
    const sourceType = String(item?.source_type || item?.source || item?.provenance || item?.role || "").toLowerCase();
    if (/\b(?:generated|synthetic|ai|illustration|placeholder|drawn|mock)\b/.test(sourceType)) {
      FAIL(`asset_usage marks non-evidence imagery as an asset (${item.src || item.file || "unknown asset"}: ${sourceType}). Use user/source/official/public images, or make a no-image card.`);
    }
    if (!item || item.role !== "main" || !item.file) continue;
    const list = mainUses.get(item.file) || [];
    list.push(item.page_type || item.page || "unknown-page");
    mainUses.set(item.file, list);
  }
  for (const [file, pages] of mainUses.entries()) {
    if (pages.length > 1) {
      FAIL(`asset reused as main visual on multiple pages: ${file} (${pages.join(", ")}).`);
    }
  }
  PASS("asset_usage checked.");
} else {
  if (hasRasterAssets) {
    WARN("deck-data.json does not include asset_usage; repeated main-image use was not mechanically checked.");
  } else {
    PASS("no placed image assets; asset_usage not required.");
  }
}

if (!/width\s*:\s*1080px/.test(html) || !/height\s*:\s*1440px/.test(html)) {
  WARN("template does not declare 1080px x 1440px poster dimensions in CSS.");
} else {
  PASS("1080x1440 poster dimensions declared in CSS.");
}

if (!data.sources && !existsSync(path.join(root, "assets", "SOURCES.md"))) {
  WARN("no sources list found. This is okay only when all content is user-provided or placeholder.");
}

if (style === "swiss-guide") {
  const requiredFonts = ["Aeonik-Regular.woff2", "Aeonik-Medium.woff2", "AeonikFono-Regular.woff2"];
  const missingFonts = requiredFonts.filter(file => !existsSync(path.join(root, "assets", "fonts", file)));
  if (missingFonts.length) {
    FAIL(`swiss-guide font assets missing from assets/fonts/: ${missingFonts.join(", ")}. Copy them from the skill seed so file previews use the intended numeric/mono typography.`);
  } else {
    PASS("swiss-guide local font assets found.");
  }
}

if (style === "geek-bench") {
  if (!/height\s*:\s*58%/.test(html) || !/background-size\s*:\s*12px\s+12px/.test(html)) {
    WARN("geek-bench should keep the smzdm-template-preview particle ratio: bottom 58% field, 12px dot grid.");
  } else {
    PASS("geek particle ratio declared.");
  }
  if (!/--gem1/.test(html) || !/--gem2/.test(html) || !/--gem3/.test(html)) {
    WARN("geek-bench should declare --gem1/--gem2/--gem3 particle glow colors.");
  }
  if (/#[Ff][Aa]0[Ff]00|#[Ee]60012|smzdm-red/.test(html)) {
    WARN("geek-bench should not use SMZDM red; use --data accent and --warn only for caution.");
  }
  if (!/data-palette=["'](?:electric-blue|aurora-cyan|terminal-green)["']/.test(html)) {
    WARN("geek-bench should use a named palette: electric-blue, aurora-cyan, or terminal-green.");
  }
}

if (style === "digital-pop") {
  if (!/data-palette=["'](?:violet-lime|lime-blue|violet-pink)["']/.test(html)) {
    WARN("digital-pop should use a named palette: violet-lime, lime-blue, or violet-pink.");
  }
  if (!/border-radius\s*:\s*(?:3[6-9]|[4-9]\d|999)px/.test(html)) {
    WARN("digital-pop should keep large rounded card/media geometry.");
  }
  if (!/#[0-9A-Fa-f]{6}/.test(html) || !/(?:#6C3BFF|#9BFF57|#1598E8|#DFFF3A|#6C4CFF|#F5B9E6)/i.test(html)) {
    WARN("digital-pop should declare a high-saturation paired color system.");
  }
  if (!/\b(?:decision-button|benefit-row|media-stack|mono-pill)\b/.test(html)) {
    WARN("digital-pop should use at least one route-owned device: decision-button, benefit-row, media-stack, or mono-pill.");
  }
}

if (style === "blue-stack") {
  if (!existsSync(path.join(root, "assets", "icon", "icons.js"))) {
    FAIL("blue-stack requires assets/icon/icons.js in the task folder so icon tiles render consistently.");
  } else {
    PASS("blue-stack icon library found.");
  }
  if (!/data-palette=["']blue-core["']/.test(html)) {
    WARN("blue-stack should use the fixed blue-core palette.");
  }
  if (!/#2f8cff/i.test(html)) {
    WARN("blue-stack should declare the core blue accent (#2f8cff).");
  }
  if (!/--dot-rule\s*:\s*rgba\(124\s*,\s*133\s*,\s*147\s*,\s*\.56\)/.test(html) || !/--dot-rule-strong\s*:\s*rgba\(124\s*,\s*133\s*,\s*147\s*,\s*\.68\)/.test(html)) {
    WARN("blue-stack should use the shared neutral grey-blue dotted-rule tokens.");
  }
  if (!/--dash\s*:\s*2px/.test(html) || !/--dash-gap\s*:\s*8px/.test(html) || !/--dash-v-gap\s*:\s*10px/.test(html)) {
    WARN("blue-stack dotted separators should use 2px dots, 8px horizontal gaps, and 10px vertical gaps.");
  }
  if (!/repeating-linear-gradient\(\s*(?:90deg|180deg|to bottom)/.test(html)) {
    WARN("blue-stack should implement dotted platform separators with shared CSS gradients.");
  }
  if (/\bborder(?:-[a-z-]+)?\s*:[^;{}]*\bdotted\b/i.test(html) || /\bborder-style\s*:\s*dotted\b/i.test(html)) {
    WARN("blue-stack should avoid browser-default dotted borders; use shared CSS gradient dot rules instead.");
  }
  if (!/\b(?:stack-topbar|glow-title|inline-icon|feature-row|stack-card|step-row|wide-cta|metric-grid|verdict-panel)\b/.test(html)) {
    WARN("blue-stack should use at least one route-owned device: topbar, glow title, blue icon tiles, dotted feature rows, dark Blue Stack cards, steps, metrics, or verdict panel.");
  }
}

if (style === "seasonal-editorial") {
  if (!/data-palette=["'](?:coral-cream|approach-red)["']/.test(html)) {
    WARN("seasonal-editorial should use a named palette: coral-cream or approach-red.");
  }
  const hasCoralCream = /data-palette=["']coral-cream["']/.test(html) && /#ff3638/i.test(html) && /#dedcd2/i.test(html);
  const hasApproachRed = /data-palette=["']approach-red["']/.test(html) && /#fe3939/i.test(html) && /#0a0605/i.test(html) && /#f8f5e7/i.test(html);
  if (!hasCoralCream && !hasApproachRed) {
    WARN("seasonal-editorial should declare the selected palette's alternating surface colors.");
  }
  if (!/\btone-coral\b/.test(html) || !/\btone-cream\b/.test(html)) {
    WARN("seasonal-editorial decks should alternate tone-coral and tone-cream page surfaces.");
  }
  if (!/\b(?:photo-stack|photo-card|seasonal-frame|glass-panel|topbar)\b/.test(html)) {
    WARN("seasonal-editorial should use at least one route-owned device: photo-stack, photo-card, seasonal-frame, glass-panel, or topbar.");
  }
}

async function runRenderedChecks() {
  try {
    var chromium = await loadChromium();
  } catch (error) {
    const message = `rendered validation cannot run because Playwright is unavailable. ${error.message}`;
    if (allowRenderSkip) WARN(`${message} Output is QA-incomplete.`);
    else FAIL(`${message} Install Playwright or pass --allow-render-skip only for drafts.`);
    return;
  }

  let browser;
  const launchOptions = {
    args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
  };
  try {
    browser = await chromium.launch(launchOptions);
  } catch (error) {
    const chromePath = chromeExecutablePath();
    if (!chromePath) {
      const message = `rendered validation cannot run because no Playwright browser is installed and Google Chrome was not found (${error.message}).`;
      if (allowRenderSkip) WARN(`${message} Output is QA-incomplete.`);
      else FAIL(`${message} Install a Playwright browser, install Google Chrome, or pass --allow-render-skip only for drafts.`);
      return;
    }
    browser = await chromium.launch({
      ...launchOptions,
      executablePath: chromePath,
    });
  }
  const ctx = await browser.newContext({
    viewport: { width: 1400, height: 1700 },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  await page.goto("file://" + htmlPath, { waitUntil: "load" });
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
    await Promise.all([...document.images].map(img => img.complete ? null : new Promise(resolve => {
      img.addEventListener("load", resolve, { once: true });
      img.addEventListener("error", resolve, { once: true });
    })));
  });
  await page.waitForTimeout(120);

  const rendered = await page.$$eval("section.poster", (sections, options) => {
    const { budgets, selectedPageTokens } = options;
    const { copyBudgets, classCopyBudgets } = budgets;
    const pageFilter = new Set(selectedPageTokens || []);
    function compactText(node) {
      return node.textContent.trim().replace(/\s+/g, "");
    }

    function directText(node) {
      for (const child of node.childNodes) {
        if (child.nodeType === 3 && child.textContent.trim()) return true;
      }
      return false;
    }

    function parseCssColor(value) {
      const match = String(value || "").match(/rgba?\(([^)]+)\)/i);
      if (!match) return null;
      const parts = match[1].split(/,\s*/).map(part => part.trim());
      const channels = parts.slice(0, 3).map(part => {
        if (part.endsWith("%")) return Math.round(Number.parseFloat(part) * 2.55);
        return Number.parseFloat(part);
      });
      if (channels.some(channel => !Number.isFinite(channel))) return null;
      const alpha = parts[3] == null ? 1 : Number.parseFloat(parts[3]);
      return { r: channels[0], g: channels[1], b: channels[2], a: Number.isFinite(alpha) ? alpha : 1 };
    }

    function blendColor(fg, bg) {
      const alpha = Math.max(0, Math.min(1, fg.a ?? 1));
      return {
        r: fg.r * alpha + bg.r * (1 - alpha),
        g: fg.g * alpha + bg.g * (1 - alpha),
        b: fg.b * alpha + bg.b * (1 - alpha),
        a: 1,
      };
    }

    function relativeLuminance(color) {
      const channel = value => {
        const c = Math.max(0, Math.min(255, value)) / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * channel(color.r) + 0.7152 * channel(color.g) + 0.0722 * channel(color.b);
    }

    function contrastRatio(a, b) {
      const l1 = relativeLuminance(a);
      const l2 = relativeLuminance(b);
      const light = Math.max(l1, l2);
      const dark = Math.min(l1, l2);
      return (light + 0.05) / (dark + 0.05);
    }

    function effectiveBackgroundColor(node, poster) {
      let current = node;
      const layers = [];
      while (current && current.nodeType === 1) {
        const cs = getComputedStyle(current);
        const color = parseCssColor(cs.backgroundColor);
        if (color && color.a > 0) {
          layers.push(color);
          if (color.a >= 0.98) break;
        }
        if (current === poster) break;
        current = current.parentElement;
      }
      let bg = { r: 255, g: 255, b: 255, a: 1 };
      for (const layer of layers.reverse()) {
        bg = blendColor(layer, bg);
      }
      return bg;
    }

    function chineseSingleCharWidows(root) {
      const findings = [];
      const isCjk = value => /[\u3400-\u9fff]/.test(value);
      const stripTrailingPunctuation = value => value.trim().replace(/[，。！？；：、,.!?;:]$/u, "");
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let textNode;
      while ((textNode = walker.nextNode())) {
        const fullText = textNode.nodeValue.trim();
        const parent = textNode.parentElement;
        if (!fullText || !parent || parent.closest(".foot, .magazine-foot")) continue;
        if (stripTrailingPunctuation(fullText.replace(/\s+/g, "")).length <= 1) continue;

        const chars = [];
        for (let i = 0; i < textNode.nodeValue.length; i += 1) {
          const ch = textNode.nodeValue[i];
          if (/\s/.test(ch)) continue;
          const range = document.createRange();
          range.setStart(textNode, i);
          range.setEnd(textNode, i + 1);
          const rects = [...range.getClientRects()];
          range.detach();
          if (!rects.length) continue;
          const r = rects[0];
          chars.push({ ch, top: Math.round(r.top), left: r.left });
        }
        if (!chars.length) continue;
        const groups = [];
        for (const char of chars) {
          let group = groups.find(item => Math.abs(item.top - char.top) <= 2);
          if (!group) {
            group = { top: char.top, chars: [] };
            groups.push(group);
          }
          group.chars.push(char);
        }
        const lines = groups
          .sort((a, b) => a.top - b.top)
          .map(group => group.chars.sort((a, b) => a.left - b.left).map(char => char.ch).join("").trim())
          .filter(Boolean);
        if (!lines.length) continue;
        const lastLine = lines[lines.length - 1];
        const withoutPunctuation = stripTrailingPunctuation(lastLine);
        if (withoutPunctuation.length === 1 && isCjk(withoutPunctuation)) {
          const cls = String(parent.className || parent.tagName || "").split(/\s+/).slice(0, 2).join(".");
          findings.push(`${parent.tagName}.${cls} last line "${lastLine}" in "${fullText.replace(/\s+/g, " ").slice(0, 64)}"`);
        }
      }
      return findings;
    }

    function metricForSection(el, originalIndex) {
      const rect = el.getBoundingClientRect();
      const H = Math.round(el.clientHeight);
      const rows = new Uint8Array(H);
      const deckStyle = document.documentElement.dataset.style || "";
      const foot = el.querySelector(".foot, .magazine-foot");
      const footRect = foot?.getBoundingClientRect();
      const footTop = footRect ? footRect.top - rect.top : null;
      const footBottom = footRect ? footRect.bottom - rect.top : null;
      const footPosition = foot ? getComputedStyle(foot).position : null;
      const mark = (top, bottom) => {
        const t = Math.max(0, Math.floor(top));
        const b = Math.min(H, Math.ceil(bottom));
        for (let y = t; y < b; y += 1) rows[y] = 1;
      };

      const boxes = [];
      let lastContentBottom = 0;
      for (const node of el.querySelectorAll("*")) {
        if (foot && (node === foot || foot.contains(node))) continue;
        const r = node.getBoundingClientRect();
        if (r.width < 8 || r.height < 4) continue;
        const cs = getComputedStyle(node);
        const tag = node.tagName;
        const isText = directText(node);
        const isMedia = tag === "IMG" || tag === "CANVAS" || tag === "SVG" || tag === "VIDEO";
        const hasBg = cs.backgroundImage !== "none"
          || (cs.backgroundColor && cs.backgroundColor !== "transparent" && !cs.backgroundColor.endsWith(", 0)"));
        const hasRule = parseFloat(cs.borderTopWidth) >= 1 || parseFloat(cs.borderBottomWidth) >= 1;
        if (!isText && !isMedia && !hasBg && !hasRule) continue;
        const top = r.top - rect.top;
        const bottom = r.bottom - rect.top;
        if (cs.position === "absolute" && r.width * r.height >= el.clientWidth * el.clientHeight * 0.9) continue;
        mark(top, bottom);
        lastContentBottom = Math.max(lastContentBottom, bottom);
        boxes.push({
          tag,
          cls: String(node.className || ""),
          top,
          bottom,
          height: r.height,
          width: r.width,
          text: node.textContent.trim().replace(/\s+/g, " ").slice(0, 80),
          isMedia,
        });
      }

      if (deckStyle === "geek-bench") {
        // Geek's bottom particle field is a deliberate atmosphere band, not an
        // accidental void. Count only the bottom quarter as justified occupancy;
        // the middle bands must still be carried by real content.
        mark(H * 0.75, H);
      }

      const bandHeight = H / 4;
      const occ = [0, 0, 0, 0].map((_, i) => {
        const top = Math.floor(i * bandHeight);
        const bottom = Math.floor((i + 1) * bandHeight);
        let count = 0;
        for (let y = top; y < bottom; y += 1) count += rows[y];
        return count / (bottom - top);
      });

      const type = el.dataset.pageType || "";
      const copyBudgetOverages = [];
      const typeBudget = copyBudgets[type];
      const typeLength = compactText(el).length;
      if (typeBudget && typeLength > typeBudget) {
        copyBudgetOverages.push(`${type}: visible copy length is ${typeLength} chars, over the ${typeBudget}-char page budget.`);
      }
      const componentBudgetOverages = [];
      for (const [className, budget] of Object.entries(classCopyBudgets)) {
        for (const node of el.querySelectorAll(`.${CSS.escape(className)}`)) {
          const length = compactText(node).length;
          if (length > budget) {
            componentBudgetOverages.push(`.${className}: visible copy length is ${length} chars, over the ${budget}-char component budget.`);
          }
        }
      }
      const imgBoxes = [...el.querySelectorAll("img")].map(img => {
        const r = img.getBoundingClientRect();
        return { height: r.height, width: r.width, area: r.width * r.height };
      });
      const count = selector => el.querySelectorAll(selector).length;
      const clippedText = [];
      const escapedBoxes = [];
      const edgeTouches = [];
      const textFitIssues = [];
      const componentEscapes = [];
      const componentSpacingIssues = [];
      const ruleCollisions = [];
      const contrastIssues = [];
      const chineseWidows = chineseSingleCharWidows(el);
      const textRole = node => {
        const cls = String(node.className || "");
        if (/(?:^|\s)(?:num|price|num-mega)(?:\s|$)/.test(cls)) return "numeric";
        if (/(?:^|\s)(?:label|tag|kicker|delta-chip)(?:\s|$)/.test(cls)) return "label";
        if (/(?:^|\s)(?:h-xl|h-md|lead|body|note|risk)(?:\s|$)/.test(cls)) return "copy";
        return "text";
      };
      const textFitAdvice = role => {
        if (role === "numeric") return "use a compact numeric component, shorten the value, or use the route-owned smaller numeric size";
        if (role === "label") return "shorten the label or move it to a wider component";
        if (role === "copy") return "rewrite shorter, split the sentence, or move detail to deck-data/SOURCES";
        return "rewrite shorter, allow wrapping, or choose a roomier registered component";
      };
      for (const node of el.querySelectorAll("*")) {
        if (foot && (node === foot || foot.contains(node))) continue;
        const r = node.getBoundingClientRect();
        if (r.width < 8 || r.height < 4) continue;
        const cs = getComputedStyle(node);
        const tag = node.tagName;
        const cls = String(node.className || "");
        const text = node.textContent.trim().replace(/\s+/g, " ").slice(0, 64);
        const isText = directText(node);
        const isMedia = tag === "IMG" || tag === "CANVAS" || tag === "SVG" || tag === "VIDEO";
        const isDecor = /(?:^|\s)(?:bg|decor|motif|particle-field|noise|texture|poster::before)(?:\s|$)/.test(cls);
        if (!isDecor && (r.top < rect.top - 1 || r.left < rect.left - 1 || r.right > rect.right + 1 || r.bottom > rect.bottom + 1)) {
          escapedBoxes.push(`${tag}.${cls.split(/\s+/).slice(0, 2).join(".")} "${text}"`);
        }
        const clipsOverflow = /^(?:hidden|clip|auto|scroll)$/.test(cs.overflowX) || /^(?:hidden|clip|auto|scroll)$/.test(cs.overflowY);
        if (isText && clipsOverflow && (node.scrollWidth - node.clientWidth > 2 || node.scrollHeight - node.clientHeight > 2)) {
          clippedText.push(`${tag}.${cls.split(/\s+/).slice(0, 2).join(".")} "${text}"`);
        }
        if (isText && text && !node.closest(".foot, .magazine-foot")) {
          const fgRaw = parseCssColor(cs.color);
          let bgRaw = effectiveBackgroundColor(node, el);
          if (
            deckStyle === "blue-stack"
            && el.classList.contains("hero-blue")
            && node.closest(".metric-grid")
          ) {
            // Blue Stack hero covers use an absolute gradient field behind the
            // content. The lower metric grid sits on the pale end of that field,
            // but computed parent background colors resolve to the poster's
            // black base. Treat this route-owned area as the pale field so the
            // contrast validator preserves the intended black metric text.
            bgRaw = { r: 238, g: 240, b: 243, a: 1 };
          }
          if (fgRaw && bgRaw) {
            const opacity = Number.parseFloat(cs.opacity);
            const fg = Number.isFinite(opacity) && opacity < 1 ? { ...fgRaw, a: (fgRaw.a ?? 1) * opacity } : fgRaw;
            const effectiveFg = fg.a != null && fg.a < 1 ? blendColor(fg, bgRaw) : fg;
            const ratio = contrastRatio(effectiveFg, bgRaw);
            const fgLum = relativeLuminance(effectiveFg);
            const bgLum = relativeLuminance(bgRaw);
            const lightTextOnLightSurface = fgLum > 0.58 && bgLum > 0.58 && ratio < 3;
            const nearlyInvisible = ratio < 1.5;
            if (lightTextOnLightSurface || nearlyInvisible) {
              const reason = lightTextOnLightSurface ? "light text on light surface" : "near-invisible contrast";
              contrastIssues.push(`${tag}.${cls.split(/\s+/).slice(0, 2).join(".")} "${text}" ${reason}, contrast ${ratio.toFixed(2)}:1`);
            }
          }
        }
        if (!isDecor && (isText || isMedia)) {
          const leftGap = r.left - rect.left;
          const rightGap = rect.right - r.right;
          const topGap = r.top - rect.top;
          const bottomGap = rect.bottom - r.bottom;
          if (leftGap < 36 || rightGap < 36 || topGap < 36 || bottomGap < 36) {
            edgeTouches.push(`${tag}.${cls.split(/\s+/).slice(0, 2).join(".")} "${text}"`);
          }
        }
      }
      const boundedSelector = [
        ".bauhaus-band",
        ".bento-cell",
        ".metric-box",
        ".decision-cell",
        ".compare-card",
        ".formula-step",
        ".bws-card",
        ".risk-strip",
        ".issue-strip",
        ".stamp",
        ".verdict-pill",
        ".image-well",
        ".object-frame",
        ".evidence-frame",
        ".image-module",
        ".sample-pair",
        ".zoom-cell",
        ".punch-strip",
        ".panel",
        ".glass",
      ].join(",");
      for (const box of el.querySelectorAll(boundedSelector)) {
        const br = box.getBoundingClientRect();
        const boxName = String(box.className || "").split(/\s+/).slice(0, 2).join(".");
        for (const child of box.querySelectorAll("*")) {
          const cr = child.getBoundingClientRect();
          if (cr.width < 8 || cr.height < 4) continue;
          const childName = String(child.className || child.tagName || "").split(/\s+/).slice(0, 2).join(".");
          if (/(?:^|\s)(?:rail|number-rail)(?:\s|$)/.test(String(child.className || ""))) continue;
          const text = child.textContent.trim().replace(/\s+/g, " ").slice(0, 64);
          if (cr.top < br.top - 8 || cr.left < br.left - 8 || cr.right > br.right + 8 || cr.bottom > br.bottom + 8) {
            componentEscapes.push(`${boxName} -> ${child.tagName}.${childName} "${text}"`);
            break;
          }
        }
        for (const child of box.querySelectorAll("*")) {
          if (!directText(child)) continue;
          if (child.parentElement?.matches(".risk-strip, .issue-strip")) continue;
          const cr = child.getBoundingClientRect();
          if (cr.width < 8 || cr.height < 4) continue;
          const childName = String(child.className || child.tagName || "").split(/\s+/).slice(0, 2).join(".");
          if (/(?:^|\s)(?:rail|number-rail)(?:\s|$)/.test(String(child.className || ""))) continue;
          const role = textRole(child);
          const horizontalInset = role === "numeric" ? 18 : role === "label" ? 10 : 14;
          const verticalInset = role === "numeric" ? 12 : 8;
          const text = child.textContent.trim().replace(/\s+/g, " ").slice(0, 64);
          if (cr.left < br.left + horizontalInset || cr.right > br.right - horizontalInset || cr.top < br.top + verticalInset || cr.bottom > br.bottom - verticalInset) {
            textFitIssues.push(`${boxName} -> ${child.tagName}.${childName} "${text}" is too close to the component edge; keep safe inset or ${textFitAdvice(role)}.`);
            break;
          }
        }
        if (box.matches(".bws-card")) {
          const tagNode = box.querySelector(".tag");
          const copyNode = box.querySelector(".body, .note, p");
          if (tagNode && copyNode) {
            const tagRect = tagNode.getBoundingClientRect();
            const copyRect = copyNode.getBoundingClientRect();
            const gap = copyRect.top - tagRect.bottom;
            if (gap < 16) {
              componentSpacingIssues.push(`${boxName}: tag/body gap is ${Math.round(gap)}px; keep at least 16px between action label and copy.`);
            }
          }
        }
      }
      for (const strip of el.querySelectorAll(".risk-strip, .issue-strip")) {
        const children = [...strip.children];
        if (children.length !== 3) continue;
        const cs = getComputedStyle(strip);
        const isHorizontal = cs.display === "grid" && cs.gridTemplateColumns.split(" ").length >= 3;
        if (!isHorizontal) continue;
        const topWidths = children.map(child => parseFloat(getComputedStyle(child).borderTopWidth) || 0);
        const maxTop = Math.max(...topWidths);
        const minTop = Math.min(...topWidths);
        if (maxTop - minTop > 0.5) {
          ruleCollisions.push(`${strip.className}: uneven child top borders ${topWidths.join("/")}`);
        }
      }

      return {
        originalIndex,
        type,
        width: Math.round(el.getBoundingClientRect().width),
        height: Math.round(el.getBoundingClientRect().height),
        scrollHeight: Math.round(el.scrollHeight),
        bands: occ,
        density: occ.reduce((a, b) => a + b, 0) / 4,
        imgCount: imgBoxes.length,
        maxImageHeightRatio: imgBoxes.length ? Math.max(...imgBoxes.map(img => img.height / el.clientHeight)) : 0,
        ledgerRows: count(".ledger-row"),
        splitRows: count(".split-row"),
        panels: count(".panel"),
        compareCards: count(".compare-card"),
        priceFormulas: count(".price-formula"),
        formulaSteps: count(".formula-step"),
        bwsCards: count(".bws-card"),
        sampleCompares: count(".sample-compare"),
        zoomCells: count(".zoom-cell"),
        issueStrips: count(".issue-strip"),
        megaItems: count(".mega-item, .numbered-item"),
        punchStrips: count(".punch-strip"),
        posterMarks: count(".poster-mark"),
        verdictItems: count(".verdict-item, .decision-row"),
        minimalRows: count(".minimal-row"),
        bentoCells: count(".bento-cell"),
        objectFrames: count(".object-frame"),
        evidenceFrames: count(".evidence-frame"),
        bauhausBands: count(".bauhaus-band"),
        metricBoxes: count(".metric-box"),
        decisionCells: count(".decision-cell"),
        barRows: count(".bar-row"),
        risks: count(".risk, .risk-strip > *"),
        stamps: count(".stamp"),
        verdictPills: count(".verdict-pill"),
        textLength: el.textContent.trim().replace(/\s+/g, "").length,
        footTop,
        footBottom,
        footPosition,
        footGap: footTop == null ? null : footTop - lastContentBottom,
        copyBudgetOverages,
        componentBudgetOverages,
        clippedText,
        escapedBoxes,
        edgeTouches,
        textFitIssues,
        componentEscapes,
        componentSpacingIssues,
        ruleCollisions,
        contrastIssues,
        chineseWidows,
      };
    }

    return sections
      .map((section, index) => ({ section, index }))
      .filter(({ section, index }) => {
        if (!pageFilter.size) return true;
        const number = String(index + 1);
        const padded = number.padStart(2, "0");
        const type = section.dataset.pageType || "";
        return pageFilter.has(number) || pageFilter.has(padded) || pageFilter.has(type);
      })
      .map(({ section, index }) => metricForSection(section, index));
  }, { budgets: { copyBudgets, classCopyBudgets }, selectedPageTokens: [...selectedPageTokens] });

  await browser.close();

  if (!rendered.length) return;

  const componentTotals = rendered.reduce((acc, item) => {
    acc.compareCards += item.compareCards;
    acc.splitRows += item.splitRows;
    acc.stamps += item.stamps;
    acc.verdictPills += item.verdictPills;
    acc.risks += item.risks;
    acc.priceFormulas += item.priceFormulas;
    acc.bwsCards += item.bwsCards;
    acc.sampleCompares += item.sampleCompares;
    acc.issueStrips += item.issueStrips;
    acc.megaItems += item.megaItems;
    acc.punchStrips += item.punchStrips;
    acc.posterMarks += item.posterMarks;
    acc.verdictItems += item.verdictItems;
    acc.minimalRows += item.minimalRows;
    acc.bentoCells += item.bentoCells;
    acc.objectFrames += item.objectFrames;
    acc.evidenceFrames += item.evidenceFrames;
    acc.bauhausBands += item.bauhausBands;
    acc.metricBoxes += item.metricBoxes;
    acc.decisionCells += item.decisionCells;
    acc.barRows += item.barRows;
    return acc;
  }, {
    compareCards: 0,
    splitRows: 0,
    stamps: 0,
    verdictPills: 0,
    risks: 0,
    priceFormulas: 0,
    bwsCards: 0,
    sampleCompares: 0,
    issueStrips: 0,
    megaItems: 0,
    punchStrips: 0,
    posterMarks: 0,
    verdictItems: 0,
    minimalRows: 0,
    bentoCells: 0,
    objectFrames: 0,
    evidenceFrames: 0,
    bauhausBands: 0,
    metricBoxes: 0,
    decisionCells: 0,
    barRows: 0,
  });
  PASS(`component surface counted: compare-card=${componentTotals.compareCards}, split-row=${componentTotals.splitRows}, stamp=${componentTotals.stamps}, verdict-pill=${componentTotals.verdictPills}, risk-items=${componentTotals.risks}, price-formula=${componentTotals.priceFormulas}, bws-card=${componentTotals.bwsCards}, sample-compare=${componentTotals.sampleCompares}, issue-strip=${componentTotals.issueStrips}, numbered-item=${componentTotals.megaItems}, punch-strip=${componentTotals.punchStrips}, poster-mark=${componentTotals.posterMarks}, decision-row=${componentTotals.verdictItems}, minimal-row=${componentTotals.minimalRows}, bento-cell=${componentTotals.bentoCells}, object-frame=${componentTotals.objectFrames}, evidence-frame=${componentTotals.evidenceFrames}, bauhaus-band=${componentTotals.bauhausBands}, metric-box=${componentTotals.metricBoxes}, decision-cell=${componentTotals.decisionCells}, bar-row=${componentTotals.barRows}.`);

  const footerTops = rendered
    .map(item => item.footTop)
    .filter(value => typeof value === "number" && Number.isFinite(value));
  if (!selectedPageTokens.size && footerTops.length > 1) {
    const minTop = Math.min(...footerTops);
    const maxTop = Math.max(...footerTops);
    if (maxTop - minTop > 8) {
      FAIL(`footer position drift across deck is ${Math.round(maxTop - minTop)}px; footer top must be consistent within 8px across a deck.`);
    }
  }

  for (const item of rendered) {
    const label = `${String(item.originalIndex + 1).padStart(2, "0")} ${item.type || "unknown"}`;
    if (item.width !== 1080 || item.height !== 1440) {
      FAIL(`${label}: rendered poster is ${item.width}x${item.height}, expected 1080x1440.`);
    }
    if (item.scrollHeight - item.height > 4) {
      FAIL(`${label}: content overflows poster by ${item.scrollHeight - item.height}px.`);
    }
    if (item.escapedBoxes.length) {
      FAIL(`${label}: visible element escapes the poster canvas: ${item.escapedBoxes.slice(0, 3).join(" | ")}${item.escapedBoxes.length > 3 ? " ..." : ""}`);
    }
    if (item.clippedText.length) {
      FAIL(`${label}: text appears clipped inside its box: ${item.clippedText.slice(0, 3).join(" | ")}${item.clippedText.length > 3 ? " ..." : ""}`);
    }
    if (item.componentEscapes.length) {
      FAIL(`${label}: content escapes a bounded component background/border: ${item.componentEscapes.slice(0, 3).join(" | ")}${item.componentEscapes.length > 3 ? " ..." : ""}`);
    }
    if (item.ruleCollisions.length) {
      FAIL(`${label}: horizontal strip has inherited list separators or uneven cell borders: ${item.ruleCollisions.slice(0, 3).join(" | ")}${item.ruleCollisions.length > 3 ? " ..." : ""}`);
    }
    if (item.copyBudgetOverages.length) {
      FAIL(`${label}: DOM budget check failed: ${item.copyBudgetOverages.join(" | ")}`);
    }
    if (item.componentBudgetOverages.length) {
      FAIL(`${label}: DOM component budget check failed: ${item.componentBudgetOverages.slice(0, 4).join(" | ")}${item.componentBudgetOverages.length > 4 ? " ..." : ""}`);
    }
    if (item.edgeTouches.length) {
      FAIL(`${label}: text/media touches the canvas edge; keep content inside the template safe area: ${item.edgeTouches.slice(0, 3).join(" | ")}${item.edgeTouches.length > 3 ? " ..." : ""}`);
    }
    if (item.textFitIssues.length) {
      FAIL(`${label}: text does not fit safely inside its container: ${item.textFitIssues.slice(0, 3).join(" | ")}${item.textFitIssues.length > 3 ? " ..." : ""}`);
    }
    if (item.componentSpacingIssues.length) {
      FAIL(`${label}: component spacing is too tight: ${item.componentSpacingIssues.slice(0, 3).join(" | ")}${item.componentSpacingIssues.length > 3 ? " ..." : ""}`);
    }
    if (item.contrastIssues.length) {
      FAIL(`${label}: low text/background contrast: ${item.contrastIssues.slice(0, 4).join(" | ")}${item.contrastIssues.length > 4 ? " ..." : ""}. Fix text color for the existing surface; move text only to an already route-defined dark/accent surface, never add a new background just to pass contrast.`);
    }
    if (item.chineseWidows.length) {
      FAIL(`${label}: Chinese single-character widow line found: ${item.chineseWidows.slice(0, 3).join(" | ")}${item.chineseWidows.length > 3 ? " ..." : ""}. Rewrite shorter, split the text, or move detail; do not patch with tiny type or invisible characters.`);
    }

    const pct = value => `${Math.round(value * 100)}%`;
    const lowDensityThreshold = style === "bauhaus-bright" ? 0.35 : 0.745;
    if (item.density < lowDensityThreshold) {
      const minBand = item.bands.reduce((best, value, index) => value < best.value ? { value, index } : best, { value: Infinity, index: -1 });
      const bandNames = ["top", "upper-middle", "lower-middle", "bottom"];
      const advice = minBand.index === 3
        ? "anchor a real final content layer such as a decision band, risk strip, or checklist above the footer"
        : minBand.index === 1 || minBand.index === 2
          ? "add decision-bearing rows, evidence interpretation, or a comparison layer in the middle"
          : "check whether the title/meta area is too sparse";
      WARN(`${label}: low 4-band density ${pct(item.density)} (bands ${item.bands.map(pct).join(" / ")}); thinnest band is ${bandNames[minBand.index]} at ${pct(minBand.value)}. Suggested fix: ${advice}.`);
    }
    if (item.density > 0.92) {
      WARN(`${label}: very high 4-band density ${pct(item.density)}; page may feel over-packed unless it is a deliberate full-evidence layout.`);
    }
    if (item.footPosition === "absolute" && typeof item.footGap === "number" && item.footGap < 0) {
      FAIL(`${label}: content overlaps an absolute footer by ${Math.abs(Math.round(item.footGap))}px; reserve footer space or switch to flex flow.`);
    } else if (item.footPosition === "absolute") {
      WARN(`${label}: footer uses absolute positioning; prefer flex flow with margin-top:auto or reserve footer space explicitly.`);
    }
    for (let i = 0; i < 3; i += 1) {
      if (item.bands[i] < 0.15 && item.bands[i + 1] < 0.15) {
        WARN(`${label}: adjacent under-filled bands ${i + 1}+${i + 2} (${pct(item.bands[i])} / ${pct(item.bands[i + 1])}).`);
        break;
      }
    }

    if (item.type === "cover-verdict" && item.imgCount === 0 && item.panels + item.megaItems + item.punchStrips + item.bentoCells + item.bauhausBands + item.metricBoxes < 3 && item.textLength < 120) {
      WARN(`${label}: cover feels thin; needs product/sample signal or 2-3 bottom judgment hooks.`);
    }
    if (item.type === "evidence-sample") {
      if (item.imgCount === 0 && !data.no_image_reason) FAIL(`${label}: evidence-sample has no image/screenshot evidence. Use a credible image, change the page type, or set deck-data.no_image_reason.`);
      else if (item.maxImageHeightRatio < 0.40) WARN(`${label}: evidence image occupies only ${pct(item.maxImageHeightRatio)} height; target 45%-65% when image inspection matters.`);
    }
    if (item.type === "before-after-effect" && item.imgCount < 2) {
      WARN(`${label}: before-after-effect should include two source-valid visual states.`);
    }
    if (item.type === "before-after-effect" && item.sampleCompares < 1) {
      WARN(`${label}: before-after-effect should use .sample-compare so evidence pairing is inspectable.`);
    }
    if (item.type === "variant-comparison" && item.compareCards < 2 && item.splitRows < 3 && item.ledgerRows < 3 && item.bentoCells + item.metricBoxes + item.decisionCells < 3) {
      WARN(`${label}: variant-comparison needs at least 3 dimensions, or 2 dimensions plus a decision strip.`);
    }
    if (item.type === "audience-fit" && item.panels + item.splitRows + item.ledgerRows + item.megaItems + item.bentoCells + item.metricBoxes + item.decisionCells < 4) {
      WARN(`${label}: audience-fit needs at least 4 audience rows; 6 is preferred.`);
    }
    if (item.type === "spec-price-ledger" && item.ledgerRows + item.splitRows + item.minimalRows + item.bentoCells + item.metricBoxes + item.barRows < 5) {
      WARN(`${label}: spec-price-ledger has ${item.ledgerRows + item.splitRows + item.minimalRows} ledger/split/minimal rows; target at least 5.`);
    }
    if (item.type === "spec-price-ledger" && item.priceFormulas + item.formulaSteps > 0 && item.formulaSteps < 3) {
      WARN(`${label}: price formula is present but incomplete; use original price, discount, and final price steps.`);
    }
    if (item.type === "final-verdict") {
      if (item.stamps + item.verdictPills + item.posterMarks + item.bauhausBands < 1 && item.textLength < 160) WARN(`${label}: final-verdict needs a verdict pill or strong action block.`);
      if (item.bwsCards + item.verdictItems + item.bentoCells + item.decisionCells < 3 && item.panels < 3) WARN(`${label}: final-verdict should include 3 action recommendations (建议买 / 建议等 / 不建议).`);
      if (item.risks + item.minimalRows < 3) WARN(`${label}: final-verdict should include 3 buying-relevant risk/limitation items.`);
    }
  }

  PASS("rendered density and page-capacity checks completed.");
}

if (!textOnly) {
  await runRenderedChecks();
} else {
  PASS("text-only preflight completed; rendered Playwright checks skipped.");
}

if (fail) {
  console.error(`\n${fail} FAIL, ${warn} WARN`);
  process.exit(1);
}

if (warn && failOnWarn) {
  console.error(`\n0 FAIL, ${warn} WARN`);
  console.error("FAIL warnings are treated as blockers because --fail-on-warn was set.");
  process.exit(1);
}

console.log(`\n${textOnly ? "Text preflight" : "Validation"} passed with ${warn} WARN.`);
