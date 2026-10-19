const {chromium}=require(process.env.RPM_PLAYWRIGHT || 'C:/Users/HP/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {default:AxeBuilder}=require('@axe-core/playwright');
const fs=require('node:fs');
const base=process.env.RPM_BASE_URL||'http://127.0.0.1:4322';
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});const context=await browser.newContext({reducedMotion:'reduce'});const page=await context.newPage();const reports=[];
for(const width of [1440,390]){await page.setViewportSize({width,height:1000});for(const route of JSON.parse(fs.readFileSync('src/data/pages.json','utf8')).map(p=>p.name==='INSIGHTS'?'/insights':p.route)){await page.goto(base+route);await page.evaluate(()=>document.fonts.ready);const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();reports.push({width,route,violations:result.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:result.incomplete.length});}}
await page.goto(base+'/');await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:'docs/qa/home-desktop-viewport.png'});
await page.locator('.site-footer').scrollIntoViewIfNeeded();await page.waitForFunction(()=>[...document.querySelectorAll('.site-footer img')].every(i=>i.complete&&i.naturalWidth>0));await page.screenshot({path:'docs/qa/footer-desktop.png'});
await page.setViewportSize({width:390,height:844});await page.goto(base+'/');await page.screenshot({path:'docs/qa/home-mobile-viewport.png'});await page.getByRole('button',{name:'Menu',exact:true}).click();const menuResult=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();reports.push({width:390,route:'menu open',violations:menuResult.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))});await page.screenshot({path:'docs/qa/menu-mobile.png'});
fs.writeFileSync('docs/qa/accessibility-report.json',JSON.stringify(reports,null,2));console.log(JSON.stringify(reports,null,2));await browser.close();if(reports.some(r=>r.violations.length))process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});

