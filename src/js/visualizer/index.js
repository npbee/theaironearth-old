import range from 'lodash/utility/range';
import generateSphere from './sphere';
import { changeBackground } from '../actions';

import config, {
    POINTS,
    RADIUS
} from './config';

function render(player, store, analyser, freqByteData, path) {

    //requestAnimationFrame(render.bind(null, player, store, analyser, freqByteData, path));
    //setInterval(() => render(player, store, analyser, freqByteData, path, r), 1000);
    let state = store.getState();
    let currentTrackIndex = state.currentTrackIndex;
    let trackConfig = config[currentTrackIndex];
    let visualizer = trackConfig.visualizer;

    store.dispatch(changeBackground({
        hue: trackConfig.hue,
        saturation: trackConfig.saturation,
        lightness: trackConfig.lightness
    }));

    let dispose = store.subscribe(() => {
        let state = store.getState();

        if (currentTrackIndex !== state.currentTrackIndex) {
            currentTrackIndex = state.currentTrackIndex;
            trackConfig = config[currentTrackIndex];
            visualizer = trackConfig.visualizer;

            store.dispatch(changeBackground({
                hue: trackConfig.hue,
                saturation: trackConfig.saturation,
                lightness: trackConfig.lightness
            }));
        }
    });

    return paper.view.onFrame = (event) => {
        analyser.getByteFrequencyData(freqByteData);

        path.segments = visualizer(freqByteData, path, RADIUS);

        paper.view.draw();
    };
}

function initPath(totalWidth, totalHeight) {

    let path = new paper.Path();

    path.closed = false;
    path.strokeWidth = 1;
    path.strokeColor = '#444444';

    range(POINTS).map(i => {
        let x = i;
        let y = 300;
        let point = new paper.Point(x, y);

        path.add(point);
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

    const dispose = store.subscribe(() => {
        let state = store.getState();

        if (state.isPlaying) {
            // Just listen for the first play and cancel the subscription
            // after that.
            dispose();

            render(player, store, analyser, freqByteData, path);
        }
    });

}
