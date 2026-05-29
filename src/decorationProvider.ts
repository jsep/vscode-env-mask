import * as vscode from 'vscode';
import { isEnvDocument, parseEnvTextDocument } from './envDocument';
import { TextRange } from './envParser';
import { MaskController } from './maskController';

function toRange(range: TextRange): vscode.Range {
  return new vscode.Range(range.startLine, range.startCharacter, range.endLine, range.endCharacter);
}

export class DecorationProvider implements vscode.Disposable {
  private readonly maskDecorationType: vscode.TextEditorDecorationType;
  private readonly disposables: vscode.Disposable[] = [];

  constructor(private readonly maskController: MaskController) {
    this.maskDecorationType = vscode.window.createTextEditorDecorationType({
      color: new vscode.ThemeColor('editor.background'),
      backgroundColor: new vscode.ThemeColor('editor.background'),
      opacity: '0',
      letterSpacing: '-100px',
      textDecoration: 'none; font-size: 0px; line-height: 0',
      rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
    });

    this.disposables.push(
      vscode.window.onDidChangeActiveTextEditor((editor) => this.refresh(editor)),
      vscode.workspace.onDidChangeTextDocument((event) => {
        for (const editor of vscode.window.visibleTextEditors) {
          if (editor.document === event.document) {
            this.apply(editor);
          }
        }
      }),
      vscode.workspace.onDidOpenTextDocument((document) => {
        const editor = vscode.window.visibleTextEditors.find((e) => e.document === document);
        if (editor) {
          this.apply(editor);
        }
      }),
      vscode.workspace.onDidCloseTextDocument((document) => this.maskController.clearDocument(document.uri)),
      vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration('envMask')) {
          this.refresh();
        }
      })
    );
  }

  refresh(editor?: vscode.TextEditor): void {
    if (editor) {
      this.apply(editor);
      return;
    }
    for (const visible of vscode.window.visibleTextEditors) {
      this.apply(visible);
    }
  }

  private apply(editor: vscode.TextEditor): void {
    if (!isEnvDocument(editor.document) || !this.isEnabled()) {
      editor.setDecorations(this.maskDecorationType, []);
      return;
    }

    const maskText = this.maskText();
    const decorations: vscode.DecorationOptions[] = [];

    for (const parsed of parseEnvTextDocument(editor.document)) {
      if (!this.maskController.isHidden(editor.document.uri, parsed.lineNumber, parsed.key)) {
        continue;
      }

      decorations.push({
        range: toRange(parsed.valueRange),
        renderOptions: {
          before: {
            contentText: maskText,
            color: new vscode.ThemeColor('editor.foreground'),
            textDecoration: 'none',
          },
        },
      });
    }

    editor.setDecorations(this.maskDecorationType, decorations);
  }

  private isEnabled(): boolean {
    return vscode.workspace.getConfiguration('envMask').get<boolean>('enabled', true);
  }

  private maskText(): string {
    const config = vscode.workspace.getConfiguration('envMask');
    const maskChar = config.get<string>('maskChar', '•');
    const maskLength = config.get<number>('maskLength', 8);
    return maskChar.repeat(maskLength);
  }

  dispose(): void {
    this.maskDecorationType.dispose();
    for (const disposable of this.disposables) {
      disposable.dispose();
    }
  }
}
