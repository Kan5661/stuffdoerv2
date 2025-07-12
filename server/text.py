from pynput import keyboard
from pynput.keyboard import Key
import eel
import time
import random
from server.config import update_text_config

keyboard_controller = keyboard.Controller()
text_repeat = False

def on_press(key):
    global text_repeat
    if key == Key.f10:
        start_text()
    elif key == Key.esc:
        stop_text()



@eel.expose
def start_text():
    global text_repeat

    print("start text")
    config = eel.get_text_config()()
    update_text_config(config)
    eel.update_text_btn("texting")()

    text_repeat = True
    interval = config["interval"] / 1000
    offset = config["offset"] / 1000
    stroke_delay = config["strokeDelay"] / 1000  # Convert ms to seconds
    step = 0.05

    on_text_key = config.get("onTextKey", "enter")  # Default to "enter"

    def type_text_slow(text, delay=0):
        for char in text:
            keyboard_controller.press(char)
            keyboard_controller.release(char)
            time.sleep(delay)

    def press_after_key():
        if on_text_key is not False:
            key_to_press = {
                "enter": Key.enter,
                "tab": Key.tab,
                "space": Key.space,
                # Add more if needed
            }.get(on_text_key, Key.enter)

            keyboard_controller.press(key_to_press)
            keyboard_controller.release(key_to_press)

    if config["repeatMode"] == "repeatTimes":
        for i in range(config["repeatTimes"]):
            if not text_repeat:
                print("Stopped repeatTimes loop early.")
                break

            random_offset = random.uniform(-offset, offset)
            final_interval = max(interval + random_offset, 0)

            slept = 0
            while slept < final_interval and text_repeat:
                time.sleep(min(step, final_interval - slept))
                slept += step

            if not text_repeat:
                print("Stopped repeatTimes loop early.")
                break

            type_text_slow(config["text"], delay=stroke_delay)
            press_after_key()
        eel.update_text_btn("idle")()

    elif config["repeatMode"] == "repeatInfinite":
        while text_repeat:
            random_offset = random.uniform(-offset, offset)
            final_interval = max(interval + random_offset, 0)

            slept = 0
            while slept < final_interval and text_repeat:
                time.sleep(min(step, final_interval - slept))
                slept += step

            if not text_repeat:
                print("Stopped infinite text.")
                break

            type_text_slow(config["text"], delay=stroke_delay)
            press_after_key()

        print("Exited infinite loop.")

@eel.expose
def stop_text():
    global text_repeat
    text_repeat = False
    eel.update_text_btn("idle")()
