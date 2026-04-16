import '@servicenow/sdk/global';
import { UiPage } from '@servicenow/sdk/core';
import dashboardPage from '../../client/index.html';

export const lto_dashboard_page = UiPage({
  $id: Now.ID['lto-dashboard-page'], 
  endpoint: 'x_1998335_testlto_test_dash.do',
  description: 'Test Health Dashboard - Philippine DOH License Management',
  category: 'general',
  html: dashboardPage,
  direct: true
})