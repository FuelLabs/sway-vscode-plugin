import * as vscode from 'vscode';
import * as lc from 'vscode-languageclient';
import { toVSCodeRange, toVSCodeUri } from '../util/convert';

export default async function goToLocation({ uri, range }: lc.Location) {
  await vscode.window.showTextDocument(toVSCodeUri(uri), {
    selection: toVSCodeRange(range),
  });
}
