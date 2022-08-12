import { exec } from 'child_process';
import { window } from 'vscode';

export default function forcRun(forcDir: string) {
  exec(`cd ${forcDir} && forc run`, (error, _stdout, _stderr) => {
    if (error) {
      window.showInformationMessage(`Failed with error: ${error.message}`);
      return;
    }
    // forc has a bug where it returns sterr when run is successful
    // TODO: handle stderr properly when fixed.
    window.showInformationMessage(`Successfully ran script.`);
  });
}
