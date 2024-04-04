let song;
let fft;

function preload() {
  song = loadSound("Led Zeppelin - Kashmir.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  song.play();
  fft = new p5.FFT();
}

function draw_circle(wave, energy, noise, stroke_val=255, t) {
    stroke(stroke_val);
    beginShape();
    for (let i = 0; i <= 180; i += 0.5) {
      let index = floor(map(i, 0, 180, 0, wave.length - 1));
      let r = map(fft.getEnergy(energy)/255, -1, 1, 150, 350);
      let x = r * sin(i) * t;
      let y = r * cos(i);
      vertex(x, y);
    }
    endShape();
}

function draw() {
  background(0);
  stroke(255);
  strokeWeight(3);
  noFill();
  fft.analyze()
  translate(width / 2, height / 2);
  let wave = fft.waveform();
  for (let t = -1; t <= 1; t += 2) {
    draw_circle(wave, "bass", 10, 255, t)
    draw_circle(wave, "lowMid", 8.5, 200, t)
    draw_circle(wave, "mid", 6.8, 155, t)
    draw_circle(wave, "highMid", 5, 100, t)
    draw_circle(wave, "treble", 3, 50, t)
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
