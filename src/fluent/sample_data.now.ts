import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// Sample Facility Record
export const sampleFacility = Record({
    $id: Now.ID['sample_facility_001'],
    table: 'x_1998335_testlto_facility',
    data: {
        name: 'Manila General Hospital',
        doh_license_number: 'DOH-NCR-001-2024',
        facility_type: 'hospital',
        address: '123 Health Street, Manila, Metro Manila, Philippines',
        compliance_officer_id: '6816f79cc0a8016401c5a33be04be441', // Admin user sys_id
        active: true
    }
})

// Sample License Record (expiring in 30 days)
export const sampleLicense = Record({
    $id: Now.ID['sample_license_001'],
    table: 'x_1998335_testlto_license',
    data: {
        license_number: 'LTO-2024-001',
        facility_id: '6816f79cc0a8016401c5a33be04be441', // Reference to facility (will be updated after facility is created)
        license_type: 'doh_lto_main',
        issue_date: '2024-01-15',
        expiry_date: '2025-02-15', // About 30 days from now (adjust as needed)
        renewal_stage: 'documents_gathering',
        notes: 'Primary LTO license for Manila General Hospital - currently gathering renewal documents'
    }
})