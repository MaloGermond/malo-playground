// Utils lib
//
// Libraries pour les fonctions utile dans mes projets.
//

//
// COULEURS
//

// Permettre la convertion d'un hexadecimal vers une valeurs HSL

export function hexToHsl(hex) {
  if (typeof hex !== 'string') {
    throw new Error('hexToHsl() attend une chaîne de caractères');
  }

  // Vérifie que le format est correct (3 ou 6 caractères hexa, avec ou sans #)
  const match = hex.match(/^#?([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/);
  if (!match) {
    throw new Error(`"${hex}" n'est pas un code hexadécimal valide`);
  }

  // Remove the hash if present
  const color = match[1];

  let r,
    g,
    b,
    a = 1;

  if (color.length === 3) {
    // Ex: 'abc' → 'aabbcc'
    r = parseInt(color[0] + color[0], 16);
    g = parseInt(color[1] + color[1], 16);
    b = parseInt(color[2] + color[2], 16);
    a = 255;
  } else if (color.length === 4) {
    r = parseInt(color[0] + color[0], 16);
    g = parseInt(color[1] + color[1], 16);
    b = parseInt(color[2] + color[2], 16);
    a = parseInt(color[3] + color[3], 16);
  } else if (color.length === 6) {
    r = parseInt(color.slice(0, 2), 16);
    g = parseInt(color.slice(2, 4), 16);
    b = parseInt(color.slice(4, 6), 16);
    a = 255;
  } else if (color.length === 8) {
    r = parseInt(color.slice(0, 2), 16);
    g = parseInt(color.slice(2, 4), 16);
    b = parseInt(color.slice(4, 6), 16);
    a = parseInt(color.slice(6, 8), 16);
  }

  // Normalize RGB values to be in the range [0, 1]
  r /= 255;
  g /= 255;
  b /= 255;
  a /= 255;

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

  return { h, s, l, a };
}

// Permettre la convertion de HSL vers hexadecimal

export function hslToHex(h, s, l, a = 1) {
  if (typeof h !== 'number' || typeof s !== 'number' || typeof l !== 'number') {
    throw new Error('hslToHex attend trois floats (h, s, l) et un alpha optionnel');
  }

  // Clamp et normalise les valeurs
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(1, s));
  l = Math.max(0, Math.min(1, l));
  a = Math.max(0, Math.min(1, a));

  // HSL → RGB
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  // RGB → [0, 255]
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);
  const alpha = Math.round(a * 255);

  // Format hexa
  const hex = (n) => n.toString(16).padStart(2, '0');
  return `#${hex(r)}${hex(g)}${hex(b)}${a < 1 ? hex(alpha) : ''}`;
}

// Retoune la valeurs pour un gradient de deux couleurs en hexadecimal

export function lerpHex(from, to, index) {
  const start = hexToHsl(from);
  const end = hexToHsl(to);

  const h = map(index, 0, 1, start.h, end.h);
  const s = map(index, 0, 1, start.s, end.s);
  const l = map(index, 0, 1, start.l, end.l);
  const a = map(index, 0, 1, start.a, end.a);

  return hslToHex(h, s, l, a);
}

// Retourne un hexadecimal

export function randomHex() {
  // Generate a random number between 0 and 16777215 (decimal equivalent of FFFFFF in hexadecimal)
  const randomColor = Math.floor(Math.random() * 16777216).toString(16);

  // Pad the color with zeros if needed
  return `#${randomColor.padStart(6, '0')}`;
}

//
//  GESTURES
//

export function longPress() {
  // TO DO
}
