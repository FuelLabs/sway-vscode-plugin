import { exec } from 'child_process';
import { commands } from 'vscode';

export default function checkFuelCoreStatus() {
  exec(`ps | grep fuel-cor`, (_error, stdout, _stderr) => {
    const isFuelCoreRunning = stdout.includes('fuel-core');
    if (isFuelCoreRunning) {
        commands.executeCommand('setContext', 'sway.fuelCoreRunning', true);
    } else {
        commands.executeCommand('setContext', 'sway.fuelCoreRunning', false);
    }  
  });
}
