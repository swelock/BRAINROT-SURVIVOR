export const BONUS_CAPS={startingChest:2,extraRerolls:3,luckyStart:1,bossLoot:1,early67:1};
export function normalizeBonuses(raw={}){return Object.fromEntries(Object.entries(BONUS_CAPS).map(([k,cap])=>[k,Math.min(cap,Math.max(0,Math.floor(Number(raw?.[k])||0)))]));}
export function addBonus(save,key,count=1){save.nextRunBonuses=normalizeBonuses({...save.nextRunBonuses,[key]:(save.nextRunBonuses?.[key]||0)+count});}
// Bonuses are consumed only by a new NORMAL run. Endless retains that run; boss rush keeps its own preparation.
export function activateBonuses(g){const p=g.player;p.rerolls=0;p.bonusBossLoot=0;p.early67=0;p.luckyLeft=0;
 if(g.mode!=='NORMAL')return;
 const b=normalizeBonuses(g.save.nextRunBonuses);g.save.nextRunBonuses=normalizeBonuses();g.onEvent('save');
 p.rerolls=b.extraRerolls;p.bonusBossLoot=b.bossLoot;p.early67=b.early67;p.luckyLeft=b.luckyStart?180:0;if(p.luckyLeft)p.b.luck=(p.b.luck||0)+.25;
 for(let i=0;i<b.startingChest;i++)g.chests.push({x:p.x+(i?48:-48),y:p.y+32,r:22});
}
export function updateBonuses(g,dt){const p=g.player;if(p.luckyLeft>0){p.luckyLeft=Math.max(0,p.luckyLeft-dt);if(!p.luckyLeft)p.b.luck-=.25;}}
