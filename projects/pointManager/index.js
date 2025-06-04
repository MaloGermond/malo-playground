// Objet de configuration (vide pour le moment, peut contenir des paramètres plus tard)
let settings = {};

// Tableau stockant les points de la courbe
let curve = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background('#F3F9F7'); // Ajout d'un fond pour éviter les traînées

  // Dessine la ligne reliant les points de la courbe
  drawLine(curve);

  // Affiche le point le plus proche de la souris si la courbe contient au moins 2 points
  if (curve.length > 1) {
    displayNearestPoint(curve, createVector(mouseX, mouseY));
    // displayPoint(curve[curve.length - 1]); // Optionnel : Afficher le dernier point ajouté
  }
}

/**
 * Trouve le point le plus proche d'une position donnée dans un ensemble de points
 * @param {Array} shape - Tableau de points (vecteurs p5.js)
 * @param {p5.Vector} position - Position cible
 * @returns {p5.Vector} - Point le plus proche
 */
function getNearestPoint(shape, position) {
  let nearestPoint = null;
  let minDist = Infinity;

  for (let pt of shape) {
    let d = dist(position.x, position.y, pt.x, pt.y);
    if (d < minDist) {
      minDist = d;
      nearestPoint = pt;
    }
  }

  return nearestPoint;
}

/**
 * Affiche un point sous forme de cercle
 * @param {p5.Vector} point - Point à afficher
 */
function displayPoint(point) {
  noStroke();
  fill('#eee');
  ellipse(point.x, point.y, 12, 12);
}

/**
 * Affiche le point le plus proche d'une position donnée
 * @param {Array} shape - Tableau de points
 * @param {p5.Vector} position - Position cible
 */
function displayNearestPoint(shape, position) {
  let nearest = getNearestPoint(shape, position);
  if (nearest) {
    displayPoint(nearest);
  }
}

/**
 * Ajoute un nouveau point à la courbe lorsque la souris est pressée
 */
function mousePressed() {
  curve.push(addPoint(mouseX, mouseY));
}

/**
 * Crée un point et retourne un vecteur correspondant
 * @param {number} x - Coordonnée X
 * @param {number} y - Coordonnée Y
 * @returns {p5.Vector} - Vecteur représentant le point
 */
function addPoint(x, y) {
  console.log('Add point:', { x }, { y });
  return createVector(x, y);
}

/**
 * Dessine une ligne reliant les points d'un tableau
 * @param {Array} points - Tableau de points
 */
function drawLine(points) {
  if (points.length <= 1) {
    return;
  }

  noFill();
  stroke('#000');
  strokeWeight(16);

  for (let p = 0; p < points.length - 1; p++) {
    line(points[p].x, points[p].y, points[p + 1].x, points[p + 1].y);
  }
}
