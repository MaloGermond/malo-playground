// Il faut un autre nom de rule car c'est trop generique
// Architecture, Structure, Config, Properties ...
// Il faut que ca qualifie les guides et info sur la font

export function fontRule({
  x = 0,
  y = 0,
  width = 200,
  height = 300,
  name = 'New Fontface',
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

  const properties = computeRules(props);
  const typeface = [];
  console.log({ properties });

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
      TOP: { x: centerX, y: 0 },
      RIGHT: { x: unitWidth, y: centerY },
      BOTTOM: { x: centerX, y: bodyHeight },
      LEFT: { x: 0, y: centerY },
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
    const { x, y, unitWidth, bodyHeight, baseLine, ascender, xHeight, anchor } = properties;

    g.push();
    g.noFill();
    g.strokeWeight(1);

    translate(x, y);

    // Affiche ce qui est secondaire (à l'arrière plan)
    g.stroke(c.light);

    // Position de l'axe vertical median
    g.line(anchor.TOP.x, anchor.TOP.y, anchor.BOTTOM.x, anchor.BOTTOM.y);
    // Position de l'axe horizontal median
    g.line(anchor.LEFT.x, anchor.LEFT.y, anchor.RIGHT.x, anchor.RIGHT.y);

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

  //
  //
  //

  function addType({ cat, label, radicals = [] } = {}) {
    typeface.push({
      label: label,
      cat: cat,
      radicals: radicals,
    });
    console.log(typeface);
  }

  function drawChar(label, cat) {
    const { x, y, unitWidth, bodyHeight, anchor } = properties;
    const char = typeface.filter((el) => el.cat === cat).filter((el) => el.label === label)[0];
    const forms = char.radicals;

    push();
    fill('#000');
    rect(x, y, unitWidth, bodyHeight);
    fill('#fff');
    noStroke();
    translate(x, y);

    forms.map((el) => {
      const position = anchor[el.position];
      const shape = el.shape;
      const width = el.width({ ...properties });
      const height = el.height({ ...properties });
      const pinned = el.pinned;
      radicals({ position, pinned, shape, width, height });
    });
    pop();
  }

  return {
    ...props,
    addType,
    drawGuides,
    drawChar,
  };
}

// Cette fonction permet le calcule de la lettre avec la soustraction de l'ensemble des radicals.
// Il faut trouver un autre nom que rule car c'est trop generique.
export function character({ rule, config }) {}

//  Cette fonction permet de retourné le PATH pour UN radical.

export function radicals({
  position = { x, y },
  shape = 'RECT',
  width = 100,
  height = 100,
  pinned = { x: 'CENTER', y: 'TOP' },
} = {}) {
  const props = {
    position,
    pinned,
    shape,
    width,
    height,
  };

  push();
  positionShape();

  if (shape === 'RECT') {
    rad_rect();
  }
  pop();

  function positionShape() {
    const { pinned, width, height } = props;
    switch (pinned.x) {
      case 'LEFT':
        break;
      case 'CENTER':
        translate(-width / 2, 0);
        break;
      case 'RIGHT':
        translate(-width, 0);
        break;
    }
    switch (pinned.y) {
      case 'TOP':
        break;
      case 'CENTER':
        translate(0, -height / 2);
        break;
      case 'BOTTOM':
        translate(0, -height);
        break;
    }
  }

  function rad_rect() {
    const { position, width, height } = props;
    rect(position.x, position.y, width, height);
  }

  return {
    rad_rect,
  };
}
