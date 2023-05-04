import * as vscode from 'vscode';
import * as lc from 'vscode-languageclient';

export function toVSCodePosition(position: lc.Position): vscode.Position {
  return new vscode.Position(position.line, position.character);
}

export function toVSCodeRange(range: lc.Range): vscode.Range {
  return new vscode.Range(
    toVSCodePosition(range.start),
    toVSCodePosition(range.end)
  );
}

export function toVSCodeUri(uri: lc.DocumentUri): vscode.Uri {
  return vscode.Uri.parse(uri);
}

export function toVSCodeLocation(location: lc.Location): vscode.Location {
  return new vscode.Location(
    toVSCodeUri(location.uri),
    toVSCodeRange(location.range)
  );
}

export function toLSPPosition(position: vscode.Position): lc.Position {
  return lc.Position.create(position.line, position.character);
}

export function toLSPRange(range: vscode.Range): lc.Range {
  return lc.Range.create(toLSPPosition(range.start), toLSPPosition(range.end));
}

export function toLSPUri(uri: vscode.Uri): lc.DocumentUri {
  return uri.toString();
}

export function toLSPLocation(location: vscode.Location): lc.Location {
  return lc.Location.create(toLSPUri(location.uri), toLSPRange(location.range));
}
