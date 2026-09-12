export const characterAssets={tung:{anchorY:109},shark:{anchorY:87},croc:{anchorY:92},cup:{anchorY:111}};
export class AssetManager{
 constructor({imageFactory=()=>new Image(),timeout=5000}={}){this.images=new Map();this.motionImages=new Map();this.motionReady=false;this.failed=new Set();this.imageFactory=imageFactory;this.timeout=timeout;this.ready=false;this.pending=null;}
 load(id,url){if(this.images.has(id))return Promise.resolve(this.images.get(id));return new Promise(resolve=>{
  let image,timer,settled=false;const done=ok=>{if(settled)return;settled=true;clearTimeout(timer);if(image){image.onload=null;image.onerror=null;}if(ok)this.images.set(id,image);else this.failed.add(id);resolve(ok?image:null);};
  try{image=this.imageFactory();image.onload=()=>done(image.naturalWidth===1024&&image.naturalHeight===128);image.onerror=()=>done(false);timer=setTimeout(()=>done(false),this.timeout);image.src=url;}catch{done(false);}
 });}
 preload(){if(!this.pending)this.pending=Promise.all(Object.keys(characterAssets).map(id=>this.load(id,new URL(`../../assets/characters/${id}.webp`,import.meta.url).href))).then(()=>{this.ready=true;});return this.pending;}
 async preloadMotion(){if(this.motionPending)return this.motionPending;this.motionPending=Promise.all([this.load('chaos',new URL('../../assets/characters/chaos.webp',import.meta.url).href),...['tung','shark','cup','croc','chaos'].map(id=>new Promise(resolve=>{
  let img,timer,settled=false;const done=ok=>{if(settled)return;settled=true;clearTimeout(timer);if(img){img.onload=null;img.onerror=null;}if(ok)this.motionImages.set(id,img);resolve();};
  try{img=this.imageFactory();img.onload=()=>done(img.naturalWidth===768&&img.naturalHeight===1024);img.onerror=()=>done(false);timer=setTimeout(()=>done(false),this.timeout);img.src=new URL(`../../assets/characters/${id}-walk.webp`,import.meta.url).href;}catch{done(false);}
 }))]).then(()=>{this.motionReady=true;});return this.motionPending;}
 draw(c,id,x,y,scale=1,t=0,facing=1,hit=false,pose={}){
  const motion=pose.motion;const useWalk=motion?.moving&&!motion.dashing&&!pose.dead;const walk=this.motionImages.get(id);const img=useWalk&&walk?walk:this.images.get(id);if(!img)return false;
  const attacking=(pose.attackPose||0)>0;const a=motion?.moving?motion.direction*Math.PI/4:attacking?pose.attackAngle:pose.lastX===undefined?(facing<0?Math.PI*.75:Math.PI*.25):Math.atan2(pose.lastY,pose.lastX);
  const spin=id==='cup'&&(pose.specialTime||0)>0;const frame=((Math.round((a+(spin?pose.specialTime*14:0))/(Math.PI/4))%8)+8)%8;
  const moving=motion?.moving||pose.moving||pose.dashLeft>0;const bob=motion?(id==='croc'?motion.bob:motion.moving?-motion.bob:Math.sin(t*3)*.5):Math.sin(t*3)*(id==='croc'?.65:.5);
  const special=pose.specialTime||0;const slam=id==='tung'&&special>0;const anticipation=id==='tung'&&pose.passive<.22;
  const dash=pose.dashLeft>0;const squash=anticipation?.86:slam?1+.12*Math.sin(special*15):1;
  c.save();const recoil=attacking?(pose.attackPose/.085)*(id==='tung'?3:id==='shark'?2:id==='croc'?2.5:1.5):0;c.translate(x-Math.cos(pose.attackAngle??a)*recoil,y+22*scale-Math.sin(pose.attackAngle??a)*recoil);if(attacking)c.scale(1+recoil*.015,1-recoil*.015);c.rotate(id==='croc'?(motion?.bank||0)*(dash?1.5:1):moving?Math.sin((motion?.phase||0)/6*Math.PI*2)*(id==='cup'?.018:.012):0);
  if(pose.dead){c.rotate(-.65);c.globalAlpha=.5;}c.scale(scale*(dash?1.2:1)/squash,scale*(pose.dead?.45:dash?.88:1)*squash);c.translate(0,bob-(id==='croc'?9:0));
  const size=106,anchor=(characterAssets[id]?.anchorY||107)/128*size;const sx=useWalk&&walk?motion.frame*128:frame*128,sy=useWalk&&walk?frame*128:0;
  if(dash){c.globalAlpha=.18;c.drawImage(img,sx,sy,128,128,-size/2-pose.lastX*15,-anchor-pose.lastY*15,size,size);c.globalAlpha=1;}
  c.globalAlpha=pose.dead?.45:hit?.75:1;c.drawImage(img,sx,sy,128,128,-size/2,-anchor,size,size);c.restore();return true;
 }
}
export const assets=new AssetManager();

