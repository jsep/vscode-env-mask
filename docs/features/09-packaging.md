# 09 — Packaging & install

**Status:** pending  
**Spec:** Success criteria #7

## Goal

Installable extension in Cursor/VS Code via VSIX or local install.

## Requirements

- [x] `@vscode/vsce` dev dependency
- [x] `npm run package` script
- [ ] `.vscodeignore` excludes source maps / dev files appropriately
- [ ] Produce `env-mask-0.0.1.vsix` without errors
- [ ] Install: `code --install-extension env-mask-0.0.1.vsix` (or Cursor equivalent)
- [ ] Smoke test in clean host (not only Extension Development Host)
- [ ] README with install + usage (optional for v1 ship)

## Verify

```bash
npm run compile
npm run package
code --install-extension env-mask-0.0.1.vsix
```

Open any workspace `.env` → masking + CodeLens work.
