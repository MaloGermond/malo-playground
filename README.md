📘 **README.md — Playground JS de Malo**

---

# 🎛️ Malo Playground

Bienvenue dans mon **espace de jeu personnel**. À l’origine, ce projet était une librairie dédiée au **motion design en JavaScript**. Aujourd’hui, c’est devenu un **playground local modulaire** où je développe librement :

- 🎨 des **expérimentations graphiques et visuelles**
- 🧰 des **petits outils pour le design**
- 🧪 des **projets interactifs ou performatifs**
- 🧩 des **librairies maison** que je découpe et versionne

---

## 🧠 Philosophie

> _J’expérimente en m’amusant, je découpe en petites briques, je construis pour moi, mais peut-être pour les autres demain._

Ce repo n’a pas pour but d’être propre, complet ou finalisé. Il est pensé pour être **manipulé, transformé, cassé et reconstruit**.

---

## 🚀 Objectif

Créer un environnement simple et flexible pour :

- développer vite
- tester des idées en local
- réutiliser facilement du code
- rester curieux et créatif

---

## 📁 Organisation

```bash
/
├── bs-config.json         # Configuration pour light-server (répertoire à servir, routes, etc.)
├── components/            # Composants réutilisables (UI, logique, visuels)
├── index.html             # Fichier HTML racine (utilisé pour afficher la liste des projets)
├── libraries/             # Librairies internes (utils maison, animations, etc.)
├── package.json           # Déclaration des scripts, dépendances et configuration du projet
├── projects/              # Dossier contenant tous les projets individuels ou expérimentations
├── README.md              # Documentation du projet (présentation, installation, usage)
├── scripts/               # Scripts utilitaires (ex : convertisseurs, helpers, automation)
└── style.css              # Feuille de style par défaut ou globale

```

Chaque projet n'est pas entièrement **autonome** pour l'instant car les libraries évolue et je ne maintient pas de versions.

---

## ⚙️ Installation

```bash
git@github.com:MaloGermond/malo-playground.git
cd malo-playground
npm install
```

---

## 🔍 Lancement rapide

Je me sers de **[light-server](https://www.npmjs.com/package/light-server)** pour servir les projets localement :

```bash
npm start
```

> Par défaut, le serveur pointe vers un projet dans `/projects/`. Tu peux modifier `tools/bs-config.json` pour changer la cible.

---

Voici la version mise à jour du **README.md**, avec les ajouts demandés 👇

---

## ⚙️ Installation

```bash
git clone https://github.com/ton-user/ton-repo.git
cd ton-repo
yarn install
```

---

## 🔍 Lancement rapide

Je me sers de **[light-server](https://www.npmjs.com/package/light-server)** pour servir les projets localement :

```bash
npm start
```

> Par défaut, le serveur pointe vers un projet dans `/projects/`. Tu peux modifier `tools/bs-config.json` pour changer la cible.

---

## 🛠️ Créer un nouveau projet

Pour créer un nouveau projet avec la structure de base :

```bash
npm run new nom-du-projet
```

Un dossier sera créé dans `projects/` avec les fichiers nécessaires pour démarrer rapidement.

---

## ✨ À venir

- Une structure plus formelle pour publier certaines libs
- Une interface visuelle pour naviguer dans les projets

---

## 📄 Licence

Projet personnel. Pas encore de licence définie. Tout est ouvert à discussion.

---

Tu veux que je t’aide à rédiger la section pour un onboarding rapide (création d’un nouveau projet, comment utiliser une lib interne, etc.) ?
