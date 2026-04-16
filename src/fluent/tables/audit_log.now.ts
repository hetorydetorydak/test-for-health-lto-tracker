import '@servicenow/sdk/global'
import { Table, ReferenceColumn, StringColumn, DateTimeColumn } from '@servicenow/sdk/core'

export const x_1998335_testlto_audit_log = Table({
    name: 'x_1998335_testlto_audit_log',
    label: 'Audit Log',
    schema: {
        user_id: ReferenceColumn({
            label: 'Changed By',
            referenceTable: 'sys_user',
            mandatory: true
        }),
        license_id: ReferenceColumn({
            label: 'License',
            referenceTable: 'x_1998335_testlto_license'
        }),
        facility_id: ReferenceColumn({
            label: 'Facility',
            referenceTable: 'x_1998335_testlto_facility'
        }),
        action: StringColumn({
            label: 'Action',
            maxLength: 100,
            mandatory: true
        }),
        field_changed: StringColumn({
            label: 'Field Changed',
            maxLength: 100
        }),
        old_value: StringColumn({
            label: 'Old Value',
            maxLength: 1000
        }),
        new_value: StringColumn({
            label: 'New Value',
            maxLength: 1000
        }),
        changed_at: DateTimeColumn({
            label: 'Changed At',
            mandatory: true
        })
    },
    display: 'action',
    extensible: false,
    read_only: true
})