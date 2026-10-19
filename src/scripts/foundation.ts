const motion = matchMedia('(prefers-reduced-motion: reduce)');
const desktop = matchMedia('(hover: hover) and (pointer: fine)');
const cursor = document.querySelector<HTMLElement>('.rpm-cursor');
const enabled = () => !motion.matches && desktop.matches;
const reset = () => {
 document.body.classList.remove('cursor-active');
 if(cursor) cursor.style.opacity='0';
 document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach(el=>{el.style.removeProperty('--mag-x');el.style.removeProperty('--mag-y');});
};
motion.addEventListener('change',reset);desktop.addEventListener('change',reset);
window.addEventListener('blur',reset);document.addEventListener('mouseleave',reset);
window.addEventListener('keydown',e=>{if(e.key==='Tab')reset();});
let frame=0; let x=0;let y=0;let target:Element|null=null;
window.addEventListener('pointermove',e=>{
 if(!enabled() || e.pointerType==='touch' || !cursor)return;
 x=e.clientX;y=e.clientY;target=e.target instanceof Element?e.target:null;
 if(frame)return;
 frame=requestAnimationFrame(()=>{
 frame=0;
 if(!enabled())return;
 if(target?.closest('input,textarea,select,dialog')){reset();return;}
 document.body.classList.add('cursor-active');cursor.style.opacity='1';
 cursor.style.transform=`translate(${x}px,${y}px) translate(-50%,-50%)`;
 const link=target?.closest('a,button');cursor.classList.toggle('is-link',!!link);
 cursor.querySelector('span')!.textContent=link?.getAttribute('data-cursor') || (link?.closest('.project')?'View':'');
 });
},{passive:true});
document.querySelectorAll<HTMLElement>('[data-marquee]').forEach(el=>{const button=el.querySelector('button')!;button.addEventListener('click',()=>{const paused=el.toggleAttribute('data-paused');button.setAttribute('aria-pressed',String(paused));button.textContent=paused?'Resume moving text':'Pause moving text';});});
export {};

