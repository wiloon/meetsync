# Timezone: auto-detect and display, with a manual override; store everything as UTC instants

Every Gathering has a **Gathering Timezone**, auto-detected from the Organizer's browser when they create it and shown plainly, with a manual override if it's wrong. Every Participant independently has a **Viewing Timezone** for their own browser, same treatment. Every Busy Block, Topic Busy Block, and computed Plan window is stored and scored as an absolute UTC instant, never a bare `{day, hour}` tuple implicitly assumed to mean the same thing to everyone. This reverses the earlier "skip timezones, assume a same-city group" stance from issue #1's original Further Notes.

## Why

A manual dropdown on every visit (When2meet's approach) is one more thing to get right before anyone can do anything useful; auto-detecting removes that step for the common case. But auto-detection can be wrong — a misconfigured system clock, someone on a VPN — so a visible override is the escape hatch, not a hidden fallback. Storing bare local-looking hours instead of real instants would silently corrupt every cross-timezone comparison the moment two Participants aren't actually in the same zone, which is exactly the assumption this ADR reverses.

## Consequences

- `MatchingEngine`'s input encoding changes, not just its configuration: Busy Blocks and the Gathering's own dates are absolute UTC instants, converted to a viewer's wall-clock hours only at render time. This is a bigger change than the earlier granularity tweak (0003's Further Notes) — it touches the seam's contract, not a default value.
- DST is handled correctly by construction, since an instant's offset is looked up against its own calendar date, never a fixed per-zone constant.
- A Gathering Timezone lives on the Gathering (domain data, anchors what "day 1" even means); a Viewing Timezone is a per-browser display preference, the same category of thing as the language choice in [ADR-0010](0010-en-zh-ui-language-switch.md) — neither Participant field needs server-side storage for it.
