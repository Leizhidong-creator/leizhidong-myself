varying float vLightY;
varying float vWave;

uniform float uTime;
uniform float uProgress;

void main() {

  vec3 transformed = position;
  //transformed.y *= uProgress;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);

  // Create 2D wave effect using x and z positions
  float waveX = sin(position.x * 10.0 + uTime * 2.0);
  float waveZ = sin(position.z * 10.0 + uTime * 2.5);
  float wave = (waveX + waveZ) * 0.5 * .2;
  vWave = wave * -1.;
  vLightY = position.y * (2. - uProgress) * 0.5 - wave;
}
