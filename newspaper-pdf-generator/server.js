const express = require('express');
const puppeteer = require('puppeteer-core');
const path = require('path');

// Playwright がインストール済みの場合はそちらの Chromium を使用
// 環境変数 CHROMIUM_PATH で上書き可能
const CHROMIUM_PATH =
  process.env.CHROMIUM_PATH ||
  '/root/.cache/ms-playwright/chromium-1194/chrome-linux/chrome';

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/generate-pdf', async (req, res) => {
  const { title, subtitle, date, edition, articles } = req.body;

  const html = buildNewspaperHtml({ title, subtitle, date, edition, articles });

  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: CHROMIUM_PATH,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' },
    });

    const filename = `newspaper_${Date.now()}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdf);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'PDF生成に失敗しました: ' + err.message });
  } finally {
    if (browser) await browser.close();
  }
});

function buildNewspaperHtml({ title, subtitle, date, edition, articles }) {
  const articlesHtml = articles
    .map((a, i) => buildArticleHtml(a, i))
    .join('\n');

  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: "Hiragino Mincho ProN", "Yu Mincho", "MS Mincho", serif;
    font-size: 9pt;
    color: #111;
    background: #fff;
    padding: 4mm;
  }

  /* ヘッダー（題字） */
  .masthead {
    text-align: center;
    border-top: 4px double #111;
    border-bottom: 4px double #111;
    padding: 4px 0;
    margin-bottom: 6px;
  }
  .masthead .paper-title {
    font-size: 32pt;
    font-weight: bold;
    letter-spacing: 0.15em;
    line-height: 1.1;
  }
  .masthead .meta {
    font-size: 8pt;
    display: flex;
    justify-content: space-between;
    margin-top: 3px;
  }
  .masthead .subtitle {
    font-size: 10pt;
    letter-spacing: 0.1em;
  }

  /* 区切り線 */
  .divider {
    border: none;
    border-top: 1px solid #333;
    margin: 4px 0;
  }
  .divider-thick {
    border: none;
    border-top: 2px solid #111;
    margin: 5px 0;
  }

  /* 段組みレイアウト */
  .columns-3 { column-count: 3; column-gap: 4mm; column-rule: 1px solid #999; }
  .columns-2 { column-count: 2; column-gap: 4mm; column-rule: 1px solid #999; }
  .columns-1 { column-count: 1; }

  /* 記事 */
  .article {
    break-inside: avoid;
    margin-bottom: 6px;
    padding-bottom: 4px;
  }
  .article + .article {
    border-top: 1px solid #bbb;
    padding-top: 4px;
  }
  .article .headline {
    font-size: 14pt;
    font-weight: bold;
    line-height: 1.3;
    margin-bottom: 3px;
  }
  .article .headline.large {
    font-size: 18pt;
    column-span: all;
  }
  .article .byline {
    font-size: 7.5pt;
    color: #555;
    margin-bottom: 3px;
  }
  .article .body {
    font-size: 8.5pt;
    line-height: 1.7;
    text-align: justify;
    text-justify: inter-character;
  }
  .article .kicker {
    font-size: 7.5pt;
    background: #111;
    color: #fff;
    padding: 0 4px;
    display: inline-block;
    margin-bottom: 2px;
    letter-spacing: 0.05em;
  }

  /* トップ記事（全幅見出し） */
  .article.top-story .headline {
    font-size: 22pt;
    column-span: all;
    border-bottom: 2px solid #111;
    padding-bottom: 3px;
    margin-bottom: 6px;
  }
  .top-story-columns {
    column-count: 3;
    column-gap: 4mm;
    column-rule: 1px solid #999;
  }

  /* 囲み記事 */
  .article.boxed {
    border: 1px solid #333;
    padding: 4px 6px;
    background: #f9f9f9;
  }
</style>
</head>
<body>

<div class="masthead">
  <div class="meta">
    <span>${escHtml(edition || '')}</span>
    <span>${escHtml(subtitle || '')}</span>
    <span>${escHtml(date || '')}</span>
  </div>
  <div class="paper-title">${escHtml(title || '新聞')}</div>
</div>

<hr class="divider">

${articlesHtml}

</body>
</html>`;
}

function buildArticleHtml(article, index) {
  const layout = article.layout || 'columns-3';
  const isTop = article.isTop || index === 0;
  const boxed = article.boxed ? 'boxed' : '';

  const kickerHtml = article.kicker
    ? `<div class="kicker">${escHtml(article.kicker)}</div>`
    : '';
  const bylineHtml = article.byline
    ? `<div class="byline">${escHtml(article.byline)}</div>`
    : '';
  const bodyHtml = (article.body || '')
    .split('\n')
    .filter(l => l.trim())
    .map(l => `<p style="margin-bottom:3px">${escHtml(l)}</p>`)
    .join('');

  if (isTop && index === 0) {
    return `
<div class="article ${boxed}" style="margin-bottom:8px">
  ${kickerHtml}
  <div class="headline" style="font-size:22pt;border-bottom:2px solid #111;padding-bottom:3px;margin-bottom:6px">${escHtml(article.headline || '')}</div>
  ${bylineHtml}
  <div class="top-story-columns">
    <div class="body">${bodyHtml}</div>
  </div>
</div>
<hr class="divider-thick">`;
  }

  return `
<div class="${layout}">
  <div class="article ${boxed}">
    ${kickerHtml}
    <div class="headline">${escHtml(article.headline || '')}</div>
    ${bylineHtml}
    <div class="body">${bodyHtml}</div>
  </div>
</div>
<hr class="divider">`;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`新聞PDFジェネレーター起動中: http://localhost:${PORT}`);
});
