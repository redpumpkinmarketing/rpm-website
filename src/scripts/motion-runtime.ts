import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import Lenis from 'lenis';

export function startMotion() {
 gsap.registerPlugin(ScrollTrigger, CustomEase);
 CustomEase.create('rpm', '0.22,1,0.36,1');
 const events = new AbortController(); const { signal } = events;
 const cleanups: (()=>void)[] = [];
 document.documentElement.classList.add('motion-running');
 const lenis = new Lenis({duration:.85,easing:gsap.parseEase('rpm'),smoothWheel:true,syncTouch:false,anchors:false,prevent:node=>!!node.closest('dialog,textarea,select,.project-gallery.carousel')});
 lenis.on('scroll',ScrollTrigger.update);
 const tick=(time:number)=>lenis.raf(time*1000);
 gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0);
 const context=gsap.context(()=>{
  const once=(element:Element)=>({trigger:element,start:'top 94%',once:true});
  // Word wrappers preserve original spaces/emphasis and are removed on teardown.
  document.querySelectorAll<HTMLElement>('main h1,main h2:not([data-scroll-words])').forEach(heading=>{
   const original=heading.innerHTML;cleanups.push(()=>{heading.innerHTML=original;heading.classList.remove('word-reveal');});
   const walker=document.createTreeWalker(heading,NodeFilter.SHOW_TEXT);const nodes:Text[]=[];let n;
   while((n=walker.nextNode()))nodes.push(n as Text);
   nodes.forEach(node=>{const fragment=document.createDocumentFragment();node.textContent?.split(/(\s+)/).forEach(part=>{
    if(!part.trim()){fragment.append(document.createTextNode(part));return;}
    const word=document.createElement('span');word.className='headline-word';const inner=document.createElement('span');inner.textContent=part;word.append(inner);fragment.append(word);
   });node.replaceWith(fragment);});
   heading.classList.add('word-reveal');
   gsap.fromTo(heading.querySelectorAll('.headline-word>span'),{yPercent:105,opacity:0},{yPercent:0,opacity:1,duration:.55,stagger:{each:.025,amount:Math.min(.3,heading.textContent!.split(/\s/).length*.025)},ease:'rpm',scrollTrigger:once(heading)});
  });
  document.querySelectorAll('[data-reveal],[data-motion="fade-up"],.service-feature,.label-card,.case-glance').forEach(el=>gsap.from(el,{y:18,opacity:0,duration:.6,ease:'rpm',scrollTrigger:once(el),clearProps:'transform,opacity'}));
  document.querySelectorAll('.arch-media-mask,[data-motion="arch"]').forEach(el=>gsap.fromTo(el,{clipPath:'ellipse(0% 0% at 50% 100%)'},{clipPath:'ellipse(110% 150% at 50% 100%)',duration:.85,ease:'rpm',scrollTrigger:once(el),clearProps:'clipPath'}));
  document.querySelectorAll('.service-art,.insights-art,[data-motion="parallax"]').forEach(el=>gsap.fromTo(el,{y:10},{y:-10,ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:.5}}));
  document.querySelectorAll<SVGGeometryElement>('[data-motion="draw"] path').forEach(path=>{const length=path.getTotalLength();gsap.fromTo(path,{strokeDasharray:length,strokeDashoffset:length},{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:path.closest('svg'),start:'top 85%',end:'bottom 50%',scrub:true}});});
  // Only explicitly marked, verified numbers are counted; no statistics are invented.
  document.querySelectorAll<HTMLElement>('[data-count-up]').forEach(el=>{const text=el.textContent??'';const end=Number(text);if(!Number.isFinite(end))return;const value={n:0};cleanups.push(()=>el.textContent=text);el.setAttribute('aria-label',text);gsap.to(value,{n:end,duration:.8,ease:'rpm',scrollTrigger:once(el),onUpdate:()=>el.textContent=String(Math.round(value.n)),onComplete:()=>el.textContent=text});});
  const desktop=matchMedia('(hover:hover) and (pointer:fine)');
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach(el=>{
   gsap.set(el,{'--mag-x':'0px','--mag-y':'0px'});const move=gsap.quickTo(el,'--mag-x',{duration:.35,ease:'rpm'});const moveY=gsap.quickTo(el,'--mag-y',{duration:.35,ease:'rpm'});
   el.addEventListener('pointermove',e=>{if(!desktop.matches||e.pointerType==='touch')return;const r=el.getBoundingClientRect();move(Math.max(-7,Math.min(7,(e.clientX-r.left-r.width/2)*.1)));moveY(Math.max(-5,Math.min(5,(e.clientY-r.top-r.height/2)*.1)));},{signal});
   el.addEventListener('pointerleave',()=>{move(0);moveY(0);},{signal});
  });
 });
 // One decorative Vine along the outer gutter, never over content or controls.
 const ns='http://www.w3.org/2000/svg';const vine=document.createElementNS(ns,'svg');vine.classList.add('page-vine');vine.setAttribute('aria-hidden','true');
 const path=document.createElementNS(ns,'path');vine.append(path);document.body.append(vine);
 const sections=[...document.querySelectorAll<HTMLElement>('main section')].filter(s=>!s.parentElement?.closest('section'));
 const markers=sections.map(()=>{const marker=document.createElementNS(ns,'path');marker.setAttribute('d','M0 -4 L4 0 L0 4 L-4 0Z M-2 0H2 M0 -2V2');marker.classList.add('vine-icon');vine.append(marker);return marker;});
 let points:number[]=[];let vineLength=0;
 const measure=()=>{const height=document.body.scrollHeight;vine.setAttribute('height',String(height));vine.setAttribute('viewBox',`0 0 14 ${height}`);points=sections.map(s=>s.getBoundingClientRect().top+scrollY+25);let d='M7 0';let previous=0;points.forEach((y,i)=>{d+=` C${i%2?2:12} ${previous+(y-previous)/3},${i%2?12:2} ${previous+2*(y-previous)/3},7 ${y}`;previous=y;});d+=` L7 ${height}`;path.setAttribute('d',d);vineLength=path.getTotalLength();path.style.strokeDasharray=String(vineLength);markers.forEach((m,i)=>m.setAttribute('transform',`translate(7 ${points[i]})`));};
 const draw=()=>{const progress=Math.min(1,(scrollY+innerHeight*.7)/Math.max(1,document.body.scrollHeight));path.style.strokeDashoffset=String(vineLength*(1-progress));markers.forEach((m,i)=>{const lit=points[i]<scrollY+innerHeight*.7;if(lit&&!m.classList.contains('is-lit')){m.classList.add('is-lit');gsap.fromTo(m,{opacity:0,scale:0},{opacity:1,scale:1,duration:.4,ease:'rpm',transformOrigin:'center'});}else if(!lit){m.style.opacity='0';m.classList.remove('is-lit');}});};
 measure();draw();ScrollTrigger.addEventListener('refreshInit',measure);const vineTrigger=ScrollTrigger.create({start:0,end:'max',onUpdate:draw,onRefresh:draw});
 const resize=new ResizeObserver(()=>{measure();draw();});resize.observe(document.querySelector('main')!);
 const header=document.querySelector<HTMLElement>('.site-header')!;let last=scrollY;
 const headerUpdate=()=>{const y=scrollY;header.classList.toggle('is-scrolled',y>40);if(Math.abs(y-last)>5){header.classList.toggle('is-hidden',y>last&&y>160&&!document.body.classList.contains('menu-open')&&!header.contains(document.activeElement));last=y;}if(y<40)header.classList.remove('is-hidden');};
 addEventListener('scroll',headerUpdate,{passive:true,signal});headerUpdate();
 header.addEventListener('focusin',()=>header.classList.remove('is-hidden'),{signal});
 const menu=document.querySelector<HTMLDialogElement>('#mobile-menu')!;
 const menuObserver=new MutationObserver(()=>{if(menu.open){lenis.stop();gsap.fromTo(menu.querySelectorAll('nav>a'),{y:30,opacity:0},{y:0,opacity:1,stagger:.055,duration:.45,ease:'rpm'});}else lenis.start();});menuObserver.observe(menu,{attributes:true,attributeFilter:['open']});
 // Native full-page navigation, with a short exit wipe and a guaranteed timeout fallback.
 const wipe=document.createElement('div');wipe.className='arch-wipe';wipe.setAttribute('aria-hidden','true');document.body.append(wipe);let leaving=false;let navigationTimer:ReturnType<typeof setTimeout>|undefined;
 document.addEventListener('click',event=>{const link=(event.target as Element)?.closest<HTMLAnchorElement>('a[href]');if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||link.download||link.target&&link.target!=='_self')return;
  const url=new URL(link.href);if(url.origin!==location.origin||!/^https?:$/.test(url.protocol))return;
  if(url.pathname===location.pathname&&url.search===location.search)return;
  if(leaving)return;event.preventDefault();leaving=true;menu.close();lenis.stop();
  const go=()=>location.assign(url.href);navigationTimer=setTimeout(go,650);
  gsap.to(wipe,{clipPath:'ellipse(150% 150% at 50% 100%)',duration:.38,ease:'rpm',onComplete:()=>{clearTimeout(navigationTimer);go();}});
 },{signal});
 const resetPage=()=>{leaving=false;gsap.killTweensOf(wipe);wipe.style.clipPath='ellipse(0% 0% at 50% 100%)';lenis.start();headerUpdate();ScrollTrigger.refresh();};
 addEventListener('pageshow',resetPage,{signal});
 let loader:HTMLDivElement|undefined;let loaderTimer:ReturnType<typeof setTimeout>|undefined;
 try{if(!localStorage.getItem('rpm-visited')){localStorage.setItem('rpm-visited','1');loader=document.createElement('div');loader.className='rpm-loader';loader.setAttribute('aria-hidden','true');loader.innerHTML='<i></i><i></i><i></i><i></i><i></i>';document.body.append(loader);const target=loader;loaderTimer=setTimeout(()=>target.remove(),820);gsap.timeline({onComplete:()=>target.remove()}).to(target.querySelectorAll('i'),{backgroundColor:'#D50032',x:(i:number)=>(2-i)*44,stagger:.04,duration:.3,ease:'rpm'}).to(target,{opacity:0,duration:.24,ease:'rpm'},.5);}}catch{/* Storage unavailable: skip first-visit decoration. */}
 document.fonts.ready.then(()=>{if(!signal.aborted)ScrollTrigger.refresh();});
 return ()=>{events.abort();clearTimeout(navigationTimer);clearTimeout(loaderTimer);menuObserver.disconnect();resize.disconnect();vineTrigger.kill();ScrollTrigger.removeEventListener('refreshInit',measure);gsap.killTweensOf([wipe,...markers,...menu.querySelectorAll('nav>a')]);if(loader)gsap.killTweensOf([loader,...loader.children]);context.revert();cleanups.forEach(fn=>fn());gsap.ticker.remove(tick);lenis.destroy();vine.remove();wipe.remove();loader?.remove();header.classList.remove('is-hidden','is-scrolled');menu.querySelectorAll<HTMLElement>('nav>a').forEach(a=>{a.style.removeProperty('transform');a.style.removeProperty('opacity');});document.documentElement.classList.remove('motion-running');};
}



