import '@servicenow/sdk/global';
import { UiPage } from '@servicenow/sdk/core';

export const license_detail_page = UiPage({
  $id: Now.ID['license-detail-page'], 
  endpoint: 'x_1998335_testlto_license_detail.do',
  description: 'License Detail - Renewal stage and checklist status',
  category: 'general',
  html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>License Detail</title>
      </head>
      <body>
        <div id="app"></div>
        <script src="/dist/main.js"></script>
      </body>
    </html>
  `,
  direct: true
});
