varying vec2 vUv;
varying float vAlpha;

uniform sampler2D uTexture;

void main() {
    vec4 color = texture2D(uTexture, vUv);

    gl_FragColor = vec4(color.rgb, vAlpha * color.a);
}