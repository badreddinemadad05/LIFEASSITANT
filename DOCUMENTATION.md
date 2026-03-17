# LifeOS — Documentation Complète

> **Application web personnelle de productivité**
> Développée en HTML / CSS / JavaScript pur — Sans framework, sans backend

---

## Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Structure des fichiers](#2-structure-des-fichiers)
3. [Architecture technique](#3-architecture-technique)
4. [Système de stockage (DB)](#4-système-de-stockage-db)
5. [Système de design et thèmes](#5-système-de-design-et-thèmes)
6. [Navigation et layout](#6-navigation-et-layout)
7. [Module Tableau de bord](#7-module-tableau-de-bord)
8. [Module Calendrier](#8-module-calendrier)
9. [Module Tâches](#9-module-tâches)
10. [Module Apprentissage](#10-module-apprentissage)
11. [Module Habitudes](#11-module-habitudes)
12. [Module Objectifs](#12-module-objectifs)
13. [Module Notes & Journal](#13-module-notes--journal)
14. [Module Finances](#14-module-finances)
15. [Module Langues](#15-module-langues)
16. [Module Pomodoro](#16-module-pomodoro)
17. [Module Statistiques](#17-module-statistiques)
18. [Module Paramètres](#18-module-paramètres)
19. [Systèmes transversaux](#19-systèmes-transversaux)
20. [Composants UI réutilisables](#20-composants-ui-réutilisables)

---

## 1. Vue d'ensemble

**LifeOS** est une application web mono-page (SPA) qui centralise la gestion de la vie quotidienne dans un seul tableau de bord :

- **Planification** : calendrier, tâches, objectifs
- **Bien-être** : habitudes, journal personnel
- **Apprentissage** : matières, leçons, langues étrangères
- **Productivité** : minuteur Pomodoro avec mode focus
- **Finances** : suivi des revenus et dépenses par mois
- **Analyse** : statistiques historiques et score journalier

L'application fonctionne **100% hors-ligne** (pas de serveur, pas d'internet requis après le chargement). Toutes les données sont sauvegardées dans le **localStorage** du navigateur.

---

## 2. Structure des fichiers

```
TO DO/
├── index.html        — Structure HTML complète de l'application
├── style.css         — Tout le design (dark/light mode, animations, composants)
├── app.js            — Toute la logique JavaScript (modules, data, interactions)
└── DOCUMENTATION.md  — Ce fichier
```

---

## 3. Architecture technique

### Paradigme
L'application utilise le **pattern Module Object** : chaque fonctionnalité est un objet JavaScript avec ses propres méthodes `init()`, `render()`, et fonctions internes.

```
App (coordinateur principal)
├── DB          — Couche de persistance (localStorage)
├── Utils       — Fonctions utilitaires partagées
├── Modal       — Gestionnaire des fenêtres modales
├── Toast       — Notifications temporaires
├── Celebration — Animations de félicitations
├── DashModule  — Tableau de bord
├── CalModule   — Calendrier
├── TaskModule  — Tâches
├── LearnModule — Apprentissage
├── HabitModule — Habitudes
├── GoalModule  — Objectifs
├── NotesModule — Notes & Journal
├── FinanceModule — Finances
├── LangModule  — Langues
├── PomodoroModule — Pomodoro
├── StatsModule — Statistiques
└── SettingsModule — Paramètres
```

### Technologies utilisées
| Technologie | Usage |
|---|---|
| HTML5 | Structure sémantique |
| CSS3 (Custom Properties) | Design system, animations |
| JavaScript ES6+ | Toute la logique |
| localStorage | Persistance des données |
| Chart.js 4.4.0 (CDN) | Graphiques (doughnut, bar, line) |
| SVG inline | Icônes et indicateurs (ring de progression) |

### Chargement
L'application démarre via `App.init()` appelé à la fin de `app.js` dans un événement `DOMContentLoaded`. Cette fonction :
1. Charge les paramètres utilisateur
2. Applique le thème (dark/light)
3. Initialise chaque module
4. Démarre l'horloge en temps réel
5. Navigue vers la page d'accueil (tableau de bord)

---

## 4. Système de stockage (DB)

Toutes les données sont stockées dans `localStorage` avec le préfixe `lifeos_`.

### Clés de stockage

| Clé | Type | Contenu |
|---|---|---|
| `lifeos_settings` | Objet | Nom, avatar, thème, couleur primaire, heures |
| `lifeos_events` | Tableau | Événements du calendrier |
| `lifeos_tasks` | Tableau | Toutes les tâches |
| `lifeos_subjects` | Tableau | Matières d'apprentissage |
| `lifeos_lessons` | Tableau | Leçons par matière |
| `lifeos_habits` | Tableau | Habitudes définies |
| `lifeos_habitLogs` | Objet | `{ "YYYY-MM-DD": { habitId: true/false } }` |
| `lifeos_goals` | Tableau | Objectifs avec progression |
| `lifeos_notes` | Tableau | Notes textuelles |
| `lifeos_journal` | Objet | `{ "YYYY-MM-DD": { text, mood } }` |
| `lifeos_transactions` | Tableau | Transactions financières |
| `lifeos_phrases` | Tableau | Phrases pour l'apprentissage des langues |

### Format des données importantes

**Tâche :**
```json
{
  "id": "abc123",
  "title": "Réviser le cours",
  "priority": "high",
  "status": "todo",
  "deadline": "2026-03-16",
  "time": "14:00",
  "category": "study",
  "completedAt": "2026-03-16"
}
```

**Transaction financière :**
```json
{
  "id": "xyz789",
  "type": "expense",
  "category": "groceries",
  "amount": 45.50,
  "date": "2026-03-15",
  "description": "Supermarché"
}
```

**Habitude log :**
```json
{
  "2026-03-16": {
    "habit_id_1": true,
    "habit_id_2": false
  }
}
```

### Génération des IDs
```js
DB.generateId() → Date.now().toString(36) + Math.random().toString(36).slice(2,7)
```
Exemple : `"lzr8k4a2m"` — unique, compact, basé sur le timestamp.

---

## 5. Système de design et thèmes

### Mode sombre (défaut) / Mode clair
Le thème est contrôlé par l'attribut `data-theme` sur la balise `<html>` :
- `data-theme` absent ou `"dark"` → thème sombre
- `data-theme="light"` → thème clair

La propriété `color-scheme: dark` (ou `light`) sur `:root` indique au navigateur d'utiliser les couleurs natives sombres pour les éléments système (scrollbars, select, inputs).

### Variables CSS principales
```css
:root {
  --primary: #6366f1;         /* couleur principale (violet) */
  --bg: #020817;              /* fond de page */
  --bg-card: rgba(255,255,255,0.04);  /* fond des cartes */
  --text-primary: #f1f5f9;    /* texte principal */
  --text-secondary: #94a3b8;  /* texte secondaire */
  --border: rgba(255,255,255,0.08); /* bordures */
  --radius: 12px;             /* arrondi des coins */
}
```

### Couleur primaire personnalisable
L'utilisateur peut changer la couleur primaire dans les Paramètres. La couleur est appliquée dynamiquement via JavaScript :
```js
document.documentElement.style.setProperty('--primary', color);
document.documentElement.style.setProperty('--primary-light', lighten(color));
```

### Glassmorphisme
Les cartes utilisent un style "verre dépoli" : `backdrop-filter: blur(20px)` avec un fond semi-transparent et une bordure lumineuse en haut (`border-top: 1px solid rgba(255,255,255,0.14)`).

### Effet 3D (tilt)
Les cartes `.card-3d` bougent légèrement en 3D quand la souris passe dessus, via un `MutationObserver` qui détecte les nouvelles cartes ajoutées dynamiquement au DOM et leur attache les événements `mousemove` / `mouseleave`.

---

## 6. Navigation et layout

### Structure de la page
```
#app
├── .sidebar         — Barre de navigation gauche
│   ├── .sidebar-brand (logo LifeOS)
│   ├── .sidebar-nav (liens de navigation)
│   └── .sidebar-footer (carte utilisateur)
├── .main-wrapper
│   ├── .topbar      — Barre du haut (menu, titre, horloge, thème)
│   └── .pages-container — Toutes les pages (une visible à la fois)
│       ├── #page-dashboard
│       ├── #page-calendar
│       ├── #page-tasks
│       ├── #page-learning
│       ├── #page-habits
│       ├── #page-goals
│       ├── #page-notes
│       ├── #page-finances
│       ├── #page-languages
│       ├── #page-pomodoro
│       ├── #page-stats
│       └── #page-settings
└── .mobile-nav      — Navigation mobile (bas d'écran)
```

### Principe de navigation
Chaque page est une `<section class="page hidden">`. Pour naviguer :
1. `App.navigate(page)` est appelé
2. Toutes les pages reçoivent la classe `hidden`
3. La page cible perd la classe `hidden`
4. Le module correspondant appelle `render()`

### Sidebar rétractable
Cliquer sur le bouton collapse réduit la sidebar à `64px` de large (icônes seules, labels cachés) via la classe `.sidebar-collapsed` sur `#app`.

### Horloge en temps réel
`startClock()` utilise `setInterval(tick, 1000)` pour :
- Mettre à jour l'heure affichée chaque seconde
- Détecter le changement de jour à minuit → rafraîchit automatiquement les modules concernés
- Rafraîchir la ligne "heure actuelle" du calendrier toutes les 60 secondes
- Rafraîchir les statistiques du dashboard toutes les 5 minutes

---

## 7. Module Tableau de bord

**Fichier :** `DashModule` dans `app.js`
**Page :** `#page-dashboard`

Le tableau de bord est la page d'accueil. Il affiche un résumé de tous les modules.

### Composants affichés

#### Score journalier (anneau SVG)
- Calcule le pourcentage de tâches + habitudes complétées aujourd'hui
- Affiche un cercle SVG avec `stroke-dashoffset` : `offset = 251.2 × (1 - pct/100)`
- La circumférence est `2π × 40 = 251.2` px (rayon = 40)
- Animation CSS : `transition: stroke-dashoffset 0.6s ease`
- Messages motivants selon le score (0%, 50%, 75%, 100%)

#### Timeline du jour
- Récupère tous les événements de la date du jour
- Les trie par heure de début
- Affiche : heure, titre, lieu (si renseigné)
- Chaque événement est cliquable → ouvre le formulaire d'édition du calendrier

#### Tâches du jour
- Filtre les tâches avec `deadline === today`
- Cache automatiquement les tâches `status === 'done'`
- Si toutes terminées : message de félicitations + aperçu des tâches de demain
- Bouton checkbox direct pour marquer comme fait → déclenche une animation de célébration
- Bouton `×` pour supprimer rapidement une tâche
- Aperçu des tâches de demain (max 4) avec un point de couleur selon la priorité

#### Habitudes du jour
- Cache les habitudes déjà validées
- Si toutes validées : message "Toutes les habitudes validées ! 🌟"
- Checkbox directe pour valider une habitude depuis le tableau de bord

#### Objectifs en cours
- Affiche les 4 objectifs non complétés avec leur barre de progression

#### Mini-statistiques (4 chiffres)
- Tâches terminées cette semaine
- Taux d'habitudes (aujourd'hui)
- Heures d'étude cette semaine (calculé depuis les événements de type "study")
- Nombre d'objectifs actifs

#### Citation motivante
- Sélectionnée aléatoirement parmi 10 citations inspirantes à chaque chargement

---

## 8. Module Calendrier

**Fichier :** `CalModule` dans `app.js`
**Page :** `#page-calendar`

### Trois vues
| Vue | Navigation | Description |
|---|---|---|
| Jour | `±1 jour` | Timeline heure par heure avec événements positionnés |
| Semaine | `±7 jours` | Grille 7 colonnes avec événements par jour |
| Mois | `±1 mois` | Grille calendrier classique 6×7 |

### Vue jour (détail technique)
- Crée des `<div class="time-slot">` pour chaque heure (de `startHour` à `endHour`, configurables dans les paramètres)
- Les événements sont positionnés en `absolute` :
  - `top = ((heureDebut - startHour) × 60) px`
  - `height = (durée en minutes) px`
- Une ligne rouge "heure actuelle" est dessinée et mise à jour toutes les minutes

### Gestion des événements
Chaque événement a : titre, date, heure début/fin, couleur, lieu, catégorie, notes.
Cliquer sur un créneau libre ouvre le modal de création pré-rempli avec l'heure.

---

## 9. Module Tâches

**Fichier :** `TaskModule` dans `app.js`
**Page :** `#page-tasks`

### Données d'une tâche
- Titre, priorité (haute/moyenne/basse), statut (todo/in-progress/done)
- Date limite (`deadline`), heure, catégorie
- Champ `completedAt` : date de complétion (utilisée pour les statistiques historiques)

### Fonctionnalités
- **Filtres** : par statut et par priorité
- **Tri** : priorité d'abord (haute → basse), puis par heure
- **`quickToggle(id)`** : bascule le statut `todo → done` directement depuis le dashboard
  - Si la tâche est marquée "done" → déclenche `Celebration.show()` avec le nom de l'utilisateur
  - Si **toutes** les tâches du jour sont terminées → grande célébration (`big=true`) avec 90 confettis
- **`removeTask(id)`** : bouton `×` rouge visible au hover sur chaque tâche du dashboard

---

## 10. Module Apprentissage

**Fichier :** `LearnModule` dans `app.js`
**Page :** `#page-learning`

### Structure
- **Matières** (subjects) : nom, couleur, niveau (débutant/intermédiaire/avancé/expert)
- **Leçons** (lessons) : titre, durée, date, matière parente, statut (à faire/en cours/terminé), notes

### Fonctionnalités
- Créer des matières avec un système de niveaux
- Ajouter des leçons à chaque matière
- Voir la progression par matière (nombre de leçons terminées / total)
- Suppression d'une matière → supprime aussi toutes ses leçons associées

---

## 11. Module Habitudes

**Fichier :** `HabitModule` dans `app.js`
**Page :** `#page-habits`

### Données d'une habitude
- Nom, icône emoji, catégorie, fréquence (quotidien/hebdomadaire)

### Système de logs
Les validations quotidiennes sont stockées dans `habitLogs` :
```json
{ "2026-03-16": { "habit_id": true } }
```

### Streak (série)
`Utils.getStreak(habitId)` remonte dans le passé jour par jour et compte combien de jours consécutifs l'habitude a été faite.

### Célébration
`HabitModule.dashToggle()` est appelé depuis le dashboard :
- Marque l'habitude comme faite dans les logs
- Déclenche `Celebration.show()` avec le nom de l'utilisateur
- Si **toutes** les habitudes sont validées → grande célébration

### Vue semaine
Affiche une grille des 7 derniers jours pour visualiser la régularité de chaque habitude.

---

## 12. Module Objectifs

**Fichier :** `GoalModule` dans `app.js`
**Page :** `#page-goals`

### Données d'un objectif
- Titre, description, catégorie, date limite
- Progression 0-100% (barre visuelle)
- Statut : actif / complété

### Fonctionnalités
- Modifier le pourcentage de progression via un slider
- Marquer un objectif comme complété
- Filtrer par statut (actifs / complétés)

---

## 13. Module Notes & Journal

**Fichier :** `NotesModule` dans `app.js`
**Page :** `#page-notes`

Ce module a deux onglets :

### Onglet Notes
- Liste de notes avec aperçu à gauche, éditeur à droite (layout two-panel)
- Les notes épinglées (📌) apparaissent toujours en premier
- Tri : épinglées → récentes
- Champs : titre + contenu texte libre
- Sauvegarde manuelle via bouton "Enregistrer"

### Onglet Journal
- Une entrée par jour (indexée par date `YYYY-MM-DD`)
- Champs : texte libre + humeur (😊 😐 😔 😤 😴)
- Historique de toutes les entrées passées affiché sous l'éditeur

---

## 14. Module Finances

**Fichier :** `FinanceModule` dans `app.js`
**Page :** `#page-finances`

### Navigation mensuelle
Les boutons `←` et `→` changent `currentMonth` (format `YYYY-MM`). Chaque mois a ses propres données filtrées via :
```js
DB.getTransactions().filter(t => t.date.startsWith(this.currentMonth))
```

**Note technique importante :** La navigation utilise les méthodes `getFullYear()` / `getMonth()` du navigateur (heure locale) et non `toISOString()` (qui est en UTC). Cela évite le décalage de fuseau horaire qui causait un glissement d'un mois pour les utilisateurs en UTC+1 (France).

### Catégories de dépenses
| Clé | Libellé | Icône | Couleur |
|---|---|---|---|
| `groceries` | Courses | 🛒 | Vert |
| `rent` | Loyer | 🏠 | Violet |
| `leisure` | Loisirs | 🎮 | Orange |
| `transport` | Transport | 🚌 | Bleu |
| `personal` | Achat personnel | 👕 | Mauve |
| `other` | Autre dépense | 📦 | Gris |

### Catégories de revenus
| Clé | Libellé | Icône |
|---|---|---|
| `salary` | Job étudiant | 💼 |
| `income_other` | Autre revenu | 💰 |

### Calculs affichés
- **Revenus du mois** : somme de toutes les transactions `type === 'income'`
- **Dépenses totales** : somme de toutes les transactions `type === 'expense'`
- **Épargne nette** : Revenus − Dépenses
- **Taux d'épargne** : `(Épargne / Revenus) × 100`

### Barre de budget
- Rouge si dépenses > revenus
- Orange si > 80% du revenu dépensé
- Vert si < 80%

### Graphique (Chart.js)
- Type : **Doughnut** avec `cutout: 65%`
- Données : répartition des dépenses par catégorie
- Légende personnalisée affichée sous le graphique (couleur, %, montant)
- Le graphique est détruit et recréé à chaque navigation pour éviter les conflits Canvas

### Filtres de liste
- Par type (tous / revenus / dépenses)
- Par catégorie

---

## 15. Module Langues

**Fichier :** `LangModule` dans `app.js`
**Page :** `#page-languages`

### Langues disponibles
- 🇳🇱 **Néerlandais** (Dutch)
- 🇬🇧 **Anglais** (English)

### Données d'une phrase
```json
{
  "id": "abc123",
  "lang": "nl",
  "phrase": "Goedemorgen",
  "translation": "Bonjour",
  "phonetic": "Khoede-morghe",
  "status": "learning",
  "addedAt": "2026-03-01"
}
```

### Statuts d'apprentissage
| Statut | Signification | Couleur |
|---|---|---|
| `new` | Nouvelle phrase | Bleu |
| `learning` | En cours d'apprentissage | Orange |
| `learned` | Maîtrisée | Vert |
| `review` | À réviser | Violet |

### Progression journalière
- Objectif : 10 phrases par jour
- Affiche une barre de progression avec les 10 dernières phrases ajoutées/modifiées
- Chaque "point" représente une phrase (couleur selon statut)

### Streak
Compte combien de jours consécutifs des phrases ont été ajoutées ou modifiées (basé sur `addedAt`).

### Statistiques affichées
- Total des phrases par langue
- Nombre de phrases "apprises"
- Streak actuel

---

## 16. Module Pomodoro

**Fichier :** `PomodoroModule` dans `app.js`
**Page :** `#page-pomodoro`

### Principe Pomodoro
Technique de gestion du temps : alterner des **sessions de travail** (25 min par défaut) et des **pauses** (5 min).

### Paramètres configurables
- Durée de la session de travail (5–120 min)
- Durée de la pause courte (1–30 min)
- Durée de la pause longue (5–60 min)
- Nombre de sessions avant pause longue (2–8)

### Mode Focus (plein écran)
Cliquer sur "Mode Focus" lance une superposition pleine page avec :
- Grand chronomètre visuel (SVG ring animé)
- Dégradé violet pendant le travail, vert pendant la pause
- Particules flottantes en arrière-plan (animations CSS)
- Messages de motivation aléatoires
- Titre du navigateur mis à jour : `"⏱ 24:45 | Travail — LifeOS"`
- Possibilité de lier la session à une matière ou une tâche

### Liaison avec les modules
Le Pomodoro peut être lié à une **matière d'apprentissage** ou une **tâche** pour contextualiser les sessions dans les statistiques.

---

## 17. Module Statistiques

**Fichier :** `StatsModule` dans `app.js`
**Page :** `#page-stats`

### Périodes disponibles
Onglets : **Semaine** / **Mois** / **Année**

Pour chaque période, le module calcule :
- Tâches créées vs terminées
- Taux de complétion (%)
- Habitudes validées
- Taux d'habitudes moyen

### Graphiques (Chart.js)
- **Barres** : tâches par jour de la période
- **Barres** : habitudes par jour
- **Ligne** : évolution du taux de productivité

### Historique
`renderHistory()` reconstruit l'historique des jours passés en :
1. Lisant le champ `completedAt` de chaque tâche terminée
2. Lisant les `habitLogs` par date
3. Regroupant les données jour par jour (sans stockage supplémentaire)

Affiche les 14 derniers jours avec : score du jour, tâches complétées, habitudes validées.

---

## 18. Module Paramètres

**Fichier :** `SettingsModule` dans `app.js`
**Page :** `#page-settings`

### Options disponibles
- **Nom** et **initiale** (avatar textuel)
- **Thème** : dark / light
- **Couleur primaire** : sélecteur de couleur (appliqué instantanément via CSS custom properties)
- **Heure de début / fin** du calendrier (pour la vue journalière)

### Import / Export
- **Export** : crée un fichier `lifeos-backup-YYYY-MM-DD.json` avec toutes les données (events, tasks, subjects, lessons, habits, habitLogs, goals, notes, journal, transactions, phrases, settings)
- **Import** : lit un fichier JSON et recharge toutes les clés dans localStorage, puis recharge la page

---

## 19. Systèmes transversaux

### Système de célébration (`Celebration`)
Déclenché quand une tâche ou habitude est complétée.

**Petite célébration** (35 confettis, 2.2s) :
```
"Yaaay ! Good work, [Prénom] ! 🎉"
```

**Grande célébration** (90 confettis, 3.8s) quand TOUT est terminé :
```
"Journée parfaite, [Prénom] ! 🏆"
```

**Implémentation :**
- Crée dynamiquement un `<div id="celebOverlay">` dans le `<body>`
- Spawne des `<div class="confetti-pc">` individuels avec `position:fixed`, couleurs, tailles et animations CSS aléatoires
- Animation : `@keyframes confettiFall` fait tomber les confettis de haut en bas avec rotation
- Se nettoie automatiquement après le délai via `setTimeout`

### Système Toast (`Toast`)
Notifications temporaires en bas de l'écran.
- Types : `success` ✅, `error` ❌, `info` ℹ️, `warning` ⚠️
- Durée : 3 secondes par défaut
- Animation d'entrée/sortie CSS (`toast-out`)

### Gestionnaire Modal (`Modal`)
- Un seul backdrop (`#modalBackdrop`) partagé
- `Modal.open(id)` ferme tous les modaux ouverts avant d'en ouvrir un nouveau
- Cliquer sur le backdrop ferme le modal en cours
- Focus automatique sur le premier champ input

### Protection XSS (`Utils.escHtml`)
Toutes les données utilisateur affichées dans le DOM passent par `Utils.escHtml()` qui échappe les caractères dangereux (`&`, `<`, `>`, `"`).

---

## 20. Composants UI réutilisables

### Boutons
```css
.btn           — Bouton de base
.btn-primary   — Fond couleur primaire
.btn-secondary — Contour uniquement
.btn-sm        — Petite taille
.icon-btn      — Bouton icône (carré)
```

### Cartes
```css
.card          — Carte glassmorphisme
.card-3d       — Carte avec effet tilt 3D
```

### Formulaires
```css
.form-group    — Groupe label + input
.form-input    — Input / select / textarea stylisé
.form-row      — Deux champs côte à côte
```

### Barres de progression
```css
.progress-bar  — Conteneur gris
.progress-fill — Remplissage couleur primaire
```

### État vide
```css
.empty-state   — Centré avec icône et texte
.empty-icon    — Emoji géant (3rem)
```

### Badges priorité
```css
.priority-high    — Rouge
.priority-medium  — Orange
.priority-low     — Vert
```

---

## Résumé des données par module

| Module | Données stockées | Clé localStorage |
|---|---|---|
| Calendrier | Événements | `lifeos_events` |
| Tâches | Liste des tâches | `lifeos_tasks` |
| Apprentissage | Matières + Leçons | `lifeos_subjects`, `lifeos_lessons` |
| Habitudes | Habitudes + Logs | `lifeos_habits`, `lifeos_habitLogs` |
| Objectifs | Objectifs | `lifeos_goals` |
| Notes | Notes + Journal | `lifeos_notes`, `lifeos_journal` |
| Finances | Transactions | `lifeos_transactions` |
| Langues | Phrases | `lifeos_phrases` |
| Paramètres | Config utilisateur | `lifeos_settings` |

---

*Documentation générée le 16 mars 2026 — LifeOS v1.0*
