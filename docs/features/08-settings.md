# 08 — Settings

**Status:** partial  
**Spec:** Settings (v1 minimal)

## Goal

User-configurable mask appearance and master enable switch.

## Requirements

- [x] `envMask.enabled` (boolean, default `true`)
- [x] `envMask.maskChar` (string, default `•`)
- [x] `envMask.maskLength` (number, default `8`, min `1`)
- [x] Decoration provider reacts to config changes
- [ ] Document settings in extension README (when added)
- [ ] Validate `maskChar` is non-empty (optional guard)

## Non-goals

- Length-matched masking (mask length always fixed)
- Per-file enable/disable

## Files

| File | Role |
|------|------|
| `package.json` | `contributes.configuration` |
| `src/decorationProvider.ts` | Reads config |

## Verify

1. Set `envMask.maskChar` to `*` and `envMask.maskLength` to `4`
2. Masks render as `****`
3. `envMask.enabled: false` → no masking
