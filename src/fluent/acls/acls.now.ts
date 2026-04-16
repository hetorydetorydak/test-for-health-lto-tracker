import '@servicenow/sdk/global'
import { Acl } from '@servicenow/sdk/core'
import { adminRole, viewerRole } from '../roles/roles.now.ts'

/**
 * FACILITY TABLE ACLs
 */

// Facility - Read Access
Acl({
    $id: Now.ID['acl_facility_read'],
    active: true,
    type: 'record',
    table: 'x_1998335_testlto_facility',
    operation: 'read',
    roles: [adminRole, viewerRole],
    admin_overrides: true
})

// Facility - Create Access (admin only)
Acl({
    $id: Now.ID['acl_facility_create'],
    active: true,
    type: 'record',
    table: 'x_1998335_testlto_facility',
    operation: 'create',
    roles: [adminRole],
    admin_overrides: true
})

// Facility - Write Access (admin only)
Acl({
    $id: Now.ID['acl_facility_write'],
    active: true,
    type: 'record',
    table: 'x_1998335_testlto_facility',
    operation: 'write',
    roles: [adminRole],
    admin_overrides: true
})

// Facility - Delete Access (admin only)
Acl({
    $id: Now.ID['acl_facility_delete'],
    active: true,
    type: 'record',
    table: 'x_1998335_testlto_facility',
    operation: 'delete',
    roles: [adminRole],
    admin_overrides: true
})

/**
 * LICENSE TABLE ACLs
 */

// License - Read Access
Acl({
    $id: Now.ID['acl_license_read'],
    active: true,
    type: 'record',
    table: 'x_1998335_testlto_license',
    operation: 'read',
    roles: [adminRole, viewerRole],
    admin_overrides: true
})

// License - Create Access (admin only)
Acl({
    $id: Now.ID['acl_license_create'],
    active: true,
    type: 'record',
    table: 'x_1998335_testlto_license',
    operation: 'create',
    roles: [adminRole],
    admin_overrides: true
})

// License - Write Access (admin only)
Acl({
    $id: Now.ID['acl_license_write'],
    active: true,
    type: 'record',
    table: 'x_1998335_testlto_license',
    operation: 'write',
    roles: [adminRole],
    admin_overrides: true
})

// License - Delete Access (admin only)
Acl({
    $id: Now.ID['acl_license_delete'],
    active: true,
    type: 'record',
    table: 'x_1998335_testlto_license',
    operation: 'delete',
    roles: [adminRole],
    admin_overrides: true
})

/**
 * FORM CHECKLIST TABLE ACLs
 */

// Form Checklist - Read Access
Acl({
    $id: Now.ID['acl_checklist_read'],
    active: true,
    type: 'record',
    table: 'x_1998335_testlto_form_checklist',
    operation: 'read',
    roles: [adminRole, viewerRole],
    admin_overrides: true
})

// Form Checklist - Write Access (admin only)
Acl({
    $id: Now.ID['acl_checklist_write'],
    active: true,
    type: 'record',
    table: 'x_1998335_testlto_form_checklist',
    operation: 'write',
    roles: [adminRole],
    admin_overrides: true
})

/**
 * EVIDENCE FILE TABLE ACLs
 */

// Evidence File - Read Access
Acl({
    $id: Now.ID['acl_evidence_read'],
    active: true,
    type: 'record',
    table: 'x_1998335_testlto_evidence_file',
    operation: 'read',
    roles: [adminRole, viewerRole],
    admin_overrides: true
})

// Evidence File - Write Access (admin only)
Acl({
    $id: Now.ID['acl_evidence_write'],
    active: true,
    type: 'record',
    table: 'x_1998335_testlto_evidence_file',
    operation: 'write',
    roles: [adminRole],
    admin_overrides: true
})

/**
 * ALERT TABLE ACLs
 */

// Alert - Read Access
Acl({
    $id: Now.ID['acl_alert_read'],
    active: true,
    type: 'record',
    table: 'x_1998335_testlto_alert',
    operation: 'read',
    roles: [adminRole, viewerRole],
    admin_overrides: true
})

/**
 * AUDIT LOG TABLE ACLs
 */

// Audit Log - Read Access (both roles, no write access for anyone)
Acl({
    $id: Now.ID['acl_audit_read'],
    active: true,
    type: 'record',
    table: 'x_1998335_testlto_audit_log',
    operation: 'read',
    roles: [adminRole, viewerRole],
    admin_overrides: true
})

/**
 * FIELD-LEVEL ACLs (computed fields should be read-only)
 */

// License Status Field - Read Only
Acl({
    $id: Now.ID['acl_license_status_field'],
    active: true,
    type: 'record',
    table: 'x_1998335_testlto_license',
    field: 'status',
    operation: 'write',
    script: 'answer = false;', // Always deny write access - computed field
    admin_overrides: false
})

// License Days Before Expiry Field - Read Only
Acl({
    $id: Now.ID['acl_license_days_field'],
    active: true,
    type: 'record',
    table: 'x_1998335_testlto_license',
    field: 'days_before_expiry',
    operation: 'write',
    script: 'answer = false;', // Always deny write access - computed field
    admin_overrides: false
})

// License Checklist Pct Field - Read Only
Acl({
    $id: Now.ID['acl_license_checklist_pct_field'],
    active: true,
    type: 'record',
    table: 'x_1998335_testlto_license',
    field: 'checklist_pct',
    operation: 'write',
    script: 'answer = false;', // Always deny write access - computed field
    admin_overrides: false
})