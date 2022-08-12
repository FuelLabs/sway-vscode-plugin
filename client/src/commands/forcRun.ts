import { exec } from 'child_process';
import { window } from 'vscode';
import { Config } from '../config';
import { log } from '../util';

export default function forcRun(config: Config, forcDir: string) {
  const fuelCoreLogFile = config.traceFuelCoreLogFile;
  exec(`cd ${forcDir} && forc run`, (error, stdout, _stderr) => {
    if (error) {
      window.showInformationMessage(`Failed: see output console for error`);
      log.error(stdout);
    } else {
      window.showInformationMessage(`Successfully ran script`);
      log.info(stdout);
    }
  });
}
