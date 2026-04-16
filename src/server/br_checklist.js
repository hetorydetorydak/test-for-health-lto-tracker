import { gs, GlideDateTime, GlideRecord } from '@servicenow/glide'

/**
 * BR-C-01: Auto-Set Completed Timestamp and User (Checklist)
 */
export function setCompletedFields(current, previous) {
    if (current.is_completed.toString() === 'true') {
        current.completed_at = new GlideDateTime();
        current.completed_by = gs.getUserID();
    } else {
        current.completed_at = '';
        current.completed_by = '';
    }
}

/**
 * BR-C-02/BR-C-03: Checklist Pct Recomputation (License)
 */
export function recomputeChecklistPct(current, previous) {
    var total = 0, completed = 0;
    var gr = new GlideRecord('x_1998335_testlto_form_checklist');
    gr.addQuery('license_id', current.license_id);
    gr.query();
    while (gr.next()) {
        total++;
        if (gr.is_completed.toString() === 'true') completed++;
    }
    var pct = (total > 0) ? Math.round((completed / total) * 100) : 0;

    var lic = new GlideRecord('x_1998335_testlto_license');
    if (lic.get(current.license_id)) {
        lic.checklist_pct = pct;
        lic.update();
    }
}