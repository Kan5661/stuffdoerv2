// Get theme buttons once
const light = document.querySelector(".lightSelect");
const dark = document.querySelector(".darkSelect");
const system = document.querySelector(".systemSelect");
const themeButtons = { light, dark, system };

// get accent buttons
const none = document.querySelector(".noneSelect")
const lavender = document.querySelector(".lavSelect")
const blue = document.querySelector(".blueSelect")
const green = document.querySelector(".greenSelect")
const orange = document.querySelector(".orangeSelect")
const accentButtons = { none, lavender, blue, green, orange}

async function useConfigSettings() {
    const config = await eel.read_config()();

    // Clear previous selection
    document.querySelector(".themeSelected")?.classList.remove("themeSelected");
    document.querySelector(".accentSelected")?.classList.remove("accentSelected");

    // Add new selection
    if (themeButtons[config.theme]) {
        themeButtons[config.theme].classList.add("themeSelected");
    }

    // add accent selected for accent
    if (accentButtons[config.accent]) {
        accentButtons[config.accent].classList.add("accentSelected");
    }
    // Update body theme class
    updateBodyTheme(config.theme);

    // update root accent variables
    updateAccentVariables(config.accent)
}

function updateBodyTheme(theme) {
    let useDark = false;
    if (theme === "dark") {
        useDark = true;
    } else if (theme === "system") {
        useDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    document.body.classList.toggle("darkTheme", useDark);
}

const updateTheme = async (theme) => {
    await eel.update_theme(theme)();
    await useConfigSettings();
    const config = await eel.read_config()();
    console.log(config);
};

const updateAccent = async (accent) => {
    await eel.update_accent(accent)();
    await useConfigSettings();
    const config = await eel.read_config()();
    console.log(config);
};

light.addEventListener("click", () => updateTheme("light"));
dark.addEventListener("click", () => updateTheme("dark"));
system.addEventListener("click", () => updateTheme("system"));

none.addEventListener("click", () => updateAccent("none"));
lavender.addEventListener("click", () => updateAccent("lavender"));
blue.addEventListener("click", () => updateAccent("blue"));
green.addEventListener("click", () => updateAccent("green"));
orange.addEventListener("click", () => updateAccent("orange"));
