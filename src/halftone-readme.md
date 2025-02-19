# Halftone.js

Halftone.js est une bibliothèque JavaScript permettant de générer des images en demi-teinte (halftone) à partir d'une image source. Elle prend en charge les rendus en mode **Canvas** et **SVG**.

## Installation

Halftone.js peut être utilisé directement en tant que module JavaScript. Vous pouvez l'importer dans votre projet comme suit :

```javascript
import halftone from './halftone.js';
```

## Utilisation

### Exemple de base

```javascript
const image = loadImage('example.jpg');
const settings = {
  outputWidth: 800,
  outputHeight: 600,
  spacingX: 10,
  spacingY: 10,
  dotSize: 5,
  minDot: 10,
  maxDot: 50,
  distortion: 2,
  grayscale: true,
  output: { backgroundColor: '#FFFFFF', backgroundOpacity: 1 },
};

const canvas = halftone.render(image, settings, 'CANVAS');
document.body.appendChild(canvas);
```

## API

### `halftone.render(image, settings, mode)`

Transforme une image en une grille de demi-teinte.

- `image` : L'image source.
- `settings` : Objet de configuration des paramètres d'affichage.
- `mode` : `'CANVAS'` ou `'SVG'` (défaut : `'CANVAS'`).
- **Retourne** : Un élément `<canvas>` ou `<svg>` contenant l'image en demi-teinte.

### `halftone.createHalftoneGrid(settings)`

Crée une grille de points en fonction des paramètres fournis.

- `settings` : Objet contenant les paramètres de configuration.
- **Retourne** : Un objet représentant la grille.

### `halftone.convertImageToPattern(image, settings)`

Convertit une image en un tableau de motifs pour le rendu en demi-teinte.

- `image` : L'image source.
- `settings` : Paramètres de l'image.
- **Retourne** : Un objet contenant la grille et le schéma de conversion.

### `halftone.generateCanvas(pattern)`

Génère une version **Canvas** de l'image en demi-teinte.

- `pattern` : Objet contenant la grille et les paramètres d'affichage.
- **Retourne** : Un élément `<canvas>`.

### `halftone.generateSVG(pattern)`

Génère une version **SVG** de l'image en demi-teinte.

- `pattern` : Objet contenant la grille et les paramètres d'affichage.
- **Retourne** : Un élément `<svg>`.

## Paramètres de `settings`

| Paramètre                  | Type    | Description                             |
| -------------------------- | ------- | --------------------------------------- |
| `outputWidth`              | Number  | Largeur de l'image de sortie.           |
| `outputHeight`             | Number  | Hauteur de l'image de sortie.           |
| `spacingX`                 | Number  | Espacement des points en X.             |
| `spacingY`                 | Number  | Espacement des points en Y.             |
| `dotSize`                  | Number  | Taille des points.                      |
| `minDot`                   | Number  | Taille minimale des points.             |
| `maxDot`                   | Number  | Taille maximale des points.             |
| `distortion`               | Number  | Facteur de distorsion des points.       |
| `grayscale`                | Boolean | Active/Désactive le mode noir et blanc. |
| `output.backgroundColor`   | String  | Couleur de fond.                        |
| `output.backgroundOpacity` | Number  | Opacité du fond (0-1).                  |

## Notes

- La bibliothèque utilise des **fonctions aléatoires** pour certaines distorsions, ce qui signifie que chaque rendu peut être légèrement différent.
- Optimisation possible en précalculant les couleurs des pixels pour éviter un traitement en boucle coûteux.

## Licence

MIT

---

N'hésitez pas à contribuer ou à signaler des bugs via GitHub !
