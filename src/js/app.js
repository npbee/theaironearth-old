import SoundCloudAudio from 'soundcloud-audio';
import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';

import reducer from './reducer';
import { fetchTracks } from './actions';
import { CLIENT_ID } from './constants';
import { bindEvents, bindClasses } from './dom';
import createRouter from './router';


// Some setup
let logger = createLogger({
    predicate: () => process.env.NODE_ENV !== 'production'
});
let store = applyMiddleware(thunk, logger)(createStore)(reducer);
let player = new SoundCloudAudio(CLIENT_ID);

// Kick off track fetching
store.dispatch(fetchTracks(player));

bindEvents(player, store.dispatch, store.getState);
bindClasses(player, store);
