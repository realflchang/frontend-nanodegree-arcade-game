// Enemies our player must avoid
var Enemy = function(rowNum) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images

    this.direction = this.getDirection();
    this.sprite = this.getEnemySprite(this.direction);

    // Set constant speed of this enemy
    this.speed = this.getSpeed() * this.direction;

    this.x = (this.direction === 1) ? -101:589;
    this.y = rowNum * 83; // Define row position

    this.savedSpeed=0; // For preserving speed when pausing the game

}

// Defines enemy direction, sprite and speed
Enemy.prototype.getDirection = function() {
    // Using 1=right, 0=left
    var dir = Math.floor(Math.random()*2);
    if (dir===0) {
        dir = -1;
    }
    return dir;
}

Enemy.prototype.getEnemySprite = function(dir) {
    var sprite;
    if (dir===1) {
        // Define Rightward walking bug
        sprite = 'images/enemy-bug.png';
    } else {
        // Define Leftward walking bug
        sprite = 'images/enemy-bug-toleft.png';
    }
    return sprite;
}

Enemy.prototype.getSpeed = function() {
    var speed = Math.random() * 90+30; // Speed from 30 to 120
    return speed; //Math.random() * 100;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.speed !==0) {
        this.x = this.x + this.speed * dt;
        if (this.direction === 1) {
            if ( this.x > 589 ) { this.reset(); } // Remove bug if it falls off right side
        } else {
            if ( this.x < -101) { this.reset(); } // Remove bug if it falls off left side
        }
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Remove enemy, and respawn in random direction and speed
Enemy.prototype.reset = function() {

    this.direction = this.getDirection();

    this.sprite = this.getEnemySprite(this.direction);

    // Set constant speed of this enemy
    this.speed = this.getSpeed() * this.direction;

    this.x = (this.direction === 1) ? -101:589;

    var rowNum = Math.floor(Math.random()*5);
    this.y = rowNum * 83; // Define row position

}

// Functions to define how to pause/unpause enemies
Enemy.prototype.pause = function() {
        this.savedSpeed = this.speed;
        this.speed = 0;
}

Enemy.prototype.unpause = function() {
        this.speed = this.savedSpeed;
        this.savedSpeed = 0;
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {

    this.playChar = 0; // default, use boy as character

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
}

// Check player's position, and do not make player go outside of game boundaries
Player.prototype.update = function() {
    // player attempts to move off the left side
    if ( this.x + this.changeX < 0 ) {
        this.x = 0;
    }

    // player attempts to move off the right side
    else if ( this.x + this.changeX > 404 ) {
        this.x = 404;
    }

    // player attempts to move off the top side
    else if ( this.y + this.changeY < 0 ) {
        this.y = 0;
    }

    // player attempts to move off the bottom side
    else if ( this.y + this.changeY > 435 ) {
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

}

// Render the player
Player.prototype.render = function() {
    ctx.drawImage( Resources.get( this.sprite ), this.x, this.y );
}

// Use keyup event listener, and determine proper direction for player
Player.prototype.handleInput = function( key )
{
    switch( key )
    {
        case 'left':
            if (!pauseState)
              this.changeX = -30;
            break;

        case 'up':
            if (!pauseState)
              this.changeY = -30;
            break;

        case 'right':
            if (!pauseState)
              this.changeX = 30;
            break;

        case 'down':
            if (!pauseState)
              this.changeY = 30;
            break;
        case 'pause':
            pauseGame();  // Pause/Unpause Game
            break;

        default:
            break;
    }
}


function pauseGame() {
    if (!pauseState) {
        allEnemies.forEach( function( enemy ) {
            enemy.pause();
        });
        pauseState = true;
    } else {
        allEnemies.forEach( function( enemy ) {
            enemy.unpause();
        });
        pauseState = false;
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
}

Player.prototype.getPlayChar = function(playChar) {
    var playerImages = [
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png'
        ];

    //Pick random Player.
    //var rnd = Math.floor( Math.random() * 5);
    return playerImages[playChar];
}

// Define Gem object
var Gem = function() {
    this.sprite = this.getRandomGem();

    // gems appear at random X locations and
    // on the same rows as the bugs;
    // gems won't initially appear on the bottom row with the player
    this.x = Math.floor( ( Math.random() * 404 ) + 1 );
    this.y = Math.floor( ( Math.random() * 4 ) + 1 ) * 83;

    this.scoreValue = 1;
}

Gem.prototype.render = function() {
    ctx.drawImage( Resources.get( this.sprite ), this.x, this.y );
}

Gem.prototype.reset = function() {
    this.x = Math.floor( ( Math.random() * 404 ) + 1 );
    this.y = Math.floor( ( Math.random() * 4 ) + 1 ) * 83;
    this.sprite = this.getRandomGem();
}

Gem.prototype.getRandomGem = function() {
    var gemImages = [
        'images/Gem Blue.png',
        'images/Gem Green.png',
        'images/Gem Orange.png'
        ];

    //Pick random Gem.
    var rnd = Math.floor( Math.random() * 3);
    return gemImages[rnd];
}


// Define Rock Object
var Rock = function() {
    this.allowRock = "rock";
    this.sprite = this.getRandomRock();

    // Rock appear at random X locations and
    // on the same rows as the bugs;
    // Rock won't initially appear on the bottom row with the player
    this.x = Math.floor( ( Math.random() * 404 ) + 1 );
    this.y = Math.floor( ( Math.random() * 4 ) + 1 ) * 83;

}

Rock.prototype.render = function() {
    ctx.drawImage( Resources.get( this.sprite ), this.x, this.y );
}

Rock.prototype.reset = function() {
    this.x = Math.floor( ( Math.random() * 404 ) + 1 );
    this.y = Math.floor( ( Math.random() * 4 ) + 1 ) * 83;
    this.sprite = this.getRandomRock();
}

Rock.prototype.getRandomRock = function() {
    var rockImages = [
        'images/Rock.png'
        ];

    return rockImages[0];
}

function changePlayer(playChar) {
    player.playChar = playChar;
    player.sprite = player.getPlayChar(playChar);
}

function changeRockMode(allowRock) {
    rock.allowRock = allowRock;
    if (allowRock == "norock") { // if no rock, just move it offscreen so nothing will collide with it
        rock.x = -500;
        rock.y = -500;
    } else { // if rock, just restore it back onscreen
        rock.x = Math.floor( ( Math.random() * 404 ) + 1 );
        rock.y = Math.floor( ( Math.random() * 4 ) + 1 ) * 83;
    }

}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var numOfEnemies = 5;
var allEnemies = [];
for (var i=0; i<numOfEnemies; i++) {
  allEnemies.push( new Enemy(i) );
}
var player = new Player();
var gem = new Gem();
var rock = new Rock();
var pauseState = false;

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        112: 'pause',
        80: 'pause'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
