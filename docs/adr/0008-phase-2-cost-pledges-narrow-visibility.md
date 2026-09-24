# Phase 2: cost Pledges, visible only to the Organizer and the pledging Participant

Phase 2 adds Pledge on top of Phase 1's Sponsor/Split ([0004](0004-declarative-cost-no-payment-processing.md)): a Participant may declare a monetary amount, optionally capped, toward a Topic's Organizer-set Estimated Cost. A Pledge's amount is visible only to the Organizer and the Participant who made it; every other Participant sees only aggregate progress against the Estimated Cost (e.g. "3 pledges, estimated cost covered"), never named figures.

## Why

0004 kept cost purely declarative specifically to avoid the awkwardness of one friend seeing exactly what another is willing to pay. A Pledge needs a real amount to be useful, but showing those amounts by name to the whole group would reintroduce that exact awkwardness through comparison ("they only put in $5, she put in $50"). Narrowing visibility to the Organizer and the pledger keeps the group informed about whether a Topic is financially viable without exposing anyone's specific number.

## Consequences

- A Pledge is only meaningful as progress once a Topic has an Estimated Cost; without one, the system can show a raw pledged total but not a "covered" fraction.
- Sponsor and Pledge coexist but don't need each other: a Topic with a Sponsor doesn't need Pledges, since the whole cost is already covered by declaration.
- This is Phase 2 only. Phase 1 ships with Sponsor/Split exactly as [0004](0004-declarative-cost-no-payment-processing.md) describes, no Estimated Cost or Pledge involved.
