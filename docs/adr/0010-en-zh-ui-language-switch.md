# Phase 1: English/Chinese UI language switch, strings as translation keys from the start

The app's own interface (buttons, labels, headings, hints — not user-generated content) supports switching between English and Chinese. Every UI string is authored as a translation key with an English source string and a Chinese translation, from the first screen built — never a hardcoded English literal added "for now." This supersedes `CLAUDE.md`'s first version of the language convention and issue #1's original story 35 / Out of Scope line, both written as English-only-UI before this requirement existed.

## Why

Retrofitting translation keys into a UI that was built with hardcoded strings means touching every screen a second time; doing it from the first ticket costs close to nothing in comparison. The group this is for chats in Chinese day to day, so an English-only interface was always going to be a friction point once real people other than the developer used it.

## Consequences

- Developer-facing artifacts are unaffected: code comments, identifiers, commit messages, `CONTEXT.md`, and ADRs stay English-only, per `CLAUDE.md`. Only end-user UI copy is bilingual.
- User-generated content (a Gathering's title, a Topic's name or Location) is never translated or transliterated — whatever language a Participant typed it in is what everyone sees.
- `to-tickets` should treat "every new string is a translation key, not a literal" as a standing acceptance criterion across all UI tickets, not a separate ticket of its own.
- Layout has to tolerate Chinese strings running much shorter than their English source (validated in the `prototype/language-switch-ui` prototype) — fixed-width buttons sized for English text can look sparse in Chinese, but the reverse failure (Chinese text overflowing a box sized for it) is the one to actually test for.
