# Non-goals (v1)

Explicitly out of scope per [SPEC.md](../../SPEC.md).

| Item | Notes |
|------|-------|
| Password / keychain | No auth before reveal or edit |
| JSON, YAML, docker-compose env | `.env*` files only |
| Persist reveal state across sessions | In-memory only; reload resets |
| Global show/hide all | Per-key only; optional later |
| Length-matched masking | Fixed mask length always |
| Git commit hooks / secret scanning | Display-layer only |
| Disable AI autocomplete (Copilot, Cursor Tab) | See [TODOS.md](../../TODOS.md) — separate idea |
