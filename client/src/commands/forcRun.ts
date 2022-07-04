import { exec } from 'child_process';
import { window } from 'vscode';
import { Config } from '../config';

export default function forcRun(config: Config, forcDir: string) {
  const fuelCoreLogFile = config.traceFuelCoreLogFile;
  exec(`cd ${forcDir} && forc run`, (error, _stdout, _stderr) => {
    if (error) {
      window.showInformationMessage(
        `Failed with error: ${error.message}. Logs at ${fuelCoreLogFile}`
      );
      return;
    }
    // forc has a bug where it returns sterr when run is successful
    // TODO: handle stderr properly when fixed.
    window.showInformationMessage(
      `Successfully ran script. Logs at ${fuelCoreLogFile}`
    );
  });
}
