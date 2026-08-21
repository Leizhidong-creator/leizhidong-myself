varying float vModelProgress;

uniform float uProgress;

#define SMOOTH_WIDTH 0.002

float getProgress() {
    float s = smoothstep(uProgress, uProgress + SMOOTH_WIDTH, vModelProgress);
    // If uProgress == 0.0, return 1.0, otherwise use s
    return mix(s, 1.0, step(uProgress, 0.0));
}