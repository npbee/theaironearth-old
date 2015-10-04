import range from 'lodash/utility/range';

const POINTS = 256;
const INIT_POINTS = 50;
const amplitude = 5;
const ANGLE = 10;
const RADIUS = 1;
const COLOR_AMP = 0.4;

function generatePoints(data, path, radius) {
    path.segments = path.segments.map((segment, i) => {
        let xPos = paper.view.size.width / 2;
        let yPos = paper.view.size.height / 2;
        let magnitude = data[i] * (0.2 * (amplitude / 20));
        let x = radius * Math.cos(radius * magnitude) + xPos;
        let y = radius * Math.sin(radius * magnitude) + yPos;

        segment.point.x = x;
        segment.point.y = y;


        return segment;
    });

    let sum = data.slice(0, data.length).reduce((a, b) => a + b);
    let rounded = Math.round((sum / 1024) / 255 * 100);
    let neg = Math.random() < 0.5 ? -1 : 1;
    let colorAmp = neg * rounded * COLOR_AMP;

    path.strokeColor = `hsla(${3 + colorAmp}, ${33 + colorAmp}%, 67%, 0.8)`;

    paper.view.draw();

}

function render(player, store, analyser, freqByteData, path, radius) {

    let r = (radius || RADIUS);

    r = r > 300 ? r -= 0.05 : r += 0.05;

    requestAnimationFrame(render.bind(null, player, store, analyser, freqByteData, path, r));
    //setInterval(() => render(player, store, analyser, freqByteData, path, r), 1000);
    analyser.getByteFrequencyData(freqByteData);

    return generatePoints(freqByteData, path, r);
}

function initPath(totalWidth, totalHeight) {

    let path = new paper.Path();

    path.closed = false;
    //path.strokeColor = 'rgba(234, 198, 198, 0.5)';
    //path.strokeColor = `hsla(3, 39%, 67%, 0.5)`;
    path.strokeWidth = 1;

    let points = range(POINTS).map((i) => {
        let radius = RADIUS;
        let magnitude = i * (0.2 * (amplitude / 20));
        let x = radius * Math.cos(RADIUS * magnitude * i) + totalWidth / 2;
        let y = radius * Math.sin(RADIUS * magnitude * i) + totalHeight / 2;

        return new paper.Point(x, y);
    }).map(point => {
        return path.add(point)
    });

    return path;
}

function initPaper(canvas) {
    paper.setup(canvas);
    paper.view.fillColor = 'rgb(255, 255,233)';

    return initPath(paper.view.size.width, paper.view.size.height);
}

export default function createVisualizer(player, store) {
    const audio = player.audio;
    audio.crossOrigin = 'anonymous';
    const context = new AudioContext();
    const analyser = context.createAnalyser();
    const source = context.createMediaElementSource(audio);
    const canvas = document.getElementById('visualizer');
    const freqByteData = new Uint8Array(analyser.frequencyBinCount);

    source.connect(analyser);
    analyser.connect(context.destination);

    const path = initPaper(canvas);

    paper.view.draw();

    const dispose = store.subscribe(() => {
        let state = store.getState();

        if (state.isPlaying) {
            render(player, store, analyser, freqByteData, path);

            // Just listen for the first play and cancel the subscription
            // after that.
            dispose();
        }
    });

}
