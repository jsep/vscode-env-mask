import * as vscode from 'vscode';
import { DecorationProvider } from '../decorationProvider';
import { EnvCodeLensProvider } from '../envCodeLensProvider';
import { MaskController } from '../maskController';
import { EnvKeyArgs, reviveEnvKeyArgs } from './envKeyArgs';

export function registerShowHideValue(
  context: vscode.ExtensionContext,
  maskController: MaskController,
  decorationProvider: DecorationProvider,
  codeLensProvider: EnvCodeLensProvider
): void {
  context.subscriptions.push(
    vscode.commands.registerCommand('envMask.showValue', (args: EnvKeyArgs) => {
      const { uri, line, key } = reviveEnvKeyArgs(args);
      maskController.reveal(uri, line, key);
      decorationProvider.refresh();
      codeLensProvider.refresh();
    }),
    vscode.commands.registerCommand('envMask.hideValue', (args: EnvKeyArgs) => {
      const { uri, line, key } = reviveEnvKeyArgs(args);
      maskController.hide(uri, line, key);
      decorationProvider.refresh();
      codeLensProvider.refresh();
    })
  );
}
