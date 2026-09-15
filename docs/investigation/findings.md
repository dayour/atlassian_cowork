---
title: Findings and Documentation Drift
sidebar_position: 2
---

## Conclusion

The evidence shows that Atlassian's DCR implementation is functional. The gap was the creation and binding of Microsoft's authentication configuration.

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

> In this Cowork reproduction, the documented manifest-only omission path did not yield a usable authenticated connector. Pre-provisioning DCR through Agents Toolkit and explicitly binding the resulting Enterprise Token Store configuration did.

This wording preserves the observed result while acknowledging that the original test was later confounded by a stale shared title. A clean A/B test remains necessary to make a broader platform claim.