# 05 — Copy value

**Status:** done  
**Spec:** CodeLens → Copy  
**Success criteria:** #3

## Goal

Copy the real (decoded) value to clipboard while the value remains masked in the editor.

## Requirements

- [x] Command `envMask.copyValue` with args `{ uri, line, key }`
- [x] Clipboard content = `decodedValue` from parser (not mask, not quoted wrapper)
- [x] Works when key is hidden or revealed
- [x] No file mutation
- [x] Wired from CodeLens `Copy` (feature 04)

## Open question

- Notification on copy vs silent — defer; default **silent** unless decided otherwise ([open-questions.md](./open-questions.md))

## Files

| File | Role |
|------|------|
| `src/commands/copyValue.ts` | Command handler |
| `src/commands/envKeyArgs.ts` | Arg revival |
| `package.json` | Command registration |

## Verify

1. Open `fixtures/sample.env` (values masked)
2. Click **Copy** on `API_KEY` line
3. Paste → `super-secret-token` (real value)
4. Editor still shows `••••••••`
