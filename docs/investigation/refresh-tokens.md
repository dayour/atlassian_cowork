---
title: Scopes and Refresh Tokens
sidebar_position: 4
---

Atlassian capability and Cowork behavior must be evaluated separately.

## What Atlassian advertises

The live protected-resource metadata includes `offline_access`. The authorization-server metadata includes `refresh_token` in `grant_types_supported`. These values establish provider capability only.

## Toolkit control gap

The v1.13 `dcr/register` action accepts the registration name, authorization-server metadata URL, URL allowlist, app applicability, and tenant audience. It exposes no `scope`, `grant_types`, or refresh-policy input.

RFC 7591 permits a DCR request to include both `scope` and `grant_types`. If omitted, the authorization server may apply defaults. Therefore, the Toolkit schema prevents the package author from declaring refresh intent during DCR registration, but it does not prove that Atlassian withholds refresh tokens.

## MCP guidance

The current draft MCP authorization specification says clients desiring refresh tokens should register the `refresh_token` grant and may request `offline_access`, while never assuming the server will issue one. It also says protected resources should not advertise `offline_access`, because token persistence is a client concern. Atlassian currently does advertise it in protected-resource metadata.

## Required evidence

Refresh is verified only when all of these are observed safely:

1. The effective authorization request or grant includes refresh intent.
2. The redacted token response indicates a refresh token was issued.
3. A later token request uses `grant_type=refresh_token`.
4. A Rovo tool succeeds after access-token expiry without new user consent.

## Support questions

- Which scopes does Cowork derive from `scopes_supported`?
- Does Cowork request all advertised scopes or step up per operation?
- Does Enterprise Token Store automatically request and rotate refresh tokens for DCR configs?
- Can scope be configured after `dcr/register` through a supported update action or portal?