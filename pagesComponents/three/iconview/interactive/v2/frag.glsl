uniform sampler2D tex;
varying vec3 vIcon;
void main() {
    gl_FragColor = texture2D(tex, (gl_PointCoord* vIcon.z) + vIcon.xy );
}