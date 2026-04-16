import '@servicenow/sdk/global';
import { UiPage } from '@servicenow/sdk/core';

/**
 * Dashboard UI Page
 * Endpoint: x_1998335_testlto_dashboard.do
 * Serves the LTO Compliance Dashboard with status cards and alerts
 */
export const lto_dashboard_page = UiPage({
  $id: Now.ID['lto-dashboard-page'], 
  endpoint: 'x_1998335_testlto_dashboard.do',
  description: 'LTO Compliance Dashboard - Philippine DOH License Management',
  category: 'general',
  html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>LTO Dashboard</title>
      </head>
      <body>
        <div id="app"></div>
        <script src="/dist/main.js"></script>
      </body>
    </html>
  `,
  direct: true
});