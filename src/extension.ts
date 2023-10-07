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


function newClient() {
	const connectionInfo = {
		port: 8089,
		host: "127.0.0.1"
	};
	const serverOptions = () => {
		//const socket = WebSocket.createWebSocketStream(ws);
		const socket = net.connect(connectionInfo);
		const result: StreamInfo = {
			writer: socket,
			reader: socket
		};
		return Promise.resolve(result);
	};
	const clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: [{ scheme: 'file', language: 'markdown' }],
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
	return client;

}


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const client = newClient();
	const createApiCommand = vscode.commands.registerCommand(
		'extension.createapi',
		() => {
			const editor = vscode.window.activeTextEditor;
			if (editor) {
				const selectedText = editor.document.getText(editor.selection);
				// 将选中的文本发送给语言服务器
				client.sendRequest('custom/modifyText', { text: selectedText }).then((modifiedText: any) => {
					if (modifiedText) {
						// 如果语言服务器返回了修改后的文本，将其替换当前选中的文本
						editor.edit((editBuilder) => {
							editBuilder.replace(editor.selection, modifiedText);
						});
					}
				});
			}
		}
	);
	// 注册到监听队列中
	context.subscriptions.push(createApiCommand);
}

// This method is called when your extension is deactivated
export function deactivate() { }
