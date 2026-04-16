import '@servicenow/sdk/global';
import { UiPage } from '@servicenow/sdk/core';
import licenseDetailPage from '../../client/index.html';

export const license_detail_page = UiPage({
  $id: Now.ID['license-detail-page'], 
  endpoint: 'x_1998335_testlto_license_detail.do',
  description: 'License Detail - Renewal stage and checklist status',
  category: 'general',
  html: licenseDetailPage,
  direct: true
});
