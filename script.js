const gameContainer = document.getElementById("game-container");
let player = document.getElementById("player"); // Change `const` to `let`
const itemCountDisplay = document.getElementById("item-count");
const hitCountDisplay = document.getElementById("hit-count");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const gameOverScreen = document.getElementById("game-over-screen");
const replayButton = document.getElementById("replay-button");
const gameOverMessage = document.getElementById("game-over-message");
const gameOverMessages = [
    "Ummm... maybe try harder next time?",
    "Maybe you are not worthy of the prince's love...",
    "Boy... you suck!",
    "Plz BFFR, try again!",
    "I don't date losers... you better try again 🙄",
    "Hmmm... I know you can do better than that!",
];


let playerX = 100, playerY = 100, speed = 5;
let itemsCollected = 0, hitsTaken = 0;
let keys = {};
let gameRunning = false;
let gameIntervals = [];

document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);
document.getElementById("start-button").addEventListener("click", function() {
    document.getElementById("start-screen").style.display = "none"; // Hide start screen
    document.getElementById("game-container").style.display = "block"; // Show game
    startGame(); // Call the function to start the game
});

function movePlayer() {
    if (!gameRunning) return;
    if (keys["a"] && playerX > 0) playerX -= speed;
    if (keys["d"] && playerX < 770) playerX += speed;
    if (keys["w"] && playerY > 0) playerY -= speed;
    if (keys["s"] && playerY < 470) playerY += speed;
    player.style.left = playerX + "px";
    player.style.top = playerY + "px";
}

function spawnArrow() {
    if (!gameRunning) return;

    const arrow = document.createElement("div");
    arrow.classList.add("arrow");
    gameContainer.appendChild(arrow);

    let startX, startY, directionX, directionY;
    const randomDirection = Math.floor(Math.random() * 8); // 0 to 7 for different directions

    switch (randomDirection) {
        case 0: // Left to right
            startX = -40; startY = Math.random() * 480;
            directionX = 1; directionY = 0;
            break;
        case 1: // Right to left
            startX = 840; startY = Math.random() * 480;
            directionX = -1; directionY = 0;
            break;
        case 2: // Top to bottom
            startX = Math.random() * 780; startY = -40;
            directionX = 0; directionY = 1;
            break;
        case 3: // Bottom to top
            startX = Math.random() * 780; startY = 540;
            directionX = 0; directionY = -1;
            break;
        case 4: // Top-left to bottom-right (Diagonal)
            startX = -40; startY = -40;
            directionX = 1; directionY = 1;
            break;
        case 5: // Top-right to bottom-left (Diagonal)
            startX = 840; startY = -40;
            directionX = -1; directionY = 1;
            break;
        case 6: // Bottom-left to top-right (Diagonal)
            startX = -40; startY = 540;
            directionX = 1; directionY = -1;
            break;
        case 7: // Bottom-right to top-left (Diagonal)
            startX = 840; startY = 540;
            directionX = -1; directionY = -1;
            break;
    }

    arrow.style.left = startX + "px";
    arrow.style.top = startY + "px";

    let arrowInterval = setInterval(() => {
        if (!gameRunning) return;

        let currentX = parseInt(arrow.style.left);
        let currentY = parseInt(arrow.style.top);

        arrow.style.left = (currentX + directionX * 6) + "px";
        arrow.style.top = (currentY + directionY * 6) + "px";

        if (collision(player, arrow)) {
            hitsTaken++;
            hitCountDisplay.textContent = hitsTaken;
            gameContainer.removeChild(arrow);
            clearInterval(arrowInterval);
            checkGameOver();
        }

        if (currentX > 850 || currentX < -50 || currentY > 550 || currentY < -50) {
            gameContainer.removeChild(arrow);
            clearInterval(arrowInterval);
        }
    }, 30);

    gameIntervals.push(arrowInterval);
}

function spawnItem() {
    if (!gameRunning) return;
    const item = document.createElement("div");
    item.classList.add("item");
    item.style.left = Math.random() * 780 + "px";
    item.style.top = Math.random() * 480 + "px";
    gameContainer.appendChild(item);

    let itemInterval = setInterval(() => {
        if (!gameRunning) return;
        if (collision(player, item)) {
            itemsCollected++;
            itemCountDisplay.textContent = itemsCollected;
            gameContainer.removeChild(item);
            clearInterval(itemInterval);
            checkGameOver();
        }
    }, 30);

    gameIntervals.push(itemInterval);
}

function collision(obj1, obj2) {
    let r1 = obj1.getBoundingClientRect();
    let r2 = obj2.getBoundingClientRect();
    return !(r1.right < r2.left || r1.left > r2.right || r1.bottom < r2.top || r1.top > r2.bottom);
}

function checkGameOver() {
    console.log("Checking game over..."); // Debugging log
    if (hitsTaken >= 3) {
        console.log("Game Over! You got hit 3 times."); // Debugging log
		const randomIndex = Math.floor(Math.random() * gameOverMessages.length);
		gameOverMessage.textContent = gameOverMessages[randomIndex];
        endGame();
    } else if (itemsCollected >= 5) {
        console.log("Congratulations! You collected 5 items!"); // Debugging log
        gameOverMessage.textContent = "Congratulations! You save 5 dumplings!";
        endGame();
    }
}

function endGame() {
    console.log("Ending game..."); // Debugging log
    gameRunning = false; 
    gameOverScreen.style.display = "flex"; // Show end screen
	gameContainer.style.display = "none";
    console.log("Game Over Screen Display:", gameOverScreen.style.display); // Debugging log
    gameIntervals.forEach(clearInterval);
    gameIntervals = []; // Clear the intervals array
}

function resetGame() {
    console.log("Resetting game..."); // Debugging log
    gameOverScreen.style.display = "none"; // Hide end screen
    gameContainer.style.display = "flex"; // Show game container
    itemsCollected = 0;
    hitsTaken = 0;
    itemCountDisplay.textContent = 0;
    hitCountDisplay.textContent = 0;
    playerX = 100;
    playerY = 100;
    gameContainer.innerHTML = `<div id="player" class="player"></div>`;
    player = document.getElementById("player"); // Reinitialize the player element
    player.style.left = playerX + "px";
    player.style.top = playerY + "px";
    gameIntervals = [];
    keys = {}; // Reset the keys object
    gameRunning = false; // Ensure the game is properly reset
    startGame();
}
replayButton.addEventListener("click", resetGame);

function startGame() {
    if (gameRunning) return;
    console.log("Starting game..."); // Debugging log
    gameRunning = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;

    gameIntervals.push(setInterval(movePlayer, 20));
    gameIntervals.push(setInterval(spawnArrow, 1500));
    gameIntervals.push(setInterval(spawnItem, 3000));
}

function pauseGame() {
    gameRunning = !gameRunning;
    pauseBtn.textContent = gameRunning ? "Pause" : "Resume";
}

startBtn.addEventListener("click", startGame);
pauseBtn.addEventListener("click", pauseGame);