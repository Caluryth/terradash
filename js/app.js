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

        const hours = document.createElement("p");
        hours.textContent = `${project.hours ?? 0} hours logged`;
        
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

        card.append(title, description, hours, details, link);
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

        const hours = document.createElement("p");
        hours.textContent = `${project.hours ?? 0} hours logged`;

        const status = document.createElement("p");
        status.textContent = `Status: ${project.status}`;

        const link = document.createElement("a");
        link.href = project.repositoryUrl;
        link.textContent = "View Repository";
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(hours);
        card.appendChild(status);
        card.appendChild(link);

        container.appendChild(card);
    });
}


function renderGoalsAndNotes(projects) {
    const goalsList = document.querySelector("#goals-list");
    const notesContainer = document.querySelector("#notes-content");

    const currentProjects = getProjectsForWeek(
        projects,
        terraConfig.currentPhase,
        terraConfig.currentWeek
    );

    goalsList.replaceChildren();
    notesContainer.replaceChildren();

    const goals = currentProjects.flatMap(project =>
        (project.goals || []).map(goal => ({
            projectName: project.name,
            text: goal
        }))
    );

    if (goals.length === 0) {
        const item = document.createElement("li");
        item.textContent = "No goals listed for this week.";
        goalsList.appendChild(item);
    } else {
        goals.forEach(goal => {
            const item = document.createElement("li");
            item.textContent = `${goal.projectName}: ${goal.text}`;
            goalsList.appendChild(item);
        });
    }

    const notes = projects.flatMap(project =>
        (project.notes || []).map(note => ({
            projectName: project.name,
            text: typeof note === "string"
                ? note
                : JSON.stringify(note)
        }))
    );

    if (notes.length === 0) {
        notesContainer.textContent = "No project notes yet.";
        return;
    }

    const list = document.createElement("ul");

    notes.forEach(note => {
        const item = document.createElement("li");
        item.textContent = `${note.projectName}: ${note.text}`;
        list.appendChild(item);
    });

    notesContainer.appendChild(list);
}

async function initializeDashboard() {
    const status = document.querySelector("#project-list-status");
    let projects = [];

    try {
        status.textContent = "Loading Terra projects...";
        projects = await discoverTerraProjects(terraConfig.githubUsername);

        renderProjects(projects);
        renderOverview(projects);
        renderCurrentWeek(projects);
        renderGoalsAndNotes(projects);
    } catch (error) {
        console.error("Could not load Terra projects:", error);
        status.textContent =
            "Could not load projects. Check the GitHub username, network connection, or API rate limit.";
    }

    try {
        const profile = await fetchGitHubProfile(
            terraConfig.githubUsername
        );
        renderGitHubProfile(profile);
    } catch (error) {
        console.error("Could not load GitHub profile:", error);

        document.querySelector("#profile-name").textContent =
            "GitHub profile unavailable";
        document.querySelector("#profile-bio").textContent =
            "Check the configured username or try again later.";
        document.querySelector("#profile-link").hidden = true;
        document.querySelector("#profile-avatar").hidden = true;
    }
}

initializeDashboard();
