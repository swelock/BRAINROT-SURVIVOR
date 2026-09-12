import {assets} from './systems/AssetManager.js';
import {SaveSystem} from './systems/SaveSystem.js';
import {AudioSystem} from './systems/AudioSystem.js';
import {Game} from './game/Game.js';
import {Renderer} from './game/Renderer.js';
import {UIManager} from './ui/UIManager.js';
const testMode=new URLSearchParams(location.search).has('test');
let storage;try{storage=window.localStorage;}catch{storage={getItem(){throw Error('Unavailable');},setItem(){throw Error('Unavailable');}};}
if(testMode){let value=null;storage={getItem:()=>value,setItem:(k,v)=>{value=v;}};}
const store=new SaveSystem(storage),audio=new AudioSystem(store.data.settings);
let ui;
const game=new Game(store.data,{audio,onEvent:(type,data)=>{if(type==='state')ui?.render();if(type==='announce')ui?.toast(data.type,data.value);if(type==='save')store.write();if(type==='end'){ui.render();if(!data.victory)setTimeout(()=>{if(game.state==='GAME_OVER'){game.state='RESULTS';ui.render();}},1150);}}});
const renderer=new Renderer(document.querySelector('#game'),game);ui=new UIManager(game,store);ui.render();Promise.all([assets.preload(),assets.preloadMotion()]).then(()=>ui.render());
const keys=new Set();let touch={x:0,y:0};
window.addEventListener('keydown',e=>{if(e.code!=='Escape'&&['INPUT','SELECT','TEXTAREA'].includes(document.activeElement?.tagName))return;const controlled=['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','ShiftLeft','ShiftRight','Escape'];if(controlled.includes(e.code)&&game.active())e.preventDefault();keys.add(e.code);if(!e.repeat){if(e.code==='Escape'){if(game.active())game.pause();else if(game.state==='PAUSED')game.resume();else if(game.state==='SETTINGS')ui.action('settingsBack');else if(['UPGRADES','STATS','CHARACTER_SELECT'].includes(game.state))ui.show('MENU');}if(['Space','ShiftLeft','ShiftRight'].includes(e.code)&&game.active())game.input.dash=true;if(game.state==='LEVEL_UP'&&['Digit1','Digit2','Digit3'].includes(e.code))game.choose(Number(e.code.slice(-1))-1);}});
window.addEventListener('keyup',e=>keys.delete(e.code));
function release(){keys.clear();stickPointer=null;lastStickTap=-Infinity;touch={x:0,y:0};game.input={x:0,y:0,dash:false};document.querySelector('#stick i').style.transform='';game.pause();}
window.addEventListener('blur',release);window.addEventListener('touchcancel',release);for(const event of ['contextmenu','dragstart','selectstart'])document.addEventListener(event,e=>{if(game.active())e.preventDefault();});document.addEventListener('visibilitychange',()=>{if(document.hidden)release();});window.addEventListener('resize',()=>renderer.resize());
const stick=document.querySelector('#stick');let stickPointer=null,lastStickTap=-Infinity;
function moveStick(e){if(e.pointerId!==stickPointer)return;const r=stick.getBoundingClientRect();let x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;const d=Math.hypot(x,y);if(d>38){x=x/d*38;y=y/d*38;}touch={x:x/38,y:y/38};stick.querySelector('i').style.transform=`translate(${x}px,${y}px)`;}
stick.addEventListener('pointerdown',e=>{if(stickPointer!==null)return;const now=performance.now();if(now-lastStickTap<280&&game.active()&&game.player.dashTimer<=0){game.input.dash=true;lastStickTap=-Infinity;}else lastStickTap=now;stickPointer=e.pointerId;if(e.isTrusted)stick.setPointerCapture(e.pointerId);moveStick(e);});stick.addEventListener('pointermove',moveStick);for(const type of ['pointerup','pointercancel','lostpointercapture'])stick.addEventListener(type,()=>{if(type==='pointercancel')lastStickTap=-Infinity;stickPointer=null;touch={x:0,y:0};stick.querySelector('i').style.transform='';});document.querySelector('#touchDash').addEventListener('pointerdown',e=>{e.preventDefault();game.input.dash=true;audio.init();});
let last=performance.now(),accumulator=0,hudTime=0;
function frame(now){const dt=Math.min(.1,(now-last)/1000);last=now;game.input.x=Number(keys.has('KeyD')||keys.has('ArrowRight'))-Number(keys.has('KeyA')||keys.has('ArrowLeft'))+touch.x;game.input.y=Number(keys.has('KeyS')||keys.has('ArrowDown'))-Number(keys.has('KeyW')||keys.has('ArrowUp'))+touch.y;
 if(game.active()&&game.visuals.freeze>0){game.visuals.freeze=Math.max(0,game.visuals.freeze-dt);accumulator=0;}else if(game.active()){accumulator+=dt;while(accumulator>=1/60&&game.visuals.freeze<=0){game.update(1/60);accumulator-=1/60;}}else accumulator=0;
 renderer.draw(now/1000);hudTime+=dt;if(hudTime>=.1){hudTime=0;ui.updateHUD();document.body.dataset.state=game.state;}requestAnimationFrame(frame);}
requestAnimationFrame(frame);
// Test access is opt-in and never changes the normal game or saved progress.
if(new URLSearchParams(location.search).has('test'))window.brainrot={game,ui,store,renderer,assets};
