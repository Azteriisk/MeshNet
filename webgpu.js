/**
 * Initializes WebGPU and sets up the basic rendering context
 * Learn more about WebGPU: https://developer.chrome.com/docs/web-platform/webgpu/
 * @returns {Promise<{device: GPUDevice, context: GPUCanvasContext, canvas: HTMLCanvasElement, format: string}>}
 */
export async function initWebGPU() {
    // Check if WebGPU is supported in the current browser
    if (!navigator.gpu) {
        console.error("WebGPU is not supported. Please use a compatible browser.");
        return;
    }

    // Get the GPU adapter (physical device)
    // This represents the actual GPU hardware
    const adapter = await navigator.gpu.requestAdapter();
    
    // Get the GPU device from the adapter
    // This is our logical connection to the GPU
    const device = await adapter.requestDevice();

    // Get the canvas element and its WebGPU context
    const canvas = document.getElementById('gpuCanvas');
    const context = canvas.getContext('webgpu');

    // Configure the swap chain format
    // 'bgra8unorm' is a common format: 8 bits each for blue, green, red, and alpha
    const format = 'bgra8unorm';
    context.configure({
        device: device,
        format: format,
        alphaMode: 'premultiplied', // How alpha blending should work
    });

    // Set up initial canvas size and add resize handler
    resizeCanvas(canvas);
    window.addEventListener('resize', () => resizeCanvas(canvas));

    return { device, context, canvas, format };
}

/**
 * Resizes the canvas to match the window size
 * This ensures the canvas always fills the entire window
 * @param {HTMLCanvasElement} canvas - The canvas element to resize
 */
function resizeCanvas(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}