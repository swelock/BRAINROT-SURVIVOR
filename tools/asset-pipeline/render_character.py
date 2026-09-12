"""Deterministic orthographic mesh rasterizer. Python + NumPy + Pillow; no paid service."""
import json, math, argparse
from pathlib import Path
import numpy as np
from PIL import Image
from models import build
ROOT=Path(__file__).resolve().parents[2]
def render(mesh,yaw,config):
    size=config['frameSize']; ss=2; n=size*ss
    v=np.array(mesh.vertices,dtype=float); faces=np.array(mesh.faces)
    rot=np.array([[math.cos(yaw),-math.sin(yaw),0],[math.sin(yaw),math.cos(yaw),0],[0,0,1]])
    v=v@rot.T
    elevation=math.radians(40); sn=math.sin(elevation);cs=math.cos(elevation)
    depth=-v[:,1]*cs+v[:,2]*sn
    scale=config['pixelsPerUnit']*ss
    screen=np.column_stack([n/2+v[:,0]*scale,config['anchorY']*ss-(v[:,2]*cs+v[:,1]*sn)*scale])
    cross=np.cross(v[faces[:,1]]-v[faces[:,0]],v[faces[:,2]]-v[faces[:,0]])
    # Shared vertex normals smooth ellipsoids. Two-sided lighting handles authoring winding.
    normals=np.zeros_like(v)
    for j in range(3):np.add.at(normals,faces[:,j],cross)
    normals/=np.maximum(np.linalg.norm(normals,axis=1)[:,None],1e-9)
    view=np.array([0,-cs,sn]);normals*=np.where(normals@view<0,-1,1)[:,None]
    key=np.array([-.6,-.7,1.3]);key/=np.linalg.norm(key)
    fill=np.array([.8,-.1,.5]);fill/=np.linalg.norm(fill)
    light=.37+.53*np.maximum(0,normals@key)+.16*np.maximum(0,normals@fill)
    light*=.87+.13*np.clip(v[:,2]/.8,0,1)
    image=np.zeros((n,n,4),dtype=np.uint8);zbuf=np.full((n,n),-np.inf)
    for fi,ids in enumerate(faces):
        pts=screen[ids];lo=np.maximum(0,np.floor(pts.min(axis=0)).astype(int));hi=np.minimum(n-1,np.ceil(pts.max(axis=0)).astype(int))
        if np.any(hi<lo):continue
        (x0,y0),(x1,y1),(x2,y2)=pts;den=(y1-y2)*(x0-x2)+(x2-x1)*(y0-y2)
        if abs(den)<1e-8:continue
        yy,xx=np.mgrid[lo[1]:hi[1]+1,lo[0]:hi[0]+1];xx=xx+.5;yy=yy+.5
        a=((y1-y2)*(xx-x2)+(x2-x1)*(yy-y2))/den;b=((y2-y0)*(xx-x2)+(x0-x2)*(yy-y2))/den;c=1-a-b
        z=a*depth[ids[0]]+b*depth[ids[1]]+c*depth[ids[2]];zb=zbuf[lo[1]:hi[1]+1,lo[0]:hi[0]+1]
        mask=(a>=0)&(b>=0)&(c>=0)&(z>zb)
        if not mask.any():continue
        lum=a*light[ids[0]]+b*light[ids[1]]+c*light[ids[2]]
        rgb=np.clip(np.array(mesh.colors[fi])[None,None,:]*lum[:,:,None]*255,0,255).astype(np.uint8)
        target=image[lo[1]:hi[1]+1,lo[0]:hi[0]+1];target[mask,:3]=rgb[mask];target[mask,3]=255;zb[mask]=z[mask]
    return Image.fromarray(image).resize((size,size),Image.Resampling.LANCZOS)
def main():
    ap=argparse.ArgumentParser();ap.add_argument('--character',choices=['tung','shark','croc','cup','all'],default='all');args=ap.parse_args()
    for name in (['tung','shark','croc','cup'] if args.character=='all' else [args.character]):
        config=json.loads((Path(__file__).parent/'config'/f'{name}.json').read_text());mesh=build(name)
        frames=[render(mesh,math.pi/2-i*math.pi/4,config) for i in range(8)]
        from build_spritesheets import pack
        pack(name,frames,config,ROOT/'assets/characters');print(name,len(mesh.faces),'triangles',flush=True)
if __name__=='__main__':main()
