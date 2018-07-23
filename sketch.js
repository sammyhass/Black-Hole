let debris = [];
let blackwhole;

class Hole {
	constructor(grasp, pull) {
		this.grasp = grasp;
		this.pull = 9;
		this.secondary = this.grasp * 6;
		this.ext = 0;
		this.center = createVector(width/2, height/2);

		if (pull) {
			this.pull = pull;
		}
	}

	show() {
		noFill();
		stroke(255);
		strokeWeight(2);
		ellipse(this.center.x, this.center.y, this.grasp*2, this.grasp*2);
		stroke(255, 100);
		strokeWeight(1);
		ellipse(this.center.x, this.center.y, this.secondary*2, this.secondary*2);
		strokeWeight(3);
		stroke(255);
		arc(this.center.x, this.center.y, this.secondary*2, this.secondary*2, 0+this.ext, PI/6+this.ext)
	}

	update() {
		this.ext += PI/20;
	}
}

class Debris {
	constructor(x, y, w) {
		this.inOrbit = false;
		this.velocity = createVector();
		this.starting = createVector(x, y);
		this.acc = createVector(random(-1, 1), random(-1, 1));
		this.state = Math.random();
		this.alpha = 250;
		this.fading = false;
		this.pos = this.starting;
		this.w = w;
		this.done = false;
		this.center = false;
	}

	show() {
		stroke(255, this.alpha);
		strokeWeight(2);
		noFill();
		if (this.state < 0.5) {
			ellipse(this.pos.x, this.pos.y, this.w, this.w);
		} else {
			push();
			rectMode(CENTER);
			rect(this.pos.x, this.pos.y, this.w, this.w);
			pop();
		}
		
	}

	update(blackhole) {
		this.velocity.add(this.acc);
		this.pos.add(this.velocity);
		if (this.center && this.fading) {
			this.alpha -= 25;
		}
		if (!this.center) {
			let d = dist(this.pos.x, this.pos.y, blackhole.center.x, blackhole.center.y);
			if (d < blackhole.secondary) {
				this.inOrbit = true;
			} else {
				this.inOrbit = false;
			}
			if (d < blackhole.grasp) {
				this.fading = true;
				this.acc.mult(0);
				this.velocity.mult(0.001);
				this.center = true;
			}

			if (this.inOrbit) {
				let xd = this.pos.x - blackhole.center.x;
				let yd = this.pos.y - blackhole.center.y;
				this.acc = createVector(-xd, -yd);
				this.acc.setMag(0.75);
				if (sqrt(xd*xd + yd*yd) < 10) {
					this.center = true;
					this.fadiing = true;
				}
			}
			if (this.pos.x < 0 || this.pos.x > width || this.pos.y > height || this.pos.y < 0 || this.alpha === 0 ) {
				this.done = true;
			}
		}
	}
}
function setup() {
	createCanvas(900, 600);
	blackhole = new Hole(50, 5);
	background(0);
	stroke(255);
	for (let i = 0; i < 100; i++) {
		debris.push(new Debris(random(width), random(height), 5));
	}
}

function draw() {
	background(0);
	debris.push(new Debris(random(width), random(height), 5))
	for (let i = 0; i < debris.length; i++) {
		debris[i].show();
		debris[i].update(blackhole);
	}
	blackhole.show();
	blackhole.update();

}
