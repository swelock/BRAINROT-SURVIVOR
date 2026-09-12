# Offline character art pipeline

The shipped images are rendered from original parametric **3D triangle meshes**, not copied pictures or downloaded Sketchfab models. No network, account, paid API, image generation service or runtime mesh loader is used.

## Reproduce shipped atlases

Development dependencies: Python 3, NumPy, Pillow. Players need only a browser.

```sh
python3 -m pip install -r tools/asset-pipeline/requirements.txt
python3 tools/asset-pipeline/render_character.py
python3 tools/asset-pipeline/validate_assets.py
```

`models.py` → common orthographic software rasterizer → 8 RGBA frames → lossless WebP atlas. `--character shark` regenerates a single character. Paths resolve relative to the tools, so these commands do not depend on the current directory for outputs.

Each mesh has X right, Z up, face toward −Y. Camera elevation is 40°, with shared key/fill lighting, smooth vertex normals, lower-body ambient shading, supersampling at 2× and Lanczos reduction. Directions are E, SE, S, SW, W, NW, N, NE. An atlas is 1024×128, with 128×128 frames. `config/*.json` specifies one scale and ground anchor per character; all directions share that scale and anchor. No per-frame cropping that would make animation jump.

The validator checks all 32 frames for transparency margins, clipping, nonempty content, distinct directions and a combined runtime budget below 1 MB. The actual atlases total about 190 KB. Generated JSON records the frame layout for other tools. Runtime constants in `AssetManager.js` must match anchor changes; the Node tests check this contract.

## Editing and Blender

Blender was not installed or used for this build. The tested software rasterizer provides the complete reproducible 3D → 2D path without requiring it. To edit the original geometry in Blender or another OBJ-compatible editor:

```sh
python3 tools/asset-pipeline/export_obj.py tung /tmp/brainrot-art
```

Import the resulting OBJ with its adjacent MTL. This exporter was tested; no Blender rendering was tested. For imported replacement artwork, preserve the frame dimensions, anchor, direction order and filenames above. Verify the source license and record the actual shipped source in `tools/assets-manifest.json` and `CREDITS.md` before integrating external art. Keep source/intermediate meshes outside the runtime assets directory.

## Runtime

`AssetManager` preloads each atlas once, validates dimensions and waits at most five seconds. A failed image falls back to the original Canvas character renderer. The start button explains the brief loading state; it enables even if an atlas fails. Runtime uses Canvas `drawImage`, cached contact/projected shadows and procedural bob, bank, dash stretch, slam anticipation, hit response and cup spin. No Blender, NumPy, Pillow, OBJ or 3D engine is loaded by the game.
