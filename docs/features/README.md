# Features — progress tracker

Derived from [SPEC.md](../../SPEC.md). Each feature has acceptance criteria mapped to the spec success criteria.

## Status

| # | Feature | Status | Spec refs | Success criteria |
|---|---------|--------|-----------|------------------|
| 01 | [Extension scaffold & activation](./01-extension-scaffold.md) | done | File activation, Architecture | — |
| 02 | [Env line parsing](./02-env-parsing.md) | done | Parsing | — |
| 03 | [Default value masking](./03-default-masking.md) | done | Masking, Decisions #4 #9 | #1, #6 |
| 04 | [CodeLens UI](./04-codelens.md) | done | CodeLens, Decisions #3 | #2 |
| 05 | [Copy value](./05-copy-value.md) | done | CodeLens → Copy | #3 |
| 06 | [Show / Hide toggle](./06-show-hide.md) | done | CodeLens → Show/Hide, Decisions #2 #7 | #4 |
| 07 | [Edit value](./07-edit-value.md) | pending | Edit overlay, Decisions #5 #6 | #5, #6 |
| 08 | [Settings](./08-settings.md) | partial | Settings | — |
| 09 | [Packaging & install](./09-packaging.md) | pending | Success criteria #7 | #7 |

**Legend:** `done` · `partial` · `pending` · `deferred` · `n/a`

## Implementation slices

Planned build order (each slice should leave the extension runnable):

| Slice | Features | Notes |
|-------|----------|-------|
| 1 | 01, 02, 03 | ✅ Complete — open `.env*` → masked values |
| 2 | 04, 05, 06 | ✅ Complete — CodeLens + Copy + Show/Hide |
| 3 | 07 | Edit overlay + WorkspaceEdit |
| 4 | 08, 09 | Settings polish, VSIX, smoke test |

## Out of scope (v1)

See [non-goals.md](./non-goals.md).

## Open questions

Tracked in [open-questions.md](./open-questions.md) — do not block v1 unless resolved.
