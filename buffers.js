/**
 * Creates and manages the vertex buffer for our triangle
 * Learn more about WebGPU buffers: https://gpuweb.github.io/gpuweb/#buffers
 * @param {GPUDevice} device - The GPU device
 * @param {HTMLCanvasElement} canvas - The canvas element for dimension calculations
 * @returns {Object} Object containing the vertex buffer
 */
export function createBuffers(device, canvas) {
    // Create a buffer to store our triangle vertices
    // Size is 6 floats (2 coordinates * 3 vertices) * 4 bytes per float
    const vertexBuffer = device.createBuffer({
        size: Float32Array.BYTES_PER_ELEMENT * 6, // 3 vertices * 2 components (x,y)
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST, // Buffer will be used as vertex data and can be updated
    });

    // Function to update vertex data when window is resized
    function updateVertexData() {
        const vertexData = getVertexData(canvas.width, canvas.height);
        device.queue.writeBuffer(vertexBuffer, 0, vertexData);
    }

    // Initial vertex data update
    updateVertexData();
    // Update vertices when window is resized
    window.addEventListener('resize', updateVertexData);

    return { vertexBuffer };
}

/**
 * Calculates the vertex positions for our triangle
 * Converts pixel coordinates to clip space (-1 to +1 range)
 * @param {number} width - Canvas width in pixels
 * @param {number} height - Canvas height in pixels
 * @returns {Float32Array} Array of vertex coordinates in clip space
 */
function getVertexData(width, height) {
    // Define triangle size in pixels
    const triangleHeight = 200; // pixels
    const triangleWidth = 200; // pixels

    // Convert to clip space coordinates (-1 to 1)
    const halfHeight = triangleHeight / 2;
    const halfWidth = triangleWidth / 2;

    // Calculate Y coordinates centered around the middle of the screen
    // Divide by height/width * 2 to convert from pixels to clip space
    const topY = halfHeight / height * 2;      // Top point Y coordinate
    const bottomY = -halfHeight / height * 2;   // Bottom points Y coordinate
    
    // Calculate X coordinates centered around the middle of the screen
    const leftX = -halfWidth / width * 2;      // Left point X coordinate
    const rightX = halfWidth / width * 2;      // Right point X coordinate

    // Return triangle vertices as a Float32Array
    // Format: [x1,y1, x2,y2, x3,y3]
    return new Float32Array([
        0.0, topY,      // Top vertex (centered horizontally)
        leftX, bottomY, // Bottom left vertex
        rightX, bottomY // Bottom right vertex
    ]);
}