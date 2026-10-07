/* The machine. Pick a problem and the parts of Business Booster that fix it light up. Cycles on its own until
   the first tap, only while on screen, never under reduced motion or in capture mode. */
(function(){
'use strict';
var root=document.getElementById('machine');if(!root)return;
/* the wall of real work loads after the first paint, so the headline never waits for it */
var bg=document.querySelector('.h5-bg');
function loadWall(){if(!bg||bg.dataset.on)return;bg.dataset.on='1';var imgs=[].slice.call(bg.querySelectorAll('img[data-src]')),left=imgs.length;imgs.forEach(function(i){i.onload=i.onerror=function(){if(--left<=6)bg.classList.add('ready')};if(i.dataset.srcset){i.sizes=i.dataset.sizes||'';i.srcset=i.dataset.srcset}i.src=i.dataset.src});setTimeout(function(){bg.classList.add('ready')},2500)}
if(document.readyState==='complete')setTimeout(loadWall,120);else addEventListener('load',function(){setTimeout(loadWall,120)});
var doc=document.documentElement,RM=doc.classList.contains('rm'),CAP=doc.classList.contains('cap');
var bbTrack=window.bbTrack||function(){};
var chips=[].slice.call(document.querySelectorAll('.pchip'));
var routes=[].slice.call(document.querySelectorAll('.route'));
var nodes=[].slice.call(root.querySelectorAll('[data-node]'));
var paths=[].slice.call(root.querySelectorAll('[data-path]'));
var pulses=[].slice.call(root.querySelectorAll('[data-pulse]'));
var live=document.getElementById('routes');
var keys=chips.map(function(c){return c.dataset.p});
var i=0,timer=null,touched=false,visible=true;
function show(k){
 chips.forEach(function(c){var on=c.dataset.p===k;c.classList.toggle('is-on',on);c.setAttribute('aria-pressed',on?'true':'false')});
 var r=null;routes.forEach(function(p){var on=p.dataset.p===k;p.hidden=!on;if(on)r=p});
 var set=r?(r.dataset.nodes||'').split(' '):[];
 nodes.forEach(function(n){n.classList.toggle('on',set.indexOf(n.dataset.node)>-1)});
 paths.forEach(function(p){p.classList.toggle('on',set.indexOf(p.dataset.path)>-1)});
 pulses.forEach(function(p){p.classList.toggle('on',set.indexOf(p.dataset.pulse)>-1)});
 root.classList.toggle('lit',set.length>0);
}
/* the cycle stops for good the moment a visitor touches, hovers the picker or tabs into the hero, so nothing
   changes under a finger that is reaching for a button (WCAG 2.2.2, and caught by the click path on 7 Oct) */
function stop(){touched=true;if(timer){clearInterval(timer);timer=null}}
var hero=root.closest('.pick');
if(hero){hero.addEventListener('pointerdown',stop,{passive:true});hero.addEventListener('focusin',stop)}
var pick=document.querySelector('.pchips');if(pick)pick.addEventListener('pointerenter',stop);
chips.forEach(function(c){c.addEventListener('click',function(){
 stop();
 i=keys.indexOf(c.dataset.p);show(c.dataset.p);
 if(live)live.setAttribute('aria-live','polite');
 bbTrack('hero_problem',{p:c.dataset.p});
})});
show(keys[0]);
var canAnimate=typeof root.pauseAnimations==='function';
if(RM||CAP){if(canAnimate)root.pauseAnimations();return}
if('IntersectionObserver' in window){new IntersectionObserver(function(es){visible=es[0].isIntersecting;if(canAnimate){visible?root.unpauseAnimations():root.pauseAnimations()}},{threshold:.15}).observe(root)}
timer=setInterval(function(){if(touched||document.hidden||!visible)return;i=(i+1)%keys.length;show(keys[i])},3800);
})();
