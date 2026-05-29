import * as vscode from 'vscode';
import { parseEnvDocument, ParsedEnvLine } from './envParser';

interface ParseCacheEntry {
  version: number;
  lines: ParsedEnvLine[];
  byLineKey: Map<string, ParsedEnvLine>;
}

const parseCache = new Map<string, ParseCacheEntry>();

export function isEnvDocument(document: vscode.TextDocument): boolean {
  return document.fileName.includes('.env');
}

export function findOpenDocument(uri: vscode.Uri): vscode.TextDocument | undefined {
  return vscode.workspace.textDocuments.find((doc) => doc.uri.toString() === uri.toString());
}

export function findEditorForUri(uri: vscode.Uri): vscode.TextEditor | undefined {
  return vscode.window.visibleTextEditors.find((editor) => editor.document.uri.toString() === uri.toString());
}

export function parseEnvTextDocument(document: vscode.TextDocument): ParsedEnvLine[] {
  const uri = document.uri.toString();
  const cached = parseCache.get(uri);
  if (cached && cached.version === document.version) {
    return cached.lines;
  }

  const lines = Array.from({ length: document.lineCount }, (_, i) => document.lineAt(i).text);
  const parsed = parseEnvDocument(lines);
  const byLineKey = new Map(parsed.map((line) => [lineKey(line.lineNumber, line.key), line]));

  parseCache.set(uri, { version: document.version, lines: parsed, byLineKey });
  return parsed;
}

export function findParsedLine(
  document: vscode.TextDocument,
  line: number,
  key: string
): ParsedEnvLine | undefined {
  parseEnvTextDocument(document);
  return parseCache.get(document.uri.toString())?.byLineKey.get(lineKey(line, key));
}

export function getDecodedValue(document: vscode.TextDocument, line: number, key: string): string | undefined {
  return findParsedLine(document, line, key)?.decodedValue;
}

export function clearParseCache(uri?: vscode.Uri): void {
  if (uri) {
    parseCache.delete(uri.toString());
    return;
  }
  parseCache.clear();
}

function lineKey(line: number, key: string): string {
  return `${line}:${key}`;
}
