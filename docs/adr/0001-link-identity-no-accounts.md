# Link-based identity, no accounts

A Gathering is reached only through its link; a Participant claims a display name on arrival, and a returning Participant reclaims it via a browser-local token (see Identity Claim in `CONTEXT.md`). There is no username/password or third-party login anywhere in the system.

## Why

The group this is built for is a handful of people who already trust each other and already have the link through a private channel (a chat group). Real authentication would add a signup flow, password/session storage, and a lost-access recovery path for a threat model — a stranger impersonating a friend inside a link only friends have — that doesn't meaningfully exist here. The link itself is the access control.

## Consequences

- A Participant who loses their browser's local token loses their claim on their name and must pick a new one; nothing recovers the old identity.
- Anyone who obtains the Gathering link can join and claim any unclaimed name — acceptable because the link is only ever shared inside the group it's meant for, never made public.
- Moving to real accounts later is a genuine rewrite (identity would need to move server-side and become the join key for Busy Blocks and Topic Preferences), not a toggle.
