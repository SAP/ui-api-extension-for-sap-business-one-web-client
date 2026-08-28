---
title: "Security Model"
aliases: [sandbox, allowlist, CSRF, OAuth2]
tags: [security, sandbox, service-layer, oauth2, csrf]
source_count: 1
---

## Definition

Web Client UI API extensions run inside a sandboxed JavaScript context. The sandbox isolates partner code from the host browser environment and restricts outbound network access to an explicit allowlist configured in `manifest.json`.

## Sandbox restrictions

The following are blocked inside extension code:

- **DOM object access** — cannot directly manipulate the host page DOM
- **`window` object access** — no direct access to `window`
- **Cookies** — no read or write access to browser cookies
- **Session storage** — no access to `sessionStorage`
- **External URLs not in allowlist** — outbound network calls to non-listed origins fail

All interaction with the UI happens through `b1.sdk.*` controls and `SDKEnv` methods.

## Configuring allowlists in `manifest.json`

Both allowlists live in the module's `manifest.json`:

```json
{
  "allowedServiceLayerAPIs": [
    {
      "api": "BusinessPartners",
      "authorization": "full",
      "description": "full authorization on business partners"
    },
    {
      "api": "Items",
      "authorization": "readOnly",
      "description": "read-only access to items"
    }
  ],
  "allowedExternalURLs": [
    {
      "endpoint": "https://api.example.com",
      "description": "external data service"
    }
  ]
}
```

### `allowedServiceLayerAPIs`

| Field | Type | Description |
|---|---|---|
| `api` | string | Service Layer entity or service name — **exact match only**, no wildcards (e.g. `"BusinessPartners"`, `"CompanyService_GetCompanyInfo"`) |
| `authorization` | `"full"` \| `"readOnly"` | `full` allows all HTTP methods; `readOnly` restricts to read operations |
| `description` | string | Human-readable description (for audit/review) |

### `allowedExternalURLs`

| Field | Type | Description |
|---|---|---|
| `endpoint` | string | URL prefix for the external service — the framework enforces path-level matching. `https://my-api.com/` allows all paths under the domain; `https://my-api.com/public/` restricts to paths under `/public/` only |
| `clientID` | string (optional) | OAuth2 client ID — enables `authenticateExternalService()` for this endpoint |
| `description` | string | Human-readable description |

## Special values

| Value | Effect |
|---|---|
| `"*"` (string) | Allow all — applies to both `allowedServiceLayerAPIs` and `allowedExternalURLs` |
| `[]` (empty array) | Block all |

**Warning**: `"*"` must not be used in production. If an XSS vulnerability is exploited, the attacker gains access to all Service Layer operations and external URLs. Use it only during development.

## OAuth2 for external services

To call an external service that requires OAuth2 authentication:

1. Register the external service in `allowedExternalURLs` with a `clientID`.
2. Configure the redirect URL in the Identity and Authentication Management settings — the endpoint pattern (e.g. `https://external-service-api.com/*`) must match.
3. At runtime, call `oEnv.authenticateExternalService()` (FP2602) to initiate the OAuth2 PKCE flow — see [[sdk-env]].

The `clientID` in `manifest.json` is the prerequisite that enables `authenticateExternalService()` to work for that endpoint.

## CSRF protection

Service Layer API calls made via the SDK's service clients are **automatically CSRF-protected by the framework**. No manual token handling or header management is required. This protects against Cross-Site Request Forgery attacks where an attacker tricks a user into executing unintended transactions.

## Why it matters

- Any Service Layer entity your extension reads or writes **must be in `allowedServiceLayerAPIs`** — calls to unlisted entities fail at runtime with no access.
- Any external URL your extension fetches (via `ExternalService` client or `authenticateExternalService()`) **must be in `allowedExternalURLs`**.
- The allowlist is **per module** — each module in a multi-module extension can have different permissions.
- `readOnly` authorization is the principle of least privilege — use `full` only when the extension needs to create/update/delete.

## Tradeoffs and constraints

- Sandbox prevents direct DOM manipulation — all UI changes must go through the SDK control API.
- `"*"` wildcard is convenient for development but creates a broad attack surface. Always tighten to specific entries before deploying.
- OAuth2 redirect URL must match the endpoint pattern exactly — misconfigured redirects cause authentication failures.

## Connections

Related concepts: [[service-api]], [[sdk-env]], [[extension-namespace]]

## Sources

- [[07-security]] — sandbox model, allowlist configuration, OAuth2, CSRF
