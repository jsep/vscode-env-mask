import * as vscode from 'vscode';
import { registerCopyValue } from './commands/copyValue';
import { registerEditValue } from './commands/editValue';
import { registerShowHideValue } from './commands/showHideValue';
import { CopyFeedback } from './copyFeedback';
import { DecorationProvider } from './decorationProvider';
import { EnvCodeLensProvider } from './envCodeLensProvider';
import { isEnvDocument } from './envDocument';
import { MaskSelectionGuard } from './maskSelectionGuard';
import { MaskController } from './maskController';

export function activate(context: vscode.ExtensionContext): void {
  const maskController = new MaskController();
  const copyFeedback = new CopyFeedback();
  const decorationProvider = new DecorationProvider(maskController);
  const selectionGuard = new MaskSelectionGuard(maskController);
  const codeLensProvider = new EnvCodeLensProvider(maskController, copyFeedback);

  decorationProvider.refresh();

  context.subscriptions.push(
    decorationProvider,
    selectionGuard,
    copyFeedback,
    codeLensProvider,
    vscode.languages.registerCodeLensProvider({ language: 'dotenv', pattern: '**/.env*' }, codeLensProvider),
    vscode.workspace.onDidChangeTextDocument((event) => {
      if (isEnvDocument(event.document)) {
        codeLensProvider.refresh();
      }
    })
  );

  registerCopyValue(context, copyFeedback, codeLensProvider);
  registerShowHideValue(context, maskController, decorationProvider, codeLensProvider);
  registerEditValue(context);
}

export function deactivate(): void {}
