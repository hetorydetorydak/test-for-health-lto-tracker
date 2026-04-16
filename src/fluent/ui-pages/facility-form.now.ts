import '@servicenow/sdk/global';
import { UiPage } from '@servicenow/sdk/core';
import facilityFormPage from '../../client/index.html';

export const facility_form_page = UiPage({
  $id: Now.ID['facility-form-page'], 
  endpoint: 'x_1998335_testlto_facility_form.do',
  description: 'Facility Form - Create or edit facility records',
  category: 'general',
  html: facilityFormPage,
  direct: true
});
