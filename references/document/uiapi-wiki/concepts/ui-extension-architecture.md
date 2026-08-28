---
title: "UI Extension Architecture"
aliases: [b1.sdk wrapper, UI5 abstraction, extension model]
tags: [extension-architecture, controls]
source_count: 1
---

## Definition

SAP B1 Web Client UI API exposes a curated, stable abstraction layer (`b1.sdk.*`) over SAP UI5. Extensions interact only with `b1.sdk` — direct UI5 access is not permitted and explicitly deprecated.

## How it works

Web Client's UI framework is built on SAP UI5. The `b1.sdk` controls are customised descendants of UI5 controls, specifically tailored for Web Client's design language and lifecycle. The framework deliberately does not expose raw UI5.

At any given release, only a **subset** of controls used internally by Web Client is exposed to extensions. The exposed set grows with each feature pack. Using unexposed controls or properties is unsupported and likely to break.

Extensions modify views via the [[overlay-mechanism]] (JSON overlay files + JavaScript controllers). They run in a sandboxed environment — see [[security]].

**Version constraints:**
- API available from **FP 2405**.
- JavaScript: **ECMAScript 2017 (ES8)** minimum. ES8 is guaranteed to work; ES2018+ support grows with the UI5 version and browser — ES8 is the safe baseline to target.
- New controls and properties are added incrementally; each control page in this wiki notes its `available_from` release.

## Why it matters

The abstraction means extension code is insulated from internal UI5 version changes. It also means extension developers cannot access the full UI5 API — only what SAP has chosen to expose. Understanding what is and isn't in scope prevents wasted effort chasing unsupported patterns.

## Tradeoffs and constraints

- **ES8 minimum**: ES8 is the guaranteed baseline. ES2018+ may work depending on the UI5 version and browser, but ES8 is the safe target for maximum compatibility.
- **Subset exposure**: The control catalogue grows over releases; check `available_from` on control pages and the Supported View List (see [[10-appendix]]) for current scope.
- **No direct UI5 access**: Workarounds via DOM manipulation or window globals are blocked by the security sandbox.

## Connections

Related concepts: [[overlay-mechanism]], [[extension-namespace]], [[security]], [[sdk-env]]

## Sources

- [[01-overview]] — defines scope, ES8 constraint, subset exposure model, and the b1.sdk namespace
