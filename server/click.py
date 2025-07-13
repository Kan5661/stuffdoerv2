from pynput import keyboard, mouse
import time
import eel


def on_press(key):
    try:
        print('CLICK alphanumeric key {0} pressed'.format(
            key.char))
    except AttributeError:
        print('CLICK special key {0} pressed'.format(
            key))


def on_click(x, y, button, pressed):
    print('{0} at {1}'.format(
        'Pressed' if pressed else 'Released',
        (x, y)))

click_listener = mouse.Listener(on_click=on_click)

@eel.expose
def activateClickListener():
    global click_listener
    if click_listener is None or not click_listener.running:
        click_listener = mouse.Listener(on_click=on_click)
        click_listener.start()
        print("Mouse listener started")

@eel.expose
def deactivateClickListener():
    global click_listener
    if click_listener and click_listener.running:
        click_listener.stop()
        click_listener = None
        print("Mouse listener stopped")

@eel.expose
def stopClicking(): {

}
