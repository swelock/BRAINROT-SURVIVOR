export const characterAssets={tung:{anchorY:109},shark:{anchorY:87},croc:{anchorY:92},cup:{anchorY:111}};
export class AssetManager{
 constructor({imageFactory=()=>new Image(),timeout=5000}={}){this.images=new Map();this.failed=new Set();this.imageFactory=imageFactory;this.timeout=timeout;this.ready=false;this.pending=null;}
 load(id,url){if(this.images.has(id))return Promise.resolve(this.images.get(id));return new Promise(resolve=>{
  let image,timer,settled=false;const done=ok=>{if(settled)return;settled=true;clearTimeout(timer);if(image){image.onload=null;image.onerror=null;}if(ok)this.images.set(id,image);else this.failed.add(id);resolve(ok?image:null);};
  try{image=this.imageFactory();image.onload=()=>done(image.naturalWidth===1024&&image.naturalHeight===128);image.onerror=()=>done(false);timer=setTimeout(()=>done(false),this.timeout);image.src=url;}catch{done(false);}
 });}
 preload(){if(!this.pending)this.pending=Promise.all(Object.keys(characterAssets).map(id=>this.load(id,new URL(`../../assets/characters/${id}.webp`,import.meta.url).href))).then(()=>{this.ready=true;});return this.pending;}
 draw(c,id,x,y,scale=1,t=0,facing=1,hit=false,pose={}){
  const img=this.images.get(id);if(!img)return false;
  const a=pose.lastX===undefined?(facing<0?Math.PI*.75:Math.PI*.25):Math.atan2(pose.lastY,pose.lastX);
  const spin=id==='cup'&&(pose.specialTime||0)>0;const frame=((Math.round((a+(spin?pose.specialTime*14:0))/(Math.PI/4))%8)+8)%8;
  const moving=pose.moving||pose.dashLeft>0;const bob=Math.sin(t*(moving?12:3))*(id==='croc'?2.8:id==='tung'?.7:1.3);
  const special=pose.specialTime||0;const slam=id==='tung'&&special>0;const anticipation=id==='tung'&&pose.passive<.22;
  const dash=pose.dashLeft>0;const squash=anticipation?.86:slam?1+.12*Math.sin(special*15):1;
  c.save();c.translate(x,y+22*scale);c.rotate(moving?(id==='croc'?.055:.025)*Math.sin(t*9):0);
  if(pose.dead){c.rotate(-.65);c.globalAlpha=.5;}c.scale(scale*(dash?1.2:1)/squash,scale*(pose.dead?.45:dash?.88:1)*squash);c.translate(0,bob-(id==='croc'?9:0));
  const size=106,anchor=characterAssets[id].anchorY/128*size;
  if(dash){c.globalAlpha=.18;c.drawImage(img,frame*128,0,128,128,-size/2-pose.lastX*15,-anchor-pose.lastY*15,size,size);c.globalAlpha=1;}
  c.globalAlpha=pose.dead?.45:hit?.75:1;c.drawImage(img,frame*128,0,128,128,-size/2,-anchor,size,size);c.restore();return true;
 }
}
export const assets=new AssetManager();
