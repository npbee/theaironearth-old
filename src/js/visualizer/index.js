import freq from './freq';
import { changeBackground } from '../actions';
import config, { FRAME_THROTTLE } from './config';

function render(player, store, analyser, freqByteData, paper) {

    let state = store.getState();
    let currentTrackIndex = state.currentTrackIndex;
    let trackConfig = config[currentTrackIndex];
    let strokeColor = trackConfig.strokeColor;
    let hitpoints = trackConfig.hitpoints;

    function run() {
        var visualizer = freq(paper, player, store, trackConfig);

        if (!state.isPlaying) {
            paper.view.off('frame');
        } else if (!state.visualizerOn) {
            paper.project.clear();
            paper.view.off('frame');
        } else {
            return paper.view.onFrame = (event) => {

                if (event.count % FRAME_THROTTLE === 0) {

                    analyser.getByteFrequencyData(freqByteData);

                    visualizer(freqByteData, event);

                    paper.view.draw();
                }
            };
        }
    }

    paper.view.onResize = run;

    let dispose = store.subscribe(() => {
        state = store.getState();

        if (currentTrackIndex !== state.currentTrackIndex) {
            currentTrackIndex = state.currentTrackIndex;
            trackConfig = config[currentTrackIndex];
            strokeColor = trackConfig.strokeColor;

            store.dispatch(changeBackground({
                hue: trackConfig.hue,
                saturation: trackConfig.saturation,
                lightness: trackConfig.lightness
            }));
        }

        run();

    });

    return paper;
}

function initPaper(canvas) {
    paper.setup(canvas);
    paper.view.fillColor = 'rgb(255,255,233)';

    return paper;
}

function initAudio(player) {
    const audio = player.audio;
    audio.crossOrigin = 'anonymous';
    const context = new (webkitAudioContext || AudioContext)();
    const analyser = context.createAnalyser();
    const source = context.createMediaElementSource(audio);
    const freqByteData = new Uint8Array(analyser.frequencyBinCount);

    source.connect(analyser);
    analyser.connect(context.destination);

    return [analyser, freqByteData];
}

export default function createVisualizer(player, store) {
    const canvas = document.getElementById('visualizer');
    const [analyser, freqByteData] = initAudio(player);
    const paper = initPaper(canvas);


    return render(player, store, analyser, freqByteData, paper);
}
