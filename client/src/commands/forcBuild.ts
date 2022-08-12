import { exec } from 'child_process';
import { window } from 'vscode';

export default function forcBuild(forcDir: string) {
  exec(`cd ${forcDir} && forc build`, (error, _stdout, _stderr) => {
    if (error) {
      window.showInformationMessage(`Failed with error: ${error.message}`);
      return;
    }
    // forc has a bug where it returns sterr when run is successful
    // TODO: handle stderr properly when fixed.
    window.showInformationMessage(`Successfully built sway program.`);
  });
}
