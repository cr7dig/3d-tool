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
camera.position.set(0, 8, 25);

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// Load the 3D model
const loader = new GLTFLoader();
let model;

loader.load('./models/Tshirt_02_N.glb', function (gltf) {
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

// Separate front and back textures
let frontTexture, backTexture;

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

// Initialize the canvas for text
let canvas, context;

function initializeCanvas() {
   // if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    context = canvas.getContext('2d');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
   // }
}

let selectedTextColor = '#000000'; // Default color for the text

// Make the function globally accessible by attaching it to the window object
window.changeTextColor = function(color) {
    selectedTextColor = color;
    console.log("Selected text color: ", selectedTextColor); // Debugging log
}

// Function to add text to the t-shirt model (front or back)
window.addTextToTshirt = function(yOffset) {
    const userText = document.getElementById('userText').value;
    const side = document.getElementById('textSideSelection').value;
    const selectedFont = document.getElementById('fontSelection').value;
    
    if (userText.trim() === "") {
        alert("Please enter text.");
        return;
    }

    initializeCanvas();

    // Style the text
    context.fillStyle = selectedTextColor; // Use the selected color for the text
    context.font = `bold 100px ${selectedFont}`; // Apply selected font
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(userText, canvas.width / 2, canvas.height / yOffset);

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

    if (side === 'front') {
        textTexture.offset.set(0, 0.1); // Move texture to the front
        frontTexture = textTexture;
        applyFrontTexture();
    } else if (side === 'back') {
        textTexture.offset.set(0, 0.1); // Move texture to the back (adjust as needed)
        backTexture = textTexture;
        applyBackTexture();
    }
};

// Function to apply front texture (preserve back texture)
function applyFrontTexture() {
    model.traverse((child) => {
        if (child.isMesh && child.material.name === 'Front') {
            child.material.map = frontTexture;
            child.material.needsUpdate = true;
        }
    });
}

// Function to apply back texture (preserve front texture)
function applyBackTexture() {
    model.traverse((child) => {
        if (child.isMesh && child.material.name === 'Back') {
            child.material.map = backTexture;
            child.material.needsUpdate = true;
        }
    });
}

// Function to apply image to the model (front or back)
window.applyImageToModel = function() {
    const input = document.getElementById('imagePicker');
    const file = input.files[0];
    const side = document.getElementById('sideSelection').value;

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
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            texture.repeat.set(1.6, 1.65);
            texture.offset.set(-0.32, -0.4); // Adjust to move the texture to the front

            if (side === 'front') {
                frontTexture = texture;
                applyFrontTexture();
            } else if (side === 'back') {
                texture.offset.set(-0.3, -0.4); // Adjust for back (this is just an example, adjust values based on UV map) 
                backTexture = texture;
                applyBackTexture();
            }
        };
    };

    reader.readAsDataURL(file);
};

// Array of designs for each category (replace with actual paths or images)
const designs = {
    animals: ['assets/art/mountain1.jpg', 'designs/animal2.png'], //only mountain1.jpg is existing baki sab doesnt exist
    abstract: ['designs/abstract1.png', 'designs/abstract2.png'], //need to add more art designs
    shapes: ['designs/shape1.png', 'designs/shape2.png']
};

// Function to display categories
window.showCategories = function() {
    document.getElementById('artCategories').style.display = 'block';
    document.getElementById('artDesigns').style.display = 'none'; // Hide designs until a category is selected
};

// Function to display designs based on selected category (with image previews)
window.showDesigns = function(category) {
    const designOptions = document.getElementById('designOptions');
    designOptions.innerHTML = ''; // Clear previous designs
    document.getElementById('artDesigns').style.display = 'block';

    // Loop through designs and create clickable images for each design
    designs[category].forEach((design,index) => {                           //index ka significance malum nahi but letting it be there, not affecting anything ig
        const designImg = document.createElement('img');
        designImg.src = design;
        designImg.style.width = '50px'; // Set a small width for preview
        designImg.style.cursor = 'pointer'; // Make it clear that it's clickable
        designImg.style.margin = '10px'; // Add some margin between previews

        designImg.onclick = function() {
            applyDesignToModel(design); // Apply design on click
        };

        designOptions.appendChild(designImg);
    });
};

// Function to apply art design to the t-shirt (front or back)
window.applyDesignToModel = function(designSrc) {
    const img = new Image();
    img.src = designSrc;

    img.onload = function() {
        const texture = new THREE.Texture(img);
        texture.needsUpdate = true;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.repeat.set(1.6, 1.65);
        texture.offset.set(-0.32, -0.4);

        const side = document.getElementById('artSideSelection').value;
        if (side === 'front') {
            frontTexture = texture;
            applyFrontTexture();
        } else if (side === 'back') {
            backTexture = texture;
            applyBackTexture();
        }
    };
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