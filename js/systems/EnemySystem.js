import {enemies} from '../data/catalog.js';
import {angle,dist,pick} from '../game/math.js';
export function spawnEnemy(g,type,boss=false){
 const p=g.player,a=g.rng()*Math.PI*2;
 // Project to the expanded viewport boundary so every spawn is off screen.
 const rx=g.view.width/2+100,ry=g.view.height/2+100;
 const spawnDistance=Math.min(rx/Math.max(.0001,Math.abs(Math.cos(a))),ry/Math.max(.0001,Math.abs(Math.sin(a))));
 const source=enemies[type]||enemies.weird;
 const elite=!boss&&g.wave>=8&&g.rng()<.06+(g.wave-8)*.008;
 const modifier=elite?pick(['fast','tanky','toxic','explosive','regenerating'],g.rng):null;
 const hp=boss?({clubber:600,weird:950,breaker:2200,absolute:5200}[type]):source.hp*(1+.10*(g.wave-1))*(elite?1.9:1)*(modifier==='tanky'?1.6:1);
 const e={...source,id:++g.nextId,type,x:g.camera.x+Math.cos(a)*spawnDistance,y:g.camera.y+Math.sin(a)*spawnDistance,hp,maxHp:hp,r:boss?(type==='absolute'?55:43):source.r*(elite?1.25:1),speed:boss?(type==='clubber'?65:83):source.speed*(1+.05*Math.floor((g.wave-1)/3))*(modifier==='fast'?1.45:1),damage:source.damage*(1+.035*(g.wave-1))*(elite?1.2:1),elite,modifier,boss,dead:false,poison:0,freeze:0,hit:0,attackTimer:boss?2:1+g.rng()*2,phase:1,action:0,warning:null,orbitHit:0};
 g.enemies.push(e);if(boss){g.boss=e;g.sound('boss');g.effect(e.x,e.y,160,'#ed9e91',1.5);g.announce('boss',type);}return e;
}
export function enemyBullet(g,x,y,a,speed=190,damage=12,r=7,source=null){if(g.enemyBullets.length>380)return;g.enemyBullets.push({x,y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,damage,r,life:7,source});}
export function updateEnemies(g,dt){const p=g.player;
 for(const e of g.enemies){if(e.dead)continue;e.hit=Math.max(0,e.hit-dt);e.orbitHit=Math.max(0,e.orbitHit-dt);e.freeze=Math.max(0,e.freeze-dt);
 if(e.poison>0){e.poison-=dt;g.damageEnemy(e,(e.poisonDps||3)*dt,false,true);if(e.dead)continue;}
 if(e.modifier==='regenerating')e.hp=Math.min(e.maxHp,e.hp+e.maxHp*.025*dt);
 const d=dist(e,p),a=angle(e,p),slow=(g.hasBuff('slow')?.6:1)*(e.freeze>0?.22:1);let move=e.speed*slow;
 e.attackTimer-=dt;
 if(e.boss){e.phase=e.type==='absolute'?(e.hp/e.maxHp<.33?3:e.hp/e.maxHp<.66?2:1):1;
 if(e.charge>0){e.charge-=dt;e.x+=Math.cos(e.chargeAngle)*630*dt;e.y+=Math.sin(e.chargeAngle)*630*dt;move=0;}
 if(e.warning){move=0;e.warning.time-=dt;if(e.warning.time<=0){executeBoss(g,e,e.warning);e.warning=null;}}
 else if(e.attackTimer<=0&&!(e.charge>0)){const types=e.type==='clubber'?['slam','swing']:e.type==='weird'?['burst','charge']:['charge','burst','summon','slam',...(e.type==='absolute'?['shift','rain']:[])];const kind=types[e.action++%types.length];e.warning={kind,time:kind==='charge'?1.1:1.25,total:kind==='charge'?1.1:1.25,x:p.x,y:p.y,angle:a,r:kind==='swing'?115:kind==='slam'?(e.type==='absolute'?195:140):95};e.attackTimer=Math.max(1.6,4.4-e.phase*.7);g.sound('bossAttack');}
 }else if(e.type==='shooter'){if(d<260)move=-move*.65;else if(d<350)move=0;if(e.attackTimer<=0&&d<850){enemyBullet(g,e.x,e.y,a,200,e.damage,7,e);e.attackTimer=2.8;}}
 else if(e.type==='bomber'){if(d<100&&e.fuse===undefined)e.fuse=1.25;if(e.fuse!==undefined){move=0;e.fuse-=dt;if(e.fuse<=0){g.danger(e.x,e.y,105,e.damage);e.dead=true;continue;}}}
 else if(e.type==='weird'){move*=.75+Math.sin(g.time*3+e.id)*.55;}
 const zig=e.type==='weird'?Math.sin(g.time*4+e.id)*.8:0;
 e.x+=Math.cos(a+zig)*move*dt;e.y+=Math.sin(a+zig)*move*dt;
 if(dist(e,p)<e.r+p.r)g.hurt(e.damage,e);
 // Very distant stragglers are recycled, but never bosses.
 if(!e.boss&&dist(e,p)>2400)e.dead=true;
 }
 for(const b of g.enemyBullets){b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;if(dist(b,p)<b.r+p.r){g.hurt(b.damage,b.source);b.life=0;}if(dist(b,p)>1800)b.life=0;}
 g.enemyBullets=g.enemyBullets.filter(b=>b.life>0);
}
function executeBoss(g,e,w){const phase=e.phase;
 if(w.kind==='charge'){e.charge=.8;e.chargeAngle=w.angle;}
 if(w.kind==='slam'||w.kind==='swing'){const x=w.kind==='swing'?e.x:w.x,y=w.kind==='swing'?e.y:w.y;g.danger(x,y,w.r,22+phase*8);}
 if(w.kind==='burst'){for(let i=0;i<12+phase*4;i++)enemyBullet(g,e.x,e.y,i*Math.PI*2/(12+phase*4),165+phase*18,15,7,e);g.effect(e.x,e.y,100,'#edb17e',.5);}
 if(w.kind==='rain'){for(let i=0;i<8+phase*4;i++){const x=w.x+(g.rng()-.5)*600,y=w.y+(g.rng()-.5)*380;g.zones.push({x,y,r:48,life:1.3,total:1.3,hostile:true,damage:24,warning:true});}}
 if(w.kind==='summon'){for(let i=0;i<4+phase*2;i++)spawnEnemy(g,pick(['runner','clubber','weird'],g.rng));g.effect(e.x,e.y,150,'#ae8bd8',.9);}
 if(w.kind==='shift'){g.realityShift=6;for(let i=0;i<16;i++)enemyBullet(g,e.x,e.y,i*Math.PI/8,180,18,7,e);g.announce('shift');}
}
