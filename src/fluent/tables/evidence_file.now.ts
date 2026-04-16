import '@servicenow/sdk/global'
import { Table, ReferenceColumn, StringColumn, ChoiceColumn, DateTimeColumn } from '@servicenow/sdk/core'

export const x_1998335_testlto_evidence_file = Table({
    name: 'x_1998335_testlto_evidence_file',
    label: 'Evidence File',
    schema: {
        license_id: ReferenceColumn({
            label: 'License',
            referenceTable: 'x_1998335_testlto_license',
            mandatory: true
        }),
        file_name: StringColumn({
            label: 'File Name',
            maxLength: 300,
            mandatory: true
        }),
        attachment_sys_id: StringColumn({
            label: 'Attachment',
            maxLength: 32
        }),
        file_type: ChoiceColumn({
            label: 'File Type',
            mandatory: true,
            choices: {
                form: { label: 'Form', sequence: 0 },
                receipt: { label: 'Receipt', sequence: 1 },
                certificate: { label: 'Certificate', sequence: 2 },
                inspection_report: { label: 'Inspection Report', sequence: 3 },
                other: { label: 'Other', sequence: 4 }
            },
            dropdown: 'dropdown_with_none'
        }),
        uploaded_by: ReferenceColumn({
            label: 'Uploaded By',
            referenceTable: 'sys_user',
            mandatory: true,
            read_only: true
        }),
        uploaded_at: DateTimeColumn({
            label: 'Uploaded At',
            mandatory: true,
            read_only: true
        })
    },
    display: 'file_name',
    extensible: false
})