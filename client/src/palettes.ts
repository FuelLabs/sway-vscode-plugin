import * as vscode from 'vscode';
import * as path from 'path';
import { Config } from './config';
import forcRun from './commands/forcRun';
import forcTest from './commands/forcTest';
import startFuelCore from './commands/startFuelCore';
import forcBuild from './commands/forcBuild';
import stopFuelCore from './commands/stopFuelCore';
import openAstFile from './commands/openAstFile';

interface CommandPalette {
  command: string;
  callback: (args?: any) => Promise<void>;
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
        command: 'sway.runTests',
        callback: async ({ name }: { name?: string }) => {
          const currentTabDirectory = path.dirname(
            vscode.window.activeTextEditor.document.fileName
          );
          forcTest(currentTabDirectory, name);
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
        command: 'sway.stopFuelCore',
        callback: async () => stopFuelCore(),
      },
      {
        command: 'sway.showLexedAst',
        callback: async () => {
          const currentFile = vscode.window.activeTextEditor.document.fileName;
          await openAstFile(currentFile, 'lexed');
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
