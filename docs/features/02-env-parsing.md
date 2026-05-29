# 02 — Env line parsing

**Status:** done  
**Spec:** Parsing

## Goal

Parse `.env` assignment lines into structured data for masking, CodeLens, and edits.

## Supported lines

- [x] `KEY=VALUE`
- [x] `export KEY=VALUE`
- [x] `KEY="quoted value"`
- [x] `KEY='single quoted'`
- [x] `KEY=` (empty value)

## Skipped (no actions)

- [x] Blank lines
- [x] Comments (`# …`)
- [x] Lines without `=`
- [x] Unclosed quotes / multiline values

## Output shape

```ts
{
  lineNumber: number;
  key: string;
  valueRange: TextRange;   // value segment only (after =)
  rawValue: string;        // as in file (quotes included)
  decodedValue: string;    // unquoted for copy/edit pre-fill
  quoteStyle: '"' | "'" | null;
  exportPrefix: boolean;
}
```

## Deferred (v1)

- [ ] Inline `#` in unquoted values (parse naively or skip)

## Files

| File | Role |
|------|------|
| `src/envParser.ts` | Pure parser (no VS Code import) |
| `src/test/envParser.test.ts` | Unit tests |

## Verify

```bash
npm test
```

All parser tests pass.
