import * as vscode from "vscode";
import { DecorationProvider } from "../decorationProvider";
import { EnvCodeLensProvider } from "../envCodeLensProvider";
import {
  findEditorForUri,
  findOpenDocument,
  findParsedLine,
} from "../envDocument";
import { encodeEnvValue, TextRange } from "../envParser";
import { EnvKeyArgs, reviveEnvKeyArgs } from "./envKeyArgs";

export function registerEditValue(
  context: vscode.ExtensionContext,
  decorationProvider: DecorationProvider,
  codeLensProvider: EnvCodeLensProvider,
): void {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "envMask.editValue",
      async (args: EnvKeyArgs) => {
        const { uri, line, key } = reviveEnvKeyArgs(args);
        let document = findOpenDocument(uri);
        if (!document) {
          document = await vscode.workspace.openTextDocument(uri);
          await vscode.window.showTextDocument(document);
        }

        const parsed = findParsedLine(document, line, key);
        if (!parsed) {
          return;
        }

        const next = await vscode.window.showInputBox({
          value: parsed.decodedValue,
          prompt: `Edit ${key}`,
          placeHolder: key,
          password: true,
        });

        if (next === undefined) {
          return;
        }

        const edit = new vscode.WorkspaceEdit();
        edit.replace(
          uri,
          toRange(parsed.valueRange),
          encodeEnvValue(next, parsed.quoteStyle),
        );
        const applied = await vscode.workspace.applyEdit(edit);
        if (!applied) {
          return;
        }

        codeLensProvider.refresh();
        const editor = findEditorForUri(uri);
        if (editor) {
          queueMicrotask(() => decorationProvider.refresh(editor));
        }
      },
    ),
  );
}

function toRange(range: TextRange): vscode.Range {
  return new vscode.Range(
    range.startLine,
    range.startCharacter,
    range.endLine,
    range.endCharacter,
  );
}
