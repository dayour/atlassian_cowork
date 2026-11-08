---
title: Findings and Documentation Drift
sidebar_position: 2
---

## Conclusion

Toolkit-based DCR registration and explicit authentication binding were demonstrated. That is a provisioning-time workaround, not a verified fix for Cowork's documented runtime DCR behavior when `authorization` is omitted. The earlier omission experiment was confounded by stale title selection and is inconclusive.

| Claim | Evidence | Status |
| --- | --- | --- |
| Atlassian exposes protected-resource metadata | Live RFC 9728 document matches the v2 MCP resource URL | Verified |
| Atlassian exposes DCR | Authorization-server metadata contains `registration_endpoint` | Verified |
| Toolkit can register a client | `dcr/register` produced a reusable configuration ID | Verified |
| Cowork can resolve the stored registration | `signInInfo` returned a dynamic Atlassian client authorization URL | Verified |
| Atlassian accepts that client | Consent displayed and an authorization code returned | Verified |
| Omitting `authorization` always triggers runtime DCR | No clean registration trace was captured | Unproven |
| Cowork refreshes Atlassian tokens | No post-expiry refresh exchange was captured | Unproven |

## Original article contradiction

The article snapshot used for the reproduction contained two incompatible instructions:

- Its DCR section said `authorization` could be omitted.
- Its connector validation table said `authorization.referenceId` was required unless the type was `None`.

Those rules cannot both describe the same authenticated connector shape.

## Current Microsoft guidance

Microsoft's dedicated DCR page, updated August 28, 2026, now describes the behavior that worked here:

1. Toolkit discovers the authorization server.
2. Toolkit dynamically registers a client.
3. Microsoft creates an auth config in the Enterprise Token Store.
4. The manifest uses `OAuthPluginVault` and the auth config ID.

The current agent-connectors page uses a different representation, `DynamicClientRegistration` plus `referenceId`. This leaves a schema-surface question for unified app manifest v1.28 even though both pages agree that a stored reference is required.

## Precise interpretation

The defensible statement is:

> Pre-provisioning DCR through Agents Toolkit and explicitly binding the resulting Enterprise Token Store configuration produced a working connection reported by the owner. The original omission experiment does not establish success or failure because the selected title was not controlled.

A clean A/B test must verify the packaged manifests, distinct Personal title identities, connection behavior, and an actual read-only MCP tool result. Successful packaging, publication, or a consent screen alone does not meet that requirement. The v1.1.2 release must not be treated as evidence of automatic runtime DCR.

See the [current A/B validation record](../reproduction/dcr-ab-validation.md). B subsequently completed an authenticated read with a successful server-recorded MCP event attributed to its exact Personal title. Earlier no-tools tasks had incomplete isolation: an original Atlassian installation was still enabled. The earlier callback observation is historical, and neither it nor B's successful explicit registration proves automatic runtime DCR for A.
