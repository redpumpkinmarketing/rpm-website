const field=document.querySelector<HTMLElement>('.arch-field');
if(field){
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const fine=matchMedia('(hover:hover) and (pointer:fine)');
 const cells=[...field.querySelectorAll<HTMLElement>('.arch-cell')];
 const follow=field.querySelector<HTMLElement>('.standout-follow')!;
 const art=field.querySelector<HTMLElement>('.arch-field-art')!;
 const button=field.querySelector<HTMLButtonElement>('.field-motion-toggle')!;
 let frame=0;let px=0;let py=0;
 const reset=()=>{cancelAnimationFrame(frame);frame=0;cells.forEach(c=>{const a=c.querySelector<HTMLElement>('.grey-arch');if(a){a.style.removeProperty('--away-x');a.style.removeProperty('--away-y');a.style.removeProperty('--tilt');}});follow.style.setProperty('--follow-x','0px');follow.style.setProperty('--follow-y','0px');};
 const active=()=>fine.matches&&!reduce.matches&&!field.hasAttribute('data-paused');
 art.addEventListener('pointermove',event=>{if(!active()||event.pointerType==='touch')return;px=event.clientX;py=event.clientY;if(frame)return;frame=requestAnimationFrame(()=>{frame=0;if(!active())return;const box=art.getBoundingClientRect();follow.style.setProperty('--follow-x',`${(px-box.left-box.width/2)*.035}px`);follow.style.setProperty('--follow-y',`${(py-box.top-box.height/2)*.035}px`);cells.forEach(cell=>{const arch=cell.querySelector<HTMLElement>('.grey-arch');if(!arch)return;const b=cell.getBoundingClientRect();const dx=b.left+b.width/2-px,dy=b.top+b.height/2-py,d=Math.hypot(dx,dy);const force=Math.max(0,1-d/125);arch.style.setProperty('--away-x',`${dx/(d||1)*force*10}px`);arch.style.setProperty('--away-y',`${dy/(d||1)*force*6}px`);arch.style.setProperty('--tilt',`${(dx<0?-1:1)*force*16}deg`);});});},{passive:true});
 art.addEventListener('pointerleave',reset);reduce.addEventListener('change',reset);fine.addEventListener('change',reset);
 button.addEventListener('click',()=>{const paused=field.toggleAttribute('data-paused');button.setAttribute('aria-pressed',String(paused));button.textContent=paused?'Resume motion':'Pause motion';reset();});
 const observer=new IntersectionObserver(entries=>{const visible=entries[0].isIntersecting;field.classList.toggle('field-offscreen',!visible);if(!visible)reset();});observer.observe(field);
}
export {};
