# Topic is the aggregate root, not the calendar

Every existing scheduling tool we looked at (When2meet, Doodle, Rallly) is built around a shared calendar or a flat list of options that time and preference attach to uniformly. meetsync instead makes Topic the central entity: a Participant's priority, their narrowed time preference, and any Sponsor declaration all attach to a (Participant, Topic) pair, not to the Gathering as a whole.

## Why

Time sensitivity genuinely varies by Topic in this domain — dinner needs a mealtime, an online game or video call doesn't — and so does cost (dinner has a Sponsor question, a video call doesn't). Modeling Topic as a peer of, or subordinate to, a global time grid would force those Topic-specific attributes to be bolted onto the calendar model sideways. Making Topic the aggregate root lets each one carry exactly the attributes it needs.

## Consequences

- A reader coming from When2meet/Doodle/Rallly will expect a calendar-first UI; the actual UI is a Topic list first, with time as a per-Topic drill-down. This is deliberate, not an oversight.
- Supports resolving a Gathering into multiple simultaneous Plans (see [0006](0006-multiple-simultaneous-plans.md)), since Plans are scoped per Topic rather than requiring one global slot.
- See [0003](0003-two-layer-time-collection.md) for how Free Time still gets shared across Topics despite Topic being the root.
