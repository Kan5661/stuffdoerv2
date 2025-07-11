const startBtn = document.getElementById("startBtn")
startBtn.addEventListener("click", start_text)

eel.expose(start_text);
function start_text() {
    const text = document.getElementById("text").value
    if (text = "") {
        console.log("empty text field")
        return false
    }

    const repeatMode = document.querySelector('input[name="repeatMode"]:checked').id;
    const interval = parseInt(document.getElementById("textInterval").value)
    const offset = parseInt(document.getElementById("textOffset").value)
    const repeatTimes = parseInt(document.getElementById("textRepeatTimes").value)

    const textConfig = {
        repeatMode,
        text,
        interval,
        offset,
        repeatTimes
    }
    console.log(textConfig)
    return textConfig
}
