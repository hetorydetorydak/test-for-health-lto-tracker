import '@servicenow/sdk/global';
import { UiPage } from '@servicenow/sdk/core';

/**
 * Licenses List UI Page
 * Endpoint: x_1998335_testlto_licenses.do
 * Serves the searchable, filterable list of all licenses with status tabs
 */
export const licenses_list_page = UiPage({
  $id: Now.ID['licenses-list-page'], 
  endpoint: 'x_1998335_testlto_licenses.do',
  description: 'All Licenses - Filter by status, type, and expiry',
  category: 'general',
  html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Licenses</title>
      </head>
      <body>
        <div id="app"></div>
        <script type="module" src="/path/to/client/main.js"></script>
      </body>
    </html>
  `,
  direct: true
});
