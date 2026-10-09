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

/* ---- Timeline ---- */

const timeline = document.querySelector("#timeline-list");

projects.forEach(project => {
    const listItem = document.createElement("li");
    listItem.textContent = `Week ${project.week} - ${project.name}`;
    timeline.appendChild(listItem);
});

/* ---- Notes ---- */

const notesElement = document.querySelector("#notes-content");

notesElement.textContent = currentProject.notes || "No notes yet.";

/* ---- Test ---- */

discoverTerraProjects("caluryth").then(projects => {
    console.log("All discovered Terra projects:", projects);
    console.log(`Found ${projects.length} Terra project(s).`);
})
.catch(error => {
    console.error("Discovery failed:", error.message);
});