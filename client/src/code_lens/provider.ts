import {
  CodeLens,
  CodeLensProvider,
  Command,
  Range,
  TextDocument,
} from 'vscode';

export class SwayCodeLensProvider implements CodeLensProvider {
  async provideCodeLenses(document: TextDocument): Promise<CodeLens[]> {
    // TODO: Get range of runnable function from server
    let topOfDocument = new Range(0, 0, 0, 0);

    let forcRun: Command = {
      command: 'sway.runScript',
      title: '▶\u{fe0e} Run',
      tooltip: 'Run the Sway script with Forc',
    };

    let forcRunLens = new CodeLens(topOfDocument, forcRun);

    return [forcRunLens];
  }
}
