// Presentation only: no gameplay RNG, hitbox, velocity or targeting changes.
const TAU=Math.PI*2;
export const VISUAL_CAPS={drops:180,splats:72,impacts:140,lights:16,ghosts:40};
// E, SE, S, SW, W, NW, N, NE. Screen-space sockets relative to the logical player center.
export const mouthSockets={
 tung:[[15,-30],[10,-26],[0,-24],[-10,-26],[-15,-30],[-10,-35],[0,-37],[10,-35]],
 shark:[[29,-5],[20,2],[0,4],[-20,2],[-29,-5],[-20,-14],[0,-17],[20,-14]],
 croc:[[34,-15],[24,-7],[0,-3],[-24,-7],[-34,-15],[-24,-24],[0,-27],[24,-24]],
 cup:[[14,-39],[10,-35],[0,-33],[-10,-35],[-14,-39],[-10,-44],[0,-46],[10,-44]],
 chaos:[[16,-9],[11,-5],[0,-3],[-11,-5],[-16,-9],[-11,-14],[0,-16],[11,-14]]};
export function mouthOffset(id,a){return mouthSockets[id]?.[((Math.round(a/(Math.PI/4))%8)+8)%8]||[0,0];}
export function projectilePosition(q){const k=Math.max(0,1-(q.visualAge||0)/.13);return {x:q.x+(q.mouthX||0)*k,y:q.y+(q.mouthY||0)*k};}
const oval=(c,x,y,rx,ry,color)=>{c.fillStyle=color;c.beginPath();c.ellipse(x,y,Math.max(.01,rx),Math.max(.01,ry),0,0,TAU);c.fill();};
export class VomitVisualSystem{
 constructor(){this.reset();}
 reset(){for(const key of Object.keys(VISUAL_CAPS))this[key]=[];this.freeze=0;this.clock=0;}
 push(key,v){const a=this[key];if(a.length>=VISUAL_CAPS[key])a.shift();a.push(v);}
 stop(g,seconds){if(g.save.settings.shake)this.freeze=Math.max(this.freeze,seconds);}
 update(dt){this.clock+=dt;for(const key of Object.keys(VISUAL_CAPS)){const a=this[key];let keep=0;for(const v of a){v.life-=dt;if(v.life<=0)continue;v.x+=(v.vx||0)*dt;v.y+=(v.vy||0)*dt;if(v.vy)v.vy+=80*dt;a[keep++]=v;}a.length=keep;}}
 shot(g,q,fromMouth){q.visualAge=0;q.trailClock=0;if(fromMouth){const a=Math.atan2(q.vy,q.vx),[x,y]=mouthOffset(g.player.character.id,g.player.motion?.moving?g.player.motion.direction*Math.PI/4:a);q.mouthX=x;q.mouthY=y;g.player.attackPose=.085;g.player.attackAngle=a;this.push('impacts',{x:q.x+x,y:q.y+y,r:5,life:.09,total:.09,color:'#d7f595'});}}
 trail(q,dt){q.visualAge=(q.visualAge||0)+dt;q.trailClock=(q.trailClock||0)-dt;if(q.trailClock>0)return;q.trailClock=.055;const p=projectilePosition(q);this.push('drops',{...p,r:q.r*.35,life:.14,total:.14,color:q.color});}
 impact(g,q,e){const x=e.x,y=e.y,a=Math.atan2(q.vy,q.vx);for(let i=0;i<5;i++){const direction=a+(i-2)*.7,speed=40+i*15;this.push('impacts',{x,y,vx:Math.cos(direction)*speed,vy:Math.sin(direction)*speed,r:2+(i%3),life:.2+i*.035,total:.34,color:q.color});}this.push('splats',{x,y:y+12,r:q.r*1.8+5,life:.6,total:.6,color:q.color,seed:q.id});if(q.weapon==='nuclear'){this.stop(g,.035);this.light(x,y,q.explosion||110,'#f0df80');g.sound('nuclear');}if(q.sixSeven){this.light(x,y,q.absolute?160:75,'#c8ff66');g.shake=Math.max(g.shake,q.absolute?4:1);}}
 hit(e,p,crit){e.visualRecoilX=(e.x-p.x)/Math.max(1,Math.hypot(e.x-p.x,e.y-p.y))*(crit?7:3);e.visualRecoilY=(e.y-p.y)/Math.max(1,Math.hypot(e.x-p.x,e.y-p.y))*(crit?7:3);e.visualCrit=crit;}
 death(e){this.push('ghosts',{...e,dead:true,life:.2,total:.2});}
 light(x,y,r,color){this.push('lights',{x,y,r,life:.3,total:.3,color});}
 drawGround(c){for(const s of this.splats){c.globalAlpha=.3*Math.min(1,s.life*4);for(let i=0;i<4;i++)oval(c,s.x+Math.cos(i*2.4+s.seed)*s.r*.35,s.y+Math.sin(i*2.4+s.seed)*s.r*.2,s.r*(.55+i*.07),s.r*.3,s.color);}c.globalAlpha=1;}
 drawParticles(c){for(const key of ['drops','impacts'])for(const d of this[key]){const k=Math.min(1,d.life/d.total);c.globalAlpha=k*.75;oval(c,d.x,d.y,d.r*k*1.3,d.r*k,d.color);}c.globalAlpha=1;}
 drawLights(c,bosses=[]){if(!this.glow){this.glow=document.createElement('canvas');this.glow.width=this.glow.height=96;const q=this.glow.getContext('2d'),gradient=q.createRadialGradient(48,48,0,48,48,48);gradient.addColorStop(0,'#e6ffc980');gradient.addColorStop(.3,'#d6faab35');gradient.addColorStop(1,'#d6faab00');q.fillStyle=gradient;q.fillRect(0,0,96,96);}c.save();c.globalCompositeOperation='screen';for(const boss of bosses)if(boss.boss&&!boss.dead){c.globalAlpha=.13;c.drawImage(this.glow,boss.x-boss.r*2,boss.y-boss.r*2,boss.r*4,boss.r*4);}for(const l of this.lights){c.globalAlpha=l.life/l.total*.5;c.drawImage(this.glow,l.x-l.r,l.y-l.r,l.r*2,l.r*2);}c.restore();}
}
export function drawLiquid(c,q,t){const p=projectilePosition(q),mutated=q.weapon==='basic'&&q.explosion,nuclear=q.weapon==='nuclear';c.save();c.translate(p.x,p.y);c.rotate(Math.atan2(q.vy,q.vx));const wobble=Math.sin(t*(nuclear?9:18)+q.id)*.06;c.scale(1.1+wobble,1-wobble);const r=q.r;
 const body=mutated?'#76ac37':nuclear?'#c2bc42':q.weapon==='toxic'?'#82d35d':q.weapon==='rainbow'?'#a8db81':'#ace455';
 oval(c,-r*.3,0,r*1.95,r*1.15,body+'35');c.fillStyle=body;c.beginPath();c.moveTo(-r*2.2,0);c.bezierCurveTo(-r,-r*.7,-r*.2,-r*1.45,r*.9,-r*.85);c.bezierCurveTo(r*2,-r*.25,r*1.7,r*.8,r*.5,r);c.bezierCurveTo(-r*.7,r*1.2,-r*.9,r*.1,-r*2.2,0);c.fill();
 oval(c,r*.45,r*.5,r*.85,r*.34,mutated?'#345824':'#4d802b99');oval(c,r*.35,-r*.4,r*.8,r*.25,'#eafb93');oval(c,r*.7,-r*.48,r*.26,r*.13,'#ffffdf');
 for(let i=0;i<2;i++)oval(c,-r*(.55+i*.65),Math.sin(q.id+i)*r*.45,r*(.23+i*.06),r*.22,'#dcf79f99');
 if(nuclear){oval(c,r*.2,-r*.05,r*.5,r*.48,'#fff0a2');oval(c,-r*1.5,0,r*.8,r*.55,'#cece5055');}
 if(q.weapon==='rainbow'){for(let i=0;i<3;i++){c.strokeStyle=['#e5a2c8','#95d9ee','#f6d681'][i];c.lineWidth=Math.max(1,r*.22);c.beginPath();c.arc(r*.3,0,r*(.45+i*.2),-1.7+i*.7,1.1+i*.7);c.stroke();}}
 if(q.weapon==='toxic')for(let i=0;i<4;i++)oval(c,-r*(1+i*.55),Math.sin(q.id+i)*r*(.7+i*.1),r*(.22+i*.05),r*.18,'#b0e477bb');c.restore();}
