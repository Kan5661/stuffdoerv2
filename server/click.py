from pynput import keyboard
import time


def on_press(key):
    try:
        print('CLICK alphanumeric key {0} pressed'.format(
            key.char))
    except AttributeError:
        print('CLICK special key {0} pressed'.format(
            key))

def on_release(key):
    print('CLICK {0} released'.format(
        key))
    if key == keyboard.Key.esc:
        # Stop listener
        return False
