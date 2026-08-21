uniform float uAmbientStrength;

#define AMBIENT_COLOR vec3(0.,0.016,0.063)

vec3 applyAmbient(vec3 color) {
    return color + AMBIENT_COLOR * uAmbientStrength;
}