(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

},{}],2:[function(require,module,exports){
/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that invokes `func`, with the `this` binding and arguments
 * of the created function, while it's called less than `n` times. Subsequent
 * calls to the created function return the result of the last `func` invocation.
 *
 * @static
 * @memberOf _
 * @category Function
 * @param {number} n The number of calls at which `func` is no longer invoked.
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @example
 *
 * jQuery('#add').on('click', _.before(5, addContactToList));
 * // => allows adding up to 4 contacts to the list
 */
function before(n, func) {
  var result;
  if (typeof func != 'function') {
    if (typeof n == 'function') {
      var temp = n;
      n = func;
      func = temp;
    } else {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
  }
  return function() {
    if (--n > 0) {
      result = func.apply(this, arguments);
    }
    if (n <= 1) {
      func = undefined;
    }
    return result;
  };
}

module.exports = before;

},{}],3:[function(require,module,exports){
var before = require('./before');

/**
 * Creates a function that is restricted to invoking `func` once. Repeat calls
 * to the function return the value of the first call. The `func` is invoked
 * with the `this` binding and arguments of the created function.
 *
 * @static
 * @memberOf _
 * @category Function
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @example
 *
 * var initialize = _.once(createApplication);
 * initialize();
 * initialize();
 * // `initialize` invokes `createApplication` once
 */
function once(func) {
  return before(2, func);
}

module.exports = once;

},{"./before":2}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{"./baseProperty":4}],6:[function(require,module,exports){
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

},{"./getLength":5,"./isLength":9}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{"../lang/isObject":10,"./isArrayLike":6,"./isIndex":7}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
/* Native method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Checks if `n` is between `start` and up to but not including, `end`. If
 * `end` is not specified it's set to `start` with `start` then set to `0`.
 *
 * @static
 * @memberOf _
 * @category Number
 * @param {number} n The number to check.
 * @param {number} [start=0] The start of the range.
 * @param {number} end The end of the range.
 * @returns {boolean} Returns `true` if `n` is in the range, else `false`.
 * @example
 *
 * _.inRange(3, 2, 4);
 * // => true
 *
 * _.inRange(4, 8);
 * // => true
 *
 * _.inRange(4, 2);
 * // => false
 *
 * _.inRange(2, 2);
 * // => false
 *
 * _.inRange(1.2, 2);
 * // => true
 *
 * _.inRange(5.2, 4);
 * // => false
 */
function inRange(value, start, end) {
  start = +start || 0;
  if (end === undefined) {
    end = start;
    start = 0;
  } else {
    end = +end || 0;
  }
  return value >= nativeMin(start, end) && value < nativeMax(start, end);
}

module.exports = inRange;

},{}],12:[function(require,module,exports){
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

},{"../internal/isIterateeCall":8}],13:[function(require,module,exports){
(function (process){
  /* globals require, module */

  'use strict';

  /**
   * Module dependencies.
   */

  var pathtoRegexp = require('path-to-regexp');

  /**
   * Module exports.
   */

  module.exports = page;

  /**
   * Detect click event
   */
  var clickEvent = ('undefined' !== typeof document) && document.ontouchstart ? 'touchstart' : 'click';

  /**
   * To work properly with the URL
   * history.location generated polyfill in https://github.com/devote/HTML5-History-API
   */

  var location = ('undefined' !== typeof window) && (window.history.location || window.location);

  /**
   * Perform initial dispatch.
   */

  var dispatch = true;


  /**
   * Decode URL components (query string, pathname, hash).
   * Accommodates both regular percent encoding and x-www-form-urlencoded format.
   */
  var decodeURLComponents = true;

  /**
   * Base path.
   */

  var base = '';

  /**
   * Running flag.
   */

  var running;

  /**
   * HashBang option
   */

  var hashbang = false;

  /**
   * Previous context, for capturing
   * page exit events.
   */

  var prevContext;

  /**
   * Register `path` with callback `fn()`,
   * or route `path`, or redirection,
   * or `page.start()`.
   *
   *   page(fn);
   *   page('*', fn);
   *   page('/user/:id', load, user);
   *   page('/user/' + user.id, { some: 'thing' });
   *   page('/user/' + user.id);
   *   page('/from', '/to')
   *   page();
   *
   * @param {String|Function} path
   * @param {Function} fn...
   * @api public
   */

  function page(path, fn) {
    // <callback>
    if ('function' === typeof path) {
      return page('*', path);
    }

    // route <path> to <callback ...>
    if ('function' === typeof fn) {
      var route = new Route(path);
      for (var i = 1; i < arguments.length; ++i) {
        page.callbacks.push(route.middleware(arguments[i]));
      }
      // show <path> with [state]
    } else if ('string' === typeof path) {
      page['string' === typeof fn ? 'redirect' : 'show'](path, fn);
      // start [options]
    } else {
      page.start(path);
    }
  }

  /**
   * Callback functions.
   */

  page.callbacks = [];
  page.exits = [];

  /**
   * Current path being processed
   * @type {String}
   */
  page.current = '';

  /**
   * Number of pages navigated to.
   * @type {number}
   *
   *     page.len == 0;
   *     page('/login');
   *     page.len == 1;
   */

  page.len = 0;

  /**
   * Get or set basepath to `path`.
   *
   * @param {String} path
   * @api public
   */

  page.base = function(path) {
    if (0 === arguments.length) return base;
    base = path;
  };

  /**
   * Bind with the given `options`.
   *
   * Options:
   *
   *    - `click` bind to click events [true]
   *    - `popstate` bind to popstate [true]
   *    - `dispatch` perform initial dispatch [true]
   *
   * @param {Object} options
   * @api public
   */

  page.start = function(options) {
    options = options || {};
    if (running) return;
    running = true;
    if (false === options.dispatch) dispatch = false;
    if (false === options.decodeURLComponents) decodeURLComponents = false;
    if (false !== options.popstate) window.addEventListener('popstate', onpopstate, false);
    if (false !== options.click) {
      document.addEventListener(clickEvent, onclick, false);
    }
    if (true === options.hashbang) hashbang = true;
    if (!dispatch) return;
    var url = (hashbang && ~location.hash.indexOf('#!')) ? location.hash.substr(2) + location.search : location.pathname + location.search + location.hash;
    page.replace(url, null, true, dispatch);
  };

  /**
   * Unbind click and popstate event handlers.
   *
   * @api public
   */

  page.stop = function() {
    if (!running) return;
    page.current = '';
    page.len = 0;
    running = false;
    document.removeEventListener(clickEvent, onclick, false);
    window.removeEventListener('popstate', onpopstate, false);
  };

  /**
   * Show `path` with optional `state` object.
   *
   * @param {String} path
   * @param {Object} state
   * @param {Boolean} dispatch
   * @return {Context}
   * @api public
   */

  page.show = function(path, state, dispatch, push) {
    var ctx = new Context(path, state);
    page.current = ctx.path;
    if (false !== dispatch) page.dispatch(ctx);
    if (false !== ctx.handled && false !== push) ctx.pushState();
    return ctx;
  };

  /**
   * Goes back in the history
   * Back should always let the current route push state and then go back.
   *
   * @param {String} path - fallback path to go back if no more history exists, if undefined defaults to page.base
   * @param {Object} [state]
   * @api public
   */

  page.back = function(path, state) {
    if (page.len > 0) {
      // this may need more testing to see if all browsers
      // wait for the next tick to go back in history
      history.back();
      page.len--;
    } else if (path) {
      setTimeout(function() {
        page.show(path, state);
      });
    }else{
      setTimeout(function() {
        page.show(base, state);
      });
    }
  };


  /**
   * Register route to redirect from one path to other
   * or just redirect to another route
   *
   * @param {String} from - if param 'to' is undefined redirects to 'from'
   * @param {String} [to]
   * @api public
   */
  page.redirect = function(from, to) {
    // Define route from a path to another
    if ('string' === typeof from && 'string' === typeof to) {
      page(from, function(e) {
        setTimeout(function() {
          page.replace(to);
        }, 0);
      });
    }

    // Wait for the push state and replace it with another
    if ('string' === typeof from && 'undefined' === typeof to) {
      setTimeout(function() {
        page.replace(from);
      }, 0);
    }
  };

  /**
   * Replace `path` with optional `state` object.
   *
   * @param {String} path
   * @param {Object} state
   * @return {Context}
   * @api public
   */


  page.replace = function(path, state, init, dispatch) {
    var ctx = new Context(path, state);
    page.current = ctx.path;
    ctx.init = init;
    ctx.save(); // save before dispatching, which may redirect
    if (false !== dispatch) page.dispatch(ctx);
    return ctx;
  };

  /**
   * Dispatch the given `ctx`.
   *
   * @param {Object} ctx
   * @api private
   */

  page.dispatch = function(ctx) {
    var prev = prevContext,
      i = 0,
      j = 0;

    prevContext = ctx;

    function nextExit() {
      var fn = page.exits[j++];
      if (!fn) return nextEnter();
      fn(prev, nextExit);
    }

    function nextEnter() {
      var fn = page.callbacks[i++];

      if (ctx.path !== page.current) {
        ctx.handled = false;
        return;
      }
      if (!fn) return unhandled(ctx);
      fn(ctx, nextEnter);
    }

    if (prev) {
      nextExit();
    } else {
      nextEnter();
    }
  };

  /**
   * Unhandled `ctx`. When it's not the initial
   * popstate then redirect. If you wish to handle
   * 404s on your own use `page('*', callback)`.
   *
   * @param {Context} ctx
   * @api private
   */

  function unhandled(ctx) {
    if (ctx.handled) return;
    var current;

    if (hashbang) {
      current = base + location.hash.replace('#!', '');
    } else {
      current = location.pathname + location.search;
    }

    if (current === ctx.canonicalPath) return;
    page.stop();
    ctx.handled = false;
    location.href = ctx.canonicalPath;
  }

  /**
   * Register an exit route on `path` with
   * callback `fn()`, which will be called
   * on the previous context when a new
   * page is visited.
   */
  page.exit = function(path, fn) {
    if (typeof path === 'function') {
      return page.exit('*', path);
    }

    var route = new Route(path);
    for (var i = 1; i < arguments.length; ++i) {
      page.exits.push(route.middleware(arguments[i]));
    }
  };

  /**
   * Remove URL encoding from the given `str`.
   * Accommodates whitespace in both x-www-form-urlencoded
   * and regular percent-encoded form.
   *
   * @param {str} URL component to decode
   */
  function decodeURLEncodedURIComponent(val) {
    if (typeof val !== 'string') { return val; }
    return decodeURLComponents ? decodeURIComponent(val.replace(/\+/g, ' ')) : val;
  }

  /**
   * Initialize a new "request" `Context`
   * with the given `path` and optional initial `state`.
   *
   * @param {String} path
   * @param {Object} state
   * @api public
   */

  function Context(path, state) {
    if ('/' === path[0] && 0 !== path.indexOf(base)) path = base + (hashbang ? '#!' : '') + path;
    var i = path.indexOf('?');

    this.canonicalPath = path;
    this.path = path.replace(base, '') || '/';
    if (hashbang) this.path = this.path.replace('#!', '') || '/';

    this.title = document.title;
    this.state = state || {};
    this.state.path = path;
    this.querystring = ~i ? decodeURLEncodedURIComponent(path.slice(i + 1)) : '';
    this.pathname = decodeURLEncodedURIComponent(~i ? path.slice(0, i) : path);
    this.params = {};

    // fragment
    this.hash = '';
    if (!hashbang) {
      if (!~this.path.indexOf('#')) return;
      var parts = this.path.split('#');
      this.path = parts[0];
      this.hash = decodeURLEncodedURIComponent(parts[1]) || '';
      this.querystring = this.querystring.split('#')[0];
    }
  }

  /**
   * Expose `Context`.
   */

  page.Context = Context;

  /**
   * Push state.
   *
   * @api private
   */

  Context.prototype.pushState = function() {
    page.len++;
    history.pushState(this.state, this.title, hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
  };

  /**
   * Save the context state.
   *
   * @api public
   */

  Context.prototype.save = function() {
    history.replaceState(this.state, this.title, hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
  };

  /**
   * Initialize `Route` with the given HTTP `path`,
   * and an array of `callbacks` and `options`.
   *
   * Options:
   *
   *   - `sensitive`    enable case-sensitive routes
   *   - `strict`       enable strict matching for trailing slashes
   *
   * @param {String} path
   * @param {Object} options.
   * @api private
   */

  function Route(path, options) {
    options = options || {};
    this.path = (path === '*') ? '(.*)' : path;
    this.method = 'GET';
    this.regexp = pathtoRegexp(this.path,
      this.keys = [],
      options.sensitive,
      options.strict);
  }

  /**
   * Expose `Route`.
   */

  page.Route = Route;

  /**
   * Return route middleware with
   * the given callback `fn()`.
   *
   * @param {Function} fn
   * @return {Function}
   * @api public
   */

  Route.prototype.middleware = function(fn) {
    var self = this;
    return function(ctx, next) {
      if (self.match(ctx.path, ctx.params)) return fn(ctx, next);
      next();
    };
  };

  /**
   * Check if this route matches `path`, if so
   * populate `params`.
   *
   * @param {String} path
   * @param {Object} params
   * @return {Boolean}
   * @api private
   */

  Route.prototype.match = function(path, params) {
    var keys = this.keys,
      qsIndex = path.indexOf('?'),
      pathname = ~qsIndex ? path.slice(0, qsIndex) : path,
      m = this.regexp.exec(decodeURIComponent(pathname));

    if (!m) return false;

    for (var i = 1, len = m.length; i < len; ++i) {
      var key = keys[i - 1];
      var val = decodeURLEncodedURIComponent(m[i]);
      if (val !== undefined || !(hasOwnProperty.call(params, key.name))) {
        params[key.name] = val;
      }
    }

    return true;
  };


  /**
   * Handle "populate" events.
   */

  var onpopstate = (function () {
    var loaded = false;
    if ('undefined' === typeof window) {
      return;
    }
    if (document.readyState === 'complete') {
      loaded = true;
    } else {
      window.addEventListener('load', function() {
        setTimeout(function() {
          loaded = true;
        }, 0);
      });
    }
    return function onpopstate(e) {
      if (!loaded) return;
      if (e.state) {
        var path = e.state.path;
        page.replace(path, e.state);
      } else {
        page.show(location.pathname + location.hash, undefined, undefined, false);
      }
    };
  })();
  /**
   * Handle "click" events.
   */

  function onclick(e) {

    if (1 !== which(e)) return;

    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (e.defaultPrevented) return;



    // ensure link
    var el = e.target;
    while (el && 'A' !== el.nodeName) el = el.parentNode;
    if (!el || 'A' !== el.nodeName) return;



    // Ignore if tag has
    // 1. "download" attribute
    // 2. rel="external" attribute
    if (el.hasAttribute('download') || el.getAttribute('rel') === 'external') return;

    // ensure non-hash for the same path
    var link = el.getAttribute('href');
    if (!hashbang && el.pathname === location.pathname && (el.hash || '#' === link)) return;



    // Check for mailto: in the href
    if (link && link.indexOf('mailto:') > -1) return;

    // check target
    if (el.target) return;

    // x-origin
    if (!sameOrigin(el.href)) return;



    // rebuild path
    var path = el.pathname + el.search + (el.hash || '');

    // strip leading "/[drive letter]:" on NW.js on Windows
    if (typeof process !== 'undefined' && path.match(/^\/[a-zA-Z]:\//)) {
      path = path.replace(/^\/[a-zA-Z]:\//, '/');
    }

    // same page
    var orig = path;

    if (path.indexOf(base) === 0) {
      path = path.substr(base.length);
    }

    if (hashbang) path = path.replace('#!', '');

    if (base && orig === path) return;

    e.preventDefault();
    page.show(orig);
  }

  /**
   * Event button.
   */

  function which(e) {
    e = e || window.event;
    return null === e.which ? e.button : e.which;
  }

  /**
   * Check if `href` is the same origin.
   */

  function sameOrigin(href) {
    var origin = location.protocol + '//' + location.hostname;
    if (location.port) origin += ':' + location.port;
    return (href && (0 === href.indexOf(origin)));
  }

  page.sameOrigin = sameOrigin;

}).call(this,require('_process'))
},{"_process":15,"path-to-regexp":14}],14:[function(require,module,exports){
var isArray = require('isarray');

/**
 * Expose `pathToRegexp`.
 */
module.exports = pathToRegexp;

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?"]
  // "/route(\\d+)" => [undefined, undefined, undefined, "\d+", undefined]
  '([\\/.])?(?:\\:(\\w+)(?:\\(((?:\\\\.|[^)])*)\\))?|\\(((?:\\\\.|[^)])*)\\))([+*?])?',
  // Match regexp special characters that are always escaped.
  '([.+*?=^!:${}()[\\]|\\/])'
].join('|'), 'g');

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {String} group
 * @return {String}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1');
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {RegExp} re
 * @param  {Array}  keys
 * @return {RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys;
  return re;
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {String}
 */
function flags (options) {
  return options.sensitive ? '' : 'i';
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {RegExp} path
 * @param  {Array}  keys
 * @return {RegExp}
 */
function regexpToRegexp (path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g);

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name:      i,
        delimiter: null,
        optional:  false,
        repeat:    false
      });
    }
  }

  return attachKeys(path, keys);
}

/**
 * Transform an array into a regexp.
 *
 * @param  {Array}  path
 * @param  {Array}  keys
 * @param  {Object} options
 * @return {RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = [];

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source);
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));
  return attachKeys(regexp, keys);
}

/**
 * Replace the specific tags with regexp strings.
 *
 * @param  {String} path
 * @param  {Array}  keys
 * @return {String}
 */
function replacePath (path, keys) {
  var index = 0;

  function replace (_, escaped, prefix, key, capture, group, suffix, escape) {
    if (escaped) {
      return escaped;
    }

    if (escape) {
      return '\\' + escape;
    }

    var repeat   = suffix === '+' || suffix === '*';
    var optional = suffix === '?' || suffix === '*';

    keys.push({
      name:      key || index++,
      delimiter: prefix || '/',
      optional:  optional,
      repeat:    repeat
    });

    prefix = prefix ? ('\\' + prefix) : '';
    capture = escapeGroup(capture || group || '[^' + (prefix || '\\/') + ']+?');

    if (repeat) {
      capture = capture + '(?:' + prefix + capture + ')*';
    }

    if (optional) {
      return '(?:' + prefix + '(' + capture + '))?';
    }

    // Basic parameter support.
    return prefix + '(' + capture + ')';
  }

  return path.replace(PATH_REGEXP, replace);
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(String|RegExp|Array)} path
 * @param  {Array}                 [keys]
 * @param  {Object}                [options]
 * @return {RegExp}
 */
function pathToRegexp (path, keys, options) {
  keys = keys || [];

  if (!isArray(keys)) {
    options = keys;
    keys = [];
  } else if (!options) {
    options = {};
  }

  if (path instanceof RegExp) {
    return regexpToRegexp(path, keys, options);
  }

  if (isArray(path)) {
    return arrayToRegexp(path, keys, options);
  }

  var strict = options.strict;
  var end = options.end !== false;
  var route = replacePath(path, keys);
  var endsWithSlash = path.charAt(path.length - 1) === '/';

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?';
  }

  if (end) {
    route += '$';
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithSlash ? '' : '(?=\\/|$)';
  }

  return attachKeys(new RegExp('^' + route, flags(options)), keys);
}

},{"isarray":1}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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
},{}],17:[function(require,module,exports){
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
},{}],18:[function(require,module,exports){
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
},{"./utils/isPlainObject":24}],19:[function(require,module,exports){
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
},{"./createStore":18,"./utils/applyMiddleware":20,"./utils/bindActionCreators":21,"./utils/combineReducers":22,"./utils/compose":23}],20:[function(require,module,exports){
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
},{"./compose":23}],21:[function(require,module,exports){
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
},{"../utils/mapValues":25}],22:[function(require,module,exports){
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
},{"../createStore":18,"../utils/isPlainObject":24,"../utils/mapValues":25,"../utils/pick":26,"_process":15}],23:[function(require,module,exports){
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
},{}],24:[function(require,module,exports){
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
},{}],25:[function(require,module,exports){
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
},{}],26:[function(require,module,exports){
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
},{}],27:[function(require,module,exports){
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

    src += '&client_id=' + this._clientId;

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

},{}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.fetchTracks = fetchTracks;
exports.play = play;
exports.resume = resume;
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

function resume(player) {
    return function (dispatch) {
        player.audio.play();

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

},{"./constants":30,"soundcloud-audio":27}],29:[function(require,module,exports){
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

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

var logger = (0, _reduxLogger2['default'])();
var store = (0, _redux.applyMiddleware)(_reduxThunk2['default'], logger)(_redux.createStore)(_reducer2['default']);
var player = new _soundcloudAudio2['default'](_constants.CLIENT_ID);

store.dispatch((0, _actions.fetchTracks)(player));

(0, _dom.bindEvents)(player, store.dispatch, store.getState);
(0, _dom.bindClasses)(player, store);

(0, _visualizer2['default'])(player, store);

},{"./actions":28,"./constants":30,"./dom":31,"./reducer":32,"./router":33,"./visualizer":37,"redux":19,"redux-logger":16,"redux-thunk":17,"soundcloud-audio":27}],30:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var RESOLVE_URL = "https://soundcloud.com/theaironearth/sets/the-air-on-earth/s-RibTB";
exports.RESOLVE_URL = RESOLVE_URL;
var CLIENT_ID = "287e0a470aceec7d505ab41e1892fddc";

exports.CLIENT_ID = CLIENT_ID;
var TRACK_NAMES = {
    0: 'exit',
    1: 'ghost',
    2: 'second_skin',
    3: 'reflection',
    4: 'farewell',
    5: 'stillness',
    6: 'young_guns',
    7: 'innocent',
    8: 'wake'
};
exports.TRACK_NAMES = TRACK_NAMES;

},{}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.bindEvents = bindEvents;
exports.bindClasses = bindClasses;

var _actions = require('./actions');

var _constants = require('./constants');

var playBtn = document.getElementById('play');
var pauseBtn = document.getElementById('pause');
var nextBtn = document.getElementById('next');
var prevBtn = document.getElementById('prev');
var playerEl = document.getElementById('listen');
var scrubber = document.getElementById('scrubber');
var scrubberPlayed = document.getElementById('scrubber__played');
var overlay = document.getElementById('overlay');
var body = document.body;
var nav = document.getElementById('nav');
var pageNavs = Array.from(document.querySelectorAll('.subnav > li > a'));
var navTracklist = document.getElementById('nav-tracklist');
var trackList = Array.from(document.querySelectorAll('.tracklist'));
var sections = Array.from(document.querySelectorAll('.section'));

function getIndex(li) {
    var children = Array.from(li.parentNode.children);

    return children.indexOf(li);
}

function setActiveSection(id) {
    var classList = Array.from(body.classList).find(function (cls) {
        return (/--active/.test(cls)
        );
    });

    body.classList.remove(classList);
    body.classList.add(id + '--active');
}

function setActiveTrackClass(currentTrackIndex) {
    var trackClass = Array.from(body.classList).find(function (cls) {
        return (/track--/.test(cls)
        );
    });
    var trackName = _constants.TRACK_NAMES[currentTrackIndex];

    body.classList.remove(trackClass);
    body.classList.add('track--' + trackName);
}

function activateEl(els, filterFn) {
    els.map(function (el) {
        el.classList.remove('active');
        return el;
    }).filter(filterFn).map(function (el) {
        el.classList.add('active');
        return el;
    });
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

    player.on('timeupdate', function (e) {
        var duration = player.audio.duration;
        var currentTime = player.audio.currentTime;
        var percent = currentTime / duration * 100;
        scrubberPlayed.style.width = percent + '%';
    });

    playBtn.addEventListener('click', function (e) {
        var state = getState();
        var isPlaying = state.isPlaying;
        var isPaused = state.isPaused;

        if (isPaused) {
            dispatch((0, _actions.resume)(player));
        } else if (!isPlaying) {
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
        var offset = e.offsetX;
        var width = scrubber.offsetWidth;
        var percent = offset / width;
        player.audio.currentTime = percent * (player.audio.duration || 0);
    });

    navTracklist.addEventListener('click', function (e) {
        if (e.target && e.target.nodeName === 'A') {
            var target = e.target;
            var parentNode = target.parentNode;
            var index = getIndex(parentNode);

            dispatch((0, _actions.play)(player, index));

            e.preventDefault();
            e.stopPropagation();
        }
    });

    nav.addEventListener('click', function (e) {
        if (e.target && e.target.nodeName === 'A') {
            var hash = e.target.hash;
            var id = hash && hash.slice(1) || 'listen';

            //activateEl(pageNavs, el => el.hash === hash);
            //activateEl(sections, el => el.getAttribute('id') === id);
            setActiveSection(id);

            if (window.history) {
                window.history.pushState({ activeSection: id }, null, hash);
            }

            e.preventDefault();
        }
    });

    window.addEventListener('popstate', function (e) {
        var activeSection = e.state.activeSection;

        if (activeSection) {
            setActiveSection(activeSection);
        } else {
            setActiveSection('listen');
        }
    });

    if (document.location.hash) {
        var hash = document.location.hash;

        setActiveSection(hash.slice(1));
    }
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
            scrubber.style.width = '100%';

            setActiveTrackClass(currentTrackIndex);

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

},{"./actions":28,"./constants":30}],32:[function(require,module,exports){
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
                hue: action.payload.hue || state.hue,
                saturation: action.payload.saturation || state.saturation,
                lightness: action.payload.lightness || state.lightness
            });
        default:
            return state;
    }
};

module.exports = exports['default'];

},{"./actions":28}],33:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = createRouter;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _page = require('page');

var _page2 = _interopRequireDefault(_page);

var pageNavEls = Array.from(document.querySelectorAll('.subnav > li > a'));

function createRouter() {
    function route(ctx, next) {
        var hash = ctx.hash;

        pageNavEls.map(function (el) {
            el.classList.remove('active');
            return el;
        }).filter(function (el) {
            return el.href = hash;
        }).map(function (el) {
            return el.classList.add('active');
        });
    }

    (0, _page2['default'])('*', route);
    (0, _page2['default'])();
}

module.exports = exports['default'];

},{"page":13}],34:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = randomBetween;

function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = exports["default"];

},{}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodashFunctionOnce = require('lodash/function/once');

var _lodashFunctionOnce2 = _interopRequireDefault(_lodashFunctionOnce);

var _mountains = require('./mountains');

var _mountains2 = _interopRequireDefault(_mountains);

var POINTS = 256;
exports.POINTS = POINTS;
var INIT_POINTS = 50;
exports.INIT_POINTS = INIT_POINTS;
var amplitude = 5;
exports.amplitude = amplitude;
var ANGLE = 10;
exports.ANGLE = ANGLE;
var RADIUS = 200;
exports.RADIUS = RADIUS;
var COLOR_AMP = 0.4;

exports.COLOR_AMP = COLOR_AMP;
exports['default'] = {

    // Exit
    "0": {
        hue: 32,
        saturation: 50,
        lightness: 81,
        strokeColor: 'rgba(144, 92, 90, 0.5)'
    },

    // Ghost
    "1": {
        hue: 30,
        saturation: 84,
        lightness: 84,
        hitpoints: [89, 150]
    },

    // Second Skin
    "2": {
        hue: 213,
        saturation: 50,
        lightness: 29
    },

    // Reflection
    "3": {
        hue: 227,
        saturation: 50,
        lightness: 9
    },

    //Farewell
    "4": {
        hue: 230,
        saturation: 50,
        lightness: 2
    },

    // Stillness
    "5": {
        hue: 7,
        saturation: 50,
        lightness: 14
    },

    // Young Guns
    "6": {
        hue: 2,
        saturation: 23,
        lightness: 46
    },

    // Innocent
    "7": {
        hue: 26,
        saturation: 49,
        lightness: 67
    },

    // Wake
    "8": {
        hue: 175,
        saturation: 17,
        lightness: 78
    }
};

},{"./mountains":38,"lodash/function/once":3}],36:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = generateMountains;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodashUtilityRange = require('lodash/utility/range');

var _lodashUtilityRange2 = _interopRequireDefault(_lodashUtilityRange);

var _lodashFunctionOnce = require('lodash/function/once');

var _lodashFunctionOnce2 = _interopRequireDefault(_lodashFunctionOnce);

var _config = require('./config');

var _actions = require('../actions');

var _utilsRandomBetween = require('../utils/randomBetween');

var _utilsRandomBetween2 = _interopRequireDefault(_utilsRandomBetween);

var maxAlpha = 0.3;

function initMountain(paper) {
    var mirrored = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    var path = new paper.Path();
    var width = paper.view.size.width;
    var height = paper.view.size.height;
    var widthOffset = 50;
    var red = 36;

    red += 20;

    path.closed = false;
    path.position.x = 0;
    path.position.y = paper.view.size.height;
    path.strokeColor = 'rgba(' + red + ', 70, 111, 0.3)';
    path.fillColor = 'rgba(' + red + ', 70, 111, 0)';
    path.mirrored = mirrored;

    path.add(new paper.Point(mirrored ? width + widthOffset : -widthOffset, height));

    path.position.y = paper.view.size.height;

    path.smooth();

    return path;
}

function initPath(paper) {
    var path = new paper.Path();
    var width = paper.view.size.width;
    var height = paper.view.size.height;
    var radius = 100;

    path.strokeColor = 'rgba(144, 92, 90, 0.5)';
    path.fillColor = 'rgba(144, 92, 90, 0.5)';
    path.strokeWidth = 1;
    path.smooth();

    var interval = width / _config.POINTS;

    (0, _lodashUtilityRange2['default'])(_config.POINTS).map(function (pnt) {
        path.add(new paper.Point(pnt * interval, 600));
    });

    path.position.y = height;

    return path;
}

function generateMountains(paper, player, store, trackConfig) {

    var width = paper.view.size.width;
    var height = paper.view.size.height;
    var path = initPath(paper);
    var barHeight = undefined;

    return function (data, event) {

        path.segments = path.segments.map(function (seg, idx) {
            if (idx !== 0 && idx !== path.segments.length - 1) {
                barHeight = data[idx] / 2;
                seg.point.y = height - barHeight;

                return seg;
            } else {
                return seg;
            }
        });
    };
}

