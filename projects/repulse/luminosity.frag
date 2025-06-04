precision mediump float;

varying vec2 vTexCoord;  // Coordonnées de texture
uniform sampler2D tex;   // L'image à modifier
uniform float brightness; // Facteur de luminosité (1.0 = normal)

void main() {
    vec4 color = texture2D(tex, vTexCoord);
    color.rgb *= brightness;  // Applique le facteur de luminosité
    gl_FragColor = color;
}
