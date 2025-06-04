//
//  GRID LIBRARIES
//
//
//  An easy to manage complex grid.
//

//  TODO
//
// - Dans getCell ajouter la cellule la plus proche quand on est dans la marge ou le gap. Actuellement ca renvois aucun objet.
//  - Dans getNeighbour permettre de connaitre les cellules voisine de la cellule.
//  - Ajouter la possibilité d'avoir des colonnes de taille variable.
//  - Mieux gerer la definiton de la fonction, car là j'ai trop de ligne je ne peux pas facilement rajouter des variables.
//  - Réecrire la function computeSize pour que ce soit moins verbeux
//  - Gerer les cas nfr car aujourd'hui on ne peut prendre qu'une fraction

const grid = (function () {
  let config = {
    x: 0,
    y: 0,
    width: 200,
    height: 200,
    innerWidth: undefined,
    innerHeight: undefined,
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 20,
    marginRight: 20,
    rowGap: 4,
    columnGap: 4,
    rows: ['fr', 'fr'],
    rowsHeight: [],
    columns: ['fr', 'fr', 'fr'],
    columnsWidth: [],
    cells: [],
  };

  let cells = new Array();

  // Define the grid config
  function create(args = {}) {
    config = { ...config, ...args };

    // Dimensions internes sans les marges
    config.innerWidth = config.width - config.marginLeft - config.marginRight;
    config.innerHeight = config.height - config.marginTop - config.marginBottom;

    // Calcul des tailles des colonnes et lignes
    // Combiner la fonction computeSizeRemaining et computeFraction dns computeSizes pour plus d'efficacité car ce sont les mêmes arguments qui sont appeler ce qui fait que c'est redondant
    config.widthRemaining = computeSizeRemaining(
      config.innerWidth,
      config.columns,
      config.columnGap
    );
    config.widthFraction = computeFraction(config.widthRemaining, config.columns);

    config.heightRemaining = computeSizeRemaining(config.innerHeight, config.rows, config.rowGap);
    config.heightFraction = computeFraction(config.heightRemaining, config.rows);

    config.columnsWidth = computeSize(config.columns, config.widthFraction, config.innerWidth);
    config.rowsHeight = computeSize(config.rows, config.heightFraction, config.innerHeight);

    // Génération des cellules
    config.cells = computeCells();

    console.log(config);

    return config;
  }

  // Retourne l'espace restant en largeur.
  function computeSizeRemaining(size, array, gap) {
    const clutter = array.reduce((acc, val) => {
      if (typeof val !== 'number') {
        if (val.includes('%')) {
          const percentage = parseFloat(val) / 100;
          return acc + size * percentage;
        }
        return acc;
      }
      return acc + val;
    }, 0);
    const remainingSize = size - clutter - gap * (array.length - 1);
    return remainingSize;
  }

  // Retourne la valeur d'une fraction de l'espace restant.
  function computeFraction(remain, array) {
    // je prend pas ici en compte le fait que l'on puisse avoir n fr
    // Il faut prendre en compte la marge ici.
    // Pour une valeur fr on retire la marge mais pas pour du int ou % (car valeur fixe) Si que fixe alors on déborde ?
    // le nombre de marge est égale au nombre d'éléments dans la grille -1
    const columnLength = array.filter((val) => val === 'fr').length;

    const frSize = remain / columnLength;

    return frSize;
  }

  // Retourn le tableau de la largeur de chaque columns
  function computeSize(array, fr, innerSize) {
    const sizes = array.map((val) => {
      if (val == 'fr') {
        return fr;
      }

      if (typeof val == 'string') {
        const percentage = parseFloat(val) / 100;
        return innerSize * percentage;
      }
      return val;
    });

    return sizes;
  }

  function computeCells() {
    const cells = new Array();

    let x = 0;
    let y = 0;

    for (let j = 0; j < config.rows.length; j++) {
      x = 0;
      for (let i = 0; i < config.columns.length; i++) {
        cells.push({
          index: i + j * config.columns.length,
          column: i,
          row: j,
          position: {
            x: x + config.marginLeft,
            y: y + config.marginTop,
          },
          width: config.columnsWidth[i],
          height: config.rowsHeight[j],
          isEmpty: true,
        });

        x += config.columnsWidth[i] + config.columnGap;
      }
      y += config.rowsHeight[j] + config.rowGap;
    }
    return cells;
  }

  function display() {
    push();
    noFill();

    stroke('#3FBCE7');
    rect(0, 0, config.width, config.height);

    stroke('#6E9BAC');
    displayCells();

    translate(config.marginLeft, config.marginTop);
    push();

    stroke('#2DC9FF');
    rect(
      0,
      0,
      config.width - config.marginRight - config.marginLeft,
      config.height - config.marginTop - config.marginBottom
    );
    pop();
    pop();
    return config;
  }

  function displayCells() {
    config.cells.map((el) => {
      rect(el.position.x, el.position.y, el.width, el.height);
    });
  }

  function getCell(x, y) {
    const result = config.cells.filter(
      (cell) =>
        x > cell.position.x + config.x &&
        x < cell.position.x + config.columnWidth + config.x &&
        y > cell.position.y + config.y &&
        y < cell.position.y + config.rowHeight + config.y
    );
    return result;
  }

  function select(column, row) {
    const result = config.cells.filter((el) => el.column == column && el.row == row);
    return result;
  }

  return {
    display: display,
    displayCells: displayCells,
    getCell: getCell,
    create: create,
    select: select,
  };
})();
