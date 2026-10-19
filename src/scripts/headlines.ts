const motion = matchMedia('(prefers-reduced-motion: reduce)');
if (!motion.matches) {
 const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('words-visible'); observer.unobserve(entry.target); }
 }), { threshold: 0.15 });
 document.querySelectorAll<HTMLElement>('main h1, main h2:not(.eyebrow):not([data-scroll-words])').forEach(heading => {
  // Keep the real text and its spaces, emphasis and line breaks accessible.
  const walker=document.createTreeWalker(heading,NodeFilter.SHOW_TEXT);
  const nodes:Text[]=[];let current:Node|null;
  while((current=walker.nextNode()))nodes.push(current as Text);
  let index=0;
  nodes.forEach(node=>{
   const fragment=document.createDocumentFragment();
   node.textContent?.split(/(\s+)/).forEach(part=>{
    if(!part.trim()){fragment.append(document.createTextNode(part));return;}
    const word=document.createElement('span');word.className='headline-word';
    const inner=document.createElement('span');inner.textContent=part;
    inner.style.setProperty('--word-delay',`${Math.min(index++,10)*45}ms`);
    word.append(inner);fragment.append(word);
   });node.replaceWith(fragment);
  });
  heading.classList.add('word-reveal');observer.observe(heading);
 });
 motion.addEventListener('change',event=>{if(event.matches){document.querySelectorAll('.word-reveal').forEach(h=>h.classList.add('words-visible'));observer.disconnect();}});
}
