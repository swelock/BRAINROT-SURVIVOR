import {Game} from '../js/game/Game.js';
import {freshSave} from '../js/systems/SaveSystem.js';
function rand(seed){return()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}
const runs=[];
for(let seed=1;seed<=5;seed++){
 const g=new Game(freshSave(),{rng:rand(seed)});g.start(['tung','shark','croc','cup','tung'][seed-1]);let steps=0;
 while(!g.ended&&g.time<1600&&steps++<100000){if(g.state==='LEVEL_UP'){const priorities={more:14,regen:12,health:10,strong:9,armor:8,magnet:9,cooldown:8,bossHunter:9,crit:6,overclock:8,unstable:7};const score=o=>o.type==='evolution'?30:o.type==='weapon'?({basic:7,toxic:12,nuclear:11,rainbow:9,burp:10,orbit:13,sigma:9}[o.id])+(o.level>1?1:0):priorities[o.id]||2;g.choose(g.options.map((o,i)=>({i,s:score(o)})).sort((a,b)=>b.s-a.s)[0].i);continue;}
 const p=g.player;let x=0,y=0;let nearest=null,nd=Infinity;for(const q of g.pickups){let d=Math.hypot(q.x-p.x,q.y-p.y);if(d<nd){nearest=q;nd=d;}}if(nearest){x+=(nearest.x-p.x)/(nd||1)*.8;y+=(nearest.y-p.y)/(nd||1)*.8;}else{x=Math.cos(g.time*.09)*.4;y=Math.sin(g.time*.09)*.4;}
 let danger=0;for(const e of g.enemies){let dx=p.x-e.x,dy=p.y-e.y,d=Math.hypot(dx,dy)||1;if(d<155){const w=3*(1-d/155);x+=dx/d*w;y+=dy/d*w;if(d<65)danger++;}if(e.warning){const z=e.warning,dx=p.x-z.x,dy=p.y-z.y,d=Math.hypot(dx,dy)||1;if(d<z.r+70){x+=dx/d*6;y+=dy/d*6;}}}
 for(const b of g.enemyBullets){const dx=p.x-b.x,dy=p.y-b.y,d=Math.hypot(dx,dy)||1;if(d<80){x+=dx/d*(1-d/80)*2;y+=dy/d*(1-d/80)*2;}}
 g.input={x,y,dash:danger>1};g.update(1/30);
 }
 runs.push({seed,character:g.player.character.id,time:Math.round(g.time),wave:g.wave,level:g.player.level,kills:g.kills,hp:Math.round(g.player.hp),bosses:g.bosses,victory:g.result?.victory,weapons:g.player.weapons.map(w=>w.id+':'+w.level),entities:g.enemies.length});
}
console.log(JSON.stringify(runs,null,2));
