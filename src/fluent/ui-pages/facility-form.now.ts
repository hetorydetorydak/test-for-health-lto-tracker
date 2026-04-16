import '@servicenow/sdk/global';
import { UiPage } from '@servicenow/sdk/core';

export const facility_form_page = UiPage({
  $id: Now.ID['facility-form-page'], 
  endpoint: 'x_1998335_testlto_facility_form.do',
  description: 'Facility Form - Create or edit facility records',
  category: 'general',
  html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Facility Form</title>
      </head>
      <body>
        <div id="app"></div>
        <script src="/dist/main.js"></script>
      </body>
    </html>
  `,
  direct: true
});
