// elements
let player = document.getElementById("player");
let portal = document.getElementById("portal"); 
let prince = document.getElementById("prince"); 
// game screens
const gameContainer = document.getElementById("game-container");
let secondGameScreen = document.getElementById("second-game-screen"); 
let yippeeScreen = document.getElementById("yippee-screen");
const gameOverScreen = document.getElementById("game-over-screen");
//stats
const hitCountDisplay = document.getElementById("hit-count");
const itemCountDisplay = document.getElementById("item-count");
// buttons
// const replayButtonYippee = document.getElementById("replay-button-yippee");
const startBtn = document.getElementById("start-button");
const pauseBtn = document.getElementById("pause-btn");
const replayButton = document.getElementById("replay-button");
const yesButton = document.getElementById("yes-button");
const noButton = document.getElementById("no-button");
const nextButton = document.getElementById("next-button");
// messages
const gameOverMessage = document.getElementById("game-over-message");
const gameOverMessages = [
    "Ummm... maybe try harder next time?",
    "Maybe you are not worthy of the prince's love...",
    "Boy... you suck!",
    "Plz BFFR, try again!",
    "I don't date losers... you better try again 🙄",
    "Hmmm... I know you can do better than that!",
];

const dialogueSequence = [
    "Well hello brave adventurer!",
    "I see that you have successfully saved my soup dumpling fairies and they have showed you the way here.",
    "I am so grateful for your help, hence I shall reward you!",
    "But before that... I do have a request again",
    "You see, I have been ruling the dumpling kingdom by myself for centries now...",
    "And I've been waiting for someone who can accompany me in my kingdom.",
    "Someone who is brave, cute, and most importantly, someone who has a nice ass.",
    "*Cough* Umm... I mean nice personality hehe",
    "Soo... I have a question for you...",
    "Will you be my valentine?",
];

// varaibles
let currentDialogueIndex = 0;
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
document.addEventListener("DOMContentLoaded", () => {
    secondGameScreen = document.getElementById("second-game-screen");
    circle = document.getElementById("circle");
    dialog = document.getElementById("dialog");
});

