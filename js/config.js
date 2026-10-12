const defaultConfig = {
    githubUsername: "Caluryth",

    prepWeeks: 4,
    challengeWeeks: 12,

    currentPhase: "prep",
    currentWeek: 3
};

function getTerraConfig() {
    const savedSettings = localStorage.getItem("terradash-settings");

    if (!savedSettings) {
        return { ...defaultConfig };
    }

    try {
        return {
            ...defaultConfig,
            ...JSON.parse(savedSettings)
        };
    } catch (error) {
        console.error("Could not load saved settings:", error);
        return { ...defaultConfig };
    }
}

const terraConfig = getTerraConfig();