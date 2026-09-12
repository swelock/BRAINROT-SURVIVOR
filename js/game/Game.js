import {prepareCasino} from '../systems/CasinoSystem.js';
import {activateBonuses,updateBonuses} from '../systems/NextRunBonusSystem.js';
import {beginTutorial,updateTutorial} from '../systems/TutorialSystem.js';
import {VomitVisualSystem} from '../systems/VomitVisualSystem.js';
import {postVictory,enterEndless,prepareSuper,bossDefeated,updateMode} from '../systems/ModeSystem.js';
import {characters,buffs} from '../data/catalog.js';
import {baseBonuses,choices,applyChoice} from '../systems/UpgradeSystem.js';
import {updateEnemies,spawnEnemy} from '../systems/EnemySystem.js';
import {updateWeapons} from '../systems/WeaponSystem.js';
import {awardRun} from '../systems/SaveSystem.js';
import {clamp,dist,direction,pick,weighted,SpatialGrid} from './math.js';
export class Game{
 constructor(save,{rng=Math.random,onEvent=()=>{},audio=null}={}){this.save=save;this.rng=rng;this.onEvent=onEvent;this.audio=audio;this.state='MENU';this.view={width:1280,height:720};this.camera={x:0,y:0};this.grid=new SpatialGrid();this.input={x:0,y:0,dash:false};this.time=0;this.effects=[];this.particles=[];this.numbers=[];this.enemies=[];this.projectiles=[];this.enemyBullets=[];this.pickups=[];this.chests=[];this.zones=[];this.wave=1;this.shake=0;this.nextId=0;this.visuals=new VomitVisualSystem();}
 start(id,mode='NORMAL'){if(!['NORMAL','SUPER_VOMIT'].includes(mode)||(mode==='SUPER_VOMIT'&&!this.save.modes?.superVomitUnlocked))return false;const c=characters.find(c=>c.id===id);if(!c||(id==='chaos'&&!this.save.characters.chaos))return false;
 this.visuals.reset();this.result=null;this.mode=mode;this.victoryRecorded=false;this.endlessTime=0;this.endlessBosses=0;this.superRound=0;this.superDefeated=0;this.recovery=2.5;this.modeHazardTimer=6;this.supportTimer=8;this.delayedImpacts=[];this.state='WAVE_TRANSITION';this.time=0;this.wave=1;this.waveTime=0;this.transition=3;this.spawnTimer=.3;this.chestTimer=62;this.rainTimer=0;this.kills=0;this.bosses=0;this.totalDamage=0;this.bestMultiplier=1;this.boss=null;this.bossSpawned=false;this.buffs={};this.multiplier=1;this.multiplierTime=0;this.chaosTime=0;this.chaosEffect=null;this.realityShift=0;this.shake=0;this.pendingLevels=0;this.ended=false;
 for(const k of ['enemies','projectiles','enemyBullets','pickups','chests','zones','effects','particles','numbers'])this[k]=[];
 const b=baseBonuses(this.save);if(c.id==='tung')b.area=(b.area||0)+.1;if(c.id==='shark'){b.speed=(b.speed||0)+.15;b.projectileSpeed=(b.projectileSpeed||0)+.1;}if(c.id==='croc')b.explosionRadius=.15;if(c.id==='cup')b.dodge=.1;if(c.id==='chaos')b.luck=(b.luck||0)+.1;
 this.player={character:c,x:0,y:0,r:17,maxHp:c.hp+(b.health||0),hp:c.hp+(b.health||0),b,level:1,xp:0,nextXp:18,weapons:[{id:'basic',level:1,timer:0,evolved:false}],upgrades:{},dashTimer:0,dashLeft:0,dashX:1,dashY:0,facing:1,lastX:1,lastY:0,invulnerable:0,passive:c.id==='shark'?Infinity:3,attacks:0,primaryAttacks:0,sixSevenCounter:0,specialTime:0,projectileCount:0,secondUsed:false,survivorUsed:false,lowHpTime:0,afterDash:0};
 activateBonuses(this);beginTutorial(this);this.camera={x:0,y:0};this.grid.rebuild([]);this.input.dash=false;if(mode==='SUPER_VOMIT')prepareSuper(this);else{this.announce('wave',1);this.onEvent('state');}return true;}
 sound(id){this.audio?.play(id);}
 announce(type,value){this.onEvent('announce',{type,value});}
 active(){return ['PLAYING','WAVE_TRANSITION','ENDLESS','SUPER_VOMIT_PREP','SUPER_VOMIT_PLAYING'].includes(this.state);}
 pause(){if(this.active()){this.previousState=this.state;this.state='PAUSED';this.input.dash=false;this.onEvent('state');}}
 resume(){if(this.state==='PAUSED'){this.state=this.previousState||'PLAYING';this.onEvent('state');}}
 choose(index){if(this.state!=='LEVEL_UP'||!this.options[index])return false;if(!applyChoice(this,this.options[index]))return false;this.pendingLevels--;if(this.pendingLevels>0)this.openLevel();else{this.state=this.levelReturn||'PLAYING';this.onEvent('state');}return true;}
 reroll(){if(this.state!=='LEVEL_UP'||!this.player.rerolls)return false;this.player.rerolls--;this.options=choices(this);this.sound('upgrade');this.onEvent('state');return true;}
 openLevel(){if(this.state!=='LEVEL_UP')this.levelReturn=this.state;this.state='LEVEL_UP';this.options=choices(this);this.sound('level');this.onEvent('state');}
 gainXp(n){const p=this.player;p.xp+=n;while(p.xp>=p.nextXp){p.xp-=p.nextXp;p.level++;p.nextXp=14+p.level*7;this.pendingLevels++;}}
 update(dt){dt=Math.min(dt,.05);if(!this.active())return;const p=this.player;this.visuals.update(dt);updateBonuses(this,dt);const oldX=p.x,oldY=p.y;this.time+=dt;p.attackPose=Math.max(0,(p.attackPose||0)-dt);p.specialTime=Math.max(0,p.specialTime-dt);this.shake=Math.max(0,this.shake-dt*16);this.realityShift=Math.max(0,this.realityShift-dt);
 for(const id of Object.keys(this.buffs)){this.buffs[id]-=dt;if(this.buffs[id]<=0){delete this.buffs[id];this.sound('expire');}}
 if(this.multiplierTime>0){this.multiplierTime-=dt;if(this.multiplierTime<=0){this.multiplier=1;this.sound('expire');}}
 if(this.chaosTime>0){this.chaosTime-=dt;if(this.chaosTime<=0)this.chaosEffect=null;}
 p.invulnerable=Math.max(0,p.invulnerable-dt);p.dashTimer=Math.max(0,p.dashTimer-dt);p.afterDash=Math.max(0,p.afterDash-dt);
 p.hp=Math.min(p.maxHp,p.hp+(p.b.regen||0)*dt);
 if(p.hp<p.maxHp*.25){p.lowHpTime+=dt;if(p.b.survivor&&!p.survivorUsed&&p.lowHpTime>=30){p.hp+=p.maxHp*.25;p.survivorUsed=true;this.effect(p.x,p.y,95,'#acd989',1);}}else p.lowHpTime=0;
 const dir=direction(this.input.x,this.input.y);if(dir.x||dir.y){p.lastX=dir.x;p.lastY=dir.y;if(dir.x)p.facing=Math.sign(dir.x);}
 if(this.input.dash&&p.dashTimer<=0){p.dashLeft=.18;p.dashX=p.lastX;p.dashY=p.lastY;p.dashTimer=p.character.dash*Math.max(.3,1-(p.b.dashCooldown||0));p.invulnerable=Math.max(p.invulnerable,.25);p.afterDash=2;this.sound('dash');}this.input.dash=false;
 const speed=p.character.speed*(1+(p.b.speed||0))*(this.hasBuff('energy')?1.5:1)*(this.hasBuff('turbo')?2:1)*(this.chaosEffect==='speed'?1.5:1)*(p.b.unstoppable&&p.afterDash>0?1.2:1);
 if(p.dashLeft>0){const step=Math.min(dt,p.dashLeft);p.dashLeft-=step;const v=150*(1+(p.b.dashDistance||0))/.18;p.x+=p.dashX*v*step;p.y+=p.dashY*v*step;this.particle(p.x,p.y,p.character.color,3);if(p.character.id==='shark'||p.b.afterimage)this.zones.push({x:p.x,y:p.y,r:25,life:2,total:2,damage:18,trail:true});}else{p.x+=dir.x*speed*dt;p.y+=dir.y*speed*dt;}
 updateTutorial(this,dt,p.x-oldX,p.y-oldY,p.dashLeft>0);
 this.camera.x+=(p.x-this.camera.x)*(1-Math.exp(-8*dt));this.camera.y+=(p.y-this.camera.y)*(1-Math.exp(-8*dt));
 if(this.mode!=='NORMAL'){updateMode(this,dt);}
 else if(this.state==='WAVE_TRANSITION'){this.transition-=dt;if(this.transition<=0)this.state='PLAYING';}
 else{this.waveTime+=dt;this.spawnTimer-=dt;if(this.spawnTimer<=0){this.spawnTimer=Math.max(.18,1.2/Math.pow(1.08,this.wave-1));if(this.enemies.length<240){const types=['clubber'];if(this.wave>=3)types.push('runner');if(this.wave>=4)types.push('shooter');if(this.wave>=6)types.push('bomber');if(this.wave>=7)types.push('weird');if(this.wave>=8)types.push('tank');spawnEnemy(this,pick(types,this.rng));if(this.wave>=11&&this.rng()<.35)spawnEnemy(this,'shooter');}}
 if(!this.bossSpawned&&[5,9,10,15].includes(this.wave)&&this.waveTime>=2){this.bossSpawned=true;spawnEnemy(this,{5:'clubber',9:'weird',10:'breaker',15:'absolute'}[this.wave],true);}
 if(this.waveTime>=45&&!(this.boss&&!this.boss.dead)){if(this.wave<15){this.wave++;this.waveTime=0;this.transition=3;this.state='WAVE_TRANSITION';this.bossSpawned=false;this.boss=null;this.enemyBullets=[];this.announce('wave',this.wave);if(this.wave===12){this.save.characters.chaos=true;this.onEvent('save');this.announce('unlock');}}}
 }
 this.chestTimer-=dt*(1+(p.b.chest||0));if(this.chestTimer<=0){this.chestTimer=60+this.rng()*30;const a=this.rng()*Math.PI*2;this.chests.push({x:p.x+Math.cos(a)*250,y:p.y+Math.sin(a)*250,r:22});this.sound('chest');this.announce('chest');}
 updateEnemies(this,dt);if(!this.active())return;
 this.grid.rebuild(this.enemies);for(const impact of this.delayedImpacts){impact.delay-=dt;if(impact.delay<=0){this.explode(impact.x,impact.y,impact.r,impact.damage,impact.color);impact.done=true;if(!this.active())return;}}this.delayedImpacts=this.delayedImpacts.filter(i=>!i.done);updateWeapons(this,dt);if(!this.active())return;
 for(const z of this.zones){z.life-=dt;if(z.hostile){if(z.life<=0)this.danger(z.x,z.y,z.r,z.damage);}else for(const e of this.grid.query(z.x,z.y,z.r+60))if(!e.dead&&dist(z,e)<z.r+e.r){if(z.poison){e.poison=3;e.poisonDps=3*(1+(p.b.poison||0));e.freeze=.15;}this.damageEnemy(e,z.damage*dt,false,true);}}
 this.zones=this.zones.filter(z=>z.life>0).slice(-240);
 const radius=60+(p.b.magnet||0)+(this.hasBuff('magnet')?950:0);
 for(const q of this.pickups){const d=dist(q,p);if(d<radius)q.magnet=true;if(q.magnet){const a=Math.atan2(p.y-q.y,p.x-q.x);q.x+=Math.cos(a)*Math.min(680*dt,d);q.y+=Math.sin(a)*Math.min(680*dt,d);}if(dist(q,p)<p.r+9){this.gainXp(q.value);q.dead=true;this.sound('xp');}}
 this.pickups=this.pickups.filter(q=>!q.dead);
 for(const c of this.chests)if(dist(c,p)<p.r+c.r){this.openChest();c.dead=true;this.effect(c.x,c.y,90,'#edcd7e',.8);}
 this.chests=this.chests.filter(c=>!c.dead).slice(-24);
 this.enemies=this.enemies.filter(e=>!e.dead);this.effects=this.effects.filter(e=>(e.life-=dt)>0).slice(-100);this.numbers=this.numbers.filter(n=>{n.y-=25*dt;return(n.life-=dt)>0;});this.particles=this.particles.filter(q=>{q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy+=35*dt;return(q.life-=dt)>0;});
 if(this.pendingLevels>0&&this.active())this.openLevel();
 this.audio?.update(dt,true);
 }
 hasBuff(id){return(this.buffs?.[id]||0)>0;}
 addBuff(id,duration){const d=buffs.find(b=>b.id===id);if(!d)return;this.buffs[id]=duration||d.duration;this.sound('buff');this.announce('buff',id);}
 openChest(){this.sound('open');const b=this.player.b,luck=(b.luck||0)+(this.hasBuff('clover')?.5:0);const n=this.rng();
 if(n<Math.min(.12,.02+(b.absoluteLuck||0)*.25+luck*.03)){this.addBuff('invincible');this.addBuff('rain');this.addBuff('sigma');this.announce('event');}
 else if(n<Math.min(.75,.22+(b.multi||0)+luck*.1+(b.absoluteLuck||0))){const values=[2,3,5,10,25,50,100,666,1000],weights=[50,25,12,7,3,1.5,1,.4,.1];const v=weighted(values,v=>weights[values.indexOf(v)]*(v>=25?1+(b.rareMulti||0)+luck:1),this.rng);this.multiplier=Math.max(this.multiplier,v);this.multiplierTime=v<=3?20:v<=5?15:v<=10?12:v<=50?8:5;this.bestMultiplier=Math.max(this.bestMultiplier,v);this.sound('multiplier');this.announce('multiplier',v);this.shake=5;}
 else this.addBuff(pick(buffs,this.rng).id);}
 damageEnemy(e,base,forceCrit=false,dot=false){if(e.dead||!this.active())return;const p=this.player,b=p.b;const crit=!dot&&(forceCrit||this.rng()<.05+(b.crit||0));const nearby=b.apocalypse?this.grid.query(p.x,p.y,150).filter(e=>!e.dead&&dist(e,p)<150).length:0;
 const damage=base*(1+(b.damage||0))*(this.hasBuff('sigma')?2:1)*this.multiplier*(crit?2+(b.critDamage||0):1)*(e.boss?1+(b.bossDamage||0):1)*(b.lastStand&&p.hp<p.maxHp*.25?1.3:1)*(nearby>=3?1.1:1);
 this.totalDamage+=Math.min(e.hp,damage);e.hp-=damage;if(!dot){e.hit=.12;this.visuals.hit(e,p,crit);if(this.numbers.length<50)this.numbers.push({x:e.x,y:e.y-e.r,value:Math.round(damage),crit,life:.65});if(crit)this.sound('crit');}
 if(e.hp<=0){this.visuals.death(e);if(e.boss)this.visuals.stop(this,.085);e.dead=true;this.kills++;this.sound('death');this.particle(e.x,e.y,e.color,7);const value=e.boss?95:(e.xp||8)*(e.elite?3:1);if(this.pickups.length>=700){let nearest=this.pickups[0];for(const q of this.pickups)if(dist(q,e)<dist(nearest,e))nearest=q;nearest.value+=value;}else this.pickups.push({x:e.x,y:e.y,value});
 if(e.modifier==='explosive')this.zones.push({x:e.x,y:e.y,r:85,life:1,total:1,hostile:true,damage:18});
 if(e.boss){this.bosses++;this.player.hp=Math.min(this.player.maxHp,this.player.hp+this.player.maxHp*(this.mode==='SUPER_VOMIT'?.08:.2));this.chests.push({x:e.x,y:e.y,r:23});if(p.bonusBossLoot){p.bonusBossLoot=0;this.chests.push({x:e.x+40,y:e.y,r:23});}bossDefeated(this,e);}}
 }
 explode(x,y,r,damage,color='#d8e886',knockback=55){r*=1+(this.player.b.explosionRadius||0);this.visuals.light(x,y,r,color);this.effect(x,y,r,color,.45);this.particle(x,y,color,12);for(const e of this.grid.query(x,y,r+65))if(!e.dead&&Math.hypot(e.x-x,e.y-y)<r+e.r){this.damageEnemy(e,damage*(1+(this.player.b.explosion||0))*(1+(this.player.b.area||0)));const a=Math.atan2(e.y-y,e.x-x);e.x+=Math.cos(a)*knockback;e.y+=Math.sin(a)*knockback;}this.shake=Math.max(this.shake,2);}
 chain(origin,damage){const targets=this.grid.query(origin.x,origin.y,240).filter(e=>!e.dead&&e!==origin).sort((a,b)=>dist(a,origin)-dist(b,origin)).slice(0,3);let from=origin;for(const e of targets){if(this.effects.length<100)this.effects.push({x:from.x,y:from.y,x2:e.x,y2:e.y,lightning:true,life:.2,total:.2,color:'#aadefa'});this.damageEnemy(e,damage);from=e;}}
 hurt(damage,source){if(!this.active())return;const p=this.player;if(p.invulnerable>0||this.hasBuff('invincible')||this.rng()<(p.b.dodge||0))return;
 damage=Math.max(1,damage-p.character.armor-(p.b.armor||0))*(p.b.unbreakable&&p.hp<p.maxHp*.3?.9:1);p.hp-=damage;p.invulnerable=.5;this.shake=4;this.sound('hurt');this.effect(p.x,p.y,42,'#ee8e80',.3);if(source&&(p.b.toxicBlood||source.modifier==='toxic')){if(p.b.toxicBlood){source.poison=4;source.poisonDps=8*(1+(p.b.poison||0));}if(source.modifier==='toxic')this.zones.push({x:p.x,y:p.y,r:65,life:1.2,total:1.2,hostile:true,damage:9});}
 if(p.hp<=0){if(p.b.second&&!p.secondUsed){p.secondUsed=true;p.hp=1;p.invulnerable=2;this.announce('second');}else{p.hp=0;this.finish(false);}}
 }
 danger(x,y,r,damage){this.effect(x,y,r,'#ef947e',.6);this.particle(x,y,'#f4b188',15);this.shake=4;if(dist({x,y},this.player)<r+this.player.r)this.hurt(damage);}
 effect(x,y,r,color,life){this.effects.push({x,y,r,color,life,total:life});if(this.effects.length>100)this.effects.shift();}
 particle(x,y,color,count){for(let i=0;i<count&&this.particles.length<300;i++){const a=this.rng()*Math.PI*2,v=40+this.rng()*130;this.particles.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:.25+this.rng()*.4,color,r:2+this.rng()*3});}}
 postVictory(){return postVictory(this);}
 enterEndless(){return enterEndless(this);}
 finish(victory){if(this.ended)return;this.ended=true;victory=Boolean(victory||this.victoryRecorded);const run={victory,victoryRecorded:this.victoryRecorded,mode:this.mode,endlessTime:this.endlessTime,endlessBosses:this.endlessBosses,superDefeated:this.superDefeated,wave:this.wave,time:this.time,kills:this.kills,bosses:this.bosses,level:this.player.level,damage:Math.round(this.totalDamage),bestMultiplier:this.bestMultiplier};this.state=victory?'RESULTS':'GAME_OVER';this.result={...run,...awardRun(this.save,run,this.player.b,this.rng)};prepareCasino(this.save,this.result);this.sound(victory?'victory':'lose');this.onEvent('save');this.onEvent('end',this.result);}
}
