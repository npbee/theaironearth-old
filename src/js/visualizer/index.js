import range from 'lodash/utility/range';
import generateSphere from './sphere';
import { changeBackground } from '../actions';
import generateSimpleWave from './simpleWave';

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
    let strokeColor = trackConfig.strokeColor;

    store.dispatch(changeBackground({
        hue: trackConfig.hue,
        saturation: trackConfig.saturation,
        lightness: trackConfig.lightness
    }));

    function run() {
        return paper.view.onFrame = (event) => {
            analyser.getByteFrequencyData(freqByteData);

            path.segments = visualizer(freqByteData, path, paper, event);
            path.strokeColor = strokeColor;

            paper.view.draw();
        };
    }

    let dispose = store.subscribe(() => {
        let state = store.getState();

        if (currentTrackIndex !== state.currentTrackIndex) {
            currentTrackIndex = state.currentTrackIndex;
            trackConfig = config[currentTrackIndex];
            visualizer = trackConfig.visualizer;
            strokeColor = trackConfig.strokeColor;

            store.dispatch(changeBackground({
                hue: trackConfig.hue,
                saturation: trackConfig.saturation,
                lightness: trackConfig.lightness
            }));

            paper.view.off('frame');
        }

        if (!state.isPlaying) {
            paper.view.off('frame');
        } else {
            run();
        }
    });

    return run();
}

function initPath(totalWidth, totalHeight) {

    let path = new paper.Path();

    path.closed = false;
    path.strokeWidth = 1;
    path.strokeColor = 'rgba(0,0,0,0)';

    let midX = totalWidth / 2;
    let midY = totalHeight / 2;
    let startX = midX - POINTS / 2;

    function initDraw(point) {
        path.add(point);
        paper.view.draw();
    }

    range(POINTS).map((i, idx) => {
        let point = new paper.Point(i, midY);

        path.add(point);
    });

    return path;
}

function initPaper(canvas) {
    paper.setup(canvas);
    paper.view.fillColor = 'rgb(255,255,233)';

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
