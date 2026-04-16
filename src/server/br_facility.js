import { gs, GlideDateTime, GlideDate, GlideRecord } from '@servicenow/glide'

/**
 * BR-F-01: Prevent Duplicate DOH License Numbers (Facility)
 */
export function checkDuplicateDohLicense(current, previous) {
    var gr = new GlideRecord('x_1998335_testlto_facility');
    gr.addQuery('doh_license_number', current.doh_license_number);
    if (!current.isNewRecord()) {
        gr.addQuery('sys_id', '!=', current.sys_id);
    }
    gr.query();
    if (gr.next()) {
        current.setAbortAction(true);
        gs.addErrorMessage('A facility with DOH License Number ' + current.doh_license_number + ' already exists.');
    }
}