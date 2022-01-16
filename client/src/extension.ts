import { workspace, ExtensionContext, ExtensionMode, WorkspaceConfiguration } from 'vscode'

import {
	Executable,
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient/node'

let client: LanguageClient

export function activate(context: ExtensionContext) {
	client = new LanguageClient(
		'forc',
		'Sway',
		getServerOptions(context),
		getClientOptions()
	)

	// Start the client. This will also launch the server
	console.log("Starting Client and Server")
	client.start()

	client.onReady().then(_ => {
		console.log("Client has Connected to the Server successfully!")
	})
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined
	}
	return client.stop()
}


function getServerOptions(context: ExtensionContext): ServerOptions {
	const serverExecutable: Executable = {
		command: 'forc',
		args: ['lsp'],
		options: {
			shell: true,
		}
	}

	const devServerOptions: ServerOptions = {
		run: serverExecutable,
		debug: serverExecutable,
		transport: TransportKind.stdio,
	}

	switch (context.extensionMode) {
		case ExtensionMode.Development:
		case ExtensionMode.Test:
			return devServerOptions

		default:
			// TODO: for production we need to be able to install the Language Server
			return devServerOptions
	}
}

function getClientOptions(): LanguageClientOptions {
	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: [
			{ scheme: 'file', language: 'sway' },
			{ scheme: 'untitled', language: 'sway' },
		],
		synchronize: {
			// Notify the server about file changes to *.sw files contained in the workspace
			fileEvents: [
				workspace.createFileSystemWatcher('**/.sw'),
				workspace.createFileSystemWatcher("**/*.sw"),
			]
		},
		initializationOptions: {
			...getSwayConfigOptions()
		}
	}

	return clientOptions
}

function getSwayConfigOptions(): SwayConfig {
	const swayFormatOptions = getSwayFormattingOptions().format;

	const defaultSwayConfig: SwayConfig = {
		alignFields: true,
		tabSize: 4
	};

	if (swayFormatOptions) {
		return {
			alignFields: swayFormatOptions.hasOwnProperty('alignFields') ? swayFormatOptions.alignFields : defaultSwayConfig.alignFields,
			tabSize: swayFormatOptions.hasOwnProperty('tabSize') ? swayFormatOptions.tabSize : defaultSwayConfig.tabSize,
		}
	} else {
		return defaultSwayConfig
	}

}

function getSwayFormattingOptions(): WorkspaceConfiguration | null {
	const swayOptions = workspace.getConfiguration("sway");
	const swayOptionsBracket = workspace.getConfiguration("[sway]");

	if (swayOptions && swayOptions.format) {
		if (swayOptionsBracket && swayOptionsBracket.format) {
			return Object.assign({}, swayOptions, swayOptionsBracket);
		}
		return swayOptions
	} else if (swayOptionsBracket && swayOptionsBracket.format) {
		return swayOptionsBracket
	} else {
		return null
	}
}

type SwayConfig = {
	alignFields: boolean,
	tabSize: number,
}