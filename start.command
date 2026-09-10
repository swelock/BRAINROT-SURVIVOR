#!/bin/zsh
cd -- "${0:A:h}"
if command -v python3 >/dev/null 2>&1; then
  python3 start.py
else
  print 'Для локального запуска нужен Python 3. См. README.md.'
  read '?Нажмите Enter, чтобы закрыть окно.'
fi
