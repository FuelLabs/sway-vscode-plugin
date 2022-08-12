import { RequestType } from 'vscode-languageclient/node';
import { getClient } from '../client';
import { Range } from 'vscode';
import { log } from '../util';
import { ProgramType } from '../program';

interface GetRunnablesParams {}

export type Runnable = [Range, ProgramType];

const request = new RequestType<GetRunnablesParams, Runnable[], void>(
  'sway/runnables'
);

export const getRunnables = async (): Promise<Runnable[]> => {
  const client = getClient();
  const params: GetRunnablesParams = {};
  const response = await client.sendRequest(request, params);
  return response ?? [];
};
