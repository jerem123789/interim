# Guide de Test - Preselection Interim

## 🚀 Ce que tu as maintenant

Ton application est prête avec :
- **3 candidats test** dont Lamin (manutentionnaire)
- **3 missions** dans différents secteurs
- **API complète** avec système de scoring intelligent

## 💾 Structure du projet

```
interim/
├── apps/
│   └── api/
│       ├── server.js       # Serveur Fastify avec routes
│       └── package.json    # Dépendances API
└── data/
    └── candidats.json  # Données des candidats et missions
```

## ⚙️ Installation

### 1. Cloner le repo

```bash
git clone https://github.com/jerem123789/interim.git
cd interim
```

### 2. Installer les dépendances de l'API

```bash
cd apps/api
npm install
```

### 3. Lancer l'API

```bash
npm start
```

L'API démarre sur `http://localhost:4000`

## 🧪 Tests avec Lamin

### 1. Vérifier que l'API fonctionne

Ouvre ton navigateur : http://localhost:4000

Tu devrais voir :
```json
{
  "status": "ok",
  "service": "Preselection Interim API",
  "candidats": 3,
  "missions": 3
}
```

### 2. Récupérer le profil de Lamin

**URL** : http://localhost:4000/api/candidats/lamin-001

**Réponse** : Profil complet de Lamin avec ses compétences, expérience, certifications (CACES 1, SST), etc.

### 3. Voir toutes les missions disponibles

**URL** : http://localhost:4000/api/missions

**Réponse** : Liste des 3 missions (logistique, admin, production)

### 4. 🎯 Tester le scoring de Lamin pour une mission

**Mission Logistique** (parfait pour Lamin) :

**URL** : http://localhost:4000/api/score/lamin-001/mission-log-001

**Résultat attendu** : ~80-90% de compatibilité car :
- ✅ Compétences : manutention, CACES 1, gestion stock
- ✅ Expérience : 3 ans (dans la fourchette 1-3 ans)
- ✅ Disponibilité : journée + 2x8
- ✅ Salaire : 12€/h compatible avec ses prétentions (11.5-13€)

### 5. Voir tous les candidats pour une mission

**URL** : http://localhost:4000/api/mission/mission-log-001/candidats

**Résultat** : Classement des 3 candidats par score (Lamin devrait être premier)

## 📊 Routes API disponibles

### Candidats

- `GET /api/candidats` - Liste tous les candidats
- `GET /api/candidats/:id` - Détails d'un candidat
  - Exemple : `/api/candidats/lamin-001`
  - Exemple : `/api/candidats/sophie-002`
  - Exemple : `/api/candidats/kevin-003`

### Missions

- `GET /api/missions` - Liste toutes les missions
- `GET /api/missions/:id` - Détails d'une mission
  - Exemple : `/api/missions/mission-log-001` (Manutentionnaire)
  - Exemple : `/api/missions/mission-admin-001` (Assistante admin)
  - Exemple : `/api/missions/mission-prod-001` (Opérateur production)

### Scoring

- `GET /api/score/:candidatId/:missionId` - Score d'un candidat pour une mission
  - Exemple : `/api/score/lamin-001/mission-log-001`
  
- `GET /api/mission/:missionId/candidats` - Tous les candidats classés pour une mission
  - Exemple : `/api/mission/mission-log-001/candidats`

## 💡 Exemples de tests intéressants

### Test 1 : Lamin pour la mission logistique (excellent match)
```
http://localhost:4000/api/score/lamin-001/mission-log-001
```
👉 Score élevé (80-90%)

### Test 2 : Lamin pour la mission admin (mauvais match)
```
http://localhost:4000/api/score/lamin-001/mission-admin-001
```
👉 Score faible (20-30%) - compétences différentes

### Test 3 : Classement pour mission logistique
```
http://localhost:4000/api/mission/mission-log-001/candidats
```
👉 Lamin devrait être 1er, Kevin 2e, Sophie 3e

## 🔍 Comprendre le scoring

Le score est calculé sur 100 points :

- **Compétences** (40 pts) : Nombre de compétences matchées
- **Expérience** (30 pts) : Années d'expérience dans la fourchette requise
- **Disponibilité** (20 pts) : Horaires compatibles
- **Salaire** (10 pts) : Prétentions alignées avec l'offre

## 🛠️ Modifier les données

Tu peux éditer `data/candidats.json` pour :
- Ajouter de nouveaux candidats
- Modifier les compétences de Lamin
- Créer de nouvelles missions
- Ajuster les critères

Après modification, redémarre simplement l'API (`npm start`).

## 👥 Les 3 candidats test

### Lamin (lamin-001)
- **Profil** : Manutentionnaire, 28 ans
- **Expérience** : 3 ans en logistique
- **Compétences** : Manutention, CACES 1, gestion stock
- **Certifications** : CACES 1, SST
- **Meilleure mission** : Logistique

### Sophie (sophie-002)
- **Profil** : Assistante administrative, 32 ans
- **Expérience** : 8 ans en admin/compta
- **Compétences** : Bureautique, Excel, comptabilité
- **Certifications** : TOSA Excel Avancé
- **Meilleure mission** : Administration

### Kevin (kevin-003)
- **Profil** : Opérateur production, 24 ans
- **Expérience** : 2 ans en production
- **Compétences** : Assemblage, contrôle qualité, travail posté
- **Meilleure mission** : Production

## ✅ Prochaines étapes

1. **✅ Déjà fait** : API fonctionnelle avec scoring
2. **🔗 Interface web** : Créer une interface React pour afficher les candidats/missions
3. **📱 App mobile** : Expo pour que les candidats postulent
4. **🤖 IA** : Intégrer un LLM pour améliorer le matching
5. **📊 Dashboard** : Statistiques et analytics

## 👍 Bon test !

Tu as maintenant une API complète pour tester le scoring de Lamin et des autres candidats. L'algorithme est déjà opérationnel et peut être affiné selon tes besoins.

Si tu veux améliorer le système, tu peux :
- Ajuster les pondérations (compétences 40%, expérience 30%, etc.)
- Ajouter des critères (mobilité, langues, soft skills)
- Utiliser un ML pour apprendre des placements réussis
