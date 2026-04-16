import { gs, GlideDate, GlideDateTime, GlideRecord } from '@servicenow/glide'

/**
 * Daily Alert Generator - Scheduled Job
 * Runs daily at 06:00 AM PST to check for expiring licenses and create alert records
 */
export function dailyAlertGenerator() {
    var thresholds = [90, 60, 30, 7];
    var today = new GlideDate();
    today.setValue(gs.now());

    var licGR = new GlideRecord('x_1998335_testlto_license');
    licGR.addQuery('status', '!=', 'expired');
    licGR.addQuery('renewal_stage', '!=', 'released');
    licGR.query();

    while (licGR.next()) {
        var daysLeft = parseInt(licGR.days_before_expiry);
        
        for (var i = 0; i < thresholds.length; i++) {
            var threshold = thresholds[i];
            if (daysLeft !== threshold) continue;
            
            // Deduplication check
            var dupCheck = new GlideRecord('x_1998335_testlto_alert');
            dupCheck.addQuery('license_id', licGR.sys_id);
            dupCheck.addQuery('days_before_expiry', threshold);
            dupCheck.addQuery('alert_date', today.getValue());
            dupCheck.query();
            if (dupCheck.next()) continue;
            
            // Create Alert record
            var alert = new GlideRecord('x_1998335_testlto_alert');
            alert.initialize();
            alert.license_id = licGR.sys_id;
            alert.days_before_expiry = threshold;
            alert.channel = 'email';
            alert.status = 'sent';
            alert.sent_at = new GlideDateTime();
            alert.alert_date = today.getValue();
            alert.insert();
            
            // Email Notification fires on Alert record insert
            gs.log('LTO Alert created: License ' + licGR.license_number + ', ' + threshold + ' days before expiry.', 'LTO Tracker');
        }
    }
}