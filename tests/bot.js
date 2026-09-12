export function stepBot(g){
 if(g.state==='LEVEL_UP'){const priorities={more:14,regen:12,health:10,strong:9,armor:8,magnet:9,cooldown:8,bossHunter:9,crit:6,overclock:8,unstable:7};const score=o=>o.type==='evolution'?30:o.type==='weapon'?({basic:7,toxic:12,nuclear:11,rainbow:9,burp:10,orbit:13,sigma:9}[o.id])+(o.level>1?1:0):priorities[o.id]||2;g.choose(g.options.map((o,i)=>({i,s:score(o)})).sort((a,b)=>b.s-a.s)[0].i);return;}
 const p=g.player;let x=0,y=0;let nearest=null,nd=Infinity;for(const q of g.pickups){let d=Math.hypot(q.x-p.x,q.y-p.y);if(d<nd){nearest=q;nd=d;}}if(nearest){x+=(nearest.x-p.x)/(nd||1)*.8;y+=(nearest.y-p.y)/(nd||1)*.8;}else{x=Math.cos(g.time*.09)*.4;y=Math.sin(g.time*.09)*.4;}
 let danger=0;for(const e of g.enemies){let dx=p.x-e.x,dy=p.y-e.y,d=Math.hypot(dx,dy)||1;if(d<155){const w=3*(1-d/155);x+=dx/d*w;y+=dy/d*w;if(d<65)danger++;}if(e.warning){const z=e.warning,dx=p.x-z.x,dy=p.y-z.y,d=Math.hypot(dx,dy)||1;if(d<z.r+70){x+=dx/d*6;y+=dy/d*6;}}}
 for(const b of g.enemyBullets){const dx=p.x-b.x,dy=p.y-b.y,d=Math.hypot(dx,dy)||1;if(d<80){x+=dx/d*(1-d/80)*2;y+=dy/d*(1-d/80)*2;}}
 g.input={x,y,dash:danger>1};g.update(1/30);
}
export function seeded(seed){return()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}
