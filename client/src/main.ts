import { exec } from 'child_process';
import { promisify } from 'util';
import { commands, ExtensionContext, window, workspace } from 'vscode';
import * as lc from 'vscode-languageclient/node';
import { createClient, getClient } from './client';
import { Config, EXTENSION_ROOT as EXTENSION_ROOT } from './config';
import { onEnter } from './interface/onEnter';
import { CommandPalettes } from './palettes';
import updateFuelCoreStatus from './status_bar/fuelCoreStatus';
import { log } from './util/util';

const LSP_EXECUTABLE_NAME = 'forc-lsp';

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

  if (config.disableLsp) {
    log.info('Sway Language Server is disabled. Exiting...');
    return;
  }

  // Listen for did_change events for on_enter capabilities.
  workspace.onDidChangeTextDocument(
    async changeEvent => await onEnter(changeEvent)
  );

  try {
    const client = createClient(
      getClientOptions(),
      await getServerOptions(config)
    );

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
  const client = getClient();
  if (!client) {
    return undefined;
  }
  return client.stop();
}

async function getServerOptions(config: Config): Promise<lc.ServerOptions> {
  // Look for the default executable in FUELUP_HOME if it exists, otherwise look for it in the PATH.
  const defaultExecutable = process.env.FUELUP_HOME
    ? `${process.env.FUELUP_HOME}/bin/${LSP_EXECUTABLE_NAME}`
    : LSP_EXECUTABLE_NAME;

  // Use the settings override path if provided, otherwise use the default executable.
  const settingsExecutable = config.binPath;
  const executable = settingsExecutable || defaultExecutable;

  // Check if the executable exists.
  try {
    let version = await promisify(exec)(`${executable} --version`);
    log.info(`Server executable version: ${version.stdout.trim()}`);
  } catch (error) {
    if (!!settingsExecutable) {
      const updateMessage =
        'Update the setting "sway-lsp.diagnostic.binPath" either to a valid path to a forc-lsp executable, or leave it empty to use the executable to which your $PATH resolves.';
      window
        .showErrorMessage(
          'The Sway Language Server is not installed at the path defined in your Extension Settings.',
          'Edit Setting',
          'Later'
        )
        .then(async selection => {
          if (selection === 'Edit Setting') {
            window.showInformationMessage(updateMessage);
            commands.executeCommand(
              'workbench.action.openWorkspaceSettings',
              'sway-lsp.diagnostic.binPath'
            );
          }
        });
      throw Error(`Missing executable: ${LSP_EXECUTABLE_NAME}\
        \n\nThe VSCode setting "sway-lsp.diagnostic.binPath" is set to an invalid path: "${settingsExecutable}"
        \n${updateMessage}`);
    } else {
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
        \n\nYou may need to install the fuel toolchain or add ${process.env.HOME}/.fuelup/bin your path. Try running:\
        \n\ncurl --proto '=https' --tlsv1.2 -sSf https://install.fuel.network/fuelup-init.sh | sh\
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
