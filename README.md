<picture>
   <source media="(prefers-color-scheme: light)" srcset="./images/light/sway.png">
   <source media="(prefers-color-scheme: dark)" srcset="./images/dark/sway.png">
   <img alt="Sway VSCode Plugin" src="./images/dark/sway.png">
</picture>

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/FuelLabs.sway-vscode-plugin)](https://marketplace.visualstudio.com/items?itemName=FuelLabs.sway-vscode-plugin)
[![discord](https://img.shields.io/badge/chat%20on-discord-orange?&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/xfpK4Pe)

This extension provides LSP support for the Sway smart contract programming language.

## Features

- goto type definition 
- find all references
- types and documentation on hover
- inlay hints for types and parameter names
- semantic syntax highlighting
- symbol renaming
- code actions
- imports insertion

_Coming Soon_

- code completion
- apply suggestions from errors
- workspace symbol search
- ... and many more


## Quick start

1. Install the [Fuel toolchain](https://fuellabs.github.io/fuelup/master/installation/index.html).
1. Ensure `forc-lsp` is installed correctly by entering `forc-lsp --version` into your terminal.
1. Install the [Sway VSCode plugin](https://marketplace.visualstudio.com/items?itemName=FuelLabs.sway-vscode-plugin).

## Configuration

This extension provides configurations through VSCode's configuration settings. All configurations are under `sway-lsp.*`.
