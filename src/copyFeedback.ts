import * as vscode from 'vscode';
import { stateKey } from './envParser';

const COPIED_FEEDBACK_MS = 2000;

export class CopyFeedback implements vscode.Disposable {
  private readonly copied = new Set<string>();
  private readonly timers = new Map<string, ReturnType<typeof setTimeout>>();

  markCopied(uri: string, line: number, key: string, onChange: () => void): void {
    const keyId = stateKey(uri, line, key);
    const existing = this.timers.get(keyId);
    if (existing) {
      clearTimeout(existing);
    }

    this.copied.add(keyId);
    onChange();

    this.timers.set(
      keyId,
      setTimeout(() => {
        this.copied.delete(keyId);
        this.timers.delete(keyId);
        onChange();
      }, COPIED_FEEDBACK_MS)
    );
  }

  isCopied(uri: string, line: number, key: string): boolean {
    return this.copied.has(stateKey(uri, line, key));
  }

  dispose(): void {
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    this.copied.clear();
    this.timers.clear();
  }
}
