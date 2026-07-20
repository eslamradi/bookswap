# Learning: Normalize localStorage-backed prototype state on every load

**Date:** 2026-07-13
**Context:** Phase 5 Prototyping, Scenario 01, page 1.2 Batch Listing

---

## The Problem

`getState()` in `prototype-api.js` returned cached localStorage state verbatim once it existed, only applying the full seeded shape (`currentUser`, `listings`, `queue`, etc.) on first-ever creation. When a new field (`queue`) was added to the seed shape mid-session (after the user had already authenticated on 1.1, which created and saved a state object under the old shape), pages built afterward that read `state.queue` got `undefined` and crashed (`Cannot read properties of undefined (reading 'length')`).

## The Fix

`getState()` now normalizes every load — backfilling any expected field that's missing from the cached state with its seed default — not just on first creation.

## Rule for Future WDS Prototypes

**A localStorage-backed prototype API must treat its schema as evolving, not fixed.** Every `getState()`-equivalent read should defensively backfill missing fields against the current expected shape, because pages are built and tested incrementally across a session — earlier pages will have already written state under an older shape by the time later pages (with new fields) are opened. Don't assume cached state matches the current code's expectations.
