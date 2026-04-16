import '@servicenow/sdk/global';
import { UiPage } from '@servicenow/sdk/core';

export const evidence_page = UiPage({
  $id: Now.ID['evidence-page'], 
  endpoint: 'x_1998335_testlto_evidence.do',
  description: 'Evidence Files - Upload supporting documents',
  category: 'general',
  html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Evidence Files</title>
      </head>
      <body>
        <div id="app"></div>
        <script type="module" src="/path/to/client/main.js"></script>
      </body>
    </html>
  `,
  direct: true
});
