attribute float aIndex;

varying vec2 vUv;
varying float vAlpha;

uniform sampler2D uTexture;
uniform float uTime;

#define TOTAL_COLS 4.
#define TOTAL_ROWS 4.
#define FRAME_X 1.
#define FRAME_Y 0.
#define SCALE 0.35
#define PI 3.14159

vec2 rotate2D(vec2 pos, float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return vec2(c * pos.x - s * pos.y, s * pos.x + c * pos.y);
}

void main() {
    mat4 spriteViewMatrix = modelViewMatrix;

    float progress = fract(uTime * 0.2 + aIndex);

    float scale = SCALE * (1.0 - progress * 0.4);

    spriteViewMatrix[0][0] = 1.0 * scale;
    spriteViewMatrix[0][1] = 0.0;
    spriteViewMatrix[0][2] = 0.0;

    spriteViewMatrix[1][0] = 0.0;
    spriteViewMatrix[1][1] = 1.0 * scale;
    spriteViewMatrix[1][2] = 0.0;

    vec3 transformed = position;

    vec2 pos = position.xy;
    pos = rotate2D(pos, progress * PI * 0.4);
    transformed.xy = pos;

    transformed.x += progress * 3.5;
    transformed.y += progress * 4.5;

    gl_Position = projectionMatrix * spriteViewMatrix * vec4(transformed, 1.0);

    // Frame UVs
    vUv = uv;
    vUv.x = (uv.x + FRAME_X) / TOTAL_COLS;
    vUv.y = (uv.y + (TOTAL_ROWS - 1.0 - FRAME_Y)) / TOTAL_ROWS;

    // Alpha fade in/out
    float fadeIn = smoothstep(0.0, 0.3, progress);   
    float fadeOut = smoothstep(1.0, 0.7, progress);  
    vAlpha = fadeIn * fadeOut;
}