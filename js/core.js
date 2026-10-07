/* Business Booster site: core engine for the inner pages. Theme switch, the shared top bar (underline under the current page), reveals, drawer, ribbon, magnetic buttons, local events. The master home runs his own script on the same chrome. */
(function(){
'use strict';
var doc=document.documentElement;
var RM=doc.classList.contains('rm');
if(location.hash.indexOf('capture')>-1)doc.classList.add('cap');
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
/* theme switch: his sky toggle (#theme), the same conventions as the script in his master */
var metaTheme=document.getElementById('metaTheme');
var themeBtn=document.getElementById('theme');
function syncTheme(){
 var dark=doc.getAttribute('data-theme')==='dark';
 if(metaTheme)metaTheme.setAttribute('content',dark?'#09090b':'#f5f5f2');
 if(themeBtn){themeBtn.setAttribute('aria-pressed',String(dark));themeBtn.setAttribute('aria-label',dark?'Switch to light theme':'Switch to dark theme');}
}
syncTheme();
if(themeBtn)themeBtn.addEventListener('click',function(){
 var next=doc.getAttribute('data-theme')==='dark'?'light':'dark';
 doc.setAttribute('data-theme',next);
 try{localStorage.setItem('bb-theme',next)}catch(e){}
 syncTheme();
});

/* sticky nav + reveals + scrub stack + hero watermark drift, one handler */
var nav=document.getElementById('nav');
var rv=[].slice.call(document.querySelectorAll('[data-rv]'));
var mark=document.getElementById('heroMark');
var navInd=document.getElementById('nav-indicator'),navProg=document.getElementById('navProg');
var spyLinks=[].slice.call(document.querySelectorAll('[data-spy]'));
function frame(){
 nav.classList.toggle('stuck',window.scrollY>6);
 var vh=window.innerHeight;
 /* reading progress along the nav */
 var doc=document.documentElement;
 var total=doc.scrollHeight-vh;
 if(navProg)navProg.style.transform='scaleX('+(total>0?Math.min(1,window.scrollY/total):0).toFixed(4)+')';
 /* scrollspy: the one underline travels to the section you are in */
 var current=null;
 spyLinks.forEach(function(a){
  var sec=document.getElementById(a.dataset.spy);
  if(sec&&sec.getBoundingClientRect().top<vh*.4)current=a;
 });
 spyLinks.forEach(function(a){a.classList.toggle('now',a===current)});
 if(!current)current=document.querySelector('.bbn-links a[aria-current="page"]');
 if(current&&navInd){
  navInd.classList.add('on');
  navInd.style.width=current.offsetWidth+'px';
  navInd.style.transform='translateX('+current.offsetLeft+'px)';
 }else if(navInd){
  navInd.classList.remove('on');
 }
 rv.forEach(function(el){
  if(el.getBoundingClientRect().top<vh-70)el.classList.add('in');
 });
 if(!RM&&mark&&window.innerWidth>700&&!doc.classList.contains('cap')){mark.style.transform='translateY('+(window.scrollY*.12).toFixed(1)+'px)';}
}
/* direct call, no rAF gate: writes are transform and opacity only, browsers already
   coalesce scroll events, and a starved rAF in a throttled tab would wedge a gate shut */
addEventListener('scroll',frame,{passive:true});
addEventListener('resize',frame,{passive:true});
frame();
setTimeout(frame,400);

/* drawer: his conventions (open class, aria-hidden, body.drawer-open, Escape, focus kept inside and returned) */
var drawer=document.getElementById('drawer'),scrim=document.getElementById('drawer-scrim'),
    menu=document.getElementById('menu'),closeBtn=document.getElementById('drawer-close'),returnFocus=null;
function focusable(){return [].slice.call(drawer.querySelectorAll('a,button')).filter(function(x){return !x.disabled&&x.offsetParent!==null});}
function openDrawer(){
 returnFocus=document.activeElement;
 drawer.classList.add('open');scrim.classList.add('open');drawer.setAttribute('aria-hidden','false');
 menu.setAttribute('aria-expanded','true');menu.setAttribute('aria-label','Navigation open');
 document.body.classList.add('drawer-open');
 var f=focusable();if(f.length)f[0].focus();
}
function closeDrawer(restore){
 drawer.classList.remove('open');scrim.classList.remove('open');drawer.setAttribute('aria-hidden','true');
 menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');
 document.body.classList.remove('drawer-open');
 if(restore!==false&&returnFocus)returnFocus.focus();
}
if(drawer&&menu){
 menu.addEventListener('click',function(){drawer.classList.contains('open')?closeDrawer(true):openDrawer();});
 closeBtn.addEventListener('click',function(){closeDrawer(true);});
 scrim.addEventListener('click',function(){closeDrawer(true);});
 drawer.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){closeDrawer(false);});});
 document.addEventListener('keydown',function(e){
  if(!drawer.classList.contains('open'))return;
  if(e.key==='Escape'){e.preventDefault();closeDrawer(true);return;}
  if(e.key!=='Tab')return;
  var f=focusable();if(!f.length)return;
  var first=f[0],last=f[f.length-1];
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
 });
}

/* services ribbon: one string, doubled for the seamless loop */
var lane=document.getElementById('ribbonLane');
if(lane){
 var R='<b>Strategy</b><i>&middot;</i><b>Social media</b><i>&middot;</i><b>Websites</b><i>&middot;</i><b>SEO</b><i>&middot;</i><b>Digital staff</b><i>&middot;</i><b>Reporting</b><i>&middot;</i>';
 lane.innerHTML=R+R;
}

/* magnetic primary buttons: desktop pointers only, never under reduced motion */
if(matchMedia('(pointer:fine)').matches&&!RM){
 [].slice.call(document.querySelectorAll('.btn-solid')).forEach(function(b){
  b.addEventListener('mousemove',function(e){
   var r=b.getBoundingClientRect();
   b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.12).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*.22).toFixed(1)+'px)';
  });
  b.addEventListener('mouseleave',function(){b.style.transform='';});
 });
}

/* ═══ BB EVENTS: local analytics queue. Nothing leaves the device. ═══
   A future endpoint plugs in at the marked line via sendBeacon. Never put keys here. */
window.bbEvents=window.bbEvents||[];
function bbTrack(ev,data){
 var row={ev:ev,data:data||null,t:new Date().toISOString()};
 window.bbEvents.push(row);
 try{var q=JSON.parse(localStorage.getItem('bb_events')||'[]');q.push(row);
 localStorage.setItem('bb_events',JSON.stringify(q.slice(-100)));}catch(e){}
 /* FUTURE: navigator.sendBeacon('<analytics-endpoint>', JSON.stringify(row)) */
}
document.addEventListener('click',function(e){
 var wa=e.target.closest('a[href*="wa.me"]');
 if(wa)bbTrack('whatsapp_cta_clicked',{href:wa.getAttribute('href').slice(0,90)});
 var shot=e.target.closest('.shot');
 if(shot)bbTrack('project_viewed',{site:(shot.getAttribute('href')||'').split('/').filter(Boolean).pop()});
});
if(themeBtn)themeBtn.addEventListener('click',function(){bbTrack('theme_switched')});
window.bbTrack=bbTrack;window.bbEsc=esc;
})();
