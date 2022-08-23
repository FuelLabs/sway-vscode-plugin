import {
  RequestType,
  TextDocumentIdentifier,
} from 'vscode-languageclient/node';
import { getClient } from '../client';
import { Range } from 'vscode';
import { log } from '../util';

export type AstKind = 'parsed' | 'typed';

interface ShowAstParams {
  textDocument: TextDocumentIdentifier;
  astKind: AstKind;
}

const request = new RequestType<
  ShowAstParams,
  TextDocumentIdentifier | null,
  void
>('sway/show_ast');

export const showAst = async (
  filePath: string,
  astKind: AstKind
): Promise<TextDocumentIdentifier | null> => {
  const client = getClient();
  const params: ShowAstParams = {
    textDocument: {
      uri: filePath,
    },
    astKind,
  };
  return await client.sendRequest(request, params);
};
