---
title: Runtime DCR A/B Validation
sidebar_position: 3
---

## Status: B authenticated read passed; runtime omission DCR unverified

Test run `3c0b495a` began on September 16, 2026 UTC (September 15 local time). Two fresh Personal apps were provisioned from the same v1.1.2 source. The explicit-registration B control completed an authenticated read with a successful server-recorded tool event tied to B's exact Personal title. This does not establish automatic runtime DCR for omitted authorization.

## Input and identity checks

| Check | A: `Rovo A 3c0b495a` | B: `Rovo B 3c0b495a` |
| --- | --- | --- |
| Environment | New, no copied deployment IDs or secrets | New, no copied deployment IDs or secrets |
| Publication scope | Personal | Personal |
| Manifest `authorization` | Entirely absent in published ZIP | `OAuthPluginVault` with newly generated reference |
| Provisioning `dcr/register` | Absent; four lifecycle actions | Present; five lifecycle actions |
| MCP URL | `https://mcp.atlassian.com/v2/mcp` | Same |
| Tool catalog SHA256 | `7f6497d8dfaf8d11d0d60ad3e0899b8091da7966007f94e905ba7c0f672e084d` | Same |
| App and title IDs | Newly created, distinct from B | Newly created, distinct from A |
| Selected title | Detail-route title ID matched provisioning output; toggle telemetry matched | Detail-route title ID matched provisioning output |

Actual deployment identities remain in the ignored local test directory. Duplicate discovery cards were observed; their names were not used as the sole identity check.

## Observed results

### A: omission

- Acquired the verified title; the acquisition endpoint returned HTTP 200 with its matching title ID.
- Enabled A while B was disabled. The installed list contained A, B, and Fabric IQ; the previously displayed Atlassian Rovo entry was no longer present. No uninstall or removal of the old app was performed by the test.
- The MCP server appeared in the plugin details, but there was no Connect control.
- Submitted a new task requesting only A's `getAccessibleAtlassianResources`, prohibiting other plugins, browser/shell fallback, cached data, and writes.
- The task completed reporting that only `rovo-a-3c0b495a:jira-project-tracking` was available and that no callable Atlassian MCP tool or connection request was exposed. This is an observed task-level tool-availability failure, not a captured MCP 401 or DCR registration failure. The task's explanation is not independent server-side telemetry.
- No authenticated MCP result was obtained.
- A second fresh task was submitted using the verified Send arrow after enabling A and disabling B and Fabric IQ. It completed with the same reported tool absence and no connection request. The exact A title again had no Connect or Disconnect control.

### B: explicit registration

- Disabled A, selected B by its matching title ID, and enabled B.
- B exposed a Connect control. Its `signInInfo` endpoint returned HTTP 200.
- Cowork generated an Atlassian authorization URL containing state and PKCE parameters. No token or authorization-code values are included here.
- The integrated browser did not open the authorization popup. A direct popup-open check returned `null`.
- Opening the generated URL in a separate tab reached Atlassian consent. After acceptance, the Microsoft callback displayed **Connection Didn't Complete**. This manually opened tab did not preserve the normal popup context and cannot establish that the native connection flow fails.
- A fresh shared-page native Connect retry did not produce an authorization page accessible to the shared browser tools.
- A new read-only task scoped to B completed reporting only `rovo-b-3c0b495a:jira-project-tracking`, no callable MCP tools, and no connection request. No actual MCP execution/result was observed; the task explanation is not independent server-side telemetry.
- The earlier disconnected control also lacked callable tools, so those task results alone do not establish an omission-specific failure in A.
- After the operator reported enabling both plugins, a new shared-page check verified B's exact title and waited for its connection check to finish. The MCP section then displayed **Disconnect**, establishing a connected UI state. This supersedes the earlier disconnected observation, but is not proof of MCP execution or token refresh.
- A's exact title was checked again; its MCP section still had no connection control. A was disabled temporarily to isolate the connected B control.
- Correction: the claim that the page had no Send control and blocked submission was unsupported. The operator identified the arrow as Send. The subsequently inspected task contained the exact connected B retest prompt and a completed response. It reported no callable MCP tools; no actual MCP execution/result was observed. Browser CORS diagnostics did not establish a submission blocker and must not be treated as its cause.
- A second connected retest was submitted using the Send arrow after verifying B's exact title, Disconnect control, and enabled switch, with A and Fabric IQ disabled. It completed reporting no MCP tools. The response listed both the B-specific and `atlassian-rovo` skill names; skill visibility is not proof that an additional connector was enabled or invoked.

