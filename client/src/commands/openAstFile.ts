import { Uri, window, workspace } from 'vscode';
import { AstKind, showAst } from '../interface/showAst';
import { log } from '../util';

export default async function openAstFile(filePath: string, astKind: AstKind) {
  try {
    const astDocument = await showAst(filePath, astKind);
    if (astDocument) {
      const openPath = Uri.parse('file:///' + astDocument.uri);
      workspace
        .openTextDocument(openPath)
        .then(doc => {
          window.showTextDocument(doc);
        })
        .then(() => log.info(`Successfully opened AST file ${filePath}`));
    } else {
      log.error(`No ${astKind} AST file found for ${filePath}`);
    }
  } catch (error) {
    log.error(
      `An error occurred while attempting to open ${astKind} AST file found for ${filePath}`,
      error
    );
  }
}
