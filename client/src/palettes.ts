import * as vscode from 'vscode';
import * as path from 'path';
import { Config } from './config';
import forcRun from './commands/forcRun';
import startFuelCore from './commands/startFuelCore';
import forcBuild from './commands/forcBuild';
import stopFuelCore from './commands/stopFuelCore';

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
          var currentTabDirectory = path.dirname(
            vscode.window.activeTextEditor.document.fileName
          );
          forcRun(currentTabDirectory);
        },
      },
      {
        command: 'sway.forcBuild',
        callback: async () => {
          var currentTabDirectory = path.dirname(
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
    ];
  }
}
