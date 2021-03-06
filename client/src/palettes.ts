import * as vscode from 'vscode';
import * as path from 'path';
import { exec } from 'child_process';
import { Config } from './config';
import forcRun from './commands/forcRun';
import startFuelCore from './commands//startFuelCore';

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
          forcRun(this.config, currentTabDirectory);
        },
      },
      {
        command: 'sway.startFuelCore',
        callback: async () => {
          startFuelCore(this.config);
        },
      },
    ];
  }
}
