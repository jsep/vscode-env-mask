# vscode-env-mask — Spec

## Goal

Cursor/VS Code extension that hides `.env*` secret values by default. Per-key reveal, copy, and edit via CodeLens. Safe for screen share — file on disk unchanged until explicit edit.

## Decisions (locked)

| # | Topic | Choice |
|---|--------|--------|
| 1 | File scope | `.env*` only (`.env`, `.env.local`, `.env.production`, …) |
| 2 | Hide scope | Per-key |
| 3 | Actions UI | CodeLens above each env line |
| 4 | Default state | Hidden on open |
| 5 | Edit auth | None — direct edit |
| 6 | Edit UX | Inline input overlay at value, pre-filled, submit → replace in file |
| 7 | Show | CodeLens `Show` reveals that key; toggles to `Hide` when visible |
| 8 | Repo | `~/repos/vscode-env-mask` |
| 9 | Mask visual | Fixed 8 bullets: `API_KEY=••••••••` |

## CodeLens (per env line)

```
Copy | Show | Edit        ← hidden
Copy | Hide | Edit        ← revealed
```

| Action | Behavior |
|--------|----------|
| **Copy** | Clipboard = real value (works when hidden) |
| **Show** | Reveal value in editor for this key only |
| **Hide** | Re-mask this key |
| **Edit** | Inline overlay at value, pre-filled with real value; Enter/submit → `WorkspaceEdit` replace value segment |

No global toggle in v1. Optional later: `Env Mask: Hide All / Show All`.

## Masking

- **Display only** — decoration/overlay; never mutates file
- Hidden: `KEY=••••••••` (exactly 8 `•`, U+2022 or ASCII `*`)
- Revealed: normal syntax highlighting
- Per-key state in extension memory (`Map`: `fileUri + line + key → hidden|revealed`)
- New file open → all keys hidden
- No persist across reload in v1

## Parsing (`.env` lines)

Treat as env assignment when line matches:

```
KEY=VALUE
export KEY=VALUE
KEY="quoted value"
KEY='single quoted'
```

Skip / no CodeLens:

- Blank lines
- Comments (`# …`)
- Invalid / no `=`

Value extraction handles quotes; preserve quoting style on edit replace.

Edge cases v1:

- Inline `#` in unquoted values → parse naively or defer
- Multiline values → skip (no CodeLens)
- `KEY=` empty → mask empty, still offer Copy/Edit

## Edit overlay

- Trigger: CodeLens `Edit`
- UI: inline input at value range (Cursor/VS Code input box pattern)
- Pre-fill: decoded real value (no quotes in input; re-quote on save if original was quoted)
- Submit: replace value segment only, not whole line
- Cancel: Esc, no file change
- Works hidden or revealed

## File activation

- `activationEvents`: onLanguage `dotenv` if grammar exists, else `workspaceContains:**/.env*`
- `package.json` `files.associations` or document selector: `**/.env*`

## Architecture (impl sketch)

```
extension.ts
  ├── EnvParser          — line → { key, valueRange, rawValue }
  ├── MaskController     — per-key hidden set
  ├── DecorationProvider — hide value range with ghost text / after-decoration
  ├── EnvCodeLensProvider— Copy | Show/Hide | Edit
  └── EditInputHandler   — showInputBox or custom inline (InputBox min v1)
```

**Mask mechanism:** prefer `TextEditorDecorationType` with range replacement via `before`/`after` content trick, or `InlayHint`/decoration opacity like Cloak. Must not write bullets into file.

**State key:** `${document.uri.toString()}:${lineNumber}:${keyName}`

## Commands

| Command | Notes |
|---------|-------|
| `envMask.copyValue` | args: `{ uri, line, key }` |
| `envMask.showValue` | reveal key |
| `envMask.hideValue` | mask key |
| `envMask.editValue` | open overlay + apply edit |

## Settings (v1 minimal)

```json
{
  "envMask.maskChar": "•",
  "envMask.maskLength": 8,
  "envMask.enabled": true
}
```

## Non-goals (v1)

- Password / keychain
- JSON, YAML, docker-compose
- Persist reveal state across sessions
- Global show/hide all
- Length-matched masking
- Git commit hooks / secret scanning

## Success criteria

1. Open `.env` → all values show as 8 bullets
2. CodeLens on each `KEY=value` line
3. Copy works while hidden
4. Show/Hide toggles per key
5. Edit overlay pre-fills + updates file on submit
6. File bytes unchanged until Edit submit
7. Installable in Cursor via VSIX or local `code --install-extension`

## Open questions (defer)

- Reload persistence for revealed keys?
- Notification on copy vs silent?
- `export` prefix: include in key display or strip?
