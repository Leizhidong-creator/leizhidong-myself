#include <skinning_pars_vertex>
#include ../includes/avatar-progress/vertex.glsl;

varying vec3 vNormal;
varying vec3 vWorldPos;
varying vec3 vPosition;

uniform float uTime;
uniform float uProgress;

float random2D(vec2 value) {
    return fract(sin(dot(value.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
    #include <skinbase_vertex>
    #include <begin_vertex>
    #include <skinning_vertex>

    #include <project_vertex>

    vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);

    // Normal skinning
    vec4 skinnedNormal = vec4(0.0);
    skinnedNormal += boneMatX * vec4(normal, 0.0) * skinWeight.x;
    skinnedNormal += boneMatY * vec4(normal, 0.0) * skinWeight.y;
    skinnedNormal += boneMatZ * vec4(normal, 0.0) * skinWeight.z;
    skinnedNormal += boneMatW * vec4(normal, 0.0) * skinWeight.w;
    vNormal = skinnedNormal.xyz;

    vWorldPos = worldPosition.xyz;
    vPosition = transformed;

    vModelProgress = getModelProgress(transformed);
}