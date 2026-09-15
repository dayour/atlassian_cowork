---
title: Troubleshooting
sidebar_position: 3
---

## Connector opens the wrong version

Cowork can retain duplicate Personal and shared titles with the same name. Inspect connector telemetry for the title ID and package version, uninstall stale titles, wait for propagation, and start a new task.

## Connect returns no popup

Confirm that the title-service `signInInfo` request returns HTTP 200. A valid Atlassian authorization URL proves auth-config resolution but not popup launch. Check popup policy and browser console errors. Do not reuse OAuth URLs because state and PKCE values are short-lived and single-use.

## Standalone callback says connection did not complete

Opening the authorization URL in a separate tab can prove Atlassian consent, but the callback may lack the Cowork opener that owns state and the PKCE verifier. Complete final validation only from Cowork's own child window.

## Manifest tool file is missing

Use the ZIP-root-relative value:

```json
"mcpToolDescription": {
  "file": "tools/atlassian-rovo-tools.json"
}
```

The leading `./` form was rejected in this reproduction.

## Provisioning reuses stale DCR

Toolkit skips registration when the output environment variable already contains a configuration ID. Use a new environment key for a clean registration experiment. Do not publish real IDs or credentials.

## Atlassian v1 credentials interfere with v2

Atlassian advises v1 clients upgrading to v2 to clear cached client IDs and `.well-known` credentials. The v2 endpoint uses resource-specific metadata and issuer values.