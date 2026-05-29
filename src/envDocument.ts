import * as vscode from 'vscode';
import { parseEnvDocument, ParsedEnvLine } from './envParser';

export function isEnvDocument(document: vscode.TextDocument): boolean {
  return document.fileName.includes('.env');
}

export function parseEnvTextDocument(document: vscode.TextDocument): ParsedEnvLine[] {
  const lines = Array.from({ length: document.lineCount }, (_, i) => document.lineAt(i).text);
  return parseEnvDocument(lines);
}

export function findParsedLine(
  document: vscode.TextDocument,
  line: number,
  key: string
): ParsedEnvLine | undefined {
  return parseEnvTextDocument(document).find((parsed) => parsed.lineNumber === line && parsed.key === key);
}

export function getDecodedValue(document: vscode.TextDocument, line: number, key: string): string | undefined {
  return findParsedLine(document, line, key)?.decodedValue;
}
