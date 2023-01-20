import { exec } from 'child_process';
import { window } from 'vscode';
import { Config } from '../config';
import updateFuelCoreStatus from '../status_bar/fuelCoreStatus';

export default function startFuelCore(config: Config) {
  const fuelCoreLogFile = config.traceFuelCoreLogFile;
  exec(`fuel-core run --db-type in-memory > ${fuelCoreLogFile} 2>&1 &`, () => {
    window.showInformationMessage(
      `Started Fuel Core in the background. Logs at ${fuelCoreLogFile}`
    );
    updateFuelCoreStatus();
  });
}
