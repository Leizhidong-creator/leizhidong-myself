varying vec3 vColor;
varying float vAlpha;

void main() {
  // Circular particle shape
  vec2 center = gl_PointCoord - vec2(0.5);
  float dist = length(center);
  
  if (dist > 0.5) {
    discard;
  }
  
  // Soft edge
  float alpha = (1.0 - smoothstep(0.0, 0.5, dist)) * vAlpha;
  
  gl_FragColor = vec4(vColor, alpha);
}

