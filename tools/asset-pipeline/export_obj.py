"""Export original meshes as OBJ + MTL for optional editing in Blender (not a runtime dependency)."""
import argparse
from pathlib import Path
from models import build
ap=argparse.ArgumentParser();ap.add_argument('character',choices=['tung','shark','croc','cup']);ap.add_argument('output',type=Path);a=ap.parse_args();m=build(a.character)
a.output.mkdir(parents=True,exist_ok=True);palette=list(dict.fromkeys(tuple(c) for c in m.colors))
with (a.output/f'{a.character}.mtl').open('w') as f:
    for i,c in enumerate(palette):f.write(f'newmtl color{i}\nKd {c[0]} {c[1]} {c[2]}\nKa 0.2 0.2 0.2\nNs 24\n\n')
with (a.output/f'{a.character}.obj').open('w') as f:
    f.write(f'mtllib {a.character}.mtl\no {a.character}\n')
    for v in m.vertices:f.write('v '+' '.join(f'{x:.6f}' for x in v)+'\n')
    last=None
    for face,color in zip(m.faces,m.colors):
        material=palette.index(tuple(color))
        if last!=material:f.write(f'usemtl color{material}\n');last=material
        f.write('f '+' '.join(str(i+1) for i in face)+'\n')
print('Exported',a.character,len(m.faces),'triangles')
