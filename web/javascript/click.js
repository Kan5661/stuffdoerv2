let addClickBtn = document.getElementById("addClick")
let addingClickBtn = document.getElementById("addingClick")
let startClickBtn = document.getElementById("clickStartBtn")
let stopClickBtn = document.getElementById("clickStopBtn")
startClickBtn.addEventListener("click", onStartBtn)
stopClickBtn.addEventListener("click", onStopBtn)
addClickBtn.addEventListener("click", onAddClickBtnPress)
addingClickBtn.addEventListener("click", onAddingClickBtnPress)

document.getElementById("clicksList").addEventListener("click", function(e) {
    if (e.target.classList.contains("remove-btn")) {
        e.target.parentElement.remove();
    }
});


function onStartBtn() {
    eel.start_click()()
}

function onStopBtn() {
    eel.stop_click()()
}

function onAddClickBtnPress() {
    eel.activateClickListener()()
    addClickBtn.classList.add("hideElement")
    addingClickBtn.classList.remove("hideElement")
}

eel.expose(addToClickList)
function addToClickList(click) {
    function round(value, precision) {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }
    console.log(click)
    if (click) {
        onAddingClickBtnPress()

        let clicksList = document.getElementById("clicksList")
        const newClick = document.createElement("div");
        newClick.classList.add("click");
        newClick.innerHTML = `
        <span class="clickType">${click.click}</span>
        <span class="clickPosition">[
            <div class="xpos">${round(click.position.x, 1)}, </div><div class="ypos">${round(click.position.y, 1)}</div>
        ]</span>
        <button class="remove-btn">x</button>
        `;
        clicksList.appendChild(newClick);
    }
}

export function onAddingClickBtnPress() {
    eel.deactivateClickListener()()
    addClickBtn.classList.remove("hideElement")
    addingClickBtn.classList.add("hideElement")
}

eel.expose(get_click_config)
function get_click_config() {
    const repeatMode = document.querySelector('input[name="clickRepeatMode"]:checked').id;
    const interval = parseInt(document.getElementById("clickInterval").value);
    const offset = parseInt(document.getElementById("clickOffset").value);
    const repeatTimes = parseInt(document.getElementById("cRepeatTimes").value);

    // Get all click positions
    const clicksListElements = document.querySelectorAll("#clicksList .click");
    let clicksList = [];

    clicksListElements.forEach((el) => {
        const type = el.querySelector(".clickType").innerText;
        const x = parseFloat(el.querySelector(".xpos").innerText);
        const y = parseFloat(el.querySelector(".ypos").innerText);

        clicksList.push({
            type: type,
            position: {
                x: x,
                y: y
            }
        });
    });

    const config = {
        repeatMode,
        interval,
        offset,
        repeatTimes,
        clicksList
    }
    console.log(config)
    return config
}

eel.expose(update_click_btn)
function update_click_btn(status) {
    if (status === "clicking") {
        startClickBtn.classList.add("hideElement")
        stopClickBtn.classList.remove("hideElement")
    } else {
        startClickBtn.classList.remove("hideElement")
        stopClickBtn.classList.add("hideElement")
    }
}

async function loadClickConfig() {
    // fetch from config.json and load it into the page
}

export function initializeClick() {

}
