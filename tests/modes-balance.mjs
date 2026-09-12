import {Game} from '../js/game/Game.js';
import {freshSave} from '../js/systems/SaveSystem.js';
import {stepBot,seeded} from './bot.js';
const results=[];
for(const mode of ['ENDLESS','SUPER_VOMIT'])for(let seed=1;seed<=3;seed++){
 const save=freshSave();if(mode==='SUPER_VOMIT'){save.stats.victories=1;save.modes.superVomitUnlocked=true;}
 const g=new Game(save,{rng:seeded(seed)});g.start(['tung','shark','cup'][seed-1],mode==='SUPER_VOMIT'?mode:'NORMAL');
 let steps=0,maxEnemies=0,maxProjectiles=0;
 while(!g.ended&&g.time<2400&&steps++<100000){if(g.state==='POST_VICTORY')g.enterEndless();stepBot(g);maxEnemies=Math.max(maxEnemies,g.enemies.length);maxProjectiles=Math.max(maxProjectiles,g.projectiles.length);}
 results.push({mode,seed,time:Math.round(g.time),victory:g.victoryRecorded,endless:Math.round(g.endlessTime),bosses:g.endlessBosses,superDefeated:g.superDefeated,level:g.player.level,kills:g.kills,ended:g.ended,hp:Math.round(g.player.hp),maxEnemies,maxProjectiles});
}
console.log(JSON.stringify(results,null,2));
