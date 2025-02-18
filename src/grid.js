const grid = (function () {
  let config = {};

  let cells = new Array();

  // Define the grid config
  function define(options) {
    options == undefined ? (options = '') : null;

    const x = options.x == undefined ? 0 : options.x;
    const y = options.y == undefined ? 0 : options.y;

    const width = options.width == undefined ? 200 : options.width;
    const height = options.height == undefined ? 200 : options.height;

    const marginTop = options.marginTop == undefined ? 20 : options.marginTop;
    const marginLeft = options.marginLeft == undefined ? 20 : options.marginLeft;
    const marginBottom = options.marginBottom == undefined ? 20 : options.marginBottom;
    const marginRight = options.marginRight == undefined ? 20 : options.marginRight;

    const innerWidth = width - marginLeft - marginRight;
    const innerHeight = height - marginTop - marginBottom;

    const rowGap = options.rowGap == undefined ? 4 : options.rowGap;
    const columnGap = options.columnGap == undefined ? 4 : options.columnGap;

    let row;
    let rowHeight;

    if (options.row == undefined && options.rowHeight == undefined) {
      row = 2;
      rowHeight = (innerHeight - (row - 1) * rowGap) / row;
    }
    if (options.row != undefined) {
      row = options.row;
      rowHeight = (innerHeight - (row - 1) * rowGap) / row;
    }
    if (options.rowHeight != undefined) {
      rowHeight = options.rowHeight;
      row = (innerHeight + rowGap) / (rowHeight + rowGap);
    }

    let column;
    let columnWidth;

    if (options.column == undefined && options.columnWidth == undefined) {
      column = 2;
      columnWidth = (innerWidth - (column - 1) * columnGap) / column;
    }
    if (options.column != undefined) {
      column = options.column;
      columnWidth = (innerWidth - (column - 1) * columnGap) / column;
    }
    if (options.columnWidth != undefined) {
      columnWidth = options.columnWidth;
      column = (innerHeight + columnGap) / (columnWidth + columnGap);
    }

    const cells = new Array();
    for (let j = 0; j < row; j++) {
      for (let i = 0; i < column; i++) {
        cells.push({
          index: i + j * column,
          column: i,
          row: j,
          position: {
            x: i * (columnWidth + columnGap) + marginLeft,
            y: j * (rowHeight + rowGap) + marginTop,
          },
          width: columnWidth,
          height: rowHeight,
          empty: true,
        });
      }
    }
    //console.log(cells)

    const output = {
      x: x,
      y: y,
      width: width,
      height: height,
      row: row,
      column: column,
      marginTop: marginTop,
      marginLeft: marginLeft,
      marginBottom: marginBottom,
      marginRight: marginRight,
      rowGap: rowGap,
      rowHeight: rowHeight,
      columnGap: columnGap,
      columnWidth: columnWidth,
      cells: cells,
    };

    config = output;
    return output;
  }

  function display() {
    noFill();
    stroke(0);
    rect(0, 0, config.width, config.height);

    stroke(180);
    displayCells();

    translate(config.marginLeft, config.marginTop);
    push();
    stroke(200);
    rect(
      0,
      0,
      config.width - config.marginRight - config.marginLeft,
      config.height - config.marginTop - config.marginBottom
    );
    pop();
    return config;
  }

  function displayCells() {
    config.cells.map((cell) =>
      rect(cell.position.x, cell.position.y, config.columnWidth, config.rowHeight)
    );
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
    define: define,
    select: select,
  };
})();
