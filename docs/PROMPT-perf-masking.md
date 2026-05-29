# Prompt: improve env-mask performance & flash-free masking

Use this when revisiting masking performance. **Do not add grammar bootstrap again without measuring** — the transparent-token approach made the flash worse.

## Problem

- On first open and tab switch, env values briefly appear unmasked (screen-share risk).
- Recent grammar + `configurationDefaults` transparent tokens + dual decoration types did **not** fix it and may have regressed perceived behavior.
- CodeLens label updates (`Copy`→`Copied`, `Show`→`Hide`) feel laggy despite sync commands and parse cache.

## Current stack

- **Masking:** `TextEditorDecorationType` (hide + `before` bullets) + optional `revealDecorationType`
- **Grammar:** `syntaxes/dotenv.tmLanguage.json` + `configurationDefaults` transparent `variable.other.envmask.value`
- **State:** `MaskController` per-key reveal; parse cache keyed by `document.version`
- **UI:** CodeLens → commands; `showInputBox` for edit

## Goal

The most important goals is to hide the values as soon as possible on open and tab switch, even if you have to apply the mask and the other ui elements after that.

1. **Zero visible secret flash** on open, tab switch, and workspace restore.
2. **CodeLens feedback** feels instant (<50ms perceived).
3. **Show/Hide** still works per-key; file bytes unchanged until Edit.

## Investigate (in order)

1. **Measure** where time goes: extension activate, `provideCodeLenses`, `setDecorations`, grammar tokenization vs decoration paint (Chrome devtools on Extension Host if needed).
2. **Revert or isolate grammar bootstrap** — confirm whether transparent TextMate rules conflict with reveal decorations or cause double-layout.
3. **Earlier hide without breaking Show:** consider Cloak-style runtime `tokenColorCustomizations` only while hidden, or single decoration path (no dual types).
4. **Tab switch:** ensure masks re-apply on `onDidChangeVisibleTextEditors` / `tabGroups.onDidChangeTabs` without full re-parse; verify decorations aren't dropped one frame early.
5. **CodeLens lag:** evaluate moving actions off CodeLens (Code Actions on line, hover command links, status bar for current key) — CodeLens refresh pipeline may be inherently slow.
6. **Activation:** tune `activationEvents` (`onStartupFinished` vs `workspaceContains` only) — avoid loading too late or too often.

## Non-goals

- Webview dashboard, global show/hide all, persist reveal state.

## Success criteria

- Open `fixtures/sample.env` 10× (cold + tab switch): no readable secret chars in screen recording.
- Copy/Show clicks: label updates in same visual frame as click (or switch UI if CodeLens can't do that).
- All existing parser tests pass; no regression on mask gap / cursor leak fixes.

## Key files

`src/decorationProvider.ts`, `src/envCodeLensProvider.ts`, `syntaxes/dotenv.tmLanguage.json`, `package.json` (activation + configurationDefaults), `src/envDocument.ts` (parse cache)
