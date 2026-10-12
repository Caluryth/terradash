function renderProjects(projects) {
    const container = document.querySelector("#projects-container");
    const status = document.querySelector("#project-list-status");

    container.replaceChildren();

    if (projects.length === 0) {
        status.textContent = "No Terra projects found.";
        return;
    }

    status.textContent = `Found ${projects.length} Terra project(s).`;

    projects.forEach(project => {
        const card = document.createElement("article");
        card.classList.add("project-card");

        const title = document.createElement("h3");
        title.textContent = project.name;

        const description = document.createElement("p");
        description.textContent =
            project.description || "No description provided.";

        const details = document.createElement("p");
        const weeks = project.weeks.length
            ? project.weeks.map(week =>
                `${project.phase === "prep" ? "Prep " : ""}Week ${week}`
            ).join(", ")
            : "No weeks assigned.";

        details.textContent = `${weeks} · ${project.status}`;

        const link = document.createElement("a");
        link.href = project.repositoryUrl;
        link.textContent = "View Repository";
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        card.append(title, description, details, link);
        container.appendChild(card);  
    });
}

function renderOverview(projects) {
    const stats = getProjectStats(projects);
    const progress = getScheduleProgress(terraConfig);

    document.querySelector("#total-hours").textContent =
        `${Number(stats.totalHours.toFixed(2))} hours`;

    document.querySelector("#project-count").textContent =
        `${stats.completed} / ${stats.total} completed`;

    document.querySelector("#current-week").textContent =
        terraConfig.currentPhase === "prep"
            ? `Prep ${terraConfig.currentWeek}`
            : `Week ${terraConfig.currentWeek}`;

    document.querySelector("#progress-label").textContent =
        `${progress.percentage}% · ${progress.elapsedWeeks} of ${progress.totalWeeks} weeks elapsed.`;
    
    document.querySelector("#progress-bar").style.width =
        `${progress.percentage}%`;
}

function renderGitHubProfile(profile) {
    const avatar = document.querySelector("#profile-avatar");
    const name = document.querySelector("#profile-name");
    const bio = document.querySelector("#profile-bio");
    const link = document.querySelector("#profile-link");

    avatar.src = profile.avatar_url;
    avatar.alt = `${profile.login}'s Github profile picture`;

    name.textContent = profile.name || profile.login;
    bio.textContent = profile.bio || "No bio provided.";

    link.href = profile.html_url;
}

function renderCurrentWeek(projects) {
    const label = document.querySelector("#current-week-label");
    const container = document.querySelector("#current-week-project");

    const phase = terraConfig.currentPhase;
    const week = terraConfig.currentWeek;

    const weekName = phase === "prep"
        ? `Prep Week ${week}`
        : `Week ${week}`;

    label.textContent = `${weekName} projects`;

    const currentProjects = getProjectsForWeek(
        projects,
        phase,
        week
    );

    container.replaceChildren();

    if (currentProjects.length === 0) {
        container.textContent = "No projects assigned to this week.";
        return;
    }

    currentProjects.forEach(project => {
        const card = document.createElement("article");
        card.classList.add("project-card");

        const title = document.createElement("h3");
        title.textContent = project.name;

        const description = document.createElement("p");
        description.textContent =
            project.description || "No description provided.";

        const status = document.createElement("p");
        status.textContent = `Status: ${project.status}`;

        const link = document.createElement("a");
        link.href = project.repositoryUrl;
        link.textContent = "View Repository";
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(status);
        card.appendChild(link);

        container.appendChild(card);
    });
}

async function initializeDashboard() {
    const status = document.querySelector("#project-list-status");

    try {
        status.textContent = "Loading Terra projects...";

        const [projects, profile] = await Promise.all([
            discoverTerraProjects(terraConfig.githubUsername),
            fetchGitHubProfile(terraConfig.githubUsername)
        ]);

        renderProjects(projects);
        renderOverview(projects);
        renderCurrentWeek(projects);
        renderGitHubProfile(profile);

        console.log("Loaded Terra projects:", projects);
    } catch (error) {
        console.error("Dashboard initialization failed:", error);

        status.textContent = "Could not load dashboard data. Check the console for details.";
    }
} 

initializeDashboard();
