# meetsync

meetsync lets a small group agree on a topic, a time, and who covers the cost for a casual gathering, without anyone creating an account. The language below is opinionated about one thing in particular: nothing is scheduled against a bare calendar — every time preference, every priority, and every cost declaration is attached to a Topic.

## Language

### People & access

**Gathering**:
The invite an Organizer creates: a title, a date range, and a link. Contains one or more Topics.
_Avoid_: event, meetup, activity

**Organizer**:
The Participant who created the Gathering and set its date range. Carries no power beyond that authorship — an Organizer proposes and votes on Topics like anyone else.
_Avoid_: host, admin, creator

**Participant**:
Anyone who opens a Gathering's link and claims a display name. No account or password exists in this system.
_Avoid_: user, member, guest

**Identity Claim**:
A returning Participant recovering their previously-chosen name in a Gathering, backed by a browser-local token rather than a login. A name already claimed by an active token cannot be claimed by someone else.
_Avoid_: login, sign-in, session

### Topics & time

**Topic**:
A candidate activity proposed inside a Gathering (dinner, coffee, an online game, a video call). The central unit in this domain: time preference, priority, and Sponsor all attach to a Topic, not to the Gathering as a whole or to a bare date.
_Avoid_: activity, event, option, poll

**Busy Block**:
A span of time within the Gathering's date range where a Participant states they cannot attend anything, regardless of Topic. Entered once per Participant, independent of any Topic.
_Avoid_: unavailability, conflict, time off

**Free Time**:
A Participant's available time, derived by subtracting their Busy Blocks from the Gathering's date range. Never entered directly — it's a computed view, not a field.
_Avoid_: availability (ambiguous about which direction it's phrased in)

**Topic Preference**:
A Participant's stance on one Topic: a priority rank relative to their other Topic Preferences in the same Gathering, plus an optional time window narrower than their Free Time. Without a narrower window, a Topic Preference inherits the Participant's full Free Time.
_Avoid_: vote, interest, rating

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
