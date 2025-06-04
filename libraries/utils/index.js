// Utils lib
//
// Libraries pour les fonctions utile dans mes projets.
//

//
// COULEURS
//

// Permettre la convertion d'un hexadecimal vers une valeurs HSL

export function hexToHsl(string) {
  // Remove the hash if present
  const hex = string.replace(/^#/, '');

  // Parse the hex color to RGB
  let bigint = parseInt(hex, 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;

  // Normalize RGB values to be in the range [0, 1]
  r /= 255;
  g /= 255;
  b /= 255;

  // Find the minimum and maximum values to determine the lightness
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);

  // Calculate the lightness
  let l = (max + min) / 2;

  // Calculate the saturation
  let s = 0;
  if (max !== min) {
    s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
  }

  // Calculate the hue
  let h = 0;
  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / (max - min) + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / (max - min) + 2;
        break;
      case b:
        h = (r - g) / (max - min) + 4;
        break;
    }
    h /= 6;
  }

  // Convert hue to degrees
  h *= 360;

  return { h, s, l };
}
