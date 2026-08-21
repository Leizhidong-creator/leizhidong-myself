varying vec2 vUv;
varying vec2 vRectUv;

uniform sampler2D uTexture;
uniform vec3 uVignetteColor;
uniform vec2 uRectSize;
uniform float uRadius;

// Rounded rectangle SDF
float roundedRect(vec2 p, vec2 size, float radius) {
    vec2 d = abs(p) - size + vec2(radius);
    float outsideDist = length(max(d, 0.0));
    float insideDist = min(max(d.x, d.y), 0.0);
    return outsideDist + insideDist - radius;
}

void main() {
    vec4 color = texture2D(uTexture, vUv);

    // Vignette
    float distToCenter = distance(vUv, vec2(0.5));
    distToCenter = smoothstep(0.3, 0.8, distToCenter * 0.8);
    color.rgb = mix(color.rgb, uVignetteColor, distToCenter);

    // Compute SDF and alpha
    float dist = roundedRect(vRectUv, uRectSize, uRadius);
    float alpha = 1.0 - smoothstep(-0.002, 0.0, -dist);

    gl_FragColor = vec4(color.rgb, alpha);
}