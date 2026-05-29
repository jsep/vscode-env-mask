import * as vscode from 'vscode';
import { CopyFeedback } from './copyFeedback';
import { isEnvDocument, parseEnvTextDocument } from './envDocument';
import { MaskController } from './maskController';

export class EnvCodeLensProvider implements vscode.CodeLensProvider, vscode.Disposable {
  private readonly onDidChangeCodeLensesEmitter = new vscode.EventEmitter<void>();
  readonly onDidChangeCodeLenses = this.onDidChangeCodeLensesEmitter.event;

  constructor(
    private readonly maskController: MaskController,
    private readonly copyFeedback: CopyFeedback
  ) {}

  refresh(): void {
    this.onDidChangeCodeLensesEmitter.fire();
  }

  provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
    if (!isEnvDocument(document) || !this.isEnabled()) {
      return [];
    }

    const lenses: vscode.CodeLens[] = [];

    for (const parsed of parseEnvTextDocument(document)) {
      const range = new vscode.Range(parsed.lineNumber, 0, parsed.lineNumber, 0);
      const ref = { uri: document.uri, line: parsed.lineNumber, key: parsed.key };
      const hidden = this.maskController.isHidden(document.uri, parsed.lineNumber, parsed.key);
      const copied = this.copyFeedback.isCopied(document.uri.toString(), parsed.lineNumber, parsed.key);

      lenses.push(
        new vscode.CodeLens(range, {
          title: copied ? '$(pass-filled) Copied' : 'Copy',
          command: 'envMask.copyValue',
          arguments: [ref],
          tooltip: copied ? 'Copied to clipboard' : undefined,
        }),
        new vscode.CodeLens(range, {
          title: hidden ? 'Show' : 'Hide',
          command: hidden ? 'envMask.showValue' : 'envMask.hideValue',
          arguments: [ref],
        }),
        new vscode.CodeLens(range, {
          title: 'Edit',
          command: 'envMask.editValue',
          arguments: [ref],
        })
      );
    }

    return lenses;
  }

  resolveCodeLens(codeLens: vscode.CodeLens): vscode.CodeLens {
    return codeLens;
  }

  private isEnabled(): boolean {
    return vscode.workspace.getConfiguration('envMask').get<boolean>('enabled', true);
  }

  dispose(): void {
    this.onDidChangeCodeLensesEmitter.dispose();
  }
}
