import * as vscode from 'vscode';
import { isEnvDocument, parseEnvTextDocument } from './envDocument';
import { TextRange } from './envParser';
import { MaskController } from './maskController';

function toRange(range: TextRange): vscode.Range {
  return new vscode.Range(range.startLine, range.startCharacter, range.endLine, range.endCharacter);
}

function safePosition(valueRange: vscode.Range): vscode.Position {
  return new vscode.Position(valueRange.start.line, Math.max(0, valueRange.start.character - 1));
}

export class MaskSelectionGuard implements vscode.Disposable {
  private clamping = false;
  private readonly disposables: vscode.Disposable[] = [];

  constructor(private readonly maskController: MaskController) {
    this.disposables.push(vscode.window.onDidChangeTextEditorSelection((event) => this.clamp(event.textEditor)));
  }

  private clamp(editor: vscode.TextEditor | undefined): void {
    if (this.clamping || !editor || !isEnvDocument(editor.document) || !this.isEnabled()) {
      return;
    }

    const next = editor.selections.map((selection) => this.clampSelection(editor.document, selection));
    if (next.every((selection, index) => selection.isEqual(editor.selections[index]!))) {
      return;
    }

    this.clamping = true;
    try {
      editor.selections = next;
    } finally {
      this.clamping = false;
    }
  }

  private clampSelection(document: vscode.TextDocument, selection: vscode.Selection): vscode.Selection {
    let anchor = selection.anchor;
    let active = selection.active;

    for (const parsed of parseEnvTextDocument(document)) {
      if (!this.maskController.isHidden(document.uri, parsed.lineNumber, parsed.key)) {
        continue;
      }

      const valueRange = toRange(parsed.valueRange);
      if (valueRange.isEmpty) {
        continue;
      }

      anchor = this.clampPosition(anchor, valueRange);
      active = this.clampPosition(active, valueRange);
    }

    return new vscode.Selection(anchor, active);
  }

  private clampPosition(position: vscode.Position, valueRange: vscode.Range): vscode.Position {
    return valueRange.contains(position) ? safePosition(valueRange) : position;
  }

  private isEnabled(): boolean {
    return vscode.workspace.getConfiguration('envMask').get<boolean>('enabled', true);
  }

  dispose(): void {
    for (const disposable of this.disposables) {
      disposable.dispose();
    }
  }
}
