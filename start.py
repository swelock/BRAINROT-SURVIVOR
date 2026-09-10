"""Local static preview; Python 3 standard library only."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
from pathlib import Path
import webbrowser

root = Path(__file__).resolve().parent
handler = partial(SimpleHTTPRequestHandler, directory=str(root))
try:
    server = ThreadingHTTPServer(('127.0.0.1', 8000), handler)
except OSError:
    server = ThreadingHTTPServer(('127.0.0.1', 0), handler)
url = f'http://127.0.0.1:{server.server_address[1]}'
print(f'BRAINROT SURVIVORS: {url}\nCtrl+C — остановить / stop', flush=True)
webbrowser.open(url)
try:
    server.serve_forever()
except KeyboardInterrupt:
    pass
finally:
    server.server_close()
