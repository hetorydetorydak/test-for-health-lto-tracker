import '@servicenow/sdk/global'
import { Table, ReferenceColumn, IntegerColumn, ChoiceColumn, DateTimeColumn, DateColumn } from '@servicenow/sdk/core'

export const x_1998335_testlto_alert = Table({
    name: 'x_1998335_testlto_alert',
    label: 'Alert',
    schema: {
        license_id: ReferenceColumn({
            label: 'License',
            referenceTable: 'x_1998335_testlto_license',
            mandatory: true
        }),
        days_before_expiry: IntegerColumn({
            label: 'Days Before Expiry',
            mandatory: true
        }),
        channel: ChoiceColumn({
            label: 'Channel',
            mandatory: true,
            choices: {
                email: { label: 'Email', sequence: 0 },
                in_app: { label: 'In-App', sequence: 1 }
            },
            dropdown: 'dropdown_with_none'
        }),
        status: ChoiceColumn({
            label: 'Status',
            mandatory: true,
            choices: {
                sent: { label: 'Sent', sequence: 0 },
                failed: { label: 'Failed', sequence: 1 }
            },
            dropdown: 'dropdown_with_none'
        }),
        sent_at: DateTimeColumn({
            label: 'Sent At'
        }),
        alert_date: DateColumn({
            label: 'Alert Date',
            mandatory: true
        })
    },
    display: 'license_id',
    extensible: false,
    accessible_from: 'public',
    caller_access: 'tracking',
    actions: ['create', 'read', 'update', 'delete'],
    allow_web_service_access: true
})