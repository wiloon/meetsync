# meetsync

meetsync lets a small group agree on a topic, a time, and who covers the cost for a casual gathering, without anyone creating an account. The language below is opinionated about one thing in particular: nothing is scheduled against a bare calendar — every time preference, every priority, and every cost declaration is attached to a Topic.

## Language

### People & access

**Gathering**:
The invite an Organizer creates: a title, a set of candidate dates (contiguous or not), and a link. Contains one or more Topics.
_Avoid_: event, meetup, activity

**Organizer**:
The Participant who created the Gathering and set its dates. Carries no power beyond that authorship — an Organizer proposes and votes on Topics like anyone else.
_Avoid_: host, admin, creator

**Participant**:
Anyone who opens a Gathering's link and claims a display name. No account or password exists in this system.
_Avoid_: user, member, guest

**Identity Claim**:
A returning Participant recovering their previously-chosen name in a Gathering, backed by a browser-local token rather than a login. A name already claimed by an active token cannot be claimed by someone else. A claim goes inactive automatically after 24 hours with no activity, or can be released early by the Organizer — either frees the name for someone (including its original holder, from a new device) to claim.
_Avoid_: login, sign-in, session

### Topics & time

**Topic**:
A candidate activity proposed inside a Gathering (dinner, coffee, an online game, a video call). The central unit in this domain: time preference, priority, and Sponsor all attach to a Topic, not to the Gathering as a whole or to a bare date.
_Avoid_: activity, event, option, poll

**Busy Block**:
A span of time within the Gathering's selected dates where a Participant states they cannot attend anything, regardless of Topic. Entered once per Participant, independent of any Topic.
_Avoid_: unavailability, conflict, time off

**Free Time**:
A Participant's available time, derived by subtracting their Busy Blocks from the Gathering's selected dates. Never entered directly — it's a computed view, not a field.
_Avoid_: availability (ambiguous about which direction it's phrased in)

**Topic Preference**:
A Participant's stance on one Topic: a priority rank relative to their other Topic Preferences in the same Gathering, plus any Topic Busy Blocks that further narrow their Free Time for that Topic specifically. Without any Topic Busy Blocks, a Topic Preference's effective time is the Participant's full Free Time.
_Avoid_: vote, interest, rating

**Topic Busy Block**:
A Busy Block scoped to one Topic rather than the whole Gathering: time the Participant can't give to that Topic specifically, even though they're otherwise free then. Narrows only that Topic's effective time, leaving the Participant's Free Time and other Topics untouched.
_Avoid_: time preference, restriction, exception

**Topic Location**:
An optional place suggestion attached to a Topic (a specific café, "at Sam's place", "online"). Free text, not voted on or scored — a shared note so a Topic's Plan carries a place alongside its time and attendees.
_Avoid_: venue, address

**Gathering Timezone**:
The timezone a Gathering's dates are anchored to, auto-detected from the Organizer's browser at creation with a manual override. Every Busy Block, Topic Busy Block, and Plan is stored and scored as an absolute instant against it, never a bare hour number.
_Avoid_: server timezone, UTC (UTC is the storage format, not this)

**Viewing Timezone**:
The timezone a Participant sees times displayed in and enters Busy Blocks against — auto-detected from their own browser with a manual override, independent of the Gathering Timezone. The same instant renders as different wall-clock hours to Participants with different Viewing Timezones.
_Avoid_: local time (ambiguous about whose local)

### Access & billing

**Organizer Account**:
The authenticated identity an Organizer holds, separate from a Participant's link-based identity. Persists across Gatherings and holds the AI Credit Balance that pays for AI-assisted interactions.
_Avoid_: user account

**Gathering Passcode**:
An optional shared secret an Organizer sets on a Gathering; when set, anyone must supply it before claiming a Participant name. A single shared value, not a personal credential — it gates joining without giving any Participant a persistent identity.
_Avoid_: password

**AI Credit Balance**:
Funds an Organizer holds to pay for AI-assisted interactions (parsing freeform input, generating Plan summaries) across everyone in their Gatherings. Participants never see or manage it directly.
_Avoid_: wallet, credits

**Interaction Limit**:
A per-Participant cap, by both frequency and count, on AI-assisted interactions within a Gathering — bounds how much of an Organizer's AI Credit Balance any single Participant can consume.
_Avoid_: rate limit

**Low Balance Alert**:
A notice sent to the Organizer when their AI Credit Balance can no longer cover further AI-assisted interactions, or when a Participant hits their Interaction Limit.

### Outcome & cost

**Sponsor**:
A Participant who has declared they will cover the group's cost for a Topic. A declaration only — meetsync never computes or records an amount.
_Avoid_: payer, host (collides with Organizer)

**Split**:
The default assumption for a Topic with no Sponsor: attendees share the cost equally, informally, outside the system.
_Avoid_: AA (fine as spoken shorthand, but not the canonical term in docs or code)

**Plan**:
One finalized outcome the matching step proposes: a Topic, a time window, and an attendee set. A single Gathering can resolve into more than one Plan — the group is not required to converge on one answer.
_Avoid_: match, result, proposal

**Estimated Cost**:
An amount the Organizer sets on a Topic for what it's expected to cost. The reference point a Pledge's aggregate progress is measured against.
_Avoid_: budget, price

**Pledge**:
A Participant's declared monetary contribution toward a Topic's Estimated Cost, with an optional cap. Visible only to the Organizer and the pledging Participant — every other Participant sees only aggregate progress against the Estimated Cost, never named amounts. Distinct from Sponsor, which covers a Topic's entire cost by declaration rather than a specific contributed amount.
_Avoid_: donation, contribution
