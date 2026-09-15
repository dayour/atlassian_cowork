---
title: Jira Skill and Dataset
sidebar_position: 3
---

The `jira-project-tracking` skill creates and maintains a realistic Scrum and Kanban dataset while remaining idempotent.

## Workflow

1. Resolve the Jira cloud ID with `getAccessibleAtlassianResources`.
2. Discover current read, create, edit, and transition schemas.
3. Search for the `cowork-rovo-repro` label before writes.
4. Match records by stable `seedId` and exact summary.
5. Create parent records before children.
6. Request confirmation before bulk creation or transitions.
7. Return created, updated, and unchanged records.

## Canonical dataset

The dataset contains 20 records:

| Project | Model | Records | Expected distribution |
| --- | --- | ---: | --- |
| SWE | Scrum | 10 | 3 To Do, 3 In Progress, 4 Done |
| KAN | Kanban | 10 | 7 To Do, 2 In Progress, 1 Done |

`SWE-1` is an epic parent for the remaining SWE work. KAN items are independent flow records. Every seeded issue uses `cowork-rovo-repro` and `demo-data` labels.

## Safety model

- Never delete as part of synchronization.
- Never modify unrelated issues or project settings.
- Read current transitions before changing status.
- Prefer unchanged results over duplicate creation.