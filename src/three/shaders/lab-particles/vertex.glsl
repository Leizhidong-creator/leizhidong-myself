attribute float offset;
attribute float angle;
attribute float radius;
attribute float speed;
attribute vec2 drift;
attribute vec3 noiseOffset;
attribute float size;

varying vec3 vColor;
varying float vAlpha;

uniform float uTime;
uniform float uScaleMultiplier;

#define BOTTOM_RADIUS .4
#define TOP_RADIUS 2.0
#define CONE_HEIGHT 5.0
#define SPEED 0.1

// Simple noise function for organic movement
float noise(float x) {
  return sin(x) * 0.5 + sin(x * 2.3) * 0.3 + sin(x * 4.7) * 0.2;
}

void main() {
  // Calculate progress based on time and offset with individual speed variation (0.0 to 1.0)
  float t = mod((uTime * SPEED * speed + offset), 4.0) / 4.0;
  
  // Calculate vertical position with organic variation
  float yNoise = noise(uTime * 0.5 + noiseOffset.y) * 0.1;
  float y = t * CONE_HEIGHT + yNoise;
  
  // Calculate radius at current height (linear interpolation)
  float currentRadius = mix(BOTTOM_RADIUS, TOP_RADIUS, t);
  
  // Add organic radius variation
  float radiusNoise = noise(uTime * 0.3 + noiseOffset.y * 0.5) * 0.08;
  currentRadius += radiusNoise;
  
  // Calculate current radial distance based on initial radius proportion
  float currentDist = (radius / BOTTOM_RADIUS) * currentRadius;
  
  // Add organic angular variation (swirling motion)
  float angleVariation = noise(uTime * 0.4 + noiseOffset.x) * 0.25;
  float organicAngle = angle + angleVariation;
  
  // Add horizontal organic movement using noise
  float xNoise = noise(uTime * 0.6 + noiseOffset.x) * 0.2;
  float zNoise = noise(uTime * 0.7 + noiseOffset.z) * 0.2;
  
  // Calculate position in cone shape with organic movement
  vec3 pos;
  pos.x = cos(organicAngle) * currentDist + drift.x * t + xNoise;
  pos.y = y;
  pos.z = sin(organicAngle) * currentDist + drift.y * t + zNoise;
  
  float baseSize = 0.2;
  float particleSize = baseSize * size;
  
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = particleSize * uScaleMultiplier * (300.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
  
  // Calculate alpha based on progress for fade in/out using smoothstep
  // Fade in: 0.0 to 0.1
  // Full opacity: 0.1 to 0.9
  // Fade out: 0.9 to 1.0
  float fadeIn = smoothstep(0.0, 0.1, t);
  float fadeOut = 1.0 - smoothstep(0.9, 1.0, t);
  float alpha = fadeIn * fadeOut;
  
  vColor = color;
  vAlpha = alpha * 0.3;
}

