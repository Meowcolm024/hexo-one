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
		// The code you place here will be executed every time your command is executed
		runCmd('hexo clean \n hexo g \n hexo d');
		// Display a message box to the user
		vscode.window.showInformationMessage('Deploying Hexo, please wait...');
	});

	let newDraft = vscode.commands.registerCommand('hexo-one.newDraft', function() {
		runPrompt(
			"Please type the title of your draft",
			'Please type the title of your draft',
			"hexo new draft \"",
			'Creating new draft: \"'
		)
	});

	let newPost = vscode.commands.registerCommand('hexo-one.newPost', function() {
		runPrompt(
			"Please type the title of your post",
			'Please type the title of your post',
			"hexo new \"",
			'Creating new post: \"'
		)
	});

	context.subscriptions.push(pushHexo);
	context.subscriptions.push(newPost);
	context.subscriptions.push(newDraft);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

function runPrompt(s1, s2, s3, s4) {
	const options = {
		ignoreFocusOut: true,
		password: false,
		prompt: s1
		};
	vscode.window.showInputBox(options).then((value) => {
		if (value === undefined || value.trim() === '') {
		vscode.window.showInformationMessage(s2);
		}else{
			const title = value.trim();
			const cmd = s3 + title + "\""
			runCmd(cmd);
			vscode.window.showInformationMessage(s4 + title + '\" please wait.');
		}});
}

function runCmd(cmd) {
	const {workspace} = require('vscode');
	const options = {
        cwd: workspace.rootPath,
        env: process.env
    }
	const { exec } = require('child_process');
		exec(cmd, options, (err, stdout, stderr) => {
			if(err) {
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
