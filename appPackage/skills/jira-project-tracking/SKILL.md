---
name: jira-project-tracking
description: |
  Creates and maintains realistic Jira software project tracking data through Atlassian Rovo MCP.
  Use when asked to seed the SWE or KAN boards, create project backlogs, update work item status,
  summarize delivery progress, validate Jira read/write behavior, or reproduce Cowork connector flows.
license: MIT
metadata:
  author: Darbot Labs
  version: "1.0"
---

# Jira Project Tracking

Use Atlassian Rovo MCP to manage the `SWE` Scrum project and `KAN` Kanban project on
the Jira Cloud site returned for the signed-in user.

## Workflow

1. Call `getAccessibleAtlassianResources` and ask the user to select a Jira Cloud site when more than one is returned.
2. Use `discover` to resolve the current schemas for `searchJiraIssuesUsingJql`,
   `listJiraProjectIssueTypesMetadata`, `createJiraIssue`, `editJiraIssue`, and
   `transitionJiraIssue`.
3. Before creating anything, search each project for the label `cowork-rovo-repro`.
4. Read `references/project-tracking-dataset.json` and match existing records by the
   `seedId` stored in the description and by exact summary. Never create a duplicate.
5. Inspect available issue types and workflows. Prefer the requested type and status;
   fall back to `Task` and the nearest available status when a project does not expose them.
6. Create missing parent records before their children. Preserve descriptions, priorities,
   labels, estimates, and acceptance criteria from the dataset where the Jira schema allows.
7. Use `executeWrite` for creates and edits. Use `executeRead` for searches and metadata.
   Use `transitionJiraIssue` only after retrieving valid transitions for that issue.
8. Return a concise table containing seed ID, Jira key, type, status, and whether the record
   was created, updated, or unchanged.

## Safety

- Never delete project data as part of seeding or synchronization.
- Ask for confirmation before bulk creation or status transitions.
- Keep all seeded records labeled `cowork-rovo-repro` and `demo-data`.
- Do not change unrelated issues, boards, workflows, permissions, or project settings.

## Reproduction Checks

After synchronization, verify these scenarios:

1. Search both projects by label and summarize status counts.
2. Read one completed SWE bug and one active KAN task by key.
3. Create a temporary comment on the designated validation issue, then edit that same comment.
4. Report whether a reconnect was required between read and write calls.
5. Record whether the granted token survives a new Cowork conversation.

## Resources

- `references/project-tracking-dataset.json` contains the canonical seed records.
- `references/repro-notes.md` contains expected results and known platform gaps.