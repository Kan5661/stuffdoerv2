import eel
from pynput import keyboard
import server.text as text
import server.click as click
import server.script as script

class ListenerManager:
    def __init__(self):
        self.keyboard_listener = None
        self.current_mode = None
        
    def unified_on_press(self, key):
        """Single handler that routes to appropriate module based on current mode"""
        if self.current_mode == 'text':
            text.on_press(key)
        elif self.current_mode == 'click':
            click.on_press(key)
        elif self.current_mode == 'script':
            script.on_press(key)
        # If no mode is set, do nothing

    def start_persistent_listener(self):
        """Start one listener that stays running"""
        if self.keyboard_listener is None:
            self.keyboard_listener = keyboard.Listener(
                on_press=self.unified_on_press
            )
            self.keyboard_listener.start()
            print("Persistent keyboard listener started")

    def switch_mode(self, mode):
        """Switch mode without touching the listener"""
        valid_modes = ['text', 'click', 'script', 'home', 'settings']
        
        if mode in valid_modes:
            self.current_mode = mode if mode in ['text', 'click', 'script'] else None
            print(f"Switched to {mode} mode")
        else:
            self.current_mode = None
            print("Unknown mode, disabling listener")

    def stop_all(self):
        """Stop the persistent listener completely"""
        if self.keyboard_listener and self.keyboard_listener.running:
            self.keyboard_listener.stop()
            self.keyboard_listener = None
            self.current_mode = None
            print("Keyboard listener stopped")

# Global instance
listener_manager = ListenerManager()

# Start the persistent listener when module loads
listener_manager.start_persistent_listener()

# Expose to JavaScript
@eel.expose
def set_mode(mode):
    print("set mode: ", mode)
    listener_manager.switch_mode(mode)

@eel.expose
def get_current_mode():
    return listener_manager.current_mode

@eel.expose
def stop_keyboard_listener():
    listener_manager.stop_all()

@eel.expose
def restart_keyboard_listener():
    """In case you need to restart the listener"""
    listener_manager.stop_all()
    listener_manager.start_persistent_listener()