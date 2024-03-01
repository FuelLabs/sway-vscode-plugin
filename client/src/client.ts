import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
} from 'vscode-languageclient/node';
import { EXTENSION_ROOT } from './config';

let client: LanguageClient | null;

export const createClient = (
  clientOptions: LanguageClientOptions,
  serverOptions: ServerOptions
): LanguageClient => {
  if (client) {
    throw new Error('Client already exists!');
  }
  console.log('somethingj')
  client = new LanguageClient(
    EXTENSION_ROOT,
    'Sway Language Server',
    serverOptions,
    clientOptions
  );
  return client;
};

export const getClient = (): LanguageClient => client;
