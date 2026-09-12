"""Six procedural locomotion frames x eight views. Shared camera/scale/anchor, no cropping."""
import json,math,multiprocessing
from pathlib import Path
from PIL import Image
from models import build
from render_character import render,ROOT
from build_spritesheets import pack
BASE=Path(__file__).parent
NAMES=['tung','shark','cup','croc','chaos']
def frame_job(args):
    name,direction,step,config=args
    im=render(build(name,step*math.tau/6),math.pi/2-direction*math.pi/4,config)
    return direction,step,im
if __name__=='__main__':
    output=ROOT/'assets/characters'
    with multiprocessing.Pool(3) as workers:
        for name in NAMES:
            config=json.loads((BASE/'config'/f'{name}.json').read_text())
            sheet=Image.new('RGBA',(768,1024))
            for direction,step,im in workers.imap_unordered(frame_job,[(name,d,s,config)for d in range(8)for s in range(6)]):
                sheet.paste(im,(step*128,direction*128))
            sheet.save(output/f'{name}-walk.webp',lossless=True,method=6)
            (output/f'{name}-walk.json').write_text(json.dumps({**config,'frames':6,'directions':['E','SE','S','SW','W','NW','N','NE'],'width':768,'height':1024,'source':f'{name}-walk.webp'},indent=2))
            if name=='chaos':pack(name,[render(build(name),math.pi/2-d*math.pi/4,config) for d in range(8)],config,output)
            print(name,(output/f'{name}-walk.webp').stat().st_size,flush=True)
