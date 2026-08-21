varying float vLightY;
varying float vWave;

uniform float uProgress;

#define COLOR vec3(0.1,0.808,1.)

void main() {
  // Reduce opacity where wave is positive (y going down)
  float waveOpacity = 1.0 - smoothstep(0.0, 0.25, vWave);
  gl_FragColor = vec4(COLOR, (1. - vLightY) * 0.3 * waveOpacity * uProgress);
}
