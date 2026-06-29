#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromeExecutablePath, loadChromium } from "./playwright-loader.mjs";

const args = process.argv.slice(2);
const skipContactSheet = args.includes("--skip-contact-sheet") || args.includes("--no-contact-sheet");
const pagesArgIndex = args.findIndex(arg => arg === "--pages");
const ignoredArgIndexes = new Set();
if (pagesArgIndex >= 0) {
  ignoredArgIndexes.add(pagesArgIndex);
  if (args[pagesArgIndex + 1]) ignoredArgIndexes.add(pagesArgIndex + 1);
}
const taskDir = args.find((arg, index) => !ignoredArgIndexes.has(index) && !arg.startsWith("-"));
const selectedPages = pagesArgIndex >= 0 && args[pagesArgIndex + 1]
  ? new Set(args[pagesArgIndex + 1].split(",").map(value => Number(value.trim())).filter(Number.isFinite))
  : null;
if (!taskDir) {
  console.error("Usage: render-review-deck.mjs <task-dir> [--pages 1,3,7] [--skip-contact-sheet]");
  process.exit(1);
}

const root = path.resolve(taskDir);
const htmlPath = path.join(root, "index.html");
const outputDir = path.join(root, "output");
await mkdir(outputDir, { recursive: true });

async function writeHtmlOnlyPreview(reason) {
  await writeFile(path.join(outputDir, "index.html"), `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Review Deck HTML Preview</title>
    <style>
      body { margin:0; background:#101114; color:#eef2f8; font:15px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif; }
      main { max-width:760px; margin:12vh auto; padding:32px; }
      h1 { margin:0 0 14px; font-size:24px; }
      p { color:#c7cfdb; }
      code { color:#fff; background:#20242c; padding:2px 6px; border-radius:4px; }
      a { color:#9fc2ff; }
    </style>
  </head>
  <body>
    <main>
      <h1>HTML preview only</h1>
      <p>PNG rendering was skipped because the current environment does not provide Playwright rendering capability.</p>
      <p><strong>Reason:</strong> ${String(reason).replace(/[<>&]/g, char => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[char]))}</p>
      <p>Open the editable deck directly: <a href="../index.html">../index.html</a></p>
      <p>To enable PNG export, install dependencies with <code>npm install</code> and, when needed, <code>npx playwright install chromium</code>.</p>
    </main>
  </body>
</html>
`, "utf8");
  console.warn("WARN: Playwright rendering is unavailable; generated output/index.html as an HTML-only preview.");
  console.warn(`open ${pathToFileURL(path.join(outputDir, "index.html")).href}`);
}

try {
  var chromium = await loadChromium();
} catch (error) {
  await writeHtmlOnlyPreview(error.message);
  process.exit(0);
}

