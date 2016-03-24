var game = new Phaser.Game(400,490);

var mainState = {
	preload: function(){
		game.load.image('bird', 'assets/bird.png'); 
		game.load.image('pipe', 'assets/pipe.png');
		game.load.audio('jump', 'assets/jump.wav'); 
	},

	create: function(){
		game.stage.backgroundColor = '#71c5cf';
		game.physics.startSystem(Phaser.Physics.ARCADE);

		this.bird = game.add.sprite(100,245,'bird');
		game.physics.arcade.enable(this.bird);

		this.bird.body.gravity.y = 1000;
		this.bird.anchor.setTo(-0.2, 0.5);

		var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		spaceKey.onDown.add(this.jump, this);

		this.pipes = game.add.group(); 
		this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

		this.score = 0;
		this.labelScore = game.add.text(20, 20, "0",{ font: "30px Arial", fill: "#ffffff" }); 

		this.jumpSound = game.add.audio('jump');  
	},

	update: function(){
		if (this.bird.y < 0 || this.bird.y > 490){
		 	this.restartGame();
		 }

		game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this); 

		if (this.bird.angle < 20){
    		this.bird.angle += 1; 
    	}
	},

	// Make the bird jump 
	jump: function() {
		if (this.bird.alive == false)
    		return;  
	    // Add a vertical velocity to the bird
	    this.bird.body.velocity.y = -350;
	    /*
	    //this.bird.angle = -20;
	    // Create an animation on the bird
		var animation = game.add.tween(this.bird);

		// Change the angle of the bird to -20° in 100 milliseconds
		animation.to({angle: -20}, 100);

		// And start the animation
		animation.start(); 
		*/
		game.add.tween(this.bird).to({angle: -20}, 100).start(); 
		this.jumpSound.play(); 
	},

	// Restart the game
	restartGame: function() {
	    // Start the 'main' state, which restarts the game
	    game.state.start('main');
	},

	addOnePipe: function(x, y) {
	    // Create a pipe at the position x and y
	    var pipe = game.add.sprite(x, y, 'pipe');

	    // Add the pipe to our previously created group
	    this.pipes.add(pipe);

	    // Enable physics on the pipe 
	    game.physics.arcade.enable(pipe);

	    // Add velocity to the pipe to make it move left
	    pipe.body.velocity.x = -200; 

	    // Automatically kill the pipe when it's no longer visible 
	    pipe.checkWorldBounds = true;
	    pipe.outOfBoundsKill = true;
	},

	addRowOfPipes: function() {
	    // Randomly pick a number between 1 and 5
	    // This will be the hole position
	    var hole = Math.floor(Math.random() * 5) + 1;

	    // Add the 6 pipes 
	    // With one big hole at position 'hole' and 'hole + 1'
	    for (var i = 0; i < 8; i++)
	        if (i != hole && i != hole + 1) 
	            this.addOnePipe(400, i * 60 + 10); 

	    this.score += 1;
		this.labelScore.text = this.score;    
	},

	hitPipe: function() {
	    // If the bird has already hit a pipe, do nothing
	    // It means the bird is already falling off the screen
	    if (this.bird.alive == false)
	        return;

	    // Set the alive property of the bird to false
	    this.bird.alive = false;

	    // Prevent new pipes from appearing
	    game.time.events.remove(this.timer);

	    // Go through all the pipes, and stop their movement
	    this.pipes.forEach(function(p){
	        p.body.velocity.x = 0;
	    }, this);
	},	
};

game.state.add('main', mainState);

game.state.start('main');