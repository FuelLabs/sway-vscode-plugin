import { CodeActionRequest, RequestType, TextDocumentIdentifier } from "vscode-languageclient/node";
import { getClient } from "../client";
import { log } from "../util";

export interface FileTypeParams {
    // textDocument?: TextDocumentIdentifier;
    path: string;
}

export const fileType = new RequestType<FileTypeParams, string, void>(
    "sway/file_type"
);

export const getFileType = async (path: string) => {
    const client = getClient();

    const params: FileTypeParams = { path };

    const response = await client.sendRequest(fileType, params);

    log.info(`getFileType response! ${response}`);

    return response;
}
