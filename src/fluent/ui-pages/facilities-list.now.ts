import '@servicenow/sdk/global';
import { UiPage } from '@servicenow/sdk/core';

export const facilities_list_page = UiPage({
  $id: Now.ID['facilities-list-page'], 
  endpoint: 'x_1998335_testlto_facilities.do',
  description: 'Healthcare Facilities - DOH Licensee Information',
  category: 'general',
  html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Facilities</title>
      </head>
      <body>
        <div id="app"></div>
        <script src="/dist/main.js"></script>
      </body>
    </html>
  `,
  direct: true
});