function movePlayer() {
    if (!gameRunning) return;
    if ((keys["a"] || keys["ArrowLeft"]) && playerX > 0) playerX -= speed;
    if ((keys["d"] || keys["ArrowRight"]) && playerX < 770) playerX += speed;
    if ((keys["w"] || keys["ArrowUp"]) && playerY > 0) playerY -= speed;
    if ((keys["s"] || keys["ArrowDown"]) && playerY < 470) playerY += speed;
    
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
            decrementHearts();
            hitsTaken++;
            // hitCountDisplay.textContent = hitsTaken;
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

function decrementHearts() {
    const hearts = document.querySelectorAll("#hit-count .heart");
    if (hearts.length > 0) {
        hearts[hearts.length - 1].remove(); // Remove the last heart
    }
}

function resetHearts() {
    const hitCount = document.getElementById("hit-count");
    hitCount.innerHTML = `
        <img src="img/heart.png" class="heart" alt="Heart">
        <img src="img/heart.png" class="heart" alt="Heart">
        <img src="img/heart.png" class="heart" alt="Heart">
    `;
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
    const rect1 = obj1.getBoundingClientRect();
    const rect2 = obj2.getBoundingClientRect();

    return !(rect1.right < rect2.left || 
             rect1.left > rect2.right || 
             rect1.bottom < rect2.top || 
             rect1.top > rect2.bottom);
}

function checkGameOver() {
    console.log("Checking game over..."); // Debugging log
    if (hitsTaken >= 3) {
        console.log("Game Over! You got hit 3 times."); // Debugging log
        const randomIndex = Math.floor(Math.random() * gameOverMessages.length);
        gameOverMessage.textContent = gameOverMessages[randomIndex];
        endGame();
    } else if (itemsCollected >= 3) {
        console.log("Congratulations! You collected 3 items!"); // Debugging log
        showPortal();
    }
}

function showPortal() {
    if (!portal) {
        console.error("Portal element not found");
        return;
    }
    console.log("Portal element appears");
    portal.style.display = "block";
    portal.style.transition = "opacity 2s"; // 2-second fade-in
    portal.style.opacity = "1"; // Fully visible

    // Start checking collision after fade-in is complete
    setTimeout(() => {
        const portalCollisionInterval = setInterval(() => {
            if (collision(player, portal)) {
                clearInterval(portalCollisionInterval); // Stop checking after collision
                transitionToSecondGameScreen();
            }
        }, 20);
        gameIntervals.push(portalCollisionInterval);
    }, 2000); // Wait for fade-in transition (2s)
}


function checkPlayerPortalCollision() {
    // const portal = document.getElementById("portal");
    if (collision(player, portal)) {
        transitionToSecondGameScreen();
    }
}

function transitionToSecondGameScreen() {
    if (!secondGameScreen) {
        console.error("Second game screen element not found");
        return;
    }
    console.log("Transitioning to second game screen");
    gameRunning = false;
    gameContainer.style.display = "none";
    secondGameScreen.style.display = "block";
    player.style.backgroundImage = "url('./img/jonah_w_bao.png')";
    // Move player and prince to the second game screen
    console.log(prince)
    secondGameScreen.appendChild(player);
    secondGameScreen.appendChild(prince); 
    playerX = secondGameScreen.offsetWidth / 2;
    playerY = secondGameScreen.offsetHeight * 0.9;

    prince.style.display = "block";

    gameIntervals.forEach(clearInterval); 
    gameIntervals = []; 
    gameRunning = true;
    gameIntervals.push(setInterval(movePlayerInSecondScreen, 20));
}


function movePlayerInSecondScreen() {
    if (!gameRunning) return;
    if ((keys["a"] || keys["ArrowLeft"]) && playerX > 0) playerX -= speed;
    if ((keys["d"] || keys["ArrowRight"]) && playerX < 770) playerX += speed;
    if ((keys["w"] || keys["ArrowUp"]) && playerY > 0) playerY -= speed;
    if ((keys["s"] || keys["ArrowDown"]) && playerY < 470) playerY += speed;

    player.style.left = playerX + "px";
    player.style.top = playerY + "px";

    if (collision(player, prince)) {
        showDialog();
        gameRunning = false;
    }
}

function showDialog() {
    if (!dialog) {
        console.error("Dialog element not found");
        return;
    }

    // Reset the dialogue index
    currentDialogueIndex = 0;
    // Display the first message
    console.log("Showing dialogue:", dialogueSequence[currentDialogueIndex]);
    dialog.querySelector("#dialog-text").textContent = dialogueSequence[currentDialogueIndex];
    dialog.style.display = "block";
    nextButton.style.display = "block";

    // Add event listener for the "Next" button
    nextButton.addEventListener("click", handleNextDialogue);
}

function handleNextDialogue() {
    currentDialogueIndex++;

    if (currentDialogueIndex < dialogueSequence.length) {
        // Display the next message
        dialog.querySelector("#dialog-text").textContent = dialogueSequence[currentDialogueIndex];
        if(currentDialogueIndex === dialogueSequence.length - 1){
            console.log("in else if");
            nextButton.style.display = "none";
            yesButton.style.display = "block";
            noButton.style.display = "block";
        }

    } else{
        askToPlayAgain(); 
    }
}

yesButton.addEventListener("click", handleYes);
noButton.addEventListener("click", handleNo);

function handleYes() {
    // Hide the dialogue box
    dialog.style.display = "none";
    secondGameScreen.style.display = "none";
    // Show the "Yippee, reward awaits" screen
    yippeeScreen.style.display = "block";
    const replayButtonYippee = document.getElementById("replay-button-yippee");
    replayButtonYippee.addEventListener("click", resetGame);

}

function handleNo() {
    // Hide the dialogue box
    dialog.style.display = "none";

    // Show an image for 1 second
    const noImage = document.createElement("img");
    noImage.src = "img/heart.png"; // Replace with your image path
    noImage.style.position = "absolute";
    noImage.style.top = "50%";
    noImage.style.left = "50%";
    noImage.style.transform = "translate(-50%, -50%)";
    noImage.style.zIndex = "1000";
    document.body.appendChild(noImage);

    // Remove the image after 1 second
    setTimeout(() => {
        noImage.remove();
    }, 1000);
}


function askToPlayAgain() {
    const playAgain = confirm("Do you want to play again?");
    if (playAgain) {
        resetGame(); // Reset the game if the user chooses to play again
    } else {
        // Optionally, you can redirect the user or display a "Thank you" message
        alert("Thank you for playing!");
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
    secondGameScreen.style.display = "none"; // Hide second game screen
    dialog.style.display = "none"; // Hide dialogue box
    yippeeScreen.style.display = "none"
    player.style.backgroundImage = "url('./img/jonah')";
    itemsCollected = 0;
    hitsTaken = 0;
    itemCountDisplay.textContent = 0;
    hitCountDisplay.textContent = 0;
    playerX = 100;
    playerY = 100;
    currentDialogueIndex = 0;
    if (secondGameScreen.contains(player)) {
        console.log("Moving player back to game container"); // Debugging log
        gameContainer.appendChild(player);
    }

    console.log("Clearing second game screen"); // Debugging log
    secondGameScreen.innerHTML = "";
    // Reset the game container's content
    console.log("Resetting game container"); // Debugging log
    gameContainer.innerHTML = `
        <div id="player" class="player"></div>
        <div id="portal" class="portal" style="display: none;"></div>
    `;

    // Reinitialize the player and portal elements
    player = document.getElementById("player");
    portal = document.getElementById("portal");

    // Reset player position
    player.style.left = playerX + "px";
    player.style.top = playerY + "px";

    // Clear intervals and reset keys
    gameIntervals.forEach(clearInterval);
    gameIntervals = [];
    keys = {};
    resetHearts();
    // Ensure the game is properly reset
    gameRunning = false;
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