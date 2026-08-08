# NBA Analytics Dashboard

Dashboard interactif d'analytics NBA — projet soumis au **AQX Sports Analytics Data Bowl 3.0**.

## Fonctionnalités

- **Classement** : tableaux Est/Ouest calculés depuis les matchs réels de la saison 2025-26 (W, L, PCT, streak, point differential)
- **Joueurs** : stats des vedettes de la saison 2025-26 (PPG, RPG, APG, SPG, BPG, FG%/3P%/FT%)

## Démarrage

```bash
npm install
npm run dev
```

## Données

Le dashboard fonctionne sur des **snapshots statiques** stockés dans `src/data/` :
- `teams.json` + `games_2025.json` — matchs et équipes de la saison 2025-26 via [balldontlie.io](https://balldontlie.io) (1236 matchs)
- `players_2026.json` — stats des joueurs issues de [sportsdataverse/ESPN](https://github.com/sportsdataverse/sportsdataverse-data)

Stratégie "snapshot" choisie car le plan gratuit balldontlie est limité à 5 requêtes/min et n'ouvre pas les moyennes joueurs.

## Régénérer les données

```bash
# 1. Équipes + matchs (balldontlie) — nécessite une clé API
#    Copier .env.example vers .env et renseigner VITE_BALLDONTLE_API_KEY
node scripts/fetch-nba-data.mjs

# 2. Stats joueurs — nécessite de télécharger le CSV ESPN :
#    https://github.com/sportsdataverse/sportsdataverse-data/releases/download/espn_nba_player_season_stats/player_season_stats_2026.csv
node scripts/build-player-data.mjs <chemin-du-csv>
```

## TO-DO avant la deadline (15 août 2026) — viser la 1re place

Objectif : renforcer le critère **Analytical Insight** du hackathon ("actionable insights" plutôt que stats descriptives).

- [ ] **Insight analytique** : ajouter au moins 1 analyse solide (ex. corrélation efficacité au tir ↔ victoires, ou modèle de "team strength" basé sur le point differential)
- [ ] **Métriques avancées** : ajouter TS% et PER sur les pages joueur/équipe
- [ ] **README** : documenter la méthodologie des insights (quoi, pourquoi, résultat)
- [ ] **Devpost** : mettre à jour la description avec les nouveaux insights + re-soumettre avant le 15 août
- [ ] **Vérifs** : `npm run lint` + `npm run build` avant chaque push (le repo est connecté à Vercel, ne pas casser le build)

## Crédits

- Données NBA : [balldontlie.io](https://balldontlie.io) (scores, matchs)
- Stats joueurs : [SportsDataVerse](https://github.com/sportsdataverse) (ESPN player season stats)
- Built with [React](https://react.dev) + [Vite](https://vite.dev)
