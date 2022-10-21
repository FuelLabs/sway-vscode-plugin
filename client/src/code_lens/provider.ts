import { CodeLens, CodeLensProvider, Command, TextDocument } from 'vscode';
import { getRunnables, Runnable } from '../interface/getRunnables';

export class SwayCodeLensProvider implements CodeLensProvider {
  async provideCodeLenses(document: TextDocument): Promise<CodeLens[]> {
    const runnables: Runnable[] = await getRunnables(document.fileName);
    const forcRun: Command = {
      command: 'sway.runScript',
      title: '▶\u{fe0e} Run',
      tooltip: 'Run the Sway program with Forc',
    };
    const runnableLenses = runnables.map(([range]: Runnable) => {
      return new CodeLens(range, forcRun);
    });

    return runnableLenses;
  }
}
