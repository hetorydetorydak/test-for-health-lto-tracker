export class LTOService {
  constructor() {
    this.licenseTable = 'x_1998335_testlto_license';
    this.alertTable = 'x_1998335_testlto_alert';
    this.facilityTable = 'x_1998335_testlto_facility';
  }

  // Helper method for API calls with error handling
  async apiCall(url, options = {}) {
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'X-UserToken': window.g_ck,
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData.error && errorData.error.message) {
            errorMessage = errorData.error.message;
          }
        } catch (e) {
          // If JSON parsing fails, use the HTTP error message
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }

  // Get licenses by status
  async getLicensesByStatus(status) {
    const params = new URLSearchParams({
      sysparm_query: `status=${status}`,
      sysparm_display_value: 'all',
      sysparm_limit: '1000'
    });
    
    return this.apiCall(`/api/now/table/${this.licenseTable}?${params}`);
  }

  // Get licenses expiring within specified days
  async getExpiringLicenses(days = 90) {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);
    
    // Format dates for ServiceNow (YYYY-MM-DD)
    const todayStr = today.toISOString().split('T')[0];
    const futureDateStr = futureDate.toISOString().split('T')[0];
    
    const params = new URLSearchParams({
      sysparm_query: `expiry_dateBETWEEN${todayStr}@${futureDateStr}^status!=expired^renewal_stage!=released`,
      sysparm_display_value: 'all',
      sysparm_limit: '1000',
      sysparm_fields: 'sys_id,license_number,license_type,facility_id,expiry_date,status,renewal_stage,days_before_expiry,checklist_pct'
    });
    
    return this.apiCall(`/api/now/table/${this.licenseTable}?${params}`);
  }

  // Get recent alerts within specified days
  async getRecentAlerts(days = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffDateStr = cutoffDate.toISOString().split('T')[0];
    
    const params = new URLSearchParams({
      sysparm_query: `alert_date>=${cutoffDateStr}`,
      sysparm_display_value: 'all',
      sysparm_limit: '50',
      sysparm_orderby_desc: 'alert_date',
      sysparm_fields: 'sys_id,license_id,days_before_expiry,channel,status,sent_at,alert_date'
    });
    
    return this.apiCall(`/api/now/table/${this.alertTable}?${params}`);
  }

  // Get license details by sys_id
  async getLicenseDetails(sysId) {
    const params = new URLSearchParams({
      sysparm_display_value: 'all'
    });
    
    const result = await this.apiCall(`/api/now/table/${this.licenseTable}/${sysId}?${params}`);
    return Array.isArray(result) ? result[0] : result;
  }

  // Get facility details by sys_id  
  async getFacilityDetails(sysId) {
    const params = new URLSearchParams({
      sysparm_display_value: 'all'
    });
    
    const result = await this.apiCall(`/api/now/table/${this.facilityTable}/${sysId}?${params}`);
    return Array.isArray(result) ? result[0] : result;
  }
}