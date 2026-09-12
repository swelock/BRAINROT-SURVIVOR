import {spawnEnemy} from './EnemySystem.js';
import {pick} from '../game/math.js';
const sequence=['clubber','weird','breaker','clubber','absolute'];
export function endlessPressure(seconds){
 const m=Math.max(0,seconds)/60;
 return {hp:(1+m*.14)*Math.pow(1.18,Math.max(0,m-2)),damage:1+m*.09,interval:Math.max(.08,.38/(1+m*.10)),cap:Math.min(240,110+Math.floor(m*10)),elite:Math.min(.42,.12+m*.018),speed:1+Math.min(.35,m*.014),shooters:Math.min(.50,.18+m*.022)};
}
export function clearThreats(g){g.enemies=[];g.enemyBullets=[];g.zones=g.zones.filter(z=>!z.hostile);g.projectiles=[];g.delayedImpacts=[];g.boss=null;g.grid.rebuild([]);}
export function postVictory(g){
 if(g.mode!=='NORMAL'||g.wave!==15||g.victoryRecorded||g.ended)return false;
 g.victoryRecorded=true;g.save.stats.victories++;g.save.stats.wave=Math.max(15,g.save.stats.wave);
 g.save.characters.chaos=true;g.save.modes={...g.save.modes,endlessUnlocked:true,superVomitUnlocked:true};
 clearThreats(g);g.state='POST_VICTORY';g.sound('victory');g.onEvent('save');g.onEvent('state');return true;
}
export function enterEndless(g){
 if(g.state!=='POST_VICTORY'||g.ended)return false;
 g.mode='ENDLESS';g.endlessTime=0;g.nextEndlessBoss=120;g.spawnTimer=.6;g.state='ENDLESS';
 if(g.pendingLevels>0)g.openLevel();else g.onEvent('state');return true;
}
export function prepareSuper(g){
 g.mode='SUPER_VOMIT';g.wave=1;g.player.level=11;g.player.nextXp=91;
 g.player.weapons[0].level=6;g.player.b.damage=(g.player.b.damage||0)+.35;
 g.player.b.attackSpeed=(g.player.b.attackSpeed||0)+.25;g.player.maxHp+=35;g.player.hp+=35;
 g.superRound=0;g.superDefeated=0;g.pendingLevels=5;g.state='SUPER_VOMIT_PREP';g.openLevel();
}
export function beginSuperRound(g){
 g.superRound++;g.wave=Math.min(15,3+g.superRound*2);g.state='SUPER_VOMIT_PLAYING';
 const type=sequence[(g.superRound-1)%sequence.length];spawnEnemy(g,type,true);
 if(g.superRound>=8)spawnEnemy(g,sequence[(g.superRound+1)%sequence.length],true);
 g.onEvent('state');
}
export function bossDefeated(g,e){
 if(g.mode==='NORMAL'&&g.wave===15&&e.type==='absolute'){postVictory(g);return;}
 if(g.mode==='ENDLESS'){g.endlessBosses++;g.save.stats.endlessBossesKilled=(g.save.stats.endlessBossesKilled||0)+1;g.onEvent('save');}
 if(g.mode==='SUPER_VOMIT'&&!g.enemies.some(e=>e.boss&&!e.dead)){
  g.superDefeated=g.superRound;g.save.stats.highestSuperVomitBoss=Math.max(g.save.stats.highestSuperVomitBoss||0,g.superDefeated);g.onEvent('save');
  clearThreats(g);g.pickups=[];g.chests=[];g.player.hp=Math.min(g.player.maxHp,g.player.hp+g.player.maxHp*.12);
  g.openChest();g.pendingLevels+=2;g.player.level+=2;g.recovery=2.5;g.state='SUPER_VOMIT_PREP';g.openLevel();
 }else g.boss=g.enemies.find(e=>e.boss&&!e.dead)||null;
}
export function updateMode(g,dt){
 if(g.state==='ENDLESS'){
  g.endlessTime+=dt;const pressure=endlessPressure(g.endlessTime);
  g.save.stats.bestEndlessTime=Math.max(g.save.stats.bestEndlessTime||0,g.endlessTime);
  if(Math.floor(g.endlessTime/60)>Math.floor((g.endlessTime-dt)/60))g.onEvent('save');
  g.spawnTimer-=dt;if(g.spawnTimer<=0){g.spawnTimer=pressure.interval;for(let n=0;n<1+Math.min(2,Math.floor(g.endlessTime/480))&&g.enemies.length<pressure.cap;n++){spawnEnemy(g,g.rng()<pressure.shooters?'shooter':pick(['clubber','runner','tank','bomber','weird'],g.rng));}}
  if(g.endlessTime>=g.nextEndlessBoss){g.nextEndlessBoss+=120;const bosses=g.enemies.filter(e=>e.boss&&!e.dead).length;
   if(bosses<2){spawnEnemy(g,pick(sequence,g.rng),true);if(g.endlessTime>=600&&bosses===0)spawnEnemy(g,pick(sequence,g.rng),true);}}
 }else if(g.state==='SUPER_VOMIT_PLAYING'&&g.superRound>=6){
  g.supportTimer-=dt;g.modeHazardTimer-=dt;
  if(g.supportTimer<=0){g.supportTimer=Math.max(3,9-g.superRound*.15);if(g.enemies.filter(e=>!e.boss&&!e.dead).length<12)spawnEnemy(g,pick(['shooter','runner','weird'],g.rng));}
  if(g.modeHazardTimer<=0){g.modeHazardTimer=6;const count=Math.min(3,1+Math.floor(g.superRound/10));for(let i=0;i<count;i++){const a=i*Math.PI*2/count;g.zones.push({x:g.player.x+Math.cos(a)*(i?95:0),y:g.player.y+Math.sin(a)*(i?95:0),r:52,life:1.4,total:1.4,hostile:true,warning:true,damage:18+g.superRound});}}
 }else if(g.state==='SUPER_VOMIT_PREP'){
  g.recovery-=dt;if(g.recovery<=0)beginSuperRound(g);
 }
}