## Follow-up: persisted isolation and successful B execution

Both unchanged fixtures passed `atk validate --env dev -i false -f .dcr-tests/3c0b495a/<variant>`: manifest schema and package validation passed. The fixture generator was exercised separately without provisioning any additional apps.

Allowing B's `jira-project-tracking` skill to load did not initially restore its MCP tools. Subsequent inspection of `/v1/plugins` and `/v1/settings` found the original Atlassian Rovo installation present and enabled alongside B. Earlier claims of full isolation based on visible cards are therefore not reliable. A separate legacy enabled settings entry was absent from the installed list and its detail route redirected to the catalog; it was not uninstalled or modified.

After disabling the original installation, the installed-plugin and settings responses showed B enabled, A and the original disabled, and Fabric IQ disabled. The unchanged B package then completed `getAccessibleAtlassianResources` in a fresh task. The task returned one accessible cloud resource; customer identifiers are omitted here. Cowork's saved `/v1/tasks/live/messages` response independently recorded:

```json
{
	"event": "tx",
	"name": "mcp__atlassian-rovo__Get accessible Atlassian resources",
	"ok": true,
	"durationMs": 400,
	"pluginIdentity": "exact match to B's provisioned Personal title"
}
```

This is a redacted summary of the event fields (`tn`, `ok`, `dur`, `pkid`), not a raw server payload. Both the tool-start and tool-completion `pkid` values matched B. No writes were requested or observed. Success followed improved isolation; this temporal association alone does not prove a duplicate-connector root cause.

The plugin-details endpoint returned HTTP 200 for B with empty skill/connector arrays and false capability flags, while `/v1/plugins` listed its skill and connector. Since the same B subsequently executed successfully, the empty details response is not sufficient evidence of failed connector ingestion. The installed list is necessary context.

## Repeat-test verdict

| Gate | Result |
| --- | --- |
| Fresh distinct Personal app identities and identical URL/catalog | Verified from packages and selected title identities |
| A has no authorization object or provisioning registration | Verified; inputs were not changed during runtime tests |
| B connected UI | Verified, including after the repeat tasks |
| New read-only task attempts | Two A attempts and two connected B attempts completed; earlier disconnected B attempt retained separately |
| Actual authenticated MCP execution/result | B passed with successful tool completion attributed to its exact Personal title; A not yet established |
| Runtime DCR, refresh after expiry, CIMD | Not established |

The initial no-tools tasks remain historical observations, not captured OAuth rejections. B's later successful execution supersedes the earlier incomplete-control verdict. No server-side registration or token-exchange trace was available. At the end of the initial repeats, B and Fabric IQ were enabled and A disabled; follow-up tests temporarily changed those switches for isolation. No connection was disconnected or app uninstalled during these tests.

## Remaining gate

The separate browser MCP tool failed with `page._snapshotForAI is not a function`. A standalone Chromium attempt was stopped. The operator requires shared browser tools only: do not launch standalone browsers, expose remote-debugging ports, import authentication state, or manually replay callback URLs.

Task submission is verified. Repeat the unchanged omission variant with persisted installed-plugin isolation, then correlate its title/task IDs with registration and token-exchange diagnostics. The local ignored record contains exact identities for support; do not include credentials or raw authentication URLs. B now has a passing authenticated read, not merely a consent screen or connected UI. Fresh-profile isolation, refresh after token expiry, and CIMD remain unverified. Do not interpret a missing browser-side registration request as proof that no server-side registration occurred.

## Reproduce the isolated inputs

From a source checkout with documentation dependencies installed:

```powershell
node scripts/prepare-dcr-ab.cjs
```

The script generates a new run directory under `.dcr-tests/`, validates the two authorization shapes and identical tool catalogs, and initializes runtime results as `NOT RUN`. It does not provision anything itself. For the returned run ID, provision each variant separately with Toolkit using Personal-only generated lifecycles:

```powershell
atk provision --env dev -i false -f .dcr-tests/<run-id>/A
atk provision --env dev -i false -f .dcr-tests/<run-id>/B
```

Provisioning creates Microsoft 365 test apps; B also creates a DCR configuration. Keep generated environments, browser profiles, and raw authentication traces out of source control. Package checks are input validation, not runtime authentication evidence.
