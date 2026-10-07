/* The systems store filter bar. No JavaScript: every system shows. */
(function(){
'use strict';
var bar=document.getElementById('storeFilter');if(!bar)return;
var bbTrack=window.bbTrack||function(){};
var cards=[].slice.call(document.querySelectorAll('.sysgrid [data-status]'));
var count=document.getElementById('storeCount');
var chips=[].slice.call(bar.querySelectorAll('[data-f]'));
function apply(f){
 chips.forEach(function(x){var on=x.dataset.f===f;x.classList.toggle('is-on',on);x.setAttribute('aria-pressed',on?'true':'false')});
 var n=0;cards.forEach(function(c){var on=f==='all'||c.dataset.status===f;c.hidden=!on;if(on)n++});
 if(count)count.textContent=n+' of '+cards.length+' systems';
}
bar.addEventListener('click',function(e){var b=e.target.closest('[data-f]');if(!b)return;apply(b.dataset.f);bbTrack('store_filter',{f:b.dataset.f})});
apply('all');
})();
