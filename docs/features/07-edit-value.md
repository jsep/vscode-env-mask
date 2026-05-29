# 07 — Edit value

**Status:** done  
**Spec:** Edit overlay, Decisions #5 #6  
**Success criteria:** #5, #6

## Goal

Edit a single env value via input overlay; only the value segment is written on submit.

## Requirements

- [x] Command `envMask.editValue` with args `{ uri, line, key }`
- [x] UI: `showInputBox` (v1 minimum) pre-filled with `decodedValue`
- [x] Submit (Enter): `WorkspaceEdit` replaces **value range only** (not whole line)
- [x] Re-quote on save if original had `quoteStyle` (`"` or `'`)
- [x] Cancel (Esc): no file change
- [x] Works whether key is hidden or revealed
- [x] After save: re-parse line, keep hidden/revealed state, refresh decorations + CodeLens
- [x] No edit auth / password (v1)

## Files

| File | Role |
|------|------|
| `src/commands/editValue.ts` | Input + WorkspaceEdit |
| `src/envParser.ts` | `encodeEnvValue` for re-quoting |

## Verify

1. **Edit** `DATABASE_URL` while hidden → input shows decoded URL (no quotes)
2. Submit new value → file updated, quoting preserved (`"…"`)
3. **Edit** `API_KEY` → change value → only value segment changes on disk
4. Cancel edit → file unchanged
5. Mask still applies after edit if key was hidden
