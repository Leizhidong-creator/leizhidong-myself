varying vec2 vUv;
varying vec2 vFrameUv;
varying vec3 vPosition;

uniform sampler2D uTexture;
uniform vec3 uColor;

void main() {
    vec4 textureColor = texture2D(uTexture, vFrameUv);
    gl_FragColor = vec4(textureColor.rgb * uColor, textureColor.a);
}

