import { exec } from 'child_process';
import { window } from 'vscode';
import { log } from '../util';

export default function forcBuild(forcDir: string) {
  exec(`cd ${forcDir} && forc run`, (error, stdout, _stderr) => {
    if (error) {
      window.showInformationMessage(`Failed: see output console for error`);
      log.error(stdout);
    } else {g
      window.showInformationMessage(`Successfully built sway program`);
      log.info(stdout);
    }
  });
}
