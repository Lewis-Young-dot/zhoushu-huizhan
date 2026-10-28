const start=document.querySelector('#start');
const frame=document.querySelector('#gameframe');
const touchChoice=document.querySelector('#touch-mode');
const area=document.querySelector('#arena');
const query=new URLSearchParams(location.search);
// Windows Chrome/Edge report maxTouchPoints=10 without a touchscreen; rely on the primary pointer.
const iosDevice=/iPhone|iPad|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
touchChoice.checked=query.has('touch')?query.get('touch')==='1':matchMedia('(pointer:coarse)').matches||iosDevice;
document.querySelector('#guide').addEventListener('click',()=>{const panel=document.querySelector('#instructions');panel.hidden=!panel.hidden;if(!panel.hidden)panel.scrollIntoView({behavior:'smooth',block:'start'});});
start.addEventListener('click',()=>{
 document.querySelector('#landing').hidden=true;area.hidden=false;
 area.classList.toggle('touch-game',touchChoice.checked);document.body.classList.add('playing');
 // The landing artwork is hidden while playing; drop it so Safari can free the decoded image.
 const cover=document.querySelector('.art img');if(cover){cover.removeAttribute('src');cover.remove();}
 const extra=['ios','dpr'].filter(key=>query.has(key)).map(key=>'&'+key+'='+encodeURIComponent(query.get(key))).join('');
 frame.src='play/game.html?v=20261027b&touch='+(touchChoice.checked?'1':'0')+extra;frame.focus();
 document.querySelector('#tip').textContent=touchChoice.checked?'触屏摇杆 · 多指操作 · 建议横屏':'点击游戏画面开始操作 · Esc 暂停';
});
document.querySelector('#fullscreen').addEventListener('click',async()=>{
 try{
  if(document.fullscreenElement)await document.exitFullscreen();
  else if(area.requestFullscreen){await area.requestFullscreen();if(touchChoice.checked)try{await screen.orientation?.lock('landscape');}catch{}}
  else {area.classList.toggle('expanded');document.querySelector('#fullscreen').textContent=area.classList.contains('expanded')?'退出全屏':'全屏游玩';}
  frame.focus();
 }catch{area.classList.toggle('expanded');document.querySelector('#fullscreen').textContent=area.classList.contains('expanded')?'退出全屏':'全屏游玩';}
});
window.addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==frame.contentWindow)return;if(e.data?.type==='game-ready')document.querySelector('#tip').textContent=touchChoice.checked?'已加载 · 摇杆移动 · 按住术式蓄力 · 暂停可设置音乐':'已加载 · 点角色选择双方 · Esc 暂停 · 设置可关闭音乐';});
