import { play, pause, next, prev, end } from './actions';

var playBtn = document.getElementById('play');
var pauseBtn = document.getElementById('pause');
var nextBtn = document.getElementById('next');
var prevBtn = document.getElementById('prev');
var playerEl = document.getElementById('player');
var scrubber = document.getElementById('scrubber');
var overlay = document.getElementById('overlay');

export function bindEvents(player, dispatch, getState) {

    player.on('ended', e => {
        let trackList = player._playlist;
        let currentTrackIndex = getState().currentTrackIndex;

        if (currentTrackIndex + 1 >= trackList.length) {
            dispatch(end(player));
        } else {
            //dispatch(end(player));
            dispatch(next(player));
        }

    });

    playBtn.addEventListener('click', e => {
        const isPlaying = getState().isPlaying;

        if (!isPlaying) {
            dispatch(play(player));
        }
    });

    pauseBtn.addEventListener('click', e => {
        const isPlaying = getState().isPlaying;

        if (isPlaying) {
            dispatch(pause(player));
        }
    });

    nextBtn.addEventListener('click', e => {
        dispatch(next(player));
    });

    prevBtn.addEventListener('click', e => {
        dispatch(prev(player));
    });

    scrubber.addEventListener('click', e => {
        player.seek(e);
    });
}

export function bindClasses(player, store) {
    store.subscribe(() => {
        let state = store.getState();
        let hue = state.hue;
        let saturation = state.saturation;
        let lightness = state.lightness;
        let opacity = state.opacity;

        overlay.style.backgroundColor = `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity})`;

        if (state.isPlaying) {
            playerEl.classList.add('isPlaying');
            playerEl.classList.remove('isPaused');
        } else if (state.isPaused) {
            playerEl.classList.remove('isPlaying');
            playerEl.classList.add('isPaused');
        } else {
            playerEl.classList.remove('isPlaying');
            playerEl.classList.remove('isPaused');
        }
    });
}
