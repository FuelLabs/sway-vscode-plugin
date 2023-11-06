import * as path from 'path';
import * as vscode from 'vscode';
import { EXTENSION_ROOT, getExtensionPath } from '../config';
import { log } from '../util/util';

export default async function openWallet() {
  // TODO: initialize fuel wallet from local filesystem
  // TODO: dynamically download the fuel wallet static web app
  try {
      const walletPath = vscode.Uri.file(
        path.join(getExtensionPath(), 'fuel-wallet-0.13.5')
      );

      const panel = vscode.window.createWebviewPanel(
        `${EXTENSION_ROOT}.open-wallet`,
        `${EXTENSION_ROOT} Fuel Wallet`,
        vscode.ViewColumn.Two,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
          localResourceRoots: [walletPath],
        }
      );

      const uri = panel.webview.asWebviewUri(walletPath);
      const html = `
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <link rel="icon" href="${uri}/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Fuels Wallet</title>
          <style>
            /* Avoid page to be empty during load
              Removing color blink */
            body {
              margin: 0;
              padding: 0;
              background-color: #000000;
            }
          </style>
          <script type="module" crossorigin src="${uri}/assets/config-27341492.js"></script>
          <script type="module" crossorigin src="${uri}/assets/BaseConnection-538d8d30.js"></script>
          <script type="module" crossorigin src="${uri}/assets/config-039f390a.js"></script>
          <script type="module" crossorigin src="${uri}/assets/main-1b1b8631.js"></script>
          <link rel="stylesheet" href="${uri}/assets/main-fe367072.css">
        </head>
        <body>      
          <div id="root"></div>
        </body>
      </html>
                `;

      panel.webview.html = html;
  } catch (error) {
    log.error(`Failed to open the Fuel wallet`, error);
  }
}
