import { RequestType, TextDocumentIdentifier } from "vscode-languageclient/node";
import { getClient } from "../client";
import { log } from "../util";
import { Range } from 'vscode';

export interface GetRunnablesParams {
    path: string;
}

const request = new RequestType<GetRunnablesParams, Range[], void>(
    "sway/get_runnables"
);

export const getRunnables = async (path: string): Promise<Range[]> => {
    const client = getClient();
    const params: GetRunnablesParams = { path };
    const response = await client.sendRequest(request, params);

    log.info(`getRunnables response! ${response}`);
    return response;
}