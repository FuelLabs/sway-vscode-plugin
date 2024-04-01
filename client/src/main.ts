import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { commands, ExtensionContext, window, workspace } from 'vscode';
import * as lc from 'vscode-languageclient/node';
import { createClient, getClient } from './client';
import { Config, EXTENSION_ROOT } from './config';
import { onEnter } from './interface/onEnter';
import { CommandPalettes } from './palettes';
import updateFuelCoreStatus from './status_bar/fuelCoreStatus';
import { log } from './util/util';

const LSP_EXECUTABLE_NAME = 'forc-lsp';

async function getSwayLspInstances(): Promise<string[]> {
  const paths = process.env.PATH?.split(path.delimiter) || [];
  const binaries: string[] = [];

  for (const p of paths) {
    try {
      const files = await fs.promises.readdir(p);
      files.forEach(file => {
        if (file === LSP_EXECUTABLE_NAME) {
          binaries.push(path.join(p, file));
        }
      });
    } catch (err) {
      // Ignore errors
    }
  }

  return binaries;
}

export async function activate(context: ExtensionContext) {
  const config = new Config(context);

  // Register all command palettes
  const commandPalettes = new CommandPalettes(config).get();
  context.subscriptions.push(
    ...commandPalettes.map(({ command, callback }) =>
      commands.registerCommand(command, callback)
    )
  );

  // Start a recurring task to keep fuel-core status updated
  setInterval(updateFuelCoreStatus, 1000);

  // Listen for did_change events for on_enter capabilities.
  workspace.onDidChangeTextDocument(
    async changeEvent => await onEnter(changeEvent)
  );

  try {
    const client = createClient(getClientOptions(), await getServerOptions());

    // Start the client. This will also launch the server
    await client.start();

    log.info('Client has connected to the Sway Language Server Successfully!');
  } catch (error) {
    log.error(error);
    log.error(
      'Unable to start the Sway Language Server. Please check the logs for more information.'
    );
  }
}

export function deactivate(): Thenable<void> | undefined {
  log.info('deactivating');
  const client = getClient();
  if (!client) {
    return undefined;
  }
  return client.stop();
}

function getLspPath() {
  const defaultExecutable = process.env.FUELUP_HOME
    ? `${process.env.FUELUP_HOME}/bin/${LSP_EXECUTABLE_NAME}`
    : LSP_EXECUTABLE_NAME;
  return workspace.getConfiguration().get('sway-lsp.path') ?? defaultExecutable;
}

async function getServerOptions(): Promise<lc.ServerOptions> {
  // Look for the executable in FUELUP_HOME if it exists, otherwise look for it in the PATH.
  let executable = getLspPath();

  // Check if the executable exists.
  try {
    log.info('Trying with executable:', executable);
    let version = await promisify(exec)(`${executable} --version`);
    log.info(`Server executable version: ${version.stdout.trim()}`);
  } catch (_) {
    try {
      executable = (await getSwayLspInstances())[0];
      log.warn('Trying with executable from $PATH:', executable);
      let version = await promisify(exec)(`${executable} --version`);
      log.info(`Server executable version: ${version.stdout.trim()}`);
    } catch (error) {
      window
        .showErrorMessage(
          'The Sway Language Server is not installed. Would you like to install it?',
          'Yes',
          'No'
        )
        .then(async selection => {
          if (selection === 'Yes') {
            window.showInformationMessage(
              'Follow the instructions in the terminal to install the Sway Language Server, then reload the window.'
            );
            commands.executeCommand('sway.installServer');
          }
        });
      throw Error(`Missing executable: ${LSP_EXECUTABLE_NAME}\
        \n\nYou may need to install the fuel toolchain or add ${process.env.HOME} /.fuelup / bin your path.Try running: \
        \n\ncurl--proto '=https' --tlsv1.2 - sSf https://install.fuel.network/fuelup-init.sh | sh\
        \n\nOr read about fuelup for more information: https://github.com/FuelLabs/fuelup\n`);
    }
  }

  // Get the full path to the server executable.
  const { stdout: executablePath } = await promisify(exec)(
    `which ${executable}`
  );
  const command = executablePath.trim();
  log.info(`Using server executable: ${command}`);

  const serverExecutable: lc.Executable = {
    command,
    options: {
      shell: true,
    },
  };

  return {
    run: serverExecutable,
    debug: serverExecutable,
    transport: lc.TransportKind.stdio,
  };
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
    initializationOptions: workspace.getConfiguration(EXTENSION_ROOT),
    markdown: {
      isTrusted: true,
      supportHtml: true,
    },
  };

  return clientOptions;
}
