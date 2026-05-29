import * as vscode from 'vscode';

export interface EnvKeyArgs {
  uri: vscode.Uri;
  line: number;
  key: string;
}

export function reviveEnvKeyArgs(args: EnvKeyArgs): EnvKeyArgs {
  return {
    uri: args.uri instanceof vscode.Uri ? args.uri : vscode.Uri.parse(String(args.uri)),
    line: args.line,
    key: args.key,
  };
}
