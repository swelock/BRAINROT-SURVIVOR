# v1.0.3 — 2026-09-12 · FINAL POLISH

- Размер секторов рассчитывается из тех же весов, что используются для выбора награды. Указатель и звук работают с переменными углами; Jackpot занимает честные 1% / 3%.
- Централизованы нормальные и усиленные награды: 6 минут удачи, 2 босса с добычей, 67 на атаке 7; Jackpot при выигрыше риска даёт ×4 общего дохода забега. Переполнение ограниченных бонусов конвертируется в ДНК и показывается заранее.
- 6 процедурных кадров × 8 направлений для каждого героя; фаза от реального перемещения, покой, отдельный рывок, отдача поверх шага, крен самолёта и контактная тень.
- Безопасное дополнение сохранений v1.0.2. 119 тестов; 11 прежних симуляций дают идентичные результаты.
- Контент игры и визуальные материалы зафиксированы. Платформенные функции в этот патч не входят.

[Полный отчёт v1.0.3](UPDATE-v1.0.3.md).

---

# v1.0.2 — 2026-09-12

- Жидкие снаряды, следы, пятна, рот/отдача героев, реакция и исчезновение врагов, слои спутников, свет и короткая остановка на крупных событиях.
- Одно бесплатное колесо за завершённый забег, Victory Wheel, одноразовый риск только бонусом.
- Сохраняемые бонусы следующего обычного забега и перевыбор улучшений.
- Обучение новичков, двойное касание джойстика, обработка отмены ввода.
- Совместимая миграция сохранений. 82 теста; баланс прежних режимов подтверждён 11 идентичными симуляциями.

Подробности и точные вероятности: [UPDATE-v1.0.2.md](UPDATE-v1.0.2.md).

---

# v2 — отчёт об изменениях

Обновление сохраняет прежний игровой движок, движение, рывок, оружие, эволюции и постоянные улучшения. Добавлены объёмные спрайты четырёх героев, кэшированные тени, эффекты, SIX SEVEN, POST_VICTORY, Endless и СУПЕРБЛЕВОТА. Проверки и ограничения — в VALIDATION.md; правила режимов и наград — в README.md.

Внешних моделей и платных ресурсов нет. Реально поставлены четыре собственные 3D-модели, записанные процедурным Python-кодом, и 32 предварительно отрисованных кадра. Отдельные CREDITS.md и tools/assets-manifest.json различают поставленные ресурсы и исследованные источники.

Сохранения: прежний ключ и версия схемы, безопасные значения новых полей; победа пишется сразу, итоговая ДНК — один раз при завершении. Текущая сборка забега по-прежнему не сохраняется между перезагрузками.

## Изменённые файлы

- `README.md`
- `VALIDATION.md`
- `css/style.css`
- `js/data/catalog.js`
- `js/game/Game.js`
- `js/game/Renderer.js`
- `js/main.js`
- `js/systems/AudioSystem.js`
- `js/systems/EnemySystem.js`
- `js/systems/SaveSystem.js`
- `js/systems/UpgradeSystem.js`
- `js/systems/WeaponSystem.js`
- `js/ui/UIManager.js`
- `package.json`
- `tests/balance.mjs`
- `tests/game.test.js`

## Добавленные файлы

- `.gitignore`
- `CREDITS.md`
- `assets/characters/croc.json`
- `assets/characters/croc.webp`
- `assets/characters/cup.json`
- `assets/characters/cup.webp`
- `assets/characters/shark.json`
- `assets/characters/shark.webp`
- `assets/characters/tung.json`
- `assets/characters/tung.webp`
- `js/systems/AssetManager.js`
- `js/systems/ModeSystem.js`
- `js/systems/SixSeven.js`
- `tests/bot.js`
- `tests/browser.html`
- `tests/modes-balance.mjs`
- `tests/results/modes.json`
- `tests/results/normal.json`
- `tests/v2.test.js`
- `tools/asset-pipeline/README.md`
- `tools/asset-pipeline/build_spritesheets.py`
- `tools/asset-pipeline/config/croc.json`
- `tools/asset-pipeline/config/cup.json`
- `tools/asset-pipeline/config/shark.json`
- `tools/asset-pipeline/config/tung.json`
- `tools/asset-pipeline/export_obj.py`
- `tools/asset-pipeline/models.py`
- `tools/asset-pipeline/render_character.py`
- `tools/asset-pipeline/requirements.txt`
- `tools/asset-pipeline/validate_assets.py`
- `tools/assets-manifest.json`
