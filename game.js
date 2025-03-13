// Select canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Bird properties
const bird = {
    x: 50,
    y: 200,
    width: 30,
    height: 30,
    gravity: 3.5,
    lift: -20,
    velocity: 1,
};

// Pipe properties
const pipes = [];
const pipeWidth = 50;
const pipeGap = 120;
const pipeSpeed = 2;
let frame = 0;

// Score
let score = 0;
let gameOver = false;

// Listen for spacebar press
document.addEventListener("keydown", function (event) {
    if (event.code === "Space" && !gameOver) {
        bird.velocity = bird.lift;
    } else if (event.code === "Space" && gameOver) {
        resetGame();
    }
});

// Function to generate pipes
function generatePipes() {
    if (frame % 90 === 0) {
        let pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap - 50)) + 50;
        pipes.push({ x: canvas.width, y: pipeHeight });
    }
}

// Function to update game objects
function update() {
    if (gameOver) return;

    // Bird physics
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Check for ground or ceiling collision
    if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
        gameOver = true;
    }

    // Move and update pipes
    pipes.forEach((pipe, index) => {
        pipe.x -= pipeSpeed;

        // Check for collision
        if (
            bird.x < pipe.x + pipeWidth &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.y || bird.y + bird.height > pipe.y + pipeGap)
        ) {
            gameOver = true;
        }

        // Remove pipes when out of screen and increase score
        if (pipe.x + pipeWidth < 0) {
            pipes.splice(index, 1);
            score++;
        }
    });

    // Generate pipes
    generatePipes();

    // Increment frame count
    frame++;
}

// Function to draw objects
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw bird
    ctx.fillStyle = "yellow";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

    // Draw pipes
    pipes.forEach(pipe => {
        ctx.fillStyle = "green";
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.y);
        ctx.fillRect(pipe.x, pipe.y + pipeGap, pipeWidth, canvas.height - pipe.y - pipeGap);
    });

    // Draw score
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 20, 30);

    // Game over message
    if (gameOver) {
        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.fillText("Game Over", canvas.width / 2 - 80, canvas.height / 2);
        ctx.font = "20px Arial";
        ctx.fillText("Press Space to Restart", canvas.width / 2 - 100, canvas.height / 2 + 30);
    }
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Reset game
function resetGame() {
    bird.y = 200;
    bird.velocity = 0;
    pipes.length = 0;
    score = 0;
    frame = 0;
    gameOver = false;
}

// Start game loop
gameLoop();
