attribute vec3 color;
uniform float time;
uniform float size;

varying vec4 vMvPosition;
varying vec3 vColor;
varying vec2 vUv;

void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vMvPosition = mvPosition;
    vColor = color;
    vUv = uv;
    gl_PointSize = (32. + (sin(radians(time * 2.0)) * 10.0 - 10.0)) * (100.0 / length(mvPosition.xyz));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}