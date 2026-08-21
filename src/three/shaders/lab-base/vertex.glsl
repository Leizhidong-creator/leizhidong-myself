varying vec2 vUv;
varying vec3 vPosition;

uniform float uProgress;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    
    vPosition = position;
    vUv = uv;
}