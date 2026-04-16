import '@servicenow/sdk/global';
import { UiPage } from '@servicenow/sdk/core';
import facilitiesPage from '../../client/index.html';

export const facilities_list_page = UiPage({
  $id: Now.ID['facilities-list-page'], 
  endpoint: 'x_1998335_testlto_facilities.do',
  description: 'All Facilities - Hospital locations with DOH license data',
  category: 'general',
  html: facilitiesPage,
  direct: true
});
