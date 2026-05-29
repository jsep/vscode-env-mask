import * as vscode from 'vscode';
import { CopyFeedback } from '../copyFeedback';
import { EnvCodeLensProvider } from '../envCodeLensProvider';
import { findOpenDocument, getDecodedValue } from '../envDocument';
import { EnvKeyArgs, reviveEnvKeyArgs } from './envKeyArgs';

export function registerCopyValue(
  context: vscode.ExtensionContext,
  copyFeedback: CopyFeedback,
  codeLensProvider: EnvCodeLensProvider
): void {
  context.subscriptions.push(
    vscode.commands.registerCommand('envMask.copyValue', (args: EnvKeyArgs) => {
      const { uri, line, key } = reviveEnvKeyArgs(args);
      const document = findOpenDocument(uri);
      if (!document) {
        void copyFromClosedDocument(args, copyFeedback, codeLensProvider);
        return;
      }

      const value = getDecodedValue(document, line, key);
      if (value === undefined) {
        return;
      }

      copyFeedback.markCopied(uri.toString(), line, key, () => codeLensProvider.refresh());
      void vscode.env.clipboard.writeText(value);
    })
  );
}

async function copyFromClosedDocument(
  args: EnvKeyArgs,
  copyFeedback: CopyFeedback,
  codeLensProvider: EnvCodeLensProvider
): Promise<void> {
  const { uri, line, key } = reviveEnvKeyArgs(args);
  const document = await vscode.workspace.openTextDocument(uri);
  const value = getDecodedValue(document, line, key);
  if (value === undefined) {
    return;
  }

  copyFeedback.markCopied(uri.toString(), line, key, () => codeLensProvider.refresh());
  await vscode.env.clipboard.writeText(value);
}
