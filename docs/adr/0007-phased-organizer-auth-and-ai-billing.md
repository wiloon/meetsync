# Phase 2: Organizer authentication and AI-cost billing, Participants stay account-free by default

Phase 2 introduces an Organizer Account: a real, authenticated identity for the Organizer only, holding an AI Credit Balance that pays for AI-assisted interactions (see [0005](0005-deterministic-matching-ai-scoped-to-io.md)) across everyone in their Gatherings. Each Participant gets an Interaction Limit; the Organizer gets a Low Balance Alert when their balance or a Participant's limit runs out. An Organizer may also set a Gathering Passcode — a single shared secret, not a personal credential — that Participants must supply before claiming a name. None of this changes how a Participant joins: link, name, Identity Claim, exactly as in [0001](0001-link-identity-no-accounts.md).

## Why

AI-assisted parsing and summary generation costs money per call, and someone accountable has to pay for it. That can't be the Participants — they have no persistent identity to bill (0001) — so the Organizer, who already originates the Gathering, is the natural place to put both the account and the balance. Capping each Participant's Interaction Limit protects that balance from one person's runaway usage; the Gathering Passcode is a separate, optional knob for an Organizer who wants a lighter barrier to joining than nothing at all, without building full Participant accounts to get it.

## Consequences

- meetsync ends up with a real account system for exactly one role. A reader should not read "no accounts" as a whole-system property after Phase 2 — it's scoped to Participants, not Organizers.
- A Gathering Passcode identifies nothing; two people who both have it are indistinguishable to the system until each separately claims a name. It is a join gate, not identity.
- This is a build gate on [0005](0005-deterministic-matching-ai-scoped-to-io.md): there's nothing to bill until AI-assisted input actually exists, so Phase 1 ships with neither an Organizer Account nor any of this.
- A future phase giving Participants real third-party accounts (e.g. WeChat/Google login) is a distinct, larger decision that would need to properly revisit 0001, not just extend this ADR.
