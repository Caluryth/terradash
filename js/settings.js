const SETTINGS_KEY = "terradash-settings";

const settingsForm = document.querySelector("#settings-form");
const settingsStatus = document.querySelector("#settings-status");

function loadSettings() {
    const savedSettings = localStorage.getItem(SETTINGS_KEY);

    if (!savedSettings) {
        return;
    }

    const settings = JSON.parse(savedSettings);

    for (const [key, value] of Object.entries(settings)) {
        const input = settingsForm.elements.namedItem(key);

        if (input) {
            input.value = value;
        }
    }
}

settingsForm.addEventListener("submit", event => {
    event.preventDefault();

    const formData = new FormData(settingsForm);
    const settings = Object.fromEntries(formData.entries());

    settings.prepWeeks = Number(settings.prepWeeks);
    settings.challengeWeeks = Number(settings.challengeWeeks);
    settings.currentWeek = Number(settings.currentWeek);

    const maxWeek = settings.currentPhase === "prep"
        ? settings.prepWeeks
        : settings.challengeWeeks;

    if (settings.currentWeek > maxWeek) {
        settingsStatus.textContent = 
            "The current week exceeds the number of weeks in this phase.";
        return;
    }

    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));

    settingsStatus.textContent = "Settings saved successfully.";
});

loadSettings();