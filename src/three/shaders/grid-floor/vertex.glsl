varying vec2 vUv;
varying vec3 vNormal;

uniform float uTime;
uniform float uProgress;

// tweakable constants
#define CURVE 0.04
#define CURVE_MIN 0.04

void main() {
  vUv = uv;
  vec3 pos = position;

  // calculate x weight based on distance to uv.x center
  float uvXCenter = 0.5;
  float distToUXCenter = abs(uv.x - uvXCenter);
  float xWeight = distToUXCenter * 2.0; // normalize to 0-1 range, then scale as needed
  
  // weighted distance: X varies based on distance to uv.x center
  float dist = sqrt(pos.x * pos.x * xWeight + pos.z * pos.z);
  float curve = pow(dist, 2.0);

  // make curve 0 at bottom center (uv.x = 0.5, uv.y = 0)
  vec2 bottomCenter = vec2(0.5, 0.0);
  float distToBottomCenter = distance(uv, bottomCenter);
  float bottomCenterMask = distToBottomCenter;
  curve *= bottomCenterMask;

  // apply curve
  pos.y += (curve * CURVE_MIN) + (curve * CURVE * uProgress);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

  vNormal = normal;
}