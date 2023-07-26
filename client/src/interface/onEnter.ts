import { Range, TextDocumentChangeEvent, window } from 'vscode';
import {
  RequestType,
  TextDocumentContentChangeEvent,
  TextDocumentEdit,
  TextDocumentIdentifier,
  WorkspaceEdit,
} from 'vscode-languageclient/node';
import { getClient } from '../client';
import { ProgramType } from '../program';
import { toVSCodeRange } from '../util/convert';
import { addFilePrefix } from '../util/util';

interface OnEnterParams {
  textDocument: TextDocumentIdentifier;
  contentChanges: TextDocumentContentChangeEvent[];
}

export type Runnable = [Range, ProgramType];

const request = new RequestType<OnEnterParams, WorkspaceEdit | null, void>(
  'sway/on_enter'
);

export const onEnter = async (changeEvent: TextDocumentChangeEvent) => {
  if (
    changeEvent.document.uri.scheme === 'file' &&
    changeEvent.contentChanges.length === 1 &&
    changeEvent.contentChanges[0].text.includes('\n')
  ) {
    const client = getClient();
    const params: OnEnterParams = {
      textDocument: {
        uri: addFilePrefix(changeEvent.document.uri.fsPath),
      },
      contentChanges: [...changeEvent.contentChanges],
    };
    const response = await client.sendRequest(request, params);
    if (!!response) {
      window.activeTextEditor.edit(editBuilder => {
        response.documentChanges?.forEach((change: TextDocumentEdit) => {
          change.edits.forEach(edit => {
            editBuilder.replace(toVSCodeRange(edit.range), edit.newText);
          });
        });
      });
    }
  }
};
