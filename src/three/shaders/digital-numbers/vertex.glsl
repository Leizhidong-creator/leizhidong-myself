attribute float frame;

varying vec2 vUv;
varying vec2 vFrameUv;
varying vec3 vPosition;

#define TOTAL_COLS 4.0
#define TOTAL_ROWS 3.0
#define UV_PADDING 0.01

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
    
    vPosition = position;
    vUv = uv;
    
    // Calculate frame UV coordinates
    float column = mod(frame, TOTAL_COLS);
    float row = floor(frame / TOTAL_COLS);
    
    // Flip Y if texture starts from top-left (common in texture atlases)
    row = (TOTAL_ROWS - 1.0) - row;
    
    // Calculate frame bounds
    float frameWidth = 1.0 / TOTAL_COLS;
    float frameHeight = 1.0 / TOTAL_ROWS;
    float frameLeft = column * frameWidth;
    float frameBottom = row * frameHeight;
    
    // Apply padding to UV coordinates within the frame
    vec2 paddedUv = uv * (1.0 - UV_PADDING * 2.0) + UV_PADDING;
    
    // Map padded UV to frame coordinates
    vFrameUv.x = frameLeft + paddedUv.x * frameWidth;
    vFrameUv.y = frameBottom + paddedUv.y * frameHeight;
}

