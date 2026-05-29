import * as vscode from 'vscode';
import { CopyFeedback } from '../copyFeedback';
import { EnvCodeLensProvider } from '../envCodeLensProvider';
import { getDecodedValue } from '../envDocument';
import { EnvKeyArgs, reviveEnvKeyArgs } from './envKeyArgs';

export function registerCopyValue(
  context: vscode.ExtensionContext,
  copyFeedback: CopyFeedback,
  codeLensProvider: EnvCodeLensProvider
): void {
  context.subscriptions.push(
    vscode.commands.registerCommand('envMask.copyValue', async (args: EnvKeyArgs) => {
      const { uri, line, key } = reviveEnvKeyArgs(args);
      const document = await vscode.workspace.openTextDocument(uri);
      const value = getDecodedValue(document, line, key);
      if (value === undefined) {
        return;
      }
      await vscode.env.clipboard.writeText(value);
      copyFeedback.markCopied(uri.toString(), line, key, () => codeLensProvider.refresh());
    })
  );
}
