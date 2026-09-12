import {upgrades,weapons} from '../data/catalog.js';
import {metaNodes} from '../data/meta.js';
import {weighted} from '../game/math.js';
export function baseBonuses(save){const b={};for(const n of metaNodes)if(save.upgrades[n.id])b[n.key]=(b[n.key]||0)+n.value;return b;}
export function choices(game){
 const p=game.player,pool=[];
 for(const w of weapons){const owned=p.weapons.find(x=>x.id===w.id);if(owned&&owned.level<8)pool.push({type:'weapon',id:w.id,rarity:1,level:owned.level+1});else if(!owned&&p.weapons.length<6)pool.push({type:'weapon',id:w.id,rarity:1,level:1});
 if(owned?.level===8&&!owned.evolved&&w.evolution&&(p.upgrades[w.requires]||game.save.upgrades[w.requires]))pool.push({type:'evolution',id:w.id,rarity:3});}
 for(const u of upgrades)if((p.upgrades[u.id]||0)<u.max)pool.push({type:'upgrade',id:u.id,rarity:u.id==='sixSeven'&&(p.upgrades.sixSeven||0)>=2?2:u.rarity});
 const result=[],evolution=pool.find(x=>x.type==='evolution');if(evolution){result.push(evolution);pool.splice(pool.indexOf(evolution),1);}
 if(p.b.gambler&&game.rng()<.08){const leg=pool.find(x=>x.rarity===3);if(leg&&result.length<3){result.push(leg);pool.splice(pool.indexOf(leg),1);}}
 while(result.length<3&&pool.length){const option=weighted(pool,x=>[1,.44,.15,.025][x.rarity]*(x.rarity?1+(p.b.luck||0)+(p.b.rare||0)+(game.hasBuff('clover')?.5:0):1),game.rng);result.push(option);pool.splice(pool.indexOf(option),1);}
 const fallbacks=[{type:'heal',id:'heal',rarity:0},{type:'power',id:'power',rarity:1},{type:'xp',id:'xp',rarity:0}];for(const f of fallbacks)if(result.length<3)result.push(f);return result;
}
export function applyChoice(g,c){const p=g.player;
 if(c.type==='weapon'){const w=p.weapons.find(w=>w.id===c.id);if(w){if(w.level>=8)return false;w.level++;}else{if(p.weapons.length>=6)return false;p.weapons.push({id:c.id,level:1,timer:0,evolved:false});}}
 else if(c.type==='evolution'){const w=p.weapons.find(w=>w.id===c.id),d=weapons.find(w=>w.id===c.id);if(!w||w.level<8||w.evolved||!(p.upgrades[d.requires]||g.save.upgrades[d.requires]))return false;w.evolved=true;}
 else if(c.type==='upgrade'){const u=upgrades.find(u=>u.id===c.id);if(!u||(p.upgrades[u.id]||0)>=u.max)return false;p.upgrades[u.id]=(p.upgrades[u.id]||0)+1;p.b[u.key]=(p.b[u.key]||0)+u.value;if(u.key==='health'){p.maxHp+=u.value;p.hp+=u.value;}if(u.key==='legend'){p.b.damage=(p.b.damage||0)+.35;p.b.count=(p.b.count||0)+1;}}
 else if(c.type==='heal')p.hp=Math.min(p.maxHp,p.hp+p.maxHp*.3);
 else if(c.type==='power')p.b.damage=(p.b.damage||0)+.05;
 else if(c.type==='xp')p.b.regen=(p.b.regen||0)+.25;
 else return false;g.sound('upgrade');g.effect(p.x,p.y,70,'#c7f578',.5);return true;
}
