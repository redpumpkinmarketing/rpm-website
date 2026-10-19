const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const version = process.versions.node.split('.').map(Number);
let runtime = process.execPath;
if (version[0] < 22 || (version[0] === 22 && version[1] < 19)) {
  const bundled = path.join(process.env.USERPROFILE || require('node:os').homedir(), '.cache', 'codex-runtimes', 'codex-primary-runtime', 'dependencies', 'node', 'bin', 'node.exe');
  if (!fs.existsSync(bundled)) { console.error('This frontend requires Node 22.19 or newer. Install Node 24 LTS and try again.'); process.exit(1); }
  runtime = bundled;
}
const result = spawnSync(runtime, [path.join(__dirname, '..', 'node_modules', 'astro', 'bin', 'astro.mjs'), ...process.argv.slice(2)], { stdio: 'inherit', env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' } });
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
