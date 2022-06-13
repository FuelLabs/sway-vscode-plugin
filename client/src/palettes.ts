import * as vscode from "vscode";
import * as path from "path";
import { exec } from "child_process";
import { Config } from "./config";

interface CommandPalette {
  command: string;
  callback: () => Promise<void>;
}

export class CommandPalettes {
  constructor(readonly config: Config) {}

  get(): CommandPalette[] {
    const fuelCoreLogFile = this.config.traceFuelCoreLogFile;
    const runScript = {
      command: "sway.runScript",
      callback: async () => {
        var currentTabDirectory = path.dirname(
          vscode.window.activeTextEditor.document.fileName
        );

        exec(
          `cd ${currentTabDirectory} && forc run`,
          (error, _stdout, _stderr) => {
            if (error) {
              vscode.window.showInformationMessage(
                `Failed with error: ${error.message}. Logs at ${fuelCoreLogFile}`
              );
              return;
            }
            // forc has a bug where it returns sterr when run is successful
            // TODO: handle stderr properly when fixed.
            vscode.window.showInformationMessage(
              `Successfully ran script. Logs at ${fuelCoreLogFile}`
            );
          }
        );
      },
    };
    const startFuelCore = {
      command: "sway.startFuelCore",
      callback: async () => {
        exec(`fuel-core > ${fuelCoreLogFile} 2>&1 &`, () => {
          vscode.window.showInformationMessage(
            `Started Fuel Core in the background. Logs at ${fuelCoreLogFile}`
          );
        });
      },
    };
    return [runScript, startFuelCore];
  }
}
