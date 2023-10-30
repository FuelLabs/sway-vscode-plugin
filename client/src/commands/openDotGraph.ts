import * as path from 'path';
import * as vscode from 'vscode';
import { EXTENSION_ROOT, getExtensionPath } from '../config';
import { GraphKind, visualize } from '../interface/visualize';
import { addFilePrefix, log } from '../util/util';

export default async function openDotGraph(
  filePath: string,
  graphKind: GraphKind
) {
  try {
    const dotContents = await visualize(addFilePrefix(filePath), graphKind);
    if (dotContents) {
      const nodeModulesPath = vscode.Uri.file(
        path.join(getExtensionPath(), 'node_modules')
      );

      const panel = vscode.window.createWebviewPanel(
        `${EXTENSION_ROOT}.crate-graph`,
        `${EXTENSION_ROOT} build plan graph`,
        vscode.ViewColumn.Two,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
          localResourceRoots: [nodeModulesPath],
        }
      );
      const uri = panel.webview.asWebviewUri(nodeModulesPath);

      const html = `
          <!DOCTYPE html>
          <meta charset="utf-8">
          <head>
              <style>
                  /* Fill the entire view */
                  html, body { margin:0; padding:0; overflow:hidden }
                  svg { position:fixed; top:0; left:0; height:100%; width:100% }

                  /* Disable the graphviz background and fill the polygons */
                  .graph > polygon { display:none; }
                  :is(.node,.edge) polygon { fill: white; }

                  /* Invert the line colours for dark themes */
                  body:not(.vscode-light) .edge path { stroke: white; }
              </style>
          </head>
          <body>
              <script type="text/javascript" src="${uri}/d3/dist/d3.min.js"></script>
              <script type="text/javascript" src="${uri}/@hpcc-js/wasm/dist/graphviz.umd.js"></script>
              <script type="text/javascript" src="${uri}/d3-graphviz/build/d3-graphviz.min.js"></script>
              <div id="graph"></div>
              <script>
                  let dot = \`${dotContents}\`;
                  let graph = d3.select("#graph")
                                .graphviz({ useWorker: false, useSharedWorker: false })
                                .fit(true)
                                .zoomScaleExtent([0.1, Infinity])
                                .renderDot(dot);

                  d3.select(window).on("click", (event) => {
                      if (event.ctrlKey) {
                          graph.resetZoom(d3.transition().duration(100));
                      }
                  });
                  d3.select(window).on("copy", (event) => {
                      event.clipboardData.setData("text/plain", dot);
                      event.preventDefault();
                  });
              </script>
          </body>
          `;

      panel.webview.html = html;
    } else {
      log.error(`No ${graphKind} graph found for ${filePath}`);
    }
  } catch (error) {
    log.error(`Failed to open ${graphKind} graph for ${filePath}`, error);
  }
}
