"""Verify dimensions, visible margins, unique poses and fixed anchors for every locomotion row."""
from pathlib import Path
import json
from PIL import Image
root=Path(__file__).resolve().parents[2]/'assets/characters'
report=[]
for name in ['tung','shark','cup','croc','chaos']:
    image=Image.open(root/f'{name}-walk.webp').convert('RGBA');meta=json.loads((root/f'{name}-walk.json').read_text())
    assert image.size==(768,1024) and meta['frames']==6 and len(meta['directions'])==8
    static=json.loads((root/f'{name}.json').read_text())
    assert (meta['anchorX'],meta['anchorY'],meta['pixelsPerUnit'])==(static['anchorX'],static['anchorY'],static['pixelsPerUnit'])
    counts=[];bounds=[]
    for d in range(8):
        frames=[image.crop((i*128,d*128,(i+1)*128,(d+1)*128))for i in range(6)]
        counts.append(len({f.tobytes()for f in frames}))
        assert counts[-1]==6,(name,d,counts[-1])
        for f in frames:
            box=f.getchannel('A').point(lambda x:255 if x>20 else 0).getbbox();assert box and box[0]>0 and box[1]>0 and box[2]<128 and box[3]<128,(name,d,box);bounds.append(box)
    row={'character':name,'bytes':(root/f'{name}-walk.webp').stat().st_size,'distinctFramesPerDirection':counts,'bounds':[min(b[0]for b in bounds),min(b[1]for b in bounds),max(b[2]for b in bounds),max(b[3]for b in bounds)]};report.append(row)
print(json.dumps(report,indent=2))
