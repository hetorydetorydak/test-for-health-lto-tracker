import { gs, GlideDateTime, GlideDate, GlideRecord } from '@servicenow/glide'

/**
 * BR-L-01: Compute License Status and Days Before Expiry
 */
export function computeStatusAndDays(current, previous) {
    // Compute days_before_expiry
    var today = new GlideDateTime();
    today.setDisplayValueInternal(gs.nowDateTime());
    var expiryGDT = new GlideDateTime(current.expiry_date + ' 00:00:00');
    var diffMs = expiryGDT.getNumericValue() - today.getNumericValue();
    var daysLeft = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    current.days_before_expiry = daysLeft;

    // Compute status
    var stage = current.renewal_stage.toString();
    if (stage !== 'not_started' && stage !== 'released') {
        current.status = 'under_renewal';
    } else if (daysLeft < 0) {
        current.status = 'expired';
    } else if (daysLeft <= 90) {
        current.status = 'expiring_soon';
    } else {
        current.status = 'active';
    }
}

/**
 * BR-L-02: Auto-Create Form Checklist Items on Insert
 */
export function createChecklistItems(current, previous) {
    var forms = [];
    var lt = current.license_type.toString();

    if (lt === 'doh_lto_main') {
        forms = [
            { name: 'DOH LTO Application Form', purpose: 'Primary application form for DOH License to Operate' },
            { name: 'Certificate of Compliance (COC) from PhilHealth', purpose: 'PhilHealth accreditation compliance certificate' },
            { name: 'Fire Safety Inspection Certificate (FSIC)', purpose: 'BFP-issued fire safety clearance' },
            { name: 'Sanitary Permit', purpose: 'LGU-issued sanitary permit' },
            { name: 'Building Permit / Occupancy Certificate', purpose: 'Proof of legal occupancy of facility premises' },
            { name: 'List of Medical Personnel with PRC IDs', purpose: 'Complete roster of licensed medical staff' },
            { name: 'Organizational Chart', purpose: 'Facility organizational structure' }
        ];
    } else if (lt === 'olrs_radiology') {
        forms = [
            { name: 'OLRS Radiology Application Form', purpose: 'OLRS application form for radiology variation' },
            { name: 'Radiation Safety Officer (RSO) Certificate', purpose: 'Certification of designated Radiation Safety Officer' },
            { name: 'Radiation Source Inventory', purpose: 'Complete list of radiation-emitting equipment' },
            { name: 'DOH Regional Office Inspection Report', purpose: 'Latest DOH regional inspection clearance' },
            { name: 'Equipment Registration Certificate', purpose: 'Registration of x-ray and imaging equipment' }
        ];
    } else if (lt === 'olrs_pharmacy') {
        forms = [
            { name: 'OLRS Pharmacy Application Form', purpose: 'OLRS application form for pharmacy variation' },
            { name: 'FDA Certificate of Product Registration', purpose: 'FDA clearance for pharmaceutical products handled' },
            { name: 'Pharmacist License (PRC ID)', purpose: 'Valid PRC ID of the responsible pharmacist' },
            { name: 'Drug Enforcement Agency (DEA) Registration', purpose: 'DEA registration for controlled substances' },
            { name: 'Pharmacy Layout / Floor Plan', purpose: 'Approved pharmacy floor plan and dispensing area layout' }
        ];
    }

    for (var i = 0; i < forms.length; i++) {
        var gr = new GlideRecord('x_1998335_testlto_form_checklist');
        gr.initialize();
        gr.license_id = current.sys_id;
        gr.form_name = forms[i].name;
        gr.purpose = forms[i].purpose;
        gr.is_completed = false;
        gr.insert();
    }
}

/**
 * BR-L-03: Prevent Backward Stage Transitions
 */
export function preventBackwardTransition(current, previous) {
    var stageOrder = {
        'not_started': 0,
        'documents_gathering': 1,
        'submitted_to_doh': 2,
        'under_evaluation': 3,
        'released': 4
    };

    var oldStage = previous.renewal_stage.toString();
    var newStage = current.renewal_stage.toString();

    if (stageOrder[newStage] < stageOrder[oldStage]) {
        current.setAbortAction(true);
        gs.addErrorMessage('Renewal stage cannot be moved backward. Current stage: ' + previous.renewal_stage.getDisplayValue());
    }
}

/**
 * BR-L-04: Validate Expiry Date When Marking Released
 */
export function validateExpiryOnReleased(current, previous) {
    if (current.renewal_stage.toString() === 'released' && current.renewal_stage.changes()) {
        var today = new GlideDate();
        today.setValue(gs.now());
        var expiry = new GlideDate();
        expiry.setValue(current.expiry_date);
        if (expiry.compareTo(today) <= 0) {
            current.setAbortAction(true);
            gs.addErrorMessage('Before marking as Released, please update the Expiry Date to the new license validity date (must be a future date).');
        }
    }
}

/**
 * BR-L-05: Write Audit Log on Stage Change
 */
export function writeAuditLogOnStageChange(current, previous) {
    var log = new GlideRecord('x_1998335_testlto_audit_log');
    log.initialize();
    log.user_id = gs.getUserID();
    log.license_id = current.sys_id;
    log.action = 'Stage Updated';
    log.field_changed = 'renewal_stage';
    log.old_value = previous.renewal_stage.getDisplayValue();
    log.new_value = current.renewal_stage.getDisplayValue();
    log.changed_at = new GlideDateTime();
    log.insert();
}