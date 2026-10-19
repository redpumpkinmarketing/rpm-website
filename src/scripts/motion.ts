// No animation dependencies are requested for a reduced-motion visit.
const preference = matchMedia('(prefers-reduced-motion: reduce)');
function staticHeader() {
 if (!preference.matches) return;
 const header=document.querySelector('.site-header');
 header?.classList.toggle('is-scrolled',scrollY>40);
 header?.classList.remove('is-hidden');
}
addEventListener('scroll',staticHeader,{passive:true});
let dispose: (() => void) | undefined;
let version = 0;
async function sync() {
  const current = ++version;
  dispose?.(); dispose = undefined;
  staticHeader();
  if (preference.matches) return;
  try {
    const { startMotion } = await import('./motion-runtime');
    if (current === version && !preference.matches) dispose = startMotion();
  } catch { /* Static content and normal navigation are the fallback. */ }
}
preference.addEventListener('change', sync);
sync();
export {};
