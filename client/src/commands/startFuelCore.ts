import { exec } from 'child_process';
import { window } from 'vscode';
import { Config } from '../config';

export default function startFuelCore(config: Config) {
  const fuelCoreLogFile = config.traceFuelCoreLogFile;
  exec(`fuel-core > ${fuelCoreLogFile} 2>&1 &`, (_error, _stdout, _stderr) => {
    window.showInformationMessage(
      `Started Fuel Core in the background. Logs at ${fuelCoreLogFile}`
    );
  });
}
