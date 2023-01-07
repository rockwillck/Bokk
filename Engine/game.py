import webview
from playsound import playsound

class Api:
    def __init__(self):
        pass

    def ready(self):
        print("Ready to go!")
    
    def playSound(self, sound):
        playsound(f"audio/{sound}")

# Open website
api = Api()
window = webview.create_window('Mysterious Mind', 'index.html', js_api = api)
webview.start()