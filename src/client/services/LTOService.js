/**
 * LTOService — ServiceNow REST Table API Service Layer
 * Base URL: https://<instance>.service-now.com/api/now/table/
 */

const BASE_URL = '/api/now/table'; // ServiceNow context-aware URL
const HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

/**
 * Helper — Make API request
 */
async function apiRequest(method, table, query = {}, data = null) {
  const queryString = new URLSearchParams(query).toString();
  const url = `${BASE_URL}/${table}${queryString ? `?${queryString}` : ''}`;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        ...HEADERS,
        'X-UserToken': window.g_ck || '',
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) throw new Error(`API error: ${response.statusText}`);
    const json = await response.json();
    return json.result || json;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

/* ────────────────────────────────────────────────────────────────── */
/* DASHBOARD & STATS                                                   */
/* ────────────────────────────────────────────────────────────────── */

export async function getLicenseStatusCounts() {
  const response = await apiRequest('GET', 'x_1998335_testlto_license', {
    sysparm_exclude_reference_link: 'true',
    sysparm_fields: 'status',
    sysparm_limit: '10000',
  });

  const counts = { active: 0, expiring_soon: 0, expired: 0, under_renewal: 0 };
  (Array.isArray(response) ? response : response.result || []).forEach((license) => {
    if (counts.hasOwnProperty(license.status)) {
      counts[license.status]++;
    }
  });
  return counts;
}

export async function getExpiringLicenses(days = 90) {
  return apiRequest('GET', 'x_1998335_testlto_license', {
    sysparm_query: `days_before_expiry<=${days}^days_before_expiry>=-1^ORDERBYexpiry_date`,
    sysparm_exclude_reference_link: 'false',
    sysparm_limit: '50',
  });
}

export async function getRecentAlerts(limit = 10) {
  return apiRequest('GET', 'x_1998335_testlto_alert', {
    sysparm_query: `ORDERBYsys_created_onDESC`,
    sysparm_exclude_reference_link: 'false',
    sysparm_limit: limit.toString(),
  });
}

/* ────────────────────────────────────────────────────────────────── */
/* FACILITIES                                                          */
/* ────────────────────────────────────────────────────────────────── */

export async function getFacilities(search = '', typeFilter = 'all', page = 1, pageSize = 10) {
  const offset = (page - 1) * pageSize;
  let query = {};

  if (search || (typeFilter && typeFilter !== 'all')) {
    let qs = '';
    if (search) qs += `nameILIKE${search}^ORdoh_license_numberILIKE${search}`;
    if (typeFilter && typeFilter !== 'all') qs += qs ? `^facility_type=${typeFilter}` : `facility_type=${typeFilter}`;
    query.sysparm_query = qs;
  }

  query.sysparm_exclude_reference_link = 'false';
  query.sysparm_limit = pageSize.toString();
  query.sysparm_offset = offset.toString();

  return apiRequest('GET', 'x_1998335_testlto_facility', query);
}

export async function getFacilityById(id) {
  return apiRequest('GET', `x_1998335_testlto_facility/${id}`, {
    sysparm_exclude_reference_link: 'false',
  });
}

export async function createFacility(data) {
  return apiRequest('POST', 'x_1998335_testlto_facility', {}, data);
}

export async function updateFacility(id, data) {
  return apiRequest('PATCH', `x_1998335_testlto_facility/${id}`, {}, data);
}

export async function deleteFacility(id) {
  return apiRequest('DELETE', `x_1998335_testlto_facility/${id}`);
}

export async function checkDuplicateDOHNumber(value, excludeId = null) {
  let qs = `doh_license_number=${value}`;
  if (excludeId) qs += `^sys_idNOT=${excludeId}`;

  const response = await apiRequest('GET', 'x_1998335_testlto_facility', {
    sysparm_query: qs,
    sysparm_limit: '1',
  });
  const data = Array.isArray(response) ? response : response.result || [];
  return data.length > 0;
}

/* ────────────────────────────────────────────────────────────────── */
/* LICENSES                                                            */
/* ────────────────────────────────────────────────────────────────── */

export async function getLicenses(statusFilter = 'all', typeFilter = 'all', search = '', page = 1, pageSize = 10) {
  const offset = (page - 1) * pageSize;
  let qs = '';

  if (statusFilter && statusFilter !== 'all') qs += `status=${statusFilter}`;
  if (typeFilter && typeFilter !== 'all') qs += qs ? `^license_type=${typeFilter}` : `license_type=${typeFilter}`;
  if (search) {
    const searchQry = search ? `^(nameILIKE${search}^ORlicense_numberILIKE${search})` : '';
    qs += searchQry;
  }

  const query = {
    sysparm_query: qs || 'ORDERBYexpiry_date',
    sysparm_exclude_reference_link: 'false',
    sysparm_limit: pageSize.toString(),
    sysparm_offset: offset.toString(),
  };

  return apiRequest('GET', 'x_1998335_testlto_license', query);
}

export async function getLicenseById(id) {
  return apiRequest('GET', `x_1998335_testlto_license/${id}`, {
    sysparm_exclude_reference_link: 'false',
  });
}

export async function createLicense(data) {
  return apiRequest('POST', 'x_1998335_testlto_license', {}, data);
}

export async function updateLicense(id, data) {
  return apiRequest('PATCH', `x_1998335_testlto_license/${id}`, {}, data);
}

export async function deleteLicense(id) {
  return apiRequest('DELETE', `x_1998335_testlto_license/${id}`);
}

export async function advanceRenewalStage(id) {
  // Server-side business rule BR-L-03 prevents backward transitions
  return updateLicense(id, { renewal_stage: 'advance' }); // Server interprets 'advance' as forward one step
}

/* ────────────────────────────────────────────────────────────────── */
/* FORM CHECKLIST                                                      */
/* ────────────────────────────────────────────────────────────────── */

export async function getChecklistByLicense(licenseId) {
  return apiRequest('GET', 'x_1998335_testlto_form_checklist', {
    sysparm_query: `license_id=${licenseId}`,
    sysparm_exclude_reference_link: 'false',
  });
}

export async function toggleChecklistItem(itemId, isCompleted) {
  const data = {
    is_completed: isCompleted,
  };
  return apiRequest('PATCH', `x_1998335_testlto_form_checklist/${itemId}`, {}, data);
}

/* ────────────────────────────────────────────────────────────────── */
/* EVIDENCE FILES                                                      */
/* ────────────────────────────────────────────────────────────────── */

export async function getEvidenceByLicense(licenseId) {
  return apiRequest('GET', 'x_1998335_testlto_evidence_file', {
    sysparm_query: `license_id=${licenseId}`,
    sysparm_exclude_reference_link: 'false',
  });
}

export async function deleteEvidenceFile(id) {
  return apiRequest('DELETE', `x_1998335_testlto_evidence_file/${id}`);
}

/* ────────────────────────────────────────────────────────────────── */
/* AUDIT LOG                                                           */
/* ────────────────────────────────────────────────────────────────── */

export async function getAuditLog(facilityId = null, action = null, fromDate = null, toDate = null, page = 1, pageSize = 20) {
  const offset = (page - 1) * pageSize;
  let qs = '';

  if (facilityId) qs += `facility_id=${facilityId}`;
  if (action) qs += qs ? `^action=${action}` : `action=${action}`;
  if (fromDate) qs += qs ? `^changed_at>=${fromDate}` : `changed_at>=${fromDate}`;
  if (toDate) qs += qs ? `^changed_at<${toDate}` : `changed_at<${toDate}`;

  return apiRequest('GET', 'x_1998335_testlto_audit_log', {
    sysparm_query: qs || 'ORDERBYchanged_atDESC',
    sysparm_exclude_reference_link: 'false',
    sysparm_limit: pageSize.toString(),
    sysparm_offset: offset.toString(),
  });
}

/* ────────────────────────────────────────────────────────────────── */
/* ALERTS                                                              */
/* ────────────────────────────────────────────────────────────────── */

export async function getAlerts(threshold = null, channel = null, facilityId = null, page = 1, pageSize = 20) {
  const offset = (page - 1) * pageSize;
  let qs = '';

  if (threshold) qs += `days_before_expiry=${threshold}`;
  if (channel) qs += qs ? `^channel=${channel}` : `channel=${channel}`;
  if (facilityId) qs += qs ? `^facility_id=${facilityId}` : `facility_id=${facilityId}`;

  return apiRequest('GET', 'x_1998335_testlto_alert', {
    sysparm_query: qs || 'ORDERBYsent_atDESC',
    sysparm_exclude_reference_link: 'false',
    sysparm_limit: pageSize.toString(),
    sysparm_offset: offset.toString(),
  });
}

/* Legacy class export for compatibility */
export class LTOService {
  constructor() {
    this.licenseTable = 'x_1998335_testlto_license';
    this.alertTable = 'x_1998335_testlto_alert';
    this.facilityTable = 'x_1998335_testlto_facility';
  }

  // Legacy methods — delegate to module exports
  async getExpiringLicenses(days = 90) {
    return getExpiringLicenses(days);
  }

  async getRecentAlerts(limit = 10) {
    return getRecentAlerts(limit);
  }

  async getLicenseDetails(sysId) {
    return getLicenseById(sysId);
  }

  async getFacilityDetails(sysId) {
    return getFacilityById(sysId);
  }
}

export default LTOService;