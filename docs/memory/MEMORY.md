# Memory Index

Memory files capture durable lessons that should outlive a single PR or coding session.

Use `feedback_*.md` for cross-project lessons and `project_*.md` for repo-specific retrospectives.

## Feedback
- [feedback_confirm_before_act.md](feedback_confirm_before_act.md) — Wait for explicit user confirmation before modifying repository contents
- [feedback_tdd.md](feedback_tdd.md) — Treat tests as part of implementation, not an afterthought
- [feedback_e2e_before_pr.md](feedback_e2e_before_pr.md) — Validate all major end-to-end paths before opening a PR, not just one
- [feedback_real_e2e_before_phase_complete.md](feedback_real_e2e_before_phase_complete.md) — Validate major workflow milestones with a real end-to-end run before calling the phase done
- [feedback_use_worktree_for_isolated_followups.md](feedback_use_worktree_for_isolated_followups.md) — Use a separate worktree for small follow-up fixes when the main checkout still contains mixed drafts
- [feedback_contract_and_invariant_tests_before_merge.md](feedback_contract_and_invariant_tests_before_merge.md) — Verify public contracts and runtime invariants before treating a PR as safe
- [feedback_live_smoke_is_a_gate_not_a_nice_to_have.md](feedback_live_smoke_is_a_gate_not_a_nice_to_have.md) — Treat live smoke as a mandatory gate for browser/login/third-party/LLM workflows
- [feedback_handoff_boundary_design.md](feedback_handoff_boundary_design.md) — Separate internal outputs, operator handoff, and platform-specific export prep

## Project
- Add repo-specific retrospectives here as `project_*.md` files when the project starts accumulating its own lessons.
