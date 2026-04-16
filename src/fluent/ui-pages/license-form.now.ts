import '@servicenow/sdk/global';
import { UiPage } from '@servicenow/sdk/core';

export const license_form_page = UiPage({
  $id: Now.ID['license-form-page'], 
  endpoint: 'x_1998335_testlto_license_form.do',
  description: 'License Form - Create or edit license records',
  category: 'general',
  html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>License Form</title>
      </head>
      <body>
        <div id="app"></div>
        <script src="/dist/main.js"></script>
      </body>
    </html>
  `,
  direct: true
});
