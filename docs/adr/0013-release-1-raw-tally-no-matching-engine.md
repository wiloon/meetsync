# Release 1 ships a raw tally, not MatchingEngine's computed Plans

Within Phase 1 (no accounts, no billing, no AI — [ADR-0007](0007-phased-organizer-auth-and-ai-billing.md)/[0008](0008-phase-2-cost-pledges-narrow-visibility.md)), the *first* release ships a raw tally instead of `MatchingEngine`'s weighted scoring: per Topic, a count of interested Participants and, per time slot, how many of them are free then — no priority weighting, no window search, no tie margin, no minimum-attendee gate, and no computed `Plan`. Priority rank (the input `MatchingEngine` would have weighted by) ships with it, in Release 2. "Interested in a Topic" becomes a plain yes/no per Participant — the vote a tally counts — with no ranking among a Participant's own topics.

This splits Phase 1 into two releases along a different axis than the Phase 1/Phase 2 split above:

- **Release 1** (this one): raw tally, no scoring, no `Plan`.
- **Release 2**: `MatchingEngine`, priority rank, computed `Plan`s — the design already fully specified in this issue's Implementation Decisions, just not built first.

## Why

The tally is a much smaller thing to build and ship, and it directly answers the project's original motivation (know who's free, know who's interested) without first betting on a scoring model nobody's used yet. Priority rank has no consumer without `MatchingEngine` — collecting it in Release 1 would be data entry with no payoff until Release 2 exists, so it's deferred with the engine that uses it, not shipped early and left inert.

## Consequences

- `TopicPreference` in Release 1 has no `priorityRank` field — just `participantId`, `topicId`, `sponsor`. It gains `priorityRank` in Release 2, additively.
- A tally's per-slot count still respects Topic Busy Block narrowing ([0003](0003-two-layer-time-collection.md)) — a Participant's per-topic effective time, not just their general Free Time. This part of the design is unaffected by deferring `MatchingEngine`; only the scoring/selection step is deferred, not the two-layer time model that feeds it.
- The single highest count in a tally may be highlighted, but that's a plain `max()` over raw numbers — not `MatchingEngine`, and it carries none of the "why this won" explanation a computed Plan would (User Story 30, deferred to Release 2).
- No minimum-attendee gate exists in Release 1: a slot with 0 or 1 interested-and-free Participant is shown as-is, not hidden. Hiding is a judgment `MatchingEngine` makes; a tally just reports.
- `to-tickets`'s ticket breakdown drops the `MatchingEngine` ticket entirely for now and replaces the "compute and display Plans" ticket with a much smaller tally-view ticket with no scoring logic to test.
