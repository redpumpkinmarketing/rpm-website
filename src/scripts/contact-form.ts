import {FORM_ENDPOINT,WEB3FORMS_ACCESS_KEY} from '../data/site';
const form=document.querySelector<HTMLFormElement>('#project-form')!;
const steps=[...form.querySelectorAll<HTMLFieldSetElement>('[data-form-step]')];
const field=(name:string)=>form.elements.namedItem(name) as HTMLInputElement;
const next=form.querySelector<HTMLButtonElement>('#form-next')!,back=form.querySelector<HTMLButtonElement>('#form-back')!,send=form.querySelector<HTMLButtonElement>('#form-send')!;
const status=form.querySelector<HTMLElement>('#form-status')!,connection=form.querySelector<HTMLElement>('#form-connection')!;
const choices=[...form.querySelectorAll<HTMLInputElement>('[name="service"]')];
const endpoint=FORM_ENDPOINT.trim();const web3=endpoint==='https://api.web3forms.com/submit';
const configured=/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(endpoint)||(web3&&!!WEB3FORMS_ACCESS_KEY.trim());
let step=0,busy=false;
const params=new URLSearchParams(location.search);
const type=field('type') as unknown as HTMLSelectElement;
if([...type.options].some(o=>o.value===params.get('type')))type.value=params.get('type')!;
choices.forEach(c=>c.checked=c.value===params.get('service'));
const showChannel=()=>{const note=document.querySelector<HTMLElement>('#whatsapp-setup-note')!;const channel=new URLSearchParams(location.search).get('channel');if(channel==='whatsapp-unconfigured'||channel==='email-unconfigured'){note.hidden=false;note.setAttribute('role','status');note.textContent=channel==='whatsapp-unconfigured'?'WhatsApp is not connected yet. The approved number still needs to be added.':'Email is not connected yet. The approved address still needs to be added.';}};showChannel();
const error=(el:HTMLInputElement,message:string)=>{let output=document.getElementById('error-'+el.name);if(!output){output=document.createElement('span');output.id='error-'+el.name;output.className='field-error';el.closest('label')!.append(output);el.setAttribute('aria-describedby',output.id);}output.textContent=message;el.setAttribute('aria-invalid',message?'true':'false');};
const validate=()=>{let invalid:HTMLInputElement|undefined;
 const reject=(name:string,message:string)=>{const el=field(name);error(el,message);invalid??=el;};
 if(step===0&&type.value==='new-project'&&!choices.some(c=>c.checked)){document.getElementById('service-error')!.textContent='Choose an area, or select “Help me decide”.';choices[0].focus();return false;}
 if(step===1){if(field('details').value.trim().length<20)reject('details','Tell us a little more—at least 20 characters will help us understand.');const url=field('website').value.trim();if(url&&(!/^https?:\/\//i.test(url)||!field('website').validity.valid))reject('website','Please use a full address, such as https://yourwebsite.com.');}
 if(step===2){if(!field('name').value.trim())reject('name','What should we call you? Please add your name.');if(!field('email').value.trim()||!field('email').validity.valid)reject('email','Please enter an email address we can reply to.');const countries=[...document.querySelectorAll<HTMLOptionElement>('#countries option')].map(o=>o.value);const country=countries.find(c=>c.toLowerCase()===field('country').value.trim().toLowerCase());if(!country)reject('country','Please choose your country from the list.');else field('country').value=country;
 if(field('method').value!=='Email'){const value=field('phone').value.trim();const digits=value.replace(/\D/g,'');if(!/^\+[0-9 ()-]+$/.test(value)||digits.length<7||digits.length>15)reject('phone','Please include your country code, for example +91, and a valid number.');}}
 invalid?.focus();return !invalid;
};
const show=(value:number,focus=true)=>{step=value;steps.forEach((s,i)=>s.hidden=i!==step);back.hidden=step===0;next.hidden=step===2;send.hidden=step!==2;send.disabled=!configured||busy;document.querySelector<HTMLProgressElement>('#enquiry-progress')!.value=step+1;document.getElementById('step-status')!.textContent=`Step ${step+1} of 3 · ${['What do you need?','About your business','Your contact details'][step]}`;form.querySelectorAll('.form-progress li').forEach((el,i)=>{if(i===step)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});status.textContent='';if(focus){const title=steps[step].querySelector<HTMLElement>('legend')!;title.scrollIntoView({block:'start',behavior:'instant'});title.focus({preventScroll:true});}};
const sync=()=>{const phone=field('phone'),showPhone=field('method').value!=='Email';document.getElementById('phone-field')!.hidden=!showPhone;phone.disabled=!showPhone;phone.required=showPhone;document.getElementById('service-required')!.hidden=type.value!=='new-project';};
choices.forEach(c=>c.addEventListener('change',()=>{if(c.checked)choices.filter(other=>c.value==='help-me-decide'?other!==c:other.value==='help-me-decide').forEach(other=>other.checked=false);document.getElementById('service-error')!.textContent='';}));
form.addEventListener('input',e=>{const el=e.target;if(el instanceof HTMLInputElement||el instanceof HTMLTextAreaElement){const output=document.getElementById('error-'+el.name);if(output)output.textContent='';el.removeAttribute('aria-invalid');}});
form.addEventListener('change',sync);next.addEventListener('click',()=>{if(validate())show(step+1);});back.addEventListener('click',()=>show(step-1));
form.addEventListener('submit',async event=>{event.preventDefault();if(busy)return;if(step<2){if(validate())show(step+1);return;}if(!configured||!validate())return;
 // Revalidate earlier steps as well; hidden fields remain part of the final payload.
 for(let i=0;i<3;i++){step=i;if(!validate()){show(i);validate();return;}}step=2;
 busy=true;send.disabled=true;back.disabled=true;form.setAttribute('aria-busy','true');status.textContent='Sending your enquiry…';
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),15000);
 try{const data=new FormData(form);const payload:Record<string,string>=Object.fromEntries([...data.entries()].map(([k,v])=>[k,String(v).trim()]));payload.service=data.getAll('service').join(', ');payload.subject='Red Pumpkin Marketing — Website enquiry';if(web3)payload.access_key=WEB3FORMS_ACCESS_KEY;
 const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(payload),signal:controller.signal});const result=await response.json();if(!response.ok||(web3?result.success!==true:result.ok!==true))throw new Error('Submission not confirmed');
 form.hidden=true;const thanks=document.getElementById('form-thanks')!;thanks.hidden=false;document.querySelector('.enquiry-panel')!.scrollIntoView({block:'start',behavior:'instant'});thanks.focus({preventScroll:true});form.reset();
 }catch{status.textContent='We couldn’t confirm delivery. Please try again, or use email or WhatsApp. Your details are still here.';status.focus();}finally{clearTimeout(timeout);busy=false;back.disabled=false;send.disabled=!configured;form.removeAttribute('aria-busy');}
});
connection.hidden=configured;next.disabled=false;sync();show(0,false);

