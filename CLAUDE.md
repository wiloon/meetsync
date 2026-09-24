# meetsync

## Language convention

Every developer-facing artifact in this repo is English-only: `CONTEXT.md`, ADRs, commit messages, code comments, identifiers, and the English source strings for UI copy. This applies regardless of what language the design conversation that produced them was held in.

End-user-facing UI copy is the one exception: the app itself supports an English/Chinese language switch (see [ADR-0010](docs/adr/0010-en-zh-ui-language-switch.md)), so UI strings are written as translation keys with an English source string, not hardcoded English text. User-generated content (a Gathering's title, a Topic's name or Location) is never translated — it stays exactly as its author typed it.

## Agent skills

### Issue tracker

Issues live as GitHub issues on `wiloon/meetsync`, managed with the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context: `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
