import * as vscode from 'vscode';
import * as _ from 'lodash';

// 目前支持的所有格式
enum Style {
	pascalCase = 'pascalCase',
	camelCase = 'camelCase',
	kebabCase = 'kebabCase',
	snakeCase = 'snakeCase',
}

// 用于编辑器根据位置修改文字
interface PartItem {
	range: vscode.Range;
	text: string;
}
// 用于匹配
interface RegPair {
	reg: RegExp,
	text: string
}

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "switch-filename" is now active!');

	let disposable = vscode.workspace.onDidRenameFiles(file => {
		const { files: [{ oldUri, newUri }] } = file;
		const oldName = getNameFromPath(oldUri.path);
		const newName = getNameFromPath(newUri.path);
		const config = vscode.workspace.getConfiguration('switch-filename');
		const { variableStyle: style } = config;
		if (style !== 'all' && !Object.values(Style).includes(style)) {
			vscode.window.showInformationMessage('Please make sure that the entered configuration is correct');
			return;
		}
		setTimeout(function () {
			try {
				let { activeTextEditor } = vscode.window;
				if (activeTextEditor) {
					let { document } = activeTextEditor;
					let container: PartItem[] = [];
					const { reg, regPair } = getRegInfoFromStr(oldName, newName, style);
					const n = document.lineCount;
					for (let i = 0; i < n; i++) {
						let lineText = document.lineAt(i);
						if (reg.test(lineText.text)) {
							container.push({
								range: lineText.range,
								text: replaceTextWithReg(lineText.text, regPair)
							});
						}
					}
					activeTextEditor.edit(edit => {
						let n = container.length;
						for (let i = 0; i < n; i++) {
							let { range, text } = container[i];
							edit.replace(range, text);
						}
						document.save();
						let tips = n ? `All variables switched successfully` : 'No matching variable found';
						vscode.window.showInformationMessage(tips);
					});
				}

			} catch (err) {
				vscode.window.showInformationMessage(err as string);
			}
		}, 200);
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }

const toVariableStyle = (str: string, style: Style | undefined) => {
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

const toAllStyle = (str: string) => {
	return Object.values(Style).map(item => {
		return toVariableStyle(str, item);
	});
};

const getRegInfoFromStr = (oldStr: string, newStr: string, style: Style | 'all') => {
	const oldVarList = style === 'all' ? toAllStyle(oldStr) : [toVariableStyle(oldStr, style)];
	const newVarList = style === 'all' ? toAllStyle(newStr) : [toVariableStyle(newStr, style)];

	const regText = oldVarList.reduce((prev, cur, index) => {
		prev += cur + (index !== oldVarList.length - 1 ? '|' : ')');
		return prev;
	}, '(');

	// 用于读
	const reg = new RegExp(regText, 'i');

	// 用于写
	const regPair: RegPair[] = oldVarList.map((item, index) => {
		return {
			reg: new RegExp(item, 'gi'),
			text: newVarList[index]
		};
	});

	return {
		reg,
		regPair
	};
};

const replaceTextWithReg = (str: string, regPair: RegPair[]) => {
	return regPair.reduce((prev, cur) => {
		return prev.replace(cur.reg, cur.text);
	}, str);
};

const getNameFromPath = (path: string) => {
	return path.replace(/(.*\/)*([^.]+).*/ig, "$2");
};