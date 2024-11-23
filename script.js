const canvas = document.getElementById("cricketGround");
const ctx = canvas.getContext("2d");

// Scaling factor for resizing the ground
let scaleFactor = 1.2; // Adjust this value to scale the ground size

// Adjust canvas dimensions based on scaling
canvas.width = 800 * scaleFactor;
canvas.height = 800 * scaleFactor;

// Scaled cricket field dimensions
const FIELD_RADIUS = 400 * scaleFactor;
const CIRCLE_RADIUS = 200 * scaleFactor;
const PITCH_WIDTH = 50 * scaleFactor;
const PITCH_HEIGHT = 160 * scaleFactor;

// Fielding positions for both ends
const fieldingPositions = [
    // { label: "Fine Leg", angleStart: 200, angleEnd: 240 }, // Leg side, backward
    // { label: "Backward Square Leg", angleStart: 240, angleEnd: 270 }, // Leg side
    // { label: "Square Leg", angleStart: 270, angleEnd: 300 }, // Leg side, square
    // { label: "Mid-Wicket", angleStart: 300, angleEnd: 330 }, // Leg side, close in
    // { label: "Mid-On", angleStart: 330, angleEnd: 360 }, // Leg side, in front
    // { label: "Mid-Off", angleStart: 0, angleEnd: 30 }, // Off side, in front
    // { label: "Extra Cover", angleStart: 30, angleEnd: 60 }, // Off side
    // { label: "Cover", angleStart: 60, angleEnd: 90 }, // Off side, close
    // { label: "Point", angleStart: 90, angleEnd: 120 }, // Off side, square
    // { label: "Backward Point", angleStart: 120, angleEnd: 150 }, // Off side, backward
    // { label: "Third Man", angleStart: 150, angleEnd: 200 }, // Off side, deep backward
    // { label: "Deep Fine Leg", angleStart: 200, angleEnd: 240 }, // Leg side, deep backward
    // { label: "Deep Square Leg", angleStart: 240, angleEnd: 270 }, // Leg side, deep square
    // { label: "Deep Mid-Wicket", angleStart: 300, angleEnd: 330 }, // Leg side, deep mid
    // { label: "Deep Mid-On", angleStart: 330, angleEnd: 360 }, // Leg side, deep in front
    // { label: "Deep Mid-Off", angleStart: 0, angleEnd: 30 }, // Off side, deep in front
    // { label: "Deep Extra Cover", angleStart: 30, angleEnd: 60 }, // Off side, deep close
    // { label: "Deep Cover", angleStart: 60, angleEnd: 90 }, // Off side, deep square
    // { label: "Deep Backward Point", angleStart: 120, angleEnd: 150 }, // Off side, deep backward
];



// Fielding positions and labels
const fielders = [
    { x: 400 * scaleFactor, y: 520 * scaleFactor, label: "Bowler", movable: false },
    { x: 400 * scaleFactor, y: 300 * scaleFactor, label: "Wicket-Keeper", movable: false },
    { x: 400 * scaleFactor, y: 240 * scaleFactor, label: "", movable: true },
    { x: 600 * scaleFactor, y: 400 * scaleFactor, label: "", movable: true },
    { x: 400 * scaleFactor, y: 600 * scaleFactor, label: "", movable: true },
    { x: 200 * scaleFactor, y: 400 * scaleFactor, label: "", movable: true },
    { x: 500 * scaleFactor, y: 330 * scaleFactor, label: "", movable: true },
    { x: 300 * scaleFactor, y: 500 * scaleFactor, label: "", movable: true },
    { x: 600 * scaleFactor, y: 600 * scaleFactor, label: "", movable: true },
    { x: 200 * scaleFactor, y: 600 * scaleFactor, label: "", movable: true },
    { x: 600 * scaleFactor, y: 240 * scaleFactor, label: "", movable: true },
];

let selectedFielder = null;

// Draw the cricket ground and pitch
function drawGround() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grass field
    ctx.fillStyle = "#2ecc71";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Outer boundary
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, FIELD_RADIUS, 0, Math.PI * 2);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();

    // 30-yard circle
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, CIRCLE_RADIUS, 0, Math.PI * 2);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Pitch
    ctx.fillStyle = "#e67e22";
    ctx.fillRect(
        canvas.width / 2 - PITCH_WIDTH / 2,
        canvas.height / 2 - PITCH_HEIGHT / 2,
        PITCH_WIDTH,
        PITCH_HEIGHT
    );

    // Creases and stumps
    drawCreasesAndStumps();
}

let isRightHandBatsman = true; // Default: Right-handed batsman


function drawGroundLabels() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const textDistance = (FIELD_RADIUS + CIRCLE_RADIUS) / 2; // Position labels midway between 30-yard circle and boundary

    ctx.fillStyle = "#ffffff"; // White text color
    ctx.font = `bold ${20 * scaleFactor}px Arial`; // Scale font size
    ctx.textAlign = "center";

    if (isRightHandBatsman) {
        // Right-handed batsman
        ctx.fillText("Off Side", centerX - textDistance, centerY); // Off Side on the left
        ctx.fillText("Leg Side", centerX + textDistance, centerY); // Leg Side on the right
    } else {
        // Left-handed batsman
        ctx.fillText("Off Side", centerX + textDistance, centerY); // Off Side on the right
        ctx.fillText("Leg Side", centerX - textDistance, centerY); // Leg Side on the left
    }
}

document.getElementById("rightHandBatsman").addEventListener("click", () => {
    isRightHandBatsman = true; // Set to Right-Handed
    updateCanvas(); // Re-render the canvas
});

document.getElementById("leftHandBatsman").addEventListener("click", () => {
    isRightHandBatsman = false; // Set to Left-Handed
    updateCanvas(); // Re-render the canvas
});



// Draw creases and stumps at both ends
function drawCreasesAndStumps() {
    const centerX = canvas.width / 2; // Center X of the canvas
    const centerY = canvas.height / 2; // Center Y of the canvas
    const creaseLength = 67 * scaleFactor; // Increase the crease length
    const stumpWidth = 10 * scaleFactor; // Stump width
    const stumpHeight = 10 * scaleFactor; // Stump height
    const creaseOffset = 15 * scaleFactor; // Adjust the distance from the edge of the pitch

    // South End (Bowler's end)
    ctx.fillStyle = "#fff";
    // Stumps inside the pitch at the south end
    ctx.fillRect(
        centerX - stumpWidth / 2,
        centerY + PITCH_HEIGHT / 1.8 - stumpHeight - creaseOffset, // Move up into the pitch
        stumpWidth,
        stumpHeight
    );
    // Crease extended to both sides
    ctx.fillRect(
        centerX - creaseLength / 2,
        centerY + PITCH_HEIGHT / 2.2 - stumpHeight - creaseOffset + stumpHeight / 2, // Align crease with stumps
        creaseLength,
        2
    );

    // North End (Wicket-Keeper's end)
    // Stumps inside the pitch at the north end
    ctx.fillRect(
        centerX - stumpWidth / 2,
        centerY - PITCH_HEIGHT / 1.9 - stumpHeight / 2 + creaseOffset, // Move down into the pitch
        stumpWidth,
        stumpHeight
    );
    // Crease extended to both sides
    ctx.fillRect(
        centerX - creaseLength / 2,
        centerY - PITCH_HEIGHT / 2.3 - stumpHeight / 2 + creaseOffset + stumpHeight / 2, // Align crease with stumps
        creaseLength,
        2
    );
}

// Draw fielders
function drawFielders() {
    fielders.forEach((fielder) => {
        // Draw fielder
        ctx.beginPath();
        ctx.arc(fielder.x, fielder.y, 10 * scaleFactor, 0, Math.PI * 2);
        ctx.fillStyle = fielder.movable ? "#00008b" : "#e74c3c"; // Dark blue for movable, red for fixed
        ctx.fill();

        // Add bold text labels for fielding positions
        ctx.fillStyle = "#000"; // Black color for text
        ctx.font = `bold ${16 * scaleFactor}px Arial`; // Bold and scaled text size
        ctx.textAlign = "center";
        ctx.fillText(fielder.label, fielder.x, fielder.y - 15 * scaleFactor);
    });
}

// Detect if mouse is on a fielder
function getFielderAtPosition(x, y) {
    return fielders.find(
        (fielder) =>
            Math.sqrt((fielder.x - x) ** 2 + (fielder.y - y) ** 2) <= 10 &&
            fielder.movable // Only return movable fielders
    );
}

// Update the fielder's position name based on location
function updateFielderLabel(fielder) {
    const centerX = 400; // North end (batsman center)
    const centerY = 400;

    const angle = (Math.atan2(fielder.y - centerY, fielder.x - centerX) * 180) / Math.PI;

    for (const position of fieldingPositions) {
        if (angle >= position.angleStart && angle < position.angleEnd) {
            fielder.label = position.label;
            break;
        }
    }
}

// Mouse event handlers
canvas.addEventListener("mousedown", (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    selectedFielder = getFielderAtPosition(mouseX, mouseY);
});

canvas.addEventListener("mousemove", (event) => {
    if (selectedFielder) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        selectedFielder.x = mouseX;
        selectedFielder.y = mouseY;

        updateFielderLabel(selectedFielder);

        drawGround();
        drawFielders();
    }
});

canvas.addEventListener("mouseup", () => {
    selectedFielder = null;
});

// Array to hold templates
let templates = JSON.parse(localStorage.getItem('templates')) || []; // Load saved templates

// Save template function
function saveTemplate() {
    const templateName = document.getElementById('templateName').value.trim();

    if (!templateName) {
        return; // Exit if no template name is entered
    }

    // Save current fielder positions
    const template = {
        name: templateName,
        fielders: JSON.parse(JSON.stringify(fielders)), // Deep copy of current fielders
    };

    // Avoid duplicate template names by filtering existing ones
    templates = templates.filter(t => t.name !== templateName); 
    templates.push(template);

    // Save updated templates to localStorage
    localStorage.setItem('templates', JSON.stringify(templates));

    // Update the dropdown list
    updateTemplateList();
}

// Load template function
function loadTemplate() {
    const selectedTemplateName = document.getElementById('templateList').value;

    if (!selectedTemplateName) {
        return; // Exit if no template is selected
    }

    const selectedTemplate = templates.find(t => t.name === selectedTemplateName);

    if (!selectedTemplate) {
        return; // Exit if the selected template is not found
    }

    // Load the selected template
    fielders.splice(0, fielders.length, ...JSON.parse(JSON.stringify(selectedTemplate.fielders)));
    drawGround();
    drawFielders();
}

// Remove all templates function
function removeAllTemplates() {
    // Clear all templates from localStorage
    localStorage.removeItem('templates');
    templates = []; // Clear the templates array in memory

    // Update the dropdown list
    updateTemplateList();

    alert('All templates have been removed.');
}

// Update template dropdown
function updateTemplateList() {
    const templateList = document.getElementById('templateList');
    templateList.innerHTML = '<option value="">Select a Template</option>'; // Reset dropdown

    templates.forEach(template => {
        const option = document.createElement('option');
        option.value = template.name;
        option.textContent = template.name;
        templateList.appendChild(option);
    });
}

// Attach event listeners for save, load, and remove templates
document.getElementById('saveTemplate').addEventListener('click', saveTemplate);
document.getElementById('loadTemplate').addEventListener('click', loadTemplate);
document.getElementById('removeAllTemplates').addEventListener('click', removeAllTemplates);


// Initialize template list on page load
updateTemplateList();
drawGround();
drawFielders();



//******************************Bastman hit direction - Arrow*****************************


let arrows = []; // Array to hold all arrows
let isDraggingArrow = false;
let selectedArrowIndex = null;

// Function to draw all arrows
function drawArrows() {
    arrows.forEach((arrow) => {
        const { start, end } = arrow;

        // Draw the arrow line
        ctx.beginPath();
        ctx.moveTo(start.x, start.y); // Fixed starting point at the crease
        ctx.lineTo(end.x, end.y); // Draggable endpoint
        ctx.strokeStyle = "#ff0000"; // Red color for the arrow
        ctx.lineWidth = 5;
        ctx.stroke();

        // Draw arrowhead
        const angle = Math.atan2(end.y - start.y, end.x - start.x);
        const headLength = 20; // Adjust arrowhead size

        const arrowHeadX1 = end.x - headLength * Math.cos(angle - Math.PI / 5);
        const arrowHeadY1 = end.y - headLength * Math.sin(angle - Math.PI / 5);
        const arrowHeadX2 = end.x - headLength * Math.cos(angle + Math.PI / 5);
        const arrowHeadY2 = end.y - headLength * Math.sin(angle + Math.PI / 5);

        ctx.beginPath();
        ctx.moveTo(end.x, end.y); // Endpoint of the arrow
        ctx.lineTo(arrowHeadX1, arrowHeadY1);
        ctx.lineTo(arrowHeadX2, arrowHeadY2);
        ctx.closePath(); // Close the triangle
        ctx.fillStyle = "#ff0000"; // Red color for arrowhead
        ctx.fill();
    });
}

// Update the ground and fielders (with arrows if visible)
function updateCanvas() {
    drawGround();
    drawGroundLabels();
    drawFielders();
    drawArrows();
}

// Add a new arrow
document.getElementById("addArrow").addEventListener("click", () => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 1.9;
    const creaseOffset = 15 * scaleFactor; // Offset to align with the north-end crease

    const newArrow = {
        start: { 
            x: centerX, 
            y: centerY - PITCH_HEIGHT / 1.9 - 10 * scaleFactor + creaseOffset // Align with wicket keeper's end crease
        },
        end: { 
            x: centerX + 50 * scaleFactor, 
            y: centerY - PITCH_HEIGHT / 1.9 - 50 * scaleFactor + creaseOffset // Initial endpoint slightly away
        },
    };
    arrows.push(newArrow);
    updateCanvas();
});


// Remove the last added arrow
document.getElementById("removeArrow").addEventListener("click", () => {
    if (arrows.length > 0) {
        arrows.pop(); // Remove the last arrow
        updateCanvas();
    } else {
        alert("No arrows to remove!");
    }
});

// Remove all arrows
document.getElementById("removeAllArrows").addEventListener("click", () => {
    arrows = []; // Clear all arrows
    updateCanvas();
});

// Handle mouse down event
canvas.addEventListener("mousedown", (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Check if clicking near the endpoint of any arrow
    selectedArrowIndex = arrows.findIndex(
        (arrow) =>
            Math.sqrt((mouseX - arrow.end.x) ** 2 + (mouseY - arrow.end.y) ** 2) <= 10
    );

    if (selectedArrowIndex !== -1) {
        isDraggingArrow = true;
        return; // Prioritize dragging arrows
    }

    // Check if clicking on a fielder
    selectedFielder = getFielderAtPosition(mouseX, mouseY);
    if (selectedFielder) {
        isDraggingFielder = true;
    }
});

// Handle mouse move event
canvas.addEventListener("mousemove", (event) => {
    if (isDraggingArrow && selectedArrowIndex !== null) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        // Update the endpoint of the selected arrow
        arrows[selectedArrowIndex].end = { x: mouseX, y: mouseY };
        updateCanvas();
        return;
    }

    if (isDraggingFielder && selectedFielder) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        selectedFielder.x = mouseX;
        selectedFielder.y = mouseY;

        updateFielderLabel(selectedFielder);
        updateCanvas();
    }
});

// Handle mouse up event
canvas.addEventListener("mouseup", () => {
    isDraggingArrow = false;
    isDraggingFielder = false;
    selectedArrowIndex = null;
    selectedFielder = null;
});

// Initialize the canvas
updateCanvas();

