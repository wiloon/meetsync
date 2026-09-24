# Collect Busy Blocks once, layer Topic Preference on top

Time is collected in two passes: first a Participant marks Busy Blocks — exceptions where they can't attend anything — once per Gathering, independent of any Topic. Free Time is derived from that. Only if a Participant wants to narrow further for a specific Topic do they add a Topic Preference window on top; otherwise a Topic Preference inherits the full Free Time.

## Why

Within a short 2-3 day window, most people are free by default and have only a few conflicts, so asking "when are you busy" takes fewer inputs than asking "when are you free." Collecting it once, rather than per Topic, also avoids making a Participant re-enter the same physical-availability answer for every Topic they're interested in — that repetition is what [0002](0002-topic-centric-not-calendar-centric.md)'s Topic-first model would otherwise force on someone interested in several Topics.

## Consequences

- A Participant interested in only one Topic still goes through the same two-step flow (Busy Blocks, then optional narrowing) even though a single flat "when am I free for this" question would look simpler for that case alone.
- The matching step (see [0005](0005-deterministic-matching-ai-scoped-to-io.md)) always computes against Free Time narrowed by whatever Topic Preference exists, never against raw Busy Blocks directly.
- The narrowing itself is recursive, not a different mechanism: a Topic Preference narrows via Topic Busy Blocks (see `CONTEXT.md`), the same busy-framing as the Gathering-wide layer, just scoped to one Topic. A Participant can be free generally but busy for one specific Topic (e.g. an evening game session that conflicts with a parent's routine, without conflicting with dinner).
