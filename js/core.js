/* Business Booster site: core engine. Theme switch, sticky nav with the travelling underline, reveals, drawer, ribbon, magnetic buttons, local events. Loaded on every page. */
(function(){
'use strict';
var doc=document.documentElement;
var RM=doc.classList.contains('rm');
if(location.hash.indexOf('capture')>-1)doc.classList.add('cap');
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
/* theme switch */
var metaTheme=document.getElementById('metaTheme');
function setThemeColor(){metaTheme.setAttribute('content',doc.getAttribute('data-theme')==='dark'?'#0b0b0d':'#faf9f6');}
setThemeColor();
var themeBtn=document.getElementById('themeBtn');
if(themeBtn)themeBtn.addEventListener('click',function(){
 var next=doc.getAttribute('data-theme')==='dark'?'light':'dark';
 doc.setAttribute('data-theme',next);
 try{localStorage.setItem('bb-theme',next)}catch(e){}
 setThemeColor();
});

/* sticky nav + reveals + scrub stack + hero watermark drift, one handler */
var nav=document.getElementById('nav');
var rv=[].slice.call(document.querySelectorAll('[data-rv]'));
var mark=document.getElementById('heroMark');
var navInd=document.getElementById('navInd'),navProg=document.getElementById('navProg');
var spyLinks=[].slice.call(document.querySelectorAll('[data-spy]'));
function frame(){
 nav.classList.toggle('stick',window.scrollY>8);
 var vh=window.innerHeight;
 /* reading progress along the nav */
 var doc=document.documentElement;
 var total=doc.scrollHeight-vh;
 navProg.style.transform='scaleX('+(total>0?Math.min(1,window.scrollY/total):0).toFixed(4)+')';
 /* scrollspy: the one underline travels to the section you are in */
 var current=null;
 spyLinks.forEach(function(a){
  var sec=document.getElementById(a.dataset.spy);
  if(sec&&sec.getBoundingClientRect().top<vh*.4)current=a;
 });
 spyLinks.forEach(function(a){a.classList.toggle('now',a===current)});
 if(!current)current=document.querySelector('.nav-links a[aria-current="page"]');
 if(current){
  navInd.classList.add('on');
  navInd.style.width=current.offsetWidth+'px';
  navInd.style.transform='translateX('+current.offsetLeft+'px)';
 }else{
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

/* drawer: slide, scrim, Escape, focus trap, scroll lock, focus return */
var drawer=document.getElementById('drawer'),scrim=document.getElementById('scrim'),
    hamb=document.getElementById('hamb'),closeBtn=document.getElementById('drawerClose'),
    lockY=0;
function openDrawer(){
 lockY=window.pageYOffset;
 document.body.classList.add('drawer-lock');
 document.body.style.top=(-lockY)+'px';
 drawer.removeAttribute('inert');
 drawer.classList.add('open');scrim.classList.add('open');
 hamb.setAttribute('aria-expanded','true');
 var first=drawer.querySelector('a,button');if(first)first.focus();
}
function closeDrawer(){
 drawer.classList.remove('open');scrim.classList.remove('open');
 drawer.setAttribute('inert','');
 document.body.classList.remove('drawer-lock');
 document.body.style.top='';
 window.scrollTo(0,lockY);
 hamb.setAttribute('aria-expanded','false');
 hamb.focus();
}
hamb.addEventListener('click',openDrawer);
closeBtn.addEventListener('click',closeDrawer);
scrim.addEventListener('click',closeDrawer);
drawer.querySelectorAll('nav a').forEach(function(a){a.addEventListener('click',closeDrawer);});
document.addEventListener('keydown',function(e){
 if(!drawer.classList.contains('open'))return;
 if(e.key==='Escape'){closeDrawer();return;}
 if(e.key!=='Tab')return;
 var f=[].slice.call(drawer.querySelectorAll('a,button')).filter(function(x){return x.offsetParent!==null});
 if(!f.length)return;
 var first=f[0],last=f[f.length-1];
 if(e.shiftKey&&document.activeElement===first){last.focus();e.preventDefault();}
 else if(!e.shiftKey&&document.activeElement===last){first.focus();e.preventDefault();}
});

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
