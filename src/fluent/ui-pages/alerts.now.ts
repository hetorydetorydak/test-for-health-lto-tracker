import '@servicenow/sdk/global';
import { UiPage } from '@servicenow/sdk/core';
import alertsPage from '../../client/index.html';

export const alerts_page = UiPage({
  $id: Now.ID['alerts-page'], 
  endpoint: 'x_1998335_testlto_alerts.do',
  description: 'Automated Alerts - Renewal deadline notifications (90/60/30/7 days)',
  category: 'general',
  html: alertsPage,
  direct: true
});
