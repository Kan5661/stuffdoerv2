const startBtn = document.getElementById("startBtn")
const stopBtn = document.getElementById("stopBtn")
startBtn.addEventListener("click", on_start_btn)
stopBtn.addEventListener("click", on_start_btn)
document.getElementById("enterEveryLoop").addEventListener("change", function () {
    document.getElementById("onTextKeySelect").disabled = !this.checked;
});

async function loadTextConfig() {
    const config = await eel.read_config()();
    const textConfig = config.textConfig;

    if (textConfig.repeatMode === "repeatTimes") {
        document.getElementById("repeatTimes").checked = true;
    } else if (textConfig.repeatMode === "repeatInfinite") {
        document.getElementById("repeatInfinite").checked = true;
    }

    document.getElementById("text").value = textConfig.text;
    document.getElementById("textInterval").value = textConfig.interval;
    document.getElementById("textOffset").value = textConfig.offset;
    document.getElementById("textRepeatTimes").value = textConfig.repeatTimes;
    document.getElementById("strokeDelay").value = textConfig.strokeDelay;

    const onTextKeyCheckbox = document.getElementById("enterEveryLoop");
    const onTextKeySelect = document.getElementById("onTextKeySelect");

    if (textConfig.onTextKey === false) {
        onTextKeyCheckbox.checked = false;
    } else {
        onTextKeyCheckbox.checked = true;
        onTextKeySelect.value = textConfig.onTextKey;
    }

    // Optionally disable select if checkbox unchecked
    onTextKeySelect.disabled = !onTextKeyCheckbox.checked;
}


eel.expose(get_text_config);
function get_text_config() {
    const text = document.getElementById("text").value;
    if (text == "") {
        console.log("empty text field");
        return false;
    }

    const repeatMode = document.querySelector('input[name="repeatMode"]:checked').id;
    const interval = parseInt(document.getElementById("textInterval").value);
    const offset = parseInt(document.getElementById("textOffset").value);
    const repeatTimes = parseInt(document.getElementById("textRepeatTimes").value);
    const strokeDelay = parseInt(document.getElementById("strokeDelay").value);
    const onTextKeyCheckbox = document.getElementById("enterEveryLoop");
    const onTextKeySelect = document.getElementById("onTextKeySelect");
    let onTextKey = "enter";

    if (onTextKeyCheckbox.checked) {
        onTextKey = onTextKeySelect.value;
    } else {
        onTextKey = false;
    }

    const textConfig = {
        repeatMode,
        text,
        interval,
        offset,
        repeatTimes,
        strokeDelay,
        onTextKey
    };

    console.log(textConfig);
    return textConfig;
}

function on_start_btn() {
    eel.start_text()()
}

function on_stop_btn() {
    eel.stop_text()()
}

eel.expose(update_text_btn)
function update_text_btn(state) {
    let startBtn = document.getElementById("startBtn")
    let stopBtn = document.getElementById("stopBtn")

    console.log("updating text button: ", state)

    if (state == "texting") {
        startBtn.classList.add("hideElement")
        stopBtn.classList.remove("hideElement")
    }
    else if (state == "idle") {
        startBtn.classList.remove("hideElement")
        stopBtn.classList.add("hideElement")
    }
}

loadTextConfig();
