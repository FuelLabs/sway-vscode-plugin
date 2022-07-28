import {
  CodeLens,
  CodeLensProvider,
  Command,
  Range,
  TextDocument,
} from 'vscode';

export class SwayCodeLensProvider implements CodeLensProvider {
  async provideCodeLenses(document: TextDocument): Promise<CodeLens[]> {

    let forcRun: Command = {
      command: 'sway.runScript',
      title: '▶\u{fe0e} Run',
      tooltip: 'Run the Sway script with Forc',
    };

    // TODO: Get range of runnable function(s) from server
    const runnableRanges = [new Range(0, 0, 0l, 0)]
    const forcRunLenses = runnableRanges.map(range => new CodeLens(range, forcRun));

    return forcRunLenses;
  }
}
