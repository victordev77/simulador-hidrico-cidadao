// Run against the local SPA server. Optional PLAYWRIGHT_MODULE selects an existing installation.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
let base = process.env.REPORT_TEST_URL;

(async () => {
  let server;
  if (!base) {
    const root = path.resolve(__dirname, '..');
    server = http.createServer((request, response) => {
      let url = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (['/','/simular','/dashboard','/ciencia','/ciencia/memoria','/sobre'].includes(url)) url = '/index.html';
      const file = path.resolve(root, '.' + url);
      if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { response.writeHead(404); response.end(); return; }
      response.setHeader('Content-Type', {'.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.html':'text/html; charset=utf-8','.svg':'image/svg+xml'}[path.extname(file)] || 'application/octet-stream');
      fs.createReadStream(file).pipe(response);
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    base = `http://127.0.0.1:${server.address().port}`;
  }
  fs.mkdirSync('output/pdf', { recursive: true });
  fs.mkdirSync('tmp/pdfs', { recursive: true });
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const context = await browser.newContext({ serviceWorkers: 'block' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const ready = () => page.waitForFunction(() => document.querySelector('#btnPrintReport')?.disabled === false);
    const open = async (cover, evap = '3230.8', area = '750000') => {
      await page.goto(base + '/simular');
      await page.locator('#inputArea').fill(area);
      await page.locator('#inputEvap').fill(evap);
      await page.locator(`[data-cover="${cover}"]`).click();
      await page.locator('a[href="/ciencia/memoria"]').last().click();
      await ready();
    };
    const pdf = path => page.pdf({ path, preferCSSPageSize: true, printBackground: true, displayHeaderFooter: false });
    await open('sphere');
    assert.match(await page.locator('.scientific-report').innerText(), /1\.813\.932,66/);
    assert.equal(await page.locator('.sr-chapter').count(), 9);
    await pdf('output/pdf/relatorio-regressao-esferas.pdf');
    const original = await page.locator('.scientific-report').innerHTML();
    await page.evaluate(async () => (await import('/src/state.js')).state.updateSimulationInputs({ coverType: 'hex', areaM2: 123456 }));
    assert.equal(await page.locator('.scientific-report').innerHTML(), original);
    // Native print in headless mode returns without an interactive dialog.
    await page.locator('#btnPrintReport').click();
    await ready();
    assert.equal(await page.locator('.scientific-report').innerHTML(), original);
    await page.locator('#btnRegenerateReport').click();
    await ready();
    assert.match(await page.locator('.scientific-report').innerText(), /123\.456,00/);
    assert.equal(await page.evaluate(async () => (await import('/src/views/memoriaView.js')).memoriaView.record.selectedCover), 'hex');
    for (const theme of ['dark','light']) {
      await page.evaluate(async theme => (await import('/src/state.js')).state.setTheme(theme), theme);
      for (const width of [360,390,430,768,820,1024,1366,1440]) {
        await page.setViewportSize({ width, height: width >= 768 ? 900 : 844 });
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${theme} ${width}`);
      }
    }
    await page.setViewportSize({width:390,height:844});
    await page.screenshot({path:'tmp/pdfs/mobile-preview.png'});
    await page.locator('a[href="/simular"]').filter({hasText:'Voltar'}).click();
    assert.equal(await page.locator('link[href="/src/report/report.css"]').count(),0);
    await page.locator('#inputArea').fill('');
    await page.locator('a[href="/ciencia/memoria"]').last().click();
    assert.equal(await page.locator('.scientific-report').count(),0);
    assert.match(await page.locator('[role="alert"]').innerText(),/área/);
    await page.locator('a[href="/simular"]').filter({hasText:'Corrigir'}).click();
    await page.locator('#inputArea').fill('750000');
    await page.locator('#demoEnabled').check();
    await page.locator('[data-cover="hex"]').click();
    await page.locator('a[href="/ciencia/memoria"]').last().click();
    await ready();
    assert.equal(await page.evaluate(async () => (await import('/src/views/memoriaView.js')).memoriaView.record.selectedCover), 'hex');
    await open('hex','2344.7','123456');
    await pdf('output/pdf/relatorio-simulacao-hexagonal.pdf');
    await open('none');
    assert.match(await page.locator('.scientific-report').innerText(), /preservado é zero/);
    await pdf('tmp/pdfs/sem-cobertura.pdf');
    await open('sphere','.01','.01');
    await pdf('tmp/pdfs/valores-pequenos.pdf');
    await open('hex','10000','100000000');
    await pdf('tmp/pdfs/valores-grandes.pdf');
    await page.goto(base + '/simular');
    await page.locator('[data-mode="study"]').click();
    await page.locator('#studyCase a[href="/ciencia/memoria"]').click();
    await ready();
    assert.match(await page.locator('.scientific-report').innerText(),/Memória numérica não reproduzível/);
    await pdf('output/pdf/relatorio-estudo-de-caso.pdf');
    assert.deepEqual(errors,[]);
    await context.close();
    const offline = await browser.newContext();
    const tab = await offline.newPage();
    await tab.goto(base + '/');
    await tab.evaluate(() => navigator.serviceWorker.ready);
    await tab.waitForFunction(() => !!navigator.serviceWorker.controller);
    await offline.setOffline(true);
    await tab.goto(base + '/ciencia/memoria');
    await tab.waitForFunction(() => document.querySelector('#btnPrintReport')?.disabled === false);
    assert.equal(await tab.locator('.sr-chapter').count(),9);
    console.log('Browser: snapshot, regeneration, validation, demo, 16 responsive combinations, print return, study and offline passed.');
  } finally { await browser.close(); if (server) await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
