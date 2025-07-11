from pynput import keyboard
from pynput.keyboard import Key
import time


def on_press(key):
    if key == Key.f10:
        time.sleep(5)
        print("start text")

# def on_release(key):
#     print('TEXT {0} released'.format(key))
#     if key == keyboard.Key.esc:
#         # Stop listener
#         return False
