# PROJECT_NAME

PROJECT_DESCRIPTION

## Purpose
This repository is created from `template-workflow-base`.

It provides:
- shared repository rules via `CLAUDE.md`
- Codex-specific entry rules via `AGENTS.md`
- workflow and project management rules via `docs/process.md`
- durable shared lessons via `docs/memory/MEMORY.md`
- issue and PR templates for consistent collaboration

## Repository rules
- Shared execution rules: `CLAUDE.md`
- Codex-specific behavior: `AGENTS.md`
- Issue / milestone / PR workflow: `docs/process.md`
- Shared memory and lessons learned: `docs/memory/MEMORY.md`

## Project context
Fill in the business and scope information in:
- `docs/project-context.md`

This file should explain:
- what this project is for
- what is in scope
- what is out of scope
- key constraints
- deployment assumptions
- external dependencies

## First-time setup
After creating a new repository from this template:

1. Rename the project in this README
2. Fill `docs/project-context.md`
3. Review `CLAUDE.md`
4. Review `AGENTS.md`
5. Review `docs/process.md`
6. Review `docs/memory/MEMORY.md`
7. Adjust issue / PR templates if needed
8. Add project-specific stack files
9. Remove placeholder text that no longer applies

## Development workflow
1. Create or confirm an issue
2. Ensure issue labels / milestone are correct
3. Create a branch
4. Read code and propose a plan
5. Wait for approval before changing repository contents
6. Implement with minimal changes
7. Verify changes with tests or equivalent validation
8. Commit at green checkpoints
9. Open a PR with clear verification notes

## Notes
- This template is workflow-oriented, not stack-oriented.
- Add project-specific runtime, framework, CI, and deployment files separately.
- Keep cross-project lessons in `docs/memory/feedback_*.md`; keep repo-specific retrospectives in `docs/memory/project_*.md`.
