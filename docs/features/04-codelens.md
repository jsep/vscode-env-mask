# 04 — CodeLens UI

**Status:** done  
**Spec:** CodeLens (per env line), Decisions #3  
**Success criteria:** #2

## Goal

CodeLens above each parsed env assignment line.

## Layout

```
Copy | Show | Edit        ← key hidden
Copy | Hide | Edit        ← key revealed
```

## Requirements

- [x] `EnvCodeLensProvider` implements `CodeLensProvider`
- [x] One CodeLens group per parsed line (skip comments/blanks/invalid)
- [x] Show/Hide label reflects current `MaskController` state for that key
- [x] Refresh CodeLens on document change and show/hide toggle
- [x] Register provider for `**/.env*` / dotenv documents

## Commands invoked (implemented in 05–07)

| Lens | Command | Args |
|------|---------|------|
| Copy | `envMask.copyValue` | `{ uri, line, key }` |
| Show | `envMask.showValue` | `{ uri, line, key }` |
| Hide | `envMask.hideValue` | `{ uri, line, key }` |
| Edit | `envMask.editValue` | `{ uri, line, key }` |

## Files

| File | Role |
|------|------|
| `src/envCodeLensProvider.ts` | CodeLens provider |
| `package.json` | `contributes.commands` |

## Verify

1. Open `fixtures/sample.env`
2. Each `KEY=value` line has `Copy | Show | Edit` above it
3. Comment/blank lines have no CodeLens
