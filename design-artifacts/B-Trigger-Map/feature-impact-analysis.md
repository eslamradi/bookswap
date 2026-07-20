# Feature Impact Analysis: bookswap

> Translates the Trigger Map's driving forces into candidate features and prioritization. [← Back to Trigger Map](trigger-map.md)

**Created:** 2026-07-12

---

## Scoring Method

Two complementary lenses were used — they don't always agree, and where they disagree is itself a signal (see Strategic Rationale below).

**1. Driving Force scores** (from the Trigger Map, Frequency × Intensity × Fit, max 15) — how urgent is this psychological force, regardless of whose it is.

**2. Feature × Persona scores** (this document) — how many personas a candidate feature serves, weighted by persona priority:
- **Primary Persona (Maya, ⭐ Priority 1):** High = 5 pts | Medium = 3 pts | Low = 1 pt
- **Other Personas (Priya, Tom):** High = 3 pts | Medium = 1 pt | Low = 0 pts
- **Max possible score:** 11 (5 + 3 + 3)

---

## Prioritized Features

| Rank | Feature | Maya | Priya | Tom | Score | Mechanical Decision |
|---|---|---|---|---|---|---|
| 1 | Condition photos/ratings + dispute flow | High (5) | Med (1) | Low (0) | **6** | Must Have |
| 2 | Discovery/recommendation surfacing | High (5) | Low (0) | Low (0) | **5** | Must Have |
| 3 | Ultra-low-friction batch listing flow | Low (1) | Low (0) | High (3) | **4** | Consider |
| 3 | Instant search + "notify me" for exact titles | Low (1) | High (3) | Low (0) | **4** | Consider |
| 3 | Delivery confirmation / reputation signals | Med (3) | Med (1) | Low (0) | **4** | Consider |
| 3 | Address masking / mediated shipping | Low (1) | Low (0) | High (3) | **4** | Consider |
| 3 | Savings/value display ("you saved $X") | Med (3) | Med (1) | Low (0) | **4** | Consider |
| 8 | Deadline urgency signals / waitlist | Low (1) | High (3) | Low (0) | **4** | Consider |

---

## Decisions (Overridden From Mechanical Scoring — See Rationale)

**Must Have MVP:**
- **Ultra-low-friction batch listing flow** (mechanical score 4) — addresses the single highest-scored driving force in the entire Trigger Map (Tom's abandonment fear, 15/15) and is the literal precondition for Goal 1.1 (2,000 listings). Without this, there is no supply, and nothing else on this list matters.
- **Instant search + "notify me" for exact titles** (mechanical score 4) — addresses the highest-scored *want* (Priya, 14/15) and is the precondition for Goal 1.2 (40%+ match rate). This is the feature most directly tested by "quick matching," the design goal from the original brief.
- **Condition photos/ratings + dispute flow** (mechanical score 6) — qualifies on both lenses. Maya's top fear (13/15), and trust/condition issues are a documented, recurring real-world pain point for book-swap platforms specifically.

**Consider for MVP:**
- Delivery confirmation / reputation signals — addresses ghosting fears for both Maya and Priya (11/15 each); can start lightweight (simple "marked as shipped" status) and deepen later.
- Address masking / mediated shipping — mechanically mid-tier, but addresses a documented real safety concern (Tom, 13/15) — recommend treating as higher priority than its score suggests, at least in a minimal form (e.g., don't require exact address until a trade is confirmed).
- Basic discoverability (sort/filter/recency) — ships inherently with any listing page; full recommendation/discovery *engine* (the "Must Have" scored feature above) can be deferred to post-MVP once there's enough listing volume for recommendations to be meaningful.
- Deadline urgency signals / waitlist — nice reinforcement for Priya but not blocking; a working search + notify-me (already Must Have) covers the core need.

**Defer:**
- Savings/value display ("you saved $X") — reinforces identity/motivation for Maya and Priya but isn't load-bearing for any core flow; easy to add once pricing/valuation data exists.
- Full recommendation engine (sophisticated "you might also like") — the *concept* of discoverability is Must Have (see above), but a personalization/recommendation algorithm specifically is a post-MVP investment once there's usage data to power it.

---

## Strategic Rationale: Why the Two Lenses Disagree

The mechanical feature score weights everything toward Maya as the "primary" persona — but Maya's forces topped out at 13/15, while **Tom's abandonment fear (15/15) and Priya's match-confirmation want (14/15) were the two highest-scored forces in the whole Trigger Map**, and neither is Maya's.

This isn't a contradiction to resolve by picking one lens — it reflects a real distinction:
- **Persona priority** (Maya first) reflects who the product is ultimately *for* — the highest-retention, most-engaged long-term user.
- **Driving force intensity** reflects what's most *urgent to solve right now* — and right now, the business's core risk is Goal 1 (liquidity): no supply (Tom abandons before listing) means no discovery for Maya and no matches for Priya either.

**Recommendation:** Build for Tom and Priya's urgent forces first (listing flow, search/notify) because they gate whether the marketplace has any inventory or matches at all — then invest in Maya's discovery experience once there's enough volume for discovery to be meaningful. Sequencing, not ignoring Maya.

---

## Development Phase Implications

**Phase 1 (MVP — supply & core loop):** Batch listing flow, instant search + notify-me, condition ratings/dispute flow. This is the minimum for the core loop (list → find → trade) to function without breaking trust.

**Phase 2 (trust hardening):** Delivery confirmation/reputation, address masking/mediated shipping. Closes the gap on the cross-cutting trust theme identified in the Trigger Map.

**Phase 3 (retention & discovery):** Recommendation surfacing, savings/value display, deadline urgency polish. Investments that matter once there's enough volume and returning users to benefit from them.

---

## Related Documents

- [Trigger Map (hub)](trigger-map.md)
- [Maya the Bookworm](personas/avid-reader.md)
- [Priya the Deadline Swapper](personas/specific-need-swapper.md)
- [Tom the Declutterer](personas/declutterer.md)

---

_Generated with Whiteport Design Studio framework — Suggest mode_
_Strategic input for Phase 3: UX Scenarios and future PRD/Development_
