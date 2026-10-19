const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const statement=document.querySelector<HTMLElement>('[data-scroll-words]');
const drawings=[...document.querySelectorAll<HTMLElement>('[data-scroll-progress]')];
let words:HTMLElement[]=[];
if(statement){const walker=document.createTreeWalker(statement,NodeFilter.SHOW_TEXT);const nodes:Text[]=[];let n:Node|null;while((n=walker.nextNode()))nodes.push(n as Text);nodes.forEach(node=>{const fragment=document.createDocumentFragment();node.textContent?.split(/(\s+)/).forEach(part=>{if(!part.trim()){fragment.append(document.createTextNode(part));return;}const word=document.createElement('span');word.className='scroll-word';word.textContent=part;words.push(word);fragment.append(word);});node.replaceWith(fragment);});}
let scheduled=0;
const update=()=>{scheduled=0;const vh=innerHeight;
 if(statement){const r=statement.getBoundingClientRect();const progress=Math.max(0,Math.min(1,(vh*.85-r.top)/(r.height+vh*.25)));words.forEach((w,i)=>w.classList.toggle('is-lit',reduced.matches||progress>i/words.length));}
 drawings.forEach(el=>{const r=el.getBoundingClientRect();const progress=reduced.matches?1:Math.max(0,Math.min(1,(vh*.85-r.top)/Math.max(1,r.height-vh*.15)));el.style.setProperty('--draw',String(progress));});
};
const schedule=()=>{if(!scheduled)scheduled=requestAnimationFrame(update);};
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});reduced.addEventListener('change',update);update();
const icons=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('icon-reveal');icons.unobserve(entry.target);}}),{threshold:.3});
document.querySelectorAll('.standards .principles>div').forEach(card=>icons.observe(card));
export {};
