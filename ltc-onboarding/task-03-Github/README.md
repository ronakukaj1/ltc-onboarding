# Task 03 — GitHub & Version Control
## Project structure

```
task-03-github/
└── README.md
```

This task is theory-focused. Practice by creating a repository on GitHub and working through the concepts below.

## Theory
### Introduction to GitHub

**GitHub** is a web-based platform for hosting and collaborating on software projects. It is built on top of **Git**, a distributed version control system that tracks changes to files over time.

Think of GitHub as a combination of:

- **Cloud storage** for your code and project files
- **A change history** so you can see who changed what and when
- **Collaboration tools** for teams to work together without overwriting each other's work

GitHub is widely used in professional development, open source, and personal projects. Even solo developers benefit from version history, backups, and the ability to deploy or share code easily.

### Version control basics

**Version control** (also called source control) is a system that records changes to files so you can recall specific versions later.

Without version control, teams often end up with folders like `project-final`, `project-final-v2`, and `project-final-REALLY-final`. Version control replaces that chaos with a structured history.

Key ideas:

| Concept | Meaning |
|--------|---------|
| **Repository (repo)** | A project folder tracked by Git |
| **Commit** | A saved snapshot of your changes at a point in time |
| **History** | The ordered list of all commits |
| **Remote** | A copy of the repo hosted elsewhere (e.g. on GitHub) |
| **Local** | A copy on your own machine |

Git is **distributed**: every clone is a full copy of the project and its history, not just a thin client connected to a central server.

### Repositories

A **repository** is the home for a project on GitHub. It contains:

- **Files and folders** — source code, docs, images, config
- **Commit history** — every saved change
- **Branches** — parallel lines of development
- **Settings** — visibility (public/private), collaborators, integrations

You can create a repository on GitHub (empty or with a README), or turn an existing local folder into a repo with `git init` and connect it to GitHub.

**Public** repositories are visible to everyone. **Private** repositories are only visible to you and people you invite.

Common repository files:

- `README.md` — project overview and instructions
- `.gitignore` — tells Git which files not to track (e.g. `node_modules/`, `.env`)
- `LICENSE` — how others may use your code

### Commits and version history

A **commit** is a snapshot of your project at a moment in time. Each commit has:

- A **unique ID** (hash) — e.g. `a3f9c2b`
- A **message** — a short description of what changed and why
- **Author and timestamp**
- A **parent commit** — linking it into the history chain

Good commit messages are clear and specific: *"Add expense filter by category"* is better than *"fix stuff"*.

**Version history** is the timeline of commits. You can:

- See what changed between any two points
- Revert to an earlier version if something breaks
- Understand how a feature evolved over time

On GitHub, browse history from the repository page under **Commits** or by clicking a file and viewing its **Blame** / history.

### Branches

A **branch** is an independent line of development. The default branch is usually called `main` (or historically `master`).

Branches let you:

- Build a new feature without disturbing stable code on `main`
- Experiment safely
- Have multiple people work on different things at once

Typical flow:

1. Create a branch: `feature/login-page`
2. Make commits on that branch
3. When the work is ready, merge it back into `main`

Branches are cheap in Git — creating one does not duplicate all your files; it just points to a commit and tracks new changes from there.

### Pull requests

A **pull request** (PR) is a proposal to merge changes from one branch into another (usually into `main`).

Pull requests are where collaboration happens:

- **Review** — teammates read the diff and leave comments
- **Discussion** — questions and suggestions before merging
- **Checks** — automated tests or CI can run on the PR
- **Merge** — once approved, changes become part of the target branch

Naming note: you are asking others to *pull* your changes into their branch. On some platforms this is called a "merge request," but GitHub uses "pull request."

A good PR is focused (one feature or fix), has a clear description, and links to related issues when applicable.


### Cloning repositories

**Cloning** copies a remote repository to your local machine, including the full Git history.

```bash
git clone https://github.com/username/repo-name.git
```

After cloning, you have a local folder you can edit, run, and commit to. The clone remembers where it came from (the **remote**, usually named `origin`).

Clone when:

- You join an existing project
- You want to contribute to open source
- You need a local copy to develop and test

Forking (on GitHub) creates your own copy of someone else's repo under your account — common for open-source contributions before opening a pull request.

### Pushing and pulling changes

Your local repo and the GitHub remote stay in sync with **push** and **pull**:

| Command | Direction | What it does |
|---------|-----------|--------------|
| `git pull` | Remote → Local | Download and merge remote changes |
| `git push` | Local → Remote | Upload your commits to GitHub |

Typical daily workflow:

1. `git pull` — get the latest changes from teammates
2. Edit files locally
3. `git add` — stage changes you want to save
4. `git commit` — create a snapshot with a message
5. `git push` — send commits to GitHub

If someone else pushed changes while you were working, Git may ask you to pull and resolve conflicts before pushing.

**Fetch** (`git fetch`) downloads remote changes without merging — useful to see what's new before integrating.

### GitHub workflow

A common team workflow looks like this:

```
main (stable)
  │
  ├── branch: feature/add-search
  │     └── commits → pull request → review → merge
  │
  └── branch: fix/login-bug
        └── commits → pull request → review → merge
```

Recommended practices:

1. Keep `main` in a working state — merge only reviewed, tested code
2. Use branches for every feature or fix
3. Open a pull request early for feedback (draft PRs are fine)
4. Pull before you push to avoid conflicts
5. Write meaningful commit messages and PR descriptions
6. Link PRs to issues (`Fixes #12` closes the issue on merge)

For solo projects, the same habits help: branches for experiments, commits as checkpoints, and GitHub as a backup.

### Basic repository management

Day-to-day repository management on GitHub includes:

**Creating a repository**

- Click **New repository** on GitHub
- Choose name, visibility, and optional README / `.gitignore` / license
- Follow the setup instructions to connect a local project or clone the new repo

**Organizing files**

- Use clear folder structure (`src/`, `docs/`, `tests/`)
- Add a README so visitors understand the project
- Use `.gitignore` to exclude generated files and secrets

**Editing on GitHub**

- Edit files directly in the browser for small fixes
- Upload files via the **Add file** button
- For larger work, clone locally and push commits

**Settings**

- **Collaborators** — invite others with read or write access
- **Branches** — protect `main` (require PR reviews before merge)
- **Actions** — automate tests and deployments
- **Delete / archive** — remove or retire unused repos

**Staying safe**

- Never commit passwords, API keys, or `.env` files — use `.gitignore`
- Review who has access to private repositories
- Use two-factor authentication on your GitHub account

### Essential Git commands (reference)

```bash
git status          # See changed and staged files
git add <file>      # Stage a file for commit
git add .           # Stage all changes
git commit -m "msg" # Save a snapshot
git log             # View commit history
git branch          # List branches
git checkout -b name # Create and switch to a new branch
git switch main     # Switch to an existing branch
git merge branch    # Merge branch into current branch
git pull            # Fetch and merge from remote
git push            # Push commits to remote
git clone <url>     # Copy a remote repo locally
```

---

## Further reading

- [GitHub Docs — Getting started](https://docs.github.com/en/get-started)
- [GitHub Skills](https://skills.github.com/)
- [Pro Git book (free)](https://git-scm.com/book/en/v2)
- [GitHub Flow guide](https://docs.github.com/en/get-started/using-github/github-flow)
- [Choosing a .gitignore template](https://github.com/github/gitignore)
