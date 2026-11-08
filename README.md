# Atlassian Rovo MCP for Microsoft Copilot Cowork

[![Docs](https://github.com/dayour/atlassian_cowork/actions/workflows/deploy-docs.yml/badge.svg)](https://dayour.github.io/atlassian_cowork/)

A reproducible Microsoft 365 app package, Jira project-tracking skill, and technical investigation of Dynamic Client Registration (DCR) behavior in Microsoft 365 Copilot Cowork.

## Core finding

An earlier Cowork article said that connectors for DCR-enabled MCP servers could omit the manifest `authorization` object. The original omission experiment was confounded by stale title selection. The verified explicit-registration control uses:

1. `dcr/register` in `m365agents.yml` to register a client with Atlassian and create an authentication configuration in the Microsoft Enterprise Token Store.
2. `OAuthPluginVault.referenceId` in `appPackage/manifest.json` to bind the connector to that stored configuration.

Microsoft's dedicated DCR documentation, updated in August 2026, now describes this explicit auth-config pattern. B completed an authenticated read with a successful MCP event attributed to its exact Personal title. This verifies the provisioning-time workaround, not automatic runtime DCR. See the [current A/B evidence](docs/reproduction/dcr-ab-validation.md), including the installed-plugin isolation checks and remaining limitations.

## Repository contents

- `appPackage/`: Cowork plugin, static MCP tool descriptions, and Jira skill.
- `m365agents.yml`: DCR registration, packaging, update, and publication lifecycle.
- `docs/`: Docusaurus investigation and reproduction wiki.
- `scripts/check-oauth-metadata.ps1`: live OAuth discovery-chain check.
- `REPRO_RESULTS.md`: dated observed results and unresolved validation.

## Quick start

```powershell
npm install
Copy-Item env/.env.dev.example env/.env.dev
atk auth login m365
atk provision --env dev --interactive false
atk validate --env dev --interactive false
npm run build
```

Provision only in a test tenant. Generated environment files can contain deployment identifiers and are excluded from Git.

## Documentation

The full wiki is published at [dayour.github.io/atlassian_cowork](https://dayour.github.io/atlassian_cowork/). Start with the [DCR finding](https://dayour.github.io/atlassian_cowork/investigation/findings) and [controlled test matrix](https://dayour.github.io/atlassian_cowork/reproduction/test-matrix).

### DCR Enabled Build v1.1.2

The [full build and installation guide](https://dayour.github.io/atlassian_cowork/reproduction/dcr-enabled-build-v1-1-2) explains the explicit-registration workaround, provisioning-time registration, manifest binding, environment configuration, ZIP packaging, Personal installation, manual upload, and tenant publication. It distinguishes verified behavior from untested refresh and distribution scenarios. Each independent publisher must provision their own app and authentication configuration.

Download the provisioning template, complete source ZIP, and checksums from [Release v1.1.2](https://github.com/dayour/atlassian_cowork/releases/tag/v1.1.2). The same template is distributed as [`@dayour/atlassian-cowork`](https://github.com/dayour/atlassian_cowork/packages) through GitHub Packages. See [download and extraction instructions](distribution/README.md). These are source distributions, not preconfigured Teams installation ZIPs. GitHub's npm registry requires authentication; the public release assets provide an alternative download route.

## Status

- Explicit Toolkit DCR registration: verified.
- Atlassian consent and authorization-code callback: verified.
- Authenticated Rovo MCP call: verified for B through a successful server-recorded MCP event with the matching Personal title.
- Automatic DCR with omitted `authorization`: fresh A/B packages tested; runtime registration remains unverified.
- Refresh-token issuance and post-expiry renewal: not yet captured.
- Cowork CIMD configuration path: no public Microsoft guidance identified.

## License

MIT. This is an independent interoperability reproduction and is not an official Microsoft or Atlassian project.
