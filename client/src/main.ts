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

  const client = createClient(
    getClientOptions(),
    getServerOptions(context, config)
  );

  // Start the client. This will also launch the server
  client.start();

  client.onReady().then(_ => {
    log.info('Client has Connected to the Sway Language Server Successfully!');
  });
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
  let args = ['lsp'];
  const debug_tokens = config.debug.showCollectedTokensAsWarnings;
  if (debug_tokens !== 'off') {
    args.push(` --collected-tokens-as-warnings ${debug_tokens}`);
  }

  const serverExecutable: lc.Executable = {
    command: 'forc',
    args,
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
    initializationOptions: {
      ...getSwayConfigOptions(),
    },
  };

  return clientOptions;
}

function getSwayConfigOptions(): SwayConfig {
  const swayOptions = getSwayFormattingOptions();

  const defaultSwayConfig: SwayConfig = {
    alignFields: true,
    tabSize: 4,
  };

  if (swayOptions) {
    const swayFormatOptions = getSwayFormattingOptions().format;
    if (swayFormatOptions) {
      return {
        alignFields: swayFormatOptions.hasOwnProperty('alignFields')
          ? swayFormatOptions.alignFields
          : defaultSwayConfig.alignFields,
        tabSize: swayFormatOptions.hasOwnProperty('tabSize')
          ? swayFormatOptions.tabSize
          : defaultSwayConfig.tabSize,
      };
    } else {
      return defaultSwayConfig;
    }
  } else {
    return defaultSwayConfig;
  }
}

function getSwayFormattingOptions(): WorkspaceConfiguration | null {
  const swayOptions = workspace.getConfiguration('sway');
  const swayOptionsBracket = workspace.getConfiguration('[sway]');

  if (swayOptions && swayOptions.format) {
    if (swayOptionsBracket && swayOptionsBracket.format) {
      return Object.assign({}, swayOptions, swayOptionsBracket);
    }
    return swayOptions;
  } else if (swayOptionsBracket && swayOptionsBracket.format) {
    return swayOptionsBracket;
  } else {
    return null;
  }
}

type SwayConfig = {
  alignFields: boolean;
  tabSize: number;
};
