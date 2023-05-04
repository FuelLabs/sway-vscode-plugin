import * as vscode from 'vscode';
import * as lc from 'vscode-languageclient';
import { toVSCodeLocation } from '../util/convert';

export interface PeekLocationsParams {
  locations: lc.Location[];
}

export default async function peekLocations({
  locations,
}: PeekLocationsParams) {
  const uri = vscode.window.activeTextEditor.document.uri;
  const position = vscode.window.activeTextEditor.selection.active;
  vscode.commands.executeCommand(
    'editor.action.peekLocations',
    uri,
    position,
    locations.map(toVSCodeLocation),
    'peek'
  );
}
