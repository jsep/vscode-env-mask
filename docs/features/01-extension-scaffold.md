# 01 — Extension scaffold & activation

**Status:** done  
**Spec:** File activation, Architecture (`extension.ts`)

## Goal

Bootstrapped VS Code/Cursor extension that activates on `.env*` files only.

## Requirements

- [x] `package.json` with `engines.vscode`, compile/watch scripts
- [x] `activationEvents`: `onLanguage:dotenv`, `workspaceContains:**/.env*`
- [x] `dotenv` language contribution: `.env` extension + `.env.*` filename pattern
- [x] Document selector / detection: `document.fileName.includes('.env')`
- [x] `extension.ts` entry: activate → wire providers, dispose on deactivate
- [x] Dev ergonomics: `.vscode/launch.json` (F5), `fixtures/sample.env`

## Files

| File | Role |
|------|------|
| `package.json` | Manifest, activation, language |
| `tsconfig.json` | TS → `out/` |
| `src/extension.ts` | Entry point |
| `.vscode/launch.json` | Extension host debug |

## Verify

1. F5 → Extension Development Host opens
2. Open `fixtures/sample.env` → extension activates (no errors in host console)
