import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Create scene
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xeeeeee);
document.body.appendChild(renderer.domElement);

// Create camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 30, 30);

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// Load the 3D model
const loader = new GLTFLoader();
let model;

loader.load('./models/tshirt.glb', function (gltf) {
    model = gltf.scene;

    model.traverse((child) => {
        if (child.isMesh) {
            child.visible = true;
        }
    });

    model.scale.set(0.5, 0.5, 0.5);
    model.position.set(0, 0, 0);
    
    scene.add(model);
    console.log('Model loaded successfully');
}, undefined, function (error) {
    console.error('An error occurred while loading the model:', error);
});

// Define the default color
const defaultColor = '#ffffff'; // Set this to your desired default color

// Function to change model color based on button click
window.changeColor = function(color) {
    model.traverse((child) => {
        if (child.isMesh) {
            child.material.color.set(color); // Change mesh color
        }
    });
};

// Function to reset model color to default
window.resetColor = function() {
    changeColor(defaultColor); // Call changeColor with the default color
};



//
//
//
//
//
//
//
//
// Function to add text on the t-shirt model
// window.addTextToTshirt = function(yOffset) {
//     const userText = document.getElementById('userText').value;
//     const side = document.getElementById('textSideSelection').value; // Get the selected side (front or back)

//     if (!userText) return; // Exit if no text is entered

//     // Create a canvas to draw the text
//     const canvas = document.createElement('canvas');
//     canvas.width = 1024;
//     canvas.height = 1024;
//     const context = canvas.getContext('2d');

//     // Fill the canvas with the current model color
//     context.fillStyle = '#ffffff'; // Set the background to transparent if necessary
//     context.fillRect(0, 0, canvas.width, canvas.height);
    

//     // Style the text
//     context.fillStyle = '#000000'; // Black text (you can change this)
//     context.font = 'bold 100px Arial'; // Font and size
//     context.textAlign = 'center';
//     context.textBaseline = 'middle';
//     context.fillText(userText, canvas.width / 2, canvas.height / yOffset); // Draw text in the center

//     // Create a texture from the canvas
//     const textTexture = new THREE.CanvasTexture(canvas);

//      // Ensure the texture repeats across the model for better mapping
//      textTexture.wrapS = THREE.ClampToEdgeWrapping;
//      textTexture.wrapT = THREE.RepeatWrapping;
//      textTexture.repeat.set(1, 1); // Adjust the repetition as necessary
//      textTexture.offset.set(0.5, 0); // Adjust to move the texture to the front
//         //TRYING EDIT
//      // Adjust texture position based on the selected side
//     if (side === 'front') {
//         textTexture.offset.set(0.5, 0); // Move texture to the front
//     } else if (side === 'back') {
//         textTexture.offset.set(-0.5, 0); // Move texture to the back (adjust as needed)
//     }
//     //     //TRYING EDIT

//     // Apply texture to the t-shirt material without affecting the color
//     model.traverse((child) => {
//         if (child.isMesh) {
//             // Combine the text texture with the existing material map
//             child.material.map = textTexture; // Set the new text texture
//             child.material.needsUpdate = true; // Ensure the material is updated
//         }
//     });
// };
//
//
//
//
//
//
//
let canvas, context; // Global canvas and context to maintain between function calls

// Initialize the canvas if not already created
function initializeCanvas() {
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        context = canvas.getContext('2d');
        
        // Fill the canvas with the base color (could be white or transparent)
        context.fillStyle = '#ffffff'; // T-shirt base color
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
}
// Array to keep track of applied textures


window.addTextToTshirt = function(yOffset) {
    const userText = document.getElementById('userText').value;
    const side = document.getElementById('textSideSelection').value;
    const selectedFont = document.getElementById('fontSelection').value;
    

    if (!userText) return;

    initializeCanvas();

  
    // Style the text
    context.fillStyle = '#000000'; // Black text
    context.font = `bold 100px ${selectedFont}`; // Apply selected font
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // Draw text on the selected side (front or back)
    if (side === 'front') {
        context.fillText(userText, canvas.width / 2, canvas.height / yOffset); // Front text
    } else if (side === 'back') {
        context.fillText(userText, canvas.width / 2, canvas.height / yOffset); // Back text
    }

    const textTexture = new THREE.CanvasTexture(canvas);
    textTexture.wrapS = THREE.ClampToEdgeWrapping;
    textTexture.wrapT = THREE.RepeatWrapping;
    textTexture.repeat.set(1, 1); // Original repeat settings
    // Adjust texture position based on the selected side
    if (side === 'front') {
        textTexture.offset.set(0.5, 0); // Move texture to the front
       
    } else if (side === 'back') {
        textTexture.offset.set(-0.5, 0); // Move texture to the back (adjust as needed)
        
    }

    model.traverse((child) => {
        if (child.isMesh) {
            child.material.map = textTexture;
            child.material.needsUpdate = true;
        }
    });
};








//
//
//
//
//
//
//
// JavaScript code for applying image to the model
window.applyImageToModel = function() {
    const input = document.getElementById('imagePicker');
    const file = input.files[0];
    const side = document.getElementById('sideSelection').value; // Get the selected side (front or back)


    if (!file) {
        alert('Please select an image file');
        return;
    }

    const reader = new FileReader();

    reader.onload = function(event) {
        const img = new Image();
        img.src = event.target.result;

        img.onload = function() {
            const texture = new THREE.Texture(img);
            texture.needsUpdate = true;

            // Adjust wrapping and scaling to fit the t-shirt
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.RepeatWrapping;

            // Adjust repeat settings (optional, depending on model UV mapping)
            texture.repeat.set(1.68, 1.5); // Adjust if necessary, try smaller values like (0.5, 0.5)
            texture.offset.set(0.5, 0); // Adjust to move the texture to the front
            //TRYING EDIT
            // Adjust based on the side selected by the user
        if (side === 'front') {
            texture.offset.set(0.5, 0); // Apply to front (assuming the front is mapped here)
        } else if (side === 'back') {
            texture.offset.set(-1.2, 0); // Adjust for back (this is just an example, adjust values based on UV map)
        }
            //TRYING EDIT

            model.traverse((child) => {
                if (child.isMesh) {
                    child.material.map = texture; // Apply the texture
                    child.material.needsUpdate = true; // Ensure the material updates
                }
            });
        };
    };

    reader.readAsDataURL(file);
};


const refreshButton = document.getElementById('refreshButton');

refreshButton.addEventListener('click', () => {
  location.reload();
});

// Variables for rotation
let isMouseDown = false;
let previousMousePosition = { x: 0, y: 0 };

// Mouse event listeners
window.addEventListener('mousedown', (event) => {
    isMouseDown = true;
    previousMousePosition = { x: event.clientX, y: event.clientY };
});

window.addEventListener('mouseup', () => {
    isMouseDown = false;
});

window.addEventListener('mousemove', (event) => {
    if (isMouseDown && model) {
        const deltaMove = {
            x: event.clientX - previousMousePosition.x,
            y: event.clientY - previousMousePosition.y,
        };

        model.rotation.y += deltaMove.x * 0.01; // Rotate model horizontally
        previousMousePosition = { x: event.clientX, y: event.clientY };
    }
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Handle window resizing
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

// Start the rendering loop
animate();