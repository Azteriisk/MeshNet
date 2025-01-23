/**
 * Creates and returns shader modules for vertex and fragment shaders
 * Learn more about WGSL (WebGPU Shading Language): https://www.w3.org/TR/WGSL/
 * @param {GPUDevice} device - The GPU device
 * @returns {Object} Object containing shader modules and entry points
 */
export function createShaders(device) {
    // Vertex shader: Processes each vertex of our geometry
    // This shader simply passes through the vertex positions
    // @vertex indicates this is a vertex shader
    // @location(0) specifies the attribute location in the vertex buffer
    // @builtin(position) indicates this is the final vertex position
    const vertexShader = `
        @vertex
        fn main(@location(0) position : vec4<f32>) -> @builtin(position) vec4<f32> {
            return position;
        }
    `;

    // Fragment shader: Determines the color of each pixel
    // This shader outputs a solid green color for every pixel
    // @fragment indicates this is a fragment shader
    // @location(0) specifies the color output location
    const fragmentShader = `
        @fragment
        fn main() -> @location(0) vec4<f32> {
            return vec4<f32>(0.0, 1.0, 0.0, 1.0); // Green color (R=0, G=1, B=0, A=1)
        }
    `;

    // Create shader modules from our WGSL code
    return {
        vertexModule: device.createShaderModule({ code: vertexShader }),
        fragmentModule: device.createShaderModule({ code: fragmentShader }),
        vertexEntryPoint: 'main',
        fragmentEntryPoint: 'main'
    };
}