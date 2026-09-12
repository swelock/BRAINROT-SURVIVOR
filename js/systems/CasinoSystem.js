import {rewardLabels,dnaValue,rewardOutcome} from './CasinoRewards.js';
export const rewardDefinitions=rewardLabels;
export const normalPool=[['dna10',20],['dna25',18],['dna50',8],['half',10],['double',5],['startingChest',9],['luckyStart',8],['extraRerolls',9],['bossLoot',7],['early67',5],['triple',1]];
export const victoryPool=[['dna30',12],['dna50',18],['dna100',12],['double',12],['startingChest',10],['luckyStart',9],['extraRerolls',9],['bossLoot',8],['early67',7],['triple',3]];
export function poolFor(c){return c.victory?victoryPool:normalPool;}
export function prepareCasino(save,result){
 // A forgotten pending reward is kept before replacing the ledger with the next completed run.
 if(save.casino?.status==='pending')settleCasino(save,false);
 save.casino={runId:save.stats.runs,baseDNA:result.dna,victory:!!result.victory,status:'ready',reward:null,index:null,riskUsed:false};return save.casino;
}
export function spinCasino(save,rng=Math.random){const c=save.casino;if(!c||c.status!=='ready')return false;const pool=poolFor(c),sum=pool.reduce((n,r)=>n+r[1],0);let n=Math.max(0,Math.min(.999999999,rng()))*sum,index=pool.length-1;for(let i=0;i<pool.length;i++){n-=pool[i][1];if(n<0){index=i;break;}}c.index=index;c.reward=pool[index][0];c.status='pending';return c;}
export function rewardValue(c){return dnaValue(c);}
export {rewardOutcome};
export function settleCasino(save,risk=false,rng=Math.random){const c=save.casino;if(!c||c.status!=='pending')return false;
 const factor=risk?(rng()<.5?2:0):1;c.riskUsed=!!risk;c.factor=factor;c.status='claimed';c.addedDNA=0;
 if(factor){const outcome=rewardOutcome(save,c,factor===2);c.addedDNA=outcome.dna;c.description=outcome.description;save.dna+=outcome.dna;save.stats.dna+=outcome.dna;save.nextRunBonuses=outcome.bonuses;save.enhancedRunBonuses=outcome.extras;c.savedBonus=save.nextRunBonuses[c.reward];}return c;
}
export function skipCasino(save){const c=save.casino;if(!c||c.status!=='ready')return false;c.status='skipped';return true;}
export function normalizeCasino(raw){if(!raw||!Number.isSafeInteger(raw.runId)||raw.runId<1||!Number.isFinite(raw.baseDNA)||raw.baseDNA<0||!['ready','pending','claimed','skipped'].includes(raw.status))return null;const c={...raw,victory:!!raw.victory};if(['pending','claimed'].includes(c.status)&&!poolFor(c).some(([id])=>id===c.reward))return null;c.index=['pending','claimed'].includes(c.status)?poolFor(c).findIndex(([id])=>id===c.reward):null;return c;}

// Angles use the same pool as selection. Zero is the fixed top pointer, clockwise.
export function sectorsFor(c){const pool=poolFor(c),total=pool.reduce((sum,[,weight])=>sum+weight,0);let start=0;return pool.map(([id,weight],index)=>{const angle=weight/total*Math.PI*2,sector={id,label:rewardDefinitions[id],weight,index,start,end:start+angle,angle,center:start+angle/2};start+=angle;return sector;});}
export function finalRotation(c,turns=0){return turns*360-sectorsFor(c)[c.index].center*180/Math.PI;}
export function sectorAtRotation(c,degrees){const a=(((-degrees*Math.PI/180)%(Math.PI*2))+Math.PI*2)%(Math.PI*2);return sectorsFor(c).find(s=>a>=s.start&&a<s.end)||sectorsFor(c).at(-1);}
