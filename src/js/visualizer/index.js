import range from 'lodash/utility/range';
import inRange from 'lodash/number/inRange';
import once from 'lodash/function/once';

import generateMountains from './mountains';
import freq from './freq';
import { changeBackground } from '../actions';

import config, {
    POINTS,
    RADIUS
} from './config';

function render(player, store, analyser, freqByteData, paper) {

    let state = store.getState();
    let currentTrackIndex = state.currentTrackIndex;
    let trackConfig = config[currentTrackIndex];
    let strokeColor = trackConfig.strokeColor;
    let hitpoints = trackConfig.hitpoints;

    store.dispatch(changeBackground({
        hue: trackConfig.hue,
        saturation: trackConfig.saturation,
        lightness: trackConfig.lightness
    }));

    function run() {
        var visualizer = freq(paper, player, store, trackConfig);

        return paper.view.onFrame = (event) => {

            if (event.count % 5 === 0) {

                analyser.getByteFrequencyData(freqByteData);

                visualizer(freqByteData, event);

                paper.view.draw();
            }
        };
    }

    let dispose = store.subscribe(() => {
        let state = store.getState();

        if (currentTrackIndex !== state.currentTrackIndex) {
            currentTrackIndex = state.currentTrackIndex;
            trackConfig = config[currentTrackIndex];
            strokeColor = trackConfig.strokeColor;

            store.dispatch(changeBackground({
                hue: trackConfig.hue,
                saturation: trackConfig.saturation,
                lightness: trackConfig.lightness
            }));

            //paper.view.off('frame');

            //run();
        }

        if (!state.isPlaying) {
            paper.view.off('frame');
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
        let point = new paper.Point(0, 0);

        path.add(point);
    });

    return path;
}

function initPaper(canvas) {
    paper.setup(canvas);
    paper.view.fillColor = 'rgb(255,255,233)';

    return paper;
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

    const paper = initPaper(canvas);

    const dispose = store.subscribe(() => {
        let state = store.getState();

        if (state.isPlaying) {
            // Just listen for the first play and cancel the subscription
            // after that.
            dispose();

            render(player, store, analyser, freqByteData, paper);
        }
    });

}
