import { CancellationToken, LanguageClient, LanguageClientOptions, LSPErrorCodes, RequestType, ServerOptions } from 'vscode-languageclient/node';
import { log, sleep } from './util';

let client: LanguageClient | null;

export const createClient = (
    clientOptions: LanguageClientOptions,
    serverOptions: ServerOptions
  ): LanguageClient => {
    if (client) {
        throw new Error('Client already exists!');
    } 
    client = new LanguageClient(
        'sway-lsp',
        'Sway Language Server',
        serverOptions,
        clientOptions
    );
    return client;
  }  

export const getClient = (): LanguageClient => client;
