"""Pack 8 equally anchored direction frames; retain one shared scale, never auto-crop each frame."""
from PIL import Image
import json
def pack(name,frames,config,out):
    out.mkdir(parents=True,exist_ok=True);size=config['frameSize']
    sheet=Image.new('RGBA',(size*8,size))
    for i,frame in enumerate(frames):sheet.paste(frame,(i*size,0))
    sheet.save(out/f'{name}.webp',lossless=True,method=6)
    (out/f'{name}.json').write_text(json.dumps({**config,'directions':['E','SE','S','SW','W','NW','N','NE'],'source':f'{name}.webp'},indent=2)+'\n')
