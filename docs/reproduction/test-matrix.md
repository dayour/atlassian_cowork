---
title: Controlled Test Matrix
sidebar_position: 2
---

The omitted-authorization claim needs a clean A/B test using unique names, manifest IDs, and Personal titles. See the [current A/B validation record](./dcr-ab-validation.md) for observed results and the remaining authentication gate; the run is not complete.

| Variable | A: documented omission | B: explicit Toolkit registration |
| --- | --- | --- |
| `mcpServerUrl` | Same v2 URL | Same v2 URL |
| Tool description | Same file | Same file |
| Manifest authorization | Omitted | `OAuthPluginVault` plus generated reference |
| Lifecycle DCR action | Absent | Present |
| App ID and display name | Unique A values | Unique B values |
| Scope | Personal | Personal |

## Evidence checkpoints

| Stage | Test | Passing evidence |
| --- | --- | --- |
| Resource challenge | Unauthenticated MCP request | 401 with `resource_metadata` |
| Resource metadata | Fetch RFC 9728 URL | Exact resource and issuer |
| Authorization metadata | Fetch discovered RFC 8414 URL | Registration endpoint and `S256` |
| Registration | Observe registration endpoint | POST and 201, with secrets redacted |
| Vault binding | Start Connect | Correct title and auth-config ID |
| Authorization | Inspect generated URL | Dynamic client ID, state, PKCE, callback |
| Consent | Accept at Atlassian | Callback code and matching state |
| Token exchange | Complete Cowork-owned callback | Successful token response, redacted |
| MCP access | Run read-only tool | Expected Jira site returned |
| Refresh | Wait through expiry | Refresh grant and successful MCP retry |

## Controls

- Use fresh app IDs and verify the selected Personal title ID against provisioning output. Disable competing Atlassian variants during each task; do not delete existing user installations without approval.
- Verify installed and enabled state after catalog propagation, and record unexpected duplicate or missing entries.
- Use a fresh browser profile for each variant.
- Capture network traces with secrets redacted.
- Do not infer registration from a consent screen alone.
- Repeat each variant at least twice to distinguish caching from deterministic behavior.

The original stale-title reproduction is **inconclusive**. The current isolated attempt and its remaining limitations are recorded separately. Until this matrix is completed, neither runtime DCR success nor a universal omission failure is established.