module.exports = exports['default'];

},{"../actions":28,"../utils/randomBetween":34,"./config":35,"lodash/function/once":3,"lodash/utility/range":12}],37:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = createVisualizer;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodashUtilityRange = require('lodash/utility/range');

var _lodashUtilityRange2 = _interopRequireDefault(_lodashUtilityRange);

var _lodashNumberInRange = require('lodash/number/inRange');

var _lodashNumberInRange2 = _interopRequireDefault(_lodashNumberInRange);

var _lodashFunctionOnce = require('lodash/function/once');

var _lodashFunctionOnce2 = _interopRequireDefault(_lodashFunctionOnce);

var _mountains = require('./mountains');

var _mountains2 = _interopRequireDefault(_mountains);

var _freq = require('./freq');

var _freq2 = _interopRequireDefault(_freq);

var _actions = require('../actions');

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function render(player, store, analyser, freqByteData, paper) {

    var state = store.getState();
    var currentTrackIndex = state.currentTrackIndex;
    var trackConfig = _config2['default'][currentTrackIndex];
    var strokeColor = trackConfig.strokeColor;
    var hitpoints = trackConfig.hitpoints;

    store.dispatch((0, _actions.changeBackground)({
        hue: trackConfig.hue,
        saturation: trackConfig.saturation,
        lightness: trackConfig.lightness
    }));

    function run() {
        var visualizer = (0, _freq2['default'])(paper, player, store, trackConfig);

        return paper.view.onFrame = function (event) {

            if (event.count % 5 === 0) {

                analyser.getByteFrequencyData(freqByteData);

                visualizer(freqByteData, event);

                paper.view.draw();
            }
        };
    }

    var dispose = store.subscribe(function () {
        var state = store.getState();

        if (currentTrackIndex !== state.currentTrackIndex) {
            currentTrackIndex = state.currentTrackIndex;
            trackConfig = _config2['default'][currentTrackIndex];
            strokeColor = trackConfig.strokeColor;

            store.dispatch((0, _actions.changeBackground)({
                hue: trackConfig.hue,
                saturation: trackConfig.saturation,
                lightness: trackConfig.lightness
            }));

            //paper.view.off('frame');

            //run();
        }

        if (!state.isPlaying) {
            paper.view.off('frame');
        }
    });

    return run();
}

function initPath(totalWidth, totalHeight) {

    var path = new paper.Path();

    path.closed = false;
    path.strokeWidth = 1;
    path.strokeColor = 'rgba(0,0,0,0)';

    var midX = totalWidth / 2;
    var midY = totalHeight / 2;
    var startX = midX - _config.POINTS / 2;

    function initDraw(point) {
        path.add(point);
        paper.view.draw();
    }

    (0, _lodashUtilityRange2['default'])(_config.POINTS).map(function (i, idx) {
        var point = new paper.Point(0, 0);

        path.add(point);
    });

    return path;
}

function initPaper(canvas) {
    paper.setup(canvas);
    paper.view.fillColor = 'rgb(255,255,233)';

    return paper;
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

    var paper = initPaper(canvas);

    var dispose = store.subscribe(function () {
        var state = store.getState();

        if (state.isPlaying) {
            // Just listen for the first play and cancel the subscription
            // after that.
            dispose();

            render(player, store, analyser, freqByteData, paper);
        }
    });
}

module.exports = exports['default'];

},{"../actions":28,"./config":35,"./freq":36,"./mountains":38,"lodash/function/once":3,"lodash/number/inRange":11,"lodash/utility/range":12}],38:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = generateMountains;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodashUtilityRange = require('lodash/utility/range');

var _lodashUtilityRange2 = _interopRequireDefault(_lodashUtilityRange);

var _lodashFunctionOnce = require('lodash/function/once');

var _lodashFunctionOnce2 = _interopRequireDefault(_lodashFunctionOnce);

var _config = require('./config');

var _actions = require('../actions');

var _utilsRandomBetween = require('../utils/randomBetween');

var _utilsRandomBetween2 = _interopRequireDefault(_utilsRandomBetween);

var maxAlpha = 0.3;

function initMountain(paper) {
    var mirrored = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    var path = new paper.Path();
    var width = paper.view.size.width;
    var height = paper.view.size.height;
    var widthOffset = 50;
    var red = 36;

    red += 20;

    path.closed = false;
    path.position.x = 0;
    path.position.y = paper.view.size.height;
    path.strokeColor = 'rgba(' + red + ', 70, 111, 0.3)';
    path.fillColor = 'rgba(' + red + ', 70, 111, 0)';
    path.mirrored = mirrored;

    path.add(new paper.Point(mirrored ? width + widthOffset : -widthOffset, height));

    path.position.y = paper.view.size.height;

    path.smooth();

    return path;
}

function initSun(paper) {
    var path = new paper.Path();
    var width = paper.view.size.width;
    var height = paper.view.size.height;
    var radius = 100;

    path.strokeColor = 'rgba(144, 92, 90, 0.5)';
    path.fillColor = 'rgba(144, 92, 90, 0)';
    path.strokeWidth = 1;
    path.smooth();

    path.position.x = width / 2;
    path.position.y = height / 2;

    return path;
}

function initRays(paper) {
    var path = new paper.Path();
    var width = paper.view.size.width;
    var height = paper.view.size.height;
    var radius = 100;

    path.strokeColor = 'rgba(144, 92, 90, 0.4)';
    path.fillColor = 'rgba(144, 92, 90, 0.4)';
    path.strokeWidth = 1;
    path.smooth();

    path.position.x = width * 0.25;
    path.position.y = 100;

    return path;
}

var dimLights = (0, _lodashFunctionOnce2['default'])(function (store) {
    var state = store.getState();

    store.dispatch((0, _actions.changeBackground)({
        hue: state.hue - 5
    }));
});

function generateMountains(paper, player, store, trackConfig) {

    var width = paper.view.size.width;
    var height = paper.view.size.height;
    var hitpoints = trackConfig.hitpoints || [];
    var hits = [];
    var currentHitpointIndex = 0;

    var mountains = [initMountain(paper)];
    var interval = width / _config.POINTS;
    var currentMountainIndex = 0;
    var heightOffset = 0;

    var sun = initSun(paper);
    var rays = initRays(paper);
    var lastSegment = undefined;
    var maxMountains = 10;
    var radius = 100;

    return function (data, event) {

        var currentHitpoint = hitpoints.length && hitpoints[currentHitpointIndex];

        if (currentHitpoint && player.audio.currentTime > currentHitpoint) {
            if (hits.indexOf(currentHitpoint) === -1) {
                hits.push(currentHitpoint);
                ++currentHitpointIndex;
            }
        }

        var mountain = mountains[currentMountainIndex];
        var lastMountain = mountains[currentMountainIndex - 1];
        var length = mountain.segments.length;

        if (lastMountain && lastMountain.animatingFill) {
            if (lastMountain.fillColor.alpha < maxAlpha) {
                lastMountain.fillColor.alpha += 0.01;
            } else {
                lastMountain.animatingFill = false;
            }
        }

        if (mountains.length >= 0 && mountains.length <= maxMountains) {

            if (event.count !== 0 && event.count % _config.POINTS === 0) {
                heightOffset += 5;
                mountains.push(initMountain(paper, !mountain.mirrored));

                ++currentMountainIndex;
            }

            if (length + 1 >= _config.POINTS) {
                var x = mountain.mirrored ? 0 : width;
                var point = new paper.Point(x, height);
                mountain.add(point);
                mountain.animatingFill = true;
            } else {
                var i = length + 1;
                var x = mountain.mirrored ? width - i * interval : i * interval;
                var y = height - data[i] * (_config.amplitude / 20) - heightOffset;
                var point = new paper.Point(x, y);
                mountain.add(point);
            }
        }
    };
}

