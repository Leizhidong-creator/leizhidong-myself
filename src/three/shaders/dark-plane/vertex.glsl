uniform vec2 uRectCenter;
uniform float uAspectRatio;
uniform float uAngle;

varying vec2 vUv;
varying vec2 vRectUv;

vec2 rotate(vec2 p, float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return vec2(c * p.x - s * p.y, s * p.x + c * p.y);
}

void main()
{
    gl_Position = vec4(position.x, position.y, position.z, 1.0);

    vRectUv = uv - uRectCenter;
    vRectUv.x *= uAspectRatio;
    vRectUv = rotate(vRectUv, uAngle);

    vUv = uv;
}