import { CodeLens, CodeLensProvider, Command, TextDocument } from 'vscode';
import { getRunnables } from '../interface/getRunnables';

export class SwayCodeLensProvider implements CodeLensProvider {
  async provideCodeLenses(document: TextDocument): Promise<CodeLens[]> {
    let forcRun: Command = {
      command: 'sway.runScript',
      title: '▶\u{fe0e} Run',
      tooltip: 'Run the Sway program with Forc',
    };

    const runnableRanges = await getRunnables();
    const forcRunLenses = runnableRanges.map(
      range => new CodeLens(range, forcRun)
    );

    return forcRunLenses;
  }
}
