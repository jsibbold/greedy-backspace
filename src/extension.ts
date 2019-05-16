// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('Greedy Backspace', () => {
		const win = vscode.window;
		let editor = vscode.window.activeTextEditor;

		if (!editor) {
			return;
		}

		let document = editor.document;
		let selections = editor.selections;

		const selection = selections[0];
		const startLine = document.lineAt(selection.start);
		const startPosition = selection.start;

		if (selection.isEmpty) {
			var currentLineNum = startPosition.line;
			var currentLine = startLine;

			if (!currentLine.isEmptyOrWhitespace) {
				var leftText = currentLine.text.substring(0, startPosition.character);
				
				if (leftText.length > 0) {
					var trimmedLeftText = leftText.trimRight();
					if (trimmedLeftText.length == 0) {
						currentLineNum--;
						currentLine = document.lineAt(currentLineNum);
					} else if (trimmedLeftText.length < leftText.length) {
						var offset = leftText.length - trimmedLeftText.length;
						const edit = new vscode.WorkspaceEdit();
						edit.delete(document.uri, new vscode.Range(new vscode.Position(currentLineNum, startPosition.character - offset), startPosition));
						vscode.workspace.applyEdit(edit);
					} else {
						return vscode.commands.executeCommand('deleteLeft');
					}
				} else {
					currentLineNum--;
					currentLine = document.lineAt(currentLineNum);
				}
			}

			while (currentLineNum > 0 && currentLine.isEmptyOrWhitespace) {
				currentLineNum--;
				currentLine = document.lineAt(currentLineNum);
			}


			var linePos = 0;
			if (!currentLine.isEmptyOrWhitespace) {
				linePos = currentLine.text.trimRight().length;
			}
			
			let endPosition = new vscode.Position(currentLineNum, linePos);

			const edit = new vscode.WorkspaceEdit();
			edit.delete(document.uri, new vscode.Range(endPosition, startPosition));
			vscode.workspace.applyEdit(edit);
		} else {
			return vscode.commands.executeCommand('deleteLeft');
		}
		});

		context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
