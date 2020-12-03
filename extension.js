const vscode = require('vscode')

let docs

function activate(context) {
  docs = vscode.workspace.textDocuments
  const editorsSub = vscode.window.onDidChangeVisibleTextEditors(editorsChanged)
	context.subscriptions.push(editorsSub)
}

function editorsChanged(editors) {
  const activeEditor = vscode.window.activeTextEditor
  if (editors.length > 0 && activeEditor) {
    const activeDoc = activeEditor.document
    if (!docs.includes(activeDoc)) foldTarget(activeDoc.uri)
    docs = vscode.workspace.textDocuments
  }
}

const validTargets = new Set([
  "All", "AllBlockComments", "AllMarkerRegions", "Level1", "Level2",
  "Level3", "Level4", "Level5", "Level6", "Level7", "Recursively"
])

function foldTarget(uri) {
  const config = vscode.workspace.getConfiguration('foldOnOpen', uri)
  const targets = config.get('targets')
  if (!(targets && targets.length)) return
  for (const target of targets) {
    if (!target) throw new Error('Empty folding target detected.')
    if (!validTargets.has(target)) throw new Error(`'Invalid folding target: "${target}".`)
    vscode.commands.executeCommand(`editor.fold${target}`)
  }
}

function deactivate() {}

module.exports = { activate, deactivate }
