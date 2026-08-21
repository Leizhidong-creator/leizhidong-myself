#include ../includes/avatar-progress/fragment.glsl;
#include ../includes/about-ambient.glsl;

uniform sampler2D uMatcap;

varying vec3 vViewNormal;
varying vec3 vViewPosition;
varying vec3 vNormal;

void main() {
    vec3 viewDir = normalize(vViewPosition);

    vec3 x = normalize(vec3(viewDir.z, 0.0, -viewDir.x));
    vec3 y = cross(viewDir, x);
    vec2 uv = vec2(dot(x, vNormal), dot(y, vNormal)) * 0.495 + 0.5;

    vec3 matcapColor = texture2D(uMatcap, uv).rgb;

    float progress = getProgress();

    matcapColor = applyAmbient(matcapColor);

    gl_FragColor = vec4(matcapColor, progress);
}