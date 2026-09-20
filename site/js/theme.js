(function(){
  var root=document.documentElement;
  function current(){ var t=root.dataset.theme; if(t) return t; return matchMedia('(prefers-color-scheme: dark)').matches?'violet':'paper'; }
  document.addEventListener('click',function(e){
    var b=e.target.closest('.theme'); if(!b) return;
    var next=current()==='violet'?'paper':'violet';
    root.dataset.theme=next; try{localStorage.setItem('wl-theme',next);}catch(err){}
  });
})();
