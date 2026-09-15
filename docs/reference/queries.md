---
title: Queries and Prompts
sidebar_position: 4
---

## Connection smoke test

```text
Use the Atlassian Rovo connector to call getAccessibleAtlassianResources.
This is a read-only connection test. Do not create, update, transition, or delete anything.
```

## Read-only dataset verification

```text
Using Atlassian Rovo, search the SWE and KAN projects for issues labeled
cowork-rovo-repro and demo-data. Return counts by project and status, then list
seedId, issue key, type, summary, and status. Make no Jira changes.
```

Equivalent JQL:

```text
project in (SWE, KAN)
AND labels = "cowork-rovo-repro"
AND labels = "demo-data"
ORDER BY project, key
```

## Idempotent synchronization

```text
Use the Jira Project Tracking skill to compare the canonical dataset with SWE
and KAN. Show proposed creates, edits, and transitions before making changes.
Never delete issues and never create a record when its seedId already exists.
```

## Refresh-token check

Run the smoke test, leave the title connected beyond access-token expiry, then start a new Cowork task and repeat it. Record whether consent appears and whether network evidence shows a refresh grant. Do not infer refresh solely from a successful immediate second call.

## Metadata query

```powershell
./scripts/check-oauth-metadata.ps1
```

The script prints endpoints and capability flags only. It does not register clients or request tokens.