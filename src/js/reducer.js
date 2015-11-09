import {
    FETCH_TRACKS,
    FETCH_TRACKS_ERROR,
    FETCH_TRACKS_SUCCESS,
    PLAY,
    PAUSE,
    NEXT,
    PREV,
    END,
    CHANGE_BACKGROUND,
    TOGGLE_VISUALIZER
} from './actions';

const initialState = {
    isFetching: false,
    isPlaying: false,
    isPaused: false,
    currentTrackIndex: 0,
    hue: 0,
    saturation: 0,
    opacity: 0.6
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
    case END:
        return Object.assign({}, state, {
            isPlaying: false,
            isPaused: false,
            hue: 0,
            saturation: 0,
            currentTrackIndex: 0,
            lightness: 0,
            opacity: 0
        });
    case CHANGE_BACKGROUND:
        return Object.assign({}, state, {
            hue: action.payload.hue || state.hue,
            saturation: action.payload.saturation || state.saturation,
            lightness: action.payload.lightness || state.lightness
        });
    case TOGGLE_VISUALIZER:
        return Object.assign({}, state, {
            visualizerOn: action.payload
        });
    default:
        return state;
    }
}
