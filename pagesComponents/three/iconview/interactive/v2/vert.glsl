// attribute vec2 indice;
// attribute vec3 icon;
// uniform float size;

// varying vec3 vIcon;

// void main() {
//     vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
//     vIcon = icon;
//     gl_PointSize = size * (100.0 / length(mvPosition.xyz));
//     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
// }

attribute vec2 indice;
attribute vec3 icon;
attribute vec3 angle;
uniform float size;
uniform sampler2D touch;

varying vec3 vIcon;

void main() {
    vec4 color = texture2D(touch, indice);
    float force = length(color.xyz)*100.;
    float z = force;
    float x = force;
    float y = force;
    vec3 newPosition = position + vec3(x,y,z);
    vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.);
    vIcon = icon;
    gl_PointSize = size * (100. / length(mvPosition.xyz));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.);
}