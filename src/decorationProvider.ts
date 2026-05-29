import * as vscode from 'vscode';
import { isEnvDocument, parseEnvTextDocument } from './envDocument';
import { TextRange } from './envParser';
import { MaskController } from './maskController';

function toRange(range: TextRange): vscode.Range {
  return new vscode.Range(range.startLine, range.startCharacter, range.endLine, range.endCharacter);
}

export class DecorationProvider implements vscode.Disposable {
  private readonly maskDecorationType: vscode.TextEditorDecorationType;
  private readonly revealDecorationType: vscode.TextEditorDecorationType;
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

    this.revealDecorationType = vscode.window.createTextEditorDecorationType({
      color: new vscode.ThemeColor('editor.foreground'),
      letterSpacing: '0',
      textDecoration: 'none',
      rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
    });

    this.refreshAllVisible();

    this.disposables.push(
      vscode.window.onDidChangeActiveTextEditor((editor) => this.refresh(editor)),
      vscode.window.onDidChangeVisibleTextEditors((editors) => this.refreshEditors(editors)),
      vscode.workspace.onDidChangeTextDocument((event) => {
        for (const editor of vscode.window.visibleTextEditors) {
          if (editor.document === event.document) {
            this.apply(editor);
          }
        }
      }),
      vscode.workspace.onDidOpenTextDocument((document) => {
        for (const editor of vscode.window.visibleTextEditors) {
          if (editor.document === document) {
            this.apply(editor);
          }
        }
      }),
      vscode.workspace.onDidCloseTextDocument((document) => this.maskController.clearDocument(document.uri)),
      vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration('envMask')) {
          this.refreshAllVisible();
        }
      })
    );
  }

  refresh(editor?: vscode.TextEditor): void {
    if (editor) {
      this.apply(editor);
      return;
    }
    this.refreshAllVisible();
  }

  private refreshAllVisible(): void {
    this.refreshEditors(vscode.window.visibleTextEditors);
  }

  private refreshEditors(editors: readonly vscode.TextEditor[]): void {
    for (const editor of editors) {
      this.apply(editor);
    }
  }

  private apply(editor: vscode.TextEditor): void {
    if (!isEnvDocument(editor.document)) {
      editor.setDecorations(this.maskDecorationType, []);
      editor.setDecorations(this.revealDecorationType, []);
      return;
    }

    const parsedLines = parseEnvTextDocument(editor.document);

    if (!this.isEnabled()) {
      editor.setDecorations(
        this.revealDecorationType,
        parsedLines.map((parsed) => ({ range: toRange(parsed.valueRange) }))
      );
      editor.setDecorations(this.maskDecorationType, []);
      return;
    }
    const maskText = this.maskText();
    const masked: vscode.DecorationOptions[] = [];
    const revealed: vscode.DecorationOptions[] = [];

    for (const parsed of parsedLines) {
      const range = toRange(parsed.valueRange);
      if (this.maskController.isHidden(editor.document.uri, parsed.lineNumber, parsed.key)) {
        masked.push({
          range,
          renderOptions: {
            before: {
              contentText: maskText,
              color: new vscode.ThemeColor('editor.foreground'),
              textDecoration: 'none',
            },
          },
        });
        continue;
      }

      revealed.push({ range });
    }

    editor.setDecorations(this.maskDecorationType, masked);
    editor.setDecorations(this.revealDecorationType, revealed);
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
    this.revealDecorationType.dispose();
    for (const disposable of this.disposables) {
      disposable.dispose();
    }
  }
}
