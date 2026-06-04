// Get canvas and context
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game objects
const paddleWidth = 10;
const paddleHeight = 80;
const ballSize = 8;
const gameWidth = canvas.width;
const gameHeight = canvas.height;

// Player paddle (left)
const playerPaddle = {
    x: 20,
    y: gameHeight / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 6
};

// Computer paddle (right)
const computerPaddle = {
    x: gameWidth - 30,
    y: gameHeight / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 5
};

// Ball
const ball = {
    x: gameWidth / 2,
    y: gameHeight / 2,
    radius: ballSize,
    dx: 5,
    dy: 5,
    speed: 5
};

// Score
let playerScore = 0;
let computerScore = 0;

// Keyboard controls
const keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Mouse controls
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    playerPaddle.y = mouseY - paddleHeight / 2;
    
    // Keep paddle within bounds
    if (playerPaddle.y < 0) playerPaddle.y = 0;
    if (playerPaddle.y + paddleHeight > gameHeight) {
        playerPaddle.y = gameHeight - paddleHeight;
    }
});

// Update player paddle position (keyboard)
function updatePlayerPaddle() {
    if (keys['ArrowUp'] || keys['w']) {
        playerPaddle.y -= playerPaddle.speed;
    }
    if (keys['ArrowDown'] || keys['s']) {
        playerPaddle.y += playerPaddle.speed;
    }

    // Keep paddle within bounds
    if (playerPaddle.y < 0) playerPaddle.y = 0;
    if (playerPaddle.y + paddleHeight > gameHeight) {
        playerPaddle.y = gameHeight - paddleHeight;
    }
}

// Update computer paddle (AI)
function updateComputerPaddle() {
    const computerCenter = computerPaddle.y + paddleHeight / 2;
    const ballCenter = ball.y;

    // Simple AI: follow the ball
    if (computerCenter < ballCenter - 35) {
        computerPaddle.y += computerPaddle.speed;
    } else if (computerCenter > ballCenter + 35) {
        computerPaddle.y -= computerPaddle.speed;
    }

    // Keep paddle within bounds
    if (computerPaddle.y < 0) computerPaddle.y = 0;
    if (computerPaddle.y + paddleHeight > gameHeight) {
        computerPaddle.y = gameHeight - paddleHeight;
    }
}

// Update ball position
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
}

// Collision detection for walls
function checkWallCollision() {
    // Top wall
    if (ball.y - ball.radius < 0) {
        ball.y = ball.radius;
        ball.dy = -ball.dy;
    }
    // Bottom wall
    if (ball.y + ball.radius > gameHeight) {
        ball.y = gameHeight - ball.radius;
        ball.dy = -ball.dy;
    }
}

// Collision detection for paddles
function checkPaddleCollision() {
    // Player paddle collision
    if (
        ball.x - ball.radius < playerPaddle.x + playerPaddle.width &&
        ball.y > playerPaddle.y &&
        ball.y < playerPaddle.y + playerPaddle.height
    ) {
        ball.x = playerPaddle.x + playerPaddle.width + ball.radius;
        ball.dx = -ball.dx;
        
        // Add spin based on where the ball hits the paddle
        const hitPos = (ball.y - (playerPaddle.y + paddleHeight / 2)) / (paddleHeight / 2);
        ball.dy = hitPos * ball.speed;
        
        // Increase speed slightly
        ball.dx = Math.abs(ball.dx) > 10 ? ball.dx : ball.dx * 1.05;
    }

    // Computer paddle collision
    if (
        ball.x + ball.radius > computerPaddle.x &&
        ball.y > computerPaddle.y &&
        ball.y < computerPaddle.y + computerPaddle.height
    ) {
        ball.x = computerPaddle.x - ball.radius;
        ball.dx = -ball.dx;
        
        // Add spin based on where the ball hits the paddle
        const hitPos = (ball.y - (computerPaddle.y + paddleHeight / 2)) / (paddleHeight / 2);
        ball.dy = hitPos * ball.speed;
        
        // Increase speed slightly
        ball.dx = Math.abs(ball.dx) > 10 ? ball.dx : ball.dx * 1.05;
    }
}

// Check if ball goes out of bounds
function checkScoring() {
    // Ball goes past player (computer scores)
    if (ball.x - ball.radius < 0) {
        computerScore++;
        document.getElementById('computerScore').textContent = computerScore;
        resetBall();
    }

    // Ball goes past computer (player scores)
    if (ball.x + ball.radius > gameWidth) {
        playerScore++;
        document.getElementById('playerScore').textContent = playerScore;
        resetBall();
    }
}

// Reset ball to center
function resetBall() {
    ball.x = gameWidth / 2;
    ball.y = gameHeight / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * 5;
    ball.dy = (Math.random() - 0.5) * 5;
}

// Draw paddle
function drawPaddle(paddle) {
    ctx.fillStyle = '#667eea';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Draw ball
function drawBall() {
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
}

// Draw center line
function drawCenterLine() {
    ctx.strokeStyle = '#667eea';
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(gameWidth / 2, 0);
    ctx.lineTo(gameWidth / 2, gameHeight);
    ctx.stroke();
    ctx.setLineDash([]);
}

// Draw game
function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, gameWidth, gameHeight);

    // Draw elements
    drawCenterLine();
    drawPaddle(playerPaddle);
    drawPaddle(computerPaddle);
    drawBall();
}

// Update game state
function update() {
    updatePlayerPaddle();
    updateComputerPaddle();
    updateBall();
    checkWallCollision();
    checkPaddleCollision();
    checkScoring();
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
