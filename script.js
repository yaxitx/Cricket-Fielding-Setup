const canvas = document.getElementById("cricketGround");
const ctx = canvas.getContext("2d");

// Cricket field dimensions
const FIELD_RADIUS = 400;
const CIRCLE_RADIUS = 200;

// Fielding positions for both ends
const fieldingPositions = [
    { label: "Fine Leg", angleStart: 135, angleEnd: 180 },
    { label: "Square Leg", angleStart: 90, angleEnd: 135 },
    { label: "Mid-Wicket", angleStart: 45, angleEnd: 90 },
    { label: "Mid-On", angleStart: 0, angleEnd: 45 },
    { label: "Mid-Off", angleStart: -45, angleEnd: 0 },
    { label: "Cover", angleStart: -90, angleEnd: -45 },
    { label: "Point", angleStart: -135, angleEnd: -90 },
    { label: "Third Man", angleStart: -180, angleEnd: -135 },
    { label: "Deep Point", angleStart: -90, angleEnd: -135 },
];

// Fielder positions and labels
const fielders = [
    { x: 400, y: 520, label: "Bowler", movable: false }, // Bowler farther from the stumps at the south end
    { x: 400, y: 300, label: "Wicket-Keeper", movable: false }, // Wicket-keeper moved behind the stumps
    { x: 400, y: 240, label: "Mid-Off", movable: true },
    { x: 600, y: 400, label: "Point", movable: true },
    { x: 400, y: 600, label: "Mid-On", movable: true },
    { x: 200, y: 400, label: "Fine Leg", movable: true },
    { x: 500, y: 330, label: "Cover", movable: true },
    { x: 300, y: 500, label: "Square Leg", movable: true },
    { x: 600, y: 600, label: "Long On", movable: true },
    { x: 200, y: 600, label: "Third Man", movable: true },
    { x: 600, y: 240, label: "Deep Point", movable: true }, // Ensure all players are properly placed
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
    ctx.arc(400, 400, FIELD_RADIUS, 0, Math.PI * 2);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();

    // 30-yard circle
    ctx.beginPath();
    ctx.arc(400, 400, CIRCLE_RADIUS, 0, Math.PI * 2);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Pitch (Shortened)
    ctx.fillStyle = "#e67e22";
    ctx.fillRect(380, 320, 50, 160); // Shortened pitch

    // Creases and stumps
    drawCreasesAndStumps();
}

// Draw creases and stumps at both ends
function drawCreasesAndStumps() {
    // South End (Bowler's end)
    ctx.fillStyle = "#fff";
    ctx.fillRect(399, 460, 10, 10); // Stumps
    ctx.fillRect(375, 450, 60, 2);  // Single crease line

    // North End (Wicket-Keeper's end)
    ctx.fillRect(399, 330, 10, 10); // Stumps (aligned correctly on pitch)
    ctx.fillRect(375, 348, 60, 2);  // Single crease line (below the stumps)
}

