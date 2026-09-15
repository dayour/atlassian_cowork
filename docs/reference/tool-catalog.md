---
title: MCP Tool Catalog
sidebar_position: 2
---

The static tool-description file exposes six gateway operations.

| Tool | Purpose | Read only | Destructive |
| --- | --- | ---: | ---: |
| `atlassianUserInfo` | Return the signed-in Atlassian identity | Yes | No |
| `getAccessibleAtlassianResources` | List sites and cloud IDs | Yes | No |
| `discover` | Search deferred Atlassian operations | Yes | No |
| `executeRead` | Run a discovered read operation | Yes | No |
| `executeWrite` | Run a non-destructive write | No | No |
| `executeDestructive` | Run a destructive operation | No | Yes |

Cowork uses standard MCP annotations to determine confirmation behavior. Every tool declares both `readOnlyHint` and `destructiveHint`; missing annotations may be treated conservatively as destructive.

For Jira workflows, call `discover` first because the Rovo v2 gateway defers the schemas for project-specific operations.