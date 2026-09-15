---
title: Reproduction Overview
sidebar_position: 1
---

This guide reproduces the Atlassian Rovo MCP v2 connection in Microsoft 365 Copilot Cowork using explicit Dynamic Client Registration through Microsoft 365 Agents Toolkit.

For the complete version-specific procedure, see [DCR Enabled Build v1.1.2](dcr-enabled-build-v1-1-2.md): fix details, configuration, generated ZIP inspection, Personal installation, manual upload, tenant publication, and verification limits.

## Prerequisites

- Node.js 20 or later
- Microsoft 365 Agents Toolkit CLI 1.1.16 or later
- A Microsoft 365 test tenant that permits custom app acquisition
- An Atlassian account with access to a Jira Cloud site
- PowerShell 7 for the metadata script

## Provision and validate

```powershell
npm install
Copy-Item env/.env.dev.example env/.env.dev
atk auth login m365
atk provision --env dev --interactive false
atk validate --env dev --interactive false
```

Provision only in a test tenant. Generated environment files can contain deployment identifiers and are excluded from Git.

Provisioning performs DCR before packaging so `${{ATLASSIAN_ROVO_DCR_V2_CONFIGURATION_ID}}` can be substituted into the manifest.

## Connect and verify

1. Open Cowork and enable only the Personal `Atlassian Rovo` title.
2. Select **Connect** and complete Atlassian consent.
3. Start a new task and run `getAccessibleAtlassianResources`.
4. Confirm the result includes the expected Jira Cloud site.
5. Run a read-only JQL query before testing writes.

Use a test Jira site. The included skill requires confirmation before bulk writes, avoids destructive calls, and uses stable seed IDs to prevent duplicates.
