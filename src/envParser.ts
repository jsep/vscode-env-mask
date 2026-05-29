export type QuoteStyle = '"' | "'" | null;

export interface TextRange {
  startLine: number;
  startCharacter: number;
  endLine: number;
  endCharacter: number;
}

export interface ParsedEnvLine {
  lineNumber: number;
  key: string;
  valueRange: TextRange;
  rawValue: string;
  decodedValue: string;
  quoteStyle: QuoteStyle;
  exportPrefix: boolean;
}

export function parseEnvDocument(lines: string[]): ParsedEnvLine[] {
  const parsed: ParsedEnvLine[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = parseEnvLine(lines[i]!, i);
    if (line) {
      parsed.push(line);
    }
  }
  return parsed;
}

export function parseEnvLine(line: string, lineNumber: number): ParsedEnvLine | null {
  let i = 0;
  while (i < line.length && /\s/.test(line[i]!)) {
    i++;
  }
  if (i >= line.length || line[i] === '#') {
    return null;
  }

  let exportPrefix = false;
  if (line.slice(i).startsWith('export ')) {
    exportPrefix = true;
    i += 'export '.length;
    while (i < line.length && /\s/.test(line[i]!)) {
      i++;
    }
  }

  const keyStart = i;
  while (i < line.length && line[i] !== '=') {
    i++;
  }
  if (i >= line.length) {
    return null;
  }

  const key = line.slice(keyStart, i).trim();
  if (!key) {
    return null;
  }

  i++;
  const valueStart = i;
  const value = parseValue(line, valueStart);
  if (!value) {
    return null;
  }

  return {
    lineNumber,
    key,
    valueRange: {
      startLine: lineNumber,
      startCharacter: valueStart,
      endLine: lineNumber,
      endCharacter: value.valueEnd,
    },
    rawValue: value.rawValue,
    decodedValue: value.decodedValue,
    quoteStyle: value.quoteStyle,
    exportPrefix,
  };
}

function parseValue(
  line: string,
  valueStart: number
): { valueEnd: number; rawValue: string; decodedValue: string; quoteStyle: QuoteStyle } | null {
  if (valueStart >= line.length) {
    return { valueEnd: valueStart, rawValue: '', decodedValue: '', quoteStyle: null };
  }

  const first = line[valueStart]!;
  if (first === '"' || first === "'") {
    const quote = first;
    let j = valueStart + 1;
    while (j < line.length && line[j] !== quote) {
      j++;
    }
    if (j >= line.length) {
      return null;
    }
    j++;
    const rawValue = line.slice(valueStart, j);
    return {
      valueEnd: j,
      rawValue,
      decodedValue: rawValue.slice(1, -1),
      quoteStyle: quote,
    };
  }

  const rawValue = line.slice(valueStart);
  return {
    valueEnd: line.length,
    rawValue,
    decodedValue: rawValue,
    quoteStyle: null,
  };
}

export function stateKey(uri: string, lineNumber: number, key: string): string {
  return `${uri}:${lineNumber}:${key}`;
}

export function encodeEnvValue(decodedValue: string, quoteStyle: QuoteStyle): string {
  if (quoteStyle === '"') {
    return `"${decodedValue}"`;
  }
  if (quoteStyle === "'") {
    return `'${decodedValue}'`;
  }
  return decodedValue;
}
