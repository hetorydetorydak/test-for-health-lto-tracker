import '@servicenow/sdk/global';
import { UiPage } from '@servicenow/sdk/core';
import licenseFormPage from '../../client/index.html';

export const license_form_page = UiPage({
  $id: Now.ID['license-form-page'], 
  endpoint: 'x_1998335_testlto_license_form.do',
  description: 'License Form - Create or edit license records',
  category: 'general',
  html: licenseFormPage,
  direct: true
});
