# Cowork and Atlassian Rovo MCP Reproduction

## Expected Path

1. Import the Open Plugin source with Agents Toolkit 1.1.16 or later.
2. Add `dcr/register` using Atlassian's OAuth authorization-server metadata.
3. Provision the app and substitute the resulting configuration ID into the manifest.
4. Package and validate the v1.28 manifest.
5. Acquire the title at personal scope and connect Atlassian from Cowork.
6. Seed `SWE` and `KAN` from `project-tracking-dataset.json`.
7. Start a new Cowork conversation and repeat a Jira read without reconnecting.

## Verified Results

- Atlassian Rovo MCP endpoint: `https://mcp.atlassian.com/v2/mcp`
- Protected-resource metadata: `https://mcp.atlassian.com/.well-known/oauth-protected-resource/v2/mcp`
- Authorization-server metadata: `https://mcp.atlassian.com/.well-known/oauth-authorization-server`
- Atlassian advertises `offline_access` and the `refresh_token` grant.
- Agents Toolkit DCR provisioning creates and reuses an OAuth configuration.
- The v1.28 package validates after provisioning.

## Reproduced Gaps

- Import infers `OAuthPluginVault` but initially emits a placeholder reference ID.
- The imported lifecycle does not automatically add `dcr/register`.
- The imported manifest ID can differ from the Developer Portal app created during provisioning.
- A leading `./` in `mcpToolDescription.file` can be reported as missing even when the ZIP contains it.
- The DCR action does not expose a scope input, so the package cannot explicitly request `offline_access`.
- Microsoft guidance for replacing DCR with CIMD in Cowork connectors remains unavailable.

## Evidence to Capture

- Toolkit version and validation output
- DCR configuration creation and reuse output
- Package contents and substituted manifest
- Cowork title ID and app ID
- Atlassian consented scopes
- First and subsequent connection timestamps
- Jira issue keys created from each seed ID