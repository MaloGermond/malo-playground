precision mediump float;

attribute vec3 aPosition; // Position des sommets
attribute vec2 aTexCoord; // Coordonnées de texture

varying vec2 vTexCoord; // Coordonnées envoyées au fragment shader

void main() {
    vTexCoord = aTexCoord; // Transmet les coordonnées de texture au fragment shader
    gl_Position = vec4(aPosition, 1.0); // Positionne l'objet
}
