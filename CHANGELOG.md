# Changelog

## v0.1.0 — Initial Release

PAPI MCP Server — the AI-powered project planning framework.

### Commands
- **setup** — Initialise a new PAPI project with Product Brief generation
- **plan** — Run cycle planning with embedded BUILD HANDOFFs (Bootstrap + Full modes)
- **build_list / build_describe / build_execute / build_cancel** — Manage build tasks
- **board_view / board_deprioritise / board_archive** — View and manage the Board
- **strategy_review / strategy_change** — Run Strategy Reviews and apply strategic changes
- **review_list / review_submit** — Human review loop for handoffs and builds
- **idea** — Capture ideas as backlog tasks for future triage
- **health** — Cycle Health Summary dashboard
- **release** — Cut versioned releases with git tags and changelogs

### Features
- .md file persistence in .papi/ directory
- Bootstrap + Full planning modes with Anthropic API integration
- Embedded BUILD HANDOFFs with dual write-back build reports
- Auto-commit and auto-PR after builds
- Board corrections and Active Decision persistence
- Single-purpose MCP tools for optimal LLM tool selection
- Consistent error handling across all tools
