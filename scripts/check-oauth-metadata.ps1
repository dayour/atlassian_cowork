[CmdletBinding()]
param(
    [string]$McpServerUrl = 'https://mcp.atlassian.com/v2/mcp'
)

$uri = [Uri]$McpServerUrl
$resourceMetadataUrl = '{0}://{1}/.well-known/oauth-protected-resource{2}' -f `
    $uri.Scheme, $uri.Authority, $uri.AbsolutePath

$resourceMetadata = Invoke-RestMethod -Uri $resourceMetadataUrl
$authorizationServer = $resourceMetadata.authorization_servers[0].TrimEnd('/')
$authorizationMetadataUrl = "$authorizationServer/.well-known/oauth-authorization-server"
$authorizationMetadata = Invoke-RestMethod -Uri $authorizationMetadataUrl

[pscustomobject]@{
    McpServer = $McpServerUrl
    ResourceMetadata = $resourceMetadataUrl
    Resource = $resourceMetadata.resource
    AuthorizationServer = $authorizationServer
    RegistrationEndpoint = $authorizationMetadata.registration_endpoint
    GrantTypes = $authorizationMetadata.grant_types_supported
    CodeChallengeMethods = $authorizationMetadata.code_challenge_methods_supported
    ClientIdMetadataDocumentSupported = $authorizationMetadata.client_id_metadata_document_supported
    OfflineAccessAdvertised = $resourceMetadata.scopes_supported -contains 'offline_access'
} | ConvertTo-Json -Depth 5