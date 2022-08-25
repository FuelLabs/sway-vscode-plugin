import * as vscode from 'vscode';
import * as path from 'path';
import { exec } from 'child_process';
import { Config } from './config';
import forcRun from './commands/forcRun';
import startFuelCore from './commands//startFuelCore';
import forcBuild from './commands/forcBuild';
import openAstFile from './commands/openAstFile';

interface CommandPalette {
  command: string;
  callback: () => Promise<void>;
}

export class CommandPalettes {
  constructor(readonly config: Config) {}

  get(): CommandPalette[] {
    return [
      {
        command: 'sway.runScript',
        callback: async () => {
          const currentTabDirectory = path.dirname(
            vscode.window.activeTextEditor.document.fileName
          );
          forcRun(currentTabDirectory);
        },
      },
      {
        command: 'sway.forcBuild',
        callback: async () => {
          const currentTabDirectory = path.dirname(
            vscode.window.activeTextEditor.document.fileName
          );
          forcBuild(currentTabDirectory);
        },
      },
      {
        command: 'sway.startFuelCore',
        callback: async () => {
          startFuelCore(this.config);
        },
      },
      {
        command: 'sway.showParsedAst',
        callback: async () => {
          const currentFile = vscode.window.activeTextEditor.document.fileName;
          await openAstFile(currentFile, 'parsed');
        },
      },
      {
        command: 'sway.showTypedAst',
        callback: async () => {
          const currentFile = vscode.window.activeTextEditor.document.fileName;
          await openAstFile(currentFile, 'typed');
        },
      },
    ];
  }
}
