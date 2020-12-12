# Fold on Open

[<img src=https://raw.githubusercontent.com/prantlf/vscode-fold-on-open/master/src/logo.png height=20 alt=Logo>][from the marketplace]
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Build Status](https://github.com/prantlf/vscode-fold-on-open/workflows/Test/badge.svg)](https://github.com/prantlf/vscode-fold-on-open/actions)

Folds comments or other targets in code files automatically when you open them in [Visual Studio Code].

> Tip: If your code includes long JSDoc comments for generating the project documentation, you can fold them automatically when opening a file, so that you will be able to focus on the code and work more efficiently:

```json
"foldOnOpen.targets": ["AllBlockComments"]
```

## Installation

Install this extension to your Visual Studio Code [from the marketplace], or download a specific version of a [released package] and install it from the file.

## Configuration

This extension contributes the following settings. The names have to be prefixed by "foldOnOpen.", when entered to `settings.json`:

| Name | Description | Type | Default value | Valid values |
| ---- | ----------- | ---- | ------------- | ------------ |
| `targets` | Targets to fold when a file is opened. Leave it empty to disable the automatic folding. | `string[]` | `[]` | `All`, `AllBlockComments`, `AllMarkerRegions`, `Level1`, `Level2`, `Level3`, `Level4`, `Level5`, `Level6`, `Level7`, `Recursively` |
| `enableFiles` | Enables the automatic folding for the specified file patterns only. All file patterns are enabled enabled by default. | `string[]` | `["**/*"]` | patterns known from `files.exclude`, e.g. |
| `disableFiles` | Disables the automatic folding for the specified file patterns. No file patterns are disabled by default. | `string[]` | `[]` | patterns known from `files.exclude`, e.g. |

If a file pattern starts with `/`, it will match file paths from the file system root. If a file pattern starts with `**`, it will match the rest of the file path on any directory. If a file pattern start with neither `/` nor `**`, it will consider file paths starting in the project folder as the root.

### Examples

Settings can be applied either for all files:

```cjson
// enable initial block comment folding everywhere except for tests
"foldOnOpen.targets": ["AllBlockComments"],
"foldOnOpen.disableFiles": ["**/test/**/*"]
```

or scoped for a particular language:

```cjson
// enable initial block comment folding only for JavaScript files and
// only in `src` directories in the project root
"[javascript]": {
    "foldOnOpen.targets": ["AllBlockComments"],
    "foldOnOpen.enableFiles": ["src/**/*.js"]
}
```

Additionally, you can decide to save the settings globally to User settings, or locally to Workspace or Project Folder settings. If you want to switch your settings independently on those locations, you can have a look at the [Profile Switcher]. Read also about [settings scopes in VS Code].

## Troubleshooting

If the JSDoc comments are not folded, you can try disabling the [syntax-aware folding]:

```json
"editor.foldingStrategy": "indentation"
```

## License

Copyright (c) 2020 Ferdinand Prantl

Licensed under the MIT license.

[Visual Studio Code]: https://code.visualstudio.com/
[from the marketplace]: https://marketplace.visualstudio.com/items?itemName=prantlf.fold-on-open
[released package]: https://github.com/prantlf/vscode-fold-on-open/releases
[syntax-aware folding]: https://code.visualstudio.com/updates/v1_24#_syntax-aware-folding-enabled-by-default-for-jsts
[Profile Switcher]: https://marketplace.visualstudio.com/items?itemName=aaronpowell.vscode-profile-switcher&WT.mc_id=javascript-11196-aapowell
[settings scopes in VS Code]: https://code.visualstudio.com/docs/getstarted/settings
