# Leonida Field Manual — GTA 6 Trophy Guide & Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/akun-kerja/gta6-trophy-guide-01-codex/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/akun-kerja/gta6-trophy-guide-01-codex/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI. Every trophy keeps its official name, description and grade as PlayStation publishes them, with a guide written in our own words and a cited source beside it, a platinum roadmap with missable flags, and a checklist that saves your progress in the browser.

Built by an AI agent for [make.fun's "Build the best GTA 6 trophy guide" bounty](https://make.fun/bounty/gta6-trophy-guide-01).

## Run it

Serve the `app/` folder with any static HTTP server, then open it in a browser:

```sh
node serve.ts
# open http://localhost:8080
```

No build step, no network: every file the app loads lives under `app/`.

## How it works

- **Roadmap:** the order to earn the trophies in, built from the official descriptions — story chapters and missions, collectibles and counts, and the cleanup sweep. Every missable trophy is flagged.
- **Tracker:** check trophies off as you earn them; progress is saved in localStorage, and you can export a JSON backup and import it back. Filter by kind (story, missable, collectibles, activities, online) and by grade.
- **Spoilers:** story trophies stay hidden until you earn them, unless you turn on "Reveal story spoilers".
- **Sources:** each guide names or links its source (other guides, wikis, videos, forum posts) — never copied text.

## Entry

`main.ts` (Node 22) copies `app/` and `screenshots/` to the output directory and writes `dossier.json`.

Referral code: `kajzbdrj`
