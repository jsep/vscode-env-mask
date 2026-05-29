# 06 — Show / Hide toggle

**Status:** done  
**Spec:** CodeLens → Show/Hide, Masking, Decisions #2 #7  
**Success criteria:** #4

## Goal

Per-key reveal and re-mask without touching the file.

## Requirements

- [x] Command `envMask.showValue` → `MaskController.reveal`, refresh decorations + CodeLens
- [x] Command `envMask.hideValue` → `MaskController.hide`, refresh decorations + CodeLens
- [x] Revealed: normal syntax highlighting on value range (no mask decoration)
- [x] Hidden: mask decoration restored
- [x] Toggle is independent per key (same file can mix hidden/revealed)
- [x] New file open → all keys hidden (already in 03)
- [x] No persist across window reload (v1)
- [x] CodeLens label switches Show ↔ Hide

## Files

| File | Role |
|------|------|
| `src/commands/showHideValue.ts` | Show/hide handlers |
| `src/maskController.ts` | reveal/hide API |
| `src/decorationProvider.ts` | Respects hidden state |

## Verify

1. Open `fixtures/sample.env` — all masked
2. **Show** on `API_KEY` → real value visible; lens reads **Hide**
3. **Hide** → back to `••••••••`
4. Reveal `API_KEY`, leave `JWT_SECRET` hidden → mixed state works
