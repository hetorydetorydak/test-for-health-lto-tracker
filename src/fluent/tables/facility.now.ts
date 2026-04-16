import '@servicenow/sdk/global'
import { Table, StringColumn, ChoiceColumn, ReferenceColumn, BooleanColumn } from '@servicenow/sdk/core'

export const x_1998335_testlto_facility = Table({
    name: 'x_1998335_testlto_facility',
    label: 'Facility',
    schema: {
        name: StringColumn({
            label: 'Name',
            maxLength: 200,
            mandatory: true
        }),
        doh_license_number: StringColumn({
            label: 'DOH License Number',
            maxLength: 50,
            mandatory: true
        }),
        facility_type: ChoiceColumn({
            label: 'Facility Type',
            mandatory: true,
            choices: {
                hospital: { label: 'Hospital', sequence: 0 },
                dialysis_center: { label: 'Dialysis Center', sequence: 1 },
                clinical_lab: { label: 'Clinical Laboratory', sequence: 2 },
                radiology_center: { label: 'Radiology Center', sequence: 3 }
            },
            dropdown: 'dropdown_with_none'
        }),
        address: StringColumn({
            label: 'Address',
            maxLength: 500,
            mandatory: true
        }),
        compliance_officer_id: ReferenceColumn({
            label: 'Compliance Officer',
            referenceTable: 'sys_user',
            mandatory: true
        }),
        active: BooleanColumn({
            label: 'Active',
            default: true
        })
    },
    display: 'name',
    extensible: false,
    accessible_from: 'public',
    caller_access: 'tracking',
    actions: ['create', 'read', 'update', 'delete'],
    allow_web_service_access: true
})