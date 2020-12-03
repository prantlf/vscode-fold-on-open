# Fold on Open

[<img src=https://raw.githubusercontent.com/prantlf/vscode-fold-on-open/master/logo.png height=20 alt=Logo>][from the marketplace]
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Build Status](https://github.com/prantlf/vscode-fold-on-open/workflows/Test/badge.svg)](https://github.com/prantlf/vscode-fold-on-open/actions)

Folds comments or other targets in code files automatically when you open them in [Visual Studio Code].

> Tip: If your code includes long JSDoc comments for generating the project documentation, you can fold them automatically when opening a file, so that you will be able to focus on the code and work more efficiently:

    "foldOnOpen.targets": ["AllBlockComments"]

## Installation

Install this extension to your Visual Studio Code [from the marketplace], or download a specific version of a [released package] and install it from the file.

## Configuration

This extension contributes the following settings:

* `foldOnOpen.targets`: Targets to fold when a file is opened. Leave it empty do disable the automatic folding. (array of strings, `[]` by default, valid values: `All`, `AllBlockComments`, `AllMarkerRegions`, `Level1`, `Level2`, `Level3`, `Level4`, `Level5`, `Level6`, `Level7`, `Recursively`)

[Visual Studio Code]: https://code.visualstudio.com/
[from the marketplace]: https://marketplace.visualstudio.com/items?itemName=prantlf.fold-on-open
[released package]: https://github.com/prantlf/vscode-fold-on-open/releases
