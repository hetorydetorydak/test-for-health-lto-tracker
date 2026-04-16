import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'

// Import business rule functions
import { checkDuplicateDohLicense } from '../server/br_facility.js'
import { 
    computeStatusAndDays, 
    createChecklistItems, 
    preventBackwardTransition,
    validateExpiryOnReleased,
    writeAuditLogOnStageChange
} from '../server/br_license.js'
import { setCompletedFields, recomputeChecklistPct } from '../server/br_checklist.js'

// Import all components to ensure they are built
import './tables/facility.now.ts'
import './tables/license.now.ts'
import './tables/alert.now.ts'
import './tables/form_checklist.now.ts'
import './tables/evidence_file.now.ts'
import './tables/audit_log.now.ts'
import './roles/roles.now.ts'
import './acls/acls.now.ts'
import './menus/application_menu.now.ts'
import './scheduled_scripts/daily_alerts.now.ts'
import './sample_data.now.ts'
import './ui-pages/lto-dashboard.now.ts'

/**
 * BUSINESS RULES - FACILITY
 */

// BR-F-01: Prevent Duplicate DOH License Numbers
BusinessRule({
    $id: Now.ID['br_f_01'],
    name: 'LTO BR - Facility - Prevent Duplicate DOH License',
    table: 'x_1998335_testlto_facility',
    when: 'before',
    action: ['insert', 'update'],
    script: checkDuplicateDohLicense,
    active: true,
    order: 100
})

/**
 * BUSINESS RULES - LICENSE
 */

// BR-L-01: Compute License Status and Days Before Expiry
BusinessRule({
    $id: Now.ID['br_l_01'],
    name: 'LTO BR - License - Compute Status and Days',
    table: 'x_1998335_testlto_license',
    when: 'before',
    action: ['insert', 'update'],
    script: computeStatusAndDays,
    active: true,
    order: 100
})

// BR-L-02: Auto-Create Form Checklist Items on Insert
BusinessRule({
    $id: Now.ID['br_l_02'],
    name: 'LTO BR - License - Create Checklist Items',
    table: 'x_1998335_testlto_license',
    when: 'after',
    action: ['insert'],
    script: createChecklistItems,
    active: true,
    order: 100
})

// BR-L-03: Prevent Backward Stage Transitions
BusinessRule({
    $id: Now.ID['br_l_03'],
    name: 'LTO BR - License - Prevent Backward Transition',
    table: 'x_1998335_testlto_license',
    when: 'before',
    action: ['update'],
    condition: 'current.renewal_stage.changes()',
    script: preventBackwardTransition,
    active: true,
    order: 100
})

// BR-L-04: Validate Expiry Date When Marking Released
BusinessRule({
    $id: Now.ID['br_l_04'],
    name: 'LTO BR - License - Validate Expiry on Released',
    table: 'x_1998335_testlto_license',
    when: 'before',
    action: ['update'],
    condition: "current.renewal_stage == 'released' && current.renewal_stage.changes()",
    script: validateExpiryOnReleased,
    active: true,
    order: 100
})

// BR-L-05: Write Audit Log on Stage Change
BusinessRule({
    $id: Now.ID['br_l_05'],
    name: 'LTO BR - License - Audit Log Stage Change',
    table: 'x_1998335_testlto_license',
    when: 'after',
    action: ['update'],
    condition: 'current.renewal_stage.changes()',
    script: writeAuditLogOnStageChange,
    active: true,
    order: 100
})

/**
 * BUSINESS RULES - FORM CHECKLIST
 */

// BR-C-01: Auto-Set Completed Timestamp and User
BusinessRule({
    $id: Now.ID['br_c_01'],
    name: 'LTO BR - Checklist - Set Completed Fields',
    table: 'x_1998335_testlto_form_checklist',
    when: 'before',
    action: ['update'],
    condition: 'current.is_completed.changes()',
    script: setCompletedFields,
    active: true,
    order: 100
})

// BR-C-02: Recompute Checklist Percentage
BusinessRule({
    $id: Now.ID['br_c_02'],
    name: 'LTO BR - Checklist - Recompute Percentage',
    table: 'x_1998335_testlto_form_checklist',
    when: 'after',
    action: ['update', 'insert', 'delete'],
    script: recomputeChecklistPct,
    active: true,
    order: 100
})