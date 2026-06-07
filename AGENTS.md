# Project Branching Policy

This project uses **feature branch development**. The main/production branch is `astro`.

## Rules

1. **Feature branches**: All new features or significant changes MUST be developed on a dedicated feature branch with an appropriate name (e.g. `feat/add-contact-form`, `fix/header-overflow`).

2. **Auto-commit**: After completing any change or feature, immediately stage and commit with a short, descriptive commit message.

3. **Branch safety**: NEVER merge into `astro` unless the user explicitly requests a merge, deployment, or similar action.

4. **Branch switching guard**: At the start of every prompt:
   - If the current branch IS `astro` → create a new feature branch for the work.
   - If the current branch is NOT `astro` → check whether the prompt relates to the current feature branch:
     - If yes → stay on the current branch and continue working.
     - If no → ask the user to choose:
       1. Switch to a new feature branch for this new work.
       2. Stay on the current feature branch.
       3. Switch back to the `astro` branch.

5. **Commit discipline**: Commit after every logical unit of work. Never leave changes uncommitted.