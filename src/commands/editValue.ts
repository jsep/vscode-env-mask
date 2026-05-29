import * as vscode from 'vscode';

export function registerEditValue(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand('envMask.editValue', async () => {
      // Slice 3
    })
  );
}
