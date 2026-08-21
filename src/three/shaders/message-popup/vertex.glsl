varying vec2 vUv;
varying float vAlpha;

uniform float uProgress;

#define TOTAL_COLS 4.
#define TOTAL_ROWS 4.
#define FRAME_X 0.
#define FRAME_Y 0.
#define SCALE 0.5

void main() {
    mat4 spriteViewMatrix = modelViewMatrix;

    spriteViewMatrix[0][0] = 1.0 * SCALE;
    spriteViewMatrix[0][1] = 0.0;
    spriteViewMatrix[0][2] = 0.0;

    spriteViewMatrix[1][0] = 0.0;
    spriteViewMatrix[1][1] = 1.0 * SCALE;
    spriteViewMatrix[1][2] = 0.0;

    vec3 transformed = position;

    transformed.y += .75 * uProgress;
    transformed.z += .75 * uProgress;

    gl_Position = projectionMatrix * spriteViewMatrix * vec4(transformed, 1.0);

    // Frame UVs
    vUv = uv;
    vUv.x = (uv.x + FRAME_X) / TOTAL_COLS;
    vUv.y = (uv.y + (TOTAL_ROWS - 1.0 - FRAME_Y)) / TOTAL_ROWS;

    // Alpha fade in/out
    float fadeIn = smoothstep(0.0, 0.25, uProgress);   
    float fadeOut = smoothstep(1.0, 0.99, uProgress);  
    vAlpha = fadeIn * fadeOut;
}