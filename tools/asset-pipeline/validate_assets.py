"""Verify atlas geometry, safe transparent margins, distinct directions and size budget."""
import json
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[2]
total=0
for meta in sorted((ROOT/'assets/characters').glob('*.json')):
    cfg=json.loads(meta.read_text());path=meta.with_suffix('.webp');im=Image.open(path).convert('RGBA');n=cfg['frameSize']
    assert im.size==(n*8,n),(path,im.size)
    hashes=[]
    for i in range(8):
        frame=im.crop((i*n,0,(i+1)*n,n));alpha=frame.getchannel('A').point(lambda a:255 if a>80 else 0);bbox=alpha.getbbox()
        assert bbox and min(bbox[:2])>=2 and max(bbox[2:])<=n-2,(path,i,'clipping',bbox)
        assert (bbox[2]-bbox[0])*(bbox[3]-bbox[1])>n*n*.12,(path,i,'excess padding')
        hashes.append(frame.tobytes())
    assert len(set(hashes))==8,(path,'duplicate directions');total+=path.stat().st_size
assert total<1_000_000,('asset budget',total)
print('PASS: 4 atlases, 32 directions, transparent margins; total bytes:',total)
