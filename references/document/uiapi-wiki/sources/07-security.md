---
title: "WebClient UIAPI Reference — 07: Security"
tags: [security, sandbox, service-layer, oauth2, csrf]
---

## Summary

Covers the security model for Web Client UI API extensions. Extensions run in a sandboxed JavaScript context that restricts access to DOM, `window`, cookies, and session storage. External network access is controlled by an explicit allowlist in `manifest.json`. CSRF protection is built into Service Layer API calls by the framework.

Two allowlists are configured in `manifest.json` per module: `allowedServiceLayerAPIs` (with `full` or `readOnly` authorization) and `allowedExternalURLs` (with optional `clientID` for OAuth2). Both support `"*"` (allow all — dev only) and `[]` (block all).

## Key facts

- **Sandbox restrictions**: DOM object access, `window` object access, cookies, and session storage are all blocked
- **`allowedServiceLayerAPIs`**: array of objects with `api` (Service Layer entity/service name), `authorization` (`"full"` or `"readOnly"`), `description`
- **`allowedExternalURLs`**: array of objects with `endpoint` (URL), optional `clientID` (OAuth2), `description`
- **`"*"` wildcard**: allows all APIs/URLs — **NOT for production**, development only; XSS risk
- **`[]` empty array**: blocks all APIs/URLs entirely
- **`clientID` in `allowedExternalURLs`**: enables OAuth2 authentication for external services; redirect URL must match the `endpoint` pattern
- **CSRF protection**: Service Layer API calls are CSRF-protected by the framework — no manual token handling required
- **Redirect URL pattern**: should use wildcard path (`https://external-service-api.com/*`) to cover all paths under the domain

## Controls covered

No controls.

## Concepts covered

[[security]] (new)

## Types covered

No types.

## Connections to existing wiki

- **[[service-api]]**: CSRF protection is framework-handled — complements the service client documentation.
- **[[sdk-env]]**: `authenticateExternalService()` (FP2602) is the runtime OAuth2 PKCE flow — the `clientID` in `manifest.json` is the prerequisite for calling that method.
- **[[extension-namespace]]**: `manifest.json` is also where `b1.bundles` (extension registration) and `i18n` are configured — security allowlists are another section of the same file.

## Open questions

None.
