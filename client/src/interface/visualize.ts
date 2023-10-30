import {
  DocumentUri,
  RequestType,
  TextDocumentIdentifier,
} from 'vscode-languageclient/node';
import { getClient } from '../client';

export type GraphKind = 'build_plan';

interface VisualizeParams {
  textDocument: TextDocumentIdentifier;
  graphKind: GraphKind;
}

const request = new RequestType<
  VisualizeParams,
  string | null, 
  void
>('sway/visualize');

export const visualize = async (
  filePath: string,
  graphKind: GraphKind,
): Promise<string | null> => {
  const client = getClient();
  const params: VisualizeParams = {
    textDocument: {
      uri: filePath,
    },
    graphKind,
  };
  return await client.sendRequest(request, params);
};
