# Public Claim Badge, never the Identity Token itself

Every Participant's current claim is visible to everyone via a Claim Badge — a truncated SHA-256 hash of their private Identity Token, shown next to their name. The Identity Token itself is never transmitted to, or displayed for, anyone but its own holder's browser.

## Why

Letting the group see when a name's claim has moved to a different device is a real anti-impersonation signal on top of the technical rule that an active name can't be claimed by someone else — the group can notice "wait, that badge just changed" the way they'd notice a friend's messaging app suddenly showing "new device." But the naive version of this idea is to show the Identity Token itself, which is exactly wrong: the token *is* the credential, so displaying it hands out the very thing that lets someone act as that Participant, defeating the point entirely. Hashing breaks that link while keeping the "did this change" signal intact.

## Consequences

- A Claim Badge is stable for as long as the same token holds a name, and changes the moment a different claim succeeds — whether that's a legitimate reclaim from a new device or something worth questioning.
- SHA-256, not MD5: this is about not raising an eyebrow in review, not because MD5's known collision weaknesses are actually the relevant attack here (the property needed is preimage resistance against a high-entropy random token, which MD5 still provides) — SHA-256 costs nothing extra and avoids the conversation.
- Phase 1 shows only the *current* badge, not a history of past claims. A full audit log of every claim over time is a bigger feature, not part of this.
- The Claim Badge is derived, never stored — computed from `identityToken` on demand, so there's no separate field to keep in sync.
