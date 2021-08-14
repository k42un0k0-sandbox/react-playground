attribute vec2 indice;
attribute vec3 icon;
attribute float angle;
attribute float rotate;
attribute vec3 fromPosition;
attribute vec3 relayPosition;
attribute float delay;
uniform float time;
uniform float size;

varying vec3 vIcon;
varying mat2 vRotation;

float easeInOutSine(float x) {
return -(cos(acos(-1.) * x) - 1.) / 2.;
}

float interpolateLagrange(float x[3], float y[3], int n, float t)
{
    float s = 0.0;

    for (int i = 0; i < n; i++) {
        float p = y[i];
        for (int j = 0; j < n; j++) {
            if (i != j)
                p *= (t - x[j]) / (x[i] - x[j]);
        }
        s += p;
    }

    return s;
}

void main() {
    float t = easeInOutSine(clamp(time - delay, 0.,1.));
    float[3] tTrail = float[3](0.,0.75,1.);
    float[3] xTrail = float[3](fromPosition.x,relayPosition.x,position.x);
    float[3] yTrail = float[3](fromPosition.y,relayPosition.y,position.y);
    float[3] zTrail = float[3](fromPosition.z,relayPosition.z,position.z);
    float x = interpolateLagrange(tTrail,xTrail,3,t);
    float y = interpolateLagrange(tTrail,yTrail,3,t);
    float z = interpolateLagrange(tTrail,zTrail,3,t);
    vec3 newPosition = vec3(x,y,z);
    vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.);
    vIcon = icon;
    float angleCos = cos( (1. - t) * rotate);
    float angleSin = sin( (1. - t) * rotate);
    vRotation = mat2(angleCos, -angleSin, angleSin, angleCos);
    gl_PointSize = size * (100. / length(mvPosition.xyz));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.);
}