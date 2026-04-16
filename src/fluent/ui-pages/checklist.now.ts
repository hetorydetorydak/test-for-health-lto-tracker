import '@servicenow/sdk/global';
import { UiPage } from '@servicenow/sdk/core';
import checklistPage from '../../client/index.html';

export const form_checklist_page = UiPage({
  $id: Now.ID['form-checklist-page'], 
  endpoint: 'x_1998335_testlto_checklist.do',
  description: 'Renewal Checklist - Track required documents and forms',
  category: 'general',
  html: checklistPage,
  direct: true
});
