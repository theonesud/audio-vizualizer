let song;
let fft;
let particles = []

function preload() {
  song = loadSound("money.mp3");

}
function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  song.play();
  fft = new p5.FFT(1,2048);
	colorMode(HSB, 100);

}

class Particle{
	constructor(init_r, color, ballsize, coloe){
		this.pos = p5.Vector.random2D().mult(init_r)
		this.vel = createVector(0,0)
		this.acc = this.pos.copy().mult(random(0.0001,0.00001))
		this.w = ballsize
		this.color = color
		this.coloe = coloe
	}
	show(){
		noStroke()
		// console.log(this.color)
		colorMode(HSB, 100);
		fill(20*this.coloe+1, 100, 20*(5-this.coloe), 60)
		ellipse(this.pos.x, this.pos.y, this.w)
	}
	update(){
		this.vel.add(this.acc)
		this.pos.add(this.vel)
	}
	edges(){
		if(this.pos.x < -width/2 || this.pos.x > width/2 || this.pos.y > height/2 || this.pos.y < -height/2){
			return true
		}else{
			return false
		}
	}
}


function draw_circle(wave, energy, noise, stroke_val, t,ranc, coloe) {
		// stroke_val = 0
	// stroke(stroke_val);
		stroke(20*coloe+1, 100, 100);
    beginShape();
		// fill(20*coloe+1, 100/ranc, 100)
    for (let i = 0; i <= 180; i += 0.5) {
      let index = floor(map(i, 0, 180, 0, wave.length - 1));
      // console.log(fft.getEnergy(energy))
			var r = map(fft.getEnergy(energy)/255  + wave[index] / noise, -1, 1, 150, 350)/ranc;
      let x = r * sin(i) * t;
      let y = r * cos(i);
      vertex(x, y);
    }
    endShape();

	// console.log(20*(coloe+1))
	// var p = new Particle(r, 100/(20*(coloe+1)))
		var p = new Particle(r, 20*(5-coloe), (coloe+2.5)*2, coloe)
		particles.push(p)
}

function draw() {
  background(0);
  stroke(255);
  strokeWeight(3);
  noFill();
  fft.analyze()
  translate(width / 2, height / 2);
  let wave = fft.waveform();


	// vibrancy = [1.5,2,3,2,1]
	// vibrancy = [1,2.5,3,4,8]
	// vibrancy = [2,1.5,1.25,1.15,1]
	vibrancy = [7,5,2.5,1.15,1]


  for (let t = -1; t <= 1; t += 2) {
    draw_circle(wave, "bass", vibrancy[0], 255, t,0.5, 4)
    draw_circle(wave, "lowMid", vibrancy[1], 200, t,0.65, 3)
    draw_circle(wave, "mid", vibrancy[2], 155, t,1, 2)
    draw_circle(wave, "highMid", vibrancy[3], 100, t,1.5, 1)
    // fill(255)
		draw_circle(wave, "treble", vibrancy[4], 50, t,3, 0)
  }


	for (let i = 0; i < particles.length; i++){
		if (!particles[i].edges()){
			particles[i].update()
			particles[i].show()
		} else{
		particles.splice(i,1)
		}
	}

}

function mouseClicked() {
  if (song.isPlaying()) {
    song.pause();
    noLoop();
  } else {
    song.play();
    loop();
  }
}
