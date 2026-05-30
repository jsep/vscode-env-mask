# Env Mask

Hide `.env*` secret values in the editor by default. Reveal, copy, and edit one key at a time via CodeLens — safe for screen share because the file on disk is unchanged until you submit an edit.

Works in **VS Code** and **Cursor**.

## Features

- **Mask on open** — values render as a fixed-length mask (default `••••••••`) while keys stay visible
- **Per-key control** — show or hide individual variables without affecting the rest of the file
- **Copy while hidden** — clipboard gets the real decoded value
- **Edit with quoting preserved** — input box pre-filled with the decoded value; save re-applies `"` or `'` if the line was quoted
- **Display-only masking** — decorations and syntax hiding; no writes to disk except explicit edits
- **Fast open** — TextMate grammar hides raw value tokens before decorations apply

## Usage

Open any `.env` file (`.env`, `.env.local`, `.env.production`, etc.). Each assignment line gets CodeLens actions above it:

| State | CodeLens |
|-------|----------|
| Hidden | `Copy` · `Show` · `Edit` |
| Revealed | `Copy` · `Hide` · `Edit` |

| Action | Behavior |
|--------|----------|
| **Copy** | Copies the decoded value (works when masked) |
| **Show** | Reveals that key’s value in the editor |
| **Hide** | Masks that key again |
| **Edit** | Opens an input box with the current value; Enter writes only the value segment |

Supported line shapes:

```dotenv
KEY=value
export KEY=value
KEY="quoted value"
KEY='single quoted'
KEY=
```

Comments, blank lines, and lines without `=` are ignored.

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `envMask.enabled` | `true` | Turn masking on or off |
| `envMask.maskChar` | `•` | Character used in the mask overlay |
| `envMask.maskLength` | `8` | Number of mask characters shown |

Example:

```json
{
  "envMask.enabled": true,
  "envMask.maskChar": "•",
  "envMask.maskLength": 8
}
```

## Install

### Marketplace

Search for **Env Mask** in the Extensions view (`Cmd+Shift+X` / `Ctrl+Shift+X`) and install.

### VSIX (local)

```bash
npm run compile
npm run package
code --install-extension env-mask-0.0.1.vsix
```

Use `cursor --install-extension env-mask-0.0.1.vsix` in Cursor.

### Development

```bash
npm install
npm run compile
```

Press **F5** to launch an Extension Development Host, then open a `.env` file in that window.

## Requirements

- VS Code `^1.85.0` (or compatible Cursor build)

## Security notes

Env Mask is a **display-layer** convenience for pairing and demos. It does not:

- Encrypt or protect secrets on disk
- Block extensions, terminals, or AI tools from reading file contents
- Persist reveal state across reloads (all keys start hidden again)
- Scan git history or prevent commits

Treat revealed values like any other plaintext in the editor.

## Development

```bash
npm run compile   # build
npm run watch     # rebuild on change
npm test          # parser unit tests
npm run package   # produce .vsix
```

Implementation details and acceptance criteria: [SPEC.md](./SPEC.md), [docs/features](./docs/features/).

## Limitations (v1)

- `.env*` files only (not JSON/YAML/docker-compose env blocks)
- Per-key show/hide only (no global toggle)
- No password or keychain gate before reveal/edit
- Reveal state is in-memory until the window reloads

## License

Not specified yet.
