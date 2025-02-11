const gameContainer = document.getElementById("game-container");
const player = document.getElementById("player");
const itemCountDisplay = document.getElementById("item-count");
const hitCountDisplay = document.getElementById("hit-count");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");

let playerX = 100, playerY = 100, speed = 5;
let itemsCollected = 0, hitsTaken = 0;
let keys = {};
let gameRunning = false;
let gameIntervals = [];

document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

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
    if (hitsTaken >= 3) {
        alert("Game Over! You got hit 3 times.");
        resetGame();
    } else if (itemsCollected >= 30) {
        alert("Congratulations! You collected 30 items.");
        resetGame();
    }
}

function startGame() {
    if (gameRunning) return;
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

function resetGame() {
    gameRunning = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.textContent = "Pause";
    itemsCollected = 0;
    hitsTaken = 0;
    itemCountDisplay.textContent = 0;
    hitCountDisplay.textContent = 0;

    gameContainer.innerHTML = `<div id="player" class="player"></div>`;
    playerX = 100;
    playerY = 100;
    player.style.left = playerX + "px";
    player.style.top = playerY + "px";

    gameIntervals.forEach(clearInterval);
    gameIntervals = [];
}

startBtn.addEventListener("click", startGame);
pauseBtn.addEventListener("click", pauseGame);