// Draw fielders
function drawFielders() {
    fielders.forEach((fielder, index) => {
        // Draw fielder
        ctx.beginPath();
        ctx.arc(fielder.x, fielder.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = fielder.movable ? "#3498db" : "#e74c3c"; // Different color for movable vs non-movable players
        ctx.fill();

        // Add text labels for fielding positions
        ctx.fillStyle = "#000"; // Black color for text
        ctx.font = "bold 16px Arial"; // Bold text with increased font size
        ctx.textAlign = "center";
        ctx.fillText(fielder.label, fielder.x, fielder.y - 15);
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
        alert('Please enter a template name');
        return;
    }

    // Save current fielder positions
    const template = {
        name: templateName,
        fielders: JSON.parse(JSON.stringify(fielders)), // Deep copy of current fielders
    };

    // Add to templates and save to local storage
    templates = templates.filter(t => t.name !== templateName); // Avoid duplicates
    templates.push(template);
    localStorage.setItem('templates', JSON.stringify(templates));

    alert(`Template "${templateName}" saved!`);
    updateTemplateList();
}

// Load template function
function loadTemplate() {
    const selectedTemplateName = document.getElementById('templateList').value;

    if (!selectedTemplateName) {
        alert('Please select a template to load');
        return;
    }

    const selectedTemplate = templates.find(t => t.name === selectedTemplateName);

    if (!selectedTemplate) {
        alert('Template not found');
        return;
    }

    // Load fielders from template
    fielders.splice(0, fielders.length, ...JSON.parse(JSON.stringify(selectedTemplate.fielders))); // Replace current fielders
    drawGround();
    drawFielders();

    alert(`Template "${selectedTemplateName}" loaded!`);
}

// Update template dropdown
function updateTemplateList() {
    const templateList = document.getElementById('templateList');
    templateList.innerHTML = '<option value="">Select a Template</option>'; // Reset options

    templates.forEach(template => {
        const option = document.createElement('option');
        option.value = template.name;
        option.textContent = template.name;
        templateList.appendChild(option);
    });
}

// Attach event listeners
document.getElementById('saveTemplate').addEventListener('click', saveTemplate);
document.getElementById('loadTemplate').addEventListener('click', loadTemplate);

// Initialize template list on page load
updateTemplateList();
drawGround();
drawFielders();



//******************************Bastman hit direction*************************************


let isArrowVisible = false;
let arrowStart = { x: 400, y: 350 }; // Fixed starting point (batsman's crease)
let arrowEnd = { x: 450, y: 300 }; // Initial endpoint (draggable)
let isDraggingArrow = false;
let isDraggingFielder = false; // Track if a fielder is being dragged

// Function to draw the arrow
function drawArrow() {
    if (!isArrowVisible) return;

    // Draw the arrow line
    ctx.beginPath();
    ctx.moveTo(arrowStart.x, arrowStart.y); // Fixed starting point at the crease
    ctx.lineTo(arrowEnd.x, arrowEnd.y); // Draggable endpoint
    ctx.strokeStyle = "#ff0000"; // Red color for the arrow
    ctx.lineWidth = 5; // Increased arrow width
    ctx.stroke();

    // Draw arrowhead
    const angle = Math.atan2(arrowEnd.y - arrowStart.y, arrowEnd.x - arrowStart.x);
    const headLength = 15; // Adjust arrowhead size

    // Calculate the points for the arrowhead
    const arrowHeadX1 = arrowEnd.x - headLength * Math.cos(angle - Math.PI / 7);
    const arrowHeadY1 = arrowEnd.y - headLength * Math.sin(angle - Math.PI / 7);

    const arrowHeadX2 = arrowEnd.x - headLength * Math.cos(angle + Math.PI / 7);
    const arrowHeadY2 = arrowEnd.y - headLength * Math.sin(angle + Math.PI / 7);

    // Draw the arrowhead
    ctx.beginPath();
    ctx.moveTo(arrowEnd.x, arrowEnd.y); // Endpoint of the arrow
    ctx.lineTo(arrowHeadX1, arrowHeadY1);
    ctx.lineTo(arrowHeadX2, arrowHeadY2);
    ctx.closePath(); // Close the triangle
    ctx.fillStyle = "#ff0000"; // Red color for arrowhead
    ctx.fill();
}

// Update the ground and fielders (with the arrow if visible)
function updateCanvas() {
    drawGround();
    drawFielders();
    drawArrow();
}

// Add arrow
document.getElementById("addArrow").addEventListener("click", () => {
    if (!isArrowVisible) {
        isArrowVisible = true;
        updateCanvas();
    }
});

// Remove arrow
document.getElementById("removeArrow").addEventListener("click", () => {
    if (isArrowVisible) {
        isArrowVisible = false;
        updateCanvas();
    }
});

// Handle mouse down event
canvas.addEventListener("mousedown", (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Check if clicking near the arrow's endpoint
    const distanceToArrowEnd = Math.sqrt((mouseX - arrowEnd.x) ** 2 + (mouseY - arrowEnd.y) ** 2);
    if (isArrowVisible && distanceToArrowEnd <= 10) {
        isDraggingArrow = true;
        return; // Give priority to arrow dragging
    }

    // Check if clicking on a fielder
    selectedFielder = getFielderAtPosition(mouseX, mouseY);
    if (selectedFielder) {
        isDraggingFielder = true;
    }
});

// Handle mouse move event
canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Drag the arrow
    if (isDraggingArrow) {
        arrowEnd.x = mouseX;
        arrowEnd.y = mouseY;
        updateCanvas();
        return;
    }

    // Drag the fielder
    if (isDraggingFielder && selectedFielder) {
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
    selectedFielder = null;
});

// Initialize the canvas
updateCanvas();



