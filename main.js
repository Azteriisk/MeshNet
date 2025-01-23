/**
 * Main entry point for the WebGPU application
 * Orchestrates the setup of WebGPU components and the render loop
 */
import { initWebGPU } from './webgpu.js';
import { createShaders } from './shaders.js';
import { createBuffers } from './buffers.js';

async function start() {
    // Initialize WebGPU and get required objects
    const { device, context, canvas, format } = await initWebGPU();
    const shaders = createShaders(device);
    const { vertexBuffer } = createBuffers(device, canvas);

    // Create a pipeline layout (though we're not using any bindings yet)
    const pipelineLayout = device.createPipelineLayout({
        bindGroupLayouts: [] // No bind groups needed for this simple example
    });

    // Create the render pipeline
    // This defines how vertices will be processed and pixels will be colored
    const pipeline = device.createRenderPipeline({
        layout: pipelineLayout,
        vertex: {
            module: shaders.vertexModule,
            entryPoint: shaders.vertexEntryPoint,
            buffers: [{
                arrayStride: 4 * 2, // Size of each vertex: 2 floats * 4 bytes
                attributes: [{
                    format: 'float32x2', // Each attribute is 2 32-bit floats
                    offset: 0,           // Start at beginning of vertex
                    shaderLocation: 0,   // Location in shader
                }],
            }],
        },
        fragment: {
            module: shaders.fragmentModule,
            entryPoint: shaders.fragmentEntryPoint,
            targets: [{ format }], // Color attachment format
        },
        primitive: {
            topology: 'triangle-list', // Treat each 3 vertices as a triangle
        },
    });

    /**
     * Main render function that draws a frame
     * This is called repeatedly to render the scene
     */
    function render() {
        // Create command encoder for this frame
        const commandEncoder = device.createCommandEncoder();
        const textureView = context.getCurrentTexture().createView();
    
        // Describe the render pass
        const renderPassDescriptor = {
            colorAttachments: [{
                view: textureView,
                clearValue: [0, 0, 0, 1], // Clear to black
                loadOp: 'clear',          // Clear the view before rendering
                storeOp: 'store',         // Store the results
            }],
        };
    
        // Create render pass and encode commands
        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.setPipeline(pipeline);
        passEncoder.setVertexBuffer(0, vertexBuffer);
        passEncoder.draw(3, 1, 0, 0); // Draw 3 vertices
        passEncoder.end();
    
        // Submit the command buffer to the GPU queue
        device.queue.submit([commandEncoder.finish()]);
        
        // Request the next frame
        requestAnimationFrame(render);
    }

    // Start the render loop
    render();
}

// Initialize the application
start();