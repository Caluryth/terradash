const projects = terraData.projects;
const currentProject = terraData.projects[terraData.currentWeek + 2];

/* ---- Statistics ---- */

const totalHours = projects.reduce(
    (total, project) => total + project.hours,
    0
);

const completedProjects = projects.filter(
    project => project.status === "complete"
).length;

const totalWeeks = 12;

const progressPercent = Math.round(
    (terraData.currentWeek / totalWeeks) * 100
);

/* ---- Progress ---- */

document.querySelector("#progress p").textContent = `Week ${terraData.currentWeek} of ${projects.length - 1}`;

document.querySelector("#progress span").textContent = `${progressPercent}%`;

document.querySelector("#progress span").style.width = `${progressPercent}%`;

/* ---- Overview ---- */

document.querySelector("#total-hours").textContent = `${totalHours} hours`;

document.querySelector("#project-count").textContent = `${completedProjects} / ${projects.length} complete`;

document.querySelector("#current-week").textContent = `Week ${terraData.currentWeek}`;

/* ---- Current Project ---- */

document.querySelector("#current-project h3").textContent = currentProject.name;

document.querySelector("#current-project > p").textContent = currentProject.description;

document.querySelector("#current-project p:nth-of-type(2)").textContent = `${currentProject.hours} hours spent`;

document.querySelector("#current-project p:nth-of-type(3)").textContent = `Status: ${currentProject.status}`;

/* ---- Goals ---- */

const goalsList = document.querySelector("#goals ul");

goalsList.innerHTML = "";

currentProject.goals.forEach(goal => {
    const listItem = document.createElement("li");
    listItem.textContent = goal;
    goalsList.appendChild(listItem);
});

/* ---- Project List ---- */

function renderProjects(projects) {
    const container = document.querySelector("#projects-container");
    const status = document.querySelector("#projects-list-status");

    container.innerHTML = "";

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
        description.textContent = project.description;

        const details = document.createElement("p");
        const weeks = project.weeks.length
            ? project.weeks.map(week =>
                `${project.phase === "prep" ? "Prep " : ""}Week ${week}`
            ).join(", ")
            : "No weeks assigned";

        details.textContent = `${weeks} · ${project.status}`;

        const link = document.createElement("a");
        link.href = project.repositoryUrl;
        link.textContent = "View repository";
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        card.append(title, description, details, link);
        container.appendChild(card);
    })
}

/* ---- Notes ---- */

const notesElement = document.querySelector("#notes-content");

notesElement.textContent = currentProject.notes || "No notes yet.";


/* ---- Data Aggregation ---- */

discoverTerraProjects("caluryth").then(projects => {
    console.log("All discovered Terra projects:", projects);
    renderProjects(projects);
})
.catch(error => {
    console.warn("Discovery failed:", error.message);

    document.querySelector("#projects-list-status").textContent = "Could not load Terra projects. Check the console for details.";
});