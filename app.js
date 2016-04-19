var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.spritesheet('dude', 'assets/metalslug/arab.png', 52.4, 64);
    game.load.image('background', 'assets/metalslug/back.png');
    game.load.image('rock', 'assets/metalslug/rock.png');
    game.load.image('platform', 'assets/metalslug/platform.png');
}

var player;
var facing = 'right';
var jumpTimer = 0;
var rocks = [];
var cursors;
var jumpButton;
var bg;

function create() {
    game.stage.backgroundColor = '#79CCC9';
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.time.desiredFps = 30;

    bg = game.add.tileSprite(0, 0, 7667, 600, 'background');
    game.world.setBounds(0, 0, 7667, 600);

    game.physics.arcade.gravity.y = 800;

    player = game.add.sprite(52.4, 64, 'dude');
    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.bounce.y = 0;
    player.body.collideWorldBounds = true;
    player.body.setSize(48, 54, 5, 16);
    player.scale.setTo(2, 2);

    player.animations.add('right', [4, 3, 2, 1, 0], 10, true);


    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON);
    game.physics.enable(player, Phaser.Physics.ARCADE);

    for (var i = 0; i < 10; i++) {
    	var rnd = game.rnd.realInRange(700, 7000);
    	rock = game.add.sprite(rnd, 600, 'rock');
	    rock.name = 'rock';
	    game.physics.enable(rock, Phaser.Physics.ARCADE);
	    rock.body.collideWorldBounds = true;
	    rock.body.checkCollision.up = false;
	    rocks.push(rock);
    }



    platform = game.add.sprite(300, 400, 'platform');
    // console.log(rnd);
    platform.name = 'platform';
    game.physics.enable(platform, Phaser.Physics.ARCADE);
    console.log(platform);
    platform.body.collideWorldBounds = true;
	platform.body.immovable = true;
	platform.body.gravity = 0;
	platform.body.setSize(70, 10, 0, 0);

	 platform2 = game.add.sprite(1200, 500, 'platform');
    // console.log(rnd);
    platform2.name = 'platform';
    game.physics.enable(platform2, Phaser.Physics.ARCADE);
    console.log(platform);
    platform2.body.collideWorldBounds = true;
	platform2.body.immovable = true;
	platform2.body.gravity = 0;
	platform2.body.setSize(70, 10, 0, 0);

}

function update() {

    player.body.velocity.x = 500;
    player.animations.play('right');

    game.world.wrap(player, 0, true);

    for (var i = 0; i < rocks.length; i++) {
    	game.physics.arcade.overlap(player, rocks[i], collisionHandler, null, this);
    }

    game.physics.arcade.overlap(player, platform, platformHandler, null, this);
    game.physics.arcade.overlap(player, platform2, platformHandler, null, this);

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;

        if (facing != 'left')
        {
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x += 50;

        if (facing != 'right')
        {
            player.animations.play('right');
            facing = 'right';
        }
    }

    
    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
    {
        player.body.velocity.y = -700;
      	setTimeout(function() {player.body.velocity.y = 300;}, 400);
        jumpTimer = game.time.now + 750;
    }

}

function render () {

    // game.debug.text(game.time.suggestedFps, 32, 32);


    // game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(player);
    // game.debug.bodyInfo(player, 16, 24);

}

function collisionHandler (player) {

    player.body.velocity.x = 0;
    // player.y = 0;
    // player.y = rocks[0].y - 150;
    player.kill();
    game.stage.backgroundColor = '#992d2d';
}

function platformHandler(player) {
	
	player.body.velocity.x = 0;
	player.y = (platform.y / 2) + 50;
	// player.body.velocity.y = 0;
	// player.x = platform.x;
    player.animations.stop();
    player.body.velocity.y = -600;


	
}