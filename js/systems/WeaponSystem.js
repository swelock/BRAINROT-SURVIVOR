import {weapons} from '../data/catalog.js';
import {angle,dist,pick} from '../game/math.js';
export function elemental(g){const n=g.rng();return n<.25?'poison':n<.5?'freeze':n<.7?'critical':n<.85?'knockback':'chain';}
export function fire(g,x,y,a,options={}){if(g.projectiles.length>=650)return;const p=g.player,b=p.b,speed=(options.speed||500)*(1+(b.projectileSpeed||0));const effects=options.effects||[];if(g.hasBuff('rainbow'))effects.push(elemental(g));
 g.projectiles.push({id:++g.nextId,x,y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,r:(options.r||6)*(1+(b.size||0)+(g.hasBuff('boost')?.25:0)+(g.chaosEffect==='size'?.5:0)),damage:options.damage||10,color:options.color||'#caf66c',life:3,pierce:(b.pierce||0)+(options.pierce||0),hits:new Set(),...options,effects,r:(options.r||6)*(1+(b.size||0)+(g.hasBuff('boost')?.25:0)+(g.chaosEffect==='size'?.5:0))});
 p.projectileCount++;if(b.nuclearStomach&&p.projectileCount%100===0)g.explode(p.x,p.y,230,120,'#edcf7b');}
export function updateWeapons(g,dt){const p=g.player,b=p.b;const nearby=g.enemies.filter(e=>!e.dead&&dist(e,p)<1100);let target=null,best=Infinity;for(const e of nearby){const d=dist(e,p);if(d<best){best=d;target=e;}}
 for(const w of p.weapons){const d=weapons.find(d=>d.id===w.id),l=w.level;w.timer-=dt;
 if(w.id==='orbit'){const count=2+Math.floor(l/2)+(w.evolved?2:0),radius=75+l*4;w.orbs=[];for(let i=0;i<count;i++){const a=g.time*(1.7+l*.11+(w.evolved?.8:0))+i*Math.PI*2/count;const orb={x:p.x+Math.cos(a)*radius,y:p.y+Math.sin(a)*radius,r:w.evolved?16:11};w.orbs.push(orb);for(const e of g.grid.query(orb.x,orb.y,80))if(!e.dead&&e.orbitHit<=0&&dist(orb,e)<orb.r+e.r){g.damageEnemy(e,d.damage*(1+(l-1)*.22)*(1+(b.area||0)));e.orbitHit=.3;}}
 if(w.evolved&&w.timer<=0&&target){for(const orb of w.orbs)fire(g,orb.x,orb.y,angle(orb,target),{damage:14,color:'#8de5f2'});w.timer=1.3;}continue;}
 if(w.timer>0||!target)continue;
 const rate=(1+(b.attackSpeed||0))*(g.hasBuff('overload')?1.75:1)*(g.chaosEffect==='haste'?2:1);
 w.timer=d.cooldown*Math.pow(.9,b.cooldown?Math.round(b.cooldown*10):0)/rate*(w.id==='basic'?(l>=3?.85:1):Math.max(.5,1-(l-1)*.055));
 p.attacks++;let count=1+(b.count||0)+(g.hasBuff('boost')?1:0)+(g.rng()<(b.double||0)?1:0)+(b.fifth&&p.attacks%5===0?1:0);
 let damage=d.damage*(w.id==='basic'?(l>=2?1.2:1)*(l>=7?1.25:1):1+(l-1)*.2);
 if(w.id==='burp'){const seed=pick(nearby,g.rng);let cluster=seed,most=0;for(const e of nearby.slice(0,30)){const n=g.grid.query(e.x,e.y,90).length;if(n>most){cluster=e;most=n;}}g.explode(cluster.x,cluster.y,95+l*7,damage,d.color);}
 else if(w.id==='sigma')g.explode(p.x,p.y,140+l*13,damage,d.color,100);
 else{
 if(w.id==='basic'&&l>=4)count++;
 if(w.id==='toxic')count+=2+Math.floor(l/2);
 for(let i=0;i<count;i++){const a=angle(p,target)+(i-(count-1)/2)*(w.id==='toxic'?.16:.105);const opts={damage,color:d.color};
 if(w.id==='basic'){opts.pierce=l>=6?1:0;opts.speed=500*(l>=5?1.2:1);if(w.evolved){opts.r=10;opts.effects=['poison'];opts.explosion=45;}}
 if(w.id==='toxic'){opts.speed=420;opts.effects=['poison'];opts.poisonDps=3;opts.poisonDuration=3+l*.25;if(w.evolved)opts.zone=true;}
 if(w.id==='nuclear'){opts.speed=260;opts.r=w.evolved?20:12;opts.explosion=(80+l*6)*(w.evolved?1.6:1);opts.secondary=w.evolved||l>=7;}
 if(w.id==='rainbow'){opts.effects=w.evolved?[elemental(g),elemental(g),elemental(g)]:[elemental(g)];if(w.evolved&&g.rng()<.12)opts.explosion=70;}
 fire(g,p.x,p.y,a,opts);}
 }
 if(b.overflow&&p.attacks%20===0)for(let i=0;i<12;i++)fire(g,p.x,p.y,i*Math.PI/6,{damage:18});g.sound('attack');
 }
 p.passive-=dt;if(p.passive<=0){const id=p.character.id;if(id==='tung'){g.explode(p.x,p.y,155,32,'#efc985',90);p.passive=8;}
 if(id==='croc'){if(target)fire(g,p.x,p.y,angle(p,target),{damage:48,r:14,speed:300,explosion:110,color:'#edcb7e'});p.passive=7;}
 if(id==='cup'){g.explode(p.x,p.y,115,28,'#f4bad2',40);p.invulnerable=Math.max(p.invulnerable,.65);p.passive=6;}
 if(id==='chaos'){g.chaosEffect=pick(['haste','speed','size','chain','explosions'],g.rng);g.chaosTime=5;g.announce('chaos',g.chaosEffect);p.passive=12;}}
 g.rainTimer-=dt;if(g.rainTimer<=0){g.rainTimer=.35;if(g.hasBuff('rain')&&target)fire(g,target.x+(g.rng()-.5)*120,target.y-250,Math.PI/2,{damage:25,color:'#c4ef7a'});if(g.chaosEffect==='explosions'&&target)g.explode(target.x,target.y,75,25);if(g.chaosEffect==='chain'&&target)g.chain(target,25);}
 for(const q of g.projectiles){q.x+=q.vx*dt;q.y+=q.vy*dt;q.life-=dt;if(dist(q,p)>1500){q.life=0;continue;}
 for(const e of g.grid.query(q.x,q.y,q.r+65)){if(e.dead||q.hits.has(e.id)||dist(q,e)>q.r+e.r)continue;q.hits.add(e.id);if(!q.explosion)g.damageEnemy(e,q.damage,q.effects.includes('critical'));g.sound('hit');
 for(const effect of q.effects){if(effect==='poison'){e.poison=q.poisonDuration||3;e.poisonDps=(q.poisonDps||3)*(1+(b.poison||0));}if(effect==='freeze')e.freeze=2;if(effect==='knockback'){e.x+=q.vx*.13;e.y+=q.vy*.13;}if(effect==='chain')g.chain(e,q.damage*.65);}
 if(q.explosion)g.explode(q.x,q.y,q.explosion,q.damage,q.color);
 else if(g.rng()<(b.unstable||0)+(g.hasBuff('fever')?.2:0))g.explode(q.x,q.y,55,q.damage*.6,q.color);
 if(q.secondary){for(let j=0;j<3;j++){const a=j*Math.PI*2/3;g.explode(q.x+Math.cos(a)*90,q.y+Math.sin(a)*90,65,q.damage*.45,'#edb168');}}
 if(q.zone)g.zones.push({x:q.x,y:q.y,r:75,life:4,total:4,poison:true,damage:8});
 if(q.pierce--<=0){q.life=0;break;}}
 }
 g.projectiles=g.projectiles.filter(q=>q.life>0);
}
