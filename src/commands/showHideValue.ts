import * as vscode from 'vscode';
import { DecorationProvider } from '../decorationProvider';
import { EnvCodeLensProvider } from '../envCodeLensProvider';
import { findEditorForUri } from '../envDocument';
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
      applyShowHide(args, true, maskController, decorationProvider, codeLensProvider);
    }),
    vscode.commands.registerCommand('envMask.hideValue', (args: EnvKeyArgs) => {
      applyShowHide(args, false, maskController, decorationProvider, codeLensProvider);
    })
  );
}

function applyShowHide(
  args: EnvKeyArgs,
  reveal: boolean,
  maskController: MaskController,
  decorationProvider: DecorationProvider,
  codeLensProvider: EnvCodeLensProvider
): void {
  const { uri, line, key } = reviveEnvKeyArgs(args);
  if (reveal) {
    maskController.reveal(uri, line, key);
  } else {
    maskController.hide(uri, line, key);
  }

  codeLensProvider.refresh();

  const editor = findEditorForUri(uri);
  if (editor) {
    queueMicrotask(() => decorationProvider.refresh(editor));
  }
}
