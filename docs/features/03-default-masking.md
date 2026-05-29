# 03 — Default value masking

**Status:** done  
**Spec:** Masking, Decisions #4 (hidden on open), #9 (8 bullets)  
**Success criteria:** #1 (bullets on open), #6 (file unchanged)

## Goal

On open, every parsed env value displays as a fixed-length mask. Display-only — never writes to disk.

## Requirements

- [x] Hidden by default for all keys on file open
- [x] Mask: configurable char × length (default `•` × 8)
- [x] Mechanism: `TextEditorDecorationType` — `opacity: 0` on value range + `before.contentText` overlay
- [x] Revealed keys: no mask decoration (Show/Hide wired in feature 06)
- [x] Per-key state: `MaskController` keyed `${uri}:${line}:${key}`
- [x] No persist across reload (in-memory only)
- [x] Refresh on: active editor change, document edit, open, config change, document close (clear state)
- [x] Respect `envMask.enabled`

## Files

| File | Role |
|------|------|
| `src/maskController.ts` | Revealed-set / hidden-by-default |
| `src/decorationProvider.ts` | Apply/remove mask decorations |

## Verify

1. Open `fixtures/sample.env`
2. Values show as `••••••••` (not real secrets)
3. Save file without editing → disk bytes unchanged
4. Toggle `envMask.enabled: false` → masks disappear
