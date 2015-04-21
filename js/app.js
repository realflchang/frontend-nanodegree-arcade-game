// Enemies our player must avoid
var Enemy = function(rowNum) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images

    // Initialize enemy (define direction, sprite, speed, starting x & y)
    this.init(rowNum);

    // Variable to preserving speed when pausing the game
    this.savedSpeed=0;

};

// Initialize enemy (define direction, sprite, speed, starting x & y)
Enemy.prototype.init = function(rowNum) {
    // For each enemy, determine direction and sprite to use
    this.direction = this.getDirection();
    this.sprite = this.getEnemySprite(this.direction);

    // Set speed of this enemy. Direction is -1 for left, +1 for right.
    this.speed = this.getSpeed() * this.direction;

    // Define starting position
    this.x = (this.direction === 1) ? -101:589;
    this.y = rowNum * 83 + 50; // Define row position

};

// Defines enemy direction, sprite and speed
Enemy.prototype.getDirection = function() {
    // Using +1=right, -1=left
    var dir = Math.floor(Math.random()*2);
    if (dir === 0) {
        dir = -1;
    }
    return dir;
};

// Determine what sprite to use, based on direction
Enemy.prototype.getEnemySprite = function(dir) {
    var sprite;
    if (dir > 0) {
        // Define Rightward walking bug
        sprite = 'images/enemy-bug.png';
    } else {
        // Define Leftward walking bug
        sprite = 'images/enemy-bug-toleft.png';
    }
    return sprite;
};

