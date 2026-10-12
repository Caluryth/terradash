
# Terradash

A static dashboard for tracking a Terra coding journey using GitHub project metadata.

## Features

- GitHub profile display
- Automatic discovery of repositories containing `terra.json`
- Terra prep and challenge week tracking
- Project status and completion counts
- Total hours calculated from project metadata
- Current-week project and goal display
- Project notes
- Browser-local settings

## Getting started

1. Open the dashboard.
2. Select **Settings**.
3. Enter your GitHub username and Terra schedule.
4. Save your settings.
5. Return to the dashboard.

Terradash uses public GitHub repository data. Projects must have a
`terra.json` file in the root of the repository to appear.

## Project metadata

Create a `terra.json` file in the root of each Terra project repository.

Example:

```json
{
  "version": 1,
  "name": "Example Project",
  "description": "A short project description.",
  "phase": "prep",
  "weeks": [1],
  "type": "project",
  "status": "in-progress",
  "hours": 5.5,
  "goals": ["Finish the core features"],
  "notes": ["Completed the first milestone"]
}
```

### Fields

- `version`: metadata format version
- `name`: project name
- `description`: short description
- `phase`: `prep` or `main`
- `weeks`: one or more positive week numbers
- `type`: `project` or `update`
- `status`: `planned`, `in-progress`, `completed`, or `unfinished`
- `hours`: total hours spent on the project; optional, defaults to zero
- `goals`: array of goal strings
- `notes`: array of note strings

Hours represent the total time spent on a project, not the hours
per assigned week. Each project should have its own repository and
metadata file to avoid counting the same hours more than once.

## Settings and privacy

Settings are saved in the current browser using `localStorage`.
They are not synced across devices or browsers.

The dashboard fetches public data from GitHub directly from the browser.
GitHub API rate limits may affect users with many repositories or
frequent refreshes.

## Run locally

Use a local development server, such as the VS Code Live Server
extension, and open `index.html`.

## Deploy with GitHub Pages

1. Push the project to a GitHub repository.
2. Open the repository's **Settings**.
3. Open **Pages**.
4. Choose deployment from a branch.
5. Select your deployment branch and the root folder.
6. Save and wait for GitHub Pages to publish the site.
7. Open the published URL and test both the dashboard and Settings page.

Terradash is a static site and does not require a backend.
