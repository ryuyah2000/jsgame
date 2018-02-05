// player variable
var players = [];


// weapons variable
var weapons = [];


// mouse coords
var mousex = 0;
var mousey = 0;
var lclick = false;
var rclick = false;


// starts game
function start() {
	//initialize();
	gameArea.start();
	players[0] = new player(0, 0, 32, 32, 100, 1);

	players[1] = new player(300, 200, 64, 64, 100, 0);

	weapons[0] = new weapon(0, 0, 0, 0, 0, "");
	weapons[1] = new weapon(3, 10, 100, 5, 15, "");
	//setInterval(updateGame, 10);
}


// game area
var gameArea = {
	// get a reference to the canvas on-screen
	canvas: document.getElementById("c"),


	// create a backbuffer to prerender objects
	m_canvas: document.createElement("canvas"),


	// function to start
	start: function() {
		// set the backbuffer's size
		this.m_canvas.width = this.canvas.width;
		this.m_canvas.height = this.canvas.height;

		// get a graphics context
		this.context = this.canvas.getContext("2d");
		this.m_context = this.m_canvas.getContext("2d");

		// update the game 100 times per second (100 fps)
		this.interval = setInterval(updateGame, 10);

		// array of keycodes
		this.keys = [];
		this.keys.length = 255;

		// set font
		this.m_context.font = "100px Consolas";
		this.context.font = "100px Consolas";

		// start listening to resize events and resize the game appropriately
		window.addEventListener("resize", function() {
			gameArea.canvas.width = window.innerWidth;
			gameArea.m_canvas.width = window.innerWidth;
			gameArea.canvas.height = window.innerHeight;
			gameArea.m_canvas.height = window.innerHeight;
		}, false);


		// start listening to mouse move events
		window.addEventListener("mousemove", function(e) {
			mousex = e.clientX;
			mousey = e.clientY;
		});


		// listen to mouse down events
		window.addEventListener("mousedown", function(e) {
			if (e.button == 0) {
				lclick = true;
			} else if (e.button == 1) {
				rclick = true;
			}
		});


		// listen to mouse up events
		window.addEventListener("mouseup", function(e) {
			if (e.button == 0) {
				lclick = false;
			} else if (e.button == 1) {
				rclick = false;
			}
		});

		// resize canvas
		gameArea.canvas.width = window.innerWidth;
		gameArea.m_canvas.width = window.innerWidth;
		gameArea.canvas.height = window.innerHeight;
		gameArea.m_canvas.height = window.innerHeight;

		// listen to key down events
		window.addEventListener("keydown", function(e) {
			//gameArea.keys = (gameArea.keys || []);
			gameArea.keys[e.keyCode] = true;
		});

		// listen to key up events
		window.addEventListener("keyup", function(e) {
			gameArea.keys[e.keyCode] = false;
		});
	}
}


function DegToRad(degrees) {
	return degrees * Math.PI / 180.0;
}


// draw hud
function drawHUD() {
	gameArea.m_context.fillText(`HP: ${players[0].hp} / ${players[0].hp}`, gameArea.canvas.width - 200, 20);
	gameArea.m_context.fillRect(gameArea.canvas.width - 160, 20, 150 * (1.0 * players[0].hp / players[0].maxhp), 20)
}


// creates a player
function player(x, y, w, h, hp, wep) {
	// stats
	this.maxhp = hp;
	this.hp = this.maxhp;

	// equipment
	this.weapon = wep;

	// position
	this.x = x;
	this.y = y;
	// size of player on-screen
	this.width = w;
	this.height = h;

	// movement direction and speed
	this.angle = 0;
	this.vel = 0;
	this.speed = 3;

	this.bullets = [];
	//this.bullets.size = 10;

	this.update = function() {
		gameArea.m_context.fillRect(this.x - (this.width / 2), this.y - (this.height / 2), this.width, this.height);
	}
}


// creates a projectile
function projectile(x, y, vel, angle, lifetime, img, w, h, dmg, wavy) {
	// position
	this.x = x;
	this.y = y;

	// velocity
	this.vel = vel;
	this.angle = angle;
	this.life = 0;
	this.lifetime = lifetime;

	// image of bullet
	this.img = new Image();
	this.img.src = img;

	// size of bullet on-screen
	this.width = w;
	this.height = h;

	// bullet damage
	this.damage = dmg;

	// is the bullet wavy?
	this.wavy = wavy;
	this.wavecount = 0;

	this.update = function() {
		if (this.life <= this.lifetime) {
			gameArea.m_context.fillRect(this.x - (this.width / 2), this.y - (this.height / 2), this.width, this.height);
			this.life += 10;
			this.x += Math.cos(this.angle) * this.vel;
			this.y += Math.sin(this.angle) * this.vel;
		}
		//gameArea.m_context.drawImage(this.img, this.x - (this.width / 2), this.y - (this.height / 2), this.width, this.height);
	}
}


// creates a weapon
function weapon(shots, angle, rof, mindmg, maxdmg, img) {
	// number of shots fired at once
	this.shots = shots;

	// angular space between each shot
	this.angle = angle;

	// how fast the weapon shoots
	this.rateOfFire = rof;

	// damage range
	this.mindmg = mindmg;
	this.maxdmg = maxdmg;

	// image of bullet
	this.image = new Image();
	this.image.src = img;
}


// shoots weapon
function shoot(wep) {
	var angle;

	// shoot each weapon shot
	for (var i = 0; i < weapons[wep].shots; ++i) {
		angle = Math.atan2(mousey - players[0].y, mousex - players[0].x);

		// account for the angle
		angle += DegToRad(i * weapons[wep].angle - (weapons[wep].angle * (weapons[wep].shots - 1) / 2));

		players[0].bullets.push(new projectile(players[0].x, players[0].y, 8, angle, 800, "bullet.gif", 5, 5, 5, true));
	}
}

function movePlayer() {
	// change angle
	players[0].vel = players[0].speed;
	if (gameArea.keys[87]) {
		if (gameArea.keys[68]) {
			// W and D key pressed
			players[0].angle = 315;
		} else if (gameArea.keys[65]) {
			// W and A key pressed
			players[0].angle = 225;
		} else {
			// W key pressed
			players[0].angle = 270;
		}
	} else if (gameArea.keys[83]) {
		if (gameArea.keys[68]) {
			// S and D key pressed
			players[0].angle = 45;
		} else if (gameArea.keys[65]) {
			// S and A key pressed
			players[0].angle = 135;
		} else {
			// S key pressed
			players[0].angle = 90;
		}
	} else {
		if (gameArea.keys[68]) {
			// D key pressed
			players[0].angle = 0;
		} else if (gameArea.keys[65]) {
			// A key pressed
			players[0].angle = 180;
		} else {
			// no key pressed
			players[0].vel = 0;
		}
	}
}


function updateGame() {
	// update and redraw players
	gameArea.m_context.clearRect(0, 0, gameArea.canvas.width, gameArea.canvas.height);

	movePlayer();

	if (lclick) {
		shoot(players[0].weapon);
	}

	for (var i = 0; i < players.length; i++) {
		players[i].x += Math.cos(DegToRad(players[i].angle)) * players[i].vel;
		players[i].y += Math.sin(DegToRad(players[i].angle)) * players[i].vel;

		players[i].update();
		for (var j = 0; j < players[i].bullets.length; j++) {
			players[i].bullets[j].update();
			if (players[i].bullets[j].life >= players[i].bullets[j].lifetime) {
				players[i].bullets.splice(j, 1);
			}
		}
	}

	drawHUD();

	gameArea.context.clearRect(0, 0, gameArea.canvas.width, gameArea.canvas.height);
	gameArea.context.drawImage(gameArea.m_canvas, 0, 0);
}


