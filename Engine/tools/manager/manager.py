import webview
from playsound import playsound
import os

class Api:
    def __init__(self):
        pass

    def ready(self):
        print("Ready to go!")
    
    def launchGame(self):
        os.system(f'python3 "game.py"')

    def launchArt(self):
        os.system(f'python3 "../art/art.py"')


# Open website
api = Api()
window = webview.create_window('Toolkit', 'toolkit.html', js_api = api)
webview.start()