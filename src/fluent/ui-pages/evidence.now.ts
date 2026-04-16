import '@servicenow/sdk/global';
import { UiPage } from '@servicenow/sdk/core';
import evidencePage from '../../client/index.html';

export const evidence_files_page = UiPage({
  $id: Now.ID['evidence-files-page'], 
  endpoint: 'x_1998335_testlto_evidence.do',
  description: 'Evidence Files - Upload and manage supporting documents',
  category: 'general',
  html: evidencePage,
  direct: true
});
