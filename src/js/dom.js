import { play, pause, next, prev, end, resume } from './actions';

var playBtn = document.getElementById('play');
var pauseBtn = document.getElementById('pause');
var nextBtn = document.getElementById('next');
var prevBtn = document.getElementById('prev');
var playerEl = document.getElementById('listen');
var scrubber = document.getElementById('scrubber');
var overlay = document.getElementById('overlay');
const nav = document.getElementById('nav');
const pageNavs = Array.from(document.querySelectorAll('.subnav > li > a'));
const navTracklist = document.getElementById('nav-tracklist');
const trackList = Array.from(document.querySelectorAll('.tracklist'));
const sections = Array.from(document.querySelectorAll('.section'));

function getIndex(li) {
    let children = Array.from(li.parentNode.children);

    return children.indexOf(li);
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

    scrubber.addEventListener('click', e => {
        player.seek(e);
    });

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

    nav.addEventListener('click', e => {
        if (e.target && e.target.nodeName === 'A') {
            console.log('hi');
            let hash = e.target.hash;
            let id = hash.slice(1);

            activateEl(pageNavs, el => el.hash === hash);
            activateEl(sections, el => el.getAttribute('id') === id);

            if (window.history) {
                window.history.pushState({ activeSection: id }, null, hash);
            }

            e.preventDefault();
        }
    });

    window.addEventListener('popstate', e => {
        let activeSection = e.state.activeSection;

        if (activeSection) {
            activateEl(sections, el => el.getAttribute('id') === activeSection);
            activateEl(pageNavs, el => el.hash === `#${activeSection}`);
        }
    });

    if (document.location.hash) {
        let hash = document.location.hash;

        activateEl(pageNavs, el => el.hash === hash);
        activateEl(sections, el => el.getAttribute('id') === hash.slice(1));
    }

}

export function bindClasses(player, store) {

    store.subscribe(() => {
        let state = store.getState();
        let hue = state.hue;
        let saturation = state.saturation;
        let lightness = state.lightness;
        let opacity = state.opacity;
        let currentTrackIndex = state.currentTrackIndex;

        overlay.style.backgroundColor =
            `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity})`;

            //.filter((list, idx) => {
                //console.log(idx);
                //idx === currentTrackIndex;
            //})
            //.map(list => list.classList.add('active'));

        if (state.isPlaying) {
            playerEl.classList.add('isPlaying');
            playerEl.classList.remove('isPaused');

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
