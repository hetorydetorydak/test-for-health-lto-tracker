import '@servicenow/sdk/global'
import { Role } from '@servicenow/sdk/core'

export const adminRole = Role({
    name: 'x_1998335_testlto.admin',
    description: 'Compliance Officer - Full CRUD on Facility, License, Checklist, Evidence. Read-only on Audit Log.'
})

export const viewerRole = Role({
    name: 'x_1998335_testlto.viewer',
    description: 'Compliance Viewer - Read-only access to all tables'
})