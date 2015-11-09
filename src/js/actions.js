import SoundCloudAudio from 'soundcloud-audio';
import { RESOLVE_URL } from './constants';

/**
 * Fetch tracks from Soundcloud
 */
export const FETCH_TRACKS = 'FETCH_TRACKS';
export const FETCH_TRACKS_ERROR = 'FETCH_TRACKS_ERROR';
export const FETCH_TRACKS_SUCCESS = 'FETCH_TRACKS_SUCCESS';

export function fetchTracks(player) {
    return dispatch => {
        dispatch( {type: FETCH_TRACKS });

        player.resolve(RESOLVE_URL, (playlist) => {
            if (!playlist) {
                return dispatch({
                    type: FETCH_TRACKS_ERROR,
                    payload: err
                });
            }

            return dispatch({
                type: FETCH_TRACKS_SUCCESS,
                payload: player
            });
        });
    };
}



/**
 * Player Controls
 */
export const PLAY = 'PLAY';
export const PAUSE = 'PAUSE';
export const PREV = 'PREV';
export const NEXT = 'NEXT';
export const END = 'END';

export function play(player, index) {
    return (dispatch, getState) => {
        let trackIndex = index !== undefined ? index : getState().currentTrackIndex;
        player.play({ playlistIndex: trackIndex });

        dispatch({ type: PLAY, payload: player });
    };
}

export function resume(player) {
    return dispatch => {
        player.audio.play();

        dispatch({ type: PLAY, payload: player });
    };
}

export function pause(player) {
    return dispatch => {
        player.pause();

        dispatch({ type: PAUSE, payload: player });
    };
}

export function prev(player) {
    return dispatch => {
        player.previous();

        dispatch({ type: PREV, payload: player });
    };
}

export function next(player) {
    return dispatch => {
        player.next();

        dispatch({ type: NEXT, payload: player });
    };
}

export function end(player) {
    return {
        type: END,
        payload: player
    };
}
