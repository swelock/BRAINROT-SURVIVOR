export const SAVE_KEY='brainrot-survivors-v1';
export function freshSave(){return {version:1,dna:0,upgrades:{},characters:{chaos:false},stats:{runs:0,time:0,kills:0,wave:0,level:1,bosses:0,dna:0,multiplier:1,victories:0},settings:{lang:'ru',master:.65,music:.3,sfx:.65,shake:true}};}
export class SaveSystem{
 constructor(storage=globalThis.localStorage){this.storage=storage;this.available=true;this.data=this.load();}
 load(){const defaults=freshSave();try{const raw=JSON.parse(this.storage?.getItem(SAVE_KEY)||'null');if(!raw||raw.version!==1)return defaults;const d={...defaults,dna:Number.isFinite(raw.dna)?Math.max(0,raw.dna):0};for(const k of ['upgrades','characters','stats','settings'])if(raw[k]&&typeof raw[k]==='object'&&!Array.isArray(raw[k]))d[k]={...defaults[k],...raw[k]};for(const k of Object.keys(defaults.stats))if(!Number.isFinite(d.stats[k])||d.stats[k]<0)d.stats[k]=defaults.stats[k];for(const k of ['master','music','sfx'])d.settings[k]=Number.isFinite(d.settings[k])?Math.max(0,Math.min(1,d.settings[k])):defaults.settings[k];d.settings.lang=d.settings.lang==='en'?'en':'ru';return d;}catch{this.available=false;return defaults;}}
 write(){try{this.storage?.setItem(SAVE_KEY,JSON.stringify(this.data));return true;}catch{this.available=false;return false;}}
}
export function awardRun(save,run,bonuses={},rng=Math.random){
 let dna=10+run.wave+Math.floor(run.kills/50)+25*run.bosses*(1+(bonuses.bossBonus||0))+(run.victory?50:0)+Math.floor(run.kills/100)*(bonuses.killBonus||0);
 dna*=1+(bonuses.dna||0);if(run.wave>10)dna*=1+(bonuses.survivorBonus||0);const doubled=rng()<(bonuses.rewardDouble||0);if(doubled)dna*=2;dna=Math.floor(dna);
 const record=run.wave>save.stats.wave||run.kills> (save.stats.bestKills||0)||run.level>save.stats.level||run.bestMultiplier>save.stats.multiplier;save.dna+=dna;const s=save.stats;s.runs++;s.time+=run.time;s.kills+=run.kills;s.wave=Math.max(s.wave,run.wave);s.level=Math.max(s.level,run.level);s.bosses+=run.bosses;s.dna+=dna;s.multiplier=Math.max(s.multiplier,run.bestMultiplier);s.victories+=Number(run.victory);s.bestKills=Math.max(s.bestKills||0,run.kills);if(run.wave>=12)save.characters.chaos=true;return {dna,record,doubled};
}
