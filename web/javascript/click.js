let addClickBtn = document.getElementById("addClick")
let addingClickBtn = document.getElementById("addingClick")
addClickBtn.addEventListener("click", onAddClickBtnPress)
addingClickBtn.addEventListener("click", onAddingClickBtnPress)


function onAddClickBtnPress() {
    eel.activateClickListener()()
    addClickBtn.classList.add("hideElement")
    addingClickBtn.classList.remove("hideElement")
}

export function onAddingClickBtnPress() {
    eel.deactivateClickListener()()
    addClickBtn.classList.remove("hideElement")
    addingClickBtn.classList.add("hideElement")
}


export function initializeClick() {

}
