---
title: OAuth and DCR Flow
sidebar_position: 3
---

## Discovery chain

```mermaid
flowchart LR
    C[Cowork] -->|MCP request| R[Atlassian Rovo MCP v2]
    R -->|401 plus resource metadata| C
    C -->|GET RFC 9728 metadata| RM[Protected resource metadata]
    RM -->|authorization servers| AS[Atlassian authorization server]
    C -->|GET RFC 8414 metadata| AS
    AS -->|registration endpoint, PKCE, grants| C
```

For `https://mcp.atlassian.com/v2/mcp`, RFC 9728 path insertion produces:

```text
https://mcp.atlassian.com/.well-known/oauth-protected-resource/v2/mcp
```

That document identifies the resource-specific issuer:

```text
https://auth.atlassian.com/VCeDsk8ZHncYF1g234fKtc4lNipbBhu3
```

## Working provisioning and runtime sequence

```mermaid
sequenceDiagram
    actor Dev as Publisher
    participant ATK as Agents Toolkit
    participant ETS as Enterprise Token Store
    participant AS as Atlassian Authorization Server
    participant CW as Cowork
    actor User
    participant MCP as Rovo MCP

    Dev->>ATK: atk provision --env dev
    ATK->>AS: RFC 7591 registration
    AS-->>ATK: client ID and secret
    ATK->>ETS: Create DCR auth config
    ETS-->>ATK: configuration ID
    ATK->>CW: Publish manifest with referenceId
    User->>CW: Connect Atlassian Rovo
    CW->>ETS: Resolve auth config
    ETS-->>CW: Registered client metadata
    CW->>AS: Authorization request and PKCE S256
    AS->>User: Consent
    User->>AS: Accept
    AS-->>CW: Code at Teams callback
    CW->>AS: Code and PKCE verifier
    AS-->>CW: Access token and optional refresh token
    CW->>MCP: Bearer token and MCP request
    MCP-->>CW: Tool result
```

## Evidence semantics

- A consent page proves the authorization request and client ID were accepted.
- A callback containing a code proves authorization, not token exchange.
- A successful MCP tool result proves access-token acquisition and presentation.
- A later call after expiry without consent is required to prove refresh behavior.

Never record authorization codes, PKCE verifiers, client secrets, access tokens, refresh tokens, or full OAuth `state` values in evidence.