import {addBonus} from './NextRunBonusSystem.js';
// Relative weights, deliberately exposed for deterministic verification. No gameplay RNG is consumed.
export const rewardDefinitions={dna10:['+10 ДНК','+10 DNA'],dna25:['+25 ДНК','+25 DNA'],dna30:['+30 ДНК','+30 DNA'],dna50:['+50 ДНК','+50 DNA'],dna100:['+100 ДНК','+100 DNA'],half:['+50% ДНК забега','+50% run DNA'],double:['×2 ДНК забега','×2 run DNA'],triple:['JACKPOT ×3','JACKPOT ×3'],startingChest:['Стартовый сундук','Starting chest'],luckyStart:['Удачный старт','Lucky start'],extraRerolls:['+1 перевыбор','+1 reroll'],bossLoot:['Добыча босса','Boss loot'],early67:['67 FEVER','67 FEVER']};
export const normalPool=[['dna10',20],['dna25',18],['dna50',8],['half',10],['double',5],['startingChest',9],['luckyStart',8],['extraRerolls',9],['bossLoot',7],['early67',5],['triple',1]];
export const victoryPool=[['dna30',12],['dna50',18],['dna100',12],['double',12],['startingChest',10],['luckyStart',9],['extraRerolls',9],['bossLoot',8],['early67',7],['triple',3]];
export function poolFor(c){return c.victory?victoryPool:normalPool;}
export function prepareCasino(save,result){
 // A forgotten pending reward is kept before replacing the ledger with the next completed run.
 if(save.casino?.status==='pending')settleCasino(save,false);
 save.casino={runId:save.stats.runs,baseDNA:result.dna,victory:!!result.victory,status:'ready',reward:null,index:null,riskUsed:false};return save.casino;
}
export function spinCasino(save,rng=Math.random){const c=save.casino;if(!c||c.status!=='ready')return false;const pool=poolFor(c),sum=pool.reduce((n,r)=>n+r[1],0);let n=Math.max(0,Math.min(.999999999,rng()))*sum,index=pool.length-1;for(let i=0;i<pool.length;i++){n-=pool[i][1];if(n<0){index=i;break;}}c.index=index;c.reward=pool[index][0];c.status='pending';return c;}
export function rewardValue(c){if(c.reward?.startsWith('dna'))return Number(c.reward.slice(3));return c.reward==='half'?Math.floor(c.baseDNA*.5):c.reward==='double'?c.baseDNA:c.reward==='triple'?c.baseDNA*2:0;}
export function settleCasino(save,risk=false,rng=Math.random){const c=save.casino;if(!c||c.status!=='pending')return false;
 const factor=risk?(rng()<.5?2:0):1;c.riskUsed=!!risk;c.factor=factor;c.status='claimed';c.addedDNA=rewardValue(c)*factor;
 save.dna+=c.addedDNA;save.stats.dna+=c.addedDNA;if(!rewardValue(c)&&factor){const before=save.nextRunBonuses?.[c.reward]||0;addBonus(save,c.reward,factor);c.appliedBonus=save.nextRunBonuses[c.reward]-before;c.savedBonus=save.nextRunBonuses[c.reward];}return c;
}
export function skipCasino(save){const c=save.casino;if(!c||c.status!=='ready')return false;c.status='skipped';return true;}
export function normalizeCasino(raw){if(!raw||!Number.isSafeInteger(raw.runId)||raw.runId<1||!Number.isFinite(raw.baseDNA)||raw.baseDNA<0||!['ready','pending','claimed','skipped'].includes(raw.status))return null;const c={...raw,victory:!!raw.victory};if(['pending','claimed'].includes(c.status)&&!poolFor(c).some(([id])=>id===c.reward))return null;c.index=['pending','claimed'].includes(c.status)?poolFor(c).findIndex(([id])=>id===c.reward):null;return c;}
