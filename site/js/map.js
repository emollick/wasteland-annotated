(function(){
  var D=window.WL; var card=document.getElementById('map-card');
  function show(g){
    var id=g.dataset.place; var info=(D.places.london[id]||D.places.world[id]); if(!info) return;
    var lines=(g.dataset.lines||'').split(',').filter(Boolean).map(Number);
    var html='<h3>'+info.label+'</h3>';
    if(lines.length){ html+=lines.map(function(n){ var l=D.lines[n-1]; return n>0&&l?'<a class="ln" href="index.html#L'+n+'"><span class="n">'+n+'</span>'+l.t.replace(/</g,'&lt;')+'</a>':''; }).join(''); }
    else html+='<p class="small">Not named in the poem: a place from Eliot’s life while he was writing it.</p>';
    card.innerHTML=html; card.hidden=false;
    document.querySelectorAll('.map .place.on').forEach(function(x){x.classList.remove('on')}); g.classList.add('on');
  }
  document.querySelectorAll('.map .place').forEach(function(g){ g.addEventListener('click',function(){show(g)}); g.addEventListener('mouseenter',function(){show(g)}); });
  if(location.hash){ var g=document.querySelector('.map .place[data-place="'+location.hash.slice(1)+'"]'); if(g){ show(g); g.scrollIntoView({block:'center'}); } }
})();
