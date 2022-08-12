import { CodeLens, CodeLensProvider, Command, TextDocument } from 'vscode';
import { getRunnables, Runnable } from '../interface/getRunnables';

export class SwayCodeLensProvider implements CodeLensProvider {
  async provideCodeLenses(document: TextDocument): Promise<CodeLens[]> {
    const runnables: Runnable[] = await getRunnables();
    const forcRun: Command = {
      command: 'sway.runScript',
      title: '▶\u{fe0e} Run',
      tooltip: 'Run the Sway program with Forc',
    };
    const forcBuild: Command = {
      command: 'sway.forcBuild',
      title: '▶\u{fe0e} Build',
      tooltip: 'Build the Sway program with Forc',
    };
    const runnableLenses = runnables.map(([range, programType]: Runnable) => {
      const command = programType === 'script' ? forcRun : forcBuild;
      return new CodeLens(range, command);
    });

    return runnableLenses;
  }
}
