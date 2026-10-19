const {chromium}=require(process.env.RPM_PLAYWRIGHT || 'C:/Users/HP/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
(async()=>{
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
fs.mkdirSync('docs/qa',{recursive:true});
const base=process.env.RPM_BASE_URL||'http://127.0.0.1:4322';
await page.goto(base);await page.evaluate(()=>document.fonts.ready);
assert.equal(await page.locator('[data-home-section]').count(),12);
assert.equal(await page.locator('h1').count(),1);
assert.equal(await page.locator('[data-project]').count(),4);
assert.equal(await page.locator('.service-row').count(),7);
for(const width of [1440,768,390,320]){
await page.setViewportSize({width,height:1000});
assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow at ${width}`);
await page.screenshot({path:`docs/qa/home-${width}.png`,fullPage:true});
}
await page.setViewportSize({width:390,height:844});
await page.getByRole('button',{name:'Menu',exact:true}).click();
assert(await page.locator('#mobile-menu').evaluate(d=>d.open));
await page.keyboard.press('Escape');
assert(!await page.locator('#mobile-menu').evaluate(d=>d.open));
assert.equal(await page.locator(':focus').getAttribute('class'),'menu-trigger');
await page.getByRole('button',{name:'Next project',exact:true}).click();
await page.waitForFunction(()=>document.querySelector('.carousel-position').textContent==='02 / 04');
await page.goto(base+'/work');
await page.selectOption('#industry','Education');
assert.equal(await page.locator('[data-project]:visible').count(),1);
await page.selectOption('#expertise','Social Media & PR');
assert(await page.locator('#no-projects').isVisible());
await page.getByRole('button',{name:'View All Projects'}).click();
assert.equal(await page.locator('[data-project]:visible').count(),4);
await page.goto(base+'/contact?service=branding');
assert(await page.locator('input[value="branding"]').isChecked());
await page.locator('input[value="help-me-decide"]').check();
assert(!await page.locator('input[value="branding"]').isChecked());
await page.locator('#form-next').click();
await page.fill('textarea[name="details"]','This is a local conversion validation test only.');
await page.locator('#form-next').click();
await page.selectOption('select[name="method"]','WhatsApp');
assert(await page.locator('input[name="phone"]').isVisible());
assert(await page.locator('input[name="phone"]').getAttribute('required')!==null);
await page.selectOption('select[name="method"]','Email');
await page.fill('input[name="name"]','Preview Tester');
await page.fill('input[name="email"]','preview@example.com');
await page.fill('input[name="country"]','India');

assert(await page.locator('#form-send').isDisabled());
assert(await page.locator('#form-thanks').isHidden());
const routes=JSON.parse(fs.readFileSync('src/data/pages.json','utf8')).map(p=>p.name==='INSIGHTS'?'/insights':p.route);
for(const route of routes){
await page.goto(base+route);
assert.equal(await page.locator('h1').count(),1,route);
assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow: ${route}`);
const broken=await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src));assert.deepEqual(broken,[],route);
}
assert.deepEqual(errors,[]);
await page.goto(base+'/services/branding');assert.equal(await page.locator('.page-hero .button').first().getAttribute('href'),'/contact?service=branding');await page.getByRole('button',{name:'Menu',exact:true}).click();assert.equal((await page.locator('#mobile-menu nav a[aria-current]').innerText()).replace(/\s/g,''),'Services↗');await page.keyboard.press('Escape');await page.screenshot({path:'docs/qa/service-mobile.png',fullPage:true});
await page.goto(base+'/contact');await page.screenshot({path:'docs/qa/contact-mobile.png',fullPage:true});
const report={passed:true,viewports:[1440,768,390,320],routes:routes.length,checks:['12 homepage sections','4 project cards','7 service links','No horizontal page overflow','Mobile menu Escape and focus return','Carousel next','Combined project filters and reset','Editable service preselection and exclusive fallback','Conditional phone field','Three-step form with disabled unconfigured submission','One H1 per route','No broken images','No browser exceptions']};
fs.writeFileSync('docs/qa/browser-report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});

