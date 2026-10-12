const SETTINGS_KEY = "terradash-settings";

const settingsForm = document.querySelector("#settings-form");
const settingsStatus = document.querySelector("#settings-status");

const defaultSettings = {
    githubUsername: "github",
    prepWeeks: 4,
    challengeWeeks: 12,
    currentPhase: "prep",
    currentWeek: 1
};

function readSavedSettings() {
    try {
        const saved = localStorage.getItem(SETTINGS_KEY);
        return saved ? JSON.parse(saved) : {};
    } catch (error) {
        console.warn("Could not read saved settings:", error);
        return {};
    }
}

function loadSettings() {
    const settings = {
        ...defaultSettings,
        ...readSavedSettings()
    };

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

    settings.githubUsername = settings.githubUsername.trim();
    settings.prepWeeks = Number(settings.prepWeeks);
    settings.challengeWeeks = Number(settings.challengeWeeks);
    settings.currentWeek = Number(settings.currentWeek);

    const maxWeek = settings.currentPhase === "prep"
        ? settings.prepWeeks
        : settings.challengeWeeks;

    if (!settings.githubUsername) {
        settingsStatus.textContent = "Enter a GitHub username.";
        return;
    }

    if (
        !Number.isInteger(settings.prepWeeks) ||
        settings.prepWeeks < 0 ||
        !Number.isInteger(settings.challengeWeeks) ||
        settings.challengeWeeks < 1 ||
        !Number.isInteger(settings.currentWeek) ||
        settings.currentWeek < 1
    ) {
        settingsStatus.textContent =
            "Enter valid whole numbers for the schedule.";
        return;
    }

    if (settings.currentWeek > maxWeek) {
        settingsStatus.textContent =
            "The current week exceeds the number of weeks in this phase.";
        return;
    }

    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        settingsStatus.textContent =
            "Settings saved. Return to the dashboard to see your changes.";
    } catch (error) {
        console.error("Could not save settings:", error);
        settingsStatus.textContent =
            "Settings could not be saved in this browser.";
    }
});

loadSettings();