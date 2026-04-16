import '@servicenow/sdk/global';
import { UiPage } from '@servicenow/sdk/core';
import auditLogPage from '../../client/index.html';

export const audit_log_page = UiPage({
  $id: Now.ID['audit-log-page'], 
  endpoint: 'x_1998335_testlto_audit_log.do',
  description: 'Audit Log - Record of all changes to licenses and facilities',
  category: 'general',
  html: auditLogPage,
  direct: true
});
