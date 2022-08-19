import { exec } from 'child_process';
import { StatusBarAlignment, StatusBarItem, window } from 'vscode';
import { log } from '../util';

let fuelCoreStatus: StatusBarItem;
let isFuelCoreRunning: boolean;

export const getFuelCoreStatus = () => {
    if (!fuelCoreStatus) {
        fuelCoreStatus = window.createStatusBarItem(StatusBarAlignment.Left, 100);
        // TODO: start it when you click on the status bar
        // fuelCoreStatus.command = '';
    }
    if (!isFuelCoreRunning) {
        fuelCoreStatus.command = 'sway.startFuelCore';
    }
    return fuelCoreStatus;
}

export default function updateFuelCoreStatus() {
  const initializedItem = getFuelCoreStatus();
  exec(`ps aux | grep -i fuel-cor`, (_error, stdout, _stderr) => {
    isFuelCoreRunning = stdout.includes('fuel-core');
  });

  if (isFuelCoreRunning) {
    initializedItem.text = `$(symbol-event) fuel-core running`;
    initializedItem.show();

  } else {
    initializedItem.text = `$(symbol-event) fuel-core stopped`;
    initializedItem.show();
  }
}
