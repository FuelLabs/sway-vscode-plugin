import * as vscode from 'vscode';
import * as lc from 'vscode-languageclient/node';
import { Config } from './config';
import { log } from './util';
import { CommandPalettes } from './palettes';
import { Contract, ContractProvider } from './contract';

let client: lc.LanguageClient;

export function activate(context: vscode.ExtensionContext) {
  const config = new Config(context);

  // Register tree views
  const rootPath = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
  ? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;
  const contractFunctionProvider = new ContractProvider(rootPath);
	vscode.window.registerTreeDataProvider('contracts', contractFunctionProvider);
	vscode.commands.registerCommand('contracts.refreshEntry', () => contractFunctionProvider.refresh());
  vscode.commands.registerCommand('contracts.editEntry', (node: Contract) => vscode.window.showInformationMessage(`Successfully called edit entry on ${node.label}.`));



  // Register all command palettes
  const commandPalettes = new CommandPalettes(config).get();
  context.subscriptions.push(
    ...commandPalettes.map(({ command, callback }) =>
      vscode.commands.registerCommand(command, callback)
    )
  );

  client = new lc.LanguageClient(
    'sway-lsp',
    'Sway Language Server',
    getServerOptions(context, config),
    getClientOptions()
  );

  // Start the client. This will also launch the server
  client.start();

  client.onReady().then(_ => {
    log.info('Client has Connected to the Sway Language Server Successfully!');
  });
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}

function getServerOptions(
  context: vscode.ExtensionContext,
  config: Config
): lc.ServerOptions {
  let args = ['lsp'];
  if (config.debug.showParsedTokensAsWarnings) {
    args.push(' --parsed-tokens-as-warnings');
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
    case vscode.ExtensionMode.Development:
    case vscode.ExtensionMode.Test:
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
        vscode.workspace.createFileSystemWatcher('**/.sw'),
        vscode.workspace.createFileSystemWatcher('**/*.sw'),
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

function getSwayFormattingOptions(): vscode.WorkspaceConfiguration | null {
  const swayOptions = vscode.workspace.getConfiguration('sway');
  const swayOptionsBracket = vscode.workspace.getConfiguration('[sway]');

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
