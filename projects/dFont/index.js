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

let letters = fontRules({ x: 100, y: 100, width: 300, height: 600 });

window.setup = function () {
  createCanvas(config.width, config.height);
};

window.draw = function () {
  background('#F3F9F7'); // Ajout d'un fond pour éviter les traînées

  if (mouseIsPressed) {
    letters = fontRules({ x: 100, y: 100, width: mouseX, height: mouseY });
  }
  letters.drawGuides();
};

function fontRules({
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

  const c = {
    primary: '#FF49D4',
    light: '#FBB2EA',
  };

  const config = computeRules(props);
  console.log({ config });

  function computeRules(props) {
    // Ne pas oublier que l'origine est en haut à gauche. On dessine tout à "l'envert"

    // Réglage de la largeur.
    // Cela correspond à la chasse de la lettre
    const unitWidth = props.unitWidth ?? props.width;

    // Réglage des hauteurs
    // Taille du caractère.
    const bodyHeight = props.height;

    const descentFactor = 0.3;
    // Ici je calcule la ligne de base par rapport à la hauteur des descendantes.
    const baseLine = props.height - props.height * descentFactor;

    // La descendantes est la taille la plus basse du corps, mais je laisse la possibilité d'avoir des descendantes qui sorte du charactère.
    const descent = props.descent ? props.height + props.descent : props.height;

    // L'ascendantes et forcement la valeurs haute de l'espace disponible. Mais je laisse la possibilité de la faire sortir du cadre en fonction des besoins.
    const ascender = props.ascender ? props.ascender : 0;

    // Je choisis que la hauteur d'x n'est pas réglable. La hauteur prend la place qu'il reste après les descendantes et les ascendantes.
    const xHeight = bodyHeight - ascender - baseLine;

    const centerX = unitWidth / 2;
    const centerY = bodyHeight / 2;

    const anchor = {
      top: { x: centerX, y: 0 },
      right: { x: unitWidth, y: centerY },
      bottom: { x: centerX, y: bodyHeight },
      left: { x: 0, y: centerY },
    };

    const rules = {
      x: props.x,
      y: props.y,
      unitWidth: unitWidth,
      bodyHeight: bodyHeight,
      baseLine: baseLine,
      ascender: ascender,
      descent: descent,
      xHeight: xHeight,
      centerX: centerX,
      centerY: centerY,
      anchor: anchor,
    };

    return rules;
  }

  function drawGuides({ ctx = null } = {}) {
    const g = ctx || window;
    const { x, y, unitWidth, bodyHeight, baseLine, ascender, xHeight, anchor } = config;

    g.push();
    g.noFill();
    g.strokeWeight(1);

    translate(x, y);

    // Affiche ce qui est secondaire (à l'arrière plan)
    g.stroke(c.light);

    // Position de l'axe vertical median
    g.line(anchor.top.x, anchor.top.y, anchor.bottom.x, anchor.bottom.y);
    // Position de l'axe horizontal median
    g.line(anchor.left.x, anchor.left.y, anchor.right.x, anchor.right.y);

    // Affiche ce qui est principal (au premier plan)
    g.stroke(c.primary);

    // Gabarit de la charactère
    g.rect(0, 0 + bodyHeight, unitWidth, -bodyHeight);

    // Position de la baseLine
    g.push();
    displayLabel(ctx, 'baseLine', baseLine);
    g.strokeWeight(2);
    g.line(0, baseLine, unitWidth, baseLine);
    g.pop();

    // Position de la hauteur d'x du carractère
    displayLabel(ctx, 'xHeight', xHeight);
    g.line(0, xHeight, unitWidth, xHeight);

    g.pop();
  }

  function displayLabel(ctx, str, y, x = 0) {
    const g = ctx || window;
    push();
    g.textSize(12);
    g.noStroke();
    g.fill(c.primary);
    g.text(str, 4, y - 4);
    pop();
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
