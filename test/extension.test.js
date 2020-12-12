const test = require('tape')
const assert = require('assert')

const mock = require('mock-require')
const vscode = {
  context: { subscriptions: [] },
  launch(document) {
    vscode.context = { subscriptions: [] }
    vscode.window.editorsChangedListeners = []
    vscode.workspace.textDocuments = document ? [document] : []
    vscode.window.activeTextEditor = null
    vscode.commands.executedIds = []
    activate(vscode.context)
  },
  openFile() {
    const document = { uri: { fsPath: 'root/test.js' } }
    vscode.workspace.textDocuments = [document]
    vscode.window.activeTextEditor = { document }
    vscode.window.editorsChangedListeners[0]([{}])
  },
  activateDocument() {
    vscode.window.activeTextEditor = { document: vscode.workspace.textDocuments[0] }
    vscode.window.editorsChangedListeners[0]([{}])
  },
  workspace: {
    rootPath: 'root',
    textDocuments: [],
    settings: {},
    configuration: {
      get(key) { return vscode.workspace.settings[key] }
    },
    getConfiguration(group) {
      assert.equal(group, 'foldOnOpen')
      return vscode.workspace.configuration
    }
  },
  window: {
    activeTextEditor: null,
    editorsChangedListeners: [],
    onDidChangeVisibleTextEditors(callback) {
      assert.equal(typeof callback, 'function')
      vscode.window.editorsChangedListeners.push(callback)
      return callback
    }
  },
  commands: {
    executedIds: [],
    executeCommand(id) { this.executedIds.push(id) }
  }
}
mock('vscode', vscode)

const { activate, deactivate } = require('..')

test('exports methods for extension activation and deactivation', assert => {
  assert.equal(typeof activate, 'function')
  assert.equal(typeof deactivate, 'function')
  assert.end()
})

test('registers a listener for text editor activation', assert => {
  vscode.launch()
  assert.equal(vscode.window.editorsChangedListeners.length, 1)
  assert.equal(vscode.context.subscriptions.length, 1)
  assert.equal(vscode.context.subscriptions[0], vscode.window.editorsChangedListeners[0])
  assert.end()
})

test('deactivation does not fail', assert => {
  deactivate()
  assert.pass()
  assert.end()
})

test('does not fold with no editor', assert => {
  vscode.launch()
  vscode.window.editorsChangedListeners[0]([])
  assert.equal(vscode.commands.executedIds.length, 0)
  assert.end()
})

test('does not fold with no active editor', assert => {
  vscode.launch()
  vscode.window.editorsChangedListeners[0]([{}])
  assert.equal(vscode.commands.executedIds.length, 0)
  assert.end()
})

test('does not fold an already opened document', assert => {
  vscode.launch({})
  vscode.activateDocument()
  assert.equal(vscode.commands.executedIds.length, 0)
  assert.end()
})

test('does not fold with null targets', assert => {
  vscode.launch()
  vscode.workspace.settings = {}
  vscode.openFile()
  assert.equal(vscode.commands.executedIds.length, 0)
  assert.end()
})

test('does not fold with no target', assert => {
  vscode.launch()
  vscode.workspace.settings = { targets: [] }
  vscode.openFile()
  assert.equal(vscode.commands.executedIds.length, 0)
  assert.end()
})

test('rejects an empty target', assert => {
  vscode.launch()
  vscode.workspace.settings = { targets: [''] }
  try {
    vscode.openFile()
    assert.fail()
  } catch {
    assert.pass()
    assert.end()
  }
})

test('rejects an invalid target', assert => {
  vscode.launch()
  vscode.workspace.settings = { targets: ['invalid'] }
  try {
    vscode.openFile()
    assert.fail()
  } catch {
    assert.pass()
    assert.end()
  }
})

test('folds with no enabled and disabled patterns', assert => {
  vscode.launch()
  vscode.workspace.settings = { targets: ['AllBlockComments'] }
  vscode.openFile()
  assert.equal(vscode.commands.executedIds.length, 1)
  assert.equal(vscode.commands.executedIds[0], 'editor.foldAllBlockComments')
  assert.end()
})

test('folds with the default enabled pattern', assert => {
  vscode.launch()
  vscode.workspace.settings = {
    targets: ['AllBlockComments'], enableFiles: ['**/*']
  }
  vscode.openFile()
  assert.equal(vscode.commands.executedIds.length, 1)
  assert.equal(vscode.commands.executedIds[0], 'editor.foldAllBlockComments')
  assert.end()
})

test('rejects an empty target', assert => {
  vscode.launch()
  vscode.workspace.settings = {
    targets: ['AllBlockComments'], enableFiles: ['']
  }
  try {
    vscode.openFile()
    assert.fail()
  } catch {
    assert.pass()
    assert.end()
  }
})

test('folds with the relative path pattern', assert => {
  vscode.launch()
  vscode.workspace.settings = {
    targets: ['AllBlockComments'], enableFiles: ['test.js'], disableFiles: []
  }
  vscode.openFile()
  assert.equal(vscode.commands.executedIds.length, 1)
  assert.equal(vscode.commands.executedIds[0], 'editor.foldAllBlockComments')
  assert.end()
})

test('does not fold with a non-matching pattern', assert => {
  vscode.launch()
  vscode.workspace.settings = {
    targets: ['AllBlockComments'], enableFiles: ['**/*.ts']
  }
  vscode.openFile()
  assert.equal(vscode.commands.executedIds.length, 0)
  assert.end()
})

test('does not fold with a disabled pattern', assert => {
  vscode.launch()
  vscode.workspace.settings = {
    targets: ['AllBlockComments'], enableFiles: ['**/*'], disableFiles: ['**/*.js']
  }
  vscode.openFile()
  assert.equal(vscode.commands.executedIds.length, 0)
  assert.end()
})
