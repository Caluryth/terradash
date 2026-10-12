function validateProject(project) {
    const validPhases = ["prep", "main"];
    const validTypes = ["project", "update"];
    const validStatuses = ["in-progress", "completed", "planned", "unfinished"];

    if (typeof project.name !== "string" || !project.name.trim()) {
        throw new Error("Project must have a name.");
    }

    if (!validPhases.includes(project.phase)) {
        throw new Error("Invalid project phase.");
    }

    if (!validTypes.includes(project.type)) {
        throw new Error("Invalid project type.");
    }

    if (!validStatuses.includes(project.status)) {
        throw new Error("Invalid project status.");
    }

    if (
        !Array.isArray(project.weeks) ||
        !project.weeks.every(
            week => Number.isInteger(week) && week >= 1
        )
    ) {
        throw new Error("Weeks must be an array of positive integers.");
    }

    if (new Set(project.weeks).size !== project.weeks.length) {
        throw new Error("Weeks cannot contain duplicates.");
    }

    if (!Array.isArray(project.goals) || !Array.isArray(project.notes)) {
        throw new Error("Goals and notes must be arrays.");
    }

    if (project.hours !== undefined && (
        typeof project.hours !== "number" ||
        !Number.isFinite(project.hours) ||
        project.hours < 0
    )) {
        throw new Error("Hours must be a non-negative number.");
    }

    return true;
}

async function fetchTerraMetadata(owner, repo) {
    const url =
        `https://api.github.com/repos/${encodeURIComponent(owner)}/` +
        `${encodeURIComponent(repo)}/contents/terra.json`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `Github API error: ${response.status} ${response.statusText}`
        );
    }

    const file = await response.json();

    if (file.type !== "file" || !file.content) {
        throw new Error("Could not find terra.json in this repository.");
    }

    const binary = atob(file.content.replace(/\s/g, ""));

    const bytes = Uint8Array.from(
        binary,
        character => character.charCodeAt(0)
    );

    const jsonText = new TextDecoder().decode(bytes);
    const project = JSON.parse(jsonText);

    validateProject(project);

    return project;
}

async function discoverTerraProjects(owner) {
    const repositories = [];
    let page = 1;

    while (true) {
        const url = `https://api.github.com/users/${owner}/repos` +
        `?type=owner&sort=updated&per_page=100&page=${page}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(
                `Could not fetch repositories: ${response.status} ${response.statusText}`
            );
        }

        const batch = await response.json();

        repositories.push(...batch);

        if (batch.length < 100) {
            break;
        }

        page++;
    }

    const terraProjects = [];

    for (const repository of repositories) {
        try {
            const project = await fetchTerraMetadata(
                owner,
                repository.name
            );

            terraProjects.push({
                ...project,
                repositoryName: repository.name,
                repositoryUrl: repository.html_url
            });

            console.log(`Found Terra project: ${project.name}`);
        } catch (error) {
            if (error.message.includes("404")) {
                continue;
            }

            console.warn(
                `Could not process ${repository.name}:`,
                error.message
            );
        }
    }

    return terraProjects;
}

async function fetchGitHubProfile(username) {
    const url = `https://api.github.com/users/${encodeURIComponent(username)}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `Could not fetch GitHub profile: ${response.status} ${response.statusText}`
        )
    }

    const profile = await response.json();

    return profile;
}

function isProjectInWeek(project, phase, week) {
    return project.phase === phase && project.weeks.includes(week);
}

function getProjectsForWeek(projects, phase, week) {
    return projects.filter(project => 
        isProjectInWeek(project, phase, week)
    );
}

function getProjectStats(projects) {
    return {
        total: projects.length,
        completed: projects.filter(
            project => project.status === "completed"
        ).length,
        inProgress: projects.filter(
            project => project.status === "in-progress"
        ).length,
        planned: projects.filter(
            project => project.status === "planned"
        ).length,
        unfinished: projects.filter(
            project => project.status === "unfinished"
        ).length,
        totalHours: projects.reduce(
            (total, project) => total + (project.hours ?? 0),
            0
        )
    };
}

function getScheduleProgress(config) {
    const totalWeeks = config.prepWeeks + config.challengeWeeks;

    const elapsedWeeks = config.currentPhase === "prep"
        ? config.currentWeek - 1
        : config.prepWeeks + config.currentWeek - 1;

    return {
        totalWeeks,
        elapsedWeeks,
        percentage: totalWeeks > 0
            ? Math.round((elapsedWeeks / totalWeeks) * 100)
            : 0
    };
}