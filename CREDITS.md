# Asset credits — BRAINROT SURVIVORS v2

## Assets actually shipped

- **Tung, Tralalero, Bombardiro, Ballerina:** original parametric mesh implementations authored for this project in `tools/asset-pipeline/models.py`; rendered offline to `assets/characters/*.webp`. These are project-created stylized interpretations, not meshes by the Sketchfab creators named in the specification. No external model, texture, shoe logo or image is included.
- **The Absolute Brainrot, enemies, arena, UI and combat effects:** project Canvas artwork; v2 adds cached shadows and a custom drawn `67` projectile.
- **Music and sounds, including SIX SEVEN / ABSOLUTE 67:** project Web Audio synthesis. No sampled meme audio.

There are **no third-party CC BY assets shipped**, so no external asset attribution obligations are introduced by this update. The status and links of researched but unused candidates are in `tools/assets-manifest.json`; those entries are research records, not asset credits.

## Development tools

Python, NumPy and Pillow render and pack the atlases offline. They are not bundled into the browser game. Blender is optional for editing exported OBJ geometry and was not used to render these atlases. The project includes no new runtime dependency, CDN, account service or API key.

## v1.0.3 locomotion

Пять атласов движения и статический атлас существующего Абсолютного Брейнрота созданы локально из процедурных моделей проекта. Источник: `tools/asset-pipeline/models.py`; сборка: `render_walkcycles.py`. Внешние модели, платные сервисы и сторонние изображения для патча не использовались.
