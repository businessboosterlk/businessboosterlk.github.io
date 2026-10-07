/* The check-up: five questions in, a prescription out. Loaded only on /check-up/. */
(function(){
'use strict';
var doc=document.documentElement;
var RM=doc.classList.contains('rm');
if(location.hash.indexOf('capture')>-1)doc.classList.add('cap');
var bbTrack=window.bbTrack||function(){};
var curInd=null; /* industry mode was retired with the single page; the briefs still read it */
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
if(!document.getElementById('cuBody'))return;
/* ═══ THE CHECK-UP: five questions in, a prescription out ═══ */
var CUQ=[
 {q:'Where does your business stand online today?',opts:[
  ['No website at all',{web:3,seo:1}],
  ['A website, but it is old',{web:2,seo:1}],
  ['A decent site that brings no enquiries',{web:1,seo:2}],
  ['A strong site that converts',{}]]},
 {q:'How do enquiries arrive right now?',opts:[
  ['Walk-ins and phone calls only',{mkt:3}],
  ['Social media messages, sometimes',{mkt:2}],
  ['A steady flow from social',{mkt:1}],
  ['From search, social and ads together',{}]]},
 {q:'What happens after an enquiry comes in?',opts:[
  ['We answer it, and that is it',{ops:3}],
  ['Someone follows up when they are free',{ops:2}],
  ['Tracked in a spreadsheet',{ops:1}],
  ['A system tracks and chases everything',{}]]},
 {q:'Can new customers find you on Google?',opts:[
  ['No idea, honestly',{seo:2}],
  ['We are hard to find',{seo:3}],
  ['Only if they search our name',{seo:2}],
  ['We show up for what we sell',{}]]},
 {q:'What matters most in the next six months?',opts:[
  ['More enquiries coming in',{mkt:1}],
  ['Looking as good as we actually are',{web:1}],
  ['Stopping the follow-up leaks',{ops:1}],
  ['All of it, frankly',{mkt:1,web:1,ops:1}]]}
];
var CUPLAN={
 web:{name:'A website that converts',why:'Right now your online front door is costing you enquiries. This is the first fix because everything else sends people to it.',link:'/websites/#work',ll:'See the sites we build'},
 mkt:{name:'The marketing retainer',why:'Attention is the raw material of growth and yours is arriving by luck. Planned content plus tracked reach changes that.',link:'/production/',ll:'See how production works'},
 seo:{name:'SEO from the foundations',why:'People are searching for what you sell and finding someone else. Search compounds, so the sooner it starts the more it pays.',link:'/seo/',ll:'See how SEO works'},
 ops:{name:'Digital staff for follow-up',why:'Enquiries are leaking after they arrive. A system that chases and remembers turns the leads you already get into revenue.',link:'/systems/',ll:'See the systems'}
};
var cuBody=document.getElementById('cuBody'),cuFill=document.getElementById('cuFill'),cuBack=document.getElementById('cuBack');
var cuAns=[],cuStep=0,cuStarted=false;
function cuRender(i,focus){
 cuStep=i;
 cuFill.style.width=(i/CUQ.length*100)+'%';
 cuBack.classList.toggle('show',i>0);
 var Q=CUQ[i];
 cuBody.innerHTML='<div class="aud-q"><p class="aud-step">Question '+(i+1)+' of '+CUQ.length+'</p><h3>'+esc(Q.q)+'</h3><div class="aud-opts">'+
  Q.opts.map(function(o,j){return '<button class="aud-opt" data-j="'+j+'">'+esc(o[0])+'</button>'}).join('')+'</div></div>';
 if(focus){var f=cuBody.querySelector('.aud-opt');if(f)f.focus();}
}
cuBody.addEventListener('click',function(e){
 var b=e.target.closest('.aud-opt');if(!b)return;
 if(!cuStarted){cuStarted=true;bbTrack('checkup_started');}
 cuAns[cuStep]=CUQ[cuStep].opts[+b.dataset.j][1];
 if(cuStep+1<CUQ.length)cuRender(cuStep+1,true);else cuResult();
});
cuBack.addEventListener('click',function(){if(cuStep>0)cuRender(cuStep-1,true)});
function cuResult(){
 cuFill.style.width='100%';cuBack.classList.remove('show');
 var need={web:0,mkt:0,seo:0,ops:0};
 cuAns.forEach(function(a){for(var k in a)need[k]+=a[k]});
 var order=Object.keys(need).filter(function(k){return need[k]>0}).sort(function(a,b){return need[b]-need[a]}).slice(0,3);
 bbTrack('checkup_completed',{plan:order.join(',')});
 var inner;
 if(!order.length){
  inner='<p style="color:var(--muted)">Honestly? Your answers say the foundations are in place. What usually helps a business at your stage is sharper strategy and better measurement, and that conversation is free.</p>';
 }else{
  inner='<ul class="aud-recs" style="margin-top:16px">'+order.map(function(k,i){var P=CUPLAN[k];
   return '<li><b style="color:var(--ink)">'+(i+1)+'. '+esc(P.name)+'</b><br>'+esc(P.why)+' <a class="go" style="font-size:13px;margin-top:6px" href="'+P.link+'">'+esc(P.ll)+'</a></li>'}).join('')+'</ul>';
 }
 var msg='Hi Business Booster. I did the check-up on your site.\nMy prescription: '+
  (order.length?order.map(function(k,i){return (i+1)+') '+CUPLAN[k].name}).join(' '):'foundations look fine, talk strategy')+
  (curInd?'\nIndustry: '+curInd:'')+'\nTalk me through it?';
 cuBody.innerHTML='<div class="aud-q"><p class="aud-step">Your prescription, in order</p>'+inner+
  '<p class="aud-note">A prescription from five answers is a starting point, not a diagnosis. The full check-up is a conversation, and it costs nothing.</p>'+
  '<p class="aud-note">And notice what just happened: this page listened, worked out what you need and wrote the message for you. That is exactly what our digital staff do for YOUR customers.</p>'+
  '<div class="aud-actions"><a class="btn btn-solid" target="_blank" rel="noopener" href="https://wa.me/94767412531?text='+encodeURIComponent(msg)+'">Send my plan to the team</a><button class="aud-restart" id="cuAgain">Start over</button></div></div>';
 document.getElementById('cuAgain').addEventListener('click',function(){cuAns=[];cuStarted=false;bbTrack('checkup_restarted');cuRender(0,true)});
 bbTrack('whatsapp_brief_generated',{lane:'checkup'});
}
cuRender(0,false);

})();
