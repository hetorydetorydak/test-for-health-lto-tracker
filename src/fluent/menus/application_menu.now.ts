import '@servicenow/sdk/global'
import { ApplicationMenu, Record } from '@servicenow/sdk/core'

// Create Application Menu Category
export const ltoAppCategory = Record({
    $id: Now.ID['lto_app_category'],
    table: 'sys_app_category',
    data: {
        name: 'Compliance',
        style: 'border-color: #0066cc; background-color: #e6f2ff;'
    }
})

// Create main LTO Tracker Application Menu
export const ltoApplicationMenu = ApplicationMenu({
    $id: Now.ID['lto_app_menu'],
    title: 'LTO Tracker',
    hint: 'Health Online LTO & Ancillary Licensing Tracker',
    description: 'ServiceNow application for managing Philippine DOH License to Operate renewals and OLRS ancillary variations',
    category: ltoAppCategory,
    active: true,
    order: 100
})

// Dashboard Module - Direct link to UI Page
export const dashboardModule = Record({
    $id: Now.ID['lto_module_dashboard'],
    table: 'sys_app_module',
    data: {
        title: 'Dashboard',
        application: ltoApplicationMenu,
        link_type: 'DIRECT',
        query: 'x_1998335_testlto_lto_dashboard.do',
        hint: 'LTO Compliance Dashboard - View stats and expiring licenses',
        active: true,
        order: 100
    }
})

// All Facilities Module
export const allFacilitiesModule = Record({
    $id: Now.ID['lto_module_all_facilities'],
    table: 'sys_app_module',
    data: {
        title: 'All Facilities',
        application: ltoApplicationMenu,
        link_type: 'LIST',
        name: 'x_1998335_testlto_facility',
        hint: 'View all healthcare facilities',
        active: true,
        order: 210
    }
})

// All Licenses Module
export const allLicensesModule = Record({
    $id: Now.ID['lto_module_all_licenses'],
    table: 'sys_app_module',
    data: {
        title: 'All Licenses',
        application: ltoApplicationMenu,
        link_type: 'LIST',
        name: 'x_1998335_testlto_license',
        hint: 'View all licenses',
        active: true,
        order: 310
    }
})

// Expiring Soon Module
export const expiringSoonModule = Record({
    $id: Now.ID['lto_module_expiring_soon'],
    table: 'sys_app_module',
    data: {
        title: 'Expiring Soon',
        application: ltoApplicationMenu,
        link_type: 'LIST',
        name: 'x_1998335_testlto_license',
        filter: 'status=expiring_soon',
        hint: 'Licenses expiring within 90 days',
        active: true,
        order: 320
    }
})

// Alerts Module
export const alertsModule = Record({
    $id: Now.ID['lto_module_alerts'],
    table: 'sys_app_module',
    data: {
        title: 'Alerts',
        application: ltoApplicationMenu,
        link_type: 'LIST',
        name: 'x_1998335_testlto_alert',
        hint: 'View all system-generated alerts',
        active: true,
        order: 400
    }
})

// Audit Log Module
export const auditLogModule = Record({
    $id: Now.ID['lto_module_audit_log'],
    table: 'sys_app_module',
    data: {
        title: 'Audit Log',
        application: ltoApplicationMenu,
        link_type: 'LIST',
        name: 'x_1998335_testlto_audit_log',
        hint: 'View all system audit entries',
        active: true,
        order: 500
    }
})