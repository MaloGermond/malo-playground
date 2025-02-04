# **Grid.js Documentation**

## **Overview**
`grid.js` is a lightweight JavaScript module for creating and managing a grid system. It allows defining a grid layout with configurable rows, columns, gaps, and margins. The module provides methods to generate, display, and interact with grid cells.

---

## **Installation**
This library is self-contained and does not require installation. Simply include it in your JavaScript project.

``` html
<!DOCTYPE html>
<html lang="en">
<head>
    <!--... -->
    <script src="p5.min.js"></script> <!-- Include p5.js -->
    <script src="grid.js"></script> <!-- Include the grid library -->
</head>
</html>
```

---

## **API Reference**

### **grid.define(options)**
Defines a grid layout with customizable parameters.

#### **Parameters**
| Parameter     | Type   | Default | Description |
|--------------|--------|---------|-------------|
| `options.x` | `number` | `0` | X position of the grid. |
| `options.y` | `number` | `0` | Y position of the grid. |
| `options.width` | `number` | `200` | Width of the grid. |
| `options.height` | `number` | `200` | Height of the grid. |
| `options.marginTop` | `number` | `20` | Top margin. |
| `options.marginLeft` | `number` | `20` | Left margin. |
| `options.marginBottom` | `number` | `20` | Bottom margin. |
| `options.marginRight` | `number` | `20` | Right margin. |
| `options.rowGap` | `number` | `4` | Vertical spacing between rows. |
| `options.columnGap` | `number` | `4` | Horizontal spacing between columns. |
| `options.row` | `number` | `2` | Number of rows (optional if `rowHeight` is provided). |
| `options.rowHeight` | `number` | Auto | Height of each row (overrides `row`). |
| `options.column` | `number` | `2` | Number of columns (optional if `columnWidth` is provided). |
| `options.columnWidth` | `number` | Auto | Width of each column (overrides `column`). |

#### **Returns**
An object containing grid configuration and a list of generated cells.

#### **Example**
```js
const gridConfig = grid.define({
  width: 400,
  height: 400,
  row: 3,
  column: 4,
  rowGap: 10,
  columnGap: 10
});
console.log(gridConfig.cells); // Array of grid cells
```

---

### **grid.display()**
Displays the grid using p5.js functions.

#### **Returns**
The grid configuration.

#### **Example**
```js
function draw() {
  grid.display();
}
```

---

### **grid.displayCells()**
Displays only the grid cells using p5.js.

#### **Example**
```js
grid.displayCells();
```

---

### **grid.getCell(x, y)**
Retrieves the cell at a given `(x, y)` position.

#### **Parameters**
- `x` *(number)* – The x-coordinate to check.
- `y` *(number)* – The y-coordinate to check.

#### **Returns**
An array of cells at the specified position.

#### **Example**
```js
let cell = grid.getCell(100, 100);
console.log(cell);
```

---

### **grid.select(column, row)**
Selects a specific cell based on its column and row index.

#### **Parameters**
- `column` *(number)* – The column index.
- `row` *(number)* – The row index.

#### **Returns**
An array containing the selected cell(s).

#### **Example**
```js
let cell = grid.select(1, 2);
console.log(cell);
```

---

## **Usage Example**
```js
function setup() {
  createCanvas(400, 400);

  // Define a grid with 4 columns and 3 rows
  grid.define({
    width: 400,
    height: 400,
    row: 3,
    column: 4,
    rowGap: 10,
    columnGap: 10
  });
}

function draw() {
  background(240);
  grid.display();
}
```

---

## **Notes**
- This library is dependent on `p5.js` for rendering.
- The `grid` object is self-contained and does not pollute the global scope.

---

This documentation provides all necessary details to define and interact with the grid system. Let me know if you need any modifications or explanations! 🚀