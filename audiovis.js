let song;
let fft;
let fftsize = 1024;
let bands = 10;
let amplify = 250;
let smoother = 0.2;
let stroke_col = 0;
let stroke_weight = 3;
let band_ranges = [];

function preload() {
  song = loadSound("Led Zeppelin - Kashmir.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  // song.play();
  fft = new p5.FFT();
  for (let i = 0; i < bands; i++) {
    band_ranges.push(i*floor(fftsize/bands));
  }
  band_ranges.push(fftsize)
  console.log(band_ranges)
}

function draw_circle(wave, rank, t) {
  let min_r = 0;
  let max_r = min(width, height) / 2.25;
  // for (let t = -1; t <= 1; t += 2) {
  //   beginShape();
  //   for (let i = 0; i <= 180; i++) {
  //     var index = floor(map(i, 0, 180, 0, wave.length - 1));
  //     let metric = wave[index];
  //     var r = map(metric, -1, 1, min_r, max_r);
  //     r = lerp(r, metric * amplify, smoother);
  //     var x = r * sin(i) * t;
  //     var y = r * cos(i);
  //     vertex(x + width / 2, y + height / 2);
  //   }
  //   endShape();
  // stroke(stroke_val);
    beginShape();
    for (let i = 0; i <= 180; i += 0.5) {
      let index = floor(map(i, 0, 180, 0, wave.length - 1));
      // console.log(band_ranges[rank], band_ranges[rank+1])
      let r = map(fft.getEnergy(band_ranges[rank]+1, band_ranges[rank + 1]) / 255, -1, 1, min_r, max_r);
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
  for (let i = 0; i < bands; i++) {
    for (let t = -1; t <= 1; t += 2) {
      draw_circle(wave, i, t)
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