// Determine speed for the enemy
Enemy.prototype.getSpeed = function() {
    var speed = Math.random() * 90 + 30; // Speed from 30 to 120
    return speed; //Math.random() * 100;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.speed !== 0) {
        this.x = this.x + this.speed * dt;
    }
    if (this.x > 589) { this.reset(); } // Remove bug if it falls off right side
    if (this.x < -101) { this.reset(); } // Remove bug if it falls off left side
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function(i) {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Remove enemy, and respawn in random direction and speed
Enemy.prototype.reset = function() {

    var rowNum = Math.floor(Math.random()*5);

    // Reinitialize enemy after it passes offscreen
    this.init(rowNum);

};

// Functions to define how to pause/unpause enemies
Enemy.prototype.pause = function() {
    this.savedSpeed = this.speed;
    this.speed = 0;
};

Enemy.prototype.unpause = function() {
    this.speed = this.savedSpeed;
    this.savedSpeed = 0;
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {

    // Select Boy as a default character
    this.playChar = 0; // 0=first in list of player's characters

    // Load a player character
    this.sprite = this.getPlayChar(this.playChar);

    // Initial placement
    this.x = 200;
    this.y = 600;
    this.changeX = 0;
    this.changeY = 0;

    // These are for restoring movements. In use when player collides with rock object.
    this.lastChangeX = 0;
    this.lastChangeY = 0;

    // Reset score
    this.score = 0;

    return this;
};

// Check player's position, and do not make player go outside of game boundaries
Player.prototype.update = function() {
    // player attempts to move off the left side
    if (this.x + this.changeX < 0) {
        this.x = 0;
    }

    // player attempts to move off the right side
    else if (this.x + this.changeX > 404) {
        this.x = 404;
    }

    // player attempts to move off the top side, player wins and starts again from the bottom.
    // Add 100 to the score for reaching water.
    else if (this.y + this.changeY < 0) {
        this.y = 600;
        this.score = this.score + 100;
        updateScore();
    }

    // player attempts to move off the bottom side
    else if (this.y + this.changeY > 435) {
        this.y = 435;
    }

    // otherwise, move the player accordingly
    else {
        this.x += this.changeX;
        this.y += this.changeY;
        this.lastChangeX = this.changeX;
        this.lastChangeY = this.changeY;
    }

    // reset current movement
    this.changeX = 0;
    this.changeY = 0;

};

// Render the player
Player.prototype.render = function() {
    ctx.drawImage( Resources.get( this.sprite ), this.x, this.y );
};

// Use keyup event listener, and determine proper direction for player
Player.prototype.handleInput = function( key ) {
    switch(key) {
        case 'left':
            if (!isPauseState)
              this.changeX = -101;
            break;

        case 'up':
            if (!isPauseState) {
                this.changeY = -83;
                if (this.y >= 20 + (83 * 5) ) { // Player at bottom row, first step up uses smaller step
                    this.changeY = -53;
                }
            }
            break;

        case 'right':
            if (!isPauseState)
              this.changeX = 101;
            break;

        case 'down':
            if (!isPauseState) {
                this.changeY = 83;
                if (this.y >= 20 + (83 * 4) ) { // Player going to bottom row, last step down uses smaller step
                    this.changeY = 53;
                }
            }
            break;
        case 'pause':
            pauseGame();  // Pause/Unpause Game
            break;
        case 'restart':
            restartGame();  // Restart/Reset Game
            break;

        default:
            break;
    }
};

// Function to pause and unpause game. Remains in pause state when game is over.
function pauseGame() {
    if (isPauseState && !isGameOver) {
        allEnemies.forEach( function( enemy ) {
            enemy.unpause();
        });
        timer.resumeGameTime();
        isPauseState = false;
    }
    else {
        allEnemies.forEach( function( enemy ) {
            enemy.pause();
        });
        timer.pauseGameTime();
        isPauseState = true;
    }
}


// This function resets the player's position and score
Player.prototype.reset = function() {
    this.x = 200;
    this.y = 600;

    this.changeX = 0;
    this.changeY = 0;

    this.score = 0;
    this.sprite = this.getPlayChar(this.playChar);
};

// Determine player sprite
Player.prototype.getPlayChar = function(playChar) {
    var playerImages = [
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png'
        ];

    return playerImages[playChar];
};

// Define Gem object
var Gem = function() {
    this.sprite = this.getRandomGem();

    // gems appear at random X locations and
    // on the same rows as the bugs;
    // gems won't initially appear on the bottom row with the player
    this.x = randomXPos();
    this.y = randomYPos();

    this.scoreValue = 1;
};

Gem.prototype.render = function() {
    ctx.drawImage( Resources.get( this.sprite ), this.x, this.y );
};

// Reset Gem in new location
Gem.prototype.reset = function() {
    this.x = randomXPos();
    this.y = randomYPos();
    this.sprite = this.getRandomGem();
};

// Provide a random color gem to display
Gem.prototype.getRandomGem = function() {
    var gemImages = [
        'images/Gem Blue.png',
        'images/Gem Green.png',
        'images/Gem Orange.png'
        ];

    //Pick random Gem.
    var rnd = Math.floor(Math.random() * 3);
    return gemImages[rnd];
};


// Define Rock Object
var Rock = function() {
    this.allowRock = "rock";

    this.sprite = this.getRandomRock();

    // Rock appear at random X locations and
    // on the same rows as the bugs;
    // Rock won't initially appear on the bottom row with the player
    this.x = randomXPos();
    this.y = randomYPos();

};

Rock.prototype.render = function() {
    ctx.drawImage( Resources.get( this.sprite ), this.x, this.y );
};

// Set rock position
Rock.prototype.reset = function() {
    this.x = randomXPos();
    this.y = randomYPos();
    this.sprite = this.getRandomRock();
    changeRockMode(document.getElementById("mode").value);
};

// Provide rock sprite to use. If there are other Rock images, add here.
Rock.prototype.getRandomRock = function() {
    var rockImages = [
        'images/Rock.png'
        ];

    return rockImages[0];
};

// Returns random X Position for Rocks and Gems
function randomXPos() {
    return Math.floor( (Math.random() * 5) ) * 101;
}

// Returns random Y Position for Rocks and Gems
function randomYPos() {
    return Math.floor( (Math.random() * 4) ) * 83 + 50;
}

// Call function when player selects a different character
function changePlayer(playChar) {
    player.playChar = playChar;
    player.sprite = player.getPlayChar(playChar);
}

// Call function when player decides to have rock in game or no rock in game
function changeRockMode(allowRock) {
    rock.allowRock = allowRock;
    if (allowRock == "norock") { // if no rock, just move it offscreen so nothing will collide with it
        rock.x = -500;
        rock.y = -500;
    } else { // if rock, just restore it back onscreen
        rock.x = randomXPos();
        rock.y = randomYPos();
    }

}

// Call function when player changes game length
function changeGameLength(newGameLength) {
    timer.secondsPerGame = newGameLength;
    timer.reset();
}

// Function to restart the game
function restartGame() {

    // noop
    player.reset();
    allEnemies.forEach( function( enemy )
    {
        enemy.reset();
    });
    gem.reset();
    rock.reset();
    timer.reset();
    isPauseState = false;
    isGameOver = false;
    $(".gameovercontainer").css("display","none");
    $("#score").text(" 0 ");

}

// Function to show Game Over message, and stop all entities from moving.
function gameOver(mesg) {
    switch(mesg) {
        case 'timeisup':
            mesg = "Time is up! Final score is "+player.score+".<br>Press R to Restart.";
        break;
        case 'bug':
            mesg = "A bug has bit you!<br>Final score is "+player.score+".<br>Press R to Restart.";
        break;
    }
    $(".gameovercontainer").html(mesg);
    $(".gameovercontainer").css("display","block");
    isGameOver = true;
    pauseGame();
}

// Function to update the score as needed, ie. when collecting gems, or reaching water
function updateScore() {
    // update the score
    document.getElementById("score").innerHTML = player.score;
}

// Object to keep track of clock during game
var Timer = function() {

    // Set default 30 seconds per game
    var SECONDSPERGAME = 30;

    // Initial game start time. Date.now() is in milliseconds, so divide by 1000 to get seconds
    this.initialClock = Date.now() / 1000;

    // Allotted time per game
    this.secondsPerGame = SECONDSPERGAME;

    // Track current game clock
    this.currentTime = 0; //this.initialClock;

    // If player pauses the game, use this to maintain offset time
    this.pauseTime = 0;

};

// Track current game time, and whether game should still go on.
Timer.prototype.update = function() {

    this.currentTime = Date.now() / 1000 - this.initialClock;

    var gameclock = Math.floor(this.currentTime);

    if (gameclock <= this.secondsPerGame && !isPauseState) {
        // Update the clock. Countdown to Zero
        document.getElementById("clock").innerHTML = this.secondsPerGame - gameclock;
    } else {
        if (!isPauseState) {
            gameOver("timeisup");
        }
    }
};

// Return current game time
Timer.prototype.getCurrentTime = function() {
    return this.currentTime;
};


// To preserve game time, save time when game paused. Later when game resumes, find amount of time passed, add difference back to initial time.
Timer.prototype.pauseGameTime = function() {
    this.pauseTime = this.currentTime;
};

Timer.prototype.resumeGameTime = function() {
    this.initialClock = Date.now() / 1000 - this.pauseTime;
    this.pauseTime = 0;
};

Timer.prototype.reset = function() {
    // Date.now() is in milliseconds. Change to seconds.
    this.initialClock = Date.now() / 1000;
    this.currentTime = this.initialClock;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var numOfEnemies = 5;
var allEnemies = [];
for (var i=0; i<numOfEnemies; i++) {
  allEnemies.push(new Enemy(i));
}
var player = new Player();
var gem = new Gem();
var rock = new Rock();
var timer = new Timer();
var isPauseState = false;
var isGameOver = false;
var showRock = true;

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        112: 'pause',
        114: 'restart',
        80: 'pause',
        82: 'restart'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// Player using arrow buttons on-screen to play game
function moveUp() {
    player.handleInput('up');
}

function moveLeft() {
    player.handleInput('left');
}

function moveRight() {
    player.handleInput('right');
}

function moveDown() {
    player.handleInput('down');
}
