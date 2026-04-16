import '@servicenow/sdk/global'
import { Table, ReferenceColumn, StringColumn, BooleanColumn, DateTimeColumn } from '@servicenow/sdk/core'

export const x_1998335_testlto_form_checklist = Table({
    name: 'x_1998335_testlto_form_checklist',
    label: 'Form Checklist',
    schema: {
        license_id: ReferenceColumn({
            label: 'License',
            referenceTable: 'x_1998335_testlto_license',
            mandatory: true
        }),
        form_name: StringColumn({
            label: 'Form Name',
            maxLength: 300,
            mandatory: true
        }),
        purpose: StringColumn({
            label: 'Purpose',
            maxLength: 500
        }),
        is_completed: BooleanColumn({
            label: 'Is Completed',
            default: false
        }),
        completed_at: DateTimeColumn({
            label: 'Completed At',
            read_only: true
        }),
        completed_by: ReferenceColumn({
            label: 'Completed By',
            referenceTable: 'sys_user',
            read_only: true
        })
    },
    display: 'form_name',
    extensible: false
})