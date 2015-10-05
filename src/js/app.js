import SoundCloudAudio from 'soundcloud-audio';
import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';

import reducer from './reducer';
import { fetchTracks } from './actions';
import { CLIENT_ID } from './constants';
import { bindEvents, bindClasses } from './dom';
import createVisualizer from './visualizer';
import createRouter from './router';


let logger = createLogger();
let store = applyMiddleware(thunk, logger)(createStore)(reducer);
let player = new SoundCloudAudio(CLIENT_ID);

store.dispatch(fetchTracks(player));

bindEvents(player, store.dispatch, store.getState);
bindClasses(player, store);

createVisualizer(player, store);
