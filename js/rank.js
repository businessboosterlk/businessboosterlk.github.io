/* Rank Yourself: the sixty second audit, the tabs, the quiz factory and the keyless Google PageSpeed scan. Loaded only on /rank/. */
(function(){
'use strict';
var doc=document.documentElement;
var RM=doc.classList.contains('rm');
if(location.hash.indexOf('capture')>-1)doc.classList.add('cap');
var bbTrack=window.bbTrack||function(){};
var curInd=null; /* industry mode was retired with the single page; the briefs still read it */
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
if(!document.getElementById('audBody'))return;
/* ═══ THE SIXTY SECOND AUDIT: deterministic scoring, honest labels ═══ */
var AQ=[
 {q:'How do most new customers find you today?',dim:'m',opts:[['Word of mouth only',0],['Social media, now and then',1],['Steady social plus some search',2],['A planned mix we measure',3]]},
 {q:'Which is closest to your website situation?',dim:'w',opts:[['We do not have one',0],['It exists but it is outdated',1],['Decent, but it brings no enquiries',2],['It converts visitors into enquiries',3]]},
 {q:'How does your social media actually run?',dim:'m',opts:[['Quiet for months',0],['We post when we remember',1],['Consistent but no real plan',2],['A strategy with a calendar',3]]},
 {q:'What happens when an enquiry comes in?',dim:'o',opts:[['Honestly, some slip through',0],['We reply when we can',1],['Same day, usually',2],['Within minutes, and it is tracked',3]]},
 {q:'How do you follow up with people who did not buy yet?',dim:'o',opts:[['We do not',0],['From memory',1],['A spreadsheet or a notebook',2],['A system chases them for us',3]]},
 {q:'How do you know if your marketing worked last month?',dim:'m',opts:[['We do not really know',0],['Likes and follower counts',1],['We check a few numbers sometimes',2],['The same report every month',3]]},
 {q:'How much of your admin is still manual?',dim:'o',opts:[['Nearly all of it',0],['Most of it',1],['Some tools, some paper',2],['Mostly systemised',3]]}
];
var ARECS=[
 'Build one reliable acquisition channel instead of waiting on referrals.',
 'Your website is the leak. A page that converts pays for itself first.',
 'Put a strategy and a calendar behind the posting so it sells rather than decorates.',
 'Speed to lead. The fastest reply usually wins the job.',
 'Follow-up is where money hides. A chase system recovers the quiet leads.',
 'Report the same numbers every month so you know what actually worked.',
 'Systemise the admin so the team spends its week selling, not typing.'
];
var ASVC={m:'Attract: the marketing retainer',w:'Convert: a website that sells',o:'Automate: digital staff'};
var audBody=document.getElementById('audBody'),audFill=document.getElementById('audFill'),
    audBack=document.getElementById('audBack'),ans=[],aStep=0,aStarted=false;
function audRender(i,focus){
 aStep=i;
 audFill.style.width=((i/AQ.length)*100)+'%';
 audBack.classList.toggle('show',i>0);
 var Q=AQ[i];
 audBody.innerHTML='<div class="aud-q"><p class="aud-step">Question '+(i+1)+' of '+AQ.length+'</p><h3>'+esc(Q.q)+'</h3>'+
  '<div class="aud-opts">'+Q.opts.map(function(o,j){return '<button class="aud-opt" data-j="'+j+'">'+esc(o[0])+'</button>'}).join('')+'</div></div>';
 if(focus){var f=audBody.querySelector('.aud-opt');if(f)f.focus();}
}
audBody.addEventListener('click',function(e){
 var b=e.target.closest('.aud-opt');if(!b)return;
 if(!aStarted){aStarted=true;bbTrack('audit_started');}
 ans[aStep]=+AQ[aStep].opts[+b.dataset.j][1];
 if(aStep+1<AQ.length)audRender(aStep+1,true);else audResult();
});
audBack.addEventListener('click',function(){if(aStep>0)audRender(aStep-1,true)});
function pct(sum,max){return Math.round(sum/max*100)}
function audResult(){
 audFill.style.width='100%';
 audBack.classList.remove('show');
 var m=0,w=0,o=0;
 AQ.forEach(function(Q,i){var s=ans[i]||0;if(Q.dim==='m')m+=s;if(Q.dim==='w')w+=s;if(Q.dim==='o')o+=s;});
 var mp=pct(m,9),wp=pct(w,3),op=pct(o,9);
 var overall=Math.round((m+w+o)/21*100);
 var worst=AQ.map(function(Q,i){return [ans[i]||0,i]}).sort(function(a,b){return a[0]-b[0]}).slice(0,3).map(function(x){return x[1]});
 var pillars={m:mp,w:wp,o:op};
 var low='m';if(wp<pillars[low])low='w';if(op<pillars[low])low='o';
 bbTrack('audit_completed',{overall:overall,m:mp,w:wp,o:op,rec:low});
 audBody.innerHTML='<div class="aud-q">'+
  '<p class="aud-step">Your indicative growth score</p>'+
  '<div class="aud-score"><span class="n">'+overall+'</span><span class="of">out of 100</span></div>'+
  '<div class="aud-bars">'+
   '<div class="aud-bar"><span>Marketing</span><span class="t"><span class="f" style="width:'+mp+'%"></span></span><b>'+mp+'%</b></div>'+
   '<div class="aud-bar"><span>Website</span><span class="t"><span class="f" style="width:'+wp+'%"></span></span><b>'+wp+'%</b></div>'+
   '<div class="aud-bar"><span>Operations</span><span class="t"><span class="f" style="width:'+op+'%"></span></span><b>'+op+'%</b></div>'+
  '</div>'+
  '<h3 style="font-size:17px;margin-bottom:12px">Your three biggest gaps</h3>'+
  '<ul class="aud-recs">'+worst.map(function(i){return '<li>'+esc(ARECS[i])+'</li>'}).join('')+'</ul>'+
  '<p style="margin-top:18px;font-size:14px;color:var(--muted)">Where we would start: <span class="aud-svc">'+esc(ASVC[low])+'</span></p>'+
  '<p class="aud-note">An indicative read from seven answers, not a measured result and not a guarantee. The real audit happens in a conversation.</p>'+
  '<div class="aud-brief">'+
   '<h3 style="font-size:16px">Send this audit to us, filled in</h3>'+
   '<div class="ins">'+
    '<input class="aud-in" id="abName" placeholder="Business name (optional)" maxlength="80" autocomplete="organization">'+
    '<input class="aud-in" id="abUrl" placeholder="Website, if you have one (optional)" maxlength="120" inputmode="url">'+
   '</div>'+
   '<div class="aud-actions">'+
    '<a class="btn btn-solid" id="abSend" href="#" target="_blank" rel="noopener">Send my audit on WhatsApp</a>'+
    '<button class="aud-restart" id="abRestart">Start over</button>'+
   '</div>'+
  '</div></div>';
 document.getElementById('abRestart').addEventListener('click',function(){ans=[];aStarted=false;bbTrack('audit_restarted');audRender(0,true)});
 document.getElementById('abSend').addEventListener('click',function(ev){
  var nameEl=document.getElementById('abName'),urlEl=document.getElementById('abUrl');
  var nm=nameEl.value.replace(/[\r\n<>]/g,' ').trim().slice(0,80);
  var raw=urlEl.value.trim();
  var site='';
  urlEl.classList.remove('bad');
  if(raw){
   if(!/^https?:\/\//i.test(raw))raw='https://'+raw;
   if(/^https?:\/\/[a-z0-9][a-z0-9.-]*\.[a-z]{2,}([\/?#][^\s]*)?$/i.test(raw)){site=raw.slice(0,120)}
   else{urlEl.classList.add('bad');ev.preventDefault();urlEl.focus();return;}
  }
  var lines=['Hi Business Booster. I ran the sixty second audit.'];
  if(nm)lines.push('Business: '+nm);
  if(curInd)lines.push('Industry: '+curInd);
  if(site)lines.push('Website: '+site);
  lines.push('Growth score: '+overall+'/100 (marketing '+mp+'%, website '+wp+'%, operations '+op+'%)');
  lines.push('Biggest gaps: '+worst.map(function(i,k){return (k+1)+') '+ARECS[i]}).join(' '));
  lines.push('Recommended start: '+ASVC[low]);
  lines.push('Can we talk?');
  this.href='https://wa.me/94767412531?text='+encodeURIComponent(lines.join('\n'));
  bbTrack('whatsapp_brief_generated',{score:overall,rec:low});
 });
}
audRender(0,false);

/* ═══ RANK YOURSELF: tabs ═══ */
var RTABS=[].slice.call(document.querySelectorAll('.rtab'));
function showTab(k){
 RTABS.forEach(function(t){var on=t.dataset.tab===k;t.classList.toggle('on',on);t.setAttribute('aria-selected',on?'true':'false')});
 ['web','seo','social','ops','full'].forEach(function(id){document.getElementById('rp-'+id).hidden=(id!==k)});
 bbTrack('rank_tab',{tab:k});
}
RTABS.forEach(function(t){t.addEventListener('click',function(){showTab(t.dataset.tab);if(history.replaceState)history.replaceState(null,'','#'+t.dataset.tab)})});
function tabFromHash(){var h=location.hash.replace('#','');if(['web','seo','social','ops','full'].indexOf(h)>-1)showTab(h)}
tabFromHash();addEventListener('hashchange',tabFromHash);

/* ═══ RANK YOURSELF: quiz factory (social and systems lanes) ═══ */
function stripDash(s){return String(s).replace(/[—–]/g,',')}
function mountQuiz(panel,spec){
 var body=panel.querySelector('[data-qbody]'),fill=panel.querySelector('[data-qfill]'),back=panel.querySelector('[data-qback]');
 var st=0,an=[],started=false;
 function rend(i,focus){
  st=i;fill.style.width=(i/spec.qs.length*100)+'%';back.classList.toggle('show',i>0);
  var Q=spec.qs[i];
  body.innerHTML='<div class="aud-q"><p class="aud-step">Question '+(i+1)+' of '+spec.qs.length+'</p><h3>'+esc(Q.q)+'</h3><div class="aud-opts'+(Q.rate?' rate':'')+'">'+
   Q.opts.map(function(o,j){return '<button class="aud-opt" data-j="'+j+'">'+esc(o[0])+'</button>'}).join('')+'</div>'+
   (Q.rate?'<div class="rate-ends" aria-hidden="true"><span>Being honest, weak</span><span>Genuinely strong</span></div>':'')+'</div>';
  if(focus){var f=body.querySelector('.aud-opt');if(f)f.focus();}
 }
 function res(){
  fill.style.width='100%';back.classList.remove('show');
  var sum=an.reduce(function(a,b){return a+b},0),score=Math.round(sum/(spec.qs.length*3)*100);
  var worst=an.map(function(s,i){return [s,i]}).sort(function(a,b){return a[0]-b[0]}).slice(0,spec.gaps||2).map(function(x){return x[1]});
  bbTrack('rank_completed',{lane:spec.key,score:score});
  body.innerHTML='<div class="aud-q"><p class="aud-step">'+esc(spec.label)+', indicative score</p>'+
   '<div class="aud-score"><span class="n">'+score+'</span><span class="of">out of 100</span></div>'+
   '<h3 style="font-size:17px;margin:16px 0 12px">Where it leaks</h3>'+
   '<ul class="aud-recs">'+worst.map(function(i){return '<li>'+esc(spec.qs[i].rec)+'</li>'}).join('')+'</ul>'+
   '<p class="aud-note">'+esc(spec.note)+'</p>'+spec.extraHtml+
   '<div class="aud-actions"><a class="btn btn-solid" data-send href="#" target="_blank" rel="noopener">'+esc(spec.cta)+'</a><button class="aud-restart" data-restart>Start over</button></div></div>';
  body.querySelector('[data-restart]').addEventListener('click',function(){an=[];started=false;rend(0,true)});
  body.querySelector('[data-send]').addEventListener('click',function(){
   var exEl=body.querySelector('[data-extra]');
   var exVal=exEl?exEl.value.replace(/[\r\n<>]/g,' ').trim().slice(0,60):'';
   var lines=[spec.msg0];
   if(exVal)lines.push(spec.extraLabel+': '+exVal);
   if(curInd)lines.push('Industry: '+curInd);
   lines.push('Score: '+score+'/100');
   lines.push('Gaps: '+worst.map(function(i,k){return (k+1)+') '+spec.qs[i].rec}).join(' '));
   lines.push('Can we talk?');
   this.href='https://wa.me/94767412531?text='+encodeURIComponent(lines.join('\n'));
   bbTrack('whatsapp_brief_generated',{lane:spec.key,score:score});
  });
 }
 body.addEventListener('click',function(e){
  var b=e.target.closest('.aud-opt');if(!b)return;
  if(!started){started=true;bbTrack('rank_started',{lane:spec.key});}
  an[st]=+spec.qs[st].opts[+b.dataset.j][1];
  if(st+1<spec.qs.length)rend(st+1,true);else res();
 });
 back.addEventListener('click',function(){if(st>0)rend(st-1,true)});
 rend(0,false);
}
mountQuiz(document.getElementById('rp-social'),{
 key:'marketing',label:'Marketing',cta:'Send my score on WhatsApp',gaps:3,
 msg0:'Hi Business Booster. I ranked my marketing on your site.',extraLabel:'Handle',
 note:'A self-read of your marketing maturity, not platform data. Nobody outside the platforms can scan your account numbers without access, and anyone who claims to is guessing.',
 extraHtml:'<div class="ins" style="grid-template-columns:1fr"><input class="aud-in" data-extra placeholder="Your Instagram or page name (optional)" maxlength="60"></div><p class="aud-note">Want the real ranking? Send the handle and a human on our team scores your profile against three nearby competitors within a day. No charge and no obligation.</p>',
 qs:[
  {q:'Do you know exactly who your ideal customer is?',rec:'Without a written ideal customer, every post and every rupee is aimed at everyone, which is nobody.',opts:[['Never really thought about it',0],['A rough sense, in our heads',1],['Written down once, never used',2],['A written profile the whole team sells to',3]]},
  {q:'Do you plan the year in quarters?',rec:'Quarter plans with numbers turn marketing from activity into a campaign with a scoreboard.',opts:[['We run week to week',0],['A yearly wish list',1],['Loose quarterly goals',2],['Quarterly plans with numbers we review',3]]},
  {q:'Is there a written marketing strategy?',rec:'Strategy comes first. Content without one is decoration, however good it looks.',opts:[['No',0],['In the owner\'s head',1],['A document nobody opens',2],['A strategy the content actually follows',3]]},
  {q:'Rate your social media presence, honestly.',rate:true,rec:'A presence you rate below four is costing attention every single day. Consistency and a plan lift it fastest.',opts:[['1',0],['2',0.75],['3',1.5],['4',2.25],['5',3]]},
  {q:'Rate the videos you put out.',rate:true,rec:'Video carries reach in Sri Lanka right now. Weak video, or none, caps everything else you post.',opts:[['1',0],['2',0.75],['3',1.5],['4',2.25],['5',3]]},
  {q:'Rate the design of your posts.',rate:true,rec:'Design is the first trust signal. Posts that look homemade price you as homemade.',opts:[['1',0],['2',0.75],['3',1.5],['4',2.25],['5',3]]},
  {q:'Do you put money behind the good posts?',rec:'Organic alone caps out. Small, tracked boosts move the winners further.',opts:[['Never',0],['We boost randomly',1],['Regular small boosts',2],['Planned campaigns with tracking',3]]},
  {q:'Do you know what marketing achieved last month?',rec:'If it is not measured monthly, it cannot be managed.',opts:[['No idea',0],['Likes and follower counts',1],['We glance at reach',2],['The same report every month',3]]}
 ]
});
mountQuiz(document.getElementById('rp-ops'),{
 key:'ops',label:'Systems',cta:'Send my score on WhatsApp',
 msg0:'Hi Business Booster. I ranked my business systems on your site.',extraLabel:'Business',
 note:'An indication from four answers. The real read takes one conversation about how work actually moves through your business.',
 extraHtml:'',
 qs:[
  {q:'What happens when an enquiry comes in?',rec:'Speed to lead. The fastest reply usually wins the job.',opts:[['Some slip through, honestly',0],['We reply when we can',1],['Same day, usually',2],['Within minutes, and tracked',3]]},
  {q:'Who chases the people who went quiet?',rec:'Follow-up is where money hides. A system never forgets.',opts:[['Nobody',0],['Whoever remembers',1],['A spreadsheet reminds us',2],['A system chases automatically',3]]},
  {q:'How are payments and fees tracked?',rec:'Money tracked by memory leaks. A ledger with reminders does not.',opts:[['Memory and messages',0],['A notebook',1],['Spreadsheets',2],['A system with reminders',3]]},
  {q:'How much of the weekly admin is manual?',rec:'Systemise the admin so the team spends its week selling, not typing.',opts:[['Nearly all of it',0],['Most of it',1],['Some tools, some paper',2],['Mostly systemised',3]]}
 ]
});

/* ═══ RANK YOURSELF: the real Google scan (PageSpeed Insights, keyless, no secrets) ═══ */
var scanCache={};
function normUrl(raw){
 raw=(raw||'').trim();
 if(!raw)return null;
 if(!/^https?:\/\//i.test(raw))raw='https://'+raw;
 return /^https?:\/\/[a-z0-9][a-z0-9.-]*\.[a-z]{2,}([\/?#][^\s]*)?$/i.test(raw)?raw.slice(0,200):null;
}
function runScan(mode){
 var inEl=document.getElementById(mode==='web'?'scanUrl':'scanUrlSeo');
 var out=document.getElementById(mode==='web'?'scanOut':'scanOutSeo');
 var url=normUrl(inEl.value);
 inEl.classList.toggle('bad',!url);
 if(!url){inEl.focus();return;}
 bbTrack('scan_started',{mode:mode});
 out.innerHTML='<div class="scan-wait"><p class="msg" data-m>Asking Google to load your site on a mid-range phone. Give it half a minute.</p><div class="t"><div class="f" data-f></div></div></div>';
 var f=out.querySelector('[data-f]'),msgEl=out.querySelector('[data-m]');
 var msgs=['Google is loading the page on a simulated phone...','Measuring speed, layout shifts and tap targets...','Running the SEO and accessibility checks...','Nearly done, packaging the report...'];
 var mi=-1;
 var tick=setInterval(function(){mi=Math.min(mi+1,msgs.length-1);msgEl.textContent=msgs[mi];f.style.width=Math.min(88,18+mi*20)+'%';},6000);
 f.style.width='10%';
 var api='https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url='+encodeURIComponent(url)+
  '&strategy=mobile&category=PERFORMANCE&category=SEO&category=ACCESSIBILITY&category=BEST_PRACTICES';
 var ctrl=('AbortController' in window)?new AbortController():null;
 var to=setTimeout(function(){if(ctrl)ctrl.abort()},75000);
 (scanCache[url]?Promise.resolve(scanCache[url]):fetch(api,ctrl?{signal:ctrl.signal}:{}).then(function(r){
   if(!r.ok)throw new Error('HTTP '+r.status);return r.json()}))
 .then(function(d){
  scanCache[url]=d;clearTimeout(to);clearInterval(tick);
  renderScan(mode,out,url,d);bbTrack('scan_completed',{mode:mode});
 })
 .catch(function(){
  clearTimeout(to);clearInterval(tick);bbTrack('scan_failed',{mode:mode});
  out.innerHTML='<div class="scan-wait"><p class="msg"><b>Google would not run the test just now.</b> That happens when the free service is busy or the address does not load. Send us the address and a human runs the full report for you, no charge.</p>'+
   '<div class="aud-actions" style="margin-top:14px"><a class="btn btn-solid" target="_blank" rel="noopener" href="https://wa.me/94767412531?text='+
   encodeURIComponent('Hi Business Booster. Please run a website report on '+url+' for me.')+'">Ask us to run it</a></div></div>';
 });
}
function renderScan(mode,out,url,d){
 var lr=d.lighthouseResult||{},cats=lr.categories||{},audits=lr.audits||{};
 function sc(k){var c=cats[k];return (c&&typeof c.score==='number')?Math.round(c.score*100):null}
 function fails(cat,n){
  var c=cats[cat];if(!c)return[];
  return (c.auditRefs||[]).filter(function(r){var a=audits[r.id];
    return a&&typeof a.score==='number'&&a.score<0.9&&(r.weight||0)>0})
   .sort(function(x,y){return (y.weight||0)-(x.weight||0)}).slice(0,n)
   .map(function(r){return stripDash(audits[r.id].title)});
 }
 var P=sc('performance'),S=sc('seo'),A=sc('accessibility'),B=sc('best-practices');
 var src='<p class="scan-src">Scores from Google PageSpeed Insights, mobile test, run just now on '+esc(url)+'. Google\'s numbers, shown as received.</p>';
 var html;
 if(mode==='web'){
  var list=fails('performance',4).concat(fails('seo',2));
  html='<div class="scan-res">'+src+
   '<div class="scan-grid">'+
    '<div class="scan-cell"><span class="n">'+(P===null?'?':P)+'</span><span class="l">Speed</span></div>'+
    '<div class="scan-cell"><span class="n">'+(S===null?'?':S)+'</span><span class="l">SEO basics</span></div>'+
    '<div class="scan-cell"><span class="n">'+(A===null?'?':A)+'</span><span class="l">Accessibility</span></div>'+
    '<div class="scan-cell"><span class="n">'+(B===null?'?':B)+'</span><span class="l">Best practice</span></div>'+
   '</div>'+
   (list.length?'<h3 style="font-size:16px;margin:20px 0 0">What Google flagged</h3><ul class="scan-fails">'+list.map(function(t){return '<li>'+esc(t)+'</li>'}).join('')+'</ul>':'')+
   '<p class="aud-note">A lab test of one page, not a full audit. Numbers vary run to run. What it cannot see: your rankings, your traffic or whether the page actually sells.</p>';
 }else{
  var list2=fails('seo',6);
  html='<div class="scan-res">'+src+
   '<div class="aud-score"><span class="n">'+(S===null?'?':S)+'</span><span class="of">technical SEO, out of 100</span></div>'+
   (list2.length?'<h3 style="font-size:16px;margin:18px 0 0">What Google flagged</h3><ul class="scan-fails">'+list2.map(function(t){return '<li>'+esc(t)+'</li>'}).join('')+'</ul>':'<p style="margin-top:16px;color:var(--muted);font-size:14.5px">Google found no technical SEO faults on this page. The next questions are rankings and content, which need a manual look.</p>')+
   '<p class="aud-note">Technical checks on one page only. Rankings, traffic and content quality are invisible from outside. That part of the audit is human work, and we do it free.</p>';
 }
 var msg='Hi Business Booster. Google just scored my site on your page.\nWebsite: '+url+
  '\nSpeed '+(P===null?'na':P)+'/100, SEO '+(S===null?'na':S)+'/100, Accessibility '+(A===null?'na':A)+'/100, Best practice '+(B===null?'na':B)+'/100'+
  (curInd?'\nIndustry: '+curInd:'')+'\nCan you go through it with me?';
 html+='<div class="aud-actions" style="margin-top:18px"><a class="btn btn-solid" data-scansend target="_blank" rel="noopener" href="https://wa.me/94767412531?text='+encodeURIComponent(msg)+'">Go through this with us</a><button class="aud-restart" data-again>Scan another site</button></div></div>';
 out.innerHTML=html;
 out.querySelector('[data-again]').addEventListener('click',function(){out.innerHTML='';});
 out.querySelector('[data-scansend]').addEventListener('click',function(){bbTrack('whatsapp_brief_generated',{lane:mode,url:url})});
}
document.getElementById('scanGo').addEventListener('click',function(){runScan('web')});
document.getElementById('scanGoSeo').addEventListener('click',function(){runScan('seo')});
document.getElementById('scanUrl').addEventListener('keydown',function(e){if(e.key==='Enter')runScan('web')});
document.getElementById('scanUrlSeo').addEventListener('keydown',function(e){if(e.key==='Enter')runScan('seo')});

})();
