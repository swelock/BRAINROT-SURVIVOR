import {normalizeBonuses,normalizeEnhanced} from './NextRunBonusSystem.js';
export const rewardLabels={dna10:['+10 ДНК','+10 DNA'],dna25:['+25 ДНК','+25 DNA'],dna30:['+30 ДНК','+30 DNA'],dna50:['+50 ДНК','+50 DNA'],dna100:['+100 ДНК','+100 DNA'],half:['+50% ДНК забега','+50% run DNA'],double:['×2 ДНК забега','×2 run DNA'],triple:['JACKPOT ×3','JACKPOT ×3'],startingChest:['Стартовый сундук','Starting chest'],luckyStart:['Удачный старт','Lucky start'],extraRerolls:['+1 перевыбор','+1 reroll'],bossLoot:['Добыча босса','Boss loot'],early67:['67 FEVER','67 FEVER']};
export function dnaValue(c,enhanced=false){if(c.reward?.startsWith('dna'))return Number(c.reward.slice(3))*(enhanced?2:1);return c.reward==='half'?Math.floor(c.baseDNA*(enhanced?1:.5)):c.reward==='double'?c.baseDNA*(enhanced?2:1):c.reward==='triple'?c.baseDNA*(enhanced?3:2):0;}
// This pure preview is also the application plan. Caps cannot silently erase a risk win:
// excess chest/reroll/charge or already-owned upgrade converts to 10 DNA per excess unit.
export function rewardOutcome(save,c,enhanced=false){
 const bonuses=normalizeBonuses(save.nextRunBonuses),extras=normalizeEnhanced(save.enhancedRunBonuses),key=c.reward,n=enhanced?2:1;
 let dna=dnaValue(c,enhanced),overflow=0;let detail;
 if(key.startsWith('dna')||['half','double','triple'].includes(key))detail=[`+${dna} ДНК дополнительно`,`+${dna} extra DNA`];
 else if(key==='startingChest'||key==='extraRerolls'){
  const cap=key==='startingChest'?2:3,added=Math.min(n,cap-bonuses[key]);bonuses[key]+=added;overflow=n-added;
  detail=key==='startingChest'?[`${added} стартовых сундука`,`${added} starting chest(s)`]:[`${added} перевыбора`,`${added} reroll(s)`];
 }else if(key==='bossLoot'){
  const before=Math.max(bonuses.bossLoot,extras.bossLootCharges),added=Math.min(n,2-before);extras.bossLootCharges=before+added;bonuses.bossLoot=Number(extras.bossLootCharges>0);overflow=n-added;
  detail=[`Добыча первых ${extras.bossLootCharges} боссов`,`Extra loot from the first ${extras.bossLootCharges} bosses`];
 }else if(key==='luckyStart'){
  const duration=enhanced?360:180,before=Math.max(bonuses.luckyStart?180:0,extras.luckyStartDuration);extras.luckyStartDuration=Math.max(duration,before);bonuses.luckyStart=1;overflow=before>=duration?n:0;
  detail=[`+25% удачи на ${extras.luckyStartDuration/60} мин.`,`+25% luck for ${extras.luckyStartDuration/60} min.`];
 }else if(key==='early67'){
  const at=enhanced?7:17,before=extras.early67At||(bonuses.early67?17:0);extras.early67At=before?Math.min(before,at):at;bonuses.early67=1;overflow=before&&before<=at?n:0;
  detail=[`${extras.early67At===7?'ABSOLUTE ':''}67 FEVER: атака ${extras.early67At}`,`${extras.early67At===7?'ABSOLUTE ':''}67 FEVER: attack ${extras.early67At}`];
 }else throw Error('Unknown casino reward');
 dna+=overflow*10;if(overflow)detail=detail.map((s,i)=>s+(i?` + ${overflow*10} DNA (cap overflow)`:` + ${overflow*10} ДНК (сверх лимита)`));
 return {dna,bonuses,extras,description:detail};
}
