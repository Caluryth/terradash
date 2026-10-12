
const SETTINGS_KEY = "terradash-settings";

const defaultConfig = {
    githubUsername: "github",
    prepWeeks: 4,
    challengeWeeks: 12,
    currentPhase: "prep",
    currentWeek: 1
};

function getTerraConfig() {
    let savedSettings = {};

    try {
        savedSettings = JSON.parse(
            localStorage.getItem(SETTINGS_KEY) || "{}"
        );
    } catch (error) {
        console.warn("Could not load saved settings:", error);
    }

    if (
        !savedSettings ||
        typeof savedSettings !== "object" ||
        Array.isArray(savedSettings)
    ) {
        savedSettings = {};
    }

    const config = {
        ...defaultConfig,
        ...savedSettings
    };

    const validPhase = ["prep", "main"].includes(config.currentPhase);

    const validNumbers =
        Number.isInteger(config.prepWeeks) &&
        config.prepWeeks >= 0 &&
        Number.isInteger(config.challengeWeeks) &&
        config.challengeWeeks >= 1 &&
        Number.isInteger(config.currentWeek) &&
        config.currentWeek >= 1;

    const maxWeek = config.currentPhase === "prep"
        ? config.prepWeeks
        : config.challengeWeeks;

    if (
        typeof config.githubUsername !== "string" ||
        !config.githubUsername.trim() ||
        !validPhase ||
        !validNumbers ||
        config.currentWeek > maxWeek
    ) {
        console.warn("Invalid saved settings. Using defaults.");
        return { ...defaultConfig };
    }

    config.githubUsername = config.githubUsername.trim();

    return config;
}

const terraConfig = getTerraConfig();