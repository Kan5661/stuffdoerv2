import eel
import json

@eel.expose
def read_config():
    with open("config.json", "r") as file:
        data = json.load(file)
    return data

@eel.expose
def update_theme(theme: str):
    print('update theme py function called: ', theme)
    with open("config.json", "r") as file:
        config = json.load(file)
    config["theme"] = theme

    with open("config.json", "w") as file:
        json.dump(config, file, indent=4)

@eel.expose
def update_accent(accent):
    config = read_config()
    config['accent'] = accent

    with open("config.json", "w") as file:
        json.dump(config, file, indent=4)

@eel.expose
def update_text_config(text_config):
    with open("config.json", "r") as file:
        config = json.load(file)
    config["textConfig"] = text_config

    with open("config.json", "w") as file:
        json.dump(config, file, indent=4)
