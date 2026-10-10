/* Pão da Dilma — efeitos visuais. Independente do app.js: se algo falhar, o app segue normal. */
(function(){
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function(s,r){return (r||document).querySelector(s)};

  /* 1) Vapor e farinha subindo no login */
  function steam(){
    var c=$('#fxCanvas'), auth=$('#authScreen'); if(!c||reduce) return;
    var x=c.getContext('2d'), W,H,dpr=Math.min(devicePixelRatio||1,2), P=[];
    function size(){W=c.width=innerWidth*dpr;H=c.height=innerHeight*dpr}
    size(); addEventListener('resize',size);
    function spawn(init){
      var flour=Math.random()<.45;
      return {x:Math.random()*W, y:init?Math.random()*H:H+40*dpr,
        r:(flour?1.2+Math.random()*2.2:40+Math.random()*70)*dpr,
        vy:(flour?.3+Math.random()*.7:.25+Math.random()*.5)*dpr,
        sw:Math.random()*Math.PI*2, f:flour,
        a:flour?.25+Math.random()*.5:.05+Math.random()*.06};
    }
    for(var i=0;i<46;i++) P.push(spawn(true));
    (function loop(){
      if(auth.classList.contains('hidden')){ requestAnimationFrame(loop); return; }
      x.clearRect(0,0,W,H);
      P.forEach(function(p,i){
        p.y-=p.vy; p.sw+=.01; p.x+=Math.sin(p.sw)*(p.f?.5:.35)*dpr;
        var life=p.y/H, al=p.a*Math.min(1,life*2.2);
        if(p.f){ x.fillStyle='rgba(255,236,200,'+al+')'; x.beginPath(); x.arc(p.x,p.y,p.r,0,6.3); x.fill(); }
        else{
          var g=x.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);
          g.addColorStop(0,'rgba(255,225,185,'+al+')'); g.addColorStop(1,'rgba(255,225,185,0)');
          x.fillStyle=g; x.beginPath(); x.arc(p.x,p.y,p.r,0,6.3); x.fill();
        }
        if(p.y<-p.r*2) P[i]=spawn(false);
      });
      requestAnimationFrame(loop);
    })();
  }

  /* 2) Monta a decoração do login e o brilho que segue o dedo */
  function loginFx(){
    var auth=$('#authScreen'); if(!auth) return;
    if(!$('#fxCanvas')){
      var cv=document.createElement('canvas'); cv.id='fxCanvas';
      var ov=document.createElement('div'); ov.className='fxOven';
      auth.insertBefore(ov,auth.firstChild); auth.insertBefore(cv,auth.firstChild);
    }
    steam();
    var card=$('.authCard',auth); if(!card) return;
    function move(e){
      var p=e.touches?e.touches[0]:e, r=card.getBoundingClientRect();
      card.style.setProperty('--mx',(p.clientX-r.left)+'px'); card.style.setProperty('--my',(p.clientY-r.top)+'px');
      if(!reduce && !e.touches){
        var rx=((p.clientY-r.top)/r.height-.5)*-5, ry=((p.clientX-r.left)/r.width-.5)*6;
        card.style.transform='perspective(900px) rotateX('+rx+'deg) rotateY('+ry+'deg)';
      }
    }
    card.addEventListener('pointermove',move);
    card.addEventListener('touchstart',function(e){card.classList.add('touch');move(e)},{passive:true});
    card.addEventListener('pointerleave',function(){card.style.transform=''});
    // botão carregando + tremor no erro
    var form=$('#loginForm'), btn=$('.authSubmit'), msg=$('#authMessage');
    if(form&&btn) form.addEventListener('submit',function(){btn.classList.add('loading')});
    if(msg) new MutationObserver(function(){
      if(msg.textContent.trim()){ btn&&btn.classList.remove('loading'); card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake'); }
    }).observe(msg,{childList:true,characterData:true,subtree:true});
  }

  /* 3) Entrada do app depois do login (com confete) */
  function appEntrance(){
    var app=$('#app'); if(!app) return;
    var was=app.classList.contains('hidden');
    new MutationObserver(function(){
      var now=app.classList.contains('hidden');
      if(was&&!now){ app.classList.remove('fxEnter'); void app.offsetWidth; app.classList.add('fxEnter'); confetti(40); placeGlow(); }
      was=now;
    }).observe(app,{attributes:true,attributeFilter:['class']});
  }

  /* 4) Confete (também disponível: window.fxConfetti(n)) */
  function confetti(n){
    if(reduce) return;
    var cols=['#ff9a3c','#f6d9a8','#c9762b','#fff2d6','#e8553d'];
    for(var i=0;i<(n||40);i++){
      var s=document.createElement('i'); s.className='fxConfetti';
      s.style.left=Math.random()*100+'vw'; s.style.background=cols[i%cols.length];
      s.style.setProperty('--x',(Math.random()*160-80)+'px');
      s.style.setProperty('--r',(Math.random()*900-450)+'deg');
      s.style.setProperty('--d',(1.8+Math.random()*1.6)+'s');
      s.style.animationDelay=Math.random()*.4+'s';
      document.body.appendChild(s); setTimeout(function(el){el.remove()},4200,s);
    }
  }
  window.fxConfetti=confetti;

  /* 5) Ripple em botões */
  document.addEventListener('pointerdown',function(e){
    if(reduce) return;
    var b=e.target.closest&&e.target.closest('button,.btn,.iconBtn'); if(!b||b.disabled) return;
    var r=b.getBoundingClientRect(), d=Math.max(r.width,r.height)*2, s=document.createElement('span');
    s.className='fxRipple'; s.style.width=s.style.height=d+'px';
    s.style.left=(e.clientX-r.left-d/2)+'px'; s.style.top=(e.clientY-r.top-d/2)+'px';
    if(getComputedStyle(b).position==='static') b.style.position='relative';
    b.appendChild(s); setTimeout(function(){s.remove()},650);
  },{passive:true});

  /* 6) Entrada escalonada a cada troca de tela */
  function contentFx(){
    var c=$('#content'); if(!c||reduce) return;
    new MutationObserver(function(list){
      var added=[]; list.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType===1) added.push(n)})});
      if(!added.length) return;
      var targets=added.length===1&&added[0].children.length>1?[].slice.call(added[0].children):added;
      targets.slice(0,14).forEach(function(el,i){ el.style.setProperty('--i',i); el.classList.remove('fxIn'); void el.offsetWidth; el.classList.add('fxIn'); });
    }).observe(c,{childList:true});
  }

  /* 7) Nav inferior: brilho deslizante no item ativo */
  var glow;
  function placeGlow(){
    var nav=$('.bottomNav'); if(!nav) return;
    if(!glow){glow=document.createElement('div');glow.className='navGlow';nav.insertBefore(glow,nav.firstChild)}
    var a=$('button.active',nav); if(!a) return;
    glow.style.width=a.offsetWidth+'px'; glow.style.transform='translateX('+a.offsetLeft+'px)';
  }
  function navFx(){
    var nav=$('.bottomNav'); if(!nav) return;
    new MutationObserver(placeGlow).observe(nav,{attributes:true,subtree:true,attributeFilter:['class']});
    addEventListener('resize',placeGlow); setTimeout(placeGlow,300);
  }

  /* 8) Sino balança e selos "pulam" quando o número muda */
  function badgeFx(){
    var bell=$('#notifyBtn');
    ['notifyCount','deliveryBadge'].forEach(function(id){
      var el=document.getElementById(id); if(!el) return;
      var last=el.textContent;
      new MutationObserver(function(){
        if(el.textContent===last) return; last=el.textContent;
        el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
        if(id==='notifyCount'&&bell&&parseInt(last,10)>0){bell.classList.remove('ring');void bell.offsetWidth;bell.classList.add('ring')}
      }).observe(el,{childList:true,characterData:true,subtree:true});
    });
    if(bell&&parseInt((document.getElementById('notifyCount')||{}).textContent,10)>0) bell.classList.add('ring');
  }

  /* 9) Topo ganha vidro ao rolar */
  function scrollFx(){
    var t=$('.topbar'); if(!t) return;
    addEventListener('scroll',function(){t.classList.toggle('scrolled',scrollY>8)},{passive:true});
  }

  function init(){ loginFx(); appEntrance(); contentFx(); navFx(); badgeFx(); scrollFx(); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
