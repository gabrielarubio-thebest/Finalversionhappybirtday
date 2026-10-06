# 🪅 Boss Birthday Survival

A personalised birthday mini-game. Pure HTML/CSS/vanilla JS — no backend, no build step.

## Run it
Open `index.html` in a browser, or upload the folder to any static host (GitHub Pages, Netlify, etc.).
Tip: `index.html?level=9` jumps straight to level 9 — handy for testing.

## Personalise it
| What | Where |
|---|---|
| Her name, role, nickname, team name | `js/messages.js` → `PERSON` |
| Inside-joke levels (texts, punchlines) | `js/messages.js` → `STORY` |
| Level order & difficulty | `js/messages.js` → `LEVELS` |
| Hit words, fake-piñata lines, etc. | `js/messages.js` → `HIT_WORDS`, `FAKE_WORDS`, `HIDDEN_MISS` |
| Song lyrics | `js/messages.js` → `SONG` (also in `LYRICS.md`) |
| Edinburgh challenges | `js/challenges.js` |
| Audio files (optional) | `js/audio.js` → `AUDIO_FILES`, files in `assets/audio/` |

## Levels
1. The Ignored Request · 2. The Microwave Incident · 3. The Edinburgh Knife Incident · 4. The Last Cookie
5. The Wanderer · 6. Speed Demon · 7. The Twins · 8. The Trickster · 9. Hidden Piñata · 10. Chaos Mode · 11. Final Boss · 12. The Golden Piñata

Every arena level unlocks an Edinburgh challenge; all unlocked ones appear on the final screen as missions she can tick off.

## Audio
Music and all sound effects are synthesized live (Web Audio API) — original, no files required.
Music starts after "START MISSION" (browsers block autoplay). Toggle 🔊 Music / 🔔 SFX in the top-right.
