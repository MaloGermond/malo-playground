precision highp float;

uniform sampler2D uTexture;
uniform vec2 uTextureSize;
uniform vec2 uQuadSize;
uniform float uTime;
uniform float uScrollVelocity;  // -1..1
uniform float uVelocityStrength; // 0..1

varying vec2 vUv;
varying vec2 vUvCover;

void main() {
  vec2 texCoords = vUvCover;

  // Distorsion basée sur le temps et la vitesse
  float amt = 0.03 * uVelocityStrength;
  float t = uTime * 0.8;
  texCoords.y += sin((texCoords.x * 8.0) + t) * amt;
  texCoords.x += cos((texCoords.y * 6.0) - t * 0.8) * amt * 0.6;

  // Effet de décalage RGB basé sur la direction du scroll
  float dir = sign(uScrollVelocity);
  vec2 tc = texCoords;
  float r = texture2D(uTexture, tc + vec2( amt * 0.50 * dir, 0.0)).r;
  float g = texture2D(uTexture, tc + vec2( amt * 0.25 * dir, 0.0)).g;
  float b = texture2D(uTexture, tc + vec2(-amt * 0.35 * dir, 0.0)).b;

  gl_FragColor = vec4(r, g, b, 1.0);
}
