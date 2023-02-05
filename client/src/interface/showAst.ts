import {
  DocumentUri,
  RequestType,
  TextDocumentIdentifier,
} from 'vscode-languageclient/node';
import { getClient } from '../client';

export type AstKind = 'lexed' | 'parsed' | 'typed';

interface ShowAstParams {
  textDocument: TextDocumentIdentifier;
  astKind: AstKind;
  savePath: DocumentUri;
}

const request = new RequestType<
  ShowAstParams,
  TextDocumentIdentifier | null,
  void
>('sway/show_ast');

export const showAst = async (
  filePath: string,
  astKind: AstKind,
  savePath: string,
): Promise<TextDocumentIdentifier | null> => {
  const client = getClient();
  const params: ShowAstParams = {
    textDocument: {
      uri: filePath,
    },
    astKind,
    savePath,
  };
  return await client.sendRequest(request, params);
};
