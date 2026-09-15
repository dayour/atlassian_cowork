---
slug: /
sidebar_position: 1
title: DCR Investigation
description: Reproduction of Dynamic Client Registration behavior for Atlassian Rovo MCP in Microsoft 365 Copilot Cowork.
---

This repository reproduces an authentication discrepancy between the documented automatic Dynamic Client Registration path and observed Microsoft 365 Copilot Cowork behavior with Atlassian Rovo MCP v2.

## Finding

The documented manifest-only path says a DCR-enabled MCP server can omit `authorization`. In this reproduction, that path did not produce a usable connection. The working path required both:

1. `dcr/register` in Microsoft 365 Agents Toolkit to create the OAuth client and token-store configuration.
2. An explicit `OAuthPluginVault.referenceId` in the connector manifest to bind Cowork to that configuration.

This result does **not** show that Atlassian lacks DCR support. Atlassian accepted the dynamically registered client, displayed consent, and returned an authorization code to Microsoft's callback. It shows a gap between the documented Cowork automatic-binding behavior and the behavior observed in this tenant and package.

:::info Reproduction scope

The result is an evidence-based interoperability report, not a claim that every tenant or every DCR-enabled MCP server fails in the same way.

:::