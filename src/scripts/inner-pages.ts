// Native details semantics remain available without JavaScript.
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll<HTMLDetailsElement>('.smooth-faq,.value-card').forEach(details=>{
 const summary=details.querySelector('summary')!;let animation:Animation|null=null;let desired=details.open;
 summary.addEventListener('click',event=>{
  if(reduce.matches)return;
  event.preventDefault();const start=details.getBoundingClientRect().height;animation?.cancel();desired=!desired;
  details.style.height='';details.open=true;
  const end=desired?details.getBoundingClientRect().height:summary.getBoundingClientRect().height+2;
  details.style.overflow='hidden';animation=details.animate([{height:start+'px'},{height:end+'px'}],{duration:330,easing:'cubic-bezier(.22,1,.36,1)'});
  animation.onfinish=()=>{details.open=desired;details.style.height='';details.style.overflow='';animation=null;};
 });
 reduce.addEventListener('change',()=>{if(reduce.matches){animation?.cancel();animation=null;details.style.height='';details.style.overflow='';details.open=desired;}});
 details.addEventListener('toggle',()=>{if(!animation)desired=details.open;});
});
export {};
