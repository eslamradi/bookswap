# Learning: Avoid fetch() for local demo data in file://-opened prototypes

**Date:** 2026-07-13
**Context:** Phase 5 Prototyping, Scenario 01, page 1.1 Sign Up/Login

---

## The Problem

`shared/prototype-api.js` used `fetch('data/demo-data.json')` to load seed data. When the user opened the prototype HTML directly (double-click, `file://` protocol — the expected way a non-technical stakeholder opens a static prototype, no local server), the browser blocked the fetch with a CORS error: `fetch()` of local files is disallowed under `file://` origin, with no workaround short of running a server.

## The Fix

Replaced the JSON file + `fetch()` pattern with a plain `<script>`-loaded JS file that sets a global (`data/demo-data.js` → `window.DEMO_DATA`). Script tags aren't subject to the same-origin fetch restriction, so this works identically under `file://` and `http://`.

## Rule for Future WDS Prototypes

**Never use `fetch()` to load local demo/seed data in a static HTML prototype meant to be opened via `file://`.** Always seed via a `<script src="...">`-loaded JS file that sets a `window.*` global, read by the prototype's API abstraction layer. Reserve `fetch()` for calls to a real (or mocked-via-service-worker) network endpoint, not local static data.

This applies to every page in every scenario prototype built with this workflow, not just this one instance.
