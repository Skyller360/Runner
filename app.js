//  CREATE GAME ENVIRONMENT

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });


//  BEFORE LOADING THE GAME

function preload() {
    // LOAD THE MAIN CHARACTER SPRITE
    game.load.spritesheet('dude', 'assets/metalslug/arab.png', 52.4, 64);

    // LOAD BACKGROUND & ENVIRONMENT SPRITE
    game.load.image('background', 'assets/metalslug/back.png');
    game.load.image('rock', 'assets/metalslug/rock.png');
    game.load.image('platform', 'assets/metalslug/platform.png');
    game.load.image('resetButton', 'assets/metalslug/resetButton.png');
}

// SETTING VARIABLES

var player;
var facing = 'right';
var jumpTimer = 0;
var rocks = [];
var platforms = [];
var cursors;
var jumpButton;
var bg;

// SETTING THE ENVIRONMENT 
function create() {
    // SET THE BG COLOR, SET PHYSICS TO ARCADE
    game.stage.backgroundColor = '#99c1d6';
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.time.desiredFps = 30;

    // ADD BACKGROUND IMAGE
    bg = game.add.tileSprite(0, 0, 7667, 600, 'background');
    game.world.setBounds(0, 0, 7667, 600);

    game.physics.arcade.gravity.y = 800;

    // ADD CHARACTER SPRITE
    player = game.add.sprite(52.4, 64, 'dude');
    game.physics.enable(player, Phaser.Physics.ARCADE);

    // SET CHARACTER SIZE AND SETTINGS
    player.body.bounce.y = 0;
    player.body.collideWorldBounds = true;
    player.body.setSize(48, 54, 5, 16);
    player.scale.setTo(2, 2);

    // ANIMATE CHARACTER
    player.animations.add('right', [4, 3, 2, 1, 0], 10, true);

    // LISTEN TO KEYBOARD INPUT
    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    // LOCK CAMERA TO CHARACTER
    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON);


    // CREATE ROCKS AND PLATFORMS
    createRock(30, rocks);
    createPlatform(10, platforms);

}

function update() {

    // AUTOMATICALLY RUN TO THE RIGHT
    player.body.velocity.x = 350;
    player.animations.play('right');

    // ADD PHYSICS COLLISION TO ROCKS AND PLATFORMS
    for (var i = 0; i < rocks.length; i++) {
        game.physics.arcade.overlap(player, rocks[i], collisionHandler, null, this);
    }

    for (var i = 0; i < platforms.length; i++) {
    	game.physics.arcade.overlap(player, platforms[i], platformHandler, null, this);
    }

    // DEV FUNCTION
    // if (cursors.left.isDown)
    // {
    //     player.body.velocity.x = -150;

    //     if (facing != 'left')
    //     {
    //         player.animations.play('left');
    //         facing = 'left';
    //     }
    // }
    // else if (cursors.right.isDown)
    // {
    //     player.body.velocity.x += 50;

    //     if (facing != 'right')
    //     {
    //         player.animations.play('right');
    //         facing = 'right';
    //     }
    // }

    // JUMP FUNCTION - TIMEOUT TO FALL FASTER
    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
    {
        player.body.velocity.y = -900;
      	setTimeout(function() {player.body.velocity.y = 200;}, 450);
        jumpTimer = game.time.now + 750;
    }

}

function render () {
    // game.debug.text(game.time.suggestedFps, 32, 32);
    // game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(player);
    // game.debug.bodyInfo(player, 16, 24);
}


// WHEN CHARACTER HITS ROCK, BG CHANGE COLOR AND CHARACTER DIE
function collisionHandler (player, rock) {

    game.stage.backgroundColor = '#992d2d';
    
    // DISABLE MULTIPLE COLLISION
    player.body.velocity.x = 0;
    player.body.enable = false;
    rock.body.enable = false;
    player.animations.stop();

    // DISPLAY RESET BUTTON
    button = game.add.button(player.x, 300, 'resetButton', reset, this, 2, 1, 0);

}


// WHEN CHARACTER HITS PLATFORM, JUMP HIGHER
function platformHandler(player, platform) {
    player.animations.stop();
    player.body.velocity.y = -600;
}

function reset() {

    game.stage.backgroundColor = '#99c1d6';
    
    // ENABLE COLLISION
    player.body.enable = true;
    rock.body.enable = true;

    // DESTROY RESET BUTTON
    button.destroy();

    // KILL ROCK AND PLATFORMS FROM THE STAGE
     for (var i = 0; i < rocks.length; i++) {
        rocks[i].destroy();
    }
    rocks = [];    
    for (var i = 0; i < platforms.length; i++) {
        platforms[i].destroy();
    }

    platforms = [];
    

    // CREATE ROCKS AND PLATFORMS
    createRock(30, rocks);
    createPlatform(10, platforms);

    // REPLACE THE PLAYER TO THE BEGINNING OF THE STAGE
    player.x = 0;
}


// CREATE ROCKS AT RANDOM PLACES BUT ON THE BOTTOM OF THE STAGE
function createRock(nbr, rocks) {

    var offset = 100;
    for (var i = 0; i < nbr; i++) {
        
        var rnd1 = game.rnd.realInRange(700, 3000);
        var rnd2 = game.rnd.realInRange(3010, 5000);
        var rnd3 = game.rnd.realInRange(5010, 7000);

        // DISPERSE ROCKS
        
        if (rocks.length <= 10) {
            rock = game.add.sprite((rnd1 + offset), 600, 'rock');    
        } else if(rocks.length > 10 && rocks.length <= 20){
            rock = game.add.sprite((rnd2 + offset), 600, 'rock');    
        } else{
            rock = game.add.sprite((rnd3 + offset), 600, 'rock');    
        }

        rock.name = 'rock';
        game.physics.enable(rock, Phaser.Physics.ARCADE);
        rock.body.collideWorldBounds = true;
        rocks.push(rock);
    }   
}


// CREATE PLATFORMS AT RANDOM PLACES X BUT BETWEEN 500 AND 350 Y
function createPlatform(nbr, platforms) {

   var offset = 100;

    for (var i = 0; i < nbr; i++) {

        var rndY = game.rnd.realInRange(500, 350);

        var rnd1 = game.rnd.realInRange(700, 3000);
        var rnd2 = game.rnd.realInRange(3010, 5000);
        var rnd3 = game.rnd.realInRange(5010, 7000);

        // DISPERSE PLATFORMS 

        if (platforms.length <= 3) {
            platform = game.add.sprite((rnd1 + offset), rndY, 'platform');    
        } else if(platforms.length > 6 && platforms.length <= 8){
            platform = game.add.sprite((rnd2 + offset), rndY, 'platform');    
        } else{
            platform = game.add.sprite((rnd3 + offset), rndY, 'platform');    
        }

        platform.name = 'platform';
        game.physics.enable(platform, Phaser.Physics.ARCADE);
        platform.body.immovable = true;
        platform.body.gravity = 0;
        platform.body.setSize(70, 10, 0, 0);     
        platforms.push(platform);   
    }
}