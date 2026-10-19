const fs=require('node:fs'),{spawnSync}=require('node:child_process');
const routes=JSON.parse(fs.readFileSync('src/data/pages.json')).map(p=>p.name==='INSIGHTS'?'/insights':p.route);
const run=spawnSync(process.execPath,['scripts/lighthouse-qa.cjs',...routes],{stdio:'inherit'});
process.exitCode=run.status ?? 1;
