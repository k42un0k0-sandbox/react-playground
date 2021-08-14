uniform sampler2D tex;

varying vec3 vIcon;
varying mat2 vRotation;

void main() {
    float offset = 0.5;
    gl_FragColor = texture2D(tex, (((gl_PointCoord - offset) * vRotation + offset) * vIcon.z) + vIcon.xy );
}