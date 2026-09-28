const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

(async () => {
  const root=path.resolve(__dirname,'..');
  const server=http.createServer((req,res)=>{
    let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if (['/','/simular','/ciencia','/ciencia/memoria','/ciencia/pedagogico','/dashboard','/sobre'].includes(pathname)) pathname='/index.html';
    const file=path.resolve(root,'.'+pathname);
    if (!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()) {res.writeHead(404);res.end();return;}
    res.setHeader('Content-Type',({'.js':'text/javascript; charset=utf-8','.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');
    fs.createReadStream(file).pipe(res);
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base=`http://127.0.0.1:${server.address().port}`;
  const browser=await chromium.launch({channel:'msedge',headless:true});
  fs.mkdirSync('output/pdf',{recursive:true});fs.mkdirSync('tmp/pdfs',{recursive:true});
  try {
    const context=await browser.newContext({serviceWorkers:'block'});
    const page=await context.newPage();
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    const ready=()=>page.waitForFunction(()=>document.querySelector('#btnPrintReport')?.disabled===false);
    const stateString=()=>page.evaluate(async()=>JSON.stringify((await import('/src/state.js')).state.simulation));
    await page.goto(base+'/simular');
    await page.locator('#inputArea').fill('10000');await page.locator('#inputEvap').fill('1000');await page.locator('[data-cover="sphere"]').click();
    const original=await stateString();
    await page.locator('a[href="/ciencia/pedagogico"]').last().click();await ready();
    assert.equal(await stateString(),original);
    assert.match(await page.locator('.pedagogical-report').innerText(),/7\.486\.000,00/);
    await page.pdf({path:'output/pdf/relatorio-pedagogico-v032.pdf',preferCSSPageSize:true,printBackground:true});
    const frozen=await page.locator('.scientific-report').innerHTML();
    await page.evaluate(async()=>(await import('/src/state.js')).state.updateSimulationInputs({areaM2:20000}));
    assert.equal(await page.locator('.scientific-report').innerHTML(),frozen);
    await page.locator('#btnPrintReport').click();await ready();
    assert.equal(await page.locator('.scientific-report').innerHTML(),frozen);
    await page.locator('#btnRegenerateReport').click();await ready();
    assert.match(await page.locator('.pedagogical-report').innerText(),/14\.972\.000,00/);
    await page.locator('a[href="/simular"]').filter({hasText:'Voltar'}).click();
    assert.equal(await page.locator('link[href="/src/report/report.css"]').count(),0);
    await page.locator('#inputArea').fill('10000');
    await page.locator('a[href="/ciencia/memoria"]').last().click();await ready();
    assert.doesNotMatch(await page.locator('.scientific-report').innerText(),/SPAECE|ENEM|D16|H26/);
    await page.pdf({path:'output/pdf/relatorio-cientifico-v032.pdf',preferCSSPageSize:true,printBackground:true});
    for (const route of ['/ciencia/memoria','/ciencia/pedagogico','/ciencia']) {
      await page.goto(base+route);
      if (route!='/ciencia') await ready();
      else {await page.locator('a[href="#pedagogia"]').click();assert.ok(await page.locator('#pedagogia').isVisible());await page.locator('#pedagogia details summary').first().click();}
      for (const theme of ['dark','light']) {
        await page.evaluate(async theme=>(await import('/src/state.js')).state.setTheme(theme),theme);
        for(const width of [360,390,430,768,820,1024,1366,1440]) {
          await page.setViewportSize({width,height:900});
          assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${route} ${theme} ${width}`);
        }
      }
      await page.setViewportSize({width:390,height:844});
      if (route==='/ciencia') await page.locator('#pedagogia').scrollIntoViewIfNeeded();
      await page.screenshot({path:`tmp/pdfs/${route.split('/').pop()}-mobile.png`});
    }
    await page.goto(base+'/simular');await page.locator('[data-mode="study"]').click();
    await page.locator('#studyCase a[href="/ciencia/pedagogico"]').click();await ready();
    assert.match(await page.locator('.scientific-report').innerText(),/não são volumes calculados/);
    await page.pdf({path:'tmp/pdfs/pedagogico-estudo.pdf',preferCSSPageSize:true,printBackground:true});
    await page.locator('a[href="/simular"]').filter({hasText:'Voltar'}).click();
    await page.locator('[data-mode="free"]').click();await page.locator('#inputArea').fill('');
    await page.locator('a[href="/ciencia/pedagogico"]').last().click();
    assert.equal(await page.locator('.scientific-report').count(),0);
    assert.match(await page.locator('[role="alert"]').innerText(),/área/);
    assert.deepEqual(errors,[]);
    await context.close();
    const offline=await browser.newContext();const tab=await offline.newPage();
    await tab.goto(base+'/');await tab.evaluate(()=>navigator.serviceWorker.ready);await tab.waitForFunction(()=>!!navigator.serviceWorker.controller);
    await offline.setOffline(true);
    for (const route of ['/ciencia/pedagogico','/ciencia/memoria']) {
      await tab.goto(base+route);await tab.waitForFunction(()=>document.querySelector('#btnPrintReport')?.disabled===false);
    }
    console.log('Edge headless: 48 combinações responsivas, navegação, dados dinâmicos, isolamento, regeneração, retorno de print, estudo documental, validação e ambos os relatórios offline aprovados.');
  } finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1;});
