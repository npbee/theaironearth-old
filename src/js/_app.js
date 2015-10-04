var audio = window.audio = document.getElementById('audioEl');
var context = new AudioContext();
var analyser = context.createAnalyser();
var source = context.createMediaElementSource(audio);
source.connect(analyser);

var canvas = document.getElementById('visualizer');
//canvas.width = '100%';
//canvas.height = '100%';

analyser.connect(context.destination);

var freqByteData = new Uint8Array(analyser.frequencyBinCount);
var canvas = document.getElementById('visualizer');
var xOffset = 1.5;
var yOffset = 2;
var bars = 256;
var ampVal = 8;

paper.setup(canvas);
paper.view.fillColor = 'rgb(255,255,233)';

var path = new paper.Path();
path.closed = true;
path.strokeColor = '#444444';
path.strokeWidth = 1;
var totalWidth = paper.view.size.width;
var totalHeight = paper.view.size.height;
var xPos = totalWidth / xOffset;
var yPos = totalHeight / yOffset;
var baseAngle = 0;
var changeAngleSpeed = 0.0001618;
var baseRadius = -32;
var radiusAmp = 1;
var colorAmp = 0.66;
var hue = 42;


// points
var i, point, x, y;
var results = [];

for (i = 0; i < bars; i +=1) {
    x = Math.floor(Math.cos(0 * i) * -32);
    y = Math.floor(Math.sin(0 * i) * -32);
    point = new paper.Point(xPos + x, yPos + y);
    results.push(path.add(point));
}

paper.view.draw();

function signalEffects(signal) {
    var p;

    baseAngle += changeAngleSpeed;

    p = signal * colorAmp;

    var overlay = document.getElementById('overlay');
    overlay.style.backgroundColor = 'hsla(' + hue + ',25%, ' + p + '%, 0.8)';

    return baseRadius = signal * radiusAmp;
}

function shader(value) {
    var i, magnitude, dot, p;

    p = value.reduce(function(memo, num) {
        return memo + num;
    });
    p = Math.round(((p / 1024) / 255) * 100);
    signalEffects(p);

    for (i = 0; i < bars; i += 1) {
        magnitude = value[i] * (0.2 * (ampVal / 20));
        x = Math.floor(Math.cos(baseAngle * i) * (baseRadius * magnitude) + xPos);
        y = Math.floor(Math.sin(baseAngle * i) * (baseRadius * magnitude) + yPos);
        dot = path.segments[(path.segments.length - 1) - i];
        dot.point.x = x;
        dot.point.y = y;
    }

    path.smooth();

    paper.view.draw();
}

var changer;
var dir;
function hueChanger() {

    if (dir == 'up') {
        hue = hue + 1;
    } else if (dir == 'down') {
        hue = hue - 1;
    }

    if (hue > 250) {
        dir = 'down';
    } else if (hue < 250) {
        dir = 'up';
    }

    setTimeout(hueChanger, 200);
}

function render() {
    requestAnimationFrame(render);
    analyser.getByteFrequencyData(freqByteData);
    //setTimeout(render, 1000);
    return shader(freqByteData);
}


//render();
//hueChanger();
//audio.play();


