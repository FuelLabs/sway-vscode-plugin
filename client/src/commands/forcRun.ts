import { exec } from 'child_process';
import { window } from 'vscode';
import { log } from '../util';

export default function forcRun(forcDir: string) {
  exec(`cd ${forcDir} && forc run --unsigned`, (error, stdout, stderr) => {
    if (error) {
      window.showInformationMessage(`Failed: see output console for error`);
      log.error(stderr);
    } else {
      window.showInformationMessage(`Successfully ran script`);
      log.info(stdout);
    }
  });
}
