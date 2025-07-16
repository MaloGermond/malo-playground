export function fontRule({
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

    const descentFactor = 0.2;
    // Ici je calcule la ligne de base par rapport à la hauteur des descendantes.
    const baseLine = props.height - props.height * descentFactor;

    // La descendantes est la taille la plus basse du corps, mais je laisse la possibilité d'avoir des descendantes qui sorte du charactère.
    const descent = props.descent ? props.height + props.descent : props.height;

    const ascenderFactor = 0.3;
    // L'ascendantes et forcement la valeurs haute de l'espace disponible. Mais je laisse la possibilité de la faire sortir du cadre en fonction des besoins.
    const ascender = props.ascender ? props.ascender : 0;

    // Je choisis que la hauteur d'x n'est pas réglable. La hauteur prend la place qu'il reste après les descendantes et les ascendantes.
    const xHeight = bodyHeight * ascenderFactor;

    const centerX = unitWidth / 2;
    const centerY = bodyHeight / 2;

    const anchor = {
      top: { x: centerX, y: 0 },
      right: { x: unitWidth, y: centerY },
      bottom: { x: centerX, y: bodyHeight },
      left: { x: 0, y: centerY },
    };

    // Taille du fut
    const stemFactor = props.stemFactor ?? 0.1;
    const stem = props.stem ?? unitWidth * stemFactor;

    const contrast = props.contrast ?? 0.8;
    const stemContrast = stem * contrast;

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
      stem: stem,
      stemContrast: stemContrast,
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

  function drawChar() {}

  return {
    ...props,
    drawGuides,
  };
}

export function radicals() {
  function rect() {}

  return {
    stem,
  };
}
