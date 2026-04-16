import '@servicenow/sdk/global';
import { UiPage } from '@servicenow/sdk/core';
import licensesPage from '../../client/index.html';

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
  html: licensesPage,
  direct: true
});
