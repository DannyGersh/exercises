
# A methode of separating js and jsx

# this script detects if a given 
# .jsx file hase changed, than it
# compiles it via "pleasebuild"


import os
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
   

class Monitor:
    
    def __init__(self, file_main, file_jsx):
        self.file_main = file_main
        self.file_jsx = file_jsx
        self.observer = Observer()
  
    def run(self):

        class Handler(FileSystemEventHandler):
            @staticmethod
            def on_any_event(event):
                if event.is_directory:
                    return None
                elif event.event_type == 'modified':
                    os.system(''
                        'pleasebuild %s.jsx > %s.js && echo successfully built %s.js'
                        %(self.file_main, self.file_main, self.file_main)
                    )
                    
        self.observer.schedule(Handler(), self.file_main+'.jsx', recursive = False)
        self.observer.schedule(Handler(), self.file_jsx+'.jsx', recursive = False)
        self.observer.start()
        try:
            while True:
                time.sleep(5)
        except:
            self.observer.stop()
            print("Observer Stopped")
  
        self.observer.join()
  
  
watch = Monitor('./chalange/src/chalange/Chalange', './chalange/src/chalange/jsx')
watch.run()