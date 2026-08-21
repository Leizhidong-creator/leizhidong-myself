#include <skinning_pars_vertex>
#include ../includes/avatar-progress/vertex.glsl;

varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
    #include <skinbase_vertex>
    #include <begin_vertex>
    #include <skinning_vertex>

    #include <project_vertex>

    vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);

    vec4 skinnedNormal = vec4(0.0);
    skinnedNormal += boneMatX * vec4(normal, 0.0) * skinWeight.x;
    skinnedNormal += boneMatY * vec4(normal, 0.0) * skinWeight.y;
    skinnedNormal += boneMatZ * vec4(normal, 0.0) * skinWeight.z;
    skinnedNormal += boneMatW * vec4(normal, 0.0) * skinWeight.w;

    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = viewPosition.xyz;
    vNormal = skinnedNormal.xyz;

    vModelProgress = getModelProgress(transformed);
}