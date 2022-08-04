import { RequestType } from 'vscode-languageclient/node';
import { getClient } from '../client';
import { Range } from 'vscode';

export interface GetRunnablesParams {}

const request = new RequestType<GetRunnablesParams, Range[], void>(
  'sway/runnables'
);

export const getRunnables = async (): Promise<Range[]> => {
  const client = getClient();
  const params: GetRunnablesParams = {};
  const response = await client.sendRequest(request, params);
  return response ?? [];
};
