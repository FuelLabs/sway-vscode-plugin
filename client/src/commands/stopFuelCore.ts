import { exec } from 'child_process';
import { window } from 'vscode';
import { Config } from '../config';
import updateFuelCoreStatus from '../status_bar/fuelCoreStatus';

export default function stopFuelCore() {
  exec(`pkill -15 fuel-core`, () => {
    window.showInformationMessage(`Stopped fuel-core`);
    updateFuelCoreStatus();
  });
}
