varying vec2 vUv;

uniform sampler2D uTexture;
uniform vec3 uColorBackground;
uniform vec3 uColorShadow;

void main() {
    vec4 shadow = texture2D(uTexture, vUv);

    float intensity = shadow.r;

    vec3 color = mix(uColorShadow.rgb, uColorBackground.rgb, intensity);

    gl_FragColor = vec4(color, 1.);
}