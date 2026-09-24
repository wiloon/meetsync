# Matching is a deterministic algorithm; AI is scoped to input and output, never the decision

Which (Topic, time window, attendee set) becomes a Plan is decided by a deterministic scoring function over structured data (Free Time, Topic Preference, priority rank) — the same inputs always produce the same ranked Plans. An AI agent may be used to turn a Participant's freeform description into that structured data, and to turn the algorithm's ranked output into a friendly written summary, but it never chooses the Plan itself.

## Why

The original shape of this idea had an AI agent doing the matching directly from freeform participant input. That's attractive for input UX but wrong for the decision itself: a Plan needs to be explainable ("this won because 6 of 8 people are free and it's everyone's top pick") to a group of friends who all need to accept the outcome, and an LLM-driven ranking is neither reproducible nor auditable in that way. Keeping the scoring deterministic also means it can be unit tested; an LLM in that role could not be.

## Consequences

- Two separate concerns that could be conflated into "the AI" are deliberately kept apart: parsing freeform input into Busy Blocks / Topic Preferences (AI-suitable, non-authoritative), and scoring Plans (deterministic, authoritative). A future contributor tempted to let the model "just decide" should read this first.
- The structured-input parsing step is not required for v1 — a plain form achieves the same structured data without an LLM in the critical path. AI-assisted input is an optional alternative UI on top of the same schema, not a dependency of the matching logic.
