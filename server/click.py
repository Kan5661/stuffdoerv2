from pynput import keyboard, mouse
from pynput.keyboard import Key
import time, queue, threading, eel, random
from server.config import update_click_config

click_repeat = False
click_queue = queue.Queue()
click_recording = False  # New flag to control when clicks are recorded

def _click_worker():
    while True:
        try:
            # Add timeout to prevent blocking indefinitely
            data = click_queue.get(timeout=1.0)
            eel.addToClickList(data)
        except queue.Empty:
            continue  # Continue loop if no data

threading.Thread(target=_click_worker, daemon=True).start()

def on_press(key):
    """This function is called by the persistent listener in listener.py"""
    global click_repeat
    if key == Key.f10:
        start_click()
    elif key == Key.esc:
        stop_click()

def on_click(x, y, button, pressed):
    global click_recording
    if pressed and click_recording:  # Only record when flag is True
        click_queue.put({
            "click": button.name,
            "position": {
                "x": x,
                "y": y
            }
        })

# Start persistent mouse listener once at module level
click_listener = mouse.Listener(on_click=on_click)
click_listener.start()
print("Persistent mouse listener started")

@eel.expose
def activateClickListener():
    global click_recording
    click_recording = True
    print("Click recording activated")

@eel.expose
def deactivateClickListener():
    global click_recording
    click_recording = False
    print("Click recording deactivated")

# Optional: Function to properly cleanup on app shutdown
def cleanup_listener():
    global click_listener
    if click_listener and click_listener.running:
        click_listener.stop()
        print("Mouse listener stopped")

@eel.expose
def start_click():
    config = eel.get_click_config()()
    print("click configs: ", config)
    update_click_config(config)
    eel.update_click_btn("clicking")()

    global click_repeat
    click_repeat = True

    interval = config["interval"] / 1000
    offset = config["offset"] / 1000

    def click_loop():
        global click_repeat

        mouse_controller = mouse.Controller()
        count = 0

        # Setup offset and interval from config
        interval = config["interval"] / 1000
        offset = config["offset"] / 1000

        # Determine number of iterations
        if config["repeatMode"] == "clickRepeatTimes":
            max_iterations = config["repeatTimes"]
        elif config["repeatMode"] == "clickRepeatInfinite":
            max_iterations = None
        else:
            print("Unknown repeat mode")
            return

        while click_repeat and (max_iterations is None or count < max_iterations):
            for click in config["clicksList"]:
                if not click_repeat:
                    print("Stopped early.")
                    break

                # Convert type string to mouse.Button
                button_type = {
                    "left": mouse.Button.left,
                    "right": mouse.Button.right,
                    "middle": mouse.Button.middle,
                }.get(click["type"], mouse.Button.left)

                # Move and click
                mouse_controller.position = (click["position"]["x"], click["position"]["y"])
                mouse_controller.click(button_type)

                # Calculate random offset and sleep
                random_offset = random.uniform(-offset, offset)
                final_interval = max(interval + random_offset, 0)
                time.sleep(final_interval)

            count += 1

        print("Exited click loop.")
        eel.update_click_btn("idle")()

    click_thread = threading.Thread(target=click_loop)
    click_thread.start()

@eel.expose
def stop_click():
    print("Stop clicking requested from frontend")
    global click_repeat
    click_repeat = False
    eel.update_click_btn("idle")()