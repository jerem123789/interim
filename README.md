# Preselection Interim

Monorepo avec une API, une app web et une app mobile pour la preselection de candidats.

## Structure
- `apps/api` : API Fastify (scoring, candidatures, missions)
- `apps/web` : App web React (espace candidat + recruteur)
- `apps/mobile` : App mobile Expo (formulaire candidat)
- `apps/shared` : Types et logique de scoring

## Demarrage rapide
1. Installer les dependances
   - `pnpm install`
2. Lancer l'API
   - `pnpm dev:api`
3. Lancer le web
   - `pnpm dev:web`
4. Lancer le mobile
   - `pnpm dev:mobile`

API par defaut: `http://localhost:4000`
Web par defaut: `http://localhost:5173`

## Prochaines etapes proposees
- Authentification recruteur
- Export PDF/Excel
- Gestion des missions et matching avance
- Deploiement (Docker + CI)
