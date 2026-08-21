varying vec2 vUv;
varying float vAlpha;

uniform sampler2D uTexture;
uniform float uOpacity;

void main() {
    vec4 textureColor = texture2D(uTexture, vUv);
    float alpha = vAlpha * textureColor.a * uOpacity;

    gl_FragColor = vec4(textureColor.rgb, alpha);
}

