import * as vscode from 'vscode';
import { stateKey } from './envParser';

export class MaskController {
  private readonly revealed = new Set<string>();

  isHidden(uri: vscode.Uri, lineNumber: number, key: string): boolean {
    return !this.revealed.has(stateKey(uri.toString(), lineNumber, key));
  }

  reveal(uri: vscode.Uri, lineNumber: number, key: string): void {
    this.revealed.add(stateKey(uri.toString(), lineNumber, key));
  }

  hide(uri: vscode.Uri, lineNumber: number, key: string): void {
    this.revealed.delete(stateKey(uri.toString(), lineNumber, key));
  }

  clearDocument(uri: vscode.Uri): void {
    const prefix = `${uri.toString()}:`;
    for (const key of [...this.revealed]) {
      if (key.startsWith(prefix)) {
        this.revealed.delete(key);
      }
    }
  }
}
