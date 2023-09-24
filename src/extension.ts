// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as net from 'net';
import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	StreamInfo,
	TransportKind
} from 'vscode-languageclient/node';


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const connectionInfo ={
		port:7998,
		host:"127.0.0.1"
	};
	const serverOptions =() =>{
        //const socket = WebSocket.createWebSocketStream(ws);
		const socket = net.connect(connectionInfo);
		const result:StreamInfo={
			writer:socket,
			reader:socket
		};
		return Promise.resolve(result);
	};
	const clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: [{ scheme: 'file', language: 'plaintext' }],
		synchronize: {
			// Notify the server about file changes to '.clientrc files contained in the workspace
			fileEvents: vscode.workspace.createFileSystemWatcher('**/.clientrc')
		}
	};

	const client = new LanguageClient(
		'languageServerExample',
		'Language Server Example',
		serverOptions,
		clientOptions
	);
	client.start();
}

// This method is called when your extension is deactivated
export function deactivate() {}
