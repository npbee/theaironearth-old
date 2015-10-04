import { play, pause, next, prev } from './actions';

var playBtn = document.getElementById('play');
var pauseBtn = document.getElementById('pause');
var nextBtn = document.getElementById('next');
var prevBtn = document.getElementById('prev');
var playerEl = document.getElementById('player');
var scrubber = document.getElementById('scrubber');

export function bindEvents(player, dispatch, getState) {

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

        if (state.isPlaying) {
            playerEl.classList.add('isPlaying');
            playerEl.classList.remove('isPaused');
        } else if (state.isPaused) {
            playerEl.classList.remove('isPlaying');
            playerEl.classList.add('isPaused');
        }
    });
}
