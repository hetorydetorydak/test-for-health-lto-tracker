import '@servicenow/sdk/global';
import { UiPage } from '@servicenow/sdk/core';

export const alerts_page = UiPage({
  $id: Now.ID['alerts-page'], 
  endpoint: 'x_1998335_testlto_alerts.do',
  description: 'Alerts - Expiry notifications and system messages',
  category: 'general',
  html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Alerts</title>
      </head>
      <body>
        <div id="app"></div>
        <script src="/dist/main.js"></script>
      </body>
    </html>
  `,
  direct: true
});