let browser;
try {
  browser = await chromium.launch({ headless: true });
} catch (error) {
  const chromePath = chromeExecutablePath();
  if (!chromePath) {
    await writeHtmlOnlyPreview(`Playwright browser missing and Google Chrome not found. ${error.message}`);
    process.exit(0);
  }
  browser = await chromium.launch({ headless: true, executablePath: chromePath });
}
const page = await browser.newPage({ viewport: { width: 1400, height: 1800 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "load" });
await page.evaluate(async () => {
  if (document.fonts?.ready) await document.fonts.ready;
  await Promise.all([...document.images].map(img => img.complete ? null : new Promise(resolve => {
    img.addEventListener("load", resolve, { once: true });
    img.addEventListener("error", resolve, { once: true });
  })));
});
await page.waitForTimeout(120);

const posterHandles = await page.$$(".poster:not(.template-preview)");
const posters = await Promise.all(posterHandles.map(async (handle, index) => ({
  handle,
  pageType: await handle.evaluate(node => node.getAttribute("data-page-type") || `page-${index + 1}`),
  index: index + 1
})));

if (!posters.length) {
  await browser.close();
  console.error("FAIL: no .poster nodes found.");
  process.exit(1);
}

const renderedPosters = [];
for (const poster of posters) {
  if (selectedPages && !selectedPages.has(poster.index)) continue;
  const filename = `${String(poster.index).padStart(2, "0")}-${poster.pageType}.png`
    .replace(/[^a-zA-Z0-9._-]+/g, "-");
  await poster.handle.screenshot({ path: path.join(outputDir, filename) });
  renderedPosters.push({ ...poster, filename });
  console.log(`rendered ${filename}`);
}

if (selectedPages) {
  const renderedCount = posters.filter(poster => selectedPages.has(poster.index)).length;
  if (!renderedCount) {
    console.warn(`WARN: --pages matched no posters (${[...selectedPages].join(",")}).`);
  }
}

if (renderedPosters.length) {
  const galleryCards = renderedPosters.map(poster => `<figure>
          <a href="./${poster.filename}" target="_blank" rel="noreferrer">
            <img src="./${poster.filename}" alt="${poster.filename}">
          </a>
          <figcaption>
            <span>${poster.filename}</span>
            <a href="./${poster.filename}" download>Download</a>
          </figcaption>
        </figure>`).join("\n        ");
  await writeFile(path.join(outputDir, "index.html"), `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Review Deck Output</title>
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        background: #101114;
        color: #eef2f8;
        font: 15px/1.45 -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
      }
      header {
        position: sticky;
        top: 0;
        z-index: 2;
        display: flex;
        justify-content: space-between;
        gap: 20px;
        padding: 18px 24px;
        border-bottom: 1px solid rgba(255,255,255,.12);
        background: rgba(16,17,20,.92);
        backdrop-filter: blur(16px);
      }
      h1 {
        margin: 0;
        font-size: 18px;
        font-weight: 650;
      }
      header a {
        color: #9fc2ff;
        text-decoration: none;
      }
      main {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 24px;
        padding: 24px;
      }
      figure {
        margin: 0;
        display: grid;
        gap: 10px;
      }
      img {
        display: block;
        width: 100%;
        height: auto;
        background: #202228;
        box-shadow: 0 0 0 1px rgba(255,255,255,.08);
      }
      figcaption {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        color: #c7cfdb;
        font-size: 13px;
      }
      figcaption a {
        color: #9fc2ff;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <header>
      <h1>Review Deck Output</h1>
      <a href="../index.html">Open editable deck</a>
    </header>
    <main>
        ${galleryCards}
    </main>
  </body>
</html>
`, "utf8");
  console.log(`rendered index.html`);
  console.log(`open ${pathToFileURL(path.join(outputDir, "index.html")).href}`);
}

if (!selectedPages && renderedPosters.length && !skipContactSheet) {
  const sheet = await browser.newPage({ viewport: { width: 1800, height: 1400 }, deviceScaleFactor: 1 });
  const cards = (await Promise.all(renderedPosters.map(async poster => {
    const bytes = await readFile(path.join(outputDir, poster.filename));
    const src = `data:image/png;base64,${bytes.toString("base64")}`;
    return `<figure><figcaption>${poster.filename}</figcaption><img src="${src}" alt=""></figure>`;
  }))).join("");
  await sheet.setContent(`<!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            margin:0;
            background:#101114;
            color:#d9dde6;
            font:16px/1.2 Arial,sans-serif;
          }
          .grid {
            display:grid;
            grid-template-columns:repeat(4, 1fr);
            gap:28px;
            padding:28px;
          }
          figure {
            margin:0;
          }
          figcaption {
            margin:0 0 12px;
            color:#d9dde6;
          }
          img {
            display:block;
            width:100%;
            height:auto;
            box-shadow:0 0 0 1px rgba(255,255,255,.04);
          }
        </style>
      </head>
      <body><main class="grid">${cards}</main></body>
    </html>`, { waitUntil: "load" });
  await sheet.evaluate(async () => {
    await Promise.all([...document.images].map(img => img.complete ? null : new Promise(resolve => {
      img.addEventListener("load", resolve, { once: true });
      img.addEventListener("error", resolve, { once: true });
    })));
  });
  await sheet.screenshot({ path: path.join(outputDir, "contact-sheet.png"), fullPage: true });
  await sheet.close();
  console.log("rendered contact-sheet.png");
}

await browser.close();
