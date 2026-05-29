import * as vscode from 'vscode';
import { DecorationProvider } from './decorationProvider';
import { MaskController } from './maskController';
import { MaskSelectionGuard } from './maskSelectionGuard';

export function activate(context: vscode.ExtensionContext): void {
  const maskController = new MaskController();
  const decorationProvider = new DecorationProvider(maskController);
  const selectionGuard = new MaskSelectionGuard(maskController);

  decorationProvider.refresh();
  context.subscriptions.push(decorationProvider, selectionGuard);
}

export function deactivate(): void {}
