precision highp float;

uniform vec4 myColor;

void main() {
vec4 defaultColor = vec4(1.0, 0.0, 0.0, 1.0);
gl_FragColor = (myColor != vec4(0.0)) ? myColor : defaultColor;
}