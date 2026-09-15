# Reproduction Results

Date: 2026-09-14

## Environment

- Microsoft 365 account: redacted test user
- Microsoft 365 tenant ID: redacted
- Agents Toolkit: `1.1.16`
- Atlassian site: redacted Jira Cloud test site
- Rovo MCP endpoint: `https://mcp.atlassian.com/v2/mcp`

## Provisioned Resources

- Developer Portal app ID: redacted
- Personal Microsoft 365 title ID: redacted
- Removed stale shared title ID: redacted
- Microsoft 365 app ID: redacted
- Package version: `1.1.2`
- Scope: Personal

A fresh DCR registration was created against Atlassian's resource-specific v2 authorization-server metadata. The manifest references that registration through `OAuthPluginVault`. The final package and manifest passed Agents Toolkit validation.

## Jira Dataset

Twenty records were created with labels `cowork-rovo-repro` and `demo-data`.

| Project | Keys | To Do | In Progress | Done |
| --- | --- | ---: | ---: | ---: |
| SWE | SWE-1 through SWE-10 | 3 | 3 | 4 |
| KAN | KAN-1 through KAN-10 | 7 | 2 | 1 |

`SWE-1` is the parent epic. `SWE-2` through `SWE-10` are linked to it. KAN records are independent flow items.

## Reproduced Findings

1. Open-plugin import inferred `OAuthPluginVault` but emitted a placeholder reference ID and did not inject DCR provisioning.
2. Adding the Toolkit `dcr/register` action successfully created the OAuth configuration.
3. The generated deterministic manifest ID did not match the app created by `teamsApp/create`; `${{TEAMS_APP_ID}}` fixed the update failure.
4. Publication rejected `./tools/atlassian-rovo-tools.json` as missing even though it existed in the ZIP. The exact ZIP-relative path `tools/atlassian-rovo-tools.json` succeeded.
5. Reacquiring an updated title at the same version failed. Incrementing the package from `1.0.0` to `1.1.0` succeeded.
6. Atlassian metadata advertises `offline_access` and the `refresh_token` grant, but Toolkit's DCR action has no scope input.
7. `atk launchinfo` returned `NotFound` immediately after successful title acquisition.
8. Darbot Browser MCP could list authenticated tabs but its page interaction layer failed with `page._snapshotForAI is not a function`. Jira creation was completed through the authenticated integrated-browser context.
9. Publishing with `AGENT_SCOPE=shared` and separately installing Personal scope created duplicate titles with the same display name. Cowork selected the stale shared v1.1.0 connector instead of the Personal v1.1.2 connector.
10. After uninstalling the stale shared title and enabling the Personal title, Cowork resolved the fresh v2 DCR configuration. The title service returned HTTP 200 with an Atlassian authorization URL containing the dynamic client ID, Microsoft Teams redirect URI, server-issued state, and PKCE `S256` challenge.
11. Atlassian displayed consent for `Atlassian Rovo MCP v2` and the test site, accepted the grant, and returned an authorization code to the Microsoft Teams OAuth callback. This proves Atlassian authorization and DCR are functioning through the callback stage.
12. The automated browser could not complete token persistence because Cowork did not launch its OAuth child window. Opening the same URL as a standalone tab reached the callback but lacked the opener context that owns the PKCE verifier and state, producing `Connection Didn't Complete`.

## Root Cause

The Atlassian Rovo connector was not failing at Atlassian DCR. Cowork was resolving a stale shared v1.1.0 title while the corrected Personal v1.1.2 title was disabled. After title cleanup, explicit auth-config binding enabled the corrected Personal package to authenticate and invoke Rovo MCP.

`AGENT_SCOPE` is now `personal`, preventing future provision runs from recreating the shared-title collision. Microsoft may continue showing the uninstalled shared row until catalog propagation completes.

## Remaining Validation

- Repeat the omitted-authorization variant with a unique app and title to isolate automatic runtime DCR.
- Start a new Cowork conversation after access-token expiry and verify that Jira reads work without reconnecting.
- Capture the granted OAuth scopes and token refresh behavior.
- Determine Microsoft's supported CIMD path for Cowork MCP connectors.
