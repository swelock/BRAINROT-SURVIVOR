export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export const angle=(a,b)=>Math.atan2(b.y-a.y,b.x-a.x);
export const pick=(arr,rng=Math.random)=>arr[Math.floor(rng()*arr.length)];
export function weighted(items,weight,rng=Math.random){let n=rng()*items.reduce((s,x)=>s+weight(x),0);for(const x of items){n-=weight(x);if(n<=0)return x;}return items.at(-1);}
export function direction(x,y){const d=Math.hypot(x,y);return d?{x:x/d,y:y/d}:{x:0,y:0};}
export class SpatialGrid{
 constructor(size=100){this.size=size;this.cells=new Map();}
 rebuild(items){this.cells.clear();for(const e of items){if(e.dead)continue;const k=`${Math.floor(e.x/this.size)},${Math.floor(e.y/this.size)}`;if(!this.cells.has(k))this.cells.set(k,[]);this.cells.get(k).push(e);}}
 query(x,y,r){const out=[];for(let i=Math.floor((x-r)/this.size);i<=Math.floor((x+r)/this.size);i++)for(let j=Math.floor((y-r)/this.size);j<=Math.floor((y+r)/this.size);j++){const a=this.cells.get(`${i},${j}`);if(a)out.push(...a);}return out;}
}
