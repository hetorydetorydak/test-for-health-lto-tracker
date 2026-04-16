import '@servicenow/sdk/global';
import { UiPage } from '@servicenow/sdk/core';

export const checklist_page = UiPage({
  $id: Now.ID['checklist-page'], 
  endpoint: 'x_1998335_testlto_checklist.do',
  description: 'Form Checklist - Track renewal submission requirements',
  category: 'general',
  html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Form Checklist</title>
      </head>
      <body>
        <div id="app"></div>
        <script type="module" src="/path/to/client/main.js"></script>
      </body>
    </html>
  `,
  direct: true
});
