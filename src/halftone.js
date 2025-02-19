const halftone = (function () {
  let pg;

  function test() {
    return true;
  }

  function render(image, settings, mode = 'CANVAS') {
    // Creation de la grille de points (pattern) qui contient couleur et effets.
    const pattern = convertImageToPattern(image, settings);
    if (mode === 'CANVAS') {
      const canvas = generateCanvas(pattern);
      return canvas;
    }

    if (mode === 'SVG') {
      const svg = generateSVG(pattern);
      return svg;
    }
  }

  // This function convert an Image to an pattern Array
  function convertImageToPattern(image, settings) {
    // Creation de la gille de position des points pour l'image final en demis ton.
    const grid = createHalftoneGrid(settings);

    // Création du schema à partir des points de la grille
    const scheme = grid.points.map((el) => {
      // Calcul des positions relatives des points sur l'image (en tenant compte de l'échelle)
      // Ici on peut optimiser ce calcule par en travaillant avec des données d'image en format matriciel pré-chargé et évite le calcule avec un map. Globalement ca revient à dire que l'on peut charge les pixels de l'image dans le tableau `pixels` (sois en vecteur soit dans une array) et venir ensuite faire une approximation pour selectionné l'array le plus proche.

      const mappedX = map(el.x, 0, grid.cols * grid.spacingX, 0, image.width - 1, true);
      const mappedY = map(el.y, 0, grid.rows * grid.spacingY, 0, image.height - 1, true);

      // Récupération de la couleur du pixel sur l'image à la position calculée
      const color = image.get(mappedX, mappedY);

      // Construction de l'objet de sortie, incluant les coordonnées, la couleur et la luminosité
      const output = {
        x: el.x + random(0, settings.distortion), // Déformation aléatoire sur l'axe X
        y: el.y + random(0, settings.distortion), // Déformation aléatoire sur l'axe Y
        color: color, // Couleur du pixel
        brightness: brightness(color), // Luminosité de la couleur,
        size: map(brightness(color) * color[3], 0, 25500, 0, 254),
        alpha: color[3], // Opacité de la couleur
        mappedX: mappedX, // Position X sur l'image
        mappedY: mappedY, // Position Y sur l'image
      };

      return output;
    });

    return {
      settings: settings,
      grid: grid,
      scheme: scheme,
    };
  }

  // This fonction create a grid of point
  function createHalftoneGrid(settings) {
    const cols = settings.outputWidth / settings.spacingX;
    const rows = settings.outputHeight / settings.spacingY;

    // Espacement des points sur les axes X et Y
    const spacingX = settings.spacingX;
    const spacingY = settings.spacingY;

    // Array qui contiendra la grille de points
    let points = [];
    let offset = 0;

    for (let row = 0; row < rows + 2; row++) {
      // Décalage de lignes en lignes
      let offset = row * (settings.offset * spacingX);

      // Ajuster le nombre de colonnes pour compenser le décalage
      let extraCols = Math.ceil(offset / spacingX);

      for (let col = -extraCols; col < cols + 2; col++) {
        // Calcul des coordonnées x et y
        let x = col * spacingX + offset;
        let y = row * spacingY;

        // // Add offset
        // x += (row % offset) * (spacingX / offset);

        // Ca fait un super effet circulaire !
        // x -= offset*row

        points.push({ x: x, y: y });
      }
    }

    return {
      cols: cols,
      rows: rows,
      spacingX: spacingX,
      spacingY: spacingY,
      offset: offset,
      points: points,
    };
  }

  // This funtion convert patter Array into an image
  function generateCanvas(pattern) {
    // console.log(pattern)

    const settings = pattern.settings;

    if (settings.outputWidth === undefined || settings.outputHeight === undefined) {
      console.error('settings.imageWidth or settings.imageHeight is undefined');
    }

    if (!pg) {
      console.log('Create PG');
      pg = createGraphics(settings.outputWidth, settings.outputHeight);
    }

    // Supprimer l'ancien buffer s'il existe
    if (pg.width !== settings.outputWidth && pg.height !== settings.outputheight) {
      console.log('Create new PG');
      pg.remove();
      pg = createGraphics(settings.outputWidth, settings.outputHeight);
    }

    pg.clear();

    // Can be clean for sure !
    const convertColor = color(settings.output.backgroundColor);
    const background = color(
      convertColor.levels[0],
      convertColor.levels[1],
      convertColor.levels[2],
      settings.output.backgroundOpacity
    );

    pg.background(background);

    pg.noStroke();
    pg.ellipseMode(CENTER);

    pattern.scheme.map((el) => {
      const size =
        map(el.size, 0, 254, settings.minDot / 100, settings.maxDot / 100) * settings.dotSize;
      if (size <= 0) {
        return;
      }
      if (settings.grayscale) {
        pg.fill(el.brightness, el.alpha);
      } else {
        pg.fill(el.color);
      }

      pg.circle(el.x + size / 2, el.y + size / 2, size, size);
    });
    return pg;
  }

  function generateSVG(pattern) {
    // Création de l'élément SVG
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');

    svg.setAttribute('width', settings.outputWidth);
    svg.setAttribute('height', settings.outputHeight);
    svg.setAttribute('viewBox', `0 0 ${settings.outputWidth} ${settings.outputHeight}`);
    svg.setAttribute('xmlns', svgNS);

    // Génération des cercles en demi-teinte
    pattern.scheme.forEach((el) => {
      const size =
        map(el.size, 0, 254, settings.minDot / 100, settings.maxDot / 100) * settings.dotSize;

      if (size <= 0 || el.alpha === 0) {
        return;
      }

      const circle = document.createElementNS(svgNS, 'circle');
      circle.setAttribute('cx', el.x + size / 2);
      circle.setAttribute('cy', el.y + size / 2);
      circle.setAttribute('r', size / 2);

      if (settings.grayscale) {
        const brightnessValue = `rgb(${el.brightness},${el.brightness},${el.brightness})`;
        circle.setAttribute('fill', brightnessValue);
        circle.setAttribute('fill-opacity', el.alpha / 255);
      } else {
        circle.setAttribute('fill', `rgb(${el.color[0]},${el.color[1]},${el.color[2]})`);
      }

      svg.appendChild(circle);
    });

    return svg;
  }

  return {
    test: test,
    render: render,
    createHalftoneGrid: createHalftoneGrid,
    convertImageToPattern: convertImageToPattern,
    generateCanvas: generateCanvas,
    generateSVG: generateSVG,
  };
})();

// export default halftone
