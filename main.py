import eel
import eel.browsers
import signal
import os

import server.config as config
import server.listener as listener_manager

eel.init("web")
# eel.browsers.set_path('electron', 'node_modules/electron/dist/electron) # WINDOWS PATH
eel.browsers.set_path('electron', 'node_modules/electron/dist/Electron.app/Contents/MacOS/Electron') # MACOS PATH

def force_exit():
    """Force kill the Python process"""
    print("Force killing Python process...")
    try:
        # Clean up listeners first
        listener_manager.listener_manager.stop_all()
    except:
        pass  # Ignore errors during cleanup

    # Force kill the process
    os._exit(0)  # This immediately terminates the process

# Handle signal termination (Ctrl+C, Command+Q)
def signal_handler(signum, frame):
    print(f"Received signal {signum}, force exiting...")
    force_exit()

signal.signal(signal.SIGINT, signal_handler)   # Ctrl+C
signal.signal(signal.SIGTERM, signal_handler)  # Termination signal

# Force exit when eel connection closes (app closes)
def on_app_close(page, sockets):
    print("Eel connection closed, force exiting Python...")
    force_exit()

# Optional: Add a manual exit function that can be called from JavaScript
@eel.expose
def force_quit():
    force_exit()

try:
    eel.start(mode="electron", close_callback=on_app_close)
except KeyboardInterrupt:
    print("Keyboard interrupt received")
    force_exit()
except Exception as e:
    print(f"Error starting eel: {e}")
    force_exit()
