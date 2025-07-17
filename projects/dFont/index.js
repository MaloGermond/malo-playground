import { animate } from 'https://cdn.skypack.dev/popmotion';
import { fontRule } from './foundry.js';

/**
 * LETTER MODULE — EXPLICATION
 *
 * Ce module permet de générer dynamiquement des lettres typographiques
 * en fonction de contraintes spatiales (x, y, largeur, hauteur).
 * Il est pensé pour du **titrage expressif**, pas pour du texte de lecture.
 *
 * --- Étape 1 : Génération des propriétés ---
 * On utilise une fonction factory qui retourne toutes les valeurs nécessaires
 * pour dessiner la lettre (points, dimensions, poids, etc.).
 *
 * À partir de :
 *   - une position (x, y)
 *   - une largeur disponible (unitWidth)
 *   - une hauteur (ascender, xHeight)
 *
 * → on calcule toutes les valeurs nécessaires à la construction.
 * Chaque valeur peut être **surchargée** pour affiner le résultat.
 *
 * --- Étape 2 : Dessin par le vide (soustraction) ---
 * On commence par dessiner un bloc plein représentant la lettre.
 * Puis on **retire des formes** (contreformes/radicals) pour créer la silhouette.
 * Cette approche permet un contrôle précis et adaptable.
 *
 * --- Enjeu principal ---
 * Créer une forme lisible et expressive dans tous les cas de figure :
 *   - très large, très étroit
 *   - très haut, très bas
 *
 * L’idée n’est pas de produire une fonte classique, mais un système de formes
 * typographiques **réactives et adaptées à leur contexte d’affichage**.
 */

const config = {
  width: 800,
  height: 800,
};

const typeface = {
  uppercase: {
    h: [
      {
        position: 'TOP',
        direction: 'DOWN',
        reference: 'TOP',
        shape: 'RECT',
        width: ({ unitWidth, stem }) => unitWidth - 2 * stem,
        height: ({ centerY, stem }) => centerY - stem / 2,
      },
      {
        position: 'BOTTOM',
        direction: 'UP',
        reference: 'BOTTOM',
        shape: 'RECT',
        width: ({ unitWidth, stem }) => unitWidth - 2 * stem,
        height: ({ centerY, stem }) => centerY - stem / 2,
      },
    ],
  },
};

let letters = fontRule({ x: 100, y: 100, width: 300, height: 600 });

window.setup = function () {
  createCanvas(config.width, config.height);
  letters.addType({
    cat: 'uppercase',
    label: 'h',
    radicals: [
      {
        position: 'TOP',
        pinned: { x: 'CENTER', y: 'TOP' },
        shape: 'RECT',
        width: ({ unitWidth, stem }) => unitWidth - 2 * stem,
        height: ({ centerY, stem }) => centerY - stem / 2,
      },
      {
        position: 'BOTTOM',
        pinned: { x: 'CENTER', y: 'BOTTOM' },
        shape: 'RECT',
        width: ({ unitWidth, stem }) => unitWidth - 2 * stem,
        height: ({ centerY, stem }) => centerY - stem / 2,
      },
    ],
  });
};

window.draw = function () {
  background('#F3F9F7'); // Ajout d'un fond pour éviter les traînées

  if (mouseIsPressed) {
    letters = fontRule({ x: 100, y: 100, width: mouseX, height: mouseY, contrast: 0.1 });
    letters.addType({
      cat: 'uppercase',
      label: 'h',
      radicals: [
        {
          position: 'TOP',
          pinned: { x: 'CENTER', y: 'TOP' },
          shape: 'RECT',
          width: ({ unitWidth, stem }) => unitWidth - 2 * stem,
          height: ({ centerY, stemContrast }) => centerY - stemContrast / 2,
        },
        {
          position: 'BOTTOM',
          pinned: { x: 'CENTER', y: 'BOTTOM' },
          shape: 'RECT',
          width: ({ unitWidth, stem }) => unitWidth - 2 * stem,
          height: ({ centerY, stemContrast }) => centerY - stemContrast / 2,
        },
      ],
    });
  }
  letters.drawChar('h', 'uppercase');
  letters.drawGuides();
};
