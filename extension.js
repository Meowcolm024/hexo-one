// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "hexo-one" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let pushHexo = vscode.commands.registerCommand('hexo-one.pushHexo', function () {
		let terminal = vscode.window.createTerminal("Deploy Hexo");
		terminal.sendText('hexo clean && hexo g && hexo d');
		terminal.show();
		vscode.window.showInformationMessage('Deploying Hexo, please wait...');
	});

	// generate new post
	let newPost = vscode.commands.registerCommand('hexo-one.newPost', function () {
		vscode.window.showQuickPick(
				[
					"post",
					"draft",
					"page"
				], {
					canPickMany: false,
					ignoreFocusOut: true,
					matchOnDescription: true,
					matchOnDetail: true,
					placeHolder: 'Select the type of the post you want to create'
				})
			.then(function (msg) {
				createPost(msg);
				console.log(msg);
			})
	});

	// publish draft
	let publishDraft = vscode.commands.registerCommand('hexo-one.publishDraft', function() {
		const options = {
			ignoreFocusOut: true,
			password: false,
			prompt: "Please type the title of your draft"
		};
		vscode.window.showInputBox(options).then((value) => {
			if (value === undefined || value.trim() === '') {
				vscode.window.showInformationMessage('Please type the title of your draft');
			} else {
				const title = value.trim();
				const cmd = "hexo publish \"" + title + "\""
				runCmd(cmd);
				vscode.window.showInformationMessage('Publishing draft: \"' + title + '\" please wait.');
			}});
	});

	// other functions
	let hexoPrompt = vscode.commands.registerCommand('hexo-one.hexoPrompt', function () {
		vscode.window.showQuickPick(
				[
					"hexo clean",
					"hexo generate",
					"hexo deploy"
				], {
					canPickMany: false,
					ignoreFocusOut: true,
					matchOnDescription: true,
					matchOnDetail: true,
					placeHolder: 'Select an action: '
				})
			.then(function (msg) {
				vscode.window.showInformationMessage("Executing: " + msg);
				runCmd(msg);
				console.log(msg);
			})
	});

	// start hexo server
	let hexoServer = vscode.commands.registerCommand('hexo-one.hexoServer', function () {
		let terminal = vscode.window.createTerminal("Hexo Server");
		terminal.sendText("hexo s");
		terminal.show();
	});

	context.subscriptions.push(pushHexo);
	context.subscriptions.push(newPost);
	context.subscriptions.push(publishDraft);
	context.subscriptions.push(hexoPrompt);
	context.subscriptions.push(hexoServer);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

function createPost(content) {
	var msg1 = "Please type the title of your " + content
	var msg2 = "hexo new " + content + " \""
	const options = {
		ignoreFocusOut: true,
		password: false,
		prompt: msg1
	};
	vscode.window.showInputBox(options).then((value) => {
		if (value === undefined || value.trim() === '') {
			vscode.window.showInformationMessage(msg1);
		} else {
			const title = value.trim();
			const cmd = msg2 + title + "\""
			runCmd(cmd);
			//vscode.window.showInformationMessage(cmd);
			vscode.window.showInformationMessage('Creating new ' + content + ': \"' + title + '\" please wait.');
		}
	});
}

function runCmd(cmd) {
	const {
		workspace
	} = require('vscode');
	const options = {
		cwd: workspace.workspaceFolders[0].uri.path,
		env: process.env
	}
	const {
		exec
	} = require('child_process');
	exec(cmd, options, (err, stdout, stderr) => {
		if (err) {
			console.log(err);
			return;
		}
		console.log(`stdout: ${stdout}`);
		console.log(`stderr: ${stderr}`);
		vscode.window.showInformationMessage(stdout);
	})

}

module.exports = {
	activate,
	deactivate
}