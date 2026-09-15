---
title: Problem Statement
sidebar_position: 1
---

The target integration is Atlassian Jira through the Atlassian Rovo MCP v2 server. The connector eventually worked, but only after deviating from the Cowork plugin article available during the original implementation.

That article stated that, for Dynamic Client Registration (DCR), a package could omit the connector's `authorization` object while retaining `mcpToolDescription`. In this reproduction, omission did not result in a usable connection. The working route used Microsoft 365 Agents Toolkit to register the OAuth client and then explicitly referenced the resulting authentication configuration from the manifest.

The issue has been raised with Microsoft. Private support-case identifiers are omitted from this public reproduction.

## Questions under investigation

1. Is manifest omission intended to trigger automatic runtime DCR in Cowork?
2. Is an Enterprise Token Store auth config always required?
3. Should an agent connector use `OAuthPluginVault` or `DynamicClientRegistration` after provisioning?
4. How does Cowork select scopes and request `offline_access`?
5. Does Cowork persist and rotate refresh tokens?
6. What is Microsoft's supported migration path from DCR to CIMD?

Without a deterministic contract, connector publishers cannot distinguish server incompatibility from platform configuration failure. Repeated registration also creates stale client identities, duplicate titles, unnecessary consent, and operational uncertainty.