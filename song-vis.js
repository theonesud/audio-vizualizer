let song;
let fft;
// let particles = []
let fftsize = 1024;
let bands = 5;
let amplify = 250;
let smoother = 0.2;
let stroke_col = 0;
let stroke_weight = 3;
let band_ranges = [];

function preload() {
  song = loadSound("Led Zeppelin - Kashmir.mp3");
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
function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  colorMode(HSB, 100);
  // frameRate(1)
  //   song.play();
  //   smooth();
  fft = new p5.FFT(1, fftsize);
  for (let i = 0; i < bands; i++) {
    band_ranges.push(floor(fftsize / (i + 1)));
  }
  band_ranges.push(0)
}

class Particle {
  constructor(init_r, color, ballsize, coloe) {
    this.pos = p5.Vector.random2D().mult(init_r);
    this.vel = createVector(0, 0);
    this.acc = this.pos.copy().mult(random(0.0001, 0.00001));
    this.w = ballsize;
    this.color = color;
    this.coloe = coloe;
  }
  show() {
    noStroke();
    // console.log(this.color)
    colorMode(HSB, 100);
    fill(20 * this.coloe + 1, 100, 20 * (5 - this.coloe), 60);
    ellipse(this.pos.x, this.pos.y, this.w);
  }
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
  }
  edges() {
    if (
      this.pos.x < -width / 2 ||
      this.pos.x > width / 2 ||
      this.pos.y > height / 2 ||
      this.pos.y < -height / 2
    ) {
      return true;
    } else {
      return false;
    }
  }
}

function draw_circle(wave, spectrum, t, band_no) {
  // stroke(20*coloe+1, 100, 100);
  // console.log(wave, spectrum, t, band_no)
  stroke((100 * (band_no - 1)) / band_no, 100, 50);
  beginShape();
  // fill(100 * band_no / 255, 100, 100, 50)
  let selected_freq = floor(spectrum.length / (band_no + 1));
  for (let i = 0; i <= 180; i += 0.5) {
    let index = floor(map(i, 0, 180, 0, wave.length - 1));
    // console.log(selected_freq, index, fft.getEnergy(selected_freq))
    // console.log(selected_freq, wave.length)
    //   console.log(wave[selected_freq], -1, 1, width / 3, height / 3)
    var r1 = map(wave[selected_freq], -1, 1, width / 3, height / 3);
    var r2 = map(wave[index], -1, 1, width / 3, height / 3);
    var r = (r1 + r2) / 2;
    // console.log('>>>>>>>>', r)
    let x = r * sin(i) * t;
    let y = r * cos(i);
    vertex(x, y);
  }
  endShape();

  // console.log(20*(coloe+1))
  // var p = new Particle(r, 100/(20*(coloe+1)))
  // var p = new Particle(r, 20*(5-coloe), (coloe+2.5)*2, coloe)
  // particles.push(p)
}

function draw_wave(rank, wave, stroke_col, stroke_weight) {
  stroke(stroke_col);
  strokeWeight(stroke_weight);
  let min_r = min(width, height) / 3;
  let max_r = min(width, height) / 2;
  // noFill()
  for (let t = -1; t <= 1; t += 2) {
    beginShape();
    for (let i = 0; i <= 180; i++) {
      var index = floor(map(i, 0, 180, 0, wave.length - 1));
      let metric = wave[index];
      // let metric = fft.getEnergy(band_ranges[rank])/255
      var r = map(metric, -1, 1, min_r, max_r);
      r = lerp(r, metric * amplify, smoother);

      // energy = fft.getEnergy(band_ranges[rank])
      // map(, -1, 1, min_r, max_r)
      // r = r*1 + energy*100

      var x = r * sin(i) * t;
      var y = r * cos(i);
      vertex(x + width / 2, y + height / 2);

      //   var x = i;
      //   var y = 0;
      //   y = lerp(y, metric * amplify, smoother) + height / 2;
      //   vertex(x, y);
    }
    endShape();
}

}



function draw() {
  background(255);
  let spectrum = fft.analyze();
  let wave = fft.waveform(); // waveform is a fftsize long array. values from -1 to 1
  // console.log(band_ranges, );




  // console.log(wave.length, spectrum.length)
  // if (fft.getEnergy("bass") > 0) {
  //   console.log("true");
  // } else {
  //   console.log(".");
  // }

  // for (let i = 0; i < fftsize; i = i + fftsize / (bands + 1)) {
  //   if (floor(i) != 0 && floor(i) != fftsize - 1) {
  //     selected_freq = floor(i);
  //     // console.log(selected_freq)
  //     rank = selected_freq / fftsize;
  //   }
  // }
  for (let i = 0; i < bands; i++) {
    draw_wave(i, wave, stroke_col, stroke_weight);
  }
}
