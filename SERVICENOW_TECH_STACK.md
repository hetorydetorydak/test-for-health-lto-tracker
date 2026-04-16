# ServiceNow Development Tech Stack Guide

## Overview

This document provides a comprehensive guide to the ServiceNow development tech stack, languages, and essential information for AI-assisted development.

**📦 Current Application Status: BUILT & DEPLOYED**
- Application: **Test-for-LTO-Health-Tracker** 
- Scope: `x_1998335_testlto`
- Version: 1.0.0
- Build Status: ✅ Successfully compiled and packaged
- Deployment: ✅ Installed to ServiceNow instance

## What is ServiceNow?

ServiceNow is a cloud-based platform that provides digital workflows for enterprise operations. It's primarily used for:
- **IT Service Management (ITSM)** - Managing IT services and support
- **IT Operations Management (ITOM)** - Infrastructure and application monitoring
- **IT Business Management (ITBM)** - Project and portfolio management
- **Security Operations** - Security incident response and vulnerability management
- **HR Service Delivery** - Employee services and case management
- **Customer Service Management** - Customer support workflows
- **Custom Applications** - Building enterprise applications on the platform

## Core Technologies & Languages

### 1. ServiceNow Fluent DSL (Primary)
- **Language**: TypeScript-based Domain Specific Language
- **File Extension**: `.now.ts`
- **Purpose**: Define ServiceNow metadata (tables, business rules, ACLs, etc.) as code
- **Version**: 4.x (current project uses 4.6.0)

```typescript
// Example Fluent API usage
import '@servicenow/sdk/global'
import { Table, StringColumn } from '@servicenow/sdk/core'

export const my_table = Table({
    name: 'x_scope_my_table',
    schema: {
        name: StringColumn({ label: 'Name' })
    }
})
```

### 2. JavaScript (Server & Client Side)
- **Server-side**: Rhino JavaScript engine
- **Client-side**: Browser JavaScript
- **Usage**: Business logic, client scripts, UI actions
- **File Extension**: `.js`

### 3. HTML/CSS
- **Purpose**: Custom UI components, UI Pages
- **Integration**: Used within ServiceNow's UI framework

### 4. Jelly (ServiceNow Markup)
- **Purpose**: Legacy UI templating (less common in modern development)

## Key ServiceNow Metadata Types

### Tables & Fields
- **Tables**: Data storage structures
- **Columns**: Field definitions (String, Date, Reference, etc.)
- **Relationships**: Foreign keys and references between tables

### Business Logic
- **Business Rules**: Server-side scripts triggered by database operations
- **Client Scripts**: Client-side validation and UI manipulation
- **Script Includes**: Reusable server-side code libraries
- **Scheduled Scripts**: Automated background jobs

### User Interface
- **Forms**: Record editing interfaces
- **Lists**: Table view configurations
- **UI Pages**: Custom web pages and dashboards
- **UI Actions**: Buttons and links

### Security & Access
- **Access Control Lists (ACLs)**: Permission control
- **Roles**: User permission groups
- **Cross-Scope Privileges**: Inter-application permissions

### Integration & APIs
- **Scripted REST APIs**: Custom web service endpoints
- **Web Services**: SOAP/REST integrations

### Testing
- **Automated Test Framework (ATF)**: Automated testing suite

## Development Environment

### Required Tools
- **ServiceNow SDK**: Command-line development toolkit
- **Node.js**: Runtime for local development
- **TypeScript**: Language support for Fluent DSL
- **Git**: Version control

### Current Project Structure (Post-Build)
```
project/
├── now.config.json              # ServiceNow configuration
├── package.json                 # Dependencies and scripts
├── SERVICENOW_TECH_STACK.md    # This documentation
├── dist/                        # 📦 Build output directory
│   └── app/                     # Compiled application artifacts
│       ├── scope/               # Scope-level metadata
│       └── update/              # Update set files
├── target/                      # 📦 Deployment packages
│   └── x_1998335_test_for_lto_health_tracker_1_0_0.zip
└── src/
    ├── fluent/                  # Fluent DSL metadata definitions
    │   ├── generated/           # 🔧 Auto-generated files
    │   │   └── keys.ts          # ServiceNow object IDs mapping
    │   ├── example.now.ts       # Sample metadata definitions
    │   └── index.now.ts         # Main application metadata
    └── server/                  # JavaScript modules
        └── script.js            # Server-side scripts
```

### Configuration Files
- **now.config.json**: ServiceNow instance connection settings
- **package.json**: Node.js dependencies and build scripts

## Build & Deployment Process

### What Happens During "Build and Install"

#### 1. Build Phase (`npm run build`)
- **Compiles Fluent DSL** (`.now.ts` files) into ServiceNow metadata
- **Generates keys.ts** with ServiceNow object IDs for two-way sync
- **Creates dist/ folder** with compiled application artifacts
- **Validates syntax** and dependencies
- **Packages application** into deployable format

#### 2. Install/Deploy Phase
- **Creates deployment package** (`target/` folder with .zip file)
- **Uploads to ServiceNow instance** via ServiceNow SDK
- **Installs metadata** (tables, business rules, scripts, etc.)
- **Registers application** in the ServiceNow instance
- **Enables two-way synchronization** between code and instance

#### 3. Generated Files Explained

**`src/fluent/generated/keys.ts`**: 
```typescript
// Maps local metadata IDs to ServiceNow sys_ids
declare global {
    namespace Now {
        interface Keys extends KeysRegistry {
            explicit: {
                br0: { table: 'sys_script', id: '557d65ab18ce...' }
                cs0: { table: 'sys_script_client', id: '5a206b64...' }
            }
        }
    }
}
```

This file enables:
- **Consistent references** between local code and ServiceNow records
- **Two-way synchronization** capabilities
- **Safe metadata updates** without losing references

## Essential Concepts for AI Development

### 1. Naming Conventions
- **Scope Prefix**: All custom objects must include scope prefix (e.g., `x_1998335_testlto_table`)
- **System Names**: Lowercase, underscores, no spaces
- **Display Names**: Human-readable labels

### 2. Two-Way Synchronization
- Changes can be made in ServiceNow UI or code
- Sync keeps both environments consistent
- **Generated keys.ts maintains record relationships**
- Always sync before major changes

### 3. Application Scopes
- **Global**: Platform-provided functionality
- **Custom Scopes**: Application-specific namespaces (current: `x_1998335_testlto`)
- **Cross-Scope Access**: Controlled via privileges

### 4. Development Workflow (Updated)
1. **Design**: Plan metadata and relationships
2. **Develop**: Write Fluent DSL and scripts
3. **Build**: Compile and validate code ✅ **COMPLETED**
4. **Deploy**: Push changes to ServiceNow instance ✅ **COMPLETED**
5. **Test**: Validate functionality in ServiceNow UI
6. **Sync**: Pull any UI changes back to code
7. **Iterate**: Repeat cycle for new features

### 5. Common Patterns

#### Table Creation
```typescript
export const custom_table = Table({
    name: 'x_1998335_testlto_custom_table', // Note scope prefix
    extends: 'task', // Optional inheritance
    schema: {
        field_name: StringColumn({
            label: 'Field Label',
            maxLength: 100
        })
    }
})
```

#### Business Rule with ID Reference
```typescript
BusinessRule({
    $id: Now.ID['br0'], // References generated keys
    name: 'My Business Rule',
    table: 'x_1998335_testlto_custom_table',
    when: 'before',
    action: ['insert', 'update'],
    script: myFunction
})
```

#### Record Creation
```typescript
Record({
    $id: Now.ID['sample_record'],
    table: 'x_1998335_testlto_custom_table',
    data: {
        field_name: 'Sample Value'
    }
})
```

## Current Application Metadata

Based on the generated keys, this application includes:
- **Business Rules** (`sys_script` table)
- **Client Scripts** (`sys_script_client` table)  
- **Application Modules** (`sys_module` table) for navigation
- **File attachments** for server scripts

## AI Assistant Guidelines

### Essential Knowledge Areas
1. **ServiceNow Platform Fundamentals**
2. **Fluent DSL Syntax and Patterns**
3. **ServiceNow Data Model**
4. **Security and Access Control**
5. **Integration Capabilities**

### Post-Deployment Considerations
1. **Test in ServiceNow UI** to verify functionality
2. **Use Now.ID references** for consistent object linking
3. **Sync before making major changes** to avoid conflicts
4. **Monitor generated keys.ts** for new metadata IDs

### Best Practices for AI Assistance
1. **Always validate metadata exists** before referencing
2. **Follow naming conventions** strictly (include scope prefix)
3. **Use appropriate metadata types** for requirements
4. **Consider security implications** in design
5. **Plan for scalability** and maintenance
6. **Reference existing IDs** from keys.ts when available

### Common Pitfalls to Avoid
1. **Missing scope prefixes** in names (`x_1998335_testlto_`)
2. **Incorrect table references** in relationships
3. **Improper ACL configuration** leading to access issues
4. **Hardcoded values** instead of properties
5. **Ignoring existing metadata** and creating duplicates
6. **Not using Now.ID references** for deployed metadata

### Debugging and Troubleshooting
1. **Build errors**: Check syntax and imports
2. **Deployment failures**: Verify permissions and dependencies
3. **Runtime errors**: Review server logs and business rule execution
4. **Performance issues**: Optimize queries and reduce complexity
5. **Sync conflicts**: Check keys.ts for ID mismatches

## ServiceNow APIs and Imports

### Common Server-side APIs
```javascript
import { gs } from '@servicenow/glide'           // System utilities
import { GlideDateTime } from '@servicenow/glide' // Date operations
import { GlideRecord } from '@servicenow/glide'   // Database operations
```

### Client-side APIs
- **g_form**: Form manipulation
- **g_list**: List manipulation  
- **g_user**: User information
- **GlideAjax**: Server communication

## Resources and Documentation

### Official Documentation
- ServiceNow Developer Documentation
- Now SDK Documentation
- ServiceNow Community (Developer Program)

### Learning Path
1. ServiceNow Platform Basics
2. Application Development Fundamentals
3. Scripting in ServiceNow
4. Advanced Development Patterns
5. Integration and APIs

---

## Quick Reference Commands

### Development Commands
```bash
# Create new app
npm run create-app

# Build application
npm run build                    # ✅ Completed

# Deploy to instance  
npm run deploy                   # ✅ Completed

# Sync from instance (pull changes back to code)
npm run sync

# Development mode (watch for changes)
npm run dev
```

### File Operations
- **Metadata**: Create in `src/fluent/` with `.now.ts` extension
- **Scripts**: Create in `src/server/` with `.js` extension
- **Import pattern**: `Now.include('path/to/file')` for external files
- **ID References**: Use `Now.ID['key_name']` for deployed metadata

### Current Application Info
- **Name**: Test-for-LTO-Health-Tracker
- **Scope**: `x_1998335_testlto`
- **Status**: 🟢 Built and Deployed
- **Package**: `x_1998335_test_for_lto_health_tracker_1_0_0.zip`

This tech stack enables rapid, code-first development of enterprise applications on the ServiceNow platform with proper version control, testing, and deployment capabilities. **Your application is now live and ready for testing in ServiceNow!**