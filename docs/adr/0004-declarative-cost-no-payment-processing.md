# Cost is a declaration, never a calculation

A Topic's Sponsor field is a plain boolean-ish choice per Participant: "I'll cover this" or nothing (which means Split — see `CONTEXT.md`). meetsync does not calculate who owes what, does not integrate a payment provider, and does not track settlement.

## Why

The problem this solves is social, not financial: in the group that motivated this project, the awkward moment was nobody being willing to ask out loud "wait, is this on you?" before committing to a plan. Surfacing sponsor intent up front removes that awkwardness. Actually splitting a bill is a different, much bigger domain (amounts, currencies, IOUs, settlement) that tools like Splitwise already solve well — pulling it in here would block shipping the actual need.

## Consequences

- If two Participants both declare Sponsor on the same Topic, meetsync shows both and does not arbitrate; they resolve it themselves outside the system.
- No amounts, receipts, or balances are ever stored. A future reader adding a "total cost" field should treat that as a new feature requiring its own decision, not a natural extension of Sponsor.
