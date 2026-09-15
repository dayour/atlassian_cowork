# Atlassian Cowork DCR Provisioning Template

Version 1.1.2 is an independent interoperability reproduction for Atlassian Rovo MCP v2 and Microsoft 365 Copilot Cowork. This package contains source templates, not a preconfigured Microsoft 365 installation ZIP or a JavaScript runtime library. It has no runtime dependencies or install scripts.

## Download

Get the `.tgz` template archive or complete source ZIP from the [v1.1.2 GitHub Release](https://github.com/dayour/atlassian_cowork/releases/tag/v1.1.2). Verify downloads against the release's `SHA256SUMS.txt`.

The same template is published as `@dayour/atlassian-cowork` in GitHub Packages. GitHub's npm registry requires authentication even for public packages; use a personal access token (classic) with `read:packages` and access to the package. Enter the token only in your local npm authentication prompt, never in a public issue or source file:

```powershell
npm login --scope=@dayour --auth-type=legacy --registry=https://npm.pkg.github.com
npm pack @dayour/atlassian-cowork@1.1.2 --registry=https://npm.pkg.github.com
```

The public GitHub Release download does not require npm registry authentication.

## Extract and provision

Extract the template archive into a new working directory:

```powershell
tar -xzf dayour-atlassian-cowork-1.1.2.tgz
Set-Location package
npm install --global @microsoft/m365agentstoolkit-cli@1.1.16
Copy-Item env/.env.dev.example env/.env.dev
atk auth login m365
atk provision --env dev --interactive false
atk validate --env dev --interactive false
```

Provision only in an authorized Microsoft 365 test tenant. This command creates/resolves an app, performs DCR, uploads the generated app package, and acquires a Personal title. Each publisher must provision their own app and auth configuration. No tenant IDs, client secrets, or user tokens are supplied in this template. The rendered installer is `appPackage/build/appPackage.dev.zip`; do not upload this `.tgz` or the source ZIP to Teams.

Enable the correct Personal Atlassian Rovo title in Cowork, select Connect, and complete Atlassian consent in the original popup flow. Test `getAccessibleAtlassianResources` before Jira writes. Tenant publication is a separate authorized operation, not part of downloading this package.

For extracted templates, retain the original repository's ignore rules or exclude local `env/.env.*` files (except examples) and `appPackage/build/` before committing any files.

## Evidence and limits

Toolkit DCR, package validation, consent, and the code callback were verified. Authenticated tool use was owner-reported; automated capture did not establish the complete token exchange. Silent refresh, clean omitted-auth A/B behavior, and cross-tenant distribution remain unverified.

Read the [complete build and installation guide](https://dayour.github.io/atlassian_cowork/reproduction/dcr-enabled-build-v1-1-2) before provisioning. This is not an official Atlassian or Microsoft product.
