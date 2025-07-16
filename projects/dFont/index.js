import { animate } from 'https://cdn.skypack.dev/popmotion';

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
 * Puis on **retire des formes** (contreformes) pour créer la silhouette.
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

const lettern = createLetterRules({ x: 100, y: 100, width: 300, height: 600 });

window.setup = function () {
  createCanvas(config.width, config.height);
};

window.draw = function () {
  background('#F3F9F7'); // Ajout d'un fond pour éviter les traînées

  lettern.drawGuides();
};

function createLetterRules({
  x = 0,
  y = 0,
  width = 200,
  height = 300,
  name = 'A',
  ...rest // Pour permettre d’ajouter d’autres props si besoin
} = {}) {
  const props = {
    x,
    y,
    width,
    height,
    name,
    ...rest,
  };

  const config = computeRules(props);
  console.log({ config });

  function computeRules(props) {
    const rules = {
      x: props.x,
      y: props.y,
      unitWidth: props.unitWidth ?? props.width,
      ascender: props.ascender ?? props.height,
    };

    return rules;
  }

  function drawGuides({ ctx = null } = {}) {
    const g = ctx || window;
    const { x, y, ascender, unitWidth } = config;
    const c = {
      primary: '#FF49D4',
    };

    g.push();
    g.noFill();
    g.stroke(c.primary);
    g.strokeWeight(1);

    // Exemple : dessiner un simple rectangle pour symboliser la lettre
    g.rect(x, y + ascender, unitWidth, -ascender);

    g.pop();
  }

  return {
    ...props,
    drawGuides,
  };
}

function letterN({ x, y, unitWidth, xHeight, ascender, weight } = {}) {
  push();
  fill('#000');
  noStroke();
  rect(x, y, unitWidth, -xHeight);
  pop();
}

function letterAVersion1({ x, y, unitWidth, ascender, weight, barHeight, xHeight, contrast }) {
  config.letter.unitWidth = mouseX - x >= 0 ? mouseX - x : 0;
  config.letter.ascender = height - mouseY;
  push();
  translate(x, config.height - y);
  noStroke();
  fill('#000');
  rect(0, 0, unitWidth, -ascender, 0, 0, unitWidth, unitWidth);

  fill('#fff');
  rect(weight, 0, unitWidth - 2 * weight, -ascender + weight, 0, 0, unitWidth, unitWidth);

  fill('#000');
  rect(0, -((xHeight * ascender) / 100), unitWidth, weight / contrast);
  pop();
}
