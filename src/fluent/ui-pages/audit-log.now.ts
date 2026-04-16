import '@servicenow/sdk/global';
import { UiPage } from '@servicenow/sdk/core';

export const audit_log_page = UiPage({
  $id: Now.ID['audit-log-page'], 
  endpoint: 'x_1998335_testlto_audit_log.do',
  description: 'Audit Log - All changes to licenses and facilities',
  category: 'general',
  html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Audit Log</title>
      </head>
      <body>
        <div id="app"></div>
        <script type="module" src="/path/to/client/main.js"></script>
      </body>
    </html>
  `,
  direct: true
});
