import {
    FETCH_TRACKS,
    FETCH_TRACKS_ERROR,
    FETCH_TRACKS_SUCCESS,
    PLAY,
    PAUSE,
    NEXT,
    PREV
} from './actions';

const initialState = {
    isFetching: false,
    isPlaying: false,
    isPaused: false,
    currentTrackIndex: 0
};

export default function(state = initialState, action) {
    switch (action.type) {
    case FETCH_TRACKS:
        return Object.assign({}, state, {
            isFetching: true
        });
    case FETCH_TRACKS_ERROR:
    case FETCH_TRACKS_SUCCESS:
        return Object.assign({}, state, {
            isFetching: false
        });
    case PLAY:
        return Object.assign({}, state, {
            isPlaying: true,
            isPaused: false,
            currentTrackIndex: action.payload._playlistIndex
        });
    case PAUSE:
        return Object.assign({}, state, {
            isPlaying: false,
            isPaused: true
        });
    case NEXT:
    case PREV:
        return Object.assign({}, state, {
            currentTrackIndex: action.payload._playlistIndex,
            isPlaying: true,
            isPaused: false
        });
    default:
        return state;
    }
}
