uniform sampler2D uTexture;
uniform float uScrollDepth;
uniform float uMessageIntensity;

varying vec2 vUv;
varying float vScrollIntensity;
varying float vMessageIntensity;

void main() {
    vec2 scrollUv = vec2(vUv.x, vUv.y + uScrollDepth * vScrollIntensity);
    vec4 color = texture2D(uTexture, scrollUv);

    vec2 messageUv = vec2(vUv.x, vUv.y + 0.5);
    vec4 messageColor = texture2D(uTexture, messageUv);

    color = mix(color, messageColor, vMessageIntensity * messageColor.a * uMessageIntensity);

    gl_FragColor = vec4(color.rgb, 1.0);
}