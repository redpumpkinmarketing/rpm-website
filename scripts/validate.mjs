import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const files=[];
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(p.endsWith('.html'))files.push(p);}}
walk('dist');
const home=fs.readFileSync('dist/index.html','utf8');
assert.deepEqual([...home.matchAll(/data-home-section="(\d+)"/g)].map(m=>m[1]),Array.from({length:12},(_,i)=>String(i+1).padStart(2,'0')));
for(const file of files){const html=fs.readFileSync(file,'utf8');assert.equal((html.match(/<h1[ >]/g)||[]).length,1,file);assert.match(html,/noindex, nofollow/,file);
assert(!/Advertising Film Scriptwriting|INTERNAL IMPLEMENTATION|Publication gate:|Visual direction:|FORM MICROCOPY|\/insights\/\{/.test(html),`Internal or excluded content: ${file}`);
for(const match of html.matchAll(/(?:href|src)="(\/[^"?#]*)(?:[?#][^"]*)?"/g)){const target=decodeURIComponent(match[1]);if(target.startsWith('//'))continue;const dest=path.join('dist',target);assert(fs.existsSync(dest)||fs.existsSync(path.join(dest,'index.html')),`Broken local target ${target} in ${file}`);}
}
console.log(`PASS: ${files.length} HTML pages; 12 homepage sections in order; local assets and routes; one H1 per page; noindex; excluded-content guards.`);
