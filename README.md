📘 **README.md — Playground JS de Malo**

---

# 🎛️ Malo Playground

Bienvenue dans mon **espace de jeu personnel**. À l’origine, ce projet était une librairie dédiée au **motion design en JavaScript**. Aujourd’hui, c’est devenu un **playground local modulaire** où je développe librement :

- 🎨 des **expérimentations graphiques et visuelles**
- 🧰 des **petits outils pour le design**
- 🧪 des **projets interactifs ou performatifs**
- 🧩 des **librairies maison** que je découpe et versionne

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
├── lib/                  # Librairies internes versionnées
├── projects/             # Un dossier par projet autonome
├── scripts/              # Scripts utilitaires (convertisseurs, helpers, etc.)
├── shared-components/    # (optionnel) éléments réutilisables (UI, logique)
├── tools/                # Fichiers de config ou scripts de build
├── README.md
├── package.json
└── yarn.lock
```

Chaque projet est **autonome** (HTML, JS, CSS) et peut utiliser les libs internes via des imports locaux ou `npm link`.

---

## ⚙️ Installation

```bash
git clone https://github.com/ton-user/ton-repo.git
cd ton-repo
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

## 🧠 Philosophie

> _J’expérimente en m’amusant, je découpe en petites briques, je construis pour moi, mais peut-être pour les autres demain._

Ce repo n’a pas pour but d’être propre, complet ou finalisé. Il est pensé pour être **manipulé, transformé, cassé et reconstruit**.

---

## ✨ À venir

- Une structure plus formelle pour publier certaines libs
- Une interface visuelle pour naviguer dans les projets

---

## 📄 Licence

Projet personnel. Pas encore de licence définie. Tout est ouvert à discussion.

---

Tu veux que je t’aide à rédiger la section pour un onboarding rapide (création d’un nouveau projet, comment utiliser une lib interne, etc.) ?
