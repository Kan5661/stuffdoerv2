import eel
from pynput import keyboard
import server.text as text
import server.click as click
import server.script as script

class ListenerManager:
    def __init__(self):
        self.current_listener = None
        self.current_mode = None
        self.listeners = {
            'text': self.create_text_listener,
            'click': self.create_click_listener,
            # 'script': self.create_script_listener
        }

    def create_text_listener(self):
        return keyboard.Listener(
            on_press=text.on_press,
        )

    def create_click_listener(self):
        return keyboard.Listener(
            on_press=click.on_press,
        )

    def create_script_listener(self):
        return keyboard.Listener(
            on_press=script.on_press,
        )

    def switch_listener(self, mode):
        # Stop current listener if active
        if self.current_listener and self.current_listener.running:
            self.current_listener.stop()
            self.current_listener = None

        # Start new listener if mode is valid
        if mode in self.listeners:
            self.current_listener = self.listeners[mode]()
            self.current_listener.start()
            self.current_mode = mode
            print(f"Switched to {mode} mode")
        else:
            self.current_mode = None
            print("No active listener")

    def stop_all(self):
        if self.current_listener and self.current_listener.running:
            self.current_listener.stop()
            self.current_listener = None
            self.current_mode = None

# Global instance
listener_manager = ListenerManager()

# Expose to JavaScript
@eel.expose
def set_mode(mode):
    print("set mode: ", mode)
    listener_manager.switch_listener(mode)

@eel.expose
def get_current_mode():
    return listener_manager.current_mode

@eel.expose
def stop_keyboard_listener():
    listener_manager.stop_all()
