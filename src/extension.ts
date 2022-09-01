import * as vscode from 'vscode';
import * as _ from 'lodash';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "switch-filename" is now active!');

	let disposable = vscode.workspace.onDidRenameFiles(file => {
		const { files: [{ oldUri, newUri }] } = file;
		const oldName = getNameFromPath(oldUri.path);
		const newName = getNameFromPath(newUri.path);

		const config = vscode.workspace.getConfiguration('switch-filename');
		const { variableStyle: style } = config;

		const oldVar = toVariableStyle(oldName, style);
		const newVar = toVariableStyle(newName, style);
		setTimeout(function () {
			try {
				let { activeTextEditor } = vscode.window;
				if (activeTextEditor) {
					let { document } = activeTextEditor;
					const n = document.lineCount;
					const reg = new RegExp(oldVar, 'g');
					const pp = new RegExp(oldVar);
					for (let i = 0; i < n; i++) {
						let lineText = document.lineAt(i);

						if (pp.test(lineText.text)) {
							// setTimeout(function () {
							let newText = lineText.text.replace(reg, newVar);
							activeTextEditor?.edit((edit) => {
								edit.replace(lineText.range, newText);
							});
							document.save();
							// }, 200);
						}
					}
				}

			} catch (err) {
				console.log(err);
			}
			vscode.window.showInformationMessage(`All variables '${oldVar}' will be switched to '${newVar}'`);
		}, 200);

	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }

const enum Style {
	pascalCase = 'pascalCase',
	camelCase = 'camelCase',
	kebabCase = 'kebabCase',
	snakeCase = 'snakeCase'
}

const toVariableStyle = (str: string, style: Style) => {
	switch (style) {
		case Style.camelCase:
			return _.camelCase(str);
		case Style.kebabCase:
			return _.kebabCase(str);
		case Style.snakeCase:
			return _.snakeCase(str);
		case Style.pascalCase:
			return _.upperFirst(_.camelCase(str));
		default:
			return str;
	}
};

const getNameFromPath = (path: string) => {
	return path.replace(/(.*\/)*([^.]+).*/ig, "$2");
};