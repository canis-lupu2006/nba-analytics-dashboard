# CONTEXT.md — Mémoire du projet

## Hackathon
- **Nom** : AQX Sports Analytics Data Bowl 3.0
- **Lien** : https://aqxanalyticsthree.devpost.com/
- **Deadline** : 15 août 2026 @ 23h45 PDT (il restait ~9 jours au 07/08/2026)
- **Type** : Dashboard / web app / predictive model de sports analytics, open-source
- **Soumission** : prototype fonctionnel + code GitHub public + description. Pas de vidéo requise.
- **Conditions** : étudiants uniquement, tout sport pro
- **Critères de jugement** :
  1. Practical Application (utile pour un coach/FO/athlète)
  2. Analytical Insight (solidité statistique)
  3. Data Presentation (visualisations claires)

## Décisions prises
- **Sport** : NBA (l'API publique est gratuite et riche)
- **Format** : Dashboard interactif
- **Stack** : React + Vite + Recharts (pas Flutter — plus rapide pour un dashboard)
- **Sections du dashboard** :
  1. Classement des équipes (W/L, %, victoires, division/conference)
  2. Stats des joueurs (PPG, RPG, APG, efficacité TS%/PER)
- **Priorité** : la Data Presentation + une insight analytique simple mais solide
- Participant : étudiant, en 3e année (année prochaine)

## Compte GitHub
- Username : `canis-lupu2006`
- Repo : `nba-analytics-dashboard` (public)

## API NBA candidates
- **balldontlie.io** : choisie pour les matchs/classement. **IMPORTANT : plan gratuit = 5 req/min ET PAS d'accès aux moyennes joueurs, classement direct, ni stats (401).** Clé API dans `.env` (jamais sur GitHub).
- **Stats joueurs** : CSV public sportsdataverse/ESPN (player_season_stats_2026.csv), traité par `scripts/build-player-data.mjs`.
- **Stratégie "snapshot"** : les données sont capturées une fois et stockées en JSON dans `src/data/` → l'app charge instantanément, sans rate-limit, fiable pour la démo. Scripts de regénération dans `scripts/`.
- stats.nba.com / data.nba.net / api.nba.com / ESPN : bloqués par CORS/403 depuis navigateur

## Architecture
- `src/lib/data.js` — importe les JSON snapshot (teams, games_2025, players_2026)
- `src/lib/standings.js` — calcule le classement (W/L/PCT/streak/diff) depuis les matchs
- `src/components/Standings.jsx` — tableaux Est/Ouest
- `src/components/Players.jsx` — stats des 19 vedettes (saison 2025-26)
- `src/App.jsx` — onglets Classement/Joueurs
- `scripts/fetch-nba-data.mjs` — regénère teams.json + games_2025.json depuis balldontlie (respecte 5 req/min)
- `scripts/build-player-data.mjs` — transforme le CSV ESPN en players_2026.json
- `scripts/test-standings.mjs` — vérifie la logique de classement

## État d'avancement
- [x] Repo GitHub créé + CONTEXT.md poussé
- [x] Projet React + Vite + Recharts installé
- [x] Clé API balldontlie (plan gratuit)
- [x] Snapshot données : 30 équipes, 1236 matchs saison 2025-26, 19 joueurs vedettes
- [x] Composant Classement des équipes (calculé des matchs réels)
- [x] Composant Stats des joueurs (CSV ESPN)
- [x] Style / dashboard layout (dark, badges équipes)
- [ ] Déploiement (Vercel/Netlify)
- [ ] Soumission Devpost
