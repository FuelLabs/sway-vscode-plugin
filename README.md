# Sway Visual Studio Code Plugin

## When does the plugin get activated?

Currently it gets activated once you open a file with `.sw` extension.

## Testing

Prior to testing make sure you have `sway-server` command exported as well.

## Testing as a real installed extension

- To start using your extension with Visual Studio Code copy vscode-plugin into the `<user home>/.vscode/extensions` directory and restart Code.

## Testing in Debug mode

- In order to start the Debug mode, open `vscode-plugin` in Visual Studio Code, make sure that it is opened as root/main workspace - in order to avoid any problems.
- Make sure that in `Run and Debug` Tab that "Launch Client" is selected - press F5 and new Visual Studio Code Debug Window will be opened.
- Within that Window open a `.sw` file like `main.sw` - which will activate `sway-server`.

## Testing in Debug mode with the attached Server

- (This is only needed if you are developing the Server.)
- Install this extension -> [CodeLLDB](https://marketplace.visualstudio.com/items?itemName=vadimcn.vscode-lldb)
- Repeat the steps outlined in "Testing in Debug mode", then go back `Run and Debug` Tab, from the dropdown menu
choose "Fume Server" which will attach the server in the debug mode as well.
