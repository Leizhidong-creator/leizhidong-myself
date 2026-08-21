varying vec2 vUv;
uniform float uTime;
uniform float uOpacity;

#define LINE_WIDTH 0.05
#define WAVE_COUNT 50.0
#define PI 3.14159265359
#define MIN_LINE_STRENGTH 0.1
#define LINE_STRENGTH_SPEED 6.0

#define COLOR vec3(0.3, 1., 1.)

void main() {
    // Three horizontal lines at different y positions
    float baseStrength1 = smoothstep(LINE_WIDTH, 0.0, abs(vUv.y - 0.25));
    float baseStrength2 = smoothstep(LINE_WIDTH, 0.0, abs(vUv.y - 0.5));
    float baseStrength3 = smoothstep(LINE_WIDTH, 0.0, abs(vUv.y - 0.75));
    
    // Strength animation patterns with phase offsets for independent flickering
    float strengthPattern1 = sin(vUv.x * WAVE_COUNT * 0.5 + uTime * LINE_STRENGTH_SPEED) * 0.5 + 0.5;
    float strengthPattern2 = sin(vUv.x * WAVE_COUNT * 0.5 + uTime * LINE_STRENGTH_SPEED + PI * 0.33) * 0.5 + 0.5;
    float strengthPattern3 = sin(vUv.x * WAVE_COUNT * 0.5 + uTime * LINE_STRENGTH_SPEED + PI * 0.66) * 0.5 + 0.5;
    
    strengthPattern1 = smoothstep(0.0, 0.5, strengthPattern1);
    strengthPattern2 = smoothstep(0.0, 0.5, strengthPattern2);
    strengthPattern3 = smoothstep(0.0, 0.5, strengthPattern3);
    
    // Map patterns to range between MIN_LINE_STRENGTH and 1.0
    // The MIN_LINE_STRENGTH is always visible, only the animated part above it is affected by uOpacity
    float animatedPart1 = (1.0 - MIN_LINE_STRENGTH) * strengthPattern1;
    float animatedPart2 = (1.0 - MIN_LINE_STRENGTH) * strengthPattern2;
    float animatedPart3 = (1.0 - MIN_LINE_STRENGTH) * strengthPattern3;
    
    // Combine: MIN_LINE_STRENGTH (always visible) + animated part (affected by uOpacity)
    float multiplier1 = MIN_LINE_STRENGTH + animatedPart1 * uOpacity;
    float multiplier2 = MIN_LINE_STRENGTH + animatedPart2 * uOpacity;
    float multiplier3 = MIN_LINE_STRENGTH + animatedPart3 * uOpacity;
    
    // Apply animated strength to each line and combine
    float strength = baseStrength1 * multiplier1 + baseStrength2 * multiplier2 + baseStrength3 * multiplier3;
    
    gl_FragColor = vec4(COLOR, strength);
}