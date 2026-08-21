attribute float scrollIntensity;
attribute float messageIntensity;

varying vec2 vUv;
varying float vScrollIntensity;
varying float vMessageIntensity;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    vUv = uv;
    vScrollIntensity = scrollIntensity;
    vMessageIntensity = messageIntensity;
}