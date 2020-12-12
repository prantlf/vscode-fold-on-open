const vscode = require('vscode')
const micromatch = require('micromatch')
const { join } = require('path')

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
    // check if the activated document is newly opened
    if (!docs.includes(activeDoc)) tryFoldingTarget(activeDoc)
    docs = vscode.workspace.textDocuments
  }
}

const validTargets = new Set([
  "All", "AllBlockComments", "AllMarkerRegions", "Level1", "Level2",
  "Level3", "Level4", "Level5", "Level6", "Level7", "Recursively"
])

function tryFoldingTarget(doc) {
  const config = vscode.workspace.getConfiguration('foldOnOpen', doc)
  const targets = config.get('targets')
  // no folding targets means disabling the folding
  if (!(targets && targets.length)) return
  const { uri } = doc
  let { fsPath: path } = uri
  const enable = getPathPatterns(config, 'enableFiles')
  // check if the folding is enabled only for some file patterns
  if (enable.length && !micromatch.isMatch(path, enable)) return
  const disable = getPathPatterns(config, 'disableFiles')
  // check if the folding is not disabled for this file
  if (disable.length && micromatch.isMatch(path, disable)) return
  for (const target of targets) {
    if (!target) throw new Error('Empty folding target detected.')
    if (!validTargets.has(target)) throw new Error(`'Invalid folding target: "${target}".`)
    vscode.commands.executeCommand(`editor.fold${target}`)
  }
}

function getPathPatterns(config, property) {
  let patterns = config.get(property) || []
  const { rootPath } = vscode.workspace
  return patterns.map(pattern => {
    if (!pattern) throw new Error('Empty file pattern detected.')
    // path starting with a directory name is relative to the project folder
    return pattern.startsWith('**') ? pattern : join(rootPath, pattern)
  })
}

function deactivate() {}

module.exports = { activate, deactivate }
