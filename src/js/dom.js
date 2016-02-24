import { play, pause, next, prev, end, resume, toggleVis } from './actions';
import { TRACK_NAMES } from './constants';
import config from './config';


const playBtn = document.getElementById('play');
const pauseBtn = document.getElementById('pause');
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');
const playerEl = document.getElementById('listen');
const scrubber = document.getElementById('scrubber');
const scrubberInner = document.getElementById('scrubber__inner');
const scrubberPlayed = document.getElementById('scrubber__played');
const overlay = document.getElementById('overlay');
const body = document.body;
const nav = document.getElementById('nav');
const pageNavs = Array.from(document.querySelectorAll('.subnav > li > a'));
const navTracklist = document.getElementById('nav-tracklist');
const mobileTracklist = document.getElementById('mobile-tracklist');
const trackList = Array.from(document.querySelectorAll('.tracklist'));
const sections = Array.from(document.querySelectorAll('.section'));
const playError = document.getElementById('play-error');



/**
 * Some helpers
 */
function getIndex(li) {
    let children = Array.from(li.parentNode.children);

    return children.indexOf(li);
}

function setActiveSection(id) {
    let classList = Array.from(body.classList).find(cls => /--active/.test(cls));

    body.classList.remove(classList);
    body.classList.add(`${id}--active`);

}

function setActiveTrackClass(currentTrackIndex) {
    let trackClass = Array.from(body.classList).find(cls => /track--/.test(cls));
    let trackName = TRACK_NAMES[currentTrackIndex];

    body.classList.remove(trackClass);
    body.classList.add(`track--${trackName}`);
}

function activateEl(els, filterFn) {
    els.map(el => {
        el.classList.remove('active');
        return el;
    })
    .filter(filterFn)
    .map(el => {
        el.classList.add('active');
        return el;
    });
}


/**
 * Bind DOM events
 *
 * Binds various DOM events to the player for dispatching.
 */
export function bindEvents(player, dispatch, getState) {


    // When a track ends, move on to the next one
    player.on('ended', e => {
        let trackList = player._playlist;
        let currentTrackIndex = getState().currentTrackIndex;

        if (currentTrackIndex + 1 >= trackList.length) {
            dispatch(end(player));
        } else {
            dispatch(next(player));
        }

    });


    // Play / Pause / Next / Prev
    playBtn.addEventListener('click', e => {
        let state = getState();
        const isPlaying = state.isPlaying;
        const isPaused = state.isPaused;

        if (isPaused) {
            dispatch(resume(player));
        } else if (!isPlaying) {
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


    // Scrubber
    scrubber.addEventListener('click', e => {
        let offset = e.offsetX;
        let width = scrubber.offsetWidth;
        let percent = offset / width;
        console.log(percent);
        player.audio.currentTime = percent * (player.audio.duration || 0);
    });

    player.on('timeupdate', e => {
        let duration = player.audio.duration;
        let currentTime = player.audio.currentTime;
        let percent = (currentTime / duration) * 100;
        scrubberPlayed.style.width = `${percent}%`;
    });


    // Nav controls
    navTracklist.addEventListener('click', e => {
        if (e.target && e.target.nodeName === 'A') {
            let target = e.target;
            let parentNode = target.parentNode;
            let index = getIndex(parentNode);

            dispatch(play(player, index));

            e.preventDefault();
            e.stopPropagation();
        }
    });

    mobileTracklist.addEventListener('click', e => {
        if (e.target && e.target.nodeName === 'A') {
            let target = e.target;
            let parentNode = target.parentNode;
            let index = getIndex(parentNode);

            dispatch(play(player, index));

            e.preventDefault();
            e.stopPropagation();
        }
    });

    nav.addEventListener('click', e => {
        if (e.target && e.target.nodeName === 'A') {
            let hash = e.target.hash;
            let id = (hash && hash.slice(1) || 'listen');

            //activateEl(pageNavs, el => el.hash === hash);
            //activateEl(sections, el => el.getAttribute('id') === id);
            setActiveSection(id);

            if (window.history) {
                window.history.pushState({ activeSection: id }, null, hash);
            }

            e.preventDefault();
        }
    });


    // Simple history navigation
    window.addEventListener('popstate', e => {
        let activeSection = e.state && e.state.activeSection;

        if (activeSection) {
            setActiveSection(activeSection);
        } else {
            setActiveSection('listen');
        }
    });

    if (document.location.hash) {
        let hash = document.location.hash;

        setActiveSection(hash.slice(1));
    }


    // Keyboard controls
    window.addEventListener('keydown', e => {
        let keyCode = e.which || e.keyCode;
        let state = getState();
        const isPlaying = state.isPlaying;
        const isPaused = state.isPaused;

        if (keyCode === 32) {
            if (isPaused) {
                dispatch(resume(player));
            } else if (!isPlaying) {
                dispatch(play(player));
            } else if (isPlaying) {
                dispatch(pause(player));
            }

            e.preventDefault();
        } else if (keyCode === 39) {
            dispatch(next(player));
        } else if (keyCode === 37) {
            dispatch(prev(player));
        }
    });

}


/**
 * Bind Class
 *
 * Subscribe to the store and update classes for various pieces of the sites.
 */
export function bindClasses(player, store) {

    store.subscribe(() => {
        let state = store.getState();
        let hue = state.hue;
        let saturation = state.saturation;
        let lightness = state.lightness;
        let opacity = state.opacity;
        let currentTrackIndex = state.currentTrackIndex;
        let trackConfig = config[currentTrackIndex];

        if (state.playError) {
            playError.classList.add('play-error--error');
        } else {
            playError.classList.remove('play-error--error');
        }

        if (state.isPlaying) {
            overlay.style.backgroundColor =
                `hsla(${trackConfig.hue}, ${trackConfig.saturation}%, ${trackConfig.lightness}%, ${opacity})`;
        }

        if (state.isPlaying) {
            playerEl.classList.add('isPlaying');
            playerEl.classList.remove('isPaused');
            scrubberInner.style.width = '100%';
            scrubberPlayed.style.display = 'block';

            setActiveTrackClass(currentTrackIndex);

            trackList
                .map(list => {
                    let children = Array.from(list.children);

                    return children
                        .map(li => {
                            li.classList.remove('active');
                            return li;
                        })
                        .filter((li, idx) => idx === currentTrackIndex)
                        .map(li => li.classList.add('active'));
                });

        } else if (state.isPaused) {
            playerEl.classList.remove('isPlaying');
            playerEl.classList.add('isPaused');
        } else {
            playerEl.classList.remove('isPlaying');
            playerEl.classList.remove('isPaused');
        }

    });

}
