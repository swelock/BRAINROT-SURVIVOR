export const motionProfiles={tung:{stride:110,bob:1.6},shark:{stride:88,bob:1.5},cup:{stride:105,bob:1},croc:{stride:145,bob:1.3},chaos:{stride:117,bob:1.4}};
export function directionIndex(a){return ((Math.round(a/(Math.PI/4))%8)+8)%8;}
export function updateLocomotion(p,dt,dx,dy,dashing=false){
 const m=p.motion||(p.motion={phase:0,direction:directionIndex(Math.atan2(p.lastY,p.lastX)),speed:0,bank:0,hoverPhase:0,ux:1,uy:0}),profile=motionProfiles[p.character.id],distance=Math.hypot(dx,dy),speed=distance/Math.max(dt,.0001),moving=speed>1;
 m.hoverPhase=(m.hoverPhase+dt*(moving?4:1.8))%(Math.PI*2);m.dashing=dashing;m.moving=moving;
 if(moving){const a=Math.atan2(dy,dx),center=m.direction*Math.PI/4,diff=Math.atan2(Math.sin(a-center),Math.cos(a-center));if(Math.abs(diff)>Math.PI/8+.035)m.direction=directionIndex(a);
  if(!dashing)m.phase=(m.phase+distance/profile.stride*6)%6;
  const ux=dx/distance,uy=dy/distance,turn=m.ux*uy-m.uy*ux,acceleration=(speed-m.speed)/Math.max(1,p.character.speed);
  const desired=p.character.id==='croc'?Math.max(-.18,Math.min(.18,turn*.6+ux*Math.min(.055,speed*.00013)+acceleration*.025)):0;
  m.bank+=(desired-m.bank)*(1-Math.exp(-dt*10));m.ux=ux;m.uy=uy;
 }else m.bank*=Math.exp(-dt*6);
 m.speed=speed;m.frame=moving&&!dashing?Math.floor(m.phase)%6:0;
 m.bob=p.character.id==='croc'?Math.sin(m.hoverPhase)*(moving?1.5:.65):moving&&!dashing?(1-Math.cos(m.phase/6*Math.PI*(p.character.id==='shark'?6:4)))*profile.bob*.5:0;
 m.contact=p.character.id==='croc'?.8+.15*Math.sin(m.hoverPhase):moving&&!dashing?1-m.bob/(profile.bob*2):1;
 return m;
}
