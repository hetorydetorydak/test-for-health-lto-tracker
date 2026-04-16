import '@servicenow/sdk/global'
import { Table, StringColumn, ChoiceColumn, ReferenceColumn, DateColumn, IntegerColumn } from '@servicenow/sdk/core'

export const x_1998335_testlto_license = Table({
    name: 'x_1998335_testlto_license',
    label: 'License',
    schema: {
        license_number: StringColumn({
            label: 'License Number',
            maxLength: 100,
            mandatory: true
        }),
        facility_id: ReferenceColumn({
            label: 'Facility',
            referenceTable: 'x_1998335_testlto_facility',
            mandatory: true
        }),
        license_type: ChoiceColumn({
            label: 'License Type',
            mandatory: true,
            choices: {
                doh_lto_main: { label: 'DOH LTO (Main)', sequence: 0 },
                olrs_radiology: { label: 'OLRS Variation — Radiology (X-Ray)', sequence: 1 },
                olrs_pharmacy: { label: 'OLRS Variation — Pharmacy', sequence: 2 }
            },
            dropdown: 'dropdown_with_none'
        }),
        issue_date: DateColumn({
            label: 'Issue Date',
            mandatory: true
        }),
        expiry_date: DateColumn({
            label: 'Expiry Date',
            mandatory: true
        }),
        status: ChoiceColumn({
            label: 'Status',
            read_only: true,
            choices: {
                active: { label: 'Active', sequence: 0 },
                expiring_soon: { label: 'Expiring Soon', sequence: 1 },
                expired: { label: 'Expired', sequence: 2 },
                under_renewal: { label: 'Under Renewal', sequence: 3 }
            }
        }),
        renewal_stage: ChoiceColumn({
            label: 'Renewal Stage',
            mandatory: true,
            default: 'not_started',
            choices: {
                not_started: { label: 'Not Started', sequence: 0 },
                documents_gathering: { label: 'Documents Gathering', sequence: 1 },
                submitted_to_doh: { label: 'Submitted to DOH', sequence: 2 },
                under_evaluation: { label: 'Under Evaluation', sequence: 3 },
                released: { label: 'Released', sequence: 4 }
            },
            dropdown: 'dropdown_with_none'
        }),
        days_before_expiry: IntegerColumn({
            label: 'Days Before Expiry',
            read_only: true
        }),
        checklist_pct: IntegerColumn({
            label: 'Checklist % Complete',
            read_only: true,
            min: 0,
            max: 100
        }),
        notes: StringColumn({
            label: 'Notes',
            maxLength: 1000
        })
    },
    display: 'license_number',
    extensible: false,
    accessible_from: 'public',
    caller_access: 'tracking',
    actions: ['create', 'read', 'update', 'delete'],
    allow_web_service_access: true
})