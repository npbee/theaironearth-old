(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

module.exports = baseProperty;

},{}],2:[function(require,module,exports){
var baseProperty = require('./baseProperty');

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
 * that affects Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

module.exports = getLength;

},{"./baseProperty":1}],3:[function(require,module,exports){
var getLength = require('./getLength'),
    isLength = require('./isLength');

/**
 * Checks if `value` is array-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value));
}

module.exports = isArrayLike;

},{"./getLength":2,"./isLength":6}],4:[function(require,module,exports){
/** Used to detect unsigned integer values. */
var reIsUint = /^\d+$/;

/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

module.exports = isIndex;

},{}],5:[function(require,module,exports){
var isArrayLike = require('./isArrayLike'),
    isIndex = require('./isIndex'),
    isObject = require('../lang/isObject');

/**
 * Checks if the provided arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
      ? (isArrayLike(object) && isIndex(index, object.length))
      : (type == 'string' && index in object)) {
    var other = object[index];
    return value === value ? (value === other) : (other !== other);
  }
  return false;
}

module.exports = isIterateeCall;

},{"../lang/isObject":7,"./isArrayLike":3,"./isIndex":4}],6:[function(require,module,exports){
/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;

},{}],7:[function(require,module,exports){
/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

module.exports = isObject;

},{}],8:[function(require,module,exports){
var isIterateeCall = require('../internal/isIterateeCall');

/* Native method references for those with the same name as other `lodash` methods. */
var nativeCeil = Math.ceil,
    nativeMax = Math.max;

/**
 * Creates an array of numbers (positive and/or negative) progressing from
 * `start` up to, but not including, `end`. If `end` is not specified it's
 * set to `start` with `start` then set to `0`. If `end` is less than `start`
 * a zero-length range is created unless a negative `step` is specified.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {number} [start=0] The start of the range.
 * @param {number} end The end of the range.
 * @param {number} [step=1] The value to increment or decrement by.
 * @returns {Array} Returns the new array of numbers.
 * @example
 *
 * _.range(4);
 * // => [0, 1, 2, 3]
 *
 * _.range(1, 5);
 * // => [1, 2, 3, 4]
 *
 * _.range(0, 20, 5);
 * // => [0, 5, 10, 15]
 *
 * _.range(0, -4, -1);
 * // => [0, -1, -2, -3]
 *
 * _.range(1, 4, 0);
 * // => [1, 1, 1]
 *
 * _.range(0);
 * // => []
 */
function range(start, end, step) {
  if (step && isIterateeCall(start, end, step)) {
    end = step = undefined;
  }
  start = +start || 0;
  step = step == null ? 1 : (+step || 0);

  if (end == null) {
    end = start;
    start = 0;
  } else {
    end = +end || 0;
  }
  // Use `Array(length)` so engines like Chakra and V8 avoid slower modes.
  // See https://youtu.be/XAqIpGU8ZZk#t=17m25s for more details.
  var index = -1,
      length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
      result = Array(length);

  while (++index < length) {
    result[index] = start;
    start += step;
  }
  return result;
}

module.exports = range;

},{"../internal/isIterateeCall":5}],9:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var pad = function pad(num) {
  return ("0" + num).slice(-2);
};

// Use the new performance api to get better precision if available
var timer = typeof performance !== "undefined" && typeof performance.now === "function" ? performance : Date;

/**
 * Creates logger with followed options
 *
 * @namespace
 * @property {object} options - options for logger
 * @property {string} options.level - console[level]
 * @property {object} options.logger - implementation of the `console` API.
 * @property {boolean} options.collapsed - is group collapsed?
 * @property {boolean} options.predicate - condition which resolves logger behavior
 * @property {bool} options.duration - print duration of each action?
 * @property {bool} options.timestamp - print timestamp with each action?
 * @property {function} options.transformer - transform state before print
 * @property {function} options.actionTransformer - transform action before print
 */

function createLogger() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  return function (_ref) {
    var getState = _ref.getState;
    return function (next) {
      return function (action) {
        var level = options.level;
        var logger = options.logger;
        var collapsed = options.collapsed;
        var predicate = options.predicate;
        var _options$duration = options.duration;
        var duration = _options$duration === undefined ? false : _options$duration;
        var _options$timestamp = options.timestamp;
        var timestamp = _options$timestamp === undefined ? true : _options$timestamp;
        var _options$transformer = options.transformer;
        var transformer = _options$transformer === undefined ? function (state) {
          return state;
        } : _options$transformer;
        var _options$actionTransformer = options.actionTransformer;
        var actionTransformer = _options$actionTransformer === undefined ? function (actn) {
          return actn;
        } : _options$actionTransformer;

        var console = logger || window.console;

        // exit if console undefined
        if (typeof console === "undefined") {
          return next(action);
        }

        // exit early if predicate function returns false
        if (typeof predicate === "function" && !predicate(getState, action)) {
          return next(action);
        }

        var started = timer.now();
        var prevState = transformer(getState());

        var returnValue = next(action);
        var took = timer.now() - started;

        var nextState = transformer(getState());

        // formatters
        var time = new Date();
        var isCollapsed = typeof collapsed === "function" ? collapsed(getState, action) : collapsed;

        var formattedTime = timestamp ? " @ " + time.getHours() + ":" + pad(time.getMinutes()) + ":" + pad(time.getSeconds()) : "";
        var formattedDuration = duration ? " in " + took.toFixed(2) + " ms" : "";
        var formattedAction = actionTransformer(action);
        var message = "action " + formattedAction.type + formattedTime + formattedDuration;

        // render
        try {
          isCollapsed ? console.groupCollapsed(message) : console.group(message);
        } catch (e) {
          console.log(message);
        }

        if (level) {
          console[level]("%c prev state", "color: #9E9E9E; font-weight: bold", prevState);
          console[level]("%c action", "color: #03A9F4; font-weight: bold", formattedAction);
          console[level]("%c next state", "color: #4CAF50; font-weight: bold", nextState);
        } else {
          console.log("%c prev state", "color: #9E9E9E; font-weight: bold", prevState);
          console.log("%c action", "color: #03A9F4; font-weight: bold", formattedAction);
          console.log("%c next state", "color: #4CAF50; font-weight: bold", nextState);
        }

        try {
          console.groupEnd();
        } catch (e) {
          console.log("—— log end ——");
        }

        return returnValue;
      };
    };
  };
}

exports["default"] = createLogger;
module.exports = exports["default"];
},{}],11:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = thunkMiddleware;

function thunkMiddleware(_ref) {
  var dispatch = _ref.dispatch;
  var getState = _ref.getState;

  return function (next) {
    return function (action) {
      return typeof action === 'function' ? action(dispatch, getState) : next(action);
    };
  };
}

module.exports = exports['default'];
},{}],12:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = createStore;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsIsPlainObject = require('./utils/isPlainObject');

var _utilsIsPlainObject2 = _interopRequireDefault(_utilsIsPlainObject);

/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var ActionTypes = {
  INIT: '@@redux/INIT'
};

exports.ActionTypes = ActionTypes;
/**
 * Creates a Redux store that holds the state tree.
 * The only way to change the data in the store is to call `dispatch()` on it.
 *
 * There should only be a single store in your app. To specify how different
 * parts of the state tree respond to actions, you may combine several reducers
 * into a single reducer function by using `combineReducers`.
 *
 * @param {Function} reducer A function that returns the next state tree, given
 * the current state tree and the action to handle.
 *
 * @param {any} [initialState] The initial state. You may optionally specify it
 * to hydrate the state from the server in universal apps, or to restore a
 * previously serialized user session.
 * If you use `combineReducers` to produce the root reducer function, this must be
 * an object with the same shape as `combineReducers` keys.
 *
 * @returns {Store} A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */

function createStore(reducer, initialState) {
  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = initialState;
  var listeners = [];
  var isDispatching = false;

  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */
  function getState() {
    return currentState;
  }

  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */
  function subscribe(listener) {
    listeners.push(listener);

    return function unsubscribe() {
      var index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  }

  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */
  function dispatch(action) {
    if (!_utilsIsPlainObject2['default'](action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    listeners.slice().forEach(function (listener) {
      return listener();
    });
    return action;
  }

  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */
  function replaceReducer(nextReducer) {
    currentReducer = nextReducer;
    dispatch({ type: ActionTypes.INIT });
  }

  // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.
  dispatch({ type: ActionTypes.INIT });

  return {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  };
}
},{"./utils/isPlainObject":18}],13:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _createStore = require('./createStore');

var _createStore2 = _interopRequireDefault(_createStore);

var _utilsCombineReducers = require('./utils/combineReducers');

var _utilsCombineReducers2 = _interopRequireDefault(_utilsCombineReducers);

var _utilsBindActionCreators = require('./utils/bindActionCreators');

var _utilsBindActionCreators2 = _interopRequireDefault(_utilsBindActionCreators);

var _utilsApplyMiddleware = require('./utils/applyMiddleware');

var _utilsApplyMiddleware2 = _interopRequireDefault(_utilsApplyMiddleware);

var _utilsCompose = require('./utils/compose');

var _utilsCompose2 = _interopRequireDefault(_utilsCompose);

exports.createStore = _createStore2['default'];
exports.combineReducers = _utilsCombineReducers2['default'];
exports.bindActionCreators = _utilsBindActionCreators2['default'];
exports.applyMiddleware = _utilsApplyMiddleware2['default'];
exports.compose = _utilsCompose2['default'];
},{"./createStore":12,"./utils/applyMiddleware":14,"./utils/bindActionCreators":15,"./utils/combineReducers":16,"./utils/compose":17}],14:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = applyMiddleware;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _compose = require('./compose');

var _compose2 = _interopRequireDefault(_compose);

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */

function applyMiddleware() {
  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (next) {
    return function (reducer, initialState) {
      var store = next(reducer, initialState);
      var _dispatch = store.dispatch;
      var chain = [];

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch(action) {
          return _dispatch(action);
        }
      };
      chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = _compose2['default'].apply(undefined, chain)(store.dispatch);

      return _extends({}, store, {
        dispatch: _dispatch
      });
    };
  };
}

module.exports = exports['default'];
},{"./compose":17}],15:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = bindActionCreators;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsMapValues = require('../utils/mapValues');

var _utilsMapValues2 = _interopRequireDefault(_utilsMapValues);

function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(undefined, arguments));
  };
}

/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass a single function as the first argument,
 * and get a function in return.
 *
 * @param {Function|Object} actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param {Function} dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns {Function|Object} The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */

function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null || actionCreators === undefined) {
    // eslint-disable-line no-eq-null
    throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
  }

  return _utilsMapValues2['default'](actionCreators, function (actionCreator) {
    return bindActionCreator(actionCreator, dispatch);
  });
}

module.exports = exports['default'];
},{"../utils/mapValues":19}],16:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;
exports['default'] = combineReducers;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _createStore = require('../createStore');

var _utilsIsPlainObject = require('../utils/isPlainObject');

var _utilsIsPlainObject2 = _interopRequireDefault(_utilsIsPlainObject);

var _utilsMapValues = require('../utils/mapValues');

var _utilsMapValues2 = _interopRequireDefault(_utilsMapValues);

var _utilsPick = require('../utils/pick');

var _utilsPick2 = _interopRequireDefault(_utilsPick);

/* eslint-disable no-console */

function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type;
  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';

  return 'Reducer "' + key + '" returned undefined handling ' + actionName + '. ' + 'To ignore an action, you must explicitly return the previous state.';
}

function getUnexpectedStateKeyWarningMessage(inputState, outputState, action) {
  var reducerKeys = Object.keys(outputState);
  var argumentName = action && action.type === _createStore.ActionTypes.INIT ? 'initialState argument passed to createStore' : 'previous state received by the reducer';

  if (reducerKeys.length === 0) {
    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
  }

  if (!_utilsIsPlainObject2['default'](inputState)) {
    return 'The ' + argumentName + ' has unexpected type of "' + ({}).toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
  }

  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
    return reducerKeys.indexOf(key) < 0;
  });

  if (unexpectedKeys.length > 0) {
    return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
  }
}

function assertReducerSanity(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, { type: _createStore.ActionTypes.INIT });

    if (typeof initialState === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined.');
    }

    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
    if (typeof reducer(undefined, { type: type }) === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + _createStore.ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined.');
    }
  });
}

/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */

function combineReducers(reducers) {
  var finalReducers = _utilsPick2['default'](reducers, function (val) {
    return typeof val === 'function';
  });
  var sanityError;

  try {
    assertReducerSanity(finalReducers);
  } catch (e) {
    sanityError = e;
  }

  var defaultState = _utilsMapValues2['default'](finalReducers, function () {
    return undefined;
  });

  return function combination(state, action) {
    if (state === undefined) state = defaultState;

    if (sanityError) {
      throw sanityError;
    }

    var finalState = _utilsMapValues2['default'](finalReducers, function (reducer, key) {
      var newState = reducer(state[key], action);
      if (typeof newState === 'undefined') {
        var errorMessage = getUndefinedStateErrorMessage(key, action);
        throw new Error(errorMessage);
      }
      return newState;
    });

    if (process.env.NODE_ENV !== 'production') {
      var warningMessage = getUnexpectedStateKeyWarningMessage(state, finalState, action);
      if (warningMessage) {
        console.error(warningMessage);
      }
    }

    return finalState;
  };
}

module.exports = exports['default'];
}).call(this,require('_process'))
},{"../createStore":12,"../utils/isPlainObject":18,"../utils/mapValues":19,"../utils/pick":20,"_process":9}],17:[function(require,module,exports){
/**
 * Composes single-argument functions from right to left.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing functions from right to
 * left. For example, compose(f, g, h) is identical to arg => f(g(h(arg))).
 */
"use strict";

exports.__esModule = true;
exports["default"] = compose;

function compose() {
  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  return function (arg) {
    return funcs.reduceRight(function (composed, f) {
      return f(composed);
    }, arg);
  };
}

module.exports = exports["default"];
},{}],18:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = isPlainObject;
var fnToString = function fnToString(fn) {
  return Function.prototype.toString.call(fn);
};

/**
 * @param {any} obj The object to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 */

function isPlainObject(obj) {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  var proto = typeof obj.constructor === 'function' ? Object.getPrototypeOf(obj) : Object.prototype;

  if (proto === null) {
    return true;
  }

  var constructor = proto.constructor;

  return typeof constructor === 'function' && constructor instanceof constructor && fnToString(constructor) === fnToString(Object);
}

module.exports = exports['default'];
},{}],19:[function(require,module,exports){
/**
 * Applies a function to every key-value pair inside an object.
 *
 * @param {Object} obj The source object.
 * @param {Function} fn The mapper function that receives the value and the key.
 * @returns {Object} A new object that contains the mapped values for the keys.
 */
"use strict";

exports.__esModule = true;
exports["default"] = mapValues;

function mapValues(obj, fn) {
  return Object.keys(obj).reduce(function (result, key) {
    result[key] = fn(obj[key], key);
    return result;
  }, {});
}

module.exports = exports["default"];
},{}],20:[function(require,module,exports){
/**
 * Picks key-value pairs from an object where values satisfy a predicate.
 *
 * @param {Object} obj The object to pick from.
 * @param {Function} fn The predicate the values must satisfy to be copied.
 * @returns {Object} The object with the values that satisfied the predicate.
 */
"use strict";

exports.__esModule = true;
exports["default"] = pick;

function pick(obj, fn) {
  return Object.keys(obj).reduce(function (result, key) {
    if (fn(obj[key])) {
      result[key] = obj[key];
    }
    return result;
  }, {});
}

module.exports = exports["default"];
},{}],21:[function(require,module,exports){
'use strict';

function SoundCloud (clientId) {
    if (!(this instanceof SoundCloud)) {
        return new SoundCloud(clientId);
    }

    if (!clientId) {
        throw new Error('SoundCloud API clientId is required, get it - https://developers.soundcloud.com/');
    }

    this._events = {};

    this._clientId = clientId;
    this._baseUrl = 'https://api.soundcloud.com';

    this.playing = false;
    this.duration = 0;

    this.audio = document.createElement('audio');
}

SoundCloud.prototype.resolve = function (url, callback) {
    if (!url) {
        throw new Error('SoundCloud track or playlist url is required');
    }

    url = this._baseUrl + '/resolve.json?url=' + url + '&client_id=' + this._clientId;

    this._jsonp(url, function (data) {
        if (Array.isArray(data)) {
            var tracks = data;
            data = {tracks: tracks};
            this._playlist = data;
        } else if (data.tracks) {
            this._playlist = data;
        } else {
            this._track = data;
        }

        this.duration = data.duration && !isNaN(data.duration) ?
            data.duration / 1000 : // convert to seconds
            0; // no duration is zero

        callback(data);
    }.bind(this));

};

SoundCloud.prototype._jsonp = function (url, callback) {
    var target = document.getElementsByTagName('script')[0] || document.head;
    var script = document.createElement('script');

    var id = 'jsonp_callback_' + Math.round(100000 * Math.random());
    window[id] = function (data) {
        if (script.parentNode) {
            script.parentNode.removeChild(script);
        }
        window[id] = function () {};
        callback(data);
    };

    script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + id;
    target.parentNode.insertBefore(script, target);
};

SoundCloud.prototype.on = function (e, fn) {
    this._events[e] = fn;
    this.audio.addEventListener(e, fn, false);
};

SoundCloud.prototype.off = function (e, fn) {
    this._events[e] = null;
    this.audio.removeEventListener(e, fn);
};

SoundCloud.prototype.unbindAll = function () {
    for (var e in this._events) {
        var fn = this._events[e];
        if (fn) {
            this.off(e, fn);
        }
    }
};

SoundCloud.prototype.preload = function (streamUrl) {
    this._track = {stream_url: streamUrl};
    this.audio.src = streamUrl + '?client_id=' + this._clientId;
};

SoundCloud.prototype.play = function (options) {

    this._playlist = {
        tracks: [
            { stream_url: '/audio/exit.mp3' },
            { stream_url: '/audio/ghost.mp3' },
            { stream_url: '/audio/second_skin.mp3' },
            { stream_url: '/audio/reflection.mp3' },
            { stream_url: '/audio/farewell.mp3' },
            { stream_url: '/audio/stillness.mp3' },
            { stream_url: '/audio/young_guns.mp3' },
            { stream_url: '/audio/innocent.mp3' },
            { stream_url: '/audio/wake.mp3' }
        ]
    };

    options = options || {};
    var src;

    if (options.streamUrl) {
        src = options.streamUrl;
    } else if (this._playlist) {
        var length = this._playlist.tracks.length;
        if (length) {
            this._playlistIndex = options.playlistIndex || 0;

            // be silent if index is out of range
            if (this._playlistIndex >= length || this._playlistIndex < 0) {
                this._playlistIndex = 0;
                return;
            }
            src = this._playlist.tracks[this._playlistIndex].stream_url;
        }
    } else if (this._track) {
        src = this._track.stream_url;
    }

    if (!src) {
        throw new Error('There is no tracks to play, use `streamUrl` option or `load` method');
    }

    src += '?client_id=' + this._clientId;

    if (src !== this.audio.src) {
        this.audio.src = src;
    }

    this.playing = src;
    this.audio.play();
};

SoundCloud.prototype.pause = function () {
    this.audio.pause();
    this.playing = false;
};

SoundCloud.prototype.stop = function () {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.playing = false;
};

SoundCloud.prototype.next = function () {
    var tracksLength = this._playlist.tracks.length;
    if (this._playlistIndex >= tracksLength - 1) {
        return;
    }
    if (this._playlist && tracksLength) {
        this.play({playlistIndex: ++this._playlistIndex});
    }
};

SoundCloud.prototype.previous = function () {
    if (this._playlistIndex <= 0) {
        return;
    }
    if (this._playlist && this._playlist.tracks.length) {
        this.play({playlistIndex: --this._playlistIndex});
    }
};

SoundCloud.prototype.seek = function (e) {
    if (!this.audio.readyState) {
        return false;
    }
    var percent = e.offsetX / e.target.offsetWidth || (e.layerX - e.target.offsetLeft) / e.target.offsetWidth;
    this.audio.currentTime = percent * (this.audio.duration || 0);
};

module.exports = SoundCloud;

},{}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.fetchTracks = fetchTracks;
exports.play = play;
exports.pause = pause;
exports.prev = prev;
exports.next = next;
exports.end = end;
exports.changeBackground = changeBackground;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _soundcloudAudio = require('soundcloud-audio');

var _soundcloudAudio2 = _interopRequireDefault(_soundcloudAudio);

var _constants = require('./constants');

var FETCH_TRACKS = 'FETCH_TRACKS';
exports.FETCH_TRACKS = FETCH_TRACKS;
var FETCH_TRACKS_ERROR = 'FETCH_TRACKS_ERROR';
exports.FETCH_TRACKS_ERROR = FETCH_TRACKS_ERROR;
var FETCH_TRACKS_SUCCESS = 'FETCH_TRACKS_SUCCESS';

exports.FETCH_TRACKS_SUCCESS = FETCH_TRACKS_SUCCESS;

function fetchTracks(player) {
    return function (dispatch) {
        dispatch({ type: FETCH_TRACKS });

        player.resolve(_constants.RESOLVE_URL, function (playlist) {
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

var PLAY = 'PLAY';
exports.PLAY = PLAY;
var PAUSE = 'PAUSE';
exports.PAUSE = PAUSE;
var PREV = 'PREV';
exports.PREV = PREV;
var NEXT = 'NEXT';
exports.NEXT = NEXT;
var END = 'END';

exports.END = END;

function play(player, index) {
    return function (dispatch, getState) {
        var trackIndex = index !== undefined ? index : getState().currentTrackIndex;
        player.play({ playlistIndex: trackIndex });

        dispatch({ type: PLAY, payload: player });
    };
}

function pause(player) {
    return function (dispatch) {
        player.pause();

        dispatch({ type: PAUSE, payload: player });
    };
}

function prev(player) {
    return function (dispatch) {
        player.previous();

        dispatch({ type: PREV, payload: player });
    };
}

function next(player) {
    return function (dispatch) {
        player.next();

        dispatch({ type: NEXT, payload: player });
    };
}

function end(player) {
    return {
        type: END,
        payload: player
    };
}

var CHANGE_BACKGROUND = 'CHANGE_BACKGROUND';

exports.CHANGE_BACKGROUND = CHANGE_BACKGROUND;

function changeBackground(_ref) {
    var hue = _ref.hue;
    var saturation = _ref.saturation;
    var lightness = _ref.lightness;

    return {
        type: CHANGE_BACKGROUND,
        payload: {
            hue: hue,
            saturation: saturation,
            lightness: lightness
        }
    };
}

},{"./constants":24,"soundcloud-audio":21}],23:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _soundcloudAudio = require('soundcloud-audio');

var _soundcloudAudio2 = _interopRequireDefault(_soundcloudAudio);

var _redux = require('redux');

var _reduxLogger = require('redux-logger');

var _reduxLogger2 = _interopRequireDefault(_reduxLogger);

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _reducer = require('./reducer');

var _reducer2 = _interopRequireDefault(_reducer);

var _actions = require('./actions');

var _constants = require('./constants');

var _dom = require('./dom');

var _visualizer = require('./visualizer');

var _visualizer2 = _interopRequireDefault(_visualizer);

var logger = (0, _reduxLogger2['default'])();
var store = (0, _redux.applyMiddleware)(_reduxThunk2['default'], logger)(_redux.createStore)(_reducer2['default']);
var player = new _soundcloudAudio2['default'](_constants.CLIENT_ID);

store.dispatch((0, _actions.fetchTracks)(player));

(0, _dom.bindEvents)(player, store.dispatch, store.getState);
(0, _dom.bindClasses)(player, store);

(0, _visualizer2['default'])(player, store);

},{"./actions":22,"./constants":24,"./dom":25,"./reducer":26,"./visualizer":28,"redux":13,"redux-logger":10,"redux-thunk":11,"soundcloud-audio":21}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var RESOLVE_URL = "https://soundcloud.com/theaironearth/sets/test";
exports.RESOLVE_URL = RESOLVE_URL;
var CLIENT_ID = "287e0a470aceec7d505ab41e1892fddc";
exports.CLIENT_ID = CLIENT_ID;

},{}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.bindEvents = bindEvents;
exports.bindClasses = bindClasses;

var _actions = require('./actions');

var playBtn = document.getElementById('play');
var pauseBtn = document.getElementById('pause');
var nextBtn = document.getElementById('next');
var prevBtn = document.getElementById('prev');
var playerEl = document.getElementById('player');
var scrubber = document.getElementById('scrubber');
var overlay = document.getElementById('overlay');
var nav = document.getElementById('nav');
var trackList = Array.from(document.querySelectorAll('.tracklist'));

function getIndex(li) {
    var children = Array.from(li.parentNode.children);

    return children.indexOf(li);
}

function bindEvents(player, dispatch, getState) {

    player.on('ended', function (e) {
        var trackList = player._playlist;
        var currentTrackIndex = getState().currentTrackIndex;

        if (currentTrackIndex + 1 >= trackList.length) {
            dispatch((0, _actions.end)(player));
        } else {
            //dispatch(end(player));
            dispatch((0, _actions.next)(player));
        }
    });

    playBtn.addEventListener('click', function (e) {
        var isPlaying = getState().isPlaying;

        if (!isPlaying) {
            dispatch((0, _actions.play)(player));
        }
    });

    pauseBtn.addEventListener('click', function (e) {
        var isPlaying = getState().isPlaying;

        if (isPlaying) {
            dispatch((0, _actions.pause)(player));
        }
    });

    nextBtn.addEventListener('click', function (e) {
        dispatch((0, _actions.next)(player));
    });

    prevBtn.addEventListener('click', function (e) {
        dispatch((0, _actions.prev)(player));
    });

    scrubber.addEventListener('click', function (e) {
        player.seek(e);
    });

    nav.addEventListener('click', function (e) {
        if (e.target && e.target.nodeName === 'A') {
            var target = e.target;
            var parentNode = target.parentNode;
            var index = getIndex(parentNode);

            dispatch((0, _actions.play)(player, index));

            e.preventDefault();
        }
    });
}

function bindClasses(player, store) {

    store.subscribe(function () {
        var state = store.getState();
        var hue = state.hue;
        var saturation = state.saturation;
        var lightness = state.lightness;
        var opacity = state.opacity;
        var currentTrackIndex = state.currentTrackIndex;

        overlay.style.backgroundColor = 'hsla(' + hue + ', ' + saturation + '%, ' + lightness + '%, ' + opacity + ')';

        //.filter((list, idx) => {
        //console.log(idx);
        //idx === currentTrackIndex;
        //})
        //.map(list => list.classList.add('active'));

        if (state.isPlaying) {
            playerEl.classList.add('isPlaying');
            playerEl.classList.remove('isPaused');

            trackList.map(function (list) {
                var children = Array.from(list.children);

                return children.map(function (li) {
                    li.classList.remove('active');
                    return li;
                }).filter(function (li, idx) {
                    return idx === currentTrackIndex;
                }).map(function (li) {
                    return li.classList.add('active');
                });
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

},{"./actions":22}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _actions = require('./actions');

var initialState = {
    isFetching: false,
    isPlaying: false,
    isPaused: false,
    currentTrackIndex: 0,
    hue: 0,
    saturation: 0,
    opacity: 0.6
};

exports['default'] = function (state, action) {
    if (state === undefined) state = initialState;

    switch (action.type) {
        case _actions.FETCH_TRACKS:
            return Object.assign({}, state, {
                isFetching: true
            });
        case _actions.FETCH_TRACKS_ERROR:
        case _actions.FETCH_TRACKS_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false
            });
        case _actions.PLAY:
            return Object.assign({}, state, {
                isPlaying: true,
                isPaused: false,
                currentTrackIndex: action.payload._playlistIndex
            });
        case _actions.PAUSE:
            return Object.assign({}, state, {
                isPlaying: false,
                isPaused: true
            });
        case _actions.NEXT:
        case _actions.PREV:
            return Object.assign({}, state, {
                currentTrackIndex: action.payload._playlistIndex,
                isPlaying: true,
                isPaused: false
            });
        case _actions.END:
            return Object.assign({}, state, {
                isPlaying: false,
                isPaused: false,
                hue: 0,
                saturation: 0,
                currentTrackIndex: 0,
                lightness: 0,
                opacity: 0
            });
        case _actions.CHANGE_BACKGROUND:
            return Object.assign({}, state, {
                hue: action.payload.hue,
                saturation: action.payload.saturation,
                lightness: action.payload.lightness
            });
        default:
            return state;
    }
};

module.exports = exports['default'];

},{"./actions":22}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _sphere = require('./sphere');

var _sphere2 = _interopRequireDefault(_sphere);

var POINTS = 256;
exports.POINTS = POINTS;
var INIT_POINTS = 50;
exports.INIT_POINTS = INIT_POINTS;
var amplitude = 5;
exports.amplitude = amplitude;
var ANGLE = 10;
exports.ANGLE = ANGLE;
var RADIUS = 100;
exports.RADIUS = RADIUS;
var COLOR_AMP = 0.4;

exports.COLOR_AMP = COLOR_AMP;
exports["default"] = {
    "0": {
        visualizer: _sphere2["default"],
        hue: 195,
        saturation: 30,
        lightness: 72
    },
    "1": {
        visualizer: _sphere2["default"],
        hue: 30,
        saturation: 48,
        lightness: 72
    }
};

},{"./sphere":29}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = createVisualizer;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodashUtilityRange = require('lodash/utility/range');

var _lodashUtilityRange2 = _interopRequireDefault(_lodashUtilityRange);

var _sphere = require('./sphere');

var _sphere2 = _interopRequireDefault(_sphere);

var _actions = require('../actions');

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function render(player, store, analyser, freqByteData, path) {

    //requestAnimationFrame(render.bind(null, player, store, analyser, freqByteData, path));
    //setInterval(() => render(player, store, analyser, freqByteData, path, r), 1000);
    var state = store.getState();
    var currentTrackIndex = state.currentTrackIndex;
    var trackConfig = _config2['default'][currentTrackIndex];
    var visualizer = trackConfig.visualizer;

    store.dispatch((0, _actions.changeBackground)({
        hue: trackConfig.hue,
        saturation: trackConfig.saturation,
        lightness: trackConfig.lightness
    }));

    var dispose = store.subscribe(function () {
        var state = store.getState();

        if (currentTrackIndex !== state.currentTrackIndex) {
            currentTrackIndex = state.currentTrackIndex;
            trackConfig = _config2['default'][currentTrackIndex];
            visualizer = trackConfig.visualizer;

            store.dispatch((0, _actions.changeBackground)({
                hue: trackConfig.hue,
                saturation: trackConfig.saturation,
                lightness: trackConfig.lightness
            }));
        }
    });

    return paper.view.onFrame = function (event) {
        analyser.getByteFrequencyData(freqByteData);

        path.segments = visualizer(freqByteData, path, _config.RADIUS);

        paper.view.draw();
    };
}

function initPath(totalWidth, totalHeight) {

    var path = new paper.Path();

    path.closed = false;
    path.strokeWidth = 1;
    path.strokeColor = '#444444';

    (0, _lodashUtilityRange2['default'])(_config.POINTS).map(function (i) {
        var x = i;
        var y = 300;
        var point = new paper.Point(x, y);

        path.add(point);
    });

    return path;
}

function initPaper(canvas) {
    paper.setup(canvas);
    paper.view.fillColor = 'rgb(255, 255,233)';

    return initPath(paper.view.size.width, paper.view.size.height);
}

function createVisualizer(player, store) {
    var audio = player.audio;
    audio.crossOrigin = 'anonymous';
    var context = new AudioContext();
    var analyser = context.createAnalyser();
    var source = context.createMediaElementSource(audio);
    var canvas = document.getElementById('visualizer');
    var freqByteData = new Uint8Array(analyser.frequencyBinCount);

    source.connect(analyser);
    analyser.connect(context.destination);

    var path = initPaper(canvas);

    var dispose = store.subscribe(function () {
        var state = store.getState();

        if (state.isPlaying) {
            // Just listen for the first play and cancel the subscription
            // after that.
            dispose();

            render(player, store, analyser, freqByteData, path);
        }
    });
}

module.exports = exports['default'];

},{"../actions":22,"./config":27,"./sphere":29,"lodash/utility/range":8}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = generateSphere;

var _config = require('./config');

function generateSphere(data, path, radius) {

    return path.segments.map(function (segment, i) {
        var xPos = paper.view.size.width / 2;
        var yPos = paper.view.size.height / 2;
        var magnitude = data[i] * (0.2 * (_config.amplitude / 20));
        var x = radius * Math.cos(radius * magnitude) + xPos;
        var y = radius * Math.sin(radius * magnitude) + yPos;

        segment.point.x = x;
        segment.point.y = y;

        return segment;
    });
}

module.exports = exports['default'];

},{"./config":27}]},{},[23]);