module.exports = exports['default'];

},{"../actions":28,"../utils/randomBetween":34,"./config":35,"lodash/function/once":3,"lodash/utility/range":12}]},{},[29]);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJidW5kbGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkoezE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xubW9kdWxlLmV4cG9ydHMgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIChhcnIpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcnIpID09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuXG59LHt9XSwyOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbi8qKiBVc2VkIGFzIHRoZSBgVHlwZUVycm9yYCBtZXNzYWdlIGZvciBcIkZ1bmN0aW9uc1wiIG1ldGhvZHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGZ1bmNgLCB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBhbmQgYXJndW1lbnRzXG4gKiBvZiB0aGUgY3JlYXRlZCBmdW5jdGlvbiwgd2hpbGUgaXQncyBjYWxsZWQgbGVzcyB0aGFuIGBuYCB0aW1lcy4gU3Vic2VxdWVudFxuICogY2FsbHMgdG8gdGhlIGNyZWF0ZWQgZnVuY3Rpb24gcmV0dXJuIHRoZSByZXN1bHQgb2YgdGhlIGxhc3QgYGZ1bmNgIGludm9jYXRpb24uXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtudW1iZXJ9IG4gVGhlIG51bWJlciBvZiBjYWxscyBhdCB3aGljaCBgZnVuY2AgaXMgbm8gbG9uZ2VyIGludm9rZWQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byByZXN0cmljdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHJlc3RyaWN0ZWQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIGpRdWVyeSgnI2FkZCcpLm9uKCdjbGljaycsIF8uYmVmb3JlKDUsIGFkZENvbnRhY3RUb0xpc3QpKTtcbiAqIC8vID0+IGFsbG93cyBhZGRpbmcgdXAgdG8gNCBjb250YWN0cyB0byB0aGUgbGlzdFxuICovXG5mdW5jdGlvbiBiZWZvcmUobiwgZnVuYykge1xuICB2YXIgcmVzdWx0O1xuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgIGlmICh0eXBlb2YgbiA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB2YXIgdGVtcCA9IG47XG4gICAgICBuID0gZnVuYztcbiAgICAgIGZ1bmMgPSB0ZW1wO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBpZiAoLS1uID4gMCkge1xuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgICBpZiAobiA8PSAxKSB7XG4gICAgICBmdW5jID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJlZm9yZTtcblxufSx7fV0sMzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG52YXIgYmVmb3JlID0gcmVxdWlyZSgnLi9iZWZvcmUnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBpcyByZXN0cmljdGVkIHRvIGludm9raW5nIGBmdW5jYCBvbmNlLiBSZXBlYXQgY2FsbHNcbiAqIHRvIHRoZSBmdW5jdGlvbiByZXR1cm4gdGhlIHZhbHVlIG9mIHRoZSBmaXJzdCBjYWxsLiBUaGUgYGZ1bmNgIGlzIGludm9rZWRcbiAqIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIGFuZCBhcmd1bWVudHMgb2YgdGhlIGNyZWF0ZWQgZnVuY3Rpb24uXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gcmVzdHJpY3QuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyByZXN0cmljdGVkIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgaW5pdGlhbGl6ZSA9IF8ub25jZShjcmVhdGVBcHBsaWNhdGlvbik7XG4gKiBpbml0aWFsaXplKCk7XG4gKiBpbml0aWFsaXplKCk7XG4gKiAvLyBgaW5pdGlhbGl6ZWAgaW52b2tlcyBgY3JlYXRlQXBwbGljYXRpb25gIG9uY2VcbiAqL1xuZnVuY3Rpb24gb25jZShmdW5jKSB7XG4gIHJldHVybiBiZWZvcmUoMiwgZnVuYyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb25jZTtcblxufSx7XCIuL2JlZm9yZVwiOjJ9XSw0OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucHJvcGVydHlgIHdpdGhvdXQgc3VwcG9ydCBmb3IgZGVlcCBwYXRocy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVByb3BlcnR5KGtleSkge1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVByb3BlcnR5O1xuXG59LHt9XSw1OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbnZhciBiYXNlUHJvcGVydHkgPSByZXF1aXJlKCcuL2Jhc2VQcm9wZXJ0eScpO1xuXG4vKipcbiAqIEdldHMgdGhlIFwibGVuZ3RoXCIgcHJvcGVydHkgdmFsdWUgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCB0byBhdm9pZCBhIFtKSVQgYnVnXShodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTQyNzkyKVxuICogdGhhdCBhZmZlY3RzIFNhZmFyaSBvbiBhdCBsZWFzdCBpT1MgOC4xLTguMyBBUk02NC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIFwibGVuZ3RoXCIgdmFsdWUuXG4gKi9cbnZhciBnZXRMZW5ndGggPSBiYXNlUHJvcGVydHkoJ2xlbmd0aCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdldExlbmd0aDtcblxufSx7XCIuL2Jhc2VQcm9wZXJ0eVwiOjR9XSw2OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbnZhciBnZXRMZW5ndGggPSByZXF1aXJlKCcuL2dldExlbmd0aCcpLFxuICAgIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi9pc0xlbmd0aCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0FycmF5TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiBpc0xlbmd0aChnZXRMZW5ndGgodmFsdWUpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0FycmF5TGlrZTtcblxufSx7XCIuL2dldExlbmd0aFwiOjUsXCIuL2lzTGVuZ3RoXCI6OX1dLDc6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuLyoqIFVzZWQgdG8gZGV0ZWN0IHVuc2lnbmVkIGludGVnZXIgdmFsdWVzLiAqL1xudmFyIHJlSXNVaW50ID0gL15cXGQrJC87XG5cbi8qKlxuICogVXNlZCBhcyB0aGUgW21heGltdW0gbGVuZ3RoXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1udW1iZXIubWF4X3NhZmVfaW50ZWdlcilcbiAqIG9mIGFuIGFycmF5LWxpa2UgdmFsdWUuXG4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgaW5kZXguXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHBhcmFtIHtudW1iZXJ9IFtsZW5ndGg9TUFYX1NBRkVfSU5URUdFUl0gVGhlIHVwcGVyIGJvdW5kcyBvZiBhIHZhbGlkIGluZGV4LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBpbmRleCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0luZGV4KHZhbHVlLCBsZW5ndGgpIHtcbiAgdmFsdWUgPSAodHlwZW9mIHZhbHVlID09ICdudW1iZXInIHx8IHJlSXNVaW50LnRlc3QodmFsdWUpKSA/ICt2YWx1ZSA6IC0xO1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG4gIHJldHVybiB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDwgbGVuZ3RoO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzSW5kZXg7XG5cbn0se31dLDg6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xudmFyIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpLFxuICAgIGlzSW5kZXggPSByZXF1aXJlKCcuL2lzSW5kZXgnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2xhbmcvaXNPYmplY3QnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgdGhlIHByb3ZpZGVkIGFyZ3VtZW50cyBhcmUgZnJvbSBhbiBpdGVyYXRlZSBjYWxsLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgdmFsdWUgYXJndW1lbnQuXG4gKiBAcGFyYW0geyp9IGluZGV4IFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgaW5kZXggb3Iga2V5IGFyZ3VtZW50LlxuICogQHBhcmFtIHsqfSBvYmplY3QgVGhlIHBvdGVudGlhbCBpdGVyYXRlZSBvYmplY3QgYXJndW1lbnQuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGFyZ3VtZW50cyBhcmUgZnJvbSBhbiBpdGVyYXRlZSBjYWxsLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSXRlcmF0ZWVDYWxsKHZhbHVlLCBpbmRleCwgb2JqZWN0KSB7XG4gIGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgdHlwZSA9IHR5cGVvZiBpbmRleDtcbiAgaWYgKHR5cGUgPT0gJ251bWJlcidcbiAgICAgID8gKGlzQXJyYXlMaWtlKG9iamVjdCkgJiYgaXNJbmRleChpbmRleCwgb2JqZWN0Lmxlbmd0aCkpXG4gICAgICA6ICh0eXBlID09ICdzdHJpbmcnICYmIGluZGV4IGluIG9iamVjdCkpIHtcbiAgICB2YXIgb3RoZXIgPSBvYmplY3RbaW5kZXhdO1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdmFsdWUgPyAodmFsdWUgPT09IG90aGVyKSA6IChvdGhlciAhPT0gb3RoZXIpO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0l0ZXJhdGVlQ2FsbDtcblxufSx7XCIuLi9sYW5nL2lzT2JqZWN0XCI6MTAsXCIuL2lzQXJyYXlMaWtlXCI6NixcIi4vaXNJbmRleFwiOjd9XSw5OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbi8qKlxuICogVXNlZCBhcyB0aGUgW21heGltdW0gbGVuZ3RoXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1udW1iZXIubWF4X3NhZmVfaW50ZWdlcilcbiAqIG9mIGFuIGFycmF5LWxpa2UgdmFsdWUuXG4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIGlzIGJhc2VkIG9uIFtgVG9MZW5ndGhgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy10b2xlbmd0aCkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBsZW5ndGgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNMZW5ndGgodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJiB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNMZW5ndGg7XG5cbn0se31dLDEwOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlIFtsYW5ndWFnZSB0eXBlXShodHRwczovL2VzNS5naXRodWIuaW8vI3g4KSBvZiBgT2JqZWN0YC5cbiAqIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoMSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICAvLyBBdm9pZCBhIFY4IEpJVCBidWcgaW4gQ2hyb21lIDE5LTIwLlxuICAvLyBTZWUgaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTIyOTEgZm9yIG1vcmUgZGV0YWlscy5cbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAhIXZhbHVlICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3Q7XG5cbn0se31dLDExOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbi8qIE5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXgsXG4gICAgbmF0aXZlTWluID0gTWF0aC5taW47XG5cbi8qKlxuICogQ2hlY2tzIGlmIGBuYCBpcyBiZXR3ZWVuIGBzdGFydGAgYW5kIHVwIHRvIGJ1dCBub3QgaW5jbHVkaW5nLCBgZW5kYC4gSWZcbiAqIGBlbmRgIGlzIG5vdCBzcGVjaWZpZWQgaXQncyBzZXQgdG8gYHN0YXJ0YCB3aXRoIGBzdGFydGAgdGhlbiBzZXQgdG8gYDBgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTnVtYmVyXG4gKiBAcGFyYW0ge251bWJlcn0gbiBUaGUgbnVtYmVyIHRvIGNoZWNrLlxuICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydD0wXSBUaGUgc3RhcnQgb2YgdGhlIHJhbmdlLlxuICogQHBhcmFtIHtudW1iZXJ9IGVuZCBUaGUgZW5kIG9mIHRoZSByYW5nZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgbmAgaXMgaW4gdGhlIHJhbmdlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaW5SYW5nZSgzLCAyLCA0KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmluUmFuZ2UoNCwgOCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pblJhbmdlKDQsIDIpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmluUmFuZ2UoMiwgMik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaW5SYW5nZSgxLjIsIDIpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaW5SYW5nZSg1LjIsIDQpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaW5SYW5nZSh2YWx1ZSwgc3RhcnQsIGVuZCkge1xuICBzdGFydCA9ICtzdGFydCB8fCAwO1xuICBpZiAoZW5kID09PSB1bmRlZmluZWQpIHtcbiAgICBlbmQgPSBzdGFydDtcbiAgICBzdGFydCA9IDA7XG4gIH0gZWxzZSB7XG4gICAgZW5kID0gK2VuZCB8fCAwO1xuICB9XG4gIHJldHVybiB2YWx1ZSA+PSBuYXRpdmVNaW4oc3RhcnQsIGVuZCkgJiYgdmFsdWUgPCBuYXRpdmVNYXgoc3RhcnQsIGVuZCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5SYW5nZTtcblxufSx7fV0sMTI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xudmFyIGlzSXRlcmF0ZWVDYWxsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvaXNJdGVyYXRlZUNhbGwnKTtcblxuLyogTmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVDZWlsID0gTWF0aC5jZWlsLFxuICAgIG5hdGl2ZU1heCA9IE1hdGgubWF4O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgbnVtYmVycyAocG9zaXRpdmUgYW5kL29yIG5lZ2F0aXZlKSBwcm9ncmVzc2luZyBmcm9tXG4gKiBgc3RhcnRgIHVwIHRvLCBidXQgbm90IGluY2x1ZGluZywgYGVuZGAuIElmIGBlbmRgIGlzIG5vdCBzcGVjaWZpZWQgaXQnc1xuICogc2V0IHRvIGBzdGFydGAgd2l0aCBgc3RhcnRgIHRoZW4gc2V0IHRvIGAwYC4gSWYgYGVuZGAgaXMgbGVzcyB0aGFuIGBzdGFydGBcbiAqIGEgemVyby1sZW5ndGggcmFuZ2UgaXMgY3JlYXRlZCB1bmxlc3MgYSBuZWdhdGl2ZSBgc3RlcGAgaXMgc3BlY2lmaWVkLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgVXRpbGl0eVxuICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydD0wXSBUaGUgc3RhcnQgb2YgdGhlIHJhbmdlLlxuICogQHBhcmFtIHtudW1iZXJ9IGVuZCBUaGUgZW5kIG9mIHRoZSByYW5nZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RlcD0xXSBUaGUgdmFsdWUgdG8gaW5jcmVtZW50IG9yIGRlY3JlbWVudCBieS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGFycmF5IG9mIG51bWJlcnMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8ucmFuZ2UoNCk7XG4gKiAvLyA9PiBbMCwgMSwgMiwgM11cbiAqXG4gKiBfLnJhbmdlKDEsIDUpO1xuICogLy8gPT4gWzEsIDIsIDMsIDRdXG4gKlxuICogXy5yYW5nZSgwLCAyMCwgNSk7XG4gKiAvLyA9PiBbMCwgNSwgMTAsIDE1XVxuICpcbiAqIF8ucmFuZ2UoMCwgLTQsIC0xKTtcbiAqIC8vID0+IFswLCAtMSwgLTIsIC0zXVxuICpcbiAqIF8ucmFuZ2UoMSwgNCwgMCk7XG4gKiAvLyA9PiBbMSwgMSwgMV1cbiAqXG4gKiBfLnJhbmdlKDApO1xuICogLy8gPT4gW11cbiAqL1xuZnVuY3Rpb24gcmFuZ2Uoc3RhcnQsIGVuZCwgc3RlcCkge1xuICBpZiAoc3RlcCAmJiBpc0l0ZXJhdGVlQ2FsbChzdGFydCwgZW5kLCBzdGVwKSkge1xuICAgIGVuZCA9IHN0ZXAgPSB1bmRlZmluZWQ7XG4gIH1cbiAgc3RhcnQgPSArc3RhcnQgfHwgMDtcbiAgc3RlcCA9IHN0ZXAgPT0gbnVsbCA/IDEgOiAoK3N0ZXAgfHwgMCk7XG5cbiAgaWYgKGVuZCA9PSBudWxsKSB7XG4gICAgZW5kID0gc3RhcnQ7XG4gICAgc3RhcnQgPSAwO1xuICB9IGVsc2Uge1xuICAgIGVuZCA9ICtlbmQgfHwgMDtcbiAgfVxuICAvLyBVc2UgYEFycmF5KGxlbmd0aClgIHNvIGVuZ2luZXMgbGlrZSBDaGFrcmEgYW5kIFY4IGF2b2lkIHNsb3dlciBtb2Rlcy5cbiAgLy8gU2VlIGh0dHBzOi8veW91dHUuYmUvWEFxSXBHVThaWmsjdD0xN20yNXMgZm9yIG1vcmUgZGV0YWlscy5cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBuYXRpdmVNYXgobmF0aXZlQ2VpbCgoZW5kIC0gc3RhcnQpIC8gKHN0ZXAgfHwgMSkpLCAwKSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KGxlbmd0aCk7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICByZXN1bHRbaW5kZXhdID0gc3RhcnQ7XG4gICAgc3RhcnQgKz0gc3RlcDtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJhbmdlO1xuXG59LHtcIi4uL2ludGVybmFsL2lzSXRlcmF0ZWVDYWxsXCI6OH1dLDEzOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbihmdW5jdGlvbiAocHJvY2Vzcyl7XG4gIC8qIGdsb2JhbHMgcmVxdWlyZSwgbW9kdWxlICovXG5cbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8qKlxuICAgKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICAgKi9cblxuICB2YXIgcGF0aHRvUmVnZXhwID0gcmVxdWlyZSgncGF0aC10by1yZWdleHAnKTtcblxuICAvKipcbiAgICogTW9kdWxlIGV4cG9ydHMuXG4gICAqL1xuXG4gIG1vZHVsZS5leHBvcnRzID0gcGFnZTtcblxuICAvKipcbiAgICogRGV0ZWN0IGNsaWNrIGV2ZW50XG4gICAqL1xuICB2YXIgY2xpY2tFdmVudCA9ICgndW5kZWZpbmVkJyAhPT0gdHlwZW9mIGRvY3VtZW50KSAmJiBkb2N1bWVudC5vbnRvdWNoc3RhcnQgPyAndG91Y2hzdGFydCcgOiAnY2xpY2snO1xuXG4gIC8qKlxuICAgKiBUbyB3b3JrIHByb3Blcmx5IHdpdGggdGhlIFVSTFxuICAgKiBoaXN0b3J5LmxvY2F0aW9uIGdlbmVyYXRlZCBwb2x5ZmlsbCBpbiBodHRwczovL2dpdGh1Yi5jb20vZGV2b3RlL0hUTUw1LUhpc3RvcnktQVBJXG4gICAqL1xuXG4gIHZhciBsb2NhdGlvbiA9ICgndW5kZWZpbmVkJyAhPT0gdHlwZW9mIHdpbmRvdykgJiYgKHdpbmRvdy5oaXN0b3J5LmxvY2F0aW9uIHx8IHdpbmRvdy5sb2NhdGlvbik7XG5cbiAgLyoqXG4gICAqIFBlcmZvcm0gaW5pdGlhbCBkaXNwYXRjaC5cbiAgICovXG5cbiAgdmFyIGRpc3BhdGNoID0gdHJ1ZTtcblxuXG4gIC8qKlxuICAgKiBEZWNvZGUgVVJMIGNvbXBvbmVudHMgKHF1ZXJ5IHN0cmluZywgcGF0aG5hbWUsIGhhc2gpLlxuICAgKiBBY2NvbW1vZGF0ZXMgYm90aCByZWd1bGFyIHBlcmNlbnQgZW5jb2RpbmcgYW5kIHgtd3d3LWZvcm0tdXJsZW5jb2RlZCBmb3JtYXQuXG4gICAqL1xuICB2YXIgZGVjb2RlVVJMQ29tcG9uZW50cyA9IHRydWU7XG5cbiAgLyoqXG4gICAqIEJhc2UgcGF0aC5cbiAgICovXG5cbiAgdmFyIGJhc2UgPSAnJztcblxuICAvKipcbiAgICogUnVubmluZyBmbGFnLlxuICAgKi9cblxuICB2YXIgcnVubmluZztcblxuICAvKipcbiAgICogSGFzaEJhbmcgb3B0aW9uXG4gICAqL1xuXG4gIHZhciBoYXNoYmFuZyA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBQcmV2aW91cyBjb250ZXh0LCBmb3IgY2FwdHVyaW5nXG4gICAqIHBhZ2UgZXhpdCBldmVudHMuXG4gICAqL1xuXG4gIHZhciBwcmV2Q29udGV4dDtcblxuICAvKipcbiAgICogUmVnaXN0ZXIgYHBhdGhgIHdpdGggY2FsbGJhY2sgYGZuKClgLFxuICAgKiBvciByb3V0ZSBgcGF0aGAsIG9yIHJlZGlyZWN0aW9uLFxuICAgKiBvciBgcGFnZS5zdGFydCgpYC5cbiAgICpcbiAgICogICBwYWdlKGZuKTtcbiAgICogICBwYWdlKCcqJywgZm4pO1xuICAgKiAgIHBhZ2UoJy91c2VyLzppZCcsIGxvYWQsIHVzZXIpO1xuICAgKiAgIHBhZ2UoJy91c2VyLycgKyB1c2VyLmlkLCB7IHNvbWU6ICd0aGluZycgfSk7XG4gICAqICAgcGFnZSgnL3VzZXIvJyArIHVzZXIuaWQpO1xuICAgKiAgIHBhZ2UoJy9mcm9tJywgJy90bycpXG4gICAqICAgcGFnZSgpO1xuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ3xGdW5jdGlvbn0gcGF0aFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbi4uLlxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBmdW5jdGlvbiBwYWdlKHBhdGgsIGZuKSB7XG4gICAgLy8gPGNhbGxiYWNrPlxuICAgIGlmICgnZnVuY3Rpb24nID09PSB0eXBlb2YgcGF0aCkge1xuICAgICAgcmV0dXJuIHBhZ2UoJyonLCBwYXRoKTtcbiAgICB9XG5cbiAgICAvLyByb3V0ZSA8cGF0aD4gdG8gPGNhbGxiYWNrIC4uLj5cbiAgICBpZiAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGZuKSB7XG4gICAgICB2YXIgcm91dGUgPSBuZXcgUm91dGUocGF0aCk7XG4gICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7ICsraSkge1xuICAgICAgICBwYWdlLmNhbGxiYWNrcy5wdXNoKHJvdXRlLm1pZGRsZXdhcmUoYXJndW1lbnRzW2ldKSk7XG4gICAgICB9XG4gICAgICAvLyBzaG93IDxwYXRoPiB3aXRoIFtzdGF0ZV1cbiAgICB9IGVsc2UgaWYgKCdzdHJpbmcnID09PSB0eXBlb2YgcGF0aCkge1xuICAgICAgcGFnZVsnc3RyaW5nJyA9PT0gdHlwZW9mIGZuID8gJ3JlZGlyZWN0JyA6ICdzaG93J10ocGF0aCwgZm4pO1xuICAgICAgLy8gc3RhcnQgW29wdGlvbnNdXG4gICAgfSBlbHNlIHtcbiAgICAgIHBhZ2Uuc3RhcnQocGF0aCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIGZ1bmN0aW9ucy5cbiAgICovXG5cbiAgcGFnZS5jYWxsYmFja3MgPSBbXTtcbiAgcGFnZS5leGl0cyA9IFtdO1xuXG4gIC8qKlxuICAgKiBDdXJyZW50IHBhdGggYmVpbmcgcHJvY2Vzc2VkXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICBwYWdlLmN1cnJlbnQgPSAnJztcblxuICAvKipcbiAgICogTnVtYmVyIG9mIHBhZ2VzIG5hdmlnYXRlZCB0by5cbiAgICogQHR5cGUge251bWJlcn1cbiAgICpcbiAgICogICAgIHBhZ2UubGVuID09IDA7XG4gICAqICAgICBwYWdlKCcvbG9naW4nKTtcbiAgICogICAgIHBhZ2UubGVuID09IDE7XG4gICAqL1xuXG4gIHBhZ2UubGVuID0gMDtcblxuICAvKipcbiAgICogR2V0IG9yIHNldCBiYXNlcGF0aCB0byBgcGF0aGAuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIHBhZ2UuYmFzZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICBpZiAoMCA9PT0gYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGJhc2U7XG4gICAgYmFzZSA9IHBhdGg7XG4gIH07XG5cbiAgLyoqXG4gICAqIEJpbmQgd2l0aCB0aGUgZ2l2ZW4gYG9wdGlvbnNgLlxuICAgKlxuICAgKiBPcHRpb25zOlxuICAgKlxuICAgKiAgICAtIGBjbGlja2AgYmluZCB0byBjbGljayBldmVudHMgW3RydWVdXG4gICAqICAgIC0gYHBvcHN0YXRlYCBiaW5kIHRvIHBvcHN0YXRlIFt0cnVlXVxuICAgKiAgICAtIGBkaXNwYXRjaGAgcGVyZm9ybSBpbml0aWFsIGRpc3BhdGNoIFt0cnVlXVxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBwYWdlLnN0YXJ0ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIGlmIChydW5uaW5nKSByZXR1cm47XG4gICAgcnVubmluZyA9IHRydWU7XG4gICAgaWYgKGZhbHNlID09PSBvcHRpb25zLmRpc3BhdGNoKSBkaXNwYXRjaCA9IGZhbHNlO1xuICAgIGlmIChmYWxzZSA9PT0gb3B0aW9ucy5kZWNvZGVVUkxDb21wb25lbnRzKSBkZWNvZGVVUkxDb21wb25lbnRzID0gZmFsc2U7XG4gICAgaWYgKGZhbHNlICE9PSBvcHRpb25zLnBvcHN0YXRlKSB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBvbnBvcHN0YXRlLCBmYWxzZSk7XG4gICAgaWYgKGZhbHNlICE9PSBvcHRpb25zLmNsaWNrKSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGNsaWNrRXZlbnQsIG9uY2xpY2ssIGZhbHNlKTtcbiAgICB9XG4gICAgaWYgKHRydWUgPT09IG9wdGlvbnMuaGFzaGJhbmcpIGhhc2hiYW5nID0gdHJ1ZTtcbiAgICBpZiAoIWRpc3BhdGNoKSByZXR1cm47XG4gICAgdmFyIHVybCA9IChoYXNoYmFuZyAmJiB+bG9jYXRpb24uaGFzaC5pbmRleE9mKCcjIScpKSA/IGxvY2F0aW9uLmhhc2guc3Vic3RyKDIpICsgbG9jYXRpb24uc2VhcmNoIDogbG9jYXRpb24ucGF0aG5hbWUgKyBsb2NhdGlvbi5zZWFyY2ggKyBsb2NhdGlvbi5oYXNoO1xuICAgIHBhZ2UucmVwbGFjZSh1cmwsIG51bGwsIHRydWUsIGRpc3BhdGNoKTtcbiAgfTtcblxuICAvKipcbiAgICogVW5iaW5kIGNsaWNrIGFuZCBwb3BzdGF0ZSBldmVudCBoYW5kbGVycy5cbiAgICpcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgcGFnZS5zdG9wID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCFydW5uaW5nKSByZXR1cm47XG4gICAgcGFnZS5jdXJyZW50ID0gJyc7XG4gICAgcGFnZS5sZW4gPSAwO1xuICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGNsaWNrRXZlbnQsIG9uY2xpY2ssIGZhbHNlKTtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBvbnBvcHN0YXRlLCBmYWxzZSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNob3cgYHBhdGhgIHdpdGggb3B0aW9uYWwgYHN0YXRlYCBvYmplY3QuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZVxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGRpc3BhdGNoXG4gICAqIEByZXR1cm4ge0NvbnRleHR9XG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIHBhZ2Uuc2hvdyA9IGZ1bmN0aW9uKHBhdGgsIHN0YXRlLCBkaXNwYXRjaCwgcHVzaCkge1xuICAgIHZhciBjdHggPSBuZXcgQ29udGV4dChwYXRoLCBzdGF0ZSk7XG4gICAgcGFnZS5jdXJyZW50ID0gY3R4LnBhdGg7XG4gICAgaWYgKGZhbHNlICE9PSBkaXNwYXRjaCkgcGFnZS5kaXNwYXRjaChjdHgpO1xuICAgIGlmIChmYWxzZSAhPT0gY3R4LmhhbmRsZWQgJiYgZmFsc2UgIT09IHB1c2gpIGN0eC5wdXNoU3RhdGUoKTtcbiAgICByZXR1cm4gY3R4O1xuICB9O1xuXG4gIC8qKlxuICAgKiBHb2VzIGJhY2sgaW4gdGhlIGhpc3RvcnlcbiAgICogQmFjayBzaG91bGQgYWx3YXlzIGxldCB0aGUgY3VycmVudCByb3V0ZSBwdXNoIHN0YXRlIGFuZCB0aGVuIGdvIGJhY2suXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoIC0gZmFsbGJhY2sgcGF0aCB0byBnbyBiYWNrIGlmIG5vIG1vcmUgaGlzdG9yeSBleGlzdHMsIGlmIHVuZGVmaW5lZCBkZWZhdWx0cyB0byBwYWdlLmJhc2VcbiAgICogQHBhcmFtIHtPYmplY3R9IFtzdGF0ZV1cbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgcGFnZS5iYWNrID0gZnVuY3Rpb24ocGF0aCwgc3RhdGUpIHtcbiAgICBpZiAocGFnZS5sZW4gPiAwKSB7XG4gICAgICAvLyB0aGlzIG1heSBuZWVkIG1vcmUgdGVzdGluZyB0byBzZWUgaWYgYWxsIGJyb3dzZXJzXG4gICAgICAvLyB3YWl0IGZvciB0aGUgbmV4dCB0aWNrIHRvIGdvIGJhY2sgaW4gaGlzdG9yeVxuICAgICAgaGlzdG9yeS5iYWNrKCk7XG4gICAgICBwYWdlLmxlbi0tO1xuICAgIH0gZWxzZSBpZiAocGF0aCkge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgcGFnZS5zaG93KHBhdGgsIHN0YXRlKTtcbiAgICAgIH0pO1xuICAgIH1lbHNle1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgcGFnZS5zaG93KGJhc2UsIHN0YXRlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciByb3V0ZSB0byByZWRpcmVjdCBmcm9tIG9uZSBwYXRoIHRvIG90aGVyXG4gICAqIG9yIGp1c3QgcmVkaXJlY3QgdG8gYW5vdGhlciByb3V0ZVxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZnJvbSAtIGlmIHBhcmFtICd0bycgaXMgdW5kZWZpbmVkIHJlZGlyZWN0cyB0byAnZnJvbSdcbiAgICogQHBhcmFtIHtTdHJpbmd9IFt0b11cbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG4gIHBhZ2UucmVkaXJlY3QgPSBmdW5jdGlvbihmcm9tLCB0bykge1xuICAgIC8vIERlZmluZSByb3V0ZSBmcm9tIGEgcGF0aCB0byBhbm90aGVyXG4gICAgaWYgKCdzdHJpbmcnID09PSB0eXBlb2YgZnJvbSAmJiAnc3RyaW5nJyA9PT0gdHlwZW9mIHRvKSB7XG4gICAgICBwYWdlKGZyb20sIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICBwYWdlLnJlcGxhY2UodG8pO1xuICAgICAgICB9LCAwKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFdhaXQgZm9yIHRoZSBwdXNoIHN0YXRlIGFuZCByZXBsYWNlIGl0IHdpdGggYW5vdGhlclxuICAgIGlmICgnc3RyaW5nJyA9PT0gdHlwZW9mIGZyb20gJiYgJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiB0bykge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgcGFnZS5yZXBsYWNlKGZyb20pO1xuICAgICAgfSwgMCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBSZXBsYWNlIGBwYXRoYCB3aXRoIG9wdGlvbmFsIGBzdGF0ZWAgb2JqZWN0LlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgKiBAcGFyYW0ge09iamVjdH0gc3RhdGVcbiAgICogQHJldHVybiB7Q29udGV4dH1cbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cblxuICBwYWdlLnJlcGxhY2UgPSBmdW5jdGlvbihwYXRoLCBzdGF0ZSwgaW5pdCwgZGlzcGF0Y2gpIHtcbiAgICB2YXIgY3R4ID0gbmV3IENvbnRleHQocGF0aCwgc3RhdGUpO1xuICAgIHBhZ2UuY3VycmVudCA9IGN0eC5wYXRoO1xuICAgIGN0eC5pbml0ID0gaW5pdDtcbiAgICBjdHguc2F2ZSgpOyAvLyBzYXZlIGJlZm9yZSBkaXNwYXRjaGluZywgd2hpY2ggbWF5IHJlZGlyZWN0XG4gICAgaWYgKGZhbHNlICE9PSBkaXNwYXRjaCkgcGFnZS5kaXNwYXRjaChjdHgpO1xuICAgIHJldHVybiBjdHg7XG4gIH07XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIHRoZSBnaXZlbiBgY3R4YC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGN0eFxuICAgKiBAYXBpIHByaXZhdGVcbiAgICovXG5cbiAgcGFnZS5kaXNwYXRjaCA9IGZ1bmN0aW9uKGN0eCkge1xuICAgIHZhciBwcmV2ID0gcHJldkNvbnRleHQsXG4gICAgICBpID0gMCxcbiAgICAgIGogPSAwO1xuXG4gICAgcHJldkNvbnRleHQgPSBjdHg7XG5cbiAgICBmdW5jdGlvbiBuZXh0RXhpdCgpIHtcbiAgICAgIHZhciBmbiA9IHBhZ2UuZXhpdHNbaisrXTtcbiAgICAgIGlmICghZm4pIHJldHVybiBuZXh0RW50ZXIoKTtcbiAgICAgIGZuKHByZXYsIG5leHRFeGl0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBuZXh0RW50ZXIoKSB7XG4gICAgICB2YXIgZm4gPSBwYWdlLmNhbGxiYWNrc1tpKytdO1xuXG4gICAgICBpZiAoY3R4LnBhdGggIT09IHBhZ2UuY3VycmVudCkge1xuICAgICAgICBjdHguaGFuZGxlZCA9IGZhbHNlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIWZuKSByZXR1cm4gdW5oYW5kbGVkKGN0eCk7XG4gICAgICBmbihjdHgsIG5leHRFbnRlcik7XG4gICAgfVxuXG4gICAgaWYgKHByZXYpIHtcbiAgICAgIG5leHRFeGl0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5leHRFbnRlcigpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogVW5oYW5kbGVkIGBjdHhgLiBXaGVuIGl0J3Mgbm90IHRoZSBpbml0aWFsXG4gICAqIHBvcHN0YXRlIHRoZW4gcmVkaXJlY3QuIElmIHlvdSB3aXNoIHRvIGhhbmRsZVxuICAgKiA0MDRzIG9uIHlvdXIgb3duIHVzZSBgcGFnZSgnKicsIGNhbGxiYWNrKWAuXG4gICAqXG4gICAqIEBwYXJhbSB7Q29udGV4dH0gY3R4XG4gICAqIEBhcGkgcHJpdmF0ZVxuICAgKi9cblxuICBmdW5jdGlvbiB1bmhhbmRsZWQoY3R4KSB7XG4gICAgaWYgKGN0eC5oYW5kbGVkKSByZXR1cm47XG4gICAgdmFyIGN1cnJlbnQ7XG5cbiAgICBpZiAoaGFzaGJhbmcpIHtcbiAgICAgIGN1cnJlbnQgPSBiYXNlICsgbG9jYXRpb24uaGFzaC5yZXBsYWNlKCcjIScsICcnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3VycmVudCA9IGxvY2F0aW9uLnBhdGhuYW1lICsgbG9jYXRpb24uc2VhcmNoO1xuICAgIH1cblxuICAgIGlmIChjdXJyZW50ID09PSBjdHguY2Fub25pY2FsUGF0aCkgcmV0dXJuO1xuICAgIHBhZ2Uuc3RvcCgpO1xuICAgIGN0eC5oYW5kbGVkID0gZmFsc2U7XG4gICAgbG9jYXRpb24uaHJlZiA9IGN0eC5jYW5vbmljYWxQYXRoO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGFuIGV4aXQgcm91dGUgb24gYHBhdGhgIHdpdGhcbiAgICogY2FsbGJhY2sgYGZuKClgLCB3aGljaCB3aWxsIGJlIGNhbGxlZFxuICAgKiBvbiB0aGUgcHJldmlvdXMgY29udGV4dCB3aGVuIGEgbmV3XG4gICAqIHBhZ2UgaXMgdmlzaXRlZC5cbiAgICovXG4gIHBhZ2UuZXhpdCA9IGZ1bmN0aW9uKHBhdGgsIGZuKSB7XG4gICAgaWYgKHR5cGVvZiBwYXRoID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gcGFnZS5leGl0KCcqJywgcGF0aCk7XG4gICAgfVxuXG4gICAgdmFyIHJvdXRlID0gbmV3IFJvdXRlKHBhdGgpO1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgKytpKSB7XG4gICAgICBwYWdlLmV4aXRzLnB1c2gocm91dGUubWlkZGxld2FyZShhcmd1bWVudHNbaV0pKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBVUkwgZW5jb2RpbmcgZnJvbSB0aGUgZ2l2ZW4gYHN0cmAuXG4gICAqIEFjY29tbW9kYXRlcyB3aGl0ZXNwYWNlIGluIGJvdGggeC13d3ctZm9ybS11cmxlbmNvZGVkXG4gICAqIGFuZCByZWd1bGFyIHBlcmNlbnQtZW5jb2RlZCBmb3JtLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cn0gVVJMIGNvbXBvbmVudCB0byBkZWNvZGVcbiAgICovXG4gIGZ1bmN0aW9uIGRlY29kZVVSTEVuY29kZWRVUklDb21wb25lbnQodmFsKSB7XG4gICAgaWYgKHR5cGVvZiB2YWwgIT09ICdzdHJpbmcnKSB7IHJldHVybiB2YWw7IH1cbiAgICByZXR1cm4gZGVjb2RlVVJMQ29tcG9uZW50cyA/IGRlY29kZVVSSUNvbXBvbmVudCh2YWwucmVwbGFjZSgvXFwrL2csICcgJykpIDogdmFsO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgYSBuZXcgXCJyZXF1ZXN0XCIgYENvbnRleHRgXG4gICAqIHdpdGggdGhlIGdpdmVuIGBwYXRoYCBhbmQgb3B0aW9uYWwgaW5pdGlhbCBgc3RhdGVgLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgKiBAcGFyYW0ge09iamVjdH0gc3RhdGVcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgZnVuY3Rpb24gQ29udGV4dChwYXRoLCBzdGF0ZSkge1xuICAgIGlmICgnLycgPT09IHBhdGhbMF0gJiYgMCAhPT0gcGF0aC5pbmRleE9mKGJhc2UpKSBwYXRoID0gYmFzZSArIChoYXNoYmFuZyA/ICcjIScgOiAnJykgKyBwYXRoO1xuICAgIHZhciBpID0gcGF0aC5pbmRleE9mKCc/Jyk7XG5cbiAgICB0aGlzLmNhbm9uaWNhbFBhdGggPSBwYXRoO1xuICAgIHRoaXMucGF0aCA9IHBhdGgucmVwbGFjZShiYXNlLCAnJykgfHwgJy8nO1xuICAgIGlmIChoYXNoYmFuZykgdGhpcy5wYXRoID0gdGhpcy5wYXRoLnJlcGxhY2UoJyMhJywgJycpIHx8ICcvJztcblxuICAgIHRoaXMudGl0bGUgPSBkb2N1bWVudC50aXRsZTtcbiAgICB0aGlzLnN0YXRlID0gc3RhdGUgfHwge307XG4gICAgdGhpcy5zdGF0ZS5wYXRoID0gcGF0aDtcbiAgICB0aGlzLnF1ZXJ5c3RyaW5nID0gfmkgPyBkZWNvZGVVUkxFbmNvZGVkVVJJQ29tcG9uZW50KHBhdGguc2xpY2UoaSArIDEpKSA6ICcnO1xuICAgIHRoaXMucGF0aG5hbWUgPSBkZWNvZGVVUkxFbmNvZGVkVVJJQ29tcG9uZW50KH5pID8gcGF0aC5zbGljZSgwLCBpKSA6IHBhdGgpO1xuICAgIHRoaXMucGFyYW1zID0ge307XG5cbiAgICAvLyBmcmFnbWVudFxuICAgIHRoaXMuaGFzaCA9ICcnO1xuICAgIGlmICghaGFzaGJhbmcpIHtcbiAgICAgIGlmICghfnRoaXMucGF0aC5pbmRleE9mKCcjJykpIHJldHVybjtcbiAgICAgIHZhciBwYXJ0cyA9IHRoaXMucGF0aC5zcGxpdCgnIycpO1xuICAgICAgdGhpcy5wYXRoID0gcGFydHNbMF07XG4gICAgICB0aGlzLmhhc2ggPSBkZWNvZGVVUkxFbmNvZGVkVVJJQ29tcG9uZW50KHBhcnRzWzFdKSB8fCAnJztcbiAgICAgIHRoaXMucXVlcnlzdHJpbmcgPSB0aGlzLnF1ZXJ5c3RyaW5nLnNwbGl0KCcjJylbMF07XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEV4cG9zZSBgQ29udGV4dGAuXG4gICAqL1xuXG4gIHBhZ2UuQ29udGV4dCA9IENvbnRleHQ7XG5cbiAgLyoqXG4gICAqIFB1c2ggc3RhdGUuXG4gICAqXG4gICAqIEBhcGkgcHJpdmF0ZVxuICAgKi9cblxuICBDb250ZXh0LnByb3RvdHlwZS5wdXNoU3RhdGUgPSBmdW5jdGlvbigpIHtcbiAgICBwYWdlLmxlbisrO1xuICAgIGhpc3RvcnkucHVzaFN0YXRlKHRoaXMuc3RhdGUsIHRoaXMudGl0bGUsIGhhc2hiYW5nICYmIHRoaXMucGF0aCAhPT0gJy8nID8gJyMhJyArIHRoaXMucGF0aCA6IHRoaXMuY2Fub25pY2FsUGF0aCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNhdmUgdGhlIGNvbnRleHQgc3RhdGUuXG4gICAqXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIENvbnRleHQucHJvdG90eXBlLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICBoaXN0b3J5LnJlcGxhY2VTdGF0ZSh0aGlzLnN0YXRlLCB0aGlzLnRpdGxlLCBoYXNoYmFuZyAmJiB0aGlzLnBhdGggIT09ICcvJyA/ICcjIScgKyB0aGlzLnBhdGggOiB0aGlzLmNhbm9uaWNhbFBhdGgpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIGBSb3V0ZWAgd2l0aCB0aGUgZ2l2ZW4gSFRUUCBgcGF0aGAsXG4gICAqIGFuZCBhbiBhcnJheSBvZiBgY2FsbGJhY2tzYCBhbmQgYG9wdGlvbnNgLlxuICAgKlxuICAgKiBPcHRpb25zOlxuICAgKlxuICAgKiAgIC0gYHNlbnNpdGl2ZWAgICAgZW5hYmxlIGNhc2Utc2Vuc2l0aXZlIHJvdXRlc1xuICAgKiAgIC0gYHN0cmljdGAgICAgICAgZW5hYmxlIHN0cmljdCBtYXRjaGluZyBmb3IgdHJhaWxpbmcgc2xhc2hlc1xuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucy5cbiAgICogQGFwaSBwcml2YXRlXG4gICAqL1xuXG4gIGZ1bmN0aW9uIFJvdXRlKHBhdGgsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLnBhdGggPSAocGF0aCA9PT0gJyonKSA/ICcoLiopJyA6IHBhdGg7XG4gICAgdGhpcy5tZXRob2QgPSAnR0VUJztcbiAgICB0aGlzLnJlZ2V4cCA9IHBhdGh0b1JlZ2V4cCh0aGlzLnBhdGgsXG4gICAgICB0aGlzLmtleXMgPSBbXSxcbiAgICAgIG9wdGlvbnMuc2Vuc2l0aXZlLFxuICAgICAgb3B0aW9ucy5zdHJpY3QpO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4cG9zZSBgUm91dGVgLlxuICAgKi9cblxuICBwYWdlLlJvdXRlID0gUm91dGU7XG5cbiAgLyoqXG4gICAqIFJldHVybiByb3V0ZSBtaWRkbGV3YXJlIHdpdGhcbiAgICogdGhlIGdpdmVuIGNhbGxiYWNrIGBmbigpYC5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAgICogQHJldHVybiB7RnVuY3Rpb259XG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5taWRkbGV3YXJlID0gZnVuY3Rpb24oZm4pIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGN0eCwgbmV4dCkge1xuICAgICAgaWYgKHNlbGYubWF0Y2goY3R4LnBhdGgsIGN0eC5wYXJhbXMpKSByZXR1cm4gZm4oY3R4LCBuZXh0KTtcbiAgICAgIG5leHQoKTtcbiAgICB9O1xuICB9O1xuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGlzIHJvdXRlIG1hdGNoZXMgYHBhdGhgLCBpZiBzb1xuICAgKiBwb3B1bGF0ZSBgcGFyYW1zYC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtc1xuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKiBAYXBpIHByaXZhdGVcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLm1hdGNoID0gZnVuY3Rpb24ocGF0aCwgcGFyYW1zKSB7XG4gICAgdmFyIGtleXMgPSB0aGlzLmtleXMsXG4gICAgICBxc0luZGV4ID0gcGF0aC5pbmRleE9mKCc/JyksXG4gICAgICBwYXRobmFtZSA9IH5xc0luZGV4ID8gcGF0aC5zbGljZSgwLCBxc0luZGV4KSA6IHBhdGgsXG4gICAgICBtID0gdGhpcy5yZWdleHAuZXhlYyhkZWNvZGVVUklDb21wb25lbnQocGF0aG5hbWUpKTtcblxuICAgIGlmICghbSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgZm9yICh2YXIgaSA9IDEsIGxlbiA9IG0ubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgIHZhciBrZXkgPSBrZXlzW2kgLSAxXTtcbiAgICAgIHZhciB2YWwgPSBkZWNvZGVVUkxFbmNvZGVkVVJJQ29tcG9uZW50KG1baV0pO1xuICAgICAgaWYgKHZhbCAhPT0gdW5kZWZpbmVkIHx8ICEoaGFzT3duUHJvcGVydHkuY2FsbChwYXJhbXMsIGtleS5uYW1lKSkpIHtcbiAgICAgICAgcGFyYW1zW2tleS5uYW1lXSA9IHZhbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuXG4gIC8qKlxuICAgKiBIYW5kbGUgXCJwb3B1bGF0ZVwiIGV2ZW50cy5cbiAgICovXG5cbiAgdmFyIG9ucG9wc3RhdGUgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBsb2FkZWQgPSBmYWxzZTtcbiAgICBpZiAoJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiB3aW5kb3cpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScpIHtcbiAgICAgIGxvYWRlZCA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgbG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgfSwgMCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmN0aW9uIG9ucG9wc3RhdGUoZSkge1xuICAgICAgaWYgKCFsb2FkZWQpIHJldHVybjtcbiAgICAgIGlmIChlLnN0YXRlKSB7XG4gICAgICAgIHZhciBwYXRoID0gZS5zdGF0ZS5wYXRoO1xuICAgICAgICBwYWdlLnJlcGxhY2UocGF0aCwgZS5zdGF0ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYWdlLnNob3cobG9jYXRpb24ucGF0aG5hbWUgKyBsb2NhdGlvbi5oYXNoLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgZmFsc2UpO1xuICAgICAgfVxuICAgIH07XG4gIH0pKCk7XG4gIC8qKlxuICAgKiBIYW5kbGUgXCJjbGlja1wiIGV2ZW50cy5cbiAgICovXG5cbiAgZnVuY3Rpb24gb25jbGljayhlKSB7XG5cbiAgICBpZiAoMSAhPT0gd2hpY2goZSkpIHJldHVybjtcblxuICAgIGlmIChlLm1ldGFLZXkgfHwgZS5jdHJsS2V5IHx8IGUuc2hpZnRLZXkpIHJldHVybjtcbiAgICBpZiAoZS5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XG5cblxuXG4gICAgLy8gZW5zdXJlIGxpbmtcbiAgICB2YXIgZWwgPSBlLnRhcmdldDtcbiAgICB3aGlsZSAoZWwgJiYgJ0EnICE9PSBlbC5ub2RlTmFtZSkgZWwgPSBlbC5wYXJlbnROb2RlO1xuICAgIGlmICghZWwgfHwgJ0EnICE9PSBlbC5ub2RlTmFtZSkgcmV0dXJuO1xuXG5cblxuICAgIC8vIElnbm9yZSBpZiB0YWcgaGFzXG4gICAgLy8gMS4gXCJkb3dubG9hZFwiIGF0dHJpYnV0ZVxuICAgIC8vIDIuIHJlbD1cImV4dGVybmFsXCIgYXR0cmlidXRlXG4gICAgaWYgKGVsLmhhc0F0dHJpYnV0ZSgnZG93bmxvYWQnKSB8fCBlbC5nZXRBdHRyaWJ1dGUoJ3JlbCcpID09PSAnZXh0ZXJuYWwnKSByZXR1cm47XG5cbiAgICAvLyBlbnN1cmUgbm9uLWhhc2ggZm9yIHRoZSBzYW1lIHBhdGhcbiAgICB2YXIgbGluayA9IGVsLmdldEF0dHJpYnV0ZSgnaHJlZicpO1xuICAgIGlmICghaGFzaGJhbmcgJiYgZWwucGF0aG5hbWUgPT09IGxvY2F0aW9uLnBhdGhuYW1lICYmIChlbC5oYXNoIHx8ICcjJyA9PT0gbGluaykpIHJldHVybjtcblxuXG5cbiAgICAvLyBDaGVjayBmb3IgbWFpbHRvOiBpbiB0aGUgaHJlZlxuICAgIGlmIChsaW5rICYmIGxpbmsuaW5kZXhPZignbWFpbHRvOicpID4gLTEpIHJldHVybjtcblxuICAgIC8vIGNoZWNrIHRhcmdldFxuICAgIGlmIChlbC50YXJnZXQpIHJldHVybjtcblxuICAgIC8vIHgtb3JpZ2luXG4gICAgaWYgKCFzYW1lT3JpZ2luKGVsLmhyZWYpKSByZXR1cm47XG5cblxuXG4gICAgLy8gcmVidWlsZCBwYXRoXG4gICAgdmFyIHBhdGggPSBlbC5wYXRobmFtZSArIGVsLnNlYXJjaCArIChlbC5oYXNoIHx8ICcnKTtcblxuICAgIC8vIHN0cmlwIGxlYWRpbmcgXCIvW2RyaXZlIGxldHRlcl06XCIgb24gTlcuanMgb24gV2luZG93c1xuICAgIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgcGF0aC5tYXRjaCgvXlxcL1thLXpBLVpdOlxcLy8pKSB7XG4gICAgICBwYXRoID0gcGF0aC5yZXBsYWNlKC9eXFwvW2EtekEtWl06XFwvLywgJy8nKTtcbiAgICB9XG5cbiAgICAvLyBzYW1lIHBhZ2VcbiAgICB2YXIgb3JpZyA9IHBhdGg7XG5cbiAgICBpZiAocGF0aC5pbmRleE9mKGJhc2UpID09PSAwKSB7XG4gICAgICBwYXRoID0gcGF0aC5zdWJzdHIoYmFzZS5sZW5ndGgpO1xuICAgIH1cblxuICAgIGlmIChoYXNoYmFuZykgcGF0aCA9IHBhdGgucmVwbGFjZSgnIyEnLCAnJyk7XG5cbiAgICBpZiAoYmFzZSAmJiBvcmlnID09PSBwYXRoKSByZXR1cm47XG5cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgcGFnZS5zaG93KG9yaWcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEV2ZW50IGJ1dHRvbi5cbiAgICovXG5cbiAgZnVuY3Rpb24gd2hpY2goZSkge1xuICAgIGUgPSBlIHx8IHdpbmRvdy5ldmVudDtcbiAgICByZXR1cm4gbnVsbCA9PT0gZS53aGljaCA/IGUuYnV0dG9uIDogZS53aGljaDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBgaHJlZmAgaXMgdGhlIHNhbWUgb3JpZ2luLlxuICAgKi9cblxuICBmdW5jdGlvbiBzYW1lT3JpZ2luKGhyZWYpIHtcbiAgICB2YXIgb3JpZ2luID0gbG9jYXRpb24ucHJvdG9jb2wgKyAnLy8nICsgbG9jYXRpb24uaG9zdG5hbWU7XG4gICAgaWYgKGxvY2F0aW9uLnBvcnQpIG9yaWdpbiArPSAnOicgKyBsb2NhdGlvbi5wb3J0O1xuICAgIHJldHVybiAoaHJlZiAmJiAoMCA9PT0gaHJlZi5pbmRleE9mKG9yaWdpbikpKTtcbiAgfVxuXG4gIHBhZ2Uuc2FtZU9yaWdpbiA9IHNhbWVPcmlnaW47XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKCdfcHJvY2VzcycpKVxufSx7XCJfcHJvY2Vzc1wiOjE1LFwicGF0aC10by1yZWdleHBcIjoxNH1dLDE0OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbnZhciBpc0FycmF5ID0gcmVxdWlyZSgnaXNhcnJheScpO1xuXG4vKipcbiAqIEV4cG9zZSBgcGF0aFRvUmVnZXhwYC5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBwYXRoVG9SZWdleHA7XG5cbi8qKlxuICogVGhlIG1haW4gcGF0aCBtYXRjaGluZyByZWdleHAgdXRpbGl0eS5cbiAqXG4gKiBAdHlwZSB7UmVnRXhwfVxuICovXG52YXIgUEFUSF9SRUdFWFAgPSBuZXcgUmVnRXhwKFtcbiAgLy8gTWF0Y2ggZXNjYXBlZCBjaGFyYWN0ZXJzIHRoYXQgd291bGQgb3RoZXJ3aXNlIGFwcGVhciBpbiBmdXR1cmUgbWF0Y2hlcy5cbiAgLy8gVGhpcyBhbGxvd3MgdGhlIHVzZXIgdG8gZXNjYXBlIHNwZWNpYWwgY2hhcmFjdGVycyB0aGF0IHdvbid0IHRyYW5zZm9ybS5cbiAgJyhcXFxcXFxcXC4pJyxcbiAgLy8gTWF0Y2ggRXhwcmVzcy1zdHlsZSBwYXJhbWV0ZXJzIGFuZCB1bi1uYW1lZCBwYXJhbWV0ZXJzIHdpdGggYSBwcmVmaXhcbiAgLy8gYW5kIG9wdGlvbmFsIHN1ZmZpeGVzLiBNYXRjaGVzIGFwcGVhciBhczpcbiAgLy9cbiAgLy8gXCIvOnRlc3QoXFxcXGQrKT9cIiA9PiBbXCIvXCIsIFwidGVzdFwiLCBcIlxcZCtcIiwgdW5kZWZpbmVkLCBcIj9cIl1cbiAgLy8gXCIvcm91dGUoXFxcXGQrKVwiID0+IFt1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBcIlxcZCtcIiwgdW5kZWZpbmVkXVxuICAnKFtcXFxcLy5dKT8oPzpcXFxcOihcXFxcdyspKD86XFxcXCgoKD86XFxcXFxcXFwufFteKV0pKilcXFxcKSk/fFxcXFwoKCg/OlxcXFxcXFxcLnxbXildKSopXFxcXCkpKFsrKj9dKT8nLFxuICAvLyBNYXRjaCByZWdleHAgc3BlY2lhbCBjaGFyYWN0ZXJzIHRoYXQgYXJlIGFsd2F5cyBlc2NhcGVkLlxuICAnKFsuKyo/PV4hOiR7fSgpW1xcXFxdfFxcXFwvXSknXG5dLmpvaW4oJ3wnKSwgJ2cnKTtcblxuLyoqXG4gKiBFc2NhcGUgdGhlIGNhcHR1cmluZyBncm91cCBieSBlc2NhcGluZyBzcGVjaWFsIGNoYXJhY3RlcnMgYW5kIG1lYW5pbmcuXG4gKlxuICogQHBhcmFtICB7U3RyaW5nfSBncm91cFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5mdW5jdGlvbiBlc2NhcGVHcm91cCAoZ3JvdXApIHtcbiAgcmV0dXJuIGdyb3VwLnJlcGxhY2UoLyhbPSE6JFxcLygpXSkvZywgJ1xcXFwkMScpO1xufVxuXG4vKipcbiAqIEF0dGFjaCB0aGUga2V5cyBhcyBhIHByb3BlcnR5IG9mIHRoZSByZWdleHAuXG4gKlxuICogQHBhcmFtICB7UmVnRXhwfSByZVxuICogQHBhcmFtICB7QXJyYXl9ICBrZXlzXG4gKiBAcmV0dXJuIHtSZWdFeHB9XG4gKi9cbmZ1bmN0aW9uIGF0dGFjaEtleXMgKHJlLCBrZXlzKSB7XG4gIHJlLmtleXMgPSBrZXlzO1xuICByZXR1cm4gcmU7XG59XG5cbi8qKlxuICogR2V0IHRoZSBmbGFncyBmb3IgYSByZWdleHAgZnJvbSB0aGUgb3B0aW9ucy5cbiAqXG4gKiBAcGFyYW0gIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZnVuY3Rpb24gZmxhZ3MgKG9wdGlvbnMpIHtcbiAgcmV0dXJuIG9wdGlvbnMuc2Vuc2l0aXZlID8gJycgOiAnaSc7XG59XG5cbi8qKlxuICogUHVsbCBvdXQga2V5cyBmcm9tIGEgcmVnZXhwLlxuICpcbiAqIEBwYXJhbSAge1JlZ0V4cH0gcGF0aFxuICogQHBhcmFtICB7QXJyYXl9ICBrZXlzXG4gKiBAcmV0dXJuIHtSZWdFeHB9XG4gKi9cbmZ1bmN0aW9uIHJlZ2V4cFRvUmVnZXhwIChwYXRoLCBrZXlzKSB7XG4gIC8vIFVzZSBhIG5lZ2F0aXZlIGxvb2thaGVhZCB0byBtYXRjaCBvbmx5IGNhcHR1cmluZyBncm91cHMuXG4gIHZhciBncm91cHMgPSBwYXRoLnNvdXJjZS5tYXRjaCgvXFwoKD8hXFw/KS9nKTtcblxuICBpZiAoZ3JvdXBzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBncm91cHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGtleXMucHVzaCh7XG4gICAgICAgIG5hbWU6ICAgICAgaSxcbiAgICAgICAgZGVsaW1pdGVyOiBudWxsLFxuICAgICAgICBvcHRpb25hbDogIGZhbHNlLFxuICAgICAgICByZXBlYXQ6ICAgIGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYXR0YWNoS2V5cyhwYXRoLCBrZXlzKTtcbn1cblxuLyoqXG4gKiBUcmFuc2Zvcm0gYW4gYXJyYXkgaW50byBhIHJlZ2V4cC5cbiAqXG4gKiBAcGFyYW0gIHtBcnJheX0gIHBhdGhcbiAqIEBwYXJhbSAge0FycmF5fSAga2V5c1xuICogQHBhcmFtICB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtSZWdFeHB9XG4gKi9cbmZ1bmN0aW9uIGFycmF5VG9SZWdleHAgKHBhdGgsIGtleXMsIG9wdGlvbnMpIHtcbiAgdmFyIHBhcnRzID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXRoLmxlbmd0aDsgaSsrKSB7XG4gICAgcGFydHMucHVzaChwYXRoVG9SZWdleHAocGF0aFtpXSwga2V5cywgb3B0aW9ucykuc291cmNlKTtcbiAgfVxuXG4gIHZhciByZWdleHAgPSBuZXcgUmVnRXhwKCcoPzonICsgcGFydHMuam9pbignfCcpICsgJyknLCBmbGFncyhvcHRpb25zKSk7XG4gIHJldHVybiBhdHRhY2hLZXlzKHJlZ2V4cCwga2V5cyk7XG59XG5cbi8qKlxuICogUmVwbGFjZSB0aGUgc3BlY2lmaWMgdGFncyB3aXRoIHJlZ2V4cCBzdHJpbmdzLlxuICpcbiAqIEBwYXJhbSAge1N0cmluZ30gcGF0aFxuICogQHBhcmFtICB7QXJyYXl9ICBrZXlzXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIHJlcGxhY2VQYXRoIChwYXRoLCBrZXlzKSB7XG4gIHZhciBpbmRleCA9IDA7XG5cbiAgZnVuY3Rpb24gcmVwbGFjZSAoXywgZXNjYXBlZCwgcHJlZml4LCBrZXksIGNhcHR1cmUsIGdyb3VwLCBzdWZmaXgsIGVzY2FwZSkge1xuICAgIGlmIChlc2NhcGVkKSB7XG4gICAgICByZXR1cm4gZXNjYXBlZDtcbiAgICB9XG5cbiAgICBpZiAoZXNjYXBlKSB7XG4gICAgICByZXR1cm4gJ1xcXFwnICsgZXNjYXBlO1xuICAgIH1cblxuICAgIHZhciByZXBlYXQgICA9IHN1ZmZpeCA9PT0gJysnIHx8IHN1ZmZpeCA9PT0gJyonO1xuICAgIHZhciBvcHRpb25hbCA9IHN1ZmZpeCA9PT0gJz8nIHx8IHN1ZmZpeCA9PT0gJyonO1xuXG4gICAga2V5cy5wdXNoKHtcbiAgICAgIG5hbWU6ICAgICAga2V5IHx8IGluZGV4KyssXG4gICAgICBkZWxpbWl0ZXI6IHByZWZpeCB8fCAnLycsXG4gICAgICBvcHRpb25hbDogIG9wdGlvbmFsLFxuICAgICAgcmVwZWF0OiAgICByZXBlYXRcbiAgICB9KTtcblxuICAgIHByZWZpeCA9IHByZWZpeCA/ICgnXFxcXCcgKyBwcmVmaXgpIDogJyc7XG4gICAgY2FwdHVyZSA9IGVzY2FwZUdyb3VwKGNhcHR1cmUgfHwgZ3JvdXAgfHwgJ1teJyArIChwcmVmaXggfHwgJ1xcXFwvJykgKyAnXSs/Jyk7XG5cbiAgICBpZiAocmVwZWF0KSB7XG4gICAgICBjYXB0dXJlID0gY2FwdHVyZSArICcoPzonICsgcHJlZml4ICsgY2FwdHVyZSArICcpKic7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbmFsKSB7XG4gICAgICByZXR1cm4gJyg/OicgKyBwcmVmaXggKyAnKCcgKyBjYXB0dXJlICsgJykpPyc7XG4gICAgfVxuXG4gICAgLy8gQmFzaWMgcGFyYW1ldGVyIHN1cHBvcnQuXG4gICAgcmV0dXJuIHByZWZpeCArICcoJyArIGNhcHR1cmUgKyAnKSc7XG4gIH1cblxuICByZXR1cm4gcGF0aC5yZXBsYWNlKFBBVEhfUkVHRVhQLCByZXBsYWNlKTtcbn1cblxuLyoqXG4gKiBOb3JtYWxpemUgdGhlIGdpdmVuIHBhdGggc3RyaW5nLCByZXR1cm5pbmcgYSByZWd1bGFyIGV4cHJlc3Npb24uXG4gKlxuICogQW4gZW1wdHkgYXJyYXkgY2FuIGJlIHBhc3NlZCBpbiBmb3IgdGhlIGtleXMsIHdoaWNoIHdpbGwgaG9sZCB0aGVcbiAqIHBsYWNlaG9sZGVyIGtleSBkZXNjcmlwdGlvbnMuIEZvciBleGFtcGxlLCB1c2luZyBgL3VzZXIvOmlkYCwgYGtleXNgIHdpbGxcbiAqIGNvbnRhaW4gYFt7IG5hbWU6ICdpZCcsIGRlbGltaXRlcjogJy8nLCBvcHRpb25hbDogZmFsc2UsIHJlcGVhdDogZmFsc2UgfV1gLlxuICpcbiAqIEBwYXJhbSAgeyhTdHJpbmd8UmVnRXhwfEFycmF5KX0gcGF0aFxuICogQHBhcmFtICB7QXJyYXl9ICAgICAgICAgICAgICAgICBba2V5c11cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICAgICAgICAgW29wdGlvbnNdXG4gKiBAcmV0dXJuIHtSZWdFeHB9XG4gKi9cbmZ1bmN0aW9uIHBhdGhUb1JlZ2V4cCAocGF0aCwga2V5cywgb3B0aW9ucykge1xuICBrZXlzID0ga2V5cyB8fCBbXTtcblxuICBpZiAoIWlzQXJyYXkoa2V5cykpIHtcbiAgICBvcHRpb25zID0ga2V5cztcbiAgICBrZXlzID0gW107XG4gIH0gZWxzZSBpZiAoIW9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cblxuICBpZiAocGF0aCBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgIHJldHVybiByZWdleHBUb1JlZ2V4cChwYXRoLCBrZXlzLCBvcHRpb25zKTtcbiAgfVxuXG4gIGlmIChpc0FycmF5KHBhdGgpKSB7XG4gICAgcmV0dXJuIGFycmF5VG9SZWdleHAocGF0aCwga2V5cywgb3B0aW9ucyk7XG4gIH1cblxuICB2YXIgc3RyaWN0ID0gb3B0aW9ucy5zdHJpY3Q7XG4gIHZhciBlbmQgPSBvcHRpb25zLmVuZCAhPT0gZmFsc2U7XG4gIHZhciByb3V0ZSA9IHJlcGxhY2VQYXRoKHBhdGgsIGtleXMpO1xuICB2YXIgZW5kc1dpdGhTbGFzaCA9IHBhdGguY2hhckF0KHBhdGgubGVuZ3RoIC0gMSkgPT09ICcvJztcblxuICAvLyBJbiBub24tc3RyaWN0IG1vZGUgd2UgYWxsb3cgYSBzbGFzaCBhdCB0aGUgZW5kIG9mIG1hdGNoLiBJZiB0aGUgcGF0aCB0b1xuICAvLyBtYXRjaCBhbHJlYWR5IGVuZHMgd2l0aCBhIHNsYXNoLCB3ZSByZW1vdmUgaXQgZm9yIGNvbnNpc3RlbmN5LiBUaGUgc2xhc2hcbiAgLy8gaXMgdmFsaWQgYXQgdGhlIGVuZCBvZiBhIHBhdGggbWF0Y2gsIG5vdCBpbiB0aGUgbWlkZGxlLiBUaGlzIGlzIGltcG9ydGFudFxuICAvLyBpbiBub24tZW5kaW5nIG1vZGUsIHdoZXJlIFwiL3Rlc3QvXCIgc2hvdWxkbid0IG1hdGNoIFwiL3Rlc3QvL3JvdXRlXCIuXG4gIGlmICghc3RyaWN0KSB7XG4gICAgcm91dGUgPSAoZW5kc1dpdGhTbGFzaCA/IHJvdXRlLnNsaWNlKDAsIC0yKSA6IHJvdXRlKSArICcoPzpcXFxcLyg/PSQpKT8nO1xuICB9XG5cbiAgaWYgKGVuZCkge1xuICAgIHJvdXRlICs9ICckJztcbiAgfSBlbHNlIHtcbiAgICAvLyBJbiBub24tZW5kaW5nIG1vZGUsIHdlIG5lZWQgdGhlIGNhcHR1cmluZyBncm91cHMgdG8gbWF0Y2ggYXMgbXVjaCBhc1xuICAgIC8vIHBvc3NpYmxlIGJ5IHVzaW5nIGEgcG9zaXRpdmUgbG9va2FoZWFkIHRvIHRoZSBlbmQgb3IgbmV4dCBwYXRoIHNlZ21lbnQuXG4gICAgcm91dGUgKz0gc3RyaWN0ICYmIGVuZHNXaXRoU2xhc2ggPyAnJyA6ICcoPz1cXFxcL3wkKSc7XG4gIH1cblxuICByZXR1cm4gYXR0YWNoS2V5cyhuZXcgUmVnRXhwKCdeJyArIHJvdXRlLCBmbGFncyhvcHRpb25zKSksIGtleXMpO1xufVxuXG59LHtcImlzYXJyYXlcIjoxfV0sMTU6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHNldFRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZHJhaW5RdWV1ZSwgMCk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG5cbn0se31dLDE2OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xudmFyIHBhZCA9IGZ1bmN0aW9uIHBhZChudW0pIHtcbiAgcmV0dXJuIChcIjBcIiArIG51bSkuc2xpY2UoLTIpO1xufTtcblxuLy8gVXNlIHRoZSBuZXcgcGVyZm9ybWFuY2UgYXBpIHRvIGdldCBiZXR0ZXIgcHJlY2lzaW9uIGlmIGF2YWlsYWJsZVxudmFyIHRpbWVyID0gdHlwZW9mIHBlcmZvcm1hbmNlICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBwZXJmb3JtYW5jZS5ub3cgPT09IFwiZnVuY3Rpb25cIiA/IHBlcmZvcm1hbmNlIDogRGF0ZTtcblxuLyoqXG4gKiBDcmVhdGVzIGxvZ2dlciB3aXRoIGZvbGxvd2VkIG9wdGlvbnNcbiAqXG4gKiBAbmFtZXNwYWNlXG4gKiBAcHJvcGVydHkge29iamVjdH0gb3B0aW9ucyAtIG9wdGlvbnMgZm9yIGxvZ2dlclxuICogQHByb3BlcnR5IHtzdHJpbmd9IG9wdGlvbnMubGV2ZWwgLSBjb25zb2xlW2xldmVsXVxuICogQHByb3BlcnR5IHtvYmplY3R9IG9wdGlvbnMubG9nZ2VyIC0gaW1wbGVtZW50YXRpb24gb2YgdGhlIGBjb25zb2xlYCBBUEkuXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IG9wdGlvbnMuY29sbGFwc2VkIC0gaXMgZ3JvdXAgY29sbGFwc2VkP1xuICogQHByb3BlcnR5IHtib29sZWFufSBvcHRpb25zLnByZWRpY2F0ZSAtIGNvbmRpdGlvbiB3aGljaCByZXNvbHZlcyBsb2dnZXIgYmVoYXZpb3JcbiAqIEBwcm9wZXJ0eSB7Ym9vbH0gb3B0aW9ucy5kdXJhdGlvbiAtIHByaW50IGR1cmF0aW9uIG9mIGVhY2ggYWN0aW9uP1xuICogQHByb3BlcnR5IHtib29sfSBvcHRpb25zLnRpbWVzdGFtcCAtIHByaW50IHRpbWVzdGFtcCB3aXRoIGVhY2ggYWN0aW9uP1xuICogQHByb3BlcnR5IHtmdW5jdGlvbn0gb3B0aW9ucy50cmFuc2Zvcm1lciAtIHRyYW5zZm9ybSBzdGF0ZSBiZWZvcmUgcHJpbnRcbiAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb259IG9wdGlvbnMuYWN0aW9uVHJhbnNmb3JtZXIgLSB0cmFuc2Zvcm0gYWN0aW9uIGJlZm9yZSBwcmludFxuICovXG5cbmZ1bmN0aW9uIGNyZWF0ZUxvZ2dlcigpIHtcbiAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1swXTtcblxuICByZXR1cm4gZnVuY3Rpb24gKF9yZWYpIHtcbiAgICB2YXIgZ2V0U3RhdGUgPSBfcmVmLmdldFN0YXRlO1xuICAgIHJldHVybiBmdW5jdGlvbiAobmV4dCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICAgICAgdmFyIGxldmVsID0gb3B0aW9ucy5sZXZlbDtcbiAgICAgICAgdmFyIGxvZ2dlciA9IG9wdGlvbnMubG9nZ2VyO1xuICAgICAgICB2YXIgY29sbGFwc2VkID0gb3B0aW9ucy5jb2xsYXBzZWQ7XG4gICAgICAgIHZhciBwcmVkaWNhdGUgPSBvcHRpb25zLnByZWRpY2F0ZTtcbiAgICAgICAgdmFyIF9vcHRpb25zJGR1cmF0aW9uID0gb3B0aW9ucy5kdXJhdGlvbjtcbiAgICAgICAgdmFyIGR1cmF0aW9uID0gX29wdGlvbnMkZHVyYXRpb24gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogX29wdGlvbnMkZHVyYXRpb247XG4gICAgICAgIHZhciBfb3B0aW9ucyR0aW1lc3RhbXAgPSBvcHRpb25zLnRpbWVzdGFtcDtcbiAgICAgICAgdmFyIHRpbWVzdGFtcCA9IF9vcHRpb25zJHRpbWVzdGFtcCA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IF9vcHRpb25zJHRpbWVzdGFtcDtcbiAgICAgICAgdmFyIF9vcHRpb25zJHRyYW5zZm9ybWVyID0gb3B0aW9ucy50cmFuc2Zvcm1lcjtcbiAgICAgICAgdmFyIHRyYW5zZm9ybWVyID0gX29wdGlvbnMkdHJhbnNmb3JtZXIgPT09IHVuZGVmaW5lZCA/IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgICAgfSA6IF9vcHRpb25zJHRyYW5zZm9ybWVyO1xuICAgICAgICB2YXIgX29wdGlvbnMkYWN0aW9uVHJhbnNmb3JtZXIgPSBvcHRpb25zLmFjdGlvblRyYW5zZm9ybWVyO1xuICAgICAgICB2YXIgYWN0aW9uVHJhbnNmb3JtZXIgPSBfb3B0aW9ucyRhY3Rpb25UcmFuc2Zvcm1lciA9PT0gdW5kZWZpbmVkID8gZnVuY3Rpb24gKGFjdG4pIHtcbiAgICAgICAgICByZXR1cm4gYWN0bjtcbiAgICAgICAgfSA6IF9vcHRpb25zJGFjdGlvblRyYW5zZm9ybWVyO1xuXG4gICAgICAgIHZhciBjb25zb2xlID0gbG9nZ2VyIHx8IHdpbmRvdy5jb25zb2xlO1xuXG4gICAgICAgIC8vIGV4aXQgaWYgY29uc29sZSB1bmRlZmluZWRcbiAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgcmV0dXJuIG5leHQoYWN0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGV4aXQgZWFybHkgaWYgcHJlZGljYXRlIGZ1bmN0aW9uIHJldHVybnMgZmFsc2VcbiAgICAgICAgaWYgKHR5cGVvZiBwcmVkaWNhdGUgPT09IFwiZnVuY3Rpb25cIiAmJiAhcHJlZGljYXRlKGdldFN0YXRlLCBhY3Rpb24pKSB7XG4gICAgICAgICAgcmV0dXJuIG5leHQoYWN0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzdGFydGVkID0gdGltZXIubm93KCk7XG4gICAgICAgIHZhciBwcmV2U3RhdGUgPSB0cmFuc2Zvcm1lcihnZXRTdGF0ZSgpKTtcblxuICAgICAgICB2YXIgcmV0dXJuVmFsdWUgPSBuZXh0KGFjdGlvbik7XG4gICAgICAgIHZhciB0b29rID0gdGltZXIubm93KCkgLSBzdGFydGVkO1xuXG4gICAgICAgIHZhciBuZXh0U3RhdGUgPSB0cmFuc2Zvcm1lcihnZXRTdGF0ZSgpKTtcblxuICAgICAgICAvLyBmb3JtYXR0ZXJzXG4gICAgICAgIHZhciB0aW1lID0gbmV3IERhdGUoKTtcbiAgICAgICAgdmFyIGlzQ29sbGFwc2VkID0gdHlwZW9mIGNvbGxhcHNlZCA9PT0gXCJmdW5jdGlvblwiID8gY29sbGFwc2VkKGdldFN0YXRlLCBhY3Rpb24pIDogY29sbGFwc2VkO1xuXG4gICAgICAgIHZhciBmb3JtYXR0ZWRUaW1lID0gdGltZXN0YW1wID8gXCIgQCBcIiArIHRpbWUuZ2V0SG91cnMoKSArIFwiOlwiICsgcGFkKHRpbWUuZ2V0TWludXRlcygpKSArIFwiOlwiICsgcGFkKHRpbWUuZ2V0U2Vjb25kcygpKSA6IFwiXCI7XG4gICAgICAgIHZhciBmb3JtYXR0ZWREdXJhdGlvbiA9IGR1cmF0aW9uID8gXCIgaW4gXCIgKyB0b29rLnRvRml4ZWQoMikgKyBcIiBtc1wiIDogXCJcIjtcbiAgICAgICAgdmFyIGZvcm1hdHRlZEFjdGlvbiA9IGFjdGlvblRyYW5zZm9ybWVyKGFjdGlvbik7XG4gICAgICAgIHZhciBtZXNzYWdlID0gXCJhY3Rpb24gXCIgKyBmb3JtYXR0ZWRBY3Rpb24udHlwZSArIGZvcm1hdHRlZFRpbWUgKyBmb3JtYXR0ZWREdXJhdGlvbjtcblxuICAgICAgICAvLyByZW5kZXJcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpc0NvbGxhcHNlZCA/IGNvbnNvbGUuZ3JvdXBDb2xsYXBzZWQobWVzc2FnZSkgOiBjb25zb2xlLmdyb3VwKG1lc3NhZ2UpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY29uc29sZS5sb2cobWVzc2FnZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobGV2ZWwpIHtcbiAgICAgICAgICBjb25zb2xlW2xldmVsXShcIiVjIHByZXYgc3RhdGVcIiwgXCJjb2xvcjogIzlFOUU5RTsgZm9udC13ZWlnaHQ6IGJvbGRcIiwgcHJldlN0YXRlKTtcbiAgICAgICAgICBjb25zb2xlW2xldmVsXShcIiVjIGFjdGlvblwiLCBcImNvbG9yOiAjMDNBOUY0OyBmb250LXdlaWdodDogYm9sZFwiLCBmb3JtYXR0ZWRBY3Rpb24pO1xuICAgICAgICAgIGNvbnNvbGVbbGV2ZWxdKFwiJWMgbmV4dCBzdGF0ZVwiLCBcImNvbG9yOiAjNENBRjUwOyBmb250LXdlaWdodDogYm9sZFwiLCBuZXh0U3RhdGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiJWMgcHJldiBzdGF0ZVwiLCBcImNvbG9yOiAjOUU5RTlFOyBmb250LXdlaWdodDogYm9sZFwiLCBwcmV2U3RhdGUpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiJWMgYWN0aW9uXCIsIFwiY29sb3I6ICMwM0E5RjQ7IGZvbnQtd2VpZ2h0OiBib2xkXCIsIGZvcm1hdHRlZEFjdGlvbik7XG4gICAgICAgICAgY29uc29sZS5sb2coXCIlYyBuZXh0IHN0YXRlXCIsIFwiY29sb3I6ICM0Q0FGNTA7IGZvbnQtd2VpZ2h0OiBib2xkXCIsIG5leHRTdGF0ZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnNvbGUuZ3JvdXBFbmQoKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwi4oCU4oCUIGxvZyBlbmQg4oCU4oCUXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICAgICAgfTtcbiAgICB9O1xuICB9O1xufVxuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IGNyZWF0ZUxvZ2dlcjtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1tcImRlZmF1bHRcIl07XG59LHt9XSwxNzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzWydkZWZhdWx0J10gPSB0aHVua01pZGRsZXdhcmU7XG5cbmZ1bmN0aW9uIHRodW5rTWlkZGxld2FyZShfcmVmKSB7XG4gIHZhciBkaXNwYXRjaCA9IF9yZWYuZGlzcGF0Y2g7XG4gIHZhciBnZXRTdGF0ZSA9IF9yZWYuZ2V0U3RhdGU7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChuZXh0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICAgIHJldHVybiB0eXBlb2YgYWN0aW9uID09PSAnZnVuY3Rpb24nID8gYWN0aW9uKGRpc3BhdGNoLCBnZXRTdGF0ZSkgOiBuZXh0KGFjdGlvbik7XG4gICAgfTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG59LHt9XSwxODpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzWydkZWZhdWx0J10gPSBjcmVhdGVTdG9yZTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX3V0aWxzSXNQbGFpbk9iamVjdCA9IHJlcXVpcmUoJy4vdXRpbHMvaXNQbGFpbk9iamVjdCcpO1xuXG52YXIgX3V0aWxzSXNQbGFpbk9iamVjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF91dGlsc0lzUGxhaW5PYmplY3QpO1xuXG4vKipcbiAqIFRoZXNlIGFyZSBwcml2YXRlIGFjdGlvbiB0eXBlcyByZXNlcnZlZCBieSBSZWR1eC5cbiAqIEZvciBhbnkgdW5rbm93biBhY3Rpb25zLCB5b3UgbXVzdCByZXR1cm4gdGhlIGN1cnJlbnQgc3RhdGUuXG4gKiBJZiB0aGUgY3VycmVudCBzdGF0ZSBpcyB1bmRlZmluZWQsIHlvdSBtdXN0IHJldHVybiB0aGUgaW5pdGlhbCBzdGF0ZS5cbiAqIERvIG5vdCByZWZlcmVuY2UgdGhlc2UgYWN0aW9uIHR5cGVzIGRpcmVjdGx5IGluIHlvdXIgY29kZS5cbiAqL1xudmFyIEFjdGlvblR5cGVzID0ge1xuICBJTklUOiAnQEByZWR1eC9JTklUJ1xufTtcblxuZXhwb3J0cy5BY3Rpb25UeXBlcyA9IEFjdGlvblR5cGVzO1xuLyoqXG4gKiBDcmVhdGVzIGEgUmVkdXggc3RvcmUgdGhhdCBob2xkcyB0aGUgc3RhdGUgdHJlZS5cbiAqIFRoZSBvbmx5IHdheSB0byBjaGFuZ2UgdGhlIGRhdGEgaW4gdGhlIHN0b3JlIGlzIHRvIGNhbGwgYGRpc3BhdGNoKClgIG9uIGl0LlxuICpcbiAqIFRoZXJlIHNob3VsZCBvbmx5IGJlIGEgc2luZ2xlIHN0b3JlIGluIHlvdXIgYXBwLiBUbyBzcGVjaWZ5IGhvdyBkaWZmZXJlbnRcbiAqIHBhcnRzIG9mIHRoZSBzdGF0ZSB0cmVlIHJlc3BvbmQgdG8gYWN0aW9ucywgeW91IG1heSBjb21iaW5lIHNldmVyYWwgcmVkdWNlcnNcbiAqIGludG8gYSBzaW5nbGUgcmVkdWNlciBmdW5jdGlvbiBieSB1c2luZyBgY29tYmluZVJlZHVjZXJzYC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWR1Y2VyIEEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBuZXh0IHN0YXRlIHRyZWUsIGdpdmVuXG4gKiB0aGUgY3VycmVudCBzdGF0ZSB0cmVlIGFuZCB0aGUgYWN0aW9uIHRvIGhhbmRsZS5cbiAqXG4gKiBAcGFyYW0ge2FueX0gW2luaXRpYWxTdGF0ZV0gVGhlIGluaXRpYWwgc3RhdGUuIFlvdSBtYXkgb3B0aW9uYWxseSBzcGVjaWZ5IGl0XG4gKiB0byBoeWRyYXRlIHRoZSBzdGF0ZSBmcm9tIHRoZSBzZXJ2ZXIgaW4gdW5pdmVyc2FsIGFwcHMsIG9yIHRvIHJlc3RvcmUgYVxuICogcHJldmlvdXNseSBzZXJpYWxpemVkIHVzZXIgc2Vzc2lvbi5cbiAqIElmIHlvdSB1c2UgYGNvbWJpbmVSZWR1Y2Vyc2AgdG8gcHJvZHVjZSB0aGUgcm9vdCByZWR1Y2VyIGZ1bmN0aW9uLCB0aGlzIG11c3QgYmVcbiAqIGFuIG9iamVjdCB3aXRoIHRoZSBzYW1lIHNoYXBlIGFzIGBjb21iaW5lUmVkdWNlcnNgIGtleXMuXG4gKlxuICogQHJldHVybnMge1N0b3JlfSBBIFJlZHV4IHN0b3JlIHRoYXQgbGV0cyB5b3UgcmVhZCB0aGUgc3RhdGUsIGRpc3BhdGNoIGFjdGlvbnNcbiAqIGFuZCBzdWJzY3JpYmUgdG8gY2hhbmdlcy5cbiAqL1xuXG5mdW5jdGlvbiBjcmVhdGVTdG9yZShyZWR1Y2VyLCBpbml0aWFsU3RhdGUpIHtcbiAgaWYgKHR5cGVvZiByZWR1Y2VyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCB0aGUgcmVkdWNlciB0byBiZSBhIGZ1bmN0aW9uLicpO1xuICB9XG5cbiAgdmFyIGN1cnJlbnRSZWR1Y2VyID0gcmVkdWNlcjtcbiAgdmFyIGN1cnJlbnRTdGF0ZSA9IGluaXRpYWxTdGF0ZTtcbiAgdmFyIGxpc3RlbmVycyA9IFtdO1xuICB2YXIgaXNEaXNwYXRjaGluZyA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBSZWFkcyB0aGUgc3RhdGUgdHJlZSBtYW5hZ2VkIGJ5IHRoZSBzdG9yZS5cbiAgICpcbiAgICogQHJldHVybnMge2FueX0gVGhlIGN1cnJlbnQgc3RhdGUgdHJlZSBvZiB5b3VyIGFwcGxpY2F0aW9uLlxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0U3RhdGUoKSB7XG4gICAgcmV0dXJuIGN1cnJlbnRTdGF0ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgY2hhbmdlIGxpc3RlbmVyLiBJdCB3aWxsIGJlIGNhbGxlZCBhbnkgdGltZSBhbiBhY3Rpb24gaXMgZGlzcGF0Y2hlZCxcbiAgICogYW5kIHNvbWUgcGFydCBvZiB0aGUgc3RhdGUgdHJlZSBtYXkgcG90ZW50aWFsbHkgaGF2ZSBjaGFuZ2VkLiBZb3UgbWF5IHRoZW5cbiAgICogY2FsbCBgZ2V0U3RhdGUoKWAgdG8gcmVhZCB0aGUgY3VycmVudCBzdGF0ZSB0cmVlIGluc2lkZSB0aGUgY2FsbGJhY2suXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIEEgY2FsbGJhY2sgdG8gYmUgaW52b2tlZCBvbiBldmVyeSBkaXNwYXRjaC5cbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSBBIGZ1bmN0aW9uIHRvIHJlbW92ZSB0aGlzIGNoYW5nZSBsaXN0ZW5lci5cbiAgICovXG4gIGZ1bmN0aW9uIHN1YnNjcmliZShsaXN0ZW5lcikge1xuICAgIGxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcblxuICAgIHJldHVybiBmdW5jdGlvbiB1bnN1YnNjcmliZSgpIHtcbiAgICAgIHZhciBpbmRleCA9IGxpc3RlbmVycy5pbmRleE9mKGxpc3RlbmVyKTtcbiAgICAgIGxpc3RlbmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2hlcyBhbiBhY3Rpb24uIEl0IGlzIHRoZSBvbmx5IHdheSB0byB0cmlnZ2VyIGEgc3RhdGUgY2hhbmdlLlxuICAgKlxuICAgKiBUaGUgYHJlZHVjZXJgIGZ1bmN0aW9uLCB1c2VkIHRvIGNyZWF0ZSB0aGUgc3RvcmUsIHdpbGwgYmUgY2FsbGVkIHdpdGggdGhlXG4gICAqIGN1cnJlbnQgc3RhdGUgdHJlZSBhbmQgdGhlIGdpdmVuIGBhY3Rpb25gLiBJdHMgcmV0dXJuIHZhbHVlIHdpbGxcbiAgICogYmUgY29uc2lkZXJlZCB0aGUgKipuZXh0Kiogc3RhdGUgb2YgdGhlIHRyZWUsIGFuZCB0aGUgY2hhbmdlIGxpc3RlbmVyc1xuICAgKiB3aWxsIGJlIG5vdGlmaWVkLlxuICAgKlxuICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvbmx5IHN1cHBvcnRzIHBsYWluIG9iamVjdCBhY3Rpb25zLiBJZiB5b3Ugd2FudCB0b1xuICAgKiBkaXNwYXRjaCBhIFByb21pc2UsIGFuIE9ic2VydmFibGUsIGEgdGh1bmssIG9yIHNvbWV0aGluZyBlbHNlLCB5b3UgbmVlZCB0b1xuICAgKiB3cmFwIHlvdXIgc3RvcmUgY3JlYXRpbmcgZnVuY3Rpb24gaW50byB0aGUgY29ycmVzcG9uZGluZyBtaWRkbGV3YXJlLiBGb3JcbiAgICogZXhhbXBsZSwgc2VlIHRoZSBkb2N1bWVudGF0aW9uIGZvciB0aGUgYHJlZHV4LXRodW5rYCBwYWNrYWdlLiBFdmVuIHRoZVxuICAgKiBtaWRkbGV3YXJlIHdpbGwgZXZlbnR1YWxseSBkaXNwYXRjaCBwbGFpbiBvYmplY3QgYWN0aW9ucyB1c2luZyB0aGlzIG1ldGhvZC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGFjdGlvbiBBIHBsYWluIG9iamVjdCByZXByZXNlbnRpbmcg4oCcd2hhdCBjaGFuZ2Vk4oCdLiBJdCBpc1xuICAgKiBhIGdvb2QgaWRlYSB0byBrZWVwIGFjdGlvbnMgc2VyaWFsaXphYmxlIHNvIHlvdSBjYW4gcmVjb3JkIGFuZCByZXBsYXkgdXNlclxuICAgKiBzZXNzaW9ucywgb3IgdXNlIHRoZSB0aW1lIHRyYXZlbGxpbmcgYHJlZHV4LWRldnRvb2xzYC4gQW4gYWN0aW9uIG11c3QgaGF2ZVxuICAgKiBhIGB0eXBlYCBwcm9wZXJ0eSB3aGljaCBtYXkgbm90IGJlIGB1bmRlZmluZWRgLiBJdCBpcyBhIGdvb2QgaWRlYSB0byB1c2VcbiAgICogc3RyaW5nIGNvbnN0YW50cyBmb3IgYWN0aW9uIHR5cGVzLlxuICAgKlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBGb3IgY29udmVuaWVuY2UsIHRoZSBzYW1lIGFjdGlvbiBvYmplY3QgeW91IGRpc3BhdGNoZWQuXG4gICAqXG4gICAqIE5vdGUgdGhhdCwgaWYgeW91IHVzZSBhIGN1c3RvbSBtaWRkbGV3YXJlLCBpdCBtYXkgd3JhcCBgZGlzcGF0Y2goKWAgdG9cbiAgICogcmV0dXJuIHNvbWV0aGluZyBlbHNlIChmb3IgZXhhbXBsZSwgYSBQcm9taXNlIHlvdSBjYW4gYXdhaXQpLlxuICAgKi9cbiAgZnVuY3Rpb24gZGlzcGF0Y2goYWN0aW9uKSB7XG4gICAgaWYgKCFfdXRpbHNJc1BsYWluT2JqZWN0MlsnZGVmYXVsdCddKGFjdGlvbikpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQWN0aW9ucyBtdXN0IGJlIHBsYWluIG9iamVjdHMuICcgKyAnVXNlIGN1c3RvbSBtaWRkbGV3YXJlIGZvciBhc3luYyBhY3Rpb25zLicpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgYWN0aW9uLnR5cGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FjdGlvbnMgbWF5IG5vdCBoYXZlIGFuIHVuZGVmaW5lZCBcInR5cGVcIiBwcm9wZXJ0eS4gJyArICdIYXZlIHlvdSBtaXNzcGVsbGVkIGEgY29uc3RhbnQ/Jyk7XG4gICAgfVxuXG4gICAgaWYgKGlzRGlzcGF0Y2hpbmcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmVkdWNlcnMgbWF5IG5vdCBkaXNwYXRjaCBhY3Rpb25zLicpO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBpc0Rpc3BhdGNoaW5nID0gdHJ1ZTtcbiAgICAgIGN1cnJlbnRTdGF0ZSA9IGN1cnJlbnRSZWR1Y2VyKGN1cnJlbnRTdGF0ZSwgYWN0aW9uKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaXNEaXNwYXRjaGluZyA9IGZhbHNlO1xuICAgIH1cblxuICAgIGxpc3RlbmVycy5zbGljZSgpLmZvckVhY2goZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgICByZXR1cm4gbGlzdGVuZXIoKTtcbiAgICB9KTtcbiAgICByZXR1cm4gYWN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcGxhY2VzIHRoZSByZWR1Y2VyIGN1cnJlbnRseSB1c2VkIGJ5IHRoZSBzdG9yZSB0byBjYWxjdWxhdGUgdGhlIHN0YXRlLlxuICAgKlxuICAgKiBZb3UgbWlnaHQgbmVlZCB0aGlzIGlmIHlvdXIgYXBwIGltcGxlbWVudHMgY29kZSBzcGxpdHRpbmcgYW5kIHlvdSB3YW50IHRvXG4gICAqIGxvYWQgc29tZSBvZiB0aGUgcmVkdWNlcnMgZHluYW1pY2FsbHkuIFlvdSBtaWdodCBhbHNvIG5lZWQgdGhpcyBpZiB5b3VcbiAgICogaW1wbGVtZW50IGEgaG90IHJlbG9hZGluZyBtZWNoYW5pc20gZm9yIFJlZHV4LlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBuZXh0UmVkdWNlciBUaGUgcmVkdWNlciBmb3IgdGhlIHN0b3JlIHRvIHVzZSBpbnN0ZWFkLlxuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIGZ1bmN0aW9uIHJlcGxhY2VSZWR1Y2VyKG5leHRSZWR1Y2VyKSB7XG4gICAgY3VycmVudFJlZHVjZXIgPSBuZXh0UmVkdWNlcjtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IEFjdGlvblR5cGVzLklOSVQgfSk7XG4gIH1cblxuICAvLyBXaGVuIGEgc3RvcmUgaXMgY3JlYXRlZCwgYW4gXCJJTklUXCIgYWN0aW9uIGlzIGRpc3BhdGNoZWQgc28gdGhhdCBldmVyeVxuICAvLyByZWR1Y2VyIHJldHVybnMgdGhlaXIgaW5pdGlhbCBzdGF0ZS4gVGhpcyBlZmZlY3RpdmVseSBwb3B1bGF0ZXNcbiAgLy8gdGhlIGluaXRpYWwgc3RhdGUgdHJlZS5cbiAgZGlzcGF0Y2goeyB0eXBlOiBBY3Rpb25UeXBlcy5JTklUIH0pO1xuXG4gIHJldHVybiB7XG4gICAgZGlzcGF0Y2g6IGRpc3BhdGNoLFxuICAgIHN1YnNjcmliZTogc3Vic2NyaWJlLFxuICAgIGdldFN0YXRlOiBnZXRTdGF0ZSxcbiAgICByZXBsYWNlUmVkdWNlcjogcmVwbGFjZVJlZHVjZXJcbiAgfTtcbn1cbn0se1wiLi91dGlscy9pc1BsYWluT2JqZWN0XCI6MjR9XSwxOTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9jcmVhdGVTdG9yZSA9IHJlcXVpcmUoJy4vY3JlYXRlU3RvcmUnKTtcblxudmFyIF9jcmVhdGVTdG9yZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jcmVhdGVTdG9yZSk7XG5cbnZhciBfdXRpbHNDb21iaW5lUmVkdWNlcnMgPSByZXF1aXJlKCcuL3V0aWxzL2NvbWJpbmVSZWR1Y2VycycpO1xuXG52YXIgX3V0aWxzQ29tYmluZVJlZHVjZXJzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3V0aWxzQ29tYmluZVJlZHVjZXJzKTtcblxudmFyIF91dGlsc0JpbmRBY3Rpb25DcmVhdG9ycyA9IHJlcXVpcmUoJy4vdXRpbHMvYmluZEFjdGlvbkNyZWF0b3JzJyk7XG5cbnZhciBfdXRpbHNCaW5kQWN0aW9uQ3JlYXRvcnMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdXRpbHNCaW5kQWN0aW9uQ3JlYXRvcnMpO1xuXG52YXIgX3V0aWxzQXBwbHlNaWRkbGV3YXJlID0gcmVxdWlyZSgnLi91dGlscy9hcHBseU1pZGRsZXdhcmUnKTtcblxudmFyIF91dGlsc0FwcGx5TWlkZGxld2FyZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF91dGlsc0FwcGx5TWlkZGxld2FyZSk7XG5cbnZhciBfdXRpbHNDb21wb3NlID0gcmVxdWlyZSgnLi91dGlscy9jb21wb3NlJyk7XG5cbnZhciBfdXRpbHNDb21wb3NlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3V0aWxzQ29tcG9zZSk7XG5cbmV4cG9ydHMuY3JlYXRlU3RvcmUgPSBfY3JlYXRlU3RvcmUyWydkZWZhdWx0J107XG5leHBvcnRzLmNvbWJpbmVSZWR1Y2VycyA9IF91dGlsc0NvbWJpbmVSZWR1Y2VyczJbJ2RlZmF1bHQnXTtcbmV4cG9ydHMuYmluZEFjdGlvbkNyZWF0b3JzID0gX3V0aWxzQmluZEFjdGlvbkNyZWF0b3JzMlsnZGVmYXVsdCddO1xuZXhwb3J0cy5hcHBseU1pZGRsZXdhcmUgPSBfdXRpbHNBcHBseU1pZGRsZXdhcmUyWydkZWZhdWx0J107XG5leHBvcnRzLmNvbXBvc2UgPSBfdXRpbHNDb21wb3NlMlsnZGVmYXVsdCddO1xufSx7XCIuL2NyZWF0ZVN0b3JlXCI6MTgsXCIuL3V0aWxzL2FwcGx5TWlkZGxld2FyZVwiOjIwLFwiLi91dGlscy9iaW5kQWN0aW9uQ3JlYXRvcnNcIjoyMSxcIi4vdXRpbHMvY29tYmluZVJlZHVjZXJzXCI6MjIsXCIuL3V0aWxzL2NvbXBvc2VcIjoyM31dLDIwOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gYXBwbHlNaWRkbGV3YXJlO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfY29tcG9zZSA9IHJlcXVpcmUoJy4vY29tcG9zZScpO1xuXG52YXIgX2NvbXBvc2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY29tcG9zZSk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIHN0b3JlIGVuaGFuY2VyIHRoYXQgYXBwbGllcyBtaWRkbGV3YXJlIHRvIHRoZSBkaXNwYXRjaCBtZXRob2RcbiAqIG9mIHRoZSBSZWR1eCBzdG9yZS4gVGhpcyBpcyBoYW5keSBmb3IgYSB2YXJpZXR5IG9mIHRhc2tzLCBzdWNoIGFzIGV4cHJlc3NpbmdcbiAqIGFzeW5jaHJvbm91cyBhY3Rpb25zIGluIGEgY29uY2lzZSBtYW5uZXIsIG9yIGxvZ2dpbmcgZXZlcnkgYWN0aW9uIHBheWxvYWQuXG4gKlxuICogU2VlIGByZWR1eC10aHVua2AgcGFja2FnZSBhcyBhbiBleGFtcGxlIG9mIHRoZSBSZWR1eCBtaWRkbGV3YXJlLlxuICpcbiAqIEJlY2F1c2UgbWlkZGxld2FyZSBpcyBwb3RlbnRpYWxseSBhc3luY2hyb25vdXMsIHRoaXMgc2hvdWxkIGJlIHRoZSBmaXJzdFxuICogc3RvcmUgZW5oYW5jZXIgaW4gdGhlIGNvbXBvc2l0aW9uIGNoYWluLlxuICpcbiAqIE5vdGUgdGhhdCBlYWNoIG1pZGRsZXdhcmUgd2lsbCBiZSBnaXZlbiB0aGUgYGRpc3BhdGNoYCBhbmQgYGdldFN0YXRlYCBmdW5jdGlvbnNcbiAqIGFzIG5hbWVkIGFyZ3VtZW50cy5cbiAqXG4gKiBAcGFyYW0gey4uLkZ1bmN0aW9ufSBtaWRkbGV3YXJlcyBUaGUgbWlkZGxld2FyZSBjaGFpbiB0byBiZSBhcHBsaWVkLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBBIHN0b3JlIGVuaGFuY2VyIGFwcGx5aW5nIHRoZSBtaWRkbGV3YXJlLlxuICovXG5cbmZ1bmN0aW9uIGFwcGx5TWlkZGxld2FyZSgpIHtcbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIG1pZGRsZXdhcmVzID0gQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgbWlkZGxld2FyZXNbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKG5leHQpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHJlZHVjZXIsIGluaXRpYWxTdGF0ZSkge1xuICAgICAgdmFyIHN0b3JlID0gbmV4dChyZWR1Y2VyLCBpbml0aWFsU3RhdGUpO1xuICAgICAgdmFyIF9kaXNwYXRjaCA9IHN0b3JlLmRpc3BhdGNoO1xuICAgICAgdmFyIGNoYWluID0gW107XG5cbiAgICAgIHZhciBtaWRkbGV3YXJlQVBJID0ge1xuICAgICAgICBnZXRTdGF0ZTogc3RvcmUuZ2V0U3RhdGUsXG4gICAgICAgIGRpc3BhdGNoOiBmdW5jdGlvbiBkaXNwYXRjaChhY3Rpb24pIHtcbiAgICAgICAgICByZXR1cm4gX2Rpc3BhdGNoKGFjdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBjaGFpbiA9IG1pZGRsZXdhcmVzLm1hcChmdW5jdGlvbiAobWlkZGxld2FyZSkge1xuICAgICAgICByZXR1cm4gbWlkZGxld2FyZShtaWRkbGV3YXJlQVBJKTtcbiAgICAgIH0pO1xuICAgICAgX2Rpc3BhdGNoID0gX2NvbXBvc2UyWydkZWZhdWx0J10uYXBwbHkodW5kZWZpbmVkLCBjaGFpbikoc3RvcmUuZGlzcGF0Y2gpO1xuXG4gICAgICByZXR1cm4gX2V4dGVuZHMoe30sIHN0b3JlLCB7XG4gICAgICAgIGRpc3BhdGNoOiBfZGlzcGF0Y2hcbiAgICAgIH0pO1xuICAgIH07XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xufSx7XCIuL2NvbXBvc2VcIjoyM31dLDIxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGJpbmRBY3Rpb25DcmVhdG9ycztcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX3V0aWxzTWFwVmFsdWVzID0gcmVxdWlyZSgnLi4vdXRpbHMvbWFwVmFsdWVzJyk7XG5cbnZhciBfdXRpbHNNYXBWYWx1ZXMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdXRpbHNNYXBWYWx1ZXMpO1xuXG5mdW5jdGlvbiBiaW5kQWN0aW9uQ3JlYXRvcihhY3Rpb25DcmVhdG9yLCBkaXNwYXRjaCkge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBkaXNwYXRjaChhY3Rpb25DcmVhdG9yLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKSk7XG4gIH07XG59XG5cbi8qKlxuICogVHVybnMgYW4gb2JqZWN0IHdob3NlIHZhbHVlcyBhcmUgYWN0aW9uIGNyZWF0b3JzLCBpbnRvIGFuIG9iamVjdCB3aXRoIHRoZVxuICogc2FtZSBrZXlzLCBidXQgd2l0aCBldmVyeSBmdW5jdGlvbiB3cmFwcGVkIGludG8gYSBgZGlzcGF0Y2hgIGNhbGwgc28gdGhleVxuICogbWF5IGJlIGludm9rZWQgZGlyZWN0bHkuIFRoaXMgaXMganVzdCBhIGNvbnZlbmllbmNlIG1ldGhvZCwgYXMgeW91IGNhbiBjYWxsXG4gKiBgc3RvcmUuZGlzcGF0Y2goTXlBY3Rpb25DcmVhdG9ycy5kb1NvbWV0aGluZygpKWAgeW91cnNlbGYganVzdCBmaW5lLlxuICpcbiAqIEZvciBjb252ZW5pZW5jZSwgeW91IGNhbiBhbHNvIHBhc3MgYSBzaW5nbGUgZnVuY3Rpb24gYXMgdGhlIGZpcnN0IGFyZ3VtZW50LFxuICogYW5kIGdldCBhIGZ1bmN0aW9uIGluIHJldHVybi5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufE9iamVjdH0gYWN0aW9uQ3JlYXRvcnMgQW4gb2JqZWN0IHdob3NlIHZhbHVlcyBhcmUgYWN0aW9uXG4gKiBjcmVhdG9yIGZ1bmN0aW9ucy4gT25lIGhhbmR5IHdheSB0byBvYnRhaW4gaXQgaXMgdG8gdXNlIEVTNiBgaW1wb3J0ICogYXNgXG4gKiBzeW50YXguIFlvdSBtYXkgYWxzbyBwYXNzIGEgc2luZ2xlIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGRpc3BhdGNoIFRoZSBgZGlzcGF0Y2hgIGZ1bmN0aW9uIGF2YWlsYWJsZSBvbiB5b3VyIFJlZHV4XG4gKiBzdG9yZS5cbiAqXG4gKiBAcmV0dXJucyB7RnVuY3Rpb258T2JqZWN0fSBUaGUgb2JqZWN0IG1pbWlja2luZyB0aGUgb3JpZ2luYWwgb2JqZWN0LCBidXQgd2l0aFxuICogZXZlcnkgYWN0aW9uIGNyZWF0b3Igd3JhcHBlZCBpbnRvIHRoZSBgZGlzcGF0Y2hgIGNhbGwuIElmIHlvdSBwYXNzZWQgYVxuICogZnVuY3Rpb24gYXMgYGFjdGlvbkNyZWF0b3JzYCwgdGhlIHJldHVybiB2YWx1ZSB3aWxsIGFsc28gYmUgYSBzaW5nbGVcbiAqIGZ1bmN0aW9uLlxuICovXG5cbmZ1bmN0aW9uIGJpbmRBY3Rpb25DcmVhdG9ycyhhY3Rpb25DcmVhdG9ycywgZGlzcGF0Y2gpIHtcbiAgaWYgKHR5cGVvZiBhY3Rpb25DcmVhdG9ycyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBiaW5kQWN0aW9uQ3JlYXRvcihhY3Rpb25DcmVhdG9ycywgZGlzcGF0Y2gpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBhY3Rpb25DcmVhdG9ycyAhPT0gJ29iamVjdCcgfHwgYWN0aW9uQ3JlYXRvcnMgPT09IG51bGwgfHwgYWN0aW9uQ3JlYXRvcnMgPT09IHVuZGVmaW5lZCkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tZXEtbnVsbFxuICAgIHRocm93IG5ldyBFcnJvcignYmluZEFjdGlvbkNyZWF0b3JzIGV4cGVjdGVkIGFuIG9iamVjdCBvciBhIGZ1bmN0aW9uLCBpbnN0ZWFkIHJlY2VpdmVkICcgKyAoYWN0aW9uQ3JlYXRvcnMgPT09IG51bGwgPyAnbnVsbCcgOiB0eXBlb2YgYWN0aW9uQ3JlYXRvcnMpICsgJy4gJyArICdEaWQgeW91IHdyaXRlIFwiaW1wb3J0IEFjdGlvbkNyZWF0b3JzIGZyb21cIiBpbnN0ZWFkIG9mIFwiaW1wb3J0ICogYXMgQWN0aW9uQ3JlYXRvcnMgZnJvbVwiPycpO1xuICB9XG5cbiAgcmV0dXJuIF91dGlsc01hcFZhbHVlczJbJ2RlZmF1bHQnXShhY3Rpb25DcmVhdG9ycywgZnVuY3Rpb24gKGFjdGlvbkNyZWF0b3IpIHtcbiAgICByZXR1cm4gYmluZEFjdGlvbkNyZWF0b3IoYWN0aW9uQ3JlYXRvciwgZGlzcGF0Y2gpO1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG59LHtcIi4uL3V0aWxzL21hcFZhbHVlc1wiOjI1fV0sMjI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuKGZ1bmN0aW9uIChwcm9jZXNzKXtcbid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGNvbWJpbmVSZWR1Y2VycztcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX2NyZWF0ZVN0b3JlID0gcmVxdWlyZSgnLi4vY3JlYXRlU3RvcmUnKTtcblxudmFyIF91dGlsc0lzUGxhaW5PYmplY3QgPSByZXF1aXJlKCcuLi91dGlscy9pc1BsYWluT2JqZWN0Jyk7XG5cbnZhciBfdXRpbHNJc1BsYWluT2JqZWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3V0aWxzSXNQbGFpbk9iamVjdCk7XG5cbnZhciBfdXRpbHNNYXBWYWx1ZXMgPSByZXF1aXJlKCcuLi91dGlscy9tYXBWYWx1ZXMnKTtcblxudmFyIF91dGlsc01hcFZhbHVlczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF91dGlsc01hcFZhbHVlcyk7XG5cbnZhciBfdXRpbHNQaWNrID0gcmVxdWlyZSgnLi4vdXRpbHMvcGljaycpO1xuXG52YXIgX3V0aWxzUGljazIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF91dGlsc1BpY2spO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG5cbmZ1bmN0aW9uIGdldFVuZGVmaW5lZFN0YXRlRXJyb3JNZXNzYWdlKGtleSwgYWN0aW9uKSB7XG4gIHZhciBhY3Rpb25UeXBlID0gYWN0aW9uICYmIGFjdGlvbi50eXBlO1xuICB2YXIgYWN0aW9uTmFtZSA9IGFjdGlvblR5cGUgJiYgJ1wiJyArIGFjdGlvblR5cGUudG9TdHJpbmcoKSArICdcIicgfHwgJ2FuIGFjdGlvbic7XG5cbiAgcmV0dXJuICdSZWR1Y2VyIFwiJyArIGtleSArICdcIiByZXR1cm5lZCB1bmRlZmluZWQgaGFuZGxpbmcgJyArIGFjdGlvbk5hbWUgKyAnLiAnICsgJ1RvIGlnbm9yZSBhbiBhY3Rpb24sIHlvdSBtdXN0IGV4cGxpY2l0bHkgcmV0dXJuIHRoZSBwcmV2aW91cyBzdGF0ZS4nO1xufVxuXG5mdW5jdGlvbiBnZXRVbmV4cGVjdGVkU3RhdGVLZXlXYXJuaW5nTWVzc2FnZShpbnB1dFN0YXRlLCBvdXRwdXRTdGF0ZSwgYWN0aW9uKSB7XG4gIHZhciByZWR1Y2VyS2V5cyA9IE9iamVjdC5rZXlzKG91dHB1dFN0YXRlKTtcbiAgdmFyIGFyZ3VtZW50TmFtZSA9IGFjdGlvbiAmJiBhY3Rpb24udHlwZSA9PT0gX2NyZWF0ZVN0b3JlLkFjdGlvblR5cGVzLklOSVQgPyAnaW5pdGlhbFN0YXRlIGFyZ3VtZW50IHBhc3NlZCB0byBjcmVhdGVTdG9yZScgOiAncHJldmlvdXMgc3RhdGUgcmVjZWl2ZWQgYnkgdGhlIHJlZHVjZXInO1xuXG4gIGlmIChyZWR1Y2VyS2V5cy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gJ1N0b3JlIGRvZXMgbm90IGhhdmUgYSB2YWxpZCByZWR1Y2VyLiBNYWtlIHN1cmUgdGhlIGFyZ3VtZW50IHBhc3NlZCAnICsgJ3RvIGNvbWJpbmVSZWR1Y2VycyBpcyBhbiBvYmplY3Qgd2hvc2UgdmFsdWVzIGFyZSByZWR1Y2Vycy4nO1xuICB9XG5cbiAgaWYgKCFfdXRpbHNJc1BsYWluT2JqZWN0MlsnZGVmYXVsdCddKGlucHV0U3RhdGUpKSB7XG4gICAgcmV0dXJuICdUaGUgJyArIGFyZ3VtZW50TmFtZSArICcgaGFzIHVuZXhwZWN0ZWQgdHlwZSBvZiBcIicgKyAoe30pLnRvU3RyaW5nLmNhbGwoaW5wdXRTdGF0ZSkubWF0Y2goL1xccyhbYS16fEEtWl0rKS8pWzFdICsgJ1wiLiBFeHBlY3RlZCBhcmd1bWVudCB0byBiZSBhbiBvYmplY3Qgd2l0aCB0aGUgZm9sbG93aW5nICcgKyAoJ2tleXM6IFwiJyArIHJlZHVjZXJLZXlzLmpvaW4oJ1wiLCBcIicpICsgJ1wiJyk7XG4gIH1cblxuICB2YXIgdW5leHBlY3RlZEtleXMgPSBPYmplY3Qua2V5cyhpbnB1dFN0YXRlKS5maWx0ZXIoZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiByZWR1Y2VyS2V5cy5pbmRleE9mKGtleSkgPCAwO1xuICB9KTtcblxuICBpZiAodW5leHBlY3RlZEtleXMubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiAnVW5leHBlY3RlZCAnICsgKHVuZXhwZWN0ZWRLZXlzLmxlbmd0aCA+IDEgPyAna2V5cycgOiAna2V5JykgKyAnICcgKyAoJ1wiJyArIHVuZXhwZWN0ZWRLZXlzLmpvaW4oJ1wiLCBcIicpICsgJ1wiIGZvdW5kIGluICcgKyBhcmd1bWVudE5hbWUgKyAnLiAnKSArICdFeHBlY3RlZCB0byBmaW5kIG9uZSBvZiB0aGUga25vd24gcmVkdWNlciBrZXlzIGluc3RlYWQ6ICcgKyAoJ1wiJyArIHJlZHVjZXJLZXlzLmpvaW4oJ1wiLCBcIicpICsgJ1wiLiBVbmV4cGVjdGVkIGtleXMgd2lsbCBiZSBpZ25vcmVkLicpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGFzc2VydFJlZHVjZXJTYW5pdHkocmVkdWNlcnMpIHtcbiAgT2JqZWN0LmtleXMocmVkdWNlcnMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIHZhciByZWR1Y2VyID0gcmVkdWNlcnNba2V5XTtcbiAgICB2YXIgaW5pdGlhbFN0YXRlID0gcmVkdWNlcih1bmRlZmluZWQsIHsgdHlwZTogX2NyZWF0ZVN0b3JlLkFjdGlvblR5cGVzLklOSVQgfSk7XG5cbiAgICBpZiAodHlwZW9mIGluaXRpYWxTdGF0ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmVkdWNlciBcIicgKyBrZXkgKyAnXCIgcmV0dXJuZWQgdW5kZWZpbmVkIGR1cmluZyBpbml0aWFsaXphdGlvbi4gJyArICdJZiB0aGUgc3RhdGUgcGFzc2VkIHRvIHRoZSByZWR1Y2VyIGlzIHVuZGVmaW5lZCwgeW91IG11c3QgJyArICdleHBsaWNpdGx5IHJldHVybiB0aGUgaW5pdGlhbCBzdGF0ZS4gVGhlIGluaXRpYWwgc3RhdGUgbWF5ICcgKyAnbm90IGJlIHVuZGVmaW5lZC4nKTtcbiAgICB9XG5cbiAgICB2YXIgdHlwZSA9ICdAQHJlZHV4L1BST0JFX1VOS05PV05fQUNUSU9OXycgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoNykuc3BsaXQoJycpLmpvaW4oJy4nKTtcbiAgICBpZiAodHlwZW9mIHJlZHVjZXIodW5kZWZpbmVkLCB7IHR5cGU6IHR5cGUgfSkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlZHVjZXIgXCInICsga2V5ICsgJ1wiIHJldHVybmVkIHVuZGVmaW5lZCB3aGVuIHByb2JlZCB3aXRoIGEgcmFuZG9tIHR5cGUuICcgKyAoJ0RvblxcJ3QgdHJ5IHRvIGhhbmRsZSAnICsgX2NyZWF0ZVN0b3JlLkFjdGlvblR5cGVzLklOSVQgKyAnIG9yIG90aGVyIGFjdGlvbnMgaW4gXCJyZWR1eC8qXCIgJykgKyAnbmFtZXNwYWNlLiBUaGV5IGFyZSBjb25zaWRlcmVkIHByaXZhdGUuIEluc3RlYWQsIHlvdSBtdXN0IHJldHVybiB0aGUgJyArICdjdXJyZW50IHN0YXRlIGZvciBhbnkgdW5rbm93biBhY3Rpb25zLCB1bmxlc3MgaXQgaXMgdW5kZWZpbmVkLCAnICsgJ2luIHdoaWNoIGNhc2UgeW91IG11c3QgcmV0dXJuIHRoZSBpbml0aWFsIHN0YXRlLCByZWdhcmRsZXNzIG9mIHRoZSAnICsgJ2FjdGlvbiB0eXBlLiBUaGUgaW5pdGlhbCBzdGF0ZSBtYXkgbm90IGJlIHVuZGVmaW5lZC4nKTtcbiAgICB9XG4gIH0pO1xufVxuXG4vKipcbiAqIFR1cm5zIGFuIG9iamVjdCB3aG9zZSB2YWx1ZXMgYXJlIGRpZmZlcmVudCByZWR1Y2VyIGZ1bmN0aW9ucywgaW50byBhIHNpbmdsZVxuICogcmVkdWNlciBmdW5jdGlvbi4gSXQgd2lsbCBjYWxsIGV2ZXJ5IGNoaWxkIHJlZHVjZXIsIGFuZCBnYXRoZXIgdGhlaXIgcmVzdWx0c1xuICogaW50byBhIHNpbmdsZSBzdGF0ZSBvYmplY3QsIHdob3NlIGtleXMgY29ycmVzcG9uZCB0byB0aGUga2V5cyBvZiB0aGUgcGFzc2VkXG4gKiByZWR1Y2VyIGZ1bmN0aW9ucy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gcmVkdWNlcnMgQW4gb2JqZWN0IHdob3NlIHZhbHVlcyBjb3JyZXNwb25kIHRvIGRpZmZlcmVudFxuICogcmVkdWNlciBmdW5jdGlvbnMgdGhhdCBuZWVkIHRvIGJlIGNvbWJpbmVkIGludG8gb25lLiBPbmUgaGFuZHkgd2F5IHRvIG9idGFpblxuICogaXQgaXMgdG8gdXNlIEVTNiBgaW1wb3J0ICogYXMgcmVkdWNlcnNgIHN5bnRheC4gVGhlIHJlZHVjZXJzIG1heSBuZXZlciByZXR1cm5cbiAqIHVuZGVmaW5lZCBmb3IgYW55IGFjdGlvbi4gSW5zdGVhZCwgdGhleSBzaG91bGQgcmV0dXJuIHRoZWlyIGluaXRpYWwgc3RhdGVcbiAqIGlmIHRoZSBzdGF0ZSBwYXNzZWQgdG8gdGhlbSB3YXMgdW5kZWZpbmVkLCBhbmQgdGhlIGN1cnJlbnQgc3RhdGUgZm9yIGFueVxuICogdW5yZWNvZ25pemVkIGFjdGlvbi5cbiAqXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IEEgcmVkdWNlciBmdW5jdGlvbiB0aGF0IGludm9rZXMgZXZlcnkgcmVkdWNlciBpbnNpZGUgdGhlXG4gKiBwYXNzZWQgb2JqZWN0LCBhbmQgYnVpbGRzIGEgc3RhdGUgb2JqZWN0IHdpdGggdGhlIHNhbWUgc2hhcGUuXG4gKi9cblxuZnVuY3Rpb24gY29tYmluZVJlZHVjZXJzKHJlZHVjZXJzKSB7XG4gIHZhciBmaW5hbFJlZHVjZXJzID0gX3V0aWxzUGljazJbJ2RlZmF1bHQnXShyZWR1Y2VycywgZnVuY3Rpb24gKHZhbCkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsID09PSAnZnVuY3Rpb24nO1xuICB9KTtcbiAgdmFyIHNhbml0eUVycm9yO1xuXG4gIHRyeSB7XG4gICAgYXNzZXJ0UmVkdWNlclNhbml0eShmaW5hbFJlZHVjZXJzKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHNhbml0eUVycm9yID0gZTtcbiAgfVxuXG4gIHZhciBkZWZhdWx0U3RhdGUgPSBfdXRpbHNNYXBWYWx1ZXMyWydkZWZhdWx0J10oZmluYWxSZWR1Y2VycywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH0pO1xuXG4gIHJldHVybiBmdW5jdGlvbiBjb21iaW5hdGlvbihzdGF0ZSwgYWN0aW9uKSB7XG4gICAgaWYgKHN0YXRlID09PSB1bmRlZmluZWQpIHN0YXRlID0gZGVmYXVsdFN0YXRlO1xuXG4gICAgaWYgKHNhbml0eUVycm9yKSB7XG4gICAgICB0aHJvdyBzYW5pdHlFcnJvcjtcbiAgICB9XG5cbiAgICB2YXIgZmluYWxTdGF0ZSA9IF91dGlsc01hcFZhbHVlczJbJ2RlZmF1bHQnXShmaW5hbFJlZHVjZXJzLCBmdW5jdGlvbiAocmVkdWNlciwga2V5KSB7XG4gICAgICB2YXIgbmV3U3RhdGUgPSByZWR1Y2VyKHN0YXRlW2tleV0sIGFjdGlvbik7XG4gICAgICBpZiAodHlwZW9mIG5ld1N0YXRlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB2YXIgZXJyb3JNZXNzYWdlID0gZ2V0VW5kZWZpbmVkU3RhdGVFcnJvck1lc3NhZ2Uoa2V5LCBhY3Rpb24pO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3JNZXNzYWdlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXdTdGF0ZTtcbiAgICB9KTtcblxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICB2YXIgd2FybmluZ01lc3NhZ2UgPSBnZXRVbmV4cGVjdGVkU3RhdGVLZXlXYXJuaW5nTWVzc2FnZShzdGF0ZSwgZmluYWxTdGF0ZSwgYWN0aW9uKTtcbiAgICAgIGlmICh3YXJuaW5nTWVzc2FnZSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKHdhcm5pbmdNZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmluYWxTdGF0ZTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG59KS5jYWxsKHRoaXMscmVxdWlyZSgnX3Byb2Nlc3MnKSlcbn0se1wiLi4vY3JlYXRlU3RvcmVcIjoxOCxcIi4uL3V0aWxzL2lzUGxhaW5PYmplY3RcIjoyNCxcIi4uL3V0aWxzL21hcFZhbHVlc1wiOjI1LFwiLi4vdXRpbHMvcGlja1wiOjI2LFwiX3Byb2Nlc3NcIjoxNX1dLDIzOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbi8qKlxuICogQ29tcG9zZXMgc2luZ2xlLWFyZ3VtZW50IGZ1bmN0aW9ucyBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gKlxuICogQHBhcmFtIHsuLi5GdW5jdGlvbn0gZnVuY3MgVGhlIGZ1bmN0aW9ucyB0byBjb21wb3NlLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBBIGZ1bmN0aW9uIG9idGFpbmVkIGJ5IGNvbXBvc2luZyBmdW5jdGlvbnMgZnJvbSByaWdodCB0b1xuICogbGVmdC4gRm9yIGV4YW1wbGUsIGNvbXBvc2UoZiwgZywgaCkgaXMgaWRlbnRpY2FsIHRvIGFyZyA9PiBmKGcoaChhcmcpKSkuXG4gKi9cblwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBjb21wb3NlO1xuXG5mdW5jdGlvbiBjb21wb3NlKCkge1xuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgZnVuY3MgPSBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBmdW5jc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoYXJnKSB7XG4gICAgcmV0dXJuIGZ1bmNzLnJlZHVjZVJpZ2h0KGZ1bmN0aW9uIChjb21wb3NlZCwgZikge1xuICAgICAgcmV0dXJuIGYoY29tcG9zZWQpO1xuICAgIH0sIGFyZyk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1tcImRlZmF1bHRcIl07XG59LHt9XSwyNDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzWydkZWZhdWx0J10gPSBpc1BsYWluT2JqZWN0O1xudmFyIGZuVG9TdHJpbmcgPSBmdW5jdGlvbiBmblRvU3RyaW5nKGZuKSB7XG4gIHJldHVybiBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChmbik7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7YW55fSBvYmogVGhlIG9iamVjdCB0byBpbnNwZWN0LlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIGFyZ3VtZW50IGFwcGVhcnMgdG8gYmUgYSBwbGFpbiBvYmplY3QuXG4gKi9cblxuZnVuY3Rpb24gaXNQbGFpbk9iamVjdChvYmopIHtcbiAgaWYgKCFvYmogfHwgdHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgcHJvdG8gPSB0eXBlb2Ygb2JqLmNvbnN0cnVjdG9yID09PSAnZnVuY3Rpb24nID8gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaikgOiBPYmplY3QucHJvdG90eXBlO1xuXG4gIGlmIChwcm90byA9PT0gbnVsbCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgdmFyIGNvbnN0cnVjdG9yID0gcHJvdG8uY29uc3RydWN0b3I7XG5cbiAgcmV0dXJuIHR5cGVvZiBjb25zdHJ1Y3RvciA9PT0gJ2Z1bmN0aW9uJyAmJiBjb25zdHJ1Y3RvciBpbnN0YW5jZW9mIGNvbnN0cnVjdG9yICYmIGZuVG9TdHJpbmcoY29uc3RydWN0b3IpID09PSBmblRvU3RyaW5nKE9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xufSx7fV0sMjU6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuLyoqXG4gKiBBcHBsaWVzIGEgZnVuY3Rpb24gdG8gZXZlcnkga2V5LXZhbHVlIHBhaXIgaW5zaWRlIGFuIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIG1hcHBlciBmdW5jdGlvbiB0aGF0IHJlY2VpdmVzIHRoZSB2YWx1ZSBhbmQgdGhlIGtleS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IEEgbmV3IG9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZSBtYXBwZWQgdmFsdWVzIGZvciB0aGUga2V5cy5cbiAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IG1hcFZhbHVlcztcblxuZnVuY3Rpb24gbWFwVmFsdWVzKG9iaiwgZm4pIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikucmVkdWNlKGZ1bmN0aW9uIChyZXN1bHQsIGtleSkge1xuICAgIHJlc3VsdFtrZXldID0gZm4ob2JqW2tleV0sIGtleSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSwge30pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdO1xufSx7fV0sMjY6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuLyoqXG4gKiBQaWNrcyBrZXktdmFsdWUgcGFpcnMgZnJvbSBhbiBvYmplY3Qgd2hlcmUgdmFsdWVzIHNhdGlzZnkgYSBwcmVkaWNhdGUuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIHBpY2sgZnJvbS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBwcmVkaWNhdGUgdGhlIHZhbHVlcyBtdXN0IHNhdGlzZnkgdG8gYmUgY29waWVkLlxuICogQHJldHVybnMge09iamVjdH0gVGhlIG9iamVjdCB3aXRoIHRoZSB2YWx1ZXMgdGhhdCBzYXRpc2ZpZWQgdGhlIHByZWRpY2F0ZS5cbiAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHBpY2s7XG5cbmZ1bmN0aW9uIHBpY2sob2JqLCBmbikge1xuICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5yZWR1Y2UoZnVuY3Rpb24gKHJlc3VsdCwga2V5KSB7XG4gICAgaWYgKGZuKG9ialtrZXldKSkge1xuICAgICAgcmVzdWx0W2tleV0gPSBvYmpba2V5XTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSwge30pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdO1xufSx7fV0sMjc6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBTb3VuZENsb3VkIChjbGllbnRJZCkge1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBTb3VuZENsb3VkKSkge1xuICAgICAgICByZXR1cm4gbmV3IFNvdW5kQ2xvdWQoY2xpZW50SWQpO1xuICAgIH1cblxuICAgIGlmICghY2xpZW50SWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTb3VuZENsb3VkIEFQSSBjbGllbnRJZCBpcyByZXF1aXJlZCwgZ2V0IGl0IC0gaHR0cHM6Ly9kZXZlbG9wZXJzLnNvdW5kY2xvdWQuY29tLycpO1xuICAgIH1cblxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gICAgdGhpcy5fY2xpZW50SWQgPSBjbGllbnRJZDtcbiAgICB0aGlzLl9iYXNlVXJsID0gJ2h0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tJztcblxuICAgIHRoaXMucGxheWluZyA9IGZhbHNlO1xuICAgIHRoaXMuZHVyYXRpb24gPSAwO1xuXG4gICAgdGhpcy5hdWRpbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2F1ZGlvJyk7XG59XG5cblNvdW5kQ2xvdWQucHJvdG90eXBlLnJlc29sdmUgPSBmdW5jdGlvbiAodXJsLCBjYWxsYmFjaykge1xuICAgIGlmICghdXJsKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignU291bmRDbG91ZCB0cmFjayBvciBwbGF5bGlzdCB1cmwgaXMgcmVxdWlyZWQnKTtcbiAgICB9XG5cbiAgICB1cmwgPSB0aGlzLl9iYXNlVXJsICsgJy9yZXNvbHZlLmpzb24/dXJsPScgKyB1cmwgKyAnJmNsaWVudF9pZD0nICsgdGhpcy5fY2xpZW50SWQ7XG5cbiAgICB0aGlzLl9qc29ucCh1cmwsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7XG4gICAgICAgICAgICB2YXIgdHJhY2tzID0gZGF0YTtcbiAgICAgICAgICAgIGRhdGEgPSB7dHJhY2tzOiB0cmFja3N9O1xuICAgICAgICAgICAgdGhpcy5fcGxheWxpc3QgPSBkYXRhO1xuICAgICAgICB9IGVsc2UgaWYgKGRhdGEudHJhY2tzKSB7XG4gICAgICAgICAgICB0aGlzLl9wbGF5bGlzdCA9IGRhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl90cmFjayA9IGRhdGE7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmR1cmF0aW9uID0gZGF0YS5kdXJhdGlvbiAmJiAhaXNOYU4oZGF0YS5kdXJhdGlvbikgP1xuICAgICAgICAgICAgZGF0YS5kdXJhdGlvbiAvIDEwMDAgOiAvLyBjb252ZXJ0IHRvIHNlY29uZHNcbiAgICAgICAgICAgIDA7IC8vIG5vIGR1cmF0aW9uIGlzIHplcm9cblxuICAgICAgICBjYWxsYmFjayhkYXRhKTtcbiAgICB9LmJpbmQodGhpcykpO1xufTtcblxuU291bmRDbG91ZC5wcm90b3R5cGUuX2pzb25wID0gZnVuY3Rpb24gKHVybCwgY2FsbGJhY2spIHtcbiAgICB2YXIgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdIHx8IGRvY3VtZW50LmhlYWQ7XG4gICAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuXG4gICAgdmFyIGlkID0gJ2pzb25wX2NhbGxiYWNrXycgKyBNYXRoLnJvdW5kKDEwMDAwMCAqIE1hdGgucmFuZG9tKCkpO1xuICAgIHdpbmRvd1tpZF0gPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBpZiAoc2NyaXB0LnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgIHNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdCk7XG4gICAgICAgIH1cbiAgICAgICAgd2luZG93W2lkXSA9IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICBjYWxsYmFjayhkYXRhKTtcbiAgICB9O1xuXG4gICAgc2NyaXB0LnNyYyA9IHVybCArICh1cmwuaW5kZXhPZignPycpID49IDAgPyAnJicgOiAnPycpICsgJ2NhbGxiYWNrPScgKyBpZDtcbiAgICB0YXJnZXQucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoc2NyaXB0LCB0YXJnZXQpO1xufTtcblxuU291bmRDbG91ZC5wcm90b3R5cGUub24gPSBmdW5jdGlvbiAoZSwgZm4pIHtcbiAgICB0aGlzLl9ldmVudHNbZV0gPSBmbjtcbiAgICB0aGlzLmF1ZGlvLmFkZEV2ZW50TGlzdGVuZXIoZSwgZm4sIGZhbHNlKTtcbn07XG5cblNvdW5kQ2xvdWQucHJvdG90eXBlLm9mZiA9IGZ1bmN0aW9uIChlLCBmbikge1xuICAgIHRoaXMuX2V2ZW50c1tlXSA9IG51bGw7XG4gICAgdGhpcy5hdWRpby5yZW1vdmVFdmVudExpc3RlbmVyKGUsIGZuKTtcbn07XG5cblNvdW5kQ2xvdWQucHJvdG90eXBlLnVuYmluZEFsbCA9IGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKHZhciBlIGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgICB2YXIgZm4gPSB0aGlzLl9ldmVudHNbZV07XG4gICAgICAgIGlmIChmbikge1xuICAgICAgICAgICAgdGhpcy5vZmYoZSwgZm4pO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuU291bmRDbG91ZC5wcm90b3R5cGUucHJlbG9hZCA9IGZ1bmN0aW9uIChzdHJlYW1VcmwpIHtcbiAgICB0aGlzLl90cmFjayA9IHtzdHJlYW1fdXJsOiBzdHJlYW1Vcmx9O1xuICAgIHRoaXMuYXVkaW8uc3JjID0gc3RyZWFtVXJsICsgJz9jbGllbnRfaWQ9JyArIHRoaXMuX2NsaWVudElkO1xufTtcblxuU291bmRDbG91ZC5wcm90b3R5cGUucGxheSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdmFyIHNyYztcblxuICAgIGlmIChvcHRpb25zLnN0cmVhbVVybCkge1xuICAgICAgICBzcmMgPSBvcHRpb25zLnN0cmVhbVVybDtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX3BsYXlsaXN0KSB7XG4gICAgICAgIHZhciBsZW5ndGggPSB0aGlzLl9wbGF5bGlzdC50cmFja3MubGVuZ3RoO1xuICAgICAgICBpZiAobGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLl9wbGF5bGlzdEluZGV4ID0gb3B0aW9ucy5wbGF5bGlzdEluZGV4IHx8IDA7XG5cbiAgICAgICAgICAgIC8vIGJlIHNpbGVudCBpZiBpbmRleCBpcyBvdXQgb2YgcmFuZ2VcbiAgICAgICAgICAgIGlmICh0aGlzLl9wbGF5bGlzdEluZGV4ID49IGxlbmd0aCB8fCB0aGlzLl9wbGF5bGlzdEluZGV4IDwgMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3BsYXlsaXN0SW5kZXggPSAwO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNyYyA9IHRoaXMuX3BsYXlsaXN0LnRyYWNrc1t0aGlzLl9wbGF5bGlzdEluZGV4XS5zdHJlYW1fdXJsO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmICh0aGlzLl90cmFjaykge1xuICAgICAgICBzcmMgPSB0aGlzLl90cmFjay5zdHJlYW1fdXJsO1xuICAgIH1cblxuICAgIGlmICghc3JjKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlcmUgaXMgbm8gdHJhY2tzIHRvIHBsYXksIHVzZSBgc3RyZWFtVXJsYCBvcHRpb24gb3IgYGxvYWRgIG1ldGhvZCcpO1xuICAgIH1cblxuICAgIHNyYyArPSAnJmNsaWVudF9pZD0nICsgdGhpcy5fY2xpZW50SWQ7XG5cbiAgICBpZiAoc3JjICE9PSB0aGlzLmF1ZGlvLnNyYykge1xuICAgICAgICB0aGlzLmF1ZGlvLnNyYyA9IHNyYztcbiAgICB9XG5cbiAgICB0aGlzLnBsYXlpbmcgPSBzcmM7XG4gICAgdGhpcy5hdWRpby5wbGF5KCk7XG59O1xuXG5Tb3VuZENsb3VkLnByb3RvdHlwZS5wYXVzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmF1ZGlvLnBhdXNlKCk7XG4gICAgdGhpcy5wbGF5aW5nID0gZmFsc2U7XG59O1xuXG5Tb3VuZENsb3VkLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuYXVkaW8ucGF1c2UoKTtcbiAgICB0aGlzLmF1ZGlvLmN1cnJlbnRUaW1lID0gMDtcbiAgICB0aGlzLnBsYXlpbmcgPSBmYWxzZTtcbn07XG5cblNvdW5kQ2xvdWQucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRyYWNrc0xlbmd0aCA9IHRoaXMuX3BsYXlsaXN0LnRyYWNrcy5sZW5ndGg7XG4gICAgaWYgKHRoaXMuX3BsYXlsaXN0SW5kZXggPj0gdHJhY2tzTGVuZ3RoIC0gMSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLl9wbGF5bGlzdCAmJiB0cmFja3NMZW5ndGgpIHtcbiAgICAgICAgdGhpcy5wbGF5KHtwbGF5bGlzdEluZGV4OiArK3RoaXMuX3BsYXlsaXN0SW5kZXh9KTtcbiAgICB9XG59O1xuXG5Tb3VuZENsb3VkLnByb3RvdHlwZS5wcmV2aW91cyA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5fcGxheWxpc3RJbmRleCA8PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuX3BsYXlsaXN0ICYmIHRoaXMuX3BsYXlsaXN0LnRyYWNrcy5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5wbGF5KHtwbGF5bGlzdEluZGV4OiAtLXRoaXMuX3BsYXlsaXN0SW5kZXh9KTtcbiAgICB9XG59O1xuXG5Tb3VuZENsb3VkLnByb3RvdHlwZS5zZWVrID0gZnVuY3Rpb24gKGUpIHtcbiAgICBpZiAoIXRoaXMuYXVkaW8ucmVhZHlTdGF0ZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHZhciBwZXJjZW50ID0gZS5vZmZzZXRYIC8gZS50YXJnZXQub2Zmc2V0V2lkdGggfHwgKGUubGF5ZXJYIC0gZS50YXJnZXQub2Zmc2V0TGVmdCkgLyBlLnRhcmdldC5vZmZzZXRXaWR0aDtcbiAgICB0aGlzLmF1ZGlvLmN1cnJlbnRUaW1lID0gcGVyY2VudCAqICh0aGlzLmF1ZGlvLmR1cmF0aW9uIHx8IDApO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTb3VuZENsb3VkO1xuXG59LHt9XSwyODpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmZldGNoVHJhY2tzID0gZmV0Y2hUcmFja3M7XG5leHBvcnRzLnBsYXkgPSBwbGF5O1xuZXhwb3J0cy5yZXN1bWUgPSByZXN1bWU7XG5leHBvcnRzLnBhdXNlID0gcGF1c2U7XG5leHBvcnRzLnByZXYgPSBwcmV2O1xuZXhwb3J0cy5uZXh0ID0gbmV4dDtcbmV4cG9ydHMuZW5kID0gZW5kO1xuZXhwb3J0cy5jaGFuZ2VCYWNrZ3JvdW5kID0gY2hhbmdlQmFja2dyb3VuZDtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX3NvdW5kY2xvdWRBdWRpbyA9IHJlcXVpcmUoJ3NvdW5kY2xvdWQtYXVkaW8nKTtcblxudmFyIF9zb3VuZGNsb3VkQXVkaW8yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc291bmRjbG91ZEF1ZGlvKTtcblxudmFyIF9jb25zdGFudHMgPSByZXF1aXJlKCcuL2NvbnN0YW50cycpO1xuXG52YXIgRkVUQ0hfVFJBQ0tTID0gJ0ZFVENIX1RSQUNLUyc7XG5leHBvcnRzLkZFVENIX1RSQUNLUyA9IEZFVENIX1RSQUNLUztcbnZhciBGRVRDSF9UUkFDS1NfRVJST1IgPSAnRkVUQ0hfVFJBQ0tTX0VSUk9SJztcbmV4cG9ydHMuRkVUQ0hfVFJBQ0tTX0VSUk9SID0gRkVUQ0hfVFJBQ0tTX0VSUk9SO1xudmFyIEZFVENIX1RSQUNLU19TVUNDRVNTID0gJ0ZFVENIX1RSQUNLU19TVUNDRVNTJztcblxuZXhwb3J0cy5GRVRDSF9UUkFDS1NfU1VDQ0VTUyA9IEZFVENIX1RSQUNLU19TVUNDRVNTO1xuXG5mdW5jdGlvbiBmZXRjaFRyYWNrcyhwbGF5ZXIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGRpc3BhdGNoKSB7XG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogRkVUQ0hfVFJBQ0tTIH0pO1xuXG4gICAgICAgIHBsYXllci5yZXNvbHZlKF9jb25zdGFudHMuUkVTT0xWRV9VUkwsIGZ1bmN0aW9uIChwbGF5bGlzdCkge1xuICAgICAgICAgICAgaWYgKCFwbGF5bGlzdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkaXNwYXRjaCh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IEZFVENIX1RSQUNLU19FUlJPUixcbiAgICAgICAgICAgICAgICAgICAgcGF5bG9hZDogZXJyXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBkaXNwYXRjaCh7XG4gICAgICAgICAgICAgICAgdHlwZTogRkVUQ0hfVFJBQ0tTX1NVQ0NFU1MsXG4gICAgICAgICAgICAgICAgcGF5bG9hZDogcGxheWVyXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbn1cblxudmFyIFBMQVkgPSAnUExBWSc7XG5leHBvcnRzLlBMQVkgPSBQTEFZO1xudmFyIFBBVVNFID0gJ1BBVVNFJztcbmV4cG9ydHMuUEFVU0UgPSBQQVVTRTtcbnZhciBQUkVWID0gJ1BSRVYnO1xuZXhwb3J0cy5QUkVWID0gUFJFVjtcbnZhciBORVhUID0gJ05FWFQnO1xuZXhwb3J0cy5ORVhUID0gTkVYVDtcbnZhciBFTkQgPSAnRU5EJztcblxuZXhwb3J0cy5FTkQgPSBFTkQ7XG5cbmZ1bmN0aW9uIHBsYXkocGxheWVyLCBpbmRleCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZGlzcGF0Y2gsIGdldFN0YXRlKSB7XG4gICAgICAgIHZhciB0cmFja0luZGV4ID0gaW5kZXggIT09IHVuZGVmaW5lZCA/IGluZGV4IDogZ2V0U3RhdGUoKS5jdXJyZW50VHJhY2tJbmRleDtcbiAgICAgICAgcGxheWVyLnBsYXkoeyBwbGF5bGlzdEluZGV4OiB0cmFja0luZGV4IH0pO1xuXG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogUExBWSwgcGF5bG9hZDogcGxheWVyIH0pO1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIHJlc3VtZShwbGF5ZXIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGRpc3BhdGNoKSB7XG4gICAgICAgIHBsYXllci5hdWRpby5wbGF5KCk7XG5cbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBQTEFZLCBwYXlsb2FkOiBwbGF5ZXIgfSk7XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gcGF1c2UocGxheWVyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkaXNwYXRjaCkge1xuICAgICAgICBwbGF5ZXIucGF1c2UoKTtcblxuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IFBBVVNFLCBwYXlsb2FkOiBwbGF5ZXIgfSk7XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gcHJldihwbGF5ZXIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGRpc3BhdGNoKSB7XG4gICAgICAgIHBsYXllci5wcmV2aW91cygpO1xuXG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogUFJFViwgcGF5bG9hZDogcGxheWVyIH0pO1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIG5leHQocGxheWVyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkaXNwYXRjaCkge1xuICAgICAgICBwbGF5ZXIubmV4dCgpO1xuXG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogTkVYVCwgcGF5bG9hZDogcGxheWVyIH0pO1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIGVuZChwbGF5ZXIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBFTkQsXG4gICAgICAgIHBheWxvYWQ6IHBsYXllclxuICAgIH07XG59XG5cbnZhciBDSEFOR0VfQkFDS0dST1VORCA9ICdDSEFOR0VfQkFDS0dST1VORCc7XG5cbmV4cG9ydHMuQ0hBTkdFX0JBQ0tHUk9VTkQgPSBDSEFOR0VfQkFDS0dST1VORDtcblxuZnVuY3Rpb24gY2hhbmdlQmFja2dyb3VuZChfcmVmKSB7XG4gICAgdmFyIGh1ZSA9IF9yZWYuaHVlO1xuICAgIHZhciBzYXR1cmF0aW9uID0gX3JlZi5zYXR1cmF0aW9uO1xuICAgIHZhciBsaWdodG5lc3MgPSBfcmVmLmxpZ2h0bmVzcztcblxuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IENIQU5HRV9CQUNLR1JPVU5ELFxuICAgICAgICBwYXlsb2FkOiB7XG4gICAgICAgICAgICBodWU6IGh1ZSxcbiAgICAgICAgICAgIHNhdHVyYXRpb246IHNhdHVyYXRpb24sXG4gICAgICAgICAgICBsaWdodG5lc3M6IGxpZ2h0bmVzc1xuICAgICAgICB9XG4gICAgfTtcbn1cblxufSx7XCIuL2NvbnN0YW50c1wiOjMwLFwic291bmRjbG91ZC1hdWRpb1wiOjI3fV0sMjk6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfc291bmRjbG91ZEF1ZGlvID0gcmVxdWlyZSgnc291bmRjbG91ZC1hdWRpbycpO1xuXG52YXIgX3NvdW5kY2xvdWRBdWRpbzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zb3VuZGNsb3VkQXVkaW8pO1xuXG52YXIgX3JlZHV4ID0gcmVxdWlyZSgncmVkdXgnKTtcblxudmFyIF9yZWR1eExvZ2dlciA9IHJlcXVpcmUoJ3JlZHV4LWxvZ2dlcicpO1xuXG52YXIgX3JlZHV4TG9nZ2VyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlZHV4TG9nZ2VyKTtcblxudmFyIF9yZWR1eFRodW5rID0gcmVxdWlyZSgncmVkdXgtdGh1bmsnKTtcblxudmFyIF9yZWR1eFRodW5rMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlZHV4VGh1bmspO1xuXG52YXIgX3JlZHVjZXIgPSByZXF1aXJlKCcuL3JlZHVjZXInKTtcblxudmFyIF9yZWR1Y2VyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlZHVjZXIpO1xuXG52YXIgX2FjdGlvbnMgPSByZXF1aXJlKCcuL2FjdGlvbnMnKTtcblxudmFyIF9jb25zdGFudHMgPSByZXF1aXJlKCcuL2NvbnN0YW50cycpO1xuXG52YXIgX2RvbSA9IHJlcXVpcmUoJy4vZG9tJyk7XG5cbnZhciBfdmlzdWFsaXplciA9IHJlcXVpcmUoJy4vdmlzdWFsaXplcicpO1xuXG52YXIgX3Zpc3VhbGl6ZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdmlzdWFsaXplcik7XG5cbnZhciBfcm91dGVyID0gcmVxdWlyZSgnLi9yb3V0ZXInKTtcblxudmFyIF9yb3V0ZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcm91dGVyKTtcblxudmFyIGxvZ2dlciA9ICgwLCBfcmVkdXhMb2dnZXIyWydkZWZhdWx0J10pKCk7XG52YXIgc3RvcmUgPSAoMCwgX3JlZHV4LmFwcGx5TWlkZGxld2FyZSkoX3JlZHV4VGh1bmsyWydkZWZhdWx0J10sIGxvZ2dlcikoX3JlZHV4LmNyZWF0ZVN0b3JlKShfcmVkdWNlcjJbJ2RlZmF1bHQnXSk7XG52YXIgcGxheWVyID0gbmV3IF9zb3VuZGNsb3VkQXVkaW8yWydkZWZhdWx0J10oX2NvbnN0YW50cy5DTElFTlRfSUQpO1xuXG5zdG9yZS5kaXNwYXRjaCgoMCwgX2FjdGlvbnMuZmV0Y2hUcmFja3MpKHBsYXllcikpO1xuXG4oMCwgX2RvbS5iaW5kRXZlbnRzKShwbGF5ZXIsIHN0b3JlLmRpc3BhdGNoLCBzdG9yZS5nZXRTdGF0ZSk7XG4oMCwgX2RvbS5iaW5kQ2xhc3NlcykocGxheWVyLCBzdG9yZSk7XG5cbigwLCBfdmlzdWFsaXplcjJbJ2RlZmF1bHQnXSkocGxheWVyLCBzdG9yZSk7XG5cbn0se1wiLi9hY3Rpb25zXCI6MjgsXCIuL2NvbnN0YW50c1wiOjMwLFwiLi9kb21cIjozMSxcIi4vcmVkdWNlclwiOjMyLFwiLi9yb3V0ZXJcIjozMyxcIi4vdmlzdWFsaXplclwiOjM3LFwicmVkdXhcIjoxOSxcInJlZHV4LWxvZ2dlclwiOjE2LFwicmVkdXgtdGh1bmtcIjoxNyxcInNvdW5kY2xvdWQtYXVkaW9cIjoyN31dLDMwOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG52YXIgUkVTT0xWRV9VUkwgPSBcImh0dHBzOi8vc291bmRjbG91ZC5jb20vdGhlYWlyb25lYXJ0aC9zZXRzL3RoZS1haXItb24tZWFydGgvcy1SaWJUQlwiO1xuZXhwb3J0cy5SRVNPTFZFX1VSTCA9IFJFU09MVkVfVVJMO1xudmFyIENMSUVOVF9JRCA9IFwiMjg3ZTBhNDcwYWNlZWM3ZDUwNWFiNDFlMTg5MmZkZGNcIjtcblxuZXhwb3J0cy5DTElFTlRfSUQgPSBDTElFTlRfSUQ7XG52YXIgVFJBQ0tfTkFNRVMgPSB7XG4gICAgMDogJ2V4aXQnLFxuICAgIDE6ICdnaG9zdCcsXG4gICAgMjogJ3NlY29uZF9za2luJyxcbiAgICAzOiAncmVmbGVjdGlvbicsXG4gICAgNDogJ2ZhcmV3ZWxsJyxcbiAgICA1OiAnc3RpbGxuZXNzJyxcbiAgICA2OiAneW91bmdfZ3VucycsXG4gICAgNzogJ2lubm9jZW50JyxcbiAgICA4OiAnd2FrZSdcbn07XG5leHBvcnRzLlRSQUNLX05BTUVTID0gVFJBQ0tfTkFNRVM7XG5cbn0se31dLDMxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuYmluZEV2ZW50cyA9IGJpbmRFdmVudHM7XG5leHBvcnRzLmJpbmRDbGFzc2VzID0gYmluZENsYXNzZXM7XG5cbnZhciBfYWN0aW9ucyA9IHJlcXVpcmUoJy4vYWN0aW9ucycpO1xuXG52YXIgX2NvbnN0YW50cyA9IHJlcXVpcmUoJy4vY29uc3RhbnRzJyk7XG5cbnZhciBwbGF5QnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BsYXknKTtcbnZhciBwYXVzZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYXVzZScpO1xudmFyIG5leHRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV4dCcpO1xudmFyIHByZXZCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJldicpO1xudmFyIHBsYXllckVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3RlbicpO1xudmFyIHNjcnViYmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NjcnViYmVyJyk7XG52YXIgc2NydWJiZXJQbGF5ZWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2NydWJiZXJfX3BsYXllZCcpO1xudmFyIG92ZXJsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnb3ZlcmxheScpO1xudmFyIGJvZHkgPSBkb2N1bWVudC5ib2R5O1xudmFyIG5hdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduYXYnKTtcbnZhciBwYWdlTmF2cyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnN1Ym5hdiA+IGxpID4gYScpKTtcbnZhciBuYXZUcmFja2xpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmF2LXRyYWNrbGlzdCcpO1xudmFyIHRyYWNrTGlzdCA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRyYWNrbGlzdCcpKTtcbnZhciBzZWN0aW9ucyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNlY3Rpb24nKSk7XG5cbmZ1bmN0aW9uIGdldEluZGV4KGxpKSB7XG4gICAgdmFyIGNoaWxkcmVuID0gQXJyYXkuZnJvbShsaS5wYXJlbnROb2RlLmNoaWxkcmVuKTtcblxuICAgIHJldHVybiBjaGlsZHJlbi5pbmRleE9mKGxpKTtcbn1cblxuZnVuY3Rpb24gc2V0QWN0aXZlU2VjdGlvbihpZCkge1xuICAgIHZhciBjbGFzc0xpc3QgPSBBcnJheS5mcm9tKGJvZHkuY2xhc3NMaXN0KS5maW5kKGZ1bmN0aW9uIChjbHMpIHtcbiAgICAgICAgcmV0dXJuICgvLS1hY3RpdmUvLnRlc3QoY2xzKVxuICAgICAgICApO1xuICAgIH0pO1xuXG4gICAgYm9keS5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTGlzdCk7XG4gICAgYm9keS5jbGFzc0xpc3QuYWRkKGlkICsgJy0tYWN0aXZlJyk7XG59XG5cbmZ1bmN0aW9uIHNldEFjdGl2ZVRyYWNrQ2xhc3MoY3VycmVudFRyYWNrSW5kZXgpIHtcbiAgICB2YXIgdHJhY2tDbGFzcyA9IEFycmF5LmZyb20oYm9keS5jbGFzc0xpc3QpLmZpbmQoZnVuY3Rpb24gKGNscykge1xuICAgICAgICByZXR1cm4gKC90cmFjay0tLy50ZXN0KGNscylcbiAgICAgICAgKTtcbiAgICB9KTtcbiAgICB2YXIgdHJhY2tOYW1lID0gX2NvbnN0YW50cy5UUkFDS19OQU1FU1tjdXJyZW50VHJhY2tJbmRleF07XG5cbiAgICBib2R5LmNsYXNzTGlzdC5yZW1vdmUodHJhY2tDbGFzcyk7XG4gICAgYm9keS5jbGFzc0xpc3QuYWRkKCd0cmFjay0tJyArIHRyYWNrTmFtZSk7XG59XG5cbmZ1bmN0aW9uIGFjdGl2YXRlRWwoZWxzLCBmaWx0ZXJGbikge1xuICAgIGVscy5tYXAoZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgICAgICByZXR1cm4gZWw7XG4gICAgfSkuZmlsdGVyKGZpbHRlckZuKS5tYXAoZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgICByZXR1cm4gZWw7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGJpbmRFdmVudHMocGxheWVyLCBkaXNwYXRjaCwgZ2V0U3RhdGUpIHtcblxuICAgIHBsYXllci5vbignZW5kZWQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgdHJhY2tMaXN0ID0gcGxheWVyLl9wbGF5bGlzdDtcbiAgICAgICAgdmFyIGN1cnJlbnRUcmFja0luZGV4ID0gZ2V0U3RhdGUoKS5jdXJyZW50VHJhY2tJbmRleDtcblxuICAgICAgICBpZiAoY3VycmVudFRyYWNrSW5kZXggKyAxID49IHRyYWNrTGlzdC5sZW5ndGgpIHtcbiAgICAgICAgICAgIGRpc3BhdGNoKCgwLCBfYWN0aW9ucy5lbmQpKHBsYXllcikpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy9kaXNwYXRjaChlbmQocGxheWVyKSk7XG4gICAgICAgICAgICBkaXNwYXRjaCgoMCwgX2FjdGlvbnMubmV4dCkocGxheWVyKSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHBsYXllci5vbigndGltZXVwZGF0ZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciBkdXJhdGlvbiA9IHBsYXllci5hdWRpby5kdXJhdGlvbjtcbiAgICAgICAgdmFyIGN1cnJlbnRUaW1lID0gcGxheWVyLmF1ZGlvLmN1cnJlbnRUaW1lO1xuICAgICAgICB2YXIgcGVyY2VudCA9IGN1cnJlbnRUaW1lIC8gZHVyYXRpb24gKiAxMDA7XG4gICAgICAgIHNjcnViYmVyUGxheWVkLnN0eWxlLndpZHRoID0gcGVyY2VudCArICclJztcbiAgICB9KTtcblxuICAgIHBsYXlCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgc3RhdGUgPSBnZXRTdGF0ZSgpO1xuICAgICAgICB2YXIgaXNQbGF5aW5nID0gc3RhdGUuaXNQbGF5aW5nO1xuICAgICAgICB2YXIgaXNQYXVzZWQgPSBzdGF0ZS5pc1BhdXNlZDtcblxuICAgICAgICBpZiAoaXNQYXVzZWQpIHtcbiAgICAgICAgICAgIGRpc3BhdGNoKCgwLCBfYWN0aW9ucy5yZXN1bWUpKHBsYXllcikpO1xuICAgICAgICB9IGVsc2UgaWYgKCFpc1BsYXlpbmcpIHtcbiAgICAgICAgICAgIGRpc3BhdGNoKCgwLCBfYWN0aW9ucy5wbGF5KShwbGF5ZXIpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcGF1c2VCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgaXNQbGF5aW5nID0gZ2V0U3RhdGUoKS5pc1BsYXlpbmc7XG5cbiAgICAgICAgaWYgKGlzUGxheWluZykge1xuICAgICAgICAgICAgZGlzcGF0Y2goKDAsIF9hY3Rpb25zLnBhdXNlKShwbGF5ZXIpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgbmV4dEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGRpc3BhdGNoKCgwLCBfYWN0aW9ucy5uZXh0KShwbGF5ZXIpKTtcbiAgICB9KTtcblxuICAgIHByZXZCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBkaXNwYXRjaCgoMCwgX2FjdGlvbnMucHJldikocGxheWVyKSk7XG4gICAgfSk7XG5cbiAgICBzY3J1YmJlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciBvZmZzZXQgPSBlLm9mZnNldFg7XG4gICAgICAgIHZhciB3aWR0aCA9IHNjcnViYmVyLm9mZnNldFdpZHRoO1xuICAgICAgICB2YXIgcGVyY2VudCA9IG9mZnNldCAvIHdpZHRoO1xuICAgICAgICBwbGF5ZXIuYXVkaW8uY3VycmVudFRpbWUgPSBwZXJjZW50ICogKHBsYXllci5hdWRpby5kdXJhdGlvbiB8fCAwKTtcbiAgICB9KTtcblxuICAgIG5hdlRyYWNrbGlzdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChlLnRhcmdldCAmJiBlLnRhcmdldC5ub2RlTmFtZSA9PT0gJ0EnKSB7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0ID0gZS50YXJnZXQ7XG4gICAgICAgICAgICB2YXIgcGFyZW50Tm9kZSA9IHRhcmdldC5wYXJlbnROb2RlO1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXgocGFyZW50Tm9kZSk7XG5cbiAgICAgICAgICAgIGRpc3BhdGNoKCgwLCBfYWN0aW9ucy5wbGF5KShwbGF5ZXIsIGluZGV4KSk7XG5cbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIG5hdi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChlLnRhcmdldCAmJiBlLnRhcmdldC5ub2RlTmFtZSA9PT0gJ0EnKSB7XG4gICAgICAgICAgICB2YXIgaGFzaCA9IGUudGFyZ2V0Lmhhc2g7XG4gICAgICAgICAgICB2YXIgaWQgPSBoYXNoICYmIGhhc2guc2xpY2UoMSkgfHwgJ2xpc3Rlbic7XG5cbiAgICAgICAgICAgIC8vYWN0aXZhdGVFbChwYWdlTmF2cywgZWwgPT4gZWwuaGFzaCA9PT0gaGFzaCk7XG4gICAgICAgICAgICAvL2FjdGl2YXRlRWwoc2VjdGlvbnMsIGVsID0+IGVsLmdldEF0dHJpYnV0ZSgnaWQnKSA9PT0gaWQpO1xuICAgICAgICAgICAgc2V0QWN0aXZlU2VjdGlvbihpZCk7XG5cbiAgICAgICAgICAgIGlmICh3aW5kb3cuaGlzdG9yeSkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7IGFjdGl2ZVNlY3Rpb246IGlkIH0sIG51bGwsIGhhc2gpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciBhY3RpdmVTZWN0aW9uID0gZS5zdGF0ZS5hY3RpdmVTZWN0aW9uO1xuXG4gICAgICAgIGlmIChhY3RpdmVTZWN0aW9uKSB7XG4gICAgICAgICAgICBzZXRBY3RpdmVTZWN0aW9uKGFjdGl2ZVNlY3Rpb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2V0QWN0aXZlU2VjdGlvbignbGlzdGVuJyk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChkb2N1bWVudC5sb2NhdGlvbi5oYXNoKSB7XG4gICAgICAgIHZhciBoYXNoID0gZG9jdW1lbnQubG9jYXRpb24uaGFzaDtcblxuICAgICAgICBzZXRBY3RpdmVTZWN0aW9uKGhhc2guc2xpY2UoMSkpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gYmluZENsYXNzZXMocGxheWVyLCBzdG9yZSkge1xuXG4gICAgc3RvcmUuc3Vic2NyaWJlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHN0YXRlID0gc3RvcmUuZ2V0U3RhdGUoKTtcbiAgICAgICAgdmFyIGh1ZSA9IHN0YXRlLmh1ZTtcbiAgICAgICAgdmFyIHNhdHVyYXRpb24gPSBzdGF0ZS5zYXR1cmF0aW9uO1xuICAgICAgICB2YXIgbGlnaHRuZXNzID0gc3RhdGUubGlnaHRuZXNzO1xuICAgICAgICB2YXIgb3BhY2l0eSA9IHN0YXRlLm9wYWNpdHk7XG4gICAgICAgIHZhciBjdXJyZW50VHJhY2tJbmRleCA9IHN0YXRlLmN1cnJlbnRUcmFja0luZGV4O1xuXG4gICAgICAgIG92ZXJsYXkuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ2hzbGEoJyArIGh1ZSArICcsICcgKyBzYXR1cmF0aW9uICsgJyUsICcgKyBsaWdodG5lc3MgKyAnJSwgJyArIG9wYWNpdHkgKyAnKSc7XG5cbiAgICAgICAgLy8uZmlsdGVyKChsaXN0LCBpZHgpID0+IHtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhpZHgpO1xuICAgICAgICAvL2lkeCA9PT0gY3VycmVudFRyYWNrSW5kZXg7XG4gICAgICAgIC8vfSlcbiAgICAgICAgLy8ubWFwKGxpc3QgPT4gbGlzdC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKSk7XG5cbiAgICAgICAgaWYgKHN0YXRlLmlzUGxheWluZykge1xuICAgICAgICAgICAgcGxheWVyRWwuY2xhc3NMaXN0LmFkZCgnaXNQbGF5aW5nJyk7XG4gICAgICAgICAgICBwbGF5ZXJFbC5jbGFzc0xpc3QucmVtb3ZlKCdpc1BhdXNlZCcpO1xuICAgICAgICAgICAgc2NydWJiZXIuc3R5bGUud2lkdGggPSAnMTAwJSc7XG5cbiAgICAgICAgICAgIHNldEFjdGl2ZVRyYWNrQ2xhc3MoY3VycmVudFRyYWNrSW5kZXgpO1xuXG4gICAgICAgICAgICB0cmFja0xpc3QubWFwKGZ1bmN0aW9uIChsaXN0KSB7XG4gICAgICAgICAgICAgICAgdmFyIGNoaWxkcmVuID0gQXJyYXkuZnJvbShsaXN0LmNoaWxkcmVuKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBjaGlsZHJlbi5tYXAoZnVuY3Rpb24gKGxpKSB7XG4gICAgICAgICAgICAgICAgICAgIGxpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGk7XG4gICAgICAgICAgICAgICAgfSkuZmlsdGVyKGZ1bmN0aW9uIChsaSwgaWR4KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpZHggPT09IGN1cnJlbnRUcmFja0luZGV4O1xuICAgICAgICAgICAgICAgIH0pLm1hcChmdW5jdGlvbiAobGkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdGUuaXNQYXVzZWQpIHtcbiAgICAgICAgICAgIHBsYXllckVsLmNsYXNzTGlzdC5yZW1vdmUoJ2lzUGxheWluZycpO1xuICAgICAgICAgICAgcGxheWVyRWwuY2xhc3NMaXN0LmFkZCgnaXNQYXVzZWQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBsYXllckVsLmNsYXNzTGlzdC5yZW1vdmUoJ2lzUGxheWluZycpO1xuICAgICAgICAgICAgcGxheWVyRWwuY2xhc3NMaXN0LnJlbW92ZSgnaXNQYXVzZWQnKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG59LHtcIi4vYWN0aW9uc1wiOjI4LFwiLi9jb25zdGFudHNcIjozMH1dLDMyOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9hY3Rpb25zID0gcmVxdWlyZSgnLi9hY3Rpb25zJyk7XG5cbnZhciBpbml0aWFsU3RhdGUgPSB7XG4gICAgaXNGZXRjaGluZzogZmFsc2UsXG4gICAgaXNQbGF5aW5nOiBmYWxzZSxcbiAgICBpc1BhdXNlZDogZmFsc2UsXG4gICAgY3VycmVudFRyYWNrSW5kZXg6IDAsXG4gICAgaHVlOiAwLFxuICAgIHNhdHVyYXRpb246IDAsXG4gICAgb3BhY2l0eTogMC42XG59O1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBmdW5jdGlvbiAoc3RhdGUsIGFjdGlvbikge1xuICAgIGlmIChzdGF0ZSA9PT0gdW5kZWZpbmVkKSBzdGF0ZSA9IGluaXRpYWxTdGF0ZTtcblxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICAgICAgY2FzZSBfYWN0aW9ucy5GRVRDSF9UUkFDS1M6XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgICAgICBpc0ZldGNoaW5nOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgY2FzZSBfYWN0aW9ucy5GRVRDSF9UUkFDS1NfRVJST1I6XG4gICAgICAgIGNhc2UgX2FjdGlvbnMuRkVUQ0hfVFJBQ0tTX1NVQ0NFU1M6XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgICAgICBpc0ZldGNoaW5nOiBmYWxzZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIGNhc2UgX2FjdGlvbnMuUExBWTpcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xuICAgICAgICAgICAgICAgIGlzUGxheWluZzogdHJ1ZSxcbiAgICAgICAgICAgICAgICBpc1BhdXNlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgY3VycmVudFRyYWNrSW5kZXg6IGFjdGlvbi5wYXlsb2FkLl9wbGF5bGlzdEluZGV4XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgY2FzZSBfYWN0aW9ucy5QQVVTRTpcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xuICAgICAgICAgICAgICAgIGlzUGxheWluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgaXNQYXVzZWQ6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICBjYXNlIF9hY3Rpb25zLk5FWFQ6XG4gICAgICAgIGNhc2UgX2FjdGlvbnMuUFJFVjpcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRUcmFja0luZGV4OiBhY3Rpb24ucGF5bG9hZC5fcGxheWxpc3RJbmRleCxcbiAgICAgICAgICAgICAgICBpc1BsYXlpbmc6IHRydWUsXG4gICAgICAgICAgICAgICAgaXNQYXVzZWQ6IGZhbHNlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgY2FzZSBfYWN0aW9ucy5FTkQ6XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgICAgICBpc1BsYXlpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGlzUGF1c2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBodWU6IDAsXG4gICAgICAgICAgICAgICAgc2F0dXJhdGlvbjogMCxcbiAgICAgICAgICAgICAgICBjdXJyZW50VHJhY2tJbmRleDogMCxcbiAgICAgICAgICAgICAgICBsaWdodG5lc3M6IDAsXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIGNhc2UgX2FjdGlvbnMuQ0hBTkdFX0JBQ0tHUk9VTkQ6XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgICAgICBodWU6IGFjdGlvbi5wYXlsb2FkLmh1ZSB8fCBzdGF0ZS5odWUsXG4gICAgICAgICAgICAgICAgc2F0dXJhdGlvbjogYWN0aW9uLnBheWxvYWQuc2F0dXJhdGlvbiB8fCBzdGF0ZS5zYXR1cmF0aW9uLFxuICAgICAgICAgICAgICAgIGxpZ2h0bmVzczogYWN0aW9uLnBheWxvYWQubGlnaHRuZXNzIHx8IHN0YXRlLmxpZ2h0bmVzc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG5cbn0se1wiLi9hY3Rpb25zXCI6Mjh9XSwzMzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzWydkZWZhdWx0J10gPSBjcmVhdGVSb3V0ZXI7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9wYWdlID0gcmVxdWlyZSgncGFnZScpO1xuXG52YXIgX3BhZ2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcGFnZSk7XG5cbnZhciBwYWdlTmF2RWxzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc3VibmF2ID4gbGkgPiBhJykpO1xuXG5mdW5jdGlvbiBjcmVhdGVSb3V0ZXIoKSB7XG4gICAgZnVuY3Rpb24gcm91dGUoY3R4LCBuZXh0KSB7XG4gICAgICAgIHZhciBoYXNoID0gY3R4Lmhhc2g7XG5cbiAgICAgICAgcGFnZU5hdkVscy5tYXAoZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIHJldHVybiBlbDtcbiAgICAgICAgfSkuZmlsdGVyKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgcmV0dXJuIGVsLmhyZWYgPSBoYXNoO1xuICAgICAgICB9KS5tYXAoZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgICByZXR1cm4gZWwuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgICgwLCBfcGFnZTJbJ2RlZmF1bHQnXSkoJyonLCByb3V0ZSk7XG4gICAgKDAsIF9wYWdlMlsnZGVmYXVsdCddKSgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcblxufSx7XCJwYWdlXCI6MTN9XSwzNDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSByYW5kb21CZXR3ZWVuO1xuXG5mdW5jdGlvbiByYW5kb21CZXR3ZWVuKG1pbiwgbWF4KSB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSArIG1pbik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1tcImRlZmF1bHRcIl07XG5cbn0se31dLDM1OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX2xvZGFzaEZ1bmN0aW9uT25jZSA9IHJlcXVpcmUoJ2xvZGFzaC9mdW5jdGlvbi9vbmNlJyk7XG5cbnZhciBfbG9kYXNoRnVuY3Rpb25PbmNlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2xvZGFzaEZ1bmN0aW9uT25jZSk7XG5cbnZhciBfbW91bnRhaW5zID0gcmVxdWlyZSgnLi9tb3VudGFpbnMnKTtcblxudmFyIF9tb3VudGFpbnMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbW91bnRhaW5zKTtcblxudmFyIFBPSU5UUyA9IDI1NjtcbmV4cG9ydHMuUE9JTlRTID0gUE9JTlRTO1xudmFyIElOSVRfUE9JTlRTID0gNTA7XG5leHBvcnRzLklOSVRfUE9JTlRTID0gSU5JVF9QT0lOVFM7XG52YXIgYW1wbGl0dWRlID0gNTtcbmV4cG9ydHMuYW1wbGl0dWRlID0gYW1wbGl0dWRlO1xudmFyIEFOR0xFID0gMTA7XG5leHBvcnRzLkFOR0xFID0gQU5HTEU7XG52YXIgUkFESVVTID0gMjAwO1xuZXhwb3J0cy5SQURJVVMgPSBSQURJVVM7XG52YXIgQ09MT1JfQU1QID0gMC40O1xuXG5leHBvcnRzLkNPTE9SX0FNUCA9IENPTE9SX0FNUDtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IHtcblxuICAgIC8vIEV4aXRcbiAgICBcIjBcIjoge1xuICAgICAgICBodWU6IDMyLFxuICAgICAgICBzYXR1cmF0aW9uOiA1MCxcbiAgICAgICAgbGlnaHRuZXNzOiA4MSxcbiAgICAgICAgc3Ryb2tlQ29sb3I6ICdyZ2JhKDE0NCwgOTIsIDkwLCAwLjUpJ1xuICAgIH0sXG5cbiAgICAvLyBHaG9zdFxuICAgIFwiMVwiOiB7XG4gICAgICAgIGh1ZTogMzAsXG4gICAgICAgIHNhdHVyYXRpb246IDg0LFxuICAgICAgICBsaWdodG5lc3M6IDg0LFxuICAgICAgICBoaXRwb2ludHM6IFs4OSwgMTUwXVxuICAgIH0sXG5cbiAgICAvLyBTZWNvbmQgU2tpblxuICAgIFwiMlwiOiB7XG4gICAgICAgIGh1ZTogMjEzLFxuICAgICAgICBzYXR1cmF0aW9uOiA1MCxcbiAgICAgICAgbGlnaHRuZXNzOiAyOVxuICAgIH0sXG5cbiAgICAvLyBSZWZsZWN0aW9uXG4gICAgXCIzXCI6IHtcbiAgICAgICAgaHVlOiAyMjcsXG4gICAgICAgIHNhdHVyYXRpb246IDUwLFxuICAgICAgICBsaWdodG5lc3M6IDlcbiAgICB9LFxuXG4gICAgLy9GYXJld2VsbFxuICAgIFwiNFwiOiB7XG4gICAgICAgIGh1ZTogMjMwLFxuICAgICAgICBzYXR1cmF0aW9uOiA1MCxcbiAgICAgICAgbGlnaHRuZXNzOiAyXG4gICAgfSxcblxuICAgIC8vIFN0aWxsbmVzc1xuICAgIFwiNVwiOiB7XG4gICAgICAgIGh1ZTogNyxcbiAgICAgICAgc2F0dXJhdGlvbjogNTAsXG4gICAgICAgIGxpZ2h0bmVzczogMTRcbiAgICB9LFxuXG4gICAgLy8gWW91bmcgR3Vuc1xuICAgIFwiNlwiOiB7XG4gICAgICAgIGh1ZTogMixcbiAgICAgICAgc2F0dXJhdGlvbjogMjMsXG4gICAgICAgIGxpZ2h0bmVzczogNDZcbiAgICB9LFxuXG4gICAgLy8gSW5ub2NlbnRcbiAgICBcIjdcIjoge1xuICAgICAgICBodWU6IDI2LFxuICAgICAgICBzYXR1cmF0aW9uOiA0OSxcbiAgICAgICAgbGlnaHRuZXNzOiA2N1xuICAgIH0sXG5cbiAgICAvLyBXYWtlXG4gICAgXCI4XCI6IHtcbiAgICAgICAgaHVlOiAxNzUsXG4gICAgICAgIHNhdHVyYXRpb246IDE3LFxuICAgICAgICBsaWdodG5lc3M6IDc4XG4gICAgfVxufTtcblxufSx7XCIuL21vdW50YWluc1wiOjM4LFwibG9kYXNoL2Z1bmN0aW9uL29uY2VcIjozfV0sMzY6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1snZGVmYXVsdCddID0gZ2VuZXJhdGVNb3VudGFpbnM7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9sb2Rhc2hVdGlsaXR5UmFuZ2UgPSByZXF1aXJlKCdsb2Rhc2gvdXRpbGl0eS9yYW5nZScpO1xuXG52YXIgX2xvZGFzaFV0aWxpdHlSYW5nZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9sb2Rhc2hVdGlsaXR5UmFuZ2UpO1xuXG52YXIgX2xvZGFzaEZ1bmN0aW9uT25jZSA9IHJlcXVpcmUoJ2xvZGFzaC9mdW5jdGlvbi9vbmNlJyk7XG5cbnZhciBfbG9kYXNoRnVuY3Rpb25PbmNlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2xvZGFzaEZ1bmN0aW9uT25jZSk7XG5cbnZhciBfY29uZmlnID0gcmVxdWlyZSgnLi9jb25maWcnKTtcblxudmFyIF9hY3Rpb25zID0gcmVxdWlyZSgnLi4vYWN0aW9ucycpO1xuXG52YXIgX3V0aWxzUmFuZG9tQmV0d2VlbiA9IHJlcXVpcmUoJy4uL3V0aWxzL3JhbmRvbUJldHdlZW4nKTtcblxudmFyIF91dGlsc1JhbmRvbUJldHdlZW4yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdXRpbHNSYW5kb21CZXR3ZWVuKTtcblxudmFyIG1heEFscGhhID0gMC4zO1xuXG5mdW5jdGlvbiBpbml0TW91bnRhaW4ocGFwZXIpIHtcbiAgICB2YXIgbWlycm9yZWQgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IGFyZ3VtZW50c1sxXTtcblxuICAgIHZhciBwYXRoID0gbmV3IHBhcGVyLlBhdGgoKTtcbiAgICB2YXIgd2lkdGggPSBwYXBlci52aWV3LnNpemUud2lkdGg7XG4gICAgdmFyIGhlaWdodCA9IHBhcGVyLnZpZXcuc2l6ZS5oZWlnaHQ7XG4gICAgdmFyIHdpZHRoT2Zmc2V0ID0gNTA7XG4gICAgdmFyIHJlZCA9IDM2O1xuXG4gICAgcmVkICs9IDIwO1xuXG4gICAgcGF0aC5jbG9zZWQgPSBmYWxzZTtcbiAgICBwYXRoLnBvc2l0aW9uLnggPSAwO1xuICAgIHBhdGgucG9zaXRpb24ueSA9IHBhcGVyLnZpZXcuc2l6ZS5oZWlnaHQ7XG4gICAgcGF0aC5zdHJva2VDb2xvciA9ICdyZ2JhKCcgKyByZWQgKyAnLCA3MCwgMTExLCAwLjMpJztcbiAgICBwYXRoLmZpbGxDb2xvciA9ICdyZ2JhKCcgKyByZWQgKyAnLCA3MCwgMTExLCAwKSc7XG4gICAgcGF0aC5taXJyb3JlZCA9IG1pcnJvcmVkO1xuXG4gICAgcGF0aC5hZGQobmV3IHBhcGVyLlBvaW50KG1pcnJvcmVkID8gd2lkdGggKyB3aWR0aE9mZnNldCA6IC13aWR0aE9mZnNldCwgaGVpZ2h0KSk7XG5cbiAgICBwYXRoLnBvc2l0aW9uLnkgPSBwYXBlci52aWV3LnNpemUuaGVpZ2h0O1xuXG4gICAgcGF0aC5zbW9vdGgoKTtcblxuICAgIHJldHVybiBwYXRoO1xufVxuXG5mdW5jdGlvbiBpbml0UGF0aChwYXBlcikge1xuICAgIHZhciBwYXRoID0gbmV3IHBhcGVyLlBhdGgoKTtcbiAgICB2YXIgd2lkdGggPSBwYXBlci52aWV3LnNpemUud2lkdGg7XG4gICAgdmFyIGhlaWdodCA9IHBhcGVyLnZpZXcuc2l6ZS5oZWlnaHQ7XG4gICAgdmFyIHJhZGl1cyA9IDEwMDtcblxuICAgIHBhdGguc3Ryb2tlQ29sb3IgPSAncmdiYSgxNDQsIDkyLCA5MCwgMC41KSc7XG4gICAgcGF0aC5maWxsQ29sb3IgPSAncmdiYSgxNDQsIDkyLCA5MCwgMC41KSc7XG4gICAgcGF0aC5zdHJva2VXaWR0aCA9IDE7XG4gICAgcGF0aC5zbW9vdGgoKTtcblxuICAgIHZhciBpbnRlcnZhbCA9IHdpZHRoIC8gX2NvbmZpZy5QT0lOVFM7XG5cbiAgICAoMCwgX2xvZGFzaFV0aWxpdHlSYW5nZTJbJ2RlZmF1bHQnXSkoX2NvbmZpZy5QT0lOVFMpLm1hcChmdW5jdGlvbiAocG50KSB7XG4gICAgICAgIHBhdGguYWRkKG5ldyBwYXBlci5Qb2ludChwbnQgKiBpbnRlcnZhbCwgNjAwKSk7XG4gICAgfSk7XG5cbiAgICBwYXRoLnBvc2l0aW9uLnkgPSBoZWlnaHQ7XG5cbiAgICByZXR1cm4gcGF0aDtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVNb3VudGFpbnMocGFwZXIsIHBsYXllciwgc3RvcmUsIHRyYWNrQ29uZmlnKSB7XG5cbiAgICB2YXIgd2lkdGggPSBwYXBlci52aWV3LnNpemUud2lkdGg7XG4gICAgdmFyIGhlaWdodCA9IHBhcGVyLnZpZXcuc2l6ZS5oZWlnaHQ7XG4gICAgdmFyIHBhdGggPSBpbml0UGF0aChwYXBlcik7XG4gICAgdmFyIGJhckhlaWdodCA9IHVuZGVmaW5lZDtcblxuICAgIHJldHVybiBmdW5jdGlvbiAoZGF0YSwgZXZlbnQpIHtcblxuICAgICAgICBwYXRoLnNlZ21lbnRzID0gcGF0aC5zZWdtZW50cy5tYXAoZnVuY3Rpb24gKHNlZywgaWR4KSB7XG4gICAgICAgICAgICBpZiAoaWR4ICE9PSAwICYmIGlkeCAhPT0gcGF0aC5zZWdtZW50cy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgYmFySGVpZ2h0ID0gZGF0YVtpZHhdIC8gMjtcbiAgICAgICAgICAgICAgICBzZWcucG9pbnQueSA9IGhlaWdodCAtIGJhckhlaWdodDtcblxuICAgICAgICAgICAgICAgIHJldHVybiBzZWc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuXG59LHtcIi4uL2FjdGlvbnNcIjoyOCxcIi4uL3V0aWxzL3JhbmRvbUJldHdlZW5cIjozNCxcIi4vY29uZmlnXCI6MzUsXCJsb2Rhc2gvZnVuY3Rpb24vb25jZVwiOjMsXCJsb2Rhc2gvdXRpbGl0eS9yYW5nZVwiOjEyfV0sMzc6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1snZGVmYXVsdCddID0gY3JlYXRlVmlzdWFsaXplcjtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX2xvZGFzaFV0aWxpdHlSYW5nZSA9IHJlcXVpcmUoJ2xvZGFzaC91dGlsaXR5L3JhbmdlJyk7XG5cbnZhciBfbG9kYXNoVXRpbGl0eVJhbmdlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2xvZGFzaFV0aWxpdHlSYW5nZSk7XG5cbnZhciBfbG9kYXNoTnVtYmVySW5SYW5nZSA9IHJlcXVpcmUoJ2xvZGFzaC9udW1iZXIvaW5SYW5nZScpO1xuXG52YXIgX2xvZGFzaE51bWJlckluUmFuZ2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbG9kYXNoTnVtYmVySW5SYW5nZSk7XG5cbnZhciBfbG9kYXNoRnVuY3Rpb25PbmNlID0gcmVxdWlyZSgnbG9kYXNoL2Z1bmN0aW9uL29uY2UnKTtcblxudmFyIF9sb2Rhc2hGdW5jdGlvbk9uY2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbG9kYXNoRnVuY3Rpb25PbmNlKTtcblxudmFyIF9tb3VudGFpbnMgPSByZXF1aXJlKCcuL21vdW50YWlucycpO1xuXG52YXIgX21vdW50YWluczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9tb3VudGFpbnMpO1xuXG52YXIgX2ZyZXEgPSByZXF1aXJlKCcuL2ZyZXEnKTtcblxudmFyIF9mcmVxMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2ZyZXEpO1xuXG52YXIgX2FjdGlvbnMgPSByZXF1aXJlKCcuLi9hY3Rpb25zJyk7XG5cbnZhciBfY29uZmlnID0gcmVxdWlyZSgnLi9jb25maWcnKTtcblxudmFyIF9jb25maWcyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY29uZmlnKTtcblxuZnVuY3Rpb24gcmVuZGVyKHBsYXllciwgc3RvcmUsIGFuYWx5c2VyLCBmcmVxQnl0ZURhdGEsIHBhcGVyKSB7XG5cbiAgICB2YXIgc3RhdGUgPSBzdG9yZS5nZXRTdGF0ZSgpO1xuICAgIHZhciBjdXJyZW50VHJhY2tJbmRleCA9IHN0YXRlLmN1cnJlbnRUcmFja0luZGV4O1xuICAgIHZhciB0cmFja0NvbmZpZyA9IF9jb25maWcyWydkZWZhdWx0J11bY3VycmVudFRyYWNrSW5kZXhdO1xuICAgIHZhciBzdHJva2VDb2xvciA9IHRyYWNrQ29uZmlnLnN0cm9rZUNvbG9yO1xuICAgIHZhciBoaXRwb2ludHMgPSB0cmFja0NvbmZpZy5oaXRwb2ludHM7XG5cbiAgICBzdG9yZS5kaXNwYXRjaCgoMCwgX2FjdGlvbnMuY2hhbmdlQmFja2dyb3VuZCkoe1xuICAgICAgICBodWU6IHRyYWNrQ29uZmlnLmh1ZSxcbiAgICAgICAgc2F0dXJhdGlvbjogdHJhY2tDb25maWcuc2F0dXJhdGlvbixcbiAgICAgICAgbGlnaHRuZXNzOiB0cmFja0NvbmZpZy5saWdodG5lc3NcbiAgICB9KSk7XG5cbiAgICBmdW5jdGlvbiBydW4oKSB7XG4gICAgICAgIHZhciB2aXN1YWxpemVyID0gKDAsIF9mcmVxMlsnZGVmYXVsdCddKShwYXBlciwgcGxheWVyLCBzdG9yZSwgdHJhY2tDb25maWcpO1xuXG4gICAgICAgIHJldHVybiBwYXBlci52aWV3Lm9uRnJhbWUgPSBmdW5jdGlvbiAoZXZlbnQpIHtcblxuICAgICAgICAgICAgaWYgKGV2ZW50LmNvdW50ICUgNSA9PT0gMCkge1xuXG4gICAgICAgICAgICAgICAgYW5hbHlzZXIuZ2V0Qnl0ZUZyZXF1ZW5jeURhdGEoZnJlcUJ5dGVEYXRhKTtcblxuICAgICAgICAgICAgICAgIHZpc3VhbGl6ZXIoZnJlcUJ5dGVEYXRhLCBldmVudCk7XG5cbiAgICAgICAgICAgICAgICBwYXBlci52aWV3LmRyYXcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgZGlzcG9zZSA9IHN0b3JlLnN1YnNjcmliZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzdGF0ZSA9IHN0b3JlLmdldFN0YXRlKCk7XG5cbiAgICAgICAgaWYgKGN1cnJlbnRUcmFja0luZGV4ICE9PSBzdGF0ZS5jdXJyZW50VHJhY2tJbmRleCkge1xuICAgICAgICAgICAgY3VycmVudFRyYWNrSW5kZXggPSBzdGF0ZS5jdXJyZW50VHJhY2tJbmRleDtcbiAgICAgICAgICAgIHRyYWNrQ29uZmlnID0gX2NvbmZpZzJbJ2RlZmF1bHQnXVtjdXJyZW50VHJhY2tJbmRleF07XG4gICAgICAgICAgICBzdHJva2VDb2xvciA9IHRyYWNrQ29uZmlnLnN0cm9rZUNvbG9yO1xuXG4gICAgICAgICAgICBzdG9yZS5kaXNwYXRjaCgoMCwgX2FjdGlvbnMuY2hhbmdlQmFja2dyb3VuZCkoe1xuICAgICAgICAgICAgICAgIGh1ZTogdHJhY2tDb25maWcuaHVlLFxuICAgICAgICAgICAgICAgIHNhdHVyYXRpb246IHRyYWNrQ29uZmlnLnNhdHVyYXRpb24sXG4gICAgICAgICAgICAgICAgbGlnaHRuZXNzOiB0cmFja0NvbmZpZy5saWdodG5lc3NcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgLy9wYXBlci52aWV3Lm9mZignZnJhbWUnKTtcblxuICAgICAgICAgICAgLy9ydW4oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc3RhdGUuaXNQbGF5aW5nKSB7XG4gICAgICAgICAgICBwYXBlci52aWV3Lm9mZignZnJhbWUnKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJ1bigpO1xufVxuXG5mdW5jdGlvbiBpbml0UGF0aCh0b3RhbFdpZHRoLCB0b3RhbEhlaWdodCkge1xuXG4gICAgdmFyIHBhdGggPSBuZXcgcGFwZXIuUGF0aCgpO1xuXG4gICAgcGF0aC5jbG9zZWQgPSBmYWxzZTtcbiAgICBwYXRoLnN0cm9rZVdpZHRoID0gMTtcbiAgICBwYXRoLnN0cm9rZUNvbG9yID0gJ3JnYmEoMCwwLDAsMCknO1xuXG4gICAgdmFyIG1pZFggPSB0b3RhbFdpZHRoIC8gMjtcbiAgICB2YXIgbWlkWSA9IHRvdGFsSGVpZ2h0IC8gMjtcbiAgICB2YXIgc3RhcnRYID0gbWlkWCAtIF9jb25maWcuUE9JTlRTIC8gMjtcblxuICAgIGZ1bmN0aW9uIGluaXREcmF3KHBvaW50KSB7XG4gICAgICAgIHBhdGguYWRkKHBvaW50KTtcbiAgICAgICAgcGFwZXIudmlldy5kcmF3KCk7XG4gICAgfVxuXG4gICAgKDAsIF9sb2Rhc2hVdGlsaXR5UmFuZ2UyWydkZWZhdWx0J10pKF9jb25maWcuUE9JTlRTKS5tYXAoZnVuY3Rpb24gKGksIGlkeCkge1xuICAgICAgICB2YXIgcG9pbnQgPSBuZXcgcGFwZXIuUG9pbnQoMCwgMCk7XG5cbiAgICAgICAgcGF0aC5hZGQocG9pbnQpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHBhdGg7XG59XG5cbmZ1bmN0aW9uIGluaXRQYXBlcihjYW52YXMpIHtcbiAgICBwYXBlci5zZXR1cChjYW52YXMpO1xuICAgIHBhcGVyLnZpZXcuZmlsbENvbG9yID0gJ3JnYigyNTUsMjU1LDIzMyknO1xuXG4gICAgcmV0dXJuIHBhcGVyO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVWaXN1YWxpemVyKHBsYXllciwgc3RvcmUpIHtcbiAgICB2YXIgYXVkaW8gPSBwbGF5ZXIuYXVkaW87XG4gICAgYXVkaW8uY3Jvc3NPcmlnaW4gPSAnYW5vbnltb3VzJztcbiAgICB2YXIgY29udGV4dCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcbiAgICB2YXIgYW5hbHlzZXIgPSBjb250ZXh0LmNyZWF0ZUFuYWx5c2VyKCk7XG4gICAgdmFyIHNvdXJjZSA9IGNvbnRleHQuY3JlYXRlTWVkaWFFbGVtZW50U291cmNlKGF1ZGlvKTtcbiAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Zpc3VhbGl6ZXInKTtcbiAgICB2YXIgZnJlcUJ5dGVEYXRhID0gbmV3IFVpbnQ4QXJyYXkoYW5hbHlzZXIuZnJlcXVlbmN5QmluQ291bnQpO1xuXG4gICAgc291cmNlLmNvbm5lY3QoYW5hbHlzZXIpO1xuICAgIGFuYWx5c2VyLmNvbm5lY3QoY29udGV4dC5kZXN0aW5hdGlvbik7XG5cbiAgICB2YXIgcGFwZXIgPSBpbml0UGFwZXIoY2FudmFzKTtcblxuICAgIHZhciBkaXNwb3NlID0gc3RvcmUuc3Vic2NyaWJlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHN0YXRlID0gc3RvcmUuZ2V0U3RhdGUoKTtcblxuICAgICAgICBpZiAoc3RhdGUuaXNQbGF5aW5nKSB7XG4gICAgICAgICAgICAvLyBKdXN0IGxpc3RlbiBmb3IgdGhlIGZpcnN0IHBsYXkgYW5kIGNhbmNlbCB0aGUgc3Vic2NyaXB0aW9uXG4gICAgICAgICAgICAvLyBhZnRlciB0aGF0LlxuICAgICAgICAgICAgZGlzcG9zZSgpO1xuXG4gICAgICAgICAgICByZW5kZXIocGxheWVyLCBzdG9yZSwgYW5hbHlzZXIsIGZyZXFCeXRlRGF0YSwgcGFwZXIpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuXG59LHtcIi4uL2FjdGlvbnNcIjoyOCxcIi4vY29uZmlnXCI6MzUsXCIuL2ZyZXFcIjozNixcIi4vbW91bnRhaW5zXCI6MzgsXCJsb2Rhc2gvZnVuY3Rpb24vb25jZVwiOjMsXCJsb2Rhc2gvbnVtYmVyL2luUmFuZ2VcIjoxMSxcImxvZGFzaC91dGlsaXR5L3JhbmdlXCI6MTJ9XSwzODpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzWydkZWZhdWx0J10gPSBnZW5lcmF0ZU1vdW50YWlucztcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX2xvZGFzaFV0aWxpdHlSYW5nZSA9IHJlcXVpcmUoJ2xvZGFzaC91dGlsaXR5L3JhbmdlJyk7XG5cbnZhciBfbG9kYXNoVXRpbGl0eVJhbmdlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2xvZGFzaFV0aWxpdHlSYW5nZSk7XG5cbnZhciBfbG9kYXNoRnVuY3Rpb25PbmNlID0gcmVxdWlyZSgnbG9kYXNoL2Z1bmN0aW9uL29uY2UnKTtcblxudmFyIF9sb2Rhc2hGdW5jdGlvbk9uY2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbG9kYXNoRnVuY3Rpb25PbmNlKTtcblxudmFyIF9jb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZycpO1xuXG52YXIgX2FjdGlvbnMgPSByZXF1aXJlKCcuLi9hY3Rpb25zJyk7XG5cbnZhciBfdXRpbHNSYW5kb21CZXR3ZWVuID0gcmVxdWlyZSgnLi4vdXRpbHMvcmFuZG9tQmV0d2VlbicpO1xuXG52YXIgX3V0aWxzUmFuZG9tQmV0d2VlbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF91dGlsc1JhbmRvbUJldHdlZW4pO1xuXG52YXIgbWF4QWxwaGEgPSAwLjM7XG5cbmZ1bmN0aW9uIGluaXRNb3VudGFpbihwYXBlcikge1xuICAgIHZhciBtaXJyb3JlZCA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogYXJndW1lbnRzWzFdO1xuXG4gICAgdmFyIHBhdGggPSBuZXcgcGFwZXIuUGF0aCgpO1xuICAgIHZhciB3aWR0aCA9IHBhcGVyLnZpZXcuc2l6ZS53aWR0aDtcbiAgICB2YXIgaGVpZ2h0ID0gcGFwZXIudmlldy5zaXplLmhlaWdodDtcbiAgICB2YXIgd2lkdGhPZmZzZXQgPSA1MDtcbiAgICB2YXIgcmVkID0gMzY7XG5cbiAgICByZWQgKz0gMjA7XG5cbiAgICBwYXRoLmNsb3NlZCA9IGZhbHNlO1xuICAgIHBhdGgucG9zaXRpb24ueCA9IDA7XG4gICAgcGF0aC5wb3NpdGlvbi55ID0gcGFwZXIudmlldy5zaXplLmhlaWdodDtcbiAgICBwYXRoLnN0cm9rZUNvbG9yID0gJ3JnYmEoJyArIHJlZCArICcsIDcwLCAxMTEsIDAuMyknO1xuICAgIHBhdGguZmlsbENvbG9yID0gJ3JnYmEoJyArIHJlZCArICcsIDcwLCAxMTEsIDApJztcbiAgICBwYXRoLm1pcnJvcmVkID0gbWlycm9yZWQ7XG5cbiAgICBwYXRoLmFkZChuZXcgcGFwZXIuUG9pbnQobWlycm9yZWQgPyB3aWR0aCArIHdpZHRoT2Zmc2V0IDogLXdpZHRoT2Zmc2V0LCBoZWlnaHQpKTtcblxuICAgIHBhdGgucG9zaXRpb24ueSA9IHBhcGVyLnZpZXcuc2l6ZS5oZWlnaHQ7XG5cbiAgICBwYXRoLnNtb290aCgpO1xuXG4gICAgcmV0dXJuIHBhdGg7XG59XG5cbmZ1bmN0aW9uIGluaXRTdW4ocGFwZXIpIHtcbiAgICB2YXIgcGF0aCA9IG5ldyBwYXBlci5QYXRoKCk7XG4gICAgdmFyIHdpZHRoID0gcGFwZXIudmlldy5zaXplLndpZHRoO1xuICAgIHZhciBoZWlnaHQgPSBwYXBlci52aWV3LnNpemUuaGVpZ2h0O1xuICAgIHZhciByYWRpdXMgPSAxMDA7XG5cbiAgICBwYXRoLnN0cm9rZUNvbG9yID0gJ3JnYmEoMTQ0LCA5MiwgOTAsIDAuNSknO1xuICAgIHBhdGguZmlsbENvbG9yID0gJ3JnYmEoMTQ0LCA5MiwgOTAsIDApJztcbiAgICBwYXRoLnN0cm9rZVdpZHRoID0gMTtcbiAgICBwYXRoLnNtb290aCgpO1xuXG4gICAgcGF0aC5wb3NpdGlvbi54ID0gd2lkdGggLyAyO1xuICAgIHBhdGgucG9zaXRpb24ueSA9IGhlaWdodCAvIDI7XG5cbiAgICByZXR1cm4gcGF0aDtcbn1cblxuZnVuY3Rpb24gaW5pdFJheXMocGFwZXIpIHtcbiAgICB2YXIgcGF0aCA9IG5ldyBwYXBlci5QYXRoKCk7XG4gICAgdmFyIHdpZHRoID0gcGFwZXIudmlldy5zaXplLndpZHRoO1xuICAgIHZhciBoZWlnaHQgPSBwYXBlci52aWV3LnNpemUuaGVpZ2h0O1xuICAgIHZhciByYWRpdXMgPSAxMDA7XG5cbiAgICBwYXRoLnN0cm9rZUNvbG9yID0gJ3JnYmEoMTQ0LCA5MiwgOTAsIDAuNCknO1xuICAgIHBhdGguZmlsbENvbG9yID0gJ3JnYmEoMTQ0LCA5MiwgOTAsIDAuNCknO1xuICAgIHBhdGguc3Ryb2tlV2lkdGggPSAxO1xuICAgIHBhdGguc21vb3RoKCk7XG5cbiAgICBwYXRoLnBvc2l0aW9uLnggPSB3aWR0aCAqIDAuMjU7XG4gICAgcGF0aC5wb3NpdGlvbi55ID0gMTAwO1xuXG4gICAgcmV0dXJuIHBhdGg7XG59XG5cbnZhciBkaW1MaWdodHMgPSAoMCwgX2xvZGFzaEZ1bmN0aW9uT25jZTJbJ2RlZmF1bHQnXSkoZnVuY3Rpb24gKHN0b3JlKSB7XG4gICAgdmFyIHN0YXRlID0gc3RvcmUuZ2V0U3RhdGUoKTtcblxuICAgIHN0b3JlLmRpc3BhdGNoKCgwLCBfYWN0aW9ucy5jaGFuZ2VCYWNrZ3JvdW5kKSh7XG4gICAgICAgIGh1ZTogc3RhdGUuaHVlIC0gNVxuICAgIH0pKTtcbn0pO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZU1vdW50YWlucyhwYXBlciwgcGxheWVyLCBzdG9yZSwgdHJhY2tDb25maWcpIHtcblxuICAgIHZhciB3aWR0aCA9IHBhcGVyLnZpZXcuc2l6ZS53aWR0aDtcbiAgICB2YXIgaGVpZ2h0ID0gcGFwZXIudmlldy5zaXplLmhlaWdodDtcbiAgICB2YXIgaGl0cG9pbnRzID0gdHJhY2tDb25maWcuaGl0cG9pbnRzIHx8IFtdO1xuICAgIHZhciBoaXRzID0gW107XG4gICAgdmFyIGN1cnJlbnRIaXRwb2ludEluZGV4ID0gMDtcblxuICAgIHZhciBtb3VudGFpbnMgPSBbaW5pdE1vdW50YWluKHBhcGVyKV07XG4gICAgdmFyIGludGVydmFsID0gd2lkdGggLyBfY29uZmlnLlBPSU5UUztcbiAgICB2YXIgY3VycmVudE1vdW50YWluSW5kZXggPSAwO1xuICAgIHZhciBoZWlnaHRPZmZzZXQgPSAwO1xuXG4gICAgdmFyIHN1biA9IGluaXRTdW4ocGFwZXIpO1xuICAgIHZhciByYXlzID0gaW5pdFJheXMocGFwZXIpO1xuICAgIHZhciBsYXN0U2VnbWVudCA9IHVuZGVmaW5lZDtcbiAgICB2YXIgbWF4TW91bnRhaW5zID0gMTA7XG4gICAgdmFyIHJhZGl1cyA9IDEwMDtcblxuICAgIHJldHVybiBmdW5jdGlvbiAoZGF0YSwgZXZlbnQpIHtcblxuICAgICAgICB2YXIgY3VycmVudEhpdHBvaW50ID0gaGl0cG9pbnRzLmxlbmd0aCAmJiBoaXRwb2ludHNbY3VycmVudEhpdHBvaW50SW5kZXhdO1xuXG4gICAgICAgIGlmIChjdXJyZW50SGl0cG9pbnQgJiYgcGxheWVyLmF1ZGlvLmN1cnJlbnRUaW1lID4gY3VycmVudEhpdHBvaW50KSB7XG4gICAgICAgICAgICBpZiAoaGl0cy5pbmRleE9mKGN1cnJlbnRIaXRwb2ludCkgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgaGl0cy5wdXNoKGN1cnJlbnRIaXRwb2ludCk7XG4gICAgICAgICAgICAgICAgKytjdXJyZW50SGl0cG9pbnRJbmRleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBtb3VudGFpbiA9IG1vdW50YWluc1tjdXJyZW50TW91bnRhaW5JbmRleF07XG4gICAgICAgIHZhciBsYXN0TW91bnRhaW4gPSBtb3VudGFpbnNbY3VycmVudE1vdW50YWluSW5kZXggLSAxXTtcbiAgICAgICAgdmFyIGxlbmd0aCA9IG1vdW50YWluLnNlZ21lbnRzLmxlbmd0aDtcblxuICAgICAgICBpZiAobGFzdE1vdW50YWluICYmIGxhc3RNb3VudGFpbi5hbmltYXRpbmdGaWxsKSB7XG4gICAgICAgICAgICBpZiAobGFzdE1vdW50YWluLmZpbGxDb2xvci5hbHBoYSA8IG1heEFscGhhKSB7XG4gICAgICAgICAgICAgICAgbGFzdE1vdW50YWluLmZpbGxDb2xvci5hbHBoYSArPSAwLjAxO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsYXN0TW91bnRhaW4uYW5pbWF0aW5nRmlsbCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1vdW50YWlucy5sZW5ndGggPj0gMCAmJiBtb3VudGFpbnMubGVuZ3RoIDw9IG1heE1vdW50YWlucykge1xuXG4gICAgICAgICAgICBpZiAoZXZlbnQuY291bnQgIT09IDAgJiYgZXZlbnQuY291bnQgJSBfY29uZmlnLlBPSU5UUyA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGhlaWdodE9mZnNldCArPSA1O1xuICAgICAgICAgICAgICAgIG1vdW50YWlucy5wdXNoKGluaXRNb3VudGFpbihwYXBlciwgIW1vdW50YWluLm1pcnJvcmVkKSk7XG5cbiAgICAgICAgICAgICAgICArK2N1cnJlbnRNb3VudGFpbkluZGV4O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobGVuZ3RoICsgMSA+PSBfY29uZmlnLlBPSU5UUykge1xuICAgICAgICAgICAgICAgIHZhciB4ID0gbW91bnRhaW4ubWlycm9yZWQgPyAwIDogd2lkdGg7XG4gICAgICAgICAgICAgICAgdmFyIHBvaW50ID0gbmV3IHBhcGVyLlBvaW50KHgsIGhlaWdodCk7XG4gICAgICAgICAgICAgICAgbW91bnRhaW4uYWRkKHBvaW50KTtcbiAgICAgICAgICAgICAgICBtb3VudGFpbi5hbmltYXRpbmdGaWxsID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGkgPSBsZW5ndGggKyAxO1xuICAgICAgICAgICAgICAgIHZhciB4ID0gbW91bnRhaW4ubWlycm9yZWQgPyB3aWR0aCAtIGkgKiBpbnRlcnZhbCA6IGkgKiBpbnRlcnZhbDtcbiAgICAgICAgICAgICAgICB2YXIgeSA9IGhlaWdodCAtIGRhdGFbaV0gKiAoX2NvbmZpZy5hbXBsaXR1ZGUgLyAyMCkgLSBoZWlnaHRPZmZzZXQ7XG4gICAgICAgICAgICAgICAgdmFyIHBvaW50ID0gbmV3IHBhcGVyLlBvaW50KHgsIHkpO1xuICAgICAgICAgICAgICAgIG1vdW50YWluLmFkZChwb2ludCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcblxufSx7XCIuLi9hY3Rpb25zXCI6MjgsXCIuLi91dGlscy9yYW5kb21CZXR3ZWVuXCI6MzQsXCIuL2NvbmZpZ1wiOjM1LFwibG9kYXNoL2Z1bmN0aW9uL29uY2VcIjozLFwibG9kYXNoL3V0aWxpdHkvcmFuZ2VcIjoxMn1dfSx7fSxbMjldKTtcbiJdLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
