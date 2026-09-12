import {fire} from './WeaponSystem.js';
export const sixSevenDamage=level=>[0,6.7,8.7,10.7,12.7,16.7][Math.min(5,level)];
// Called only once per BASIC attack, outside its multishot loop. Evolutions retain the basic id.
export function primaryVolley(g,damage,angle){
 const p=g.player;p.primaryAttacks++;const level=p.upgrades.sixSeven||0;if(!level)return;
 p.sixSevenCounter++;if(p.sixSevenCounter<67)return;p.sixSevenCounter=0;
 const absolute=level===5&&g.rng()<.067;
 // Reserve space even under the projectile cap: the earned shot must always spawn.
 if(g.projectiles.length>=650)g.projectiles.shift();
 fire(g,p.x,p.y,angle,{sixSeven:true,sixSevenLevel:level,absolute,damage:damage*sixSevenDamage(level)*(absolute?2:1),r:(14+level*1.5)*(absolute?1.5:1),pierce:level+1+(absolute?4:0),speed:410,color:'#c8ff66',life:4});
 g.sound(absolute?'absolute67':'sixSeven');g.effect(p.x,p.y,absolute?100:55,'#c8ff66',.35);g.shake=Math.max(g.shake,absolute?4:1);
}
export function impact67(g,q,e){
 if(q.split||q.sixSevenLevel<3)return;q.split=true;q.splitLife=.3;
 // Exactly six shards and one seventh burst, only on the first impact.
 for(let i=0;i<6;i++)fire(g,e.x,e.y,i*Math.PI/3,{hits:new Set([e.id]),damage:q.damage*.06,r:4,speed:240,life:.65,color:'#e0ff9b',pierce:0});
 g.effect(e.x-12,e.y,20,'#c8ff66',.28);g.effect(e.x+12,e.y,24,'#f3ffd5',.35);
 const enqueue=impact=>{if(g.delayedImpacts.length<70)g.delayedImpacts.push(impact);};
 if(q.sixSevenLevel>=4)for(let i=0;i<6;i++){const a=i*Math.PI/3;enqueue({x:e.x+Math.cos(a)*45,y:e.y+Math.sin(a)*45,r:28,damage:q.damage*.07,delay:.07*(i+1),color:'#c8ff66'});}
 enqueue({x:e.x,y:e.y,r:q.absolute?100:65,damage:q.damage*.25,delay:.52,color:'#edffd0'});
}
