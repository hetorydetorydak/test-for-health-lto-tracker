import '@servicenow/sdk/global';
import { UiPage } from '@servicenow/sdk/core';
import dashboardPage from '../../client/index.html';

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
  html: dashboardPage,
  direct: true
});