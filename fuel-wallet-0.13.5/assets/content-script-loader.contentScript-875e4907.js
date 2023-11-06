(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/contentScript.ts-2d48445c.js")
    );
  })().catch(console.error);

})();
