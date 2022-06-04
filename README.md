# Sway Visual Studio Code Plugin

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/FuelLabs.sway-vscode-plugin)](https://marketplace.visualstudio.com/items?itemName=FuelLabs.sway-vscode-plugin)
[![discord](https://img.shields.io/badge/chat%20on-discord-orange?&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/xfpK4Pe)

## When does the plugin get activated?

Currently it gets activated once you open a file with `.sw` extension.

## Testing

Prior to testing make sure you have [the Fuel toolchain](https://fuellabs.github.io/sway/latest/introduction/installation.html) installed as well.

On macOS, ensure you have the `code` CLI tool installed by running `code --version`. If not, open the VSCode editor -> cmd + shift + p -> search `>Shell Command install` -> install. Additional information: <https://code.visualstudio.com/docs/setup/mac#_launching-from-the-command-line>.

## Testing as a real installed extension

```sh
git clone git@github.com:FuelLabs/sway-vscode-plugin.git
cd sway-vscode-plugin
npm i
npm run install-extension
```

## Test your changes on your local install of VS Code

Firstly, uninstall the official release of the extension and reload VS Code if you have it installed. You will need to do this step each time you want to re-install and test your local version.

Install `vsce`:

```sh
npm install -g vsce
```

`checkout` your branch, if not already on it and run the following in the root of the project:

```sh
vsce package  # Generates a .vsix file
code --install-extension sway-vscode-extension-{version}.vsix
```

## Testing in Debug mode

- In order to start the Debug mode, open `vscode-plugin` in Visual Studio Code, make sure that it is opened as root/main workspace - in order to avoid any problems.
- Make sure that in `Run and Debug` Tab that "Launch Client" is selected - press F5 and new Visual Studio Code Debug Window will be opened.
- Within that Window open a `.sw` file like `main.sw` - which will activate `forc lsp`.

## Testing in Debug mode with the attached Server _(This is only needed if you are developing the Server.)_

- Install this extension -> [CodeLLDB](https://marketplace.visualstudio.com/items?itemName=vadimcn.vscode-lldb)
- Repeat the steps outlined in "Testing in Debug mode", then go back `Run and Debug` Tab, from the dropdown menu
  choose "Sway Server" which will attach the server in the debug mode as well.
