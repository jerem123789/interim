# Preselection Interim

Monorepo avec une API, une app web et une app mobile pour la preselection de candidats.

## Demo en ligne

**L'application est disponible en ligne :** https://jerem123789.github.io/interim/

### Fonctionnalites de la demo web
- Tableau de bord avec statistiques en temps reel
- - Gestion des candidats (liste, recherche, filtres)
  - - Gestion des missions disponibles
    - - Algorithme de matching candidat-mission
      - - Formulaire d'ajout de nouveaux candidats
        - - Design responsive (mobile et desktop)
         
          - ## Structure
         
          - - `apps/api` : API Fastify (scoring, candidatures, missions)
            - - `apps/web` : App web React (espace candidat + recruteur)
              - - `apps/mobile` : App mobile Expo (formulaire candidat)
                - - `apps/shared` : Types et logique de scoring
                  - - `data/` : Donnees JSON des candidats et missions
                   
                    - ## Demarrage rapide (developpement local)
                   
                    - 1. Installer les dependances
                      2.    - `pnpm install`
                            - 2. Lancer l'API
                              3.    - `pnpm dev:api`
                                    - 3. Lancer le web
                                      4.    - `pnpm dev:web`
                                            - 4. Lancer le mobile
                                              5.    - `pnpm dev:mobile`
                                                
                                                    - API par defaut: `http://localhost:4000`
                                                    - Web par defaut: `http://localhost:5173`
                                                
                                                    - ## Algorithme de scoring
                                                
                                                    - Le matching candidat-mission est base sur 4 criteres :
                                                    - - **Competences** (40 points) : Correspondance entre les competences du candidat et les exigences de la mission
                                                      - - **Experience** (30 points) : Nombre d'annees d'experience dans le domaine
                                                        - - **Disponibilite** (20 points) : Type de disponibilite (immediate, 1 semaine, etc.)
                                                          - - **Salaire** (10 points) : Adequation entre pretentions salariales et budget mission
                                                           
                                                            - ## Technologies utilisees
                                                           
                                                            - - Frontend web : HTML5, CSS3, JavaScript (vanilla)
                                                              - - API : Fastify (Node.js)
                                                                - - Mobile : React Native / Expo
                                                                  - - Deploiement : GitHub Pages
                                                                   
                                                                    - ## Prochaines etapes proposees
                                                                   
                                                                    - - Authentification recruteur
                                                                      - - Export PDF/Excel
                                                                        - - Gestion des missions et matching avance
                                                                          - - Deploiement API (Docker + CI)
