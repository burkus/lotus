var canvas, sound, analyzer, filter, fft, filterFreq, filterRes,
    circles, max, drawBg, maxHue, maxSat, maxB, maxA, bkColor, lines,
    drawStroke, slider, minRadius, maxRadius, maxOutset, minOutset;

function preload() {
    analyzer = new p5.Amplitude();
    fft = new p5.FFT();
}

function setup() {
    noCursor();
    canvas = createCanvas(windowWidth, windowHeight).parent('container');
    maxHue = 360;
    maxSat = 100;
    maxB = 100;
    maxA = 1;
    colorMode(HSB, maxHue, maxSat, maxB, maxA);
    blendMode(REPLACE);
    //
    circles = populateCircles(300);
    max = 250;
    //
    drawBg = true;
    bkColor = 0;
    drawStroke = false;
    slider = new Slider(13, height - 50);
    minRadius = 5;
    maxRadius = 15;
    maxOutset = height - 250;
    minOutset = -200;
}

function draw() {
  background(bkColor, 0, 0, 0);

    if(sound && sound.isPlaying()) {
        var spectrum = fft.analyze();
        var vol = analyzer.getLevel();

        var i;
        for(i = 0; i < circles.length; i++) {
            var circle = circles[i];
            circle.step(vol, spectrum[spectrum.length % i]);
            circle.draw();
        }
      }
}

function Circle(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = { hue: 145, sat: 0, b: 0, a: 1 };
}

Circle.prototype.draw = function() {
    fill(this.color.hue, this.color.sat, this.color.b, this.color.a);
    ellipse(this.x, this.y, this.radius, this.radius);
};

Circle.prototype.step = function(vol, freq) {
    this.radius = constrain(freq * vol, minRadius, maxRadius);
    this.color.hue = map(freq, 0, 255, 25, maxHue);
    this.color.sat = map(freq, 0, 255, 55, maxSat);
    this.color.b = map(freq, 0, 255, 45, maxB);
    this.color.a = map(freq, 0, 255, 75, maxA);

    this.y = height / 2 + sin(map(freq, 0, 255, 0, 360))
            * constrain(freq * vol * 5, minOutset, maxOutset);
    this.x = width / 2 + cos(map(freq, 0, 255, 0, 360))
            * constrain(freq * vol * 5, minOutset, maxOutset);
};

function populateCircles(num) {
    var circles = [];
    var i;
    for(i = 0; i < num; i++) {
        var circle = new Circle(random(100, width - 100),
                                random(100, height - 100),
                                50, 50);
        circles.push(circle);
    }
    return circles;
}

function volume(sound, level) {
    var volume = map(level, 0, width, 0, 1);
    volume = constrain(volume, 0, 1);
    sound.amp(volume);
}

function playbackRate(sound, rate) {
    var speed = map(rate, 0.1, 100, 0.1, 2);
    sound.rate(speed);
}

function keyPressed() {
    if(keyCode === RETURN || keyCode === ENTER) {
        if(sound) {
            if(sound.isPlaying()) {
                sound.pause();
            } else if(sound.isPaused()) {
                sound.play();
            } else {
                sound.stop();
                sound.play();
            }
        }
    } else if(keyCode === CONTROL) {
        drawStroke = !drawStroke;
    } else if(keyCode === ALT) {
        drawBg = !drawBg;
    }
}

window.onresize = function() {
  var w = window.innerWidth;
  var h = window.innerHeight;
  canvas.resize(w, h);
  width = w;
  height = h;
};

function handleFiles(files) {
    var file = files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
        var data = e.target.result;
        sound = loadSound(data);
        //sound.connect(filter);
        // fft.setInput(filter);
        fft.setInput(sound);
        analyzer.setInput(sound);
    }
    reader.readAsDataURL(file);
  }
