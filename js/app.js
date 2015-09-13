/*--------- Game Constructor---------------------/
 */
var Game = function() {
    this.allEnemies = [];
    this.ended = false;
    this.player = {};
    this.star = {};
};

/*--------- endGame Function ---------------------//
 * this function is used to end the game or continue
 * after losing all the lives
 */
Game.prototype.endGame = function() {
    var r = confirm("Loooser!, Want to try it again?");
    if (r === true) {
        this.continueTheGame();
    } else {
        this.finishTheGame();
    }
};

/*--------- addEnemy Function --------------------//
 * this function is used to create a new bud Enemy
 * to add it into the allEnemies array
 */
Game.prototype.addAnEnemy = function(yRow) {
    return new Enemy(yRow, Math.random() * (500 - 100) + 100);
};

/*--------- finishTheGame Function ---------------//
 * this function is used to end the game or continue
 * after losing all the lives
 */
Game.prototype.finishTheGame = function() {
    this.allEnemies = [];
    this.ended = true;
    this.player.visible = false;
    this.star.visible = false;
    document.getElementById('lives').style.display = "none";
    document.getElementById('stars').style.display = "none";
    document.getElementsByClassName('title')[0].innerHTML = "Please Press F5 to restart the Game";
};

/*--------- continueTheGame Function -------------//
 * this function is used to end the game or continue
 * after losing all the lives
 */
Game.prototype.continueTheGame = function() {
    this.player.stars = 0;
    this.player.lives = 2;
    document.getElementsByClassName('stars')[0].innerHTML = 'Stars: ' + this.player.stars;
    document.getElementsByClassName('lives')[0].innerHTML = 'Lives: ' + this.player.lives;
    this.player.reset();
};

/*--------- start Function -----------------------//
 * this function is used to end the game or continue
 * after losing all the lives
 */
Game.prototype.start = function() {
    this.allEnemies.push(game.addAnEnemy(72));
    this.allEnemies.push(game.addAnEnemy(155));
    this.allEnemies.push(game.addAnEnemy(238));
    this.allEnemies.push(game.addAnEnemy(321));
    this.player = new Player(303, 404);
    this.star = new Star();
    this.star.reset();
};

/* ENEMY Constructor
 *
 */
var Enemy = function(y, speed) {

    this.x = -150;
    this.y = y;
    this.speed = speed;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

/*--------- update Enemy Function ----------------------//
 * Update the enemy's position, required method for game
 * Parameter: dt, a time delta between ticks
 */
Enemy.prototype.update = function(dt) {
    this.x = this.x + this.speed * dt;
    if (this.x > 750) {
        this.reset();
    }
};

/*---------render Enemy Function ----------------------//
 * Draw the enemy on the screen, required method for game
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*--------- render Enemy Function ----------------------//
 * sets the speed of the Enemy in a "random way"
 */
Enemy.prototype.randomSpeed = function() {
    this.speed = 100 * Math.floor(Math.random() * 5 + 1);
};

/*--------- reset Enemy Function ----------------------//
 * reset the enemy location and speed
 */
Enemy.prototype.reset = function() {
    this.randomSpeed();
    this.x = -150;
};



/*  PLAYER Constructor
 * this initialize all the players attributes
 */
var Player = function(x, y) {
    this.sprite = 'images/char-boy.png';

    // Give the player 3 lives to start
    this.lives = 2;
    //player location
    this.x = x;
    this.y = y;
    // has star
    this.hasStar = false;
    this.stars = 0;
    this.visible = true;

};

/* Handle keyboard input during gameplay.
 * 'IF' statements verify movement will not allow the player outside the
 * canvas boundaries before the movement is calculated.
 * @param {String} key, the keyCode from the key pressed
 */
Player.prototype.handleInput = function(key) {
    switch (key) {
        case 'up':
            if (this.y > -12) {
                this.y -= 83;
            }
            break;
        case 'down':
            if (this.y < 404) {
                this.y += 83;
            }
            break;
        case 'left':
            if (this.x > 0) {
                this.x -= 101;
            }
            break;
        case 'right':
            if (this.x < 606) {
                this.x += 101;
            }
            break;
    }

    if (this.y <= -12) {
        if (game.player.hasStar === true) {
            this.countStar();
            this.reset();
        } else {
            this.y = -11;
        }


    }
    //logging the player current position in the console
    LogPlayerPosition();
};

/* function that reset the player location
 */
Player.prototype.reset = function() {
    if (this.visible === true) {
        this.x = Math.floor(Math.random() * 5) * 101;
        this.y = 404;
    }
};

/* Function that counts the Stars
 *
 */
Player.prototype.countStar = function() {

    if (this.hasStar === true) {
        this.stars = this.stars + 1;
        document.getElementsByClassName('stars')[0].innerHTML = 'Stars: ' + this.stars;
        this.hasStar = false;
        game.star.reset();
    }
};

/* function that handle the lives when a bug kills the player
 * and then updates the player attribute and the html in the page that shows the lives
 */
Player.prototype.liveLost = function() {
    game.player.lives = game.player.lives - 1;
    document.getElementsByClassName('lives')[0].innerHTML = 'Lives: ' + game.player.lives;
};

/* function that handle the pickup functionality
 * when the player pickup a star
 *
 */
Player.prototype.pickup = function() {
    console.log("llega");
    // Set parameters for objects
    this.hasStar = true;
    // Hide item off screen (to be reused on reset)
    game.star.x = -101;
    game.star.y = -101;
    game.star.visible = false;

};

/* this fuunction render the player
 */
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/* The Star Constructor
 */
var Star = function(x, y) {
    this.sprite = 'images/Star.png';
    this.x = x;
    this.y = y;
    this.visible = true;
};

/* function that handle when the player is killed by a bug
 * and drop the star
 */
Star.prototype.drop = function() {
    this.visible = true;
    game.player.hasStar = false;
    this.x = game.player.x;
    this.y = game.player.y;
};

/* function that reset the star location and visibility
 */
Star.prototype.reset = function() {
    this.x = Math.floor(Math.random() * 5) * 101;
    this.y = Math.ceil(Math.random() * 4) * 83 - 11;
    this.visible = true;
};

/* function that draw the star in the canvas
 */
Star.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var game = new Game();
game.start();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    game.player.handleInput(allowedKeys[e.keyCode]);
});

// helper Function to log the player position and information
var LogPlayerPosition = function() {
    console.log('>>> PLAYER - X: ' + game.player.x + ' Y: ' + game.player.y +
        "number of stars that the player has " + game.player.stars +
        "log if the player has an star at the moment " + game.player.hasStar);
};