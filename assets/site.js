const $=selector=>document.querySelector(selector);
const year=$('#year');if(year)year.textContent=String(new Date().getFullYear());
const menu=$('#navigation'),toggle=$('#menuToggle');
function closeMenu(restore=false){if(!menu||!toggle)return;menu.classList.remove('open');toggle.setAttribute('aria-expanded','false');if(restore)toggle.focus();}
toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));menu.classList.toggle('open',open);});
menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>closeMenu()));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu?.classList.contains('open'))closeMenu(true);});
document.addEventListener('click',e=>{if(menu?.classList.contains('open')&&!menu.contains(e.target)&&!toggle.contains(e.target))closeMenu();});
matchMedia('(min-width:761px)').addEventListener('change',e=>{if(e.matches)closeMenu();});

const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const motionButton=$('#motionControl'),stage=$('#heroStage'),studio=$('#studioWindow');let paused=false,frame=0;
function syncMotion(){document.body.classList.toggle('motion-paused',paused||reducedMotion.matches);if(studio)studio.style.transform='';if(motionButton){motionButton.textContent=paused?'Bewegung aktivieren':'Bewegung pausieren';motionButton.setAttribute('aria-pressed',String(paused));}}
motionButton?.addEventListener('click',()=>{paused=!paused;syncMotion();});reducedMotion.addEventListener('change',syncMotion);syncMotion();
if(stage&&studio){stage.addEventListener('pointermove',e=>{if(paused||reducedMotion.matches||e.pointerType!=='mouse')return;cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const box=stage.getBoundingClientRect(),x=(e.clientX-box.left)/box.width-.5,y=(e.clientY-box.top)/box.height-.5;studio.style.transform=`rotateY(${-6+x*6}deg) rotateX(${4-y*5}deg) rotateZ(-1deg)`;});});stage.addEventListener('pointerleave',()=>{cancelAnimationFrame(frame);studio.style.transform='';});}
const heroTasks=[...document.querySelectorAll('.hero-task')];
function updateHero(){const done=heroTasks.filter(x=>x.checked).length,percent=Math.round(done/Math.max(1,heroTasks.length)*100);if($('#heroRemaining'))$('#heroRemaining').textContent=String(heroTasks.length-done);if($('#heroCount'))$('#heroCount').textContent=`${done} / ${heroTasks.length}`;if($('#heroPercent'))$('#heroPercent').textContent=`${percent} %`;if($('#heroProgress'))$('#heroProgress').style.width=`${percent}%`;}
heroTasks.forEach(input=>input.addEventListener('change',updateHero));updateHero();
if(!reducedMotion.matches&&'IntersectionObserver' in window){document.documentElement.classList.add('js-motion');const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.remove('pending');observer.unobserve(entry.target);}},{threshold:.12});document.querySelectorAll('.service-card,.approach-principles article,.process-grid article').forEach(el=>{el.classList.add('reveal','pending');observer.observe(el);});}

const openAssistant=()=>window.dispatchEvent(new CustomEvent('bss:assistant-open'));
$('#openAssistant')?.addEventListener('click',openAssistant);
$('#startBriefing')?.addEventListener('click',()=>window.dispatchEvent(new CustomEvent('bss:assistant-open',{detail:{mode:'brief'}})));
const form=$('#inquiryForm'),submit=$('#inquirySubmit'),status=$('#formStatus');
// This configuration exists only in the GitHub Pages export. The private Sites
// build keeps its same-origin Microsoft 365 contact endpoint.
const publicConfig=globalThis.BSS_PUBLIC_CONFIG;
const publicPage=Boolean(publicConfig)||document.documentElement?.dataset?.bssPublic==='true';
const publicContact=publicConfig?.version===1&&publicConfig.contact?.provider==='web3forms'&&publicConfig.contact.endpoint==='https://api.web3forms.com/submit'&&/^[a-f\d-]{36}$/i.test(publicConfig.contact.accessKey||'')?publicConfig.contact:null;
const projectTypes=['App-Entwicklung','Web-App / Plattform','Unternehmenssoftware','Digitalisierung / Automatisierung','Noch offen'];
document.addEventListener('click',e=>{const action=e.target.closest('[data-project]');if(action&&projectTypes.includes(action.dataset.project)&&$('#project'))$('#project').value=action.dataset.project;});
window.addEventListener('bss:briefing',e=>{if(!form||!e.detail||typeof e.detail.description!=='string')return;const text=e.detail.description.trim(),input=$('#description'),previous=input.value.trim();const combined=previous&&previous!==text?previous+'\n\nProjektbriefing aus dem BSS Assistant:\n'+text:text;if(combined.length>8000){status.textContent='Das Briefing und Ihr vorhandener Text sind zusammen zu lang. Bitte kürzen Sie zunächst Ihre Beschreibung. Ihre bisherigen Angaben bleiben erhalten.';input.focus();return;}if(projectTypes.includes(e.detail.project))$('#project').value=e.detail.project;input.value=combined;status.textContent='Das Projektbriefing ist übernommen. Bitte prüfen und ergänzen Sie Ihre Angaben, bevor Sie die Anfrage absenden.';form.scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth',block:'center'});$('#name').focus({preventScroll:true});});
form?.addEventListener('submit',async e=>{
  e.preventDefault();if(!form.reportValidity()||submit.disabled)return;
  const values=new FormData(form);if(String(values.get('_honey')||'').trim()||values.get('botcheck'))return;
  if(publicPage&&!publicContact){status.textContent='Das Anfrageformular ist gerade nicht verfügbar. Ihre Angaben bleiben erhalten. Schreiben Sie uns bitte an office@ba-smartsolution.at.';return;}
  const submittedPayload=Object.fromEntries(values.entries());
  const payload=publicContact?{
    access_key:publicContact.accessKey,subject:publicContact.subject,from_name:publicContact.fromName,
    Name:String(values.get('name')||'').trim(),'E-Mail':String(values.get('email')||'').trim(),
    Projektart:String(values.get('project')||''),Projektbeschreibung:String(values.get('description')||''),
    replyto:String(values.get('email')||'').trim()
  }:submittedPayload;
  submit.disabled=true;submit.textContent='Wird übermittelt …';status.textContent='Ihre Anfrage wird für den E-Mail-Versand übermittelt …';
  try{
    const response=await fetch(publicContact?publicContact.endpoint:'/api/inquiry',{method:'POST',credentials:publicContact?'omit':'same-origin',redirect:'error',referrerPolicy:'strict-origin',headers:{Accept:'application/json','Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(35000)});
    const result=await response.json();
    if((publicContact?response.ok:response.status===202)&&result?.success===true){
      const current=Object.fromEntries(new FormData(form).entries());
      const unchanged=Object.keys(submittedPayload).every(key=>current[key]===submittedPayload[key]);
      status.textContent=unchanged?'Ihre Projektanfrage wurde für den E-Mail-Versand angenommen. Vielen Dank!':'Ihre ursprüngliche Anfrage wurde für den E-Mail-Versand angenommen. Ihre danach vorgenommenen Änderungen bleiben im Formular und wurden noch nicht übermittelt.';
      if(unchanged)form.reset();
    }else{status.textContent=!publicContact&&typeof result?.message==='string'?result.message:'Die Übermittlung konnte nicht bestätigt werden. Ihre Angaben bleiben im Formular. Schreiben Sie uns bitte an office@ba-smartsolution.at.';}
  }catch{status.textContent='Die Übermittlung konnte nicht bestätigt werden. Ihre Angaben bleiben im Formular. Schreiben Sie uns bei Bedarf an office@ba-smartsolution.at.';}
  finally{submit.disabled=false;submit.textContent='Projektanfrage senden';}
});
