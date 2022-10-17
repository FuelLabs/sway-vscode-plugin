import * as lc from 'vscode-languageclient/node';
import { Config } from './config';
import { log } from './util';
import { CommandPalettes } from './palettes';
import { Program, Function, ProgramProvider } from './program';
import * as path from 'path';
import forcRun from './commands/forcRun';

import { createClient, getClient } from './client';
import { SwayCodeLensProvider } from './code_lens/provider';
import {
  commands,
  DocumentSelector,
  ExtensionContext,
  ExtensionMode,
  languages,
  window,
  workspace,
  WorkspaceConfiguration,
} from 'vscode';
import updateFuelCoreStatus from './status_bar/fuelCoreStatus';

export function activate(context: ExtensionContext) {
  const config = new Config(context);

  // Register code lenses
  let documentSelector: DocumentSelector = {
    language: 'sway',
    scheme: 'file',
  };
  let swayCodeLensProviderDisposable = languages.registerCodeLensProvider(
    documentSelector,
    new SwayCodeLensProvider()
  );
  context.subscriptions.push(swayCodeLensProviderDisposable);

  // Register tree views
  const rootPath =
    workspace.workspaceFolders && workspace.workspaceFolders.length > 0
      ? workspace.workspaceFolders[0].uri.fsPath
      : undefined;
  const contractProvider = window.registerTreeDataProvider(
    'contracts',
    new ProgramProvider(rootPath, 'contract')
  );
  window.registerTreeDataProvider(
    'scripts',
    new ProgramProvider(rootPath, 'script')
  );
  window.registerTreeDataProvider(
    'predicates',
    new ProgramProvider(rootPath, 'predicate')
  );
  commands.registerCommand(
    'programs.refreshEntry',
    (provider: ProgramProvider) => provider.refresh()
  );
  commands.registerCommand('programs.editEntry', (contract: Program) =>
    workspace.openTextDocument(contract.sourceFilePath).then(doc => {
      window.showTextDocument(doc);
    })
  );
  commands.registerCommand('programs.run', (runnableFunction: Function) => {
    window.showInformationMessage(`Running ${runnableFunction.label}`);
    const forcDir = path.parse(runnableFunction.sourceFilePath).dir;
    forcRun(forcDir);
  });

  // Register all command palettes
  const commandPalettes = new CommandPalettes(config).get();
  context.subscriptions.push(
    ...commandPalettes.map(({ command, callback }) =>
      commands.registerCommand(command, callback)
    )
  );

  // Start a recurring task to keep fuel-core status updated
  setInterval(updateFuelCoreStatus, 1000);

  const client = createClient(
    getClientOptions(),
    getServerOptions(context, config)
  );

  // Start the client. This will also launch the server
  client.start();

  log.info('Client has Connected to the Sway Language Server Successfully!');
}

export function deactivate(): Thenable<void> | undefined {
  const client = getClient();
  if (!client) {
    return undefined;
  }
  return client.stop();
}

function getServerOptions(
  context: ExtensionContext,
  config: Config
): lc.ServerOptions {
  const serverExecutable: lc.Executable = {
    command: 'forc',
    args: ['lsp'],
    options: {
      shell: true,
    },
  };

  const devServerOptions: lc.ServerOptions = {
    run: serverExecutable,
    debug: serverExecutable,
    transport: lc.TransportKind.stdio,
  };

  switch (context.extensionMode) {
    case ExtensionMode.Development:
    case ExtensionMode.Test:
      return devServerOptions;

    default:
      // TODO: for production we need to be able to install the Language Server
      return devServerOptions;
  }
}

function getClientOptions(): lc.LanguageClientOptions {
  // Options to control the language client
  const clientOptions: lc.LanguageClientOptions = {
    // Register the server for plain text documents
    documentSelector: [
      { scheme: 'file', language: 'sway' },
      { scheme: 'untitled', language: 'sway' },
    ],
    synchronize: {
      // Notify the server about file changes to *.sw files contained in the workspace
      fileEvents: [
        workspace.createFileSystemWatcher('**/.sw'),
        workspace.createFileSystemWatcher('**/*.sw'),
      ],
    },
    initializationOptions: workspace.getConfiguration('sway-lsp'),
  };

  return clientOptions;
}
