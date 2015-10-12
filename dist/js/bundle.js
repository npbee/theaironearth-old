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

},{"./actions":28,"./constants":30,"./dom":31,"./reducer":32,"./router":33,"./visualizer":35,"redux":19,"redux-logger":16,"redux-thunk":17,"soundcloud-audio":27}],30:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var RESOLVE_URL = "https://soundcloud.com/theaironearth/sets/test";
exports.RESOLVE_URL = RESOLVE_URL;
var CLIENT_ID = "287e0a470aceec7d505ab41e1892fddc";
exports.CLIENT_ID = CLIENT_ID;

},{}],31:[function(require,module,exports){
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

},{"./actions":28}],32:[function(require,module,exports){
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
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodashFunctionOnce = require('lodash/function/once');

var _lodashFunctionOnce2 = _interopRequireDefault(_lodashFunctionOnce);

var _sphere = require('./sphere');

var _sphere2 = _interopRequireDefault(_sphere);

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
var RADIUS = 100;
exports.RADIUS = RADIUS;
var COLOR_AMP = 0.4;

exports.COLOR_AMP = COLOR_AMP;
exports['default'] = {

    // Exit
    "0": {
        visualizer: _sphere2['default'],
        hue: 32,
        saturation: 50,
        lightness: 81
    },

    // Ghost
    "1": {
        visualizer: _mountains2['default'],
        hue: 30,
        saturation: 84,
        lightness: 84,
        hitpoints: [89]
    },

    // Second Skin
    "2": {
        visualizer: _sphere2['default'],
        hue: 213,
        saturation: 50,
        lightness: 29
    },

    // Reflection
    "3": {
        visualizer: _sphere2['default'],
        hue: 227,
        saturation: 50,
        lightness: 9
    },

    //Farewell
    "4": {
        visualizer: _sphere2['default'],
        hue: 230,
        saturation: 50,
        lightness: 2
    },

    // Stillness
    "5": {
        visualizer: _sphere2['default'],
        hue: 7,
        saturation: 50,
        lightness: 14
    },

    // Young Guns
    "6": {
        visualizer: _sphere2['default'],
        hue: 2,
        saturation: 23,
        lightness: 46
    },

    // Innocent
    "7": {
        visualizer: _sphere2['default'],
        hue: 26,
        saturation: 49,
        lightness: 67
    },

    // Wake
    "8": {
        visualizer: _sphere2['default'],
        hue: 175,
        saturation: 17,
        lightness: 78
    }
};

},{"./mountains":36,"./sphere":37,"lodash/function/once":3}],35:[function(require,module,exports){
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

var _sphere = require('./sphere');

var _sphere2 = _interopRequireDefault(_sphere);

var _actions = require('../actions');

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function render(player, store, analyser, freqByteData, paper) {

    //requestAnimationFrame(render.bind(null, player, store, analyser, freqByteData, path));
    //setInterval(() => render(player, store, analyser, freqByteData, path, r), 1000);
    var state = store.getState();
    var currentTrackIndex = state.currentTrackIndex;
    var trackConfig = _config2['default'][currentTrackIndex];
    var createVisualizer = trackConfig.visualizer;
    var strokeColor = trackConfig.strokeColor;
    var hitpoints = trackConfig.hitpoints;

    store.dispatch((0, _actions.changeBackground)({
        hue: trackConfig.hue,
        saturation: trackConfig.saturation,
        lightness: trackConfig.lightness
    }));

    function run() {
        var visualizer = createVisualizer(paper, player, store, trackConfig);

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
            createVisualizer = trackConfig.visualizer;
            strokeColor = trackConfig.strokeColor;

            store.dispatch((0, _actions.changeBackground)({
                hue: trackConfig.hue,
                saturation: trackConfig.saturation,
                lightness: trackConfig.lightness
            }));

            paper.view.off('frame');

            run();
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

    //return initPath(paper.view.size.width, paper.view.size.height);
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

},{"../actions":28,"./config":34,"./sphere":37,"lodash/function/once":3,"lodash/number/inRange":11,"lodash/utility/range":12}],36:[function(require,module,exports){
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

    return function (data, event) {

        var currentHitpoint = hitpoints.length && hitpoints[currentHitpointIndex];

        if (currentHitpoint && player.audio.currentTime > currentHitpoint) {
            if (hits.indexOf(currentHitpoint) === -1) {
                hits.push(currentHitpoint);
                ++currentHitpoint;
            }
        }

        /**
         * Mountains!
         *
         */
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

        if (mountains.length >= 0 && mountains.length <= 4) {

            if (event.count !== 0 && event.count % _config.POINTS === 0) {
                heightOffset += 20;
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

        if (hits.length >= 1) {

            dimLights(store);

            var xPos = width * 0.25;
            var yPos = 200;
            var segs = sun.segments.length;
            var i = segs + 1;
            var radius = 75;

            if (segs <= _config.POINTS) {
                var x = radius * Math.cos(radius * i) + xPos;
                var y = radius * Math.sin(radius * i) + yPos;
                var point = new paper.Point(x, y);

                sun.add(point);

                if (segs > 30 && sun.fillColor.alpha < 0.5) {
                    sun.fillColor.red += 1;
                    sun.fillColor.alpha += 0.01;
                }
            } else if (sun.position.y < height - 200) {
                sun.position.y += 0.1;
            }
        }
    };
}

module.exports = exports['default'];

},{"../actions":28,"./config":34,"lodash/function/once":3,"lodash/utility/range":12}],37:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = generateSphere;

var _config = require('./config');

function generateSphere(data, path) {

    return path.segments.map(function (segment, i) {

        path.strokeColor = 'rgba(256, 256, 256, 1)';
        path.strokeWidth = 1;

        var xPos = paper.view.size.width / 2;
        var yPos = paper.view.size.height / 2;
        var magnitude = data[i] * (0.2 * (_config.amplitude / 20));
        var x = _config.RADIUS * Math.cos(_config.RADIUS * magnitude) + xPos;
        var y = _config.RADIUS * Math.sin(_config.RADIUS * magnitude) + yPos;

        segment.point.x = x;
        segment.point.y = y;

        return segment;
    });
}

module.exports = exports['default'];

},{"./config":34}]},{},[29]);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJidW5kbGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkoezE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xubW9kdWxlLmV4cG9ydHMgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIChhcnIpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcnIpID09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuXG59LHt9XSwyOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbi8qKiBVc2VkIGFzIHRoZSBgVHlwZUVycm9yYCBtZXNzYWdlIGZvciBcIkZ1bmN0aW9uc1wiIG1ldGhvZHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGZ1bmNgLCB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBhbmQgYXJndW1lbnRzXG4gKiBvZiB0aGUgY3JlYXRlZCBmdW5jdGlvbiwgd2hpbGUgaXQncyBjYWxsZWQgbGVzcyB0aGFuIGBuYCB0aW1lcy4gU3Vic2VxdWVudFxuICogY2FsbHMgdG8gdGhlIGNyZWF0ZWQgZnVuY3Rpb24gcmV0dXJuIHRoZSByZXN1bHQgb2YgdGhlIGxhc3QgYGZ1bmNgIGludm9jYXRpb24uXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtudW1iZXJ9IG4gVGhlIG51bWJlciBvZiBjYWxscyBhdCB3aGljaCBgZnVuY2AgaXMgbm8gbG9uZ2VyIGludm9rZWQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byByZXN0cmljdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHJlc3RyaWN0ZWQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIGpRdWVyeSgnI2FkZCcpLm9uKCdjbGljaycsIF8uYmVmb3JlKDUsIGFkZENvbnRhY3RUb0xpc3QpKTtcbiAqIC8vID0+IGFsbG93cyBhZGRpbmcgdXAgdG8gNCBjb250YWN0cyB0byB0aGUgbGlzdFxuICovXG5mdW5jdGlvbiBiZWZvcmUobiwgZnVuYykge1xuICB2YXIgcmVzdWx0O1xuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgIGlmICh0eXBlb2YgbiA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB2YXIgdGVtcCA9IG47XG4gICAgICBuID0gZnVuYztcbiAgICAgIGZ1bmMgPSB0ZW1wO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBpZiAoLS1uID4gMCkge1xuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgICBpZiAobiA8PSAxKSB7XG4gICAgICBmdW5jID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJlZm9yZTtcblxufSx7fV0sMzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG52YXIgYmVmb3JlID0gcmVxdWlyZSgnLi9iZWZvcmUnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBpcyByZXN0cmljdGVkIHRvIGludm9raW5nIGBmdW5jYCBvbmNlLiBSZXBlYXQgY2FsbHNcbiAqIHRvIHRoZSBmdW5jdGlvbiByZXR1cm4gdGhlIHZhbHVlIG9mIHRoZSBmaXJzdCBjYWxsLiBUaGUgYGZ1bmNgIGlzIGludm9rZWRcbiAqIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIGFuZCBhcmd1bWVudHMgb2YgdGhlIGNyZWF0ZWQgZnVuY3Rpb24uXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gcmVzdHJpY3QuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyByZXN0cmljdGVkIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgaW5pdGlhbGl6ZSA9IF8ub25jZShjcmVhdGVBcHBsaWNhdGlvbik7XG4gKiBpbml0aWFsaXplKCk7XG4gKiBpbml0aWFsaXplKCk7XG4gKiAvLyBgaW5pdGlhbGl6ZWAgaW52b2tlcyBgY3JlYXRlQXBwbGljYXRpb25gIG9uY2VcbiAqL1xuZnVuY3Rpb24gb25jZShmdW5jKSB7XG4gIHJldHVybiBiZWZvcmUoMiwgZnVuYyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb25jZTtcblxufSx7XCIuL2JlZm9yZVwiOjJ9XSw0OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucHJvcGVydHlgIHdpdGhvdXQgc3VwcG9ydCBmb3IgZGVlcCBwYXRocy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVByb3BlcnR5KGtleSkge1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVByb3BlcnR5O1xuXG59LHt9XSw1OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbnZhciBiYXNlUHJvcGVydHkgPSByZXF1aXJlKCcuL2Jhc2VQcm9wZXJ0eScpO1xuXG4vKipcbiAqIEdldHMgdGhlIFwibGVuZ3RoXCIgcHJvcGVydHkgdmFsdWUgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCB0byBhdm9pZCBhIFtKSVQgYnVnXShodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTQyNzkyKVxuICogdGhhdCBhZmZlY3RzIFNhZmFyaSBvbiBhdCBsZWFzdCBpT1MgOC4xLTguMyBBUk02NC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIFwibGVuZ3RoXCIgdmFsdWUuXG4gKi9cbnZhciBnZXRMZW5ndGggPSBiYXNlUHJvcGVydHkoJ2xlbmd0aCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdldExlbmd0aDtcblxufSx7XCIuL2Jhc2VQcm9wZXJ0eVwiOjR9XSw2OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbnZhciBnZXRMZW5ndGggPSByZXF1aXJlKCcuL2dldExlbmd0aCcpLFxuICAgIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi9pc0xlbmd0aCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0FycmF5TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiBpc0xlbmd0aChnZXRMZW5ndGgodmFsdWUpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0FycmF5TGlrZTtcblxufSx7XCIuL2dldExlbmd0aFwiOjUsXCIuL2lzTGVuZ3RoXCI6OX1dLDc6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuLyoqIFVzZWQgdG8gZGV0ZWN0IHVuc2lnbmVkIGludGVnZXIgdmFsdWVzLiAqL1xudmFyIHJlSXNVaW50ID0gL15cXGQrJC87XG5cbi8qKlxuICogVXNlZCBhcyB0aGUgW21heGltdW0gbGVuZ3RoXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1udW1iZXIubWF4X3NhZmVfaW50ZWdlcilcbiAqIG9mIGFuIGFycmF5LWxpa2UgdmFsdWUuXG4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgaW5kZXguXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHBhcmFtIHtudW1iZXJ9IFtsZW5ndGg9TUFYX1NBRkVfSU5URUdFUl0gVGhlIHVwcGVyIGJvdW5kcyBvZiBhIHZhbGlkIGluZGV4LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBpbmRleCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0luZGV4KHZhbHVlLCBsZW5ndGgpIHtcbiAgdmFsdWUgPSAodHlwZW9mIHZhbHVlID09ICdudW1iZXInIHx8IHJlSXNVaW50LnRlc3QodmFsdWUpKSA/ICt2YWx1ZSA6IC0xO1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG4gIHJldHVybiB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDwgbGVuZ3RoO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzSW5kZXg7XG5cbn0se31dLDg6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xudmFyIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpLFxuICAgIGlzSW5kZXggPSByZXF1aXJlKCcuL2lzSW5kZXgnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2xhbmcvaXNPYmplY3QnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgdGhlIHByb3ZpZGVkIGFyZ3VtZW50cyBhcmUgZnJvbSBhbiBpdGVyYXRlZSBjYWxsLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgdmFsdWUgYXJndW1lbnQuXG4gKiBAcGFyYW0geyp9IGluZGV4IFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgaW5kZXggb3Iga2V5IGFyZ3VtZW50LlxuICogQHBhcmFtIHsqfSBvYmplY3QgVGhlIHBvdGVudGlhbCBpdGVyYXRlZSBvYmplY3QgYXJndW1lbnQuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGFyZ3VtZW50cyBhcmUgZnJvbSBhbiBpdGVyYXRlZSBjYWxsLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSXRlcmF0ZWVDYWxsKHZhbHVlLCBpbmRleCwgb2JqZWN0KSB7XG4gIGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgdHlwZSA9IHR5cGVvZiBpbmRleDtcbiAgaWYgKHR5cGUgPT0gJ251bWJlcidcbiAgICAgID8gKGlzQXJyYXlMaWtlKG9iamVjdCkgJiYgaXNJbmRleChpbmRleCwgb2JqZWN0Lmxlbmd0aCkpXG4gICAgICA6ICh0eXBlID09ICdzdHJpbmcnICYmIGluZGV4IGluIG9iamVjdCkpIHtcbiAgICB2YXIgb3RoZXIgPSBvYmplY3RbaW5kZXhdO1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdmFsdWUgPyAodmFsdWUgPT09IG90aGVyKSA6IChvdGhlciAhPT0gb3RoZXIpO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0l0ZXJhdGVlQ2FsbDtcblxufSx7XCIuLi9sYW5nL2lzT2JqZWN0XCI6MTAsXCIuL2lzQXJyYXlMaWtlXCI6NixcIi4vaXNJbmRleFwiOjd9XSw5OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbi8qKlxuICogVXNlZCBhcyB0aGUgW21heGltdW0gbGVuZ3RoXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1udW1iZXIubWF4X3NhZmVfaW50ZWdlcilcbiAqIG9mIGFuIGFycmF5LWxpa2UgdmFsdWUuXG4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIGlzIGJhc2VkIG9uIFtgVG9MZW5ndGhgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy10b2xlbmd0aCkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBsZW5ndGgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNMZW5ndGgodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJiB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNMZW5ndGg7XG5cbn0se31dLDEwOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlIFtsYW5ndWFnZSB0eXBlXShodHRwczovL2VzNS5naXRodWIuaW8vI3g4KSBvZiBgT2JqZWN0YC5cbiAqIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoMSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICAvLyBBdm9pZCBhIFY4IEpJVCBidWcgaW4gQ2hyb21lIDE5LTIwLlxuICAvLyBTZWUgaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTIyOTEgZm9yIG1vcmUgZGV0YWlscy5cbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAhIXZhbHVlICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3Q7XG5cbn0se31dLDExOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbi8qIE5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXgsXG4gICAgbmF0aXZlTWluID0gTWF0aC5taW47XG5cbi8qKlxuICogQ2hlY2tzIGlmIGBuYCBpcyBiZXR3ZWVuIGBzdGFydGAgYW5kIHVwIHRvIGJ1dCBub3QgaW5jbHVkaW5nLCBgZW5kYC4gSWZcbiAqIGBlbmRgIGlzIG5vdCBzcGVjaWZpZWQgaXQncyBzZXQgdG8gYHN0YXJ0YCB3aXRoIGBzdGFydGAgdGhlbiBzZXQgdG8gYDBgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTnVtYmVyXG4gKiBAcGFyYW0ge251bWJlcn0gbiBUaGUgbnVtYmVyIHRvIGNoZWNrLlxuICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydD0wXSBUaGUgc3RhcnQgb2YgdGhlIHJhbmdlLlxuICogQHBhcmFtIHtudW1iZXJ9IGVuZCBUaGUgZW5kIG9mIHRoZSByYW5nZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgbmAgaXMgaW4gdGhlIHJhbmdlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaW5SYW5nZSgzLCAyLCA0KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmluUmFuZ2UoNCwgOCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pblJhbmdlKDQsIDIpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmluUmFuZ2UoMiwgMik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaW5SYW5nZSgxLjIsIDIpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaW5SYW5nZSg1LjIsIDQpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaW5SYW5nZSh2YWx1ZSwgc3RhcnQsIGVuZCkge1xuICBzdGFydCA9ICtzdGFydCB8fCAwO1xuICBpZiAoZW5kID09PSB1bmRlZmluZWQpIHtcbiAgICBlbmQgPSBzdGFydDtcbiAgICBzdGFydCA9IDA7XG4gIH0gZWxzZSB7XG4gICAgZW5kID0gK2VuZCB8fCAwO1xuICB9XG4gIHJldHVybiB2YWx1ZSA+PSBuYXRpdmVNaW4oc3RhcnQsIGVuZCkgJiYgdmFsdWUgPCBuYXRpdmVNYXgoc3RhcnQsIGVuZCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5SYW5nZTtcblxufSx7fV0sMTI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xudmFyIGlzSXRlcmF0ZWVDYWxsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvaXNJdGVyYXRlZUNhbGwnKTtcblxuLyogTmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVDZWlsID0gTWF0aC5jZWlsLFxuICAgIG5hdGl2ZU1heCA9IE1hdGgubWF4O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgbnVtYmVycyAocG9zaXRpdmUgYW5kL29yIG5lZ2F0aXZlKSBwcm9ncmVzc2luZyBmcm9tXG4gKiBgc3RhcnRgIHVwIHRvLCBidXQgbm90IGluY2x1ZGluZywgYGVuZGAuIElmIGBlbmRgIGlzIG5vdCBzcGVjaWZpZWQgaXQnc1xuICogc2V0IHRvIGBzdGFydGAgd2l0aCBgc3RhcnRgIHRoZW4gc2V0IHRvIGAwYC4gSWYgYGVuZGAgaXMgbGVzcyB0aGFuIGBzdGFydGBcbiAqIGEgemVyby1sZW5ndGggcmFuZ2UgaXMgY3JlYXRlZCB1bmxlc3MgYSBuZWdhdGl2ZSBgc3RlcGAgaXMgc3BlY2lmaWVkLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgVXRpbGl0eVxuICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydD0wXSBUaGUgc3RhcnQgb2YgdGhlIHJhbmdlLlxuICogQHBhcmFtIHtudW1iZXJ9IGVuZCBUaGUgZW5kIG9mIHRoZSByYW5nZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RlcD0xXSBUaGUgdmFsdWUgdG8gaW5jcmVtZW50IG9yIGRlY3JlbWVudCBieS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGFycmF5IG9mIG51bWJlcnMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8ucmFuZ2UoNCk7XG4gKiAvLyA9PiBbMCwgMSwgMiwgM11cbiAqXG4gKiBfLnJhbmdlKDEsIDUpO1xuICogLy8gPT4gWzEsIDIsIDMsIDRdXG4gKlxuICogXy5yYW5nZSgwLCAyMCwgNSk7XG4gKiAvLyA9PiBbMCwgNSwgMTAsIDE1XVxuICpcbiAqIF8ucmFuZ2UoMCwgLTQsIC0xKTtcbiAqIC8vID0+IFswLCAtMSwgLTIsIC0zXVxuICpcbiAqIF8ucmFuZ2UoMSwgNCwgMCk7XG4gKiAvLyA9PiBbMSwgMSwgMV1cbiAqXG4gKiBfLnJhbmdlKDApO1xuICogLy8gPT4gW11cbiAqL1xuZnVuY3Rpb24gcmFuZ2Uoc3RhcnQsIGVuZCwgc3RlcCkge1xuICBpZiAoc3RlcCAmJiBpc0l0ZXJhdGVlQ2FsbChzdGFydCwgZW5kLCBzdGVwKSkge1xuICAgIGVuZCA9IHN0ZXAgPSB1bmRlZmluZWQ7XG4gIH1cbiAgc3RhcnQgPSArc3RhcnQgfHwgMDtcbiAgc3RlcCA9IHN0ZXAgPT0gbnVsbCA/IDEgOiAoK3N0ZXAgfHwgMCk7XG5cbiAgaWYgKGVuZCA9PSBudWxsKSB7XG4gICAgZW5kID0gc3RhcnQ7XG4gICAgc3RhcnQgPSAwO1xuICB9IGVsc2Uge1xuICAgIGVuZCA9ICtlbmQgfHwgMDtcbiAgfVxuICAvLyBVc2UgYEFycmF5KGxlbmd0aClgIHNvIGVuZ2luZXMgbGlrZSBDaGFrcmEgYW5kIFY4IGF2b2lkIHNsb3dlciBtb2Rlcy5cbiAgLy8gU2VlIGh0dHBzOi8veW91dHUuYmUvWEFxSXBHVThaWmsjdD0xN20yNXMgZm9yIG1vcmUgZGV0YWlscy5cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBuYXRpdmVNYXgobmF0aXZlQ2VpbCgoZW5kIC0gc3RhcnQpIC8gKHN0ZXAgfHwgMSkpLCAwKSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KGxlbmd0aCk7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICByZXN1bHRbaW5kZXhdID0gc3RhcnQ7XG4gICAgc3RhcnQgKz0gc3RlcDtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJhbmdlO1xuXG59LHtcIi4uL2ludGVybmFsL2lzSXRlcmF0ZWVDYWxsXCI6OH1dLDEzOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbihmdW5jdGlvbiAocHJvY2Vzcyl7XG4gIC8qIGdsb2JhbHMgcmVxdWlyZSwgbW9kdWxlICovXG5cbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8qKlxuICAgKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICAgKi9cblxuICB2YXIgcGF0aHRvUmVnZXhwID0gcmVxdWlyZSgncGF0aC10by1yZWdleHAnKTtcblxuICAvKipcbiAgICogTW9kdWxlIGV4cG9ydHMuXG4gICAqL1xuXG4gIG1vZHVsZS5leHBvcnRzID0gcGFnZTtcblxuICAvKipcbiAgICogRGV0ZWN0IGNsaWNrIGV2ZW50XG4gICAqL1xuICB2YXIgY2xpY2tFdmVudCA9ICgndW5kZWZpbmVkJyAhPT0gdHlwZW9mIGRvY3VtZW50KSAmJiBkb2N1bWVudC5vbnRvdWNoc3RhcnQgPyAndG91Y2hzdGFydCcgOiAnY2xpY2snO1xuXG4gIC8qKlxuICAgKiBUbyB3b3JrIHByb3Blcmx5IHdpdGggdGhlIFVSTFxuICAgKiBoaXN0b3J5LmxvY2F0aW9uIGdlbmVyYXRlZCBwb2x5ZmlsbCBpbiBodHRwczovL2dpdGh1Yi5jb20vZGV2b3RlL0hUTUw1LUhpc3RvcnktQVBJXG4gICAqL1xuXG4gIHZhciBsb2NhdGlvbiA9ICgndW5kZWZpbmVkJyAhPT0gdHlwZW9mIHdpbmRvdykgJiYgKHdpbmRvdy5oaXN0b3J5LmxvY2F0aW9uIHx8IHdpbmRvdy5sb2NhdGlvbik7XG5cbiAgLyoqXG4gICAqIFBlcmZvcm0gaW5pdGlhbCBkaXNwYXRjaC5cbiAgICovXG5cbiAgdmFyIGRpc3BhdGNoID0gdHJ1ZTtcblxuXG4gIC8qKlxuICAgKiBEZWNvZGUgVVJMIGNvbXBvbmVudHMgKHF1ZXJ5IHN0cmluZywgcGF0aG5hbWUsIGhhc2gpLlxuICAgKiBBY2NvbW1vZGF0ZXMgYm90aCByZWd1bGFyIHBlcmNlbnQgZW5jb2RpbmcgYW5kIHgtd3d3LWZvcm0tdXJsZW5jb2RlZCBmb3JtYXQuXG4gICAqL1xuICB2YXIgZGVjb2RlVVJMQ29tcG9uZW50cyA9IHRydWU7XG5cbiAgLyoqXG4gICAqIEJhc2UgcGF0aC5cbiAgICovXG5cbiAgdmFyIGJhc2UgPSAnJztcblxuICAvKipcbiAgICogUnVubmluZyBmbGFnLlxuICAgKi9cblxuICB2YXIgcnVubmluZztcblxuICAvKipcbiAgICogSGFzaEJhbmcgb3B0aW9uXG4gICAqL1xuXG4gIHZhciBoYXNoYmFuZyA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBQcmV2aW91cyBjb250ZXh0LCBmb3IgY2FwdHVyaW5nXG4gICAqIHBhZ2UgZXhpdCBldmVudHMuXG4gICAqL1xuXG4gIHZhciBwcmV2Q29udGV4dDtcblxuICAvKipcbiAgICogUmVnaXN0ZXIgYHBhdGhgIHdpdGggY2FsbGJhY2sgYGZuKClgLFxuICAgKiBvciByb3V0ZSBgcGF0aGAsIG9yIHJlZGlyZWN0aW9uLFxuICAgKiBvciBgcGFnZS5zdGFydCgpYC5cbiAgICpcbiAgICogICBwYWdlKGZuKTtcbiAgICogICBwYWdlKCcqJywgZm4pO1xuICAgKiAgIHBhZ2UoJy91c2VyLzppZCcsIGxvYWQsIHVzZXIpO1xuICAgKiAgIHBhZ2UoJy91c2VyLycgKyB1c2VyLmlkLCB7IHNvbWU6ICd0aGluZycgfSk7XG4gICAqICAgcGFnZSgnL3VzZXIvJyArIHVzZXIuaWQpO1xuICAgKiAgIHBhZ2UoJy9mcm9tJywgJy90bycpXG4gICAqICAgcGFnZSgpO1xuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ3xGdW5jdGlvbn0gcGF0aFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbi4uLlxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBmdW5jdGlvbiBwYWdlKHBhdGgsIGZuKSB7XG4gICAgLy8gPGNhbGxiYWNrPlxuICAgIGlmICgnZnVuY3Rpb24nID09PSB0eXBlb2YgcGF0aCkge1xuICAgICAgcmV0dXJuIHBhZ2UoJyonLCBwYXRoKTtcbiAgICB9XG5cbiAgICAvLyByb3V0ZSA8cGF0aD4gdG8gPGNhbGxiYWNrIC4uLj5cbiAgICBpZiAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGZuKSB7XG4gICAgICB2YXIgcm91dGUgPSBuZXcgUm91dGUocGF0aCk7XG4gICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7ICsraSkge1xuICAgICAgICBwYWdlLmNhbGxiYWNrcy5wdXNoKHJvdXRlLm1pZGRsZXdhcmUoYXJndW1lbnRzW2ldKSk7XG4gICAgICB9XG4gICAgICAvLyBzaG93IDxwYXRoPiB3aXRoIFtzdGF0ZV1cbiAgICB9IGVsc2UgaWYgKCdzdHJpbmcnID09PSB0eXBlb2YgcGF0aCkge1xuICAgICAgcGFnZVsnc3RyaW5nJyA9PT0gdHlwZW9mIGZuID8gJ3JlZGlyZWN0JyA6ICdzaG93J10ocGF0aCwgZm4pO1xuICAgICAgLy8gc3RhcnQgW29wdGlvbnNdXG4gICAgfSBlbHNlIHtcbiAgICAgIHBhZ2Uuc3RhcnQocGF0aCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIGZ1bmN0aW9ucy5cbiAgICovXG5cbiAgcGFnZS5jYWxsYmFja3MgPSBbXTtcbiAgcGFnZS5leGl0cyA9IFtdO1xuXG4gIC8qKlxuICAgKiBDdXJyZW50IHBhdGggYmVpbmcgcHJvY2Vzc2VkXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICBwYWdlLmN1cnJlbnQgPSAnJztcblxuICAvKipcbiAgICogTnVtYmVyIG9mIHBhZ2VzIG5hdmlnYXRlZCB0by5cbiAgICogQHR5cGUge251bWJlcn1cbiAgICpcbiAgICogICAgIHBhZ2UubGVuID09IDA7XG4gICAqICAgICBwYWdlKCcvbG9naW4nKTtcbiAgICogICAgIHBhZ2UubGVuID09IDE7XG4gICAqL1xuXG4gIHBhZ2UubGVuID0gMDtcblxuICAvKipcbiAgICogR2V0IG9yIHNldCBiYXNlcGF0aCB0byBgcGF0aGAuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIHBhZ2UuYmFzZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICBpZiAoMCA9PT0gYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGJhc2U7XG4gICAgYmFzZSA9IHBhdGg7XG4gIH07XG5cbiAgLyoqXG4gICAqIEJpbmQgd2l0aCB0aGUgZ2l2ZW4gYG9wdGlvbnNgLlxuICAgKlxuICAgKiBPcHRpb25zOlxuICAgKlxuICAgKiAgICAtIGBjbGlja2AgYmluZCB0byBjbGljayBldmVudHMgW3RydWVdXG4gICAqICAgIC0gYHBvcHN0YXRlYCBiaW5kIHRvIHBvcHN0YXRlIFt0cnVlXVxuICAgKiAgICAtIGBkaXNwYXRjaGAgcGVyZm9ybSBpbml0aWFsIGRpc3BhdGNoIFt0cnVlXVxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBwYWdlLnN0YXJ0ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIGlmIChydW5uaW5nKSByZXR1cm47XG4gICAgcnVubmluZyA9IHRydWU7XG4gICAgaWYgKGZhbHNlID09PSBvcHRpb25zLmRpc3BhdGNoKSBkaXNwYXRjaCA9IGZhbHNlO1xuICAgIGlmIChmYWxzZSA9PT0gb3B0aW9ucy5kZWNvZGVVUkxDb21wb25lbnRzKSBkZWNvZGVVUkxDb21wb25lbnRzID0gZmFsc2U7XG4gICAgaWYgKGZhbHNlICE9PSBvcHRpb25zLnBvcHN0YXRlKSB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBvbnBvcHN0YXRlLCBmYWxzZSk7XG4gICAgaWYgKGZhbHNlICE9PSBvcHRpb25zLmNsaWNrKSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGNsaWNrRXZlbnQsIG9uY2xpY2ssIGZhbHNlKTtcbiAgICB9XG4gICAgaWYgKHRydWUgPT09IG9wdGlvbnMuaGFzaGJhbmcpIGhhc2hiYW5nID0gdHJ1ZTtcbiAgICBpZiAoIWRpc3BhdGNoKSByZXR1cm47XG4gICAgdmFyIHVybCA9IChoYXNoYmFuZyAmJiB+bG9jYXRpb24uaGFzaC5pbmRleE9mKCcjIScpKSA/IGxvY2F0aW9uLmhhc2guc3Vic3RyKDIpICsgbG9jYXRpb24uc2VhcmNoIDogbG9jYXRpb24ucGF0aG5hbWUgKyBsb2NhdGlvbi5zZWFyY2ggKyBsb2NhdGlvbi5oYXNoO1xuICAgIHBhZ2UucmVwbGFjZSh1cmwsIG51bGwsIHRydWUsIGRpc3BhdGNoKTtcbiAgfTtcblxuICAvKipcbiAgICogVW5iaW5kIGNsaWNrIGFuZCBwb3BzdGF0ZSBldmVudCBoYW5kbGVycy5cbiAgICpcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgcGFnZS5zdG9wID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCFydW5uaW5nKSByZXR1cm47XG4gICAgcGFnZS5jdXJyZW50ID0gJyc7XG4gICAgcGFnZS5sZW4gPSAwO1xuICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGNsaWNrRXZlbnQsIG9uY2xpY2ssIGZhbHNlKTtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBvbnBvcHN0YXRlLCBmYWxzZSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNob3cgYHBhdGhgIHdpdGggb3B0aW9uYWwgYHN0YXRlYCBvYmplY3QuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZVxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGRpc3BhdGNoXG4gICAqIEByZXR1cm4ge0NvbnRleHR9XG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIHBhZ2Uuc2hvdyA9IGZ1bmN0aW9uKHBhdGgsIHN0YXRlLCBkaXNwYXRjaCwgcHVzaCkge1xuICAgIHZhciBjdHggPSBuZXcgQ29udGV4dChwYXRoLCBzdGF0ZSk7XG4gICAgcGFnZS5jdXJyZW50ID0gY3R4LnBhdGg7XG4gICAgaWYgKGZhbHNlICE9PSBkaXNwYXRjaCkgcGFnZS5kaXNwYXRjaChjdHgpO1xuICAgIGlmIChmYWxzZSAhPT0gY3R4LmhhbmRsZWQgJiYgZmFsc2UgIT09IHB1c2gpIGN0eC5wdXNoU3RhdGUoKTtcbiAgICByZXR1cm4gY3R4O1xuICB9O1xuXG4gIC8qKlxuICAgKiBHb2VzIGJhY2sgaW4gdGhlIGhpc3RvcnlcbiAgICogQmFjayBzaG91bGQgYWx3YXlzIGxldCB0aGUgY3VycmVudCByb3V0ZSBwdXNoIHN0YXRlIGFuZCB0aGVuIGdvIGJhY2suXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoIC0gZmFsbGJhY2sgcGF0aCB0byBnbyBiYWNrIGlmIG5vIG1vcmUgaGlzdG9yeSBleGlzdHMsIGlmIHVuZGVmaW5lZCBkZWZhdWx0cyB0byBwYWdlLmJhc2VcbiAgICogQHBhcmFtIHtPYmplY3R9IFtzdGF0ZV1cbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgcGFnZS5iYWNrID0gZnVuY3Rpb24ocGF0aCwgc3RhdGUpIHtcbiAgICBpZiAocGFnZS5sZW4gPiAwKSB7XG4gICAgICAvLyB0aGlzIG1heSBuZWVkIG1vcmUgdGVzdGluZyB0byBzZWUgaWYgYWxsIGJyb3dzZXJzXG4gICAgICAvLyB3YWl0IGZvciB0aGUgbmV4dCB0aWNrIHRvIGdvIGJhY2sgaW4gaGlzdG9yeVxuICAgICAgaGlzdG9yeS5iYWNrKCk7XG4gICAgICBwYWdlLmxlbi0tO1xuICAgIH0gZWxzZSBpZiAocGF0aCkge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgcGFnZS5zaG93KHBhdGgsIHN0YXRlKTtcbiAgICAgIH0pO1xuICAgIH1lbHNle1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgcGFnZS5zaG93KGJhc2UsIHN0YXRlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciByb3V0ZSB0byByZWRpcmVjdCBmcm9tIG9uZSBwYXRoIHRvIG90aGVyXG4gICAqIG9yIGp1c3QgcmVkaXJlY3QgdG8gYW5vdGhlciByb3V0ZVxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZnJvbSAtIGlmIHBhcmFtICd0bycgaXMgdW5kZWZpbmVkIHJlZGlyZWN0cyB0byAnZnJvbSdcbiAgICogQHBhcmFtIHtTdHJpbmd9IFt0b11cbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG4gIHBhZ2UucmVkaXJlY3QgPSBmdW5jdGlvbihmcm9tLCB0bykge1xuICAgIC8vIERlZmluZSByb3V0ZSBmcm9tIGEgcGF0aCB0byBhbm90aGVyXG4gICAgaWYgKCdzdHJpbmcnID09PSB0eXBlb2YgZnJvbSAmJiAnc3RyaW5nJyA9PT0gdHlwZW9mIHRvKSB7XG4gICAgICBwYWdlKGZyb20sIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICBwYWdlLnJlcGxhY2UodG8pO1xuICAgICAgICB9LCAwKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFdhaXQgZm9yIHRoZSBwdXNoIHN0YXRlIGFuZCByZXBsYWNlIGl0IHdpdGggYW5vdGhlclxuICAgIGlmICgnc3RyaW5nJyA9PT0gdHlwZW9mIGZyb20gJiYgJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiB0bykge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgcGFnZS5yZXBsYWNlKGZyb20pO1xuICAgICAgfSwgMCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBSZXBsYWNlIGBwYXRoYCB3aXRoIG9wdGlvbmFsIGBzdGF0ZWAgb2JqZWN0LlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgKiBAcGFyYW0ge09iamVjdH0gc3RhdGVcbiAgICogQHJldHVybiB7Q29udGV4dH1cbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cblxuICBwYWdlLnJlcGxhY2UgPSBmdW5jdGlvbihwYXRoLCBzdGF0ZSwgaW5pdCwgZGlzcGF0Y2gpIHtcbiAgICB2YXIgY3R4ID0gbmV3IENvbnRleHQocGF0aCwgc3RhdGUpO1xuICAgIHBhZ2UuY3VycmVudCA9IGN0eC5wYXRoO1xuICAgIGN0eC5pbml0ID0gaW5pdDtcbiAgICBjdHguc2F2ZSgpOyAvLyBzYXZlIGJlZm9yZSBkaXNwYXRjaGluZywgd2hpY2ggbWF5IHJlZGlyZWN0XG4gICAgaWYgKGZhbHNlICE9PSBkaXNwYXRjaCkgcGFnZS5kaXNwYXRjaChjdHgpO1xuICAgIHJldHVybiBjdHg7XG4gIH07XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIHRoZSBnaXZlbiBgY3R4YC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGN0eFxuICAgKiBAYXBpIHByaXZhdGVcbiAgICovXG5cbiAgcGFnZS5kaXNwYXRjaCA9IGZ1bmN0aW9uKGN0eCkge1xuICAgIHZhciBwcmV2ID0gcHJldkNvbnRleHQsXG4gICAgICBpID0gMCxcbiAgICAgIGogPSAwO1xuXG4gICAgcHJldkNvbnRleHQgPSBjdHg7XG5cbiAgICBmdW5jdGlvbiBuZXh0RXhpdCgpIHtcbiAgICAgIHZhciBmbiA9IHBhZ2UuZXhpdHNbaisrXTtcbiAgICAgIGlmICghZm4pIHJldHVybiBuZXh0RW50ZXIoKTtcbiAgICAgIGZuKHByZXYsIG5leHRFeGl0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBuZXh0RW50ZXIoKSB7XG4gICAgICB2YXIgZm4gPSBwYWdlLmNhbGxiYWNrc1tpKytdO1xuXG4gICAgICBpZiAoY3R4LnBhdGggIT09IHBhZ2UuY3VycmVudCkge1xuICAgICAgICBjdHguaGFuZGxlZCA9IGZhbHNlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIWZuKSByZXR1cm4gdW5oYW5kbGVkKGN0eCk7XG4gICAgICBmbihjdHgsIG5leHRFbnRlcik7XG4gICAgfVxuXG4gICAgaWYgKHByZXYpIHtcbiAgICAgIG5leHRFeGl0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5leHRFbnRlcigpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogVW5oYW5kbGVkIGBjdHhgLiBXaGVuIGl0J3Mgbm90IHRoZSBpbml0aWFsXG4gICAqIHBvcHN0YXRlIHRoZW4gcmVkaXJlY3QuIElmIHlvdSB3aXNoIHRvIGhhbmRsZVxuICAgKiA0MDRzIG9uIHlvdXIgb3duIHVzZSBgcGFnZSgnKicsIGNhbGxiYWNrKWAuXG4gICAqXG4gICAqIEBwYXJhbSB7Q29udGV4dH0gY3R4XG4gICAqIEBhcGkgcHJpdmF0ZVxuICAgKi9cblxuICBmdW5jdGlvbiB1bmhhbmRsZWQoY3R4KSB7XG4gICAgaWYgKGN0eC5oYW5kbGVkKSByZXR1cm47XG4gICAgdmFyIGN1cnJlbnQ7XG5cbiAgICBpZiAoaGFzaGJhbmcpIHtcbiAgICAgIGN1cnJlbnQgPSBiYXNlICsgbG9jYXRpb24uaGFzaC5yZXBsYWNlKCcjIScsICcnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3VycmVudCA9IGxvY2F0aW9uLnBhdGhuYW1lICsgbG9jYXRpb24uc2VhcmNoO1xuICAgIH1cblxuICAgIGlmIChjdXJyZW50ID09PSBjdHguY2Fub25pY2FsUGF0aCkgcmV0dXJuO1xuICAgIHBhZ2Uuc3RvcCgpO1xuICAgIGN0eC5oYW5kbGVkID0gZmFsc2U7XG4gICAgbG9jYXRpb24uaHJlZiA9IGN0eC5jYW5vbmljYWxQYXRoO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGFuIGV4aXQgcm91dGUgb24gYHBhdGhgIHdpdGhcbiAgICogY2FsbGJhY2sgYGZuKClgLCB3aGljaCB3aWxsIGJlIGNhbGxlZFxuICAgKiBvbiB0aGUgcHJldmlvdXMgY29udGV4dCB3aGVuIGEgbmV3XG4gICAqIHBhZ2UgaXMgdmlzaXRlZC5cbiAgICovXG4gIHBhZ2UuZXhpdCA9IGZ1bmN0aW9uKHBhdGgsIGZuKSB7XG4gICAgaWYgKHR5cGVvZiBwYXRoID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gcGFnZS5leGl0KCcqJywgcGF0aCk7XG4gICAgfVxuXG4gICAgdmFyIHJvdXRlID0gbmV3IFJvdXRlKHBhdGgpO1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgKytpKSB7XG4gICAgICBwYWdlLmV4aXRzLnB1c2gocm91dGUubWlkZGxld2FyZShhcmd1bWVudHNbaV0pKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBVUkwgZW5jb2RpbmcgZnJvbSB0aGUgZ2l2ZW4gYHN0cmAuXG4gICAqIEFjY29tbW9kYXRlcyB3aGl0ZXNwYWNlIGluIGJvdGggeC13d3ctZm9ybS11cmxlbmNvZGVkXG4gICAqIGFuZCByZWd1bGFyIHBlcmNlbnQtZW5jb2RlZCBmb3JtLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cn0gVVJMIGNvbXBvbmVudCB0byBkZWNvZGVcbiAgICovXG4gIGZ1bmN0aW9uIGRlY29kZVVSTEVuY29kZWRVUklDb21wb25lbnQodmFsKSB7XG4gICAgaWYgKHR5cGVvZiB2YWwgIT09ICdzdHJpbmcnKSB7IHJldHVybiB2YWw7IH1cbiAgICByZXR1cm4gZGVjb2RlVVJMQ29tcG9uZW50cyA/IGRlY29kZVVSSUNvbXBvbmVudCh2YWwucmVwbGFjZSgvXFwrL2csICcgJykpIDogdmFsO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgYSBuZXcgXCJyZXF1ZXN0XCIgYENvbnRleHRgXG4gICAqIHdpdGggdGhlIGdpdmVuIGBwYXRoYCBhbmQgb3B0aW9uYWwgaW5pdGlhbCBgc3RhdGVgLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgKiBAcGFyYW0ge09iamVjdH0gc3RhdGVcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgZnVuY3Rpb24gQ29udGV4dChwYXRoLCBzdGF0ZSkge1xuICAgIGlmICgnLycgPT09IHBhdGhbMF0gJiYgMCAhPT0gcGF0aC5pbmRleE9mKGJhc2UpKSBwYXRoID0gYmFzZSArIChoYXNoYmFuZyA/ICcjIScgOiAnJykgKyBwYXRoO1xuICAgIHZhciBpID0gcGF0aC5pbmRleE9mKCc/Jyk7XG5cbiAgICB0aGlzLmNhbm9uaWNhbFBhdGggPSBwYXRoO1xuICAgIHRoaXMucGF0aCA9IHBhdGgucmVwbGFjZShiYXNlLCAnJykgfHwgJy8nO1xuICAgIGlmIChoYXNoYmFuZykgdGhpcy5wYXRoID0gdGhpcy5wYXRoLnJlcGxhY2UoJyMhJywgJycpIHx8ICcvJztcblxuICAgIHRoaXMudGl0bGUgPSBkb2N1bWVudC50aXRsZTtcbiAgICB0aGlzLnN0YXRlID0gc3RhdGUgfHwge307XG4gICAgdGhpcy5zdGF0ZS5wYXRoID0gcGF0aDtcbiAgICB0aGlzLnF1ZXJ5c3RyaW5nID0gfmkgPyBkZWNvZGVVUkxFbmNvZGVkVVJJQ29tcG9uZW50KHBhdGguc2xpY2UoaSArIDEpKSA6ICcnO1xuICAgIHRoaXMucGF0aG5hbWUgPSBkZWNvZGVVUkxFbmNvZGVkVVJJQ29tcG9uZW50KH5pID8gcGF0aC5zbGljZSgwLCBpKSA6IHBhdGgpO1xuICAgIHRoaXMucGFyYW1zID0ge307XG5cbiAgICAvLyBmcmFnbWVudFxuICAgIHRoaXMuaGFzaCA9ICcnO1xuICAgIGlmICghaGFzaGJhbmcpIHtcbiAgICAgIGlmICghfnRoaXMucGF0aC5pbmRleE9mKCcjJykpIHJldHVybjtcbiAgICAgIHZhciBwYXJ0cyA9IHRoaXMucGF0aC5zcGxpdCgnIycpO1xuICAgICAgdGhpcy5wYXRoID0gcGFydHNbMF07XG4gICAgICB0aGlzLmhhc2ggPSBkZWNvZGVVUkxFbmNvZGVkVVJJQ29tcG9uZW50KHBhcnRzWzFdKSB8fCAnJztcbiAgICAgIHRoaXMucXVlcnlzdHJpbmcgPSB0aGlzLnF1ZXJ5c3RyaW5nLnNwbGl0KCcjJylbMF07XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEV4cG9zZSBgQ29udGV4dGAuXG4gICAqL1xuXG4gIHBhZ2UuQ29udGV4dCA9IENvbnRleHQ7XG5cbiAgLyoqXG4gICAqIFB1c2ggc3RhdGUuXG4gICAqXG4gICAqIEBhcGkgcHJpdmF0ZVxuICAgKi9cblxuICBDb250ZXh0LnByb3RvdHlwZS5wdXNoU3RhdGUgPSBmdW5jdGlvbigpIHtcbiAgICBwYWdlLmxlbisrO1xuICAgIGhpc3RvcnkucHVzaFN0YXRlKHRoaXMuc3RhdGUsIHRoaXMudGl0bGUsIGhhc2hiYW5nICYmIHRoaXMucGF0aCAhPT0gJy8nID8gJyMhJyArIHRoaXMucGF0aCA6IHRoaXMuY2Fub25pY2FsUGF0aCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNhdmUgdGhlIGNvbnRleHQgc3RhdGUuXG4gICAqXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIENvbnRleHQucHJvdG90eXBlLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICBoaXN0b3J5LnJlcGxhY2VTdGF0ZSh0aGlzLnN0YXRlLCB0aGlzLnRpdGxlLCBoYXNoYmFuZyAmJiB0aGlzLnBhdGggIT09ICcvJyA/ICcjIScgKyB0aGlzLnBhdGggOiB0aGlzLmNhbm9uaWNhbFBhdGgpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIGBSb3V0ZWAgd2l0aCB0aGUgZ2l2ZW4gSFRUUCBgcGF0aGAsXG4gICAqIGFuZCBhbiBhcnJheSBvZiBgY2FsbGJhY2tzYCBhbmQgYG9wdGlvbnNgLlxuICAgKlxuICAgKiBPcHRpb25zOlxuICAgKlxuICAgKiAgIC0gYHNlbnNpdGl2ZWAgICAgZW5hYmxlIGNhc2Utc2Vuc2l0aXZlIHJvdXRlc1xuICAgKiAgIC0gYHN0cmljdGAgICAgICAgZW5hYmxlIHN0cmljdCBtYXRjaGluZyBmb3IgdHJhaWxpbmcgc2xhc2hlc1xuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucy5cbiAgICogQGFwaSBwcml2YXRlXG4gICAqL1xuXG4gIGZ1bmN0aW9uIFJvdXRlKHBhdGgsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLnBhdGggPSAocGF0aCA9PT0gJyonKSA/ICcoLiopJyA6IHBhdGg7XG4gICAgdGhpcy5tZXRob2QgPSAnR0VUJztcbiAgICB0aGlzLnJlZ2V4cCA9IHBhdGh0b1JlZ2V4cCh0aGlzLnBhdGgsXG4gICAgICB0aGlzLmtleXMgPSBbXSxcbiAgICAgIG9wdGlvbnMuc2Vuc2l0aXZlLFxuICAgICAgb3B0aW9ucy5zdHJpY3QpO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4cG9zZSBgUm91dGVgLlxuICAgKi9cblxuICBwYWdlLlJvdXRlID0gUm91dGU7XG5cbiAgLyoqXG4gICAqIFJldHVybiByb3V0ZSBtaWRkbGV3YXJlIHdpdGhcbiAgICogdGhlIGdpdmVuIGNhbGxiYWNrIGBmbigpYC5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAgICogQHJldHVybiB7RnVuY3Rpb259XG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5taWRkbGV3YXJlID0gZnVuY3Rpb24oZm4pIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGN0eCwgbmV4dCkge1xuICAgICAgaWYgKHNlbGYubWF0Y2goY3R4LnBhdGgsIGN0eC5wYXJhbXMpKSByZXR1cm4gZm4oY3R4LCBuZXh0KTtcbiAgICAgIG5leHQoKTtcbiAgICB9O1xuICB9O1xuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGlzIHJvdXRlIG1hdGNoZXMgYHBhdGhgLCBpZiBzb1xuICAgKiBwb3B1bGF0ZSBgcGFyYW1zYC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtc1xuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKiBAYXBpIHByaXZhdGVcbiAgICovXG5cbiAgUm91dGUucHJvdG90eXBlLm1hdGNoID0gZnVuY3Rpb24ocGF0aCwgcGFyYW1zKSB7XG4gICAgdmFyIGtleXMgPSB0aGlzLmtleXMsXG4gICAgICBxc0luZGV4ID0gcGF0aC5pbmRleE9mKCc/JyksXG4gICAgICBwYXRobmFtZSA9IH5xc0luZGV4ID8gcGF0aC5zbGljZSgwLCBxc0luZGV4KSA6IHBhdGgsXG4gICAgICBtID0gdGhpcy5yZWdleHAuZXhlYyhkZWNvZGVVUklDb21wb25lbnQocGF0aG5hbWUpKTtcblxuICAgIGlmICghbSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgZm9yICh2YXIgaSA9IDEsIGxlbiA9IG0ubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgIHZhciBrZXkgPSBrZXlzW2kgLSAxXTtcbiAgICAgIHZhciB2YWwgPSBkZWNvZGVVUkxFbmNvZGVkVVJJQ29tcG9uZW50KG1baV0pO1xuICAgICAgaWYgKHZhbCAhPT0gdW5kZWZpbmVkIHx8ICEoaGFzT3duUHJvcGVydHkuY2FsbChwYXJhbXMsIGtleS5uYW1lKSkpIHtcbiAgICAgICAgcGFyYW1zW2tleS5uYW1lXSA9IHZhbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuXG4gIC8qKlxuICAgKiBIYW5kbGUgXCJwb3B1bGF0ZVwiIGV2ZW50cy5cbiAgICovXG5cbiAgdmFyIG9ucG9wc3RhdGUgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBsb2FkZWQgPSBmYWxzZTtcbiAgICBpZiAoJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiB3aW5kb3cpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScpIHtcbiAgICAgIGxvYWRlZCA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgbG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgfSwgMCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmN0aW9uIG9ucG9wc3RhdGUoZSkge1xuICAgICAgaWYgKCFsb2FkZWQpIHJldHVybjtcbiAgICAgIGlmIChlLnN0YXRlKSB7XG4gICAgICAgIHZhciBwYXRoID0gZS5zdGF0ZS5wYXRoO1xuICAgICAgICBwYWdlLnJlcGxhY2UocGF0aCwgZS5zdGF0ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYWdlLnNob3cobG9jYXRpb24ucGF0aG5hbWUgKyBsb2NhdGlvbi5oYXNoLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgZmFsc2UpO1xuICAgICAgfVxuICAgIH07XG4gIH0pKCk7XG4gIC8qKlxuICAgKiBIYW5kbGUgXCJjbGlja1wiIGV2ZW50cy5cbiAgICovXG5cbiAgZnVuY3Rpb24gb25jbGljayhlKSB7XG5cbiAgICBpZiAoMSAhPT0gd2hpY2goZSkpIHJldHVybjtcblxuICAgIGlmIChlLm1ldGFLZXkgfHwgZS5jdHJsS2V5IHx8IGUuc2hpZnRLZXkpIHJldHVybjtcbiAgICBpZiAoZS5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XG5cblxuXG4gICAgLy8gZW5zdXJlIGxpbmtcbiAgICB2YXIgZWwgPSBlLnRhcmdldDtcbiAgICB3aGlsZSAoZWwgJiYgJ0EnICE9PSBlbC5ub2RlTmFtZSkgZWwgPSBlbC5wYXJlbnROb2RlO1xuICAgIGlmICghZWwgfHwgJ0EnICE9PSBlbC5ub2RlTmFtZSkgcmV0dXJuO1xuXG5cblxuICAgIC8vIElnbm9yZSBpZiB0YWcgaGFzXG4gICAgLy8gMS4gXCJkb3dubG9hZFwiIGF0dHJpYnV0ZVxuICAgIC8vIDIuIHJlbD1cImV4dGVybmFsXCIgYXR0cmlidXRlXG4gICAgaWYgKGVsLmhhc0F0dHJpYnV0ZSgnZG93bmxvYWQnKSB8fCBlbC5nZXRBdHRyaWJ1dGUoJ3JlbCcpID09PSAnZXh0ZXJuYWwnKSByZXR1cm47XG5cbiAgICAvLyBlbnN1cmUgbm9uLWhhc2ggZm9yIHRoZSBzYW1lIHBhdGhcbiAgICB2YXIgbGluayA9IGVsLmdldEF0dHJpYnV0ZSgnaHJlZicpO1xuICAgIGlmICghaGFzaGJhbmcgJiYgZWwucGF0aG5hbWUgPT09IGxvY2F0aW9uLnBhdGhuYW1lICYmIChlbC5oYXNoIHx8ICcjJyA9PT0gbGluaykpIHJldHVybjtcblxuXG5cbiAgICAvLyBDaGVjayBmb3IgbWFpbHRvOiBpbiB0aGUgaHJlZlxuICAgIGlmIChsaW5rICYmIGxpbmsuaW5kZXhPZignbWFpbHRvOicpID4gLTEpIHJldHVybjtcblxuICAgIC8vIGNoZWNrIHRhcmdldFxuICAgIGlmIChlbC50YXJnZXQpIHJldHVybjtcblxuICAgIC8vIHgtb3JpZ2luXG4gICAgaWYgKCFzYW1lT3JpZ2luKGVsLmhyZWYpKSByZXR1cm47XG5cblxuXG4gICAgLy8gcmVidWlsZCBwYXRoXG4gICAgdmFyIHBhdGggPSBlbC5wYXRobmFtZSArIGVsLnNlYXJjaCArIChlbC5oYXNoIHx8ICcnKTtcblxuICAgIC8vIHN0cmlwIGxlYWRpbmcgXCIvW2RyaXZlIGxldHRlcl06XCIgb24gTlcuanMgb24gV2luZG93c1xuICAgIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgcGF0aC5tYXRjaCgvXlxcL1thLXpBLVpdOlxcLy8pKSB7XG4gICAgICBwYXRoID0gcGF0aC5yZXBsYWNlKC9eXFwvW2EtekEtWl06XFwvLywgJy8nKTtcbiAgICB9XG5cbiAgICAvLyBzYW1lIHBhZ2VcbiAgICB2YXIgb3JpZyA9IHBhdGg7XG5cbiAgICBpZiAocGF0aC5pbmRleE9mKGJhc2UpID09PSAwKSB7XG4gICAgICBwYXRoID0gcGF0aC5zdWJzdHIoYmFzZS5sZW5ndGgpO1xuICAgIH1cblxuICAgIGlmIChoYXNoYmFuZykgcGF0aCA9IHBhdGgucmVwbGFjZSgnIyEnLCAnJyk7XG5cbiAgICBpZiAoYmFzZSAmJiBvcmlnID09PSBwYXRoKSByZXR1cm47XG5cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgcGFnZS5zaG93KG9yaWcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEV2ZW50IGJ1dHRvbi5cbiAgICovXG5cbiAgZnVuY3Rpb24gd2hpY2goZSkge1xuICAgIGUgPSBlIHx8IHdpbmRvdy5ldmVudDtcbiAgICByZXR1cm4gbnVsbCA9PT0gZS53aGljaCA/IGUuYnV0dG9uIDogZS53aGljaDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBgaHJlZmAgaXMgdGhlIHNhbWUgb3JpZ2luLlxuICAgKi9cblxuICBmdW5jdGlvbiBzYW1lT3JpZ2luKGhyZWYpIHtcbiAgICB2YXIgb3JpZ2luID0gbG9jYXRpb24ucHJvdG9jb2wgKyAnLy8nICsgbG9jYXRpb24uaG9zdG5hbWU7XG4gICAgaWYgKGxvY2F0aW9uLnBvcnQpIG9yaWdpbiArPSAnOicgKyBsb2NhdGlvbi5wb3J0O1xuICAgIHJldHVybiAoaHJlZiAmJiAoMCA9PT0gaHJlZi5pbmRleE9mKG9yaWdpbikpKTtcbiAgfVxuXG4gIHBhZ2Uuc2FtZU9yaWdpbiA9IHNhbWVPcmlnaW47XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKCdfcHJvY2VzcycpKVxufSx7XCJfcHJvY2Vzc1wiOjE1LFwicGF0aC10by1yZWdleHBcIjoxNH1dLDE0OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbnZhciBpc0FycmF5ID0gcmVxdWlyZSgnaXNhcnJheScpO1xuXG4vKipcbiAqIEV4cG9zZSBgcGF0aFRvUmVnZXhwYC5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBwYXRoVG9SZWdleHA7XG5cbi8qKlxuICogVGhlIG1haW4gcGF0aCBtYXRjaGluZyByZWdleHAgdXRpbGl0eS5cbiAqXG4gKiBAdHlwZSB7UmVnRXhwfVxuICovXG52YXIgUEFUSF9SRUdFWFAgPSBuZXcgUmVnRXhwKFtcbiAgLy8gTWF0Y2ggZXNjYXBlZCBjaGFyYWN0ZXJzIHRoYXQgd291bGQgb3RoZXJ3aXNlIGFwcGVhciBpbiBmdXR1cmUgbWF0Y2hlcy5cbiAgLy8gVGhpcyBhbGxvd3MgdGhlIHVzZXIgdG8gZXNjYXBlIHNwZWNpYWwgY2hhcmFjdGVycyB0aGF0IHdvbid0IHRyYW5zZm9ybS5cbiAgJyhcXFxcXFxcXC4pJyxcbiAgLy8gTWF0Y2ggRXhwcmVzcy1zdHlsZSBwYXJhbWV0ZXJzIGFuZCB1bi1uYW1lZCBwYXJhbWV0ZXJzIHdpdGggYSBwcmVmaXhcbiAgLy8gYW5kIG9wdGlvbmFsIHN1ZmZpeGVzLiBNYXRjaGVzIGFwcGVhciBhczpcbiAgLy9cbiAgLy8gXCIvOnRlc3QoXFxcXGQrKT9cIiA9PiBbXCIvXCIsIFwidGVzdFwiLCBcIlxcZCtcIiwgdW5kZWZpbmVkLCBcIj9cIl1cbiAgLy8gXCIvcm91dGUoXFxcXGQrKVwiID0+IFt1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBcIlxcZCtcIiwgdW5kZWZpbmVkXVxuICAnKFtcXFxcLy5dKT8oPzpcXFxcOihcXFxcdyspKD86XFxcXCgoKD86XFxcXFxcXFwufFteKV0pKilcXFxcKSk/fFxcXFwoKCg/OlxcXFxcXFxcLnxbXildKSopXFxcXCkpKFsrKj9dKT8nLFxuICAvLyBNYXRjaCByZWdleHAgc3BlY2lhbCBjaGFyYWN0ZXJzIHRoYXQgYXJlIGFsd2F5cyBlc2NhcGVkLlxuICAnKFsuKyo/PV4hOiR7fSgpW1xcXFxdfFxcXFwvXSknXG5dLmpvaW4oJ3wnKSwgJ2cnKTtcblxuLyoqXG4gKiBFc2NhcGUgdGhlIGNhcHR1cmluZyBncm91cCBieSBlc2NhcGluZyBzcGVjaWFsIGNoYXJhY3RlcnMgYW5kIG1lYW5pbmcuXG4gKlxuICogQHBhcmFtICB7U3RyaW5nfSBncm91cFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5mdW5jdGlvbiBlc2NhcGVHcm91cCAoZ3JvdXApIHtcbiAgcmV0dXJuIGdyb3VwLnJlcGxhY2UoLyhbPSE6JFxcLygpXSkvZywgJ1xcXFwkMScpO1xufVxuXG4vKipcbiAqIEF0dGFjaCB0aGUga2V5cyBhcyBhIHByb3BlcnR5IG9mIHRoZSByZWdleHAuXG4gKlxuICogQHBhcmFtICB7UmVnRXhwfSByZVxuICogQHBhcmFtICB7QXJyYXl9ICBrZXlzXG4gKiBAcmV0dXJuIHtSZWdFeHB9XG4gKi9cbmZ1bmN0aW9uIGF0dGFjaEtleXMgKHJlLCBrZXlzKSB7XG4gIHJlLmtleXMgPSBrZXlzO1xuICByZXR1cm4gcmU7XG59XG5cbi8qKlxuICogR2V0IHRoZSBmbGFncyBmb3IgYSByZWdleHAgZnJvbSB0aGUgb3B0aW9ucy5cbiAqXG4gKiBAcGFyYW0gIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZnVuY3Rpb24gZmxhZ3MgKG9wdGlvbnMpIHtcbiAgcmV0dXJuIG9wdGlvbnMuc2Vuc2l0aXZlID8gJycgOiAnaSc7XG59XG5cbi8qKlxuICogUHVsbCBvdXQga2V5cyBmcm9tIGEgcmVnZXhwLlxuICpcbiAqIEBwYXJhbSAge1JlZ0V4cH0gcGF0aFxuICogQHBhcmFtICB7QXJyYXl9ICBrZXlzXG4gKiBAcmV0dXJuIHtSZWdFeHB9XG4gKi9cbmZ1bmN0aW9uIHJlZ2V4cFRvUmVnZXhwIChwYXRoLCBrZXlzKSB7XG4gIC8vIFVzZSBhIG5lZ2F0aXZlIGxvb2thaGVhZCB0byBtYXRjaCBvbmx5IGNhcHR1cmluZyBncm91cHMuXG4gIHZhciBncm91cHMgPSBwYXRoLnNvdXJjZS5tYXRjaCgvXFwoKD8hXFw/KS9nKTtcblxuICBpZiAoZ3JvdXBzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBncm91cHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGtleXMucHVzaCh7XG4gICAgICAgIG5hbWU6ICAgICAgaSxcbiAgICAgICAgZGVsaW1pdGVyOiBudWxsLFxuICAgICAgICBvcHRpb25hbDogIGZhbHNlLFxuICAgICAgICByZXBlYXQ6ICAgIGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYXR0YWNoS2V5cyhwYXRoLCBrZXlzKTtcbn1cblxuLyoqXG4gKiBUcmFuc2Zvcm0gYW4gYXJyYXkgaW50byBhIHJlZ2V4cC5cbiAqXG4gKiBAcGFyYW0gIHtBcnJheX0gIHBhdGhcbiAqIEBwYXJhbSAge0FycmF5fSAga2V5c1xuICogQHBhcmFtICB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtSZWdFeHB9XG4gKi9cbmZ1bmN0aW9uIGFycmF5VG9SZWdleHAgKHBhdGgsIGtleXMsIG9wdGlvbnMpIHtcbiAgdmFyIHBhcnRzID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXRoLmxlbmd0aDsgaSsrKSB7XG4gICAgcGFydHMucHVzaChwYXRoVG9SZWdleHAocGF0aFtpXSwga2V5cywgb3B0aW9ucykuc291cmNlKTtcbiAgfVxuXG4gIHZhciByZWdleHAgPSBuZXcgUmVnRXhwKCcoPzonICsgcGFydHMuam9pbignfCcpICsgJyknLCBmbGFncyhvcHRpb25zKSk7XG4gIHJldHVybiBhdHRhY2hLZXlzKHJlZ2V4cCwga2V5cyk7XG59XG5cbi8qKlxuICogUmVwbGFjZSB0aGUgc3BlY2lmaWMgdGFncyB3aXRoIHJlZ2V4cCBzdHJpbmdzLlxuICpcbiAqIEBwYXJhbSAge1N0cmluZ30gcGF0aFxuICogQHBhcmFtICB7QXJyYXl9ICBrZXlzXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIHJlcGxhY2VQYXRoIChwYXRoLCBrZXlzKSB7XG4gIHZhciBpbmRleCA9IDA7XG5cbiAgZnVuY3Rpb24gcmVwbGFjZSAoXywgZXNjYXBlZCwgcHJlZml4LCBrZXksIGNhcHR1cmUsIGdyb3VwLCBzdWZmaXgsIGVzY2FwZSkge1xuICAgIGlmIChlc2NhcGVkKSB7XG4gICAgICByZXR1cm4gZXNjYXBlZDtcbiAgICB9XG5cbiAgICBpZiAoZXNjYXBlKSB7XG4gICAgICByZXR1cm4gJ1xcXFwnICsgZXNjYXBlO1xuICAgIH1cblxuICAgIHZhciByZXBlYXQgICA9IHN1ZmZpeCA9PT0gJysnIHx8IHN1ZmZpeCA9PT0gJyonO1xuICAgIHZhciBvcHRpb25hbCA9IHN1ZmZpeCA9PT0gJz8nIHx8IHN1ZmZpeCA9PT0gJyonO1xuXG4gICAga2V5cy5wdXNoKHtcbiAgICAgIG5hbWU6ICAgICAga2V5IHx8IGluZGV4KyssXG4gICAgICBkZWxpbWl0ZXI6IHByZWZpeCB8fCAnLycsXG4gICAgICBvcHRpb25hbDogIG9wdGlvbmFsLFxuICAgICAgcmVwZWF0OiAgICByZXBlYXRcbiAgICB9KTtcblxuICAgIHByZWZpeCA9IHByZWZpeCA/ICgnXFxcXCcgKyBwcmVmaXgpIDogJyc7XG4gICAgY2FwdHVyZSA9IGVzY2FwZUdyb3VwKGNhcHR1cmUgfHwgZ3JvdXAgfHwgJ1teJyArIChwcmVmaXggfHwgJ1xcXFwvJykgKyAnXSs/Jyk7XG5cbiAgICBpZiAocmVwZWF0KSB7XG4gICAgICBjYXB0dXJlID0gY2FwdHVyZSArICcoPzonICsgcHJlZml4ICsgY2FwdHVyZSArICcpKic7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbmFsKSB7XG4gICAgICByZXR1cm4gJyg/OicgKyBwcmVmaXggKyAnKCcgKyBjYXB0dXJlICsgJykpPyc7XG4gICAgfVxuXG4gICAgLy8gQmFzaWMgcGFyYW1ldGVyIHN1cHBvcnQuXG4gICAgcmV0dXJuIHByZWZpeCArICcoJyArIGNhcHR1cmUgKyAnKSc7XG4gIH1cblxuICByZXR1cm4gcGF0aC5yZXBsYWNlKFBBVEhfUkVHRVhQLCByZXBsYWNlKTtcbn1cblxuLyoqXG4gKiBOb3JtYWxpemUgdGhlIGdpdmVuIHBhdGggc3RyaW5nLCByZXR1cm5pbmcgYSByZWd1bGFyIGV4cHJlc3Npb24uXG4gKlxuICogQW4gZW1wdHkgYXJyYXkgY2FuIGJlIHBhc3NlZCBpbiBmb3IgdGhlIGtleXMsIHdoaWNoIHdpbGwgaG9sZCB0aGVcbiAqIHBsYWNlaG9sZGVyIGtleSBkZXNjcmlwdGlvbnMuIEZvciBleGFtcGxlLCB1c2luZyBgL3VzZXIvOmlkYCwgYGtleXNgIHdpbGxcbiAqIGNvbnRhaW4gYFt7IG5hbWU6ICdpZCcsIGRlbGltaXRlcjogJy8nLCBvcHRpb25hbDogZmFsc2UsIHJlcGVhdDogZmFsc2UgfV1gLlxuICpcbiAqIEBwYXJhbSAgeyhTdHJpbmd8UmVnRXhwfEFycmF5KX0gcGF0aFxuICogQHBhcmFtICB7QXJyYXl9ICAgICAgICAgICAgICAgICBba2V5c11cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICAgICAgICAgW29wdGlvbnNdXG4gKiBAcmV0dXJuIHtSZWdFeHB9XG4gKi9cbmZ1bmN0aW9uIHBhdGhUb1JlZ2V4cCAocGF0aCwga2V5cywgb3B0aW9ucykge1xuICBrZXlzID0ga2V5cyB8fCBbXTtcblxuICBpZiAoIWlzQXJyYXkoa2V5cykpIHtcbiAgICBvcHRpb25zID0ga2V5cztcbiAgICBrZXlzID0gW107XG4gIH0gZWxzZSBpZiAoIW9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cblxuICBpZiAocGF0aCBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgIHJldHVybiByZWdleHBUb1JlZ2V4cChwYXRoLCBrZXlzLCBvcHRpb25zKTtcbiAgfVxuXG4gIGlmIChpc0FycmF5KHBhdGgpKSB7XG4gICAgcmV0dXJuIGFycmF5VG9SZWdleHAocGF0aCwga2V5cywgb3B0aW9ucyk7XG4gIH1cblxuICB2YXIgc3RyaWN0ID0gb3B0aW9ucy5zdHJpY3Q7XG4gIHZhciBlbmQgPSBvcHRpb25zLmVuZCAhPT0gZmFsc2U7XG4gIHZhciByb3V0ZSA9IHJlcGxhY2VQYXRoKHBhdGgsIGtleXMpO1xuICB2YXIgZW5kc1dpdGhTbGFzaCA9IHBhdGguY2hhckF0KHBhdGgubGVuZ3RoIC0gMSkgPT09ICcvJztcblxuICAvLyBJbiBub24tc3RyaWN0IG1vZGUgd2UgYWxsb3cgYSBzbGFzaCBhdCB0aGUgZW5kIG9mIG1hdGNoLiBJZiB0aGUgcGF0aCB0b1xuICAvLyBtYXRjaCBhbHJlYWR5IGVuZHMgd2l0aCBhIHNsYXNoLCB3ZSByZW1vdmUgaXQgZm9yIGNvbnNpc3RlbmN5LiBUaGUgc2xhc2hcbiAgLy8gaXMgdmFsaWQgYXQgdGhlIGVuZCBvZiBhIHBhdGggbWF0Y2gsIG5vdCBpbiB0aGUgbWlkZGxlLiBUaGlzIGlzIGltcG9ydGFudFxuICAvLyBpbiBub24tZW5kaW5nIG1vZGUsIHdoZXJlIFwiL3Rlc3QvXCIgc2hvdWxkbid0IG1hdGNoIFwiL3Rlc3QvL3JvdXRlXCIuXG4gIGlmICghc3RyaWN0KSB7XG4gICAgcm91dGUgPSAoZW5kc1dpdGhTbGFzaCA/IHJvdXRlLnNsaWNlKDAsIC0yKSA6IHJvdXRlKSArICcoPzpcXFxcLyg/PSQpKT8nO1xuICB9XG5cbiAgaWYgKGVuZCkge1xuICAgIHJvdXRlICs9ICckJztcbiAgfSBlbHNlIHtcbiAgICAvLyBJbiBub24tZW5kaW5nIG1vZGUsIHdlIG5lZWQgdGhlIGNhcHR1cmluZyBncm91cHMgdG8gbWF0Y2ggYXMgbXVjaCBhc1xuICAgIC8vIHBvc3NpYmxlIGJ5IHVzaW5nIGEgcG9zaXRpdmUgbG9va2FoZWFkIHRvIHRoZSBlbmQgb3IgbmV4dCBwYXRoIHNlZ21lbnQuXG4gICAgcm91dGUgKz0gc3RyaWN0ICYmIGVuZHNXaXRoU2xhc2ggPyAnJyA6ICcoPz1cXFxcL3wkKSc7XG4gIH1cblxuICByZXR1cm4gYXR0YWNoS2V5cyhuZXcgUmVnRXhwKCdeJyArIHJvdXRlLCBmbGFncyhvcHRpb25zKSksIGtleXMpO1xufVxuXG59LHtcImlzYXJyYXlcIjoxfV0sMTU6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHNldFRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZHJhaW5RdWV1ZSwgMCk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG5cbn0se31dLDE2OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xudmFyIHBhZCA9IGZ1bmN0aW9uIHBhZChudW0pIHtcbiAgcmV0dXJuIChcIjBcIiArIG51bSkuc2xpY2UoLTIpO1xufTtcblxuLy8gVXNlIHRoZSBuZXcgcGVyZm9ybWFuY2UgYXBpIHRvIGdldCBiZXR0ZXIgcHJlY2lzaW9uIGlmIGF2YWlsYWJsZVxudmFyIHRpbWVyID0gdHlwZW9mIHBlcmZvcm1hbmNlICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBwZXJmb3JtYW5jZS5ub3cgPT09IFwiZnVuY3Rpb25cIiA/IHBlcmZvcm1hbmNlIDogRGF0ZTtcblxuLyoqXG4gKiBDcmVhdGVzIGxvZ2dlciB3aXRoIGZvbGxvd2VkIG9wdGlvbnNcbiAqXG4gKiBAbmFtZXNwYWNlXG4gKiBAcHJvcGVydHkge29iamVjdH0gb3B0aW9ucyAtIG9wdGlvbnMgZm9yIGxvZ2dlclxuICogQHByb3BlcnR5IHtzdHJpbmd9IG9wdGlvbnMubGV2ZWwgLSBjb25zb2xlW2xldmVsXVxuICogQHByb3BlcnR5IHtvYmplY3R9IG9wdGlvbnMubG9nZ2VyIC0gaW1wbGVtZW50YXRpb24gb2YgdGhlIGBjb25zb2xlYCBBUEkuXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IG9wdGlvbnMuY29sbGFwc2VkIC0gaXMgZ3JvdXAgY29sbGFwc2VkP1xuICogQHByb3BlcnR5IHtib29sZWFufSBvcHRpb25zLnByZWRpY2F0ZSAtIGNvbmRpdGlvbiB3aGljaCByZXNvbHZlcyBsb2dnZXIgYmVoYXZpb3JcbiAqIEBwcm9wZXJ0eSB7Ym9vbH0gb3B0aW9ucy5kdXJhdGlvbiAtIHByaW50IGR1cmF0aW9uIG9mIGVhY2ggYWN0aW9uP1xuICogQHByb3BlcnR5IHtib29sfSBvcHRpb25zLnRpbWVzdGFtcCAtIHByaW50IHRpbWVzdGFtcCB3aXRoIGVhY2ggYWN0aW9uP1xuICogQHByb3BlcnR5IHtmdW5jdGlvbn0gb3B0aW9ucy50cmFuc2Zvcm1lciAtIHRyYW5zZm9ybSBzdGF0ZSBiZWZvcmUgcHJpbnRcbiAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb259IG9wdGlvbnMuYWN0aW9uVHJhbnNmb3JtZXIgLSB0cmFuc2Zvcm0gYWN0aW9uIGJlZm9yZSBwcmludFxuICovXG5cbmZ1bmN0aW9uIGNyZWF0ZUxvZ2dlcigpIHtcbiAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1swXTtcblxuICByZXR1cm4gZnVuY3Rpb24gKF9yZWYpIHtcbiAgICB2YXIgZ2V0U3RhdGUgPSBfcmVmLmdldFN0YXRlO1xuICAgIHJldHVybiBmdW5jdGlvbiAobmV4dCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICAgICAgdmFyIGxldmVsID0gb3B0aW9ucy5sZXZlbDtcbiAgICAgICAgdmFyIGxvZ2dlciA9IG9wdGlvbnMubG9nZ2VyO1xuICAgICAgICB2YXIgY29sbGFwc2VkID0gb3B0aW9ucy5jb2xsYXBzZWQ7XG4gICAgICAgIHZhciBwcmVkaWNhdGUgPSBvcHRpb25zLnByZWRpY2F0ZTtcbiAgICAgICAgdmFyIF9vcHRpb25zJGR1cmF0aW9uID0gb3B0aW9ucy5kdXJhdGlvbjtcbiAgICAgICAgdmFyIGR1cmF0aW9uID0gX29wdGlvbnMkZHVyYXRpb24gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogX29wdGlvbnMkZHVyYXRpb247XG4gICAgICAgIHZhciBfb3B0aW9ucyR0aW1lc3RhbXAgPSBvcHRpb25zLnRpbWVzdGFtcDtcbiAgICAgICAgdmFyIHRpbWVzdGFtcCA9IF9vcHRpb25zJHRpbWVzdGFtcCA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IF9vcHRpb25zJHRpbWVzdGFtcDtcbiAgICAgICAgdmFyIF9vcHRpb25zJHRyYW5zZm9ybWVyID0gb3B0aW9ucy50cmFuc2Zvcm1lcjtcbiAgICAgICAgdmFyIHRyYW5zZm9ybWVyID0gX29wdGlvbnMkdHJhbnNmb3JtZXIgPT09IHVuZGVmaW5lZCA/IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgICAgfSA6IF9vcHRpb25zJHRyYW5zZm9ybWVyO1xuICAgICAgICB2YXIgX29wdGlvbnMkYWN0aW9uVHJhbnNmb3JtZXIgPSBvcHRpb25zLmFjdGlvblRyYW5zZm9ybWVyO1xuICAgICAgICB2YXIgYWN0aW9uVHJhbnNmb3JtZXIgPSBfb3B0aW9ucyRhY3Rpb25UcmFuc2Zvcm1lciA9PT0gdW5kZWZpbmVkID8gZnVuY3Rpb24gKGFjdG4pIHtcbiAgICAgICAgICByZXR1cm4gYWN0bjtcbiAgICAgICAgfSA6IF9vcHRpb25zJGFjdGlvblRyYW5zZm9ybWVyO1xuXG4gICAgICAgIHZhciBjb25zb2xlID0gbG9nZ2VyIHx8IHdpbmRvdy5jb25zb2xlO1xuXG4gICAgICAgIC8vIGV4aXQgaWYgY29uc29sZSB1bmRlZmluZWRcbiAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgcmV0dXJuIG5leHQoYWN0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGV4aXQgZWFybHkgaWYgcHJlZGljYXRlIGZ1bmN0aW9uIHJldHVybnMgZmFsc2VcbiAgICAgICAgaWYgKHR5cGVvZiBwcmVkaWNhdGUgPT09IFwiZnVuY3Rpb25cIiAmJiAhcHJlZGljYXRlKGdldFN0YXRlLCBhY3Rpb24pKSB7XG4gICAgICAgICAgcmV0dXJuIG5leHQoYWN0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzdGFydGVkID0gdGltZXIubm93KCk7XG4gICAgICAgIHZhciBwcmV2U3RhdGUgPSB0cmFuc2Zvcm1lcihnZXRTdGF0ZSgpKTtcblxuICAgICAgICB2YXIgcmV0dXJuVmFsdWUgPSBuZXh0KGFjdGlvbik7XG4gICAgICAgIHZhciB0b29rID0gdGltZXIubm93KCkgLSBzdGFydGVkO1xuXG4gICAgICAgIHZhciBuZXh0U3RhdGUgPSB0cmFuc2Zvcm1lcihnZXRTdGF0ZSgpKTtcblxuICAgICAgICAvLyBmb3JtYXR0ZXJzXG4gICAgICAgIHZhciB0aW1lID0gbmV3IERhdGUoKTtcbiAgICAgICAgdmFyIGlzQ29sbGFwc2VkID0gdHlwZW9mIGNvbGxhcHNlZCA9PT0gXCJmdW5jdGlvblwiID8gY29sbGFwc2VkKGdldFN0YXRlLCBhY3Rpb24pIDogY29sbGFwc2VkO1xuXG4gICAgICAgIHZhciBmb3JtYXR0ZWRUaW1lID0gdGltZXN0YW1wID8gXCIgQCBcIiArIHRpbWUuZ2V0SG91cnMoKSArIFwiOlwiICsgcGFkKHRpbWUuZ2V0TWludXRlcygpKSArIFwiOlwiICsgcGFkKHRpbWUuZ2V0U2Vjb25kcygpKSA6IFwiXCI7XG4gICAgICAgIHZhciBmb3JtYXR0ZWREdXJhdGlvbiA9IGR1cmF0aW9uID8gXCIgaW4gXCIgKyB0b29rLnRvRml4ZWQoMikgKyBcIiBtc1wiIDogXCJcIjtcbiAgICAgICAgdmFyIGZvcm1hdHRlZEFjdGlvbiA9IGFjdGlvblRyYW5zZm9ybWVyKGFjdGlvbik7XG4gICAgICAgIHZhciBtZXNzYWdlID0gXCJhY3Rpb24gXCIgKyBmb3JtYXR0ZWRBY3Rpb24udHlwZSArIGZvcm1hdHRlZFRpbWUgKyBmb3JtYXR0ZWREdXJhdGlvbjtcblxuICAgICAgICAvLyByZW5kZXJcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpc0NvbGxhcHNlZCA/IGNvbnNvbGUuZ3JvdXBDb2xsYXBzZWQobWVzc2FnZSkgOiBjb25zb2xlLmdyb3VwKG1lc3NhZ2UpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY29uc29sZS5sb2cobWVzc2FnZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobGV2ZWwpIHtcbiAgICAgICAgICBjb25zb2xlW2xldmVsXShcIiVjIHByZXYgc3RhdGVcIiwgXCJjb2xvcjogIzlFOUU5RTsgZm9udC13ZWlnaHQ6IGJvbGRcIiwgcHJldlN0YXRlKTtcbiAgICAgICAgICBjb25zb2xlW2xldmVsXShcIiVjIGFjdGlvblwiLCBcImNvbG9yOiAjMDNBOUY0OyBmb250LXdlaWdodDogYm9sZFwiLCBmb3JtYXR0ZWRBY3Rpb24pO1xuICAgICAgICAgIGNvbnNvbGVbbGV2ZWxdKFwiJWMgbmV4dCBzdGF0ZVwiLCBcImNvbG9yOiAjNENBRjUwOyBmb250LXdlaWdodDogYm9sZFwiLCBuZXh0U3RhdGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiJWMgcHJldiBzdGF0ZVwiLCBcImNvbG9yOiAjOUU5RTlFOyBmb250LXdlaWdodDogYm9sZFwiLCBwcmV2U3RhdGUpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiJWMgYWN0aW9uXCIsIFwiY29sb3I6ICMwM0E5RjQ7IGZvbnQtd2VpZ2h0OiBib2xkXCIsIGZvcm1hdHRlZEFjdGlvbik7XG4gICAgICAgICAgY29uc29sZS5sb2coXCIlYyBuZXh0IHN0YXRlXCIsIFwiY29sb3I6ICM0Q0FGNTA7IGZvbnQtd2VpZ2h0OiBib2xkXCIsIG5leHRTdGF0ZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnNvbGUuZ3JvdXBFbmQoKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwi4oCU4oCUIGxvZyBlbmQg4oCU4oCUXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICAgICAgfTtcbiAgICB9O1xuICB9O1xufVxuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IGNyZWF0ZUxvZ2dlcjtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1tcImRlZmF1bHRcIl07XG59LHt9XSwxNzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzWydkZWZhdWx0J10gPSB0aHVua01pZGRsZXdhcmU7XG5cbmZ1bmN0aW9uIHRodW5rTWlkZGxld2FyZShfcmVmKSB7XG4gIHZhciBkaXNwYXRjaCA9IF9yZWYuZGlzcGF0Y2g7XG4gIHZhciBnZXRTdGF0ZSA9IF9yZWYuZ2V0U3RhdGU7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChuZXh0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICAgIHJldHVybiB0eXBlb2YgYWN0aW9uID09PSAnZnVuY3Rpb24nID8gYWN0aW9uKGRpc3BhdGNoLCBnZXRTdGF0ZSkgOiBuZXh0KGFjdGlvbik7XG4gICAgfTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG59LHt9XSwxODpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzWydkZWZhdWx0J10gPSBjcmVhdGVTdG9yZTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX3V0aWxzSXNQbGFpbk9iamVjdCA9IHJlcXVpcmUoJy4vdXRpbHMvaXNQbGFpbk9iamVjdCcpO1xuXG52YXIgX3V0aWxzSXNQbGFpbk9iamVjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF91dGlsc0lzUGxhaW5PYmplY3QpO1xuXG4vKipcbiAqIFRoZXNlIGFyZSBwcml2YXRlIGFjdGlvbiB0eXBlcyByZXNlcnZlZCBieSBSZWR1eC5cbiAqIEZvciBhbnkgdW5rbm93biBhY3Rpb25zLCB5b3UgbXVzdCByZXR1cm4gdGhlIGN1cnJlbnQgc3RhdGUuXG4gKiBJZiB0aGUgY3VycmVudCBzdGF0ZSBpcyB1bmRlZmluZWQsIHlvdSBtdXN0IHJldHVybiB0aGUgaW5pdGlhbCBzdGF0ZS5cbiAqIERvIG5vdCByZWZlcmVuY2UgdGhlc2UgYWN0aW9uIHR5cGVzIGRpcmVjdGx5IGluIHlvdXIgY29kZS5cbiAqL1xudmFyIEFjdGlvblR5cGVzID0ge1xuICBJTklUOiAnQEByZWR1eC9JTklUJ1xufTtcblxuZXhwb3J0cy5BY3Rpb25UeXBlcyA9IEFjdGlvblR5cGVzO1xuLyoqXG4gKiBDcmVhdGVzIGEgUmVkdXggc3RvcmUgdGhhdCBob2xkcyB0aGUgc3RhdGUgdHJlZS5cbiAqIFRoZSBvbmx5IHdheSB0byBjaGFuZ2UgdGhlIGRhdGEgaW4gdGhlIHN0b3JlIGlzIHRvIGNhbGwgYGRpc3BhdGNoKClgIG9uIGl0LlxuICpcbiAqIFRoZXJlIHNob3VsZCBvbmx5IGJlIGEgc2luZ2xlIHN0b3JlIGluIHlvdXIgYXBwLiBUbyBzcGVjaWZ5IGhvdyBkaWZmZXJlbnRcbiAqIHBhcnRzIG9mIHRoZSBzdGF0ZSB0cmVlIHJlc3BvbmQgdG8gYWN0aW9ucywgeW91IG1heSBjb21iaW5lIHNldmVyYWwgcmVkdWNlcnNcbiAqIGludG8gYSBzaW5nbGUgcmVkdWNlciBmdW5jdGlvbiBieSB1c2luZyBgY29tYmluZVJlZHVjZXJzYC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWR1Y2VyIEEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBuZXh0IHN0YXRlIHRyZWUsIGdpdmVuXG4gKiB0aGUgY3VycmVudCBzdGF0ZSB0cmVlIGFuZCB0aGUgYWN0aW9uIHRvIGhhbmRsZS5cbiAqXG4gKiBAcGFyYW0ge2FueX0gW2luaXRpYWxTdGF0ZV0gVGhlIGluaXRpYWwgc3RhdGUuIFlvdSBtYXkgb3B0aW9uYWxseSBzcGVjaWZ5IGl0XG4gKiB0byBoeWRyYXRlIHRoZSBzdGF0ZSBmcm9tIHRoZSBzZXJ2ZXIgaW4gdW5pdmVyc2FsIGFwcHMsIG9yIHRvIHJlc3RvcmUgYVxuICogcHJldmlvdXNseSBzZXJpYWxpemVkIHVzZXIgc2Vzc2lvbi5cbiAqIElmIHlvdSB1c2UgYGNvbWJpbmVSZWR1Y2Vyc2AgdG8gcHJvZHVjZSB0aGUgcm9vdCByZWR1Y2VyIGZ1bmN0aW9uLCB0aGlzIG11c3QgYmVcbiAqIGFuIG9iamVjdCB3aXRoIHRoZSBzYW1lIHNoYXBlIGFzIGBjb21iaW5lUmVkdWNlcnNgIGtleXMuXG4gKlxuICogQHJldHVybnMge1N0b3JlfSBBIFJlZHV4IHN0b3JlIHRoYXQgbGV0cyB5b3UgcmVhZCB0aGUgc3RhdGUsIGRpc3BhdGNoIGFjdGlvbnNcbiAqIGFuZCBzdWJzY3JpYmUgdG8gY2hhbmdlcy5cbiAqL1xuXG5mdW5jdGlvbiBjcmVhdGVTdG9yZShyZWR1Y2VyLCBpbml0aWFsU3RhdGUpIHtcbiAgaWYgKHR5cGVvZiByZWR1Y2VyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCB0aGUgcmVkdWNlciB0byBiZSBhIGZ1bmN0aW9uLicpO1xuICB9XG5cbiAgdmFyIGN1cnJlbnRSZWR1Y2VyID0gcmVkdWNlcjtcbiAgdmFyIGN1cnJlbnRTdGF0ZSA9IGluaXRpYWxTdGF0ZTtcbiAgdmFyIGxpc3RlbmVycyA9IFtdO1xuICB2YXIgaXNEaXNwYXRjaGluZyA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBSZWFkcyB0aGUgc3RhdGUgdHJlZSBtYW5hZ2VkIGJ5IHRoZSBzdG9yZS5cbiAgICpcbiAgICogQHJldHVybnMge2FueX0gVGhlIGN1cnJlbnQgc3RhdGUgdHJlZSBvZiB5b3VyIGFwcGxpY2F0aW9uLlxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0U3RhdGUoKSB7XG4gICAgcmV0dXJuIGN1cnJlbnRTdGF0ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgY2hhbmdlIGxpc3RlbmVyLiBJdCB3aWxsIGJlIGNhbGxlZCBhbnkgdGltZSBhbiBhY3Rpb24gaXMgZGlzcGF0Y2hlZCxcbiAgICogYW5kIHNvbWUgcGFydCBvZiB0aGUgc3RhdGUgdHJlZSBtYXkgcG90ZW50aWFsbHkgaGF2ZSBjaGFuZ2VkLiBZb3UgbWF5IHRoZW5cbiAgICogY2FsbCBgZ2V0U3RhdGUoKWAgdG8gcmVhZCB0aGUgY3VycmVudCBzdGF0ZSB0cmVlIGluc2lkZSB0aGUgY2FsbGJhY2suXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIEEgY2FsbGJhY2sgdG8gYmUgaW52b2tlZCBvbiBldmVyeSBkaXNwYXRjaC5cbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSBBIGZ1bmN0aW9uIHRvIHJlbW92ZSB0aGlzIGNoYW5nZSBsaXN0ZW5lci5cbiAgICovXG4gIGZ1bmN0aW9uIHN1YnNjcmliZShsaXN0ZW5lcikge1xuICAgIGxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcblxuICAgIHJldHVybiBmdW5jdGlvbiB1bnN1YnNjcmliZSgpIHtcbiAgICAgIHZhciBpbmRleCA9IGxpc3RlbmVycy5pbmRleE9mKGxpc3RlbmVyKTtcbiAgICAgIGxpc3RlbmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2hlcyBhbiBhY3Rpb24uIEl0IGlzIHRoZSBvbmx5IHdheSB0byB0cmlnZ2VyIGEgc3RhdGUgY2hhbmdlLlxuICAgKlxuICAgKiBUaGUgYHJlZHVjZXJgIGZ1bmN0aW9uLCB1c2VkIHRvIGNyZWF0ZSB0aGUgc3RvcmUsIHdpbGwgYmUgY2FsbGVkIHdpdGggdGhlXG4gICAqIGN1cnJlbnQgc3RhdGUgdHJlZSBhbmQgdGhlIGdpdmVuIGBhY3Rpb25gLiBJdHMgcmV0dXJuIHZhbHVlIHdpbGxcbiAgICogYmUgY29uc2lkZXJlZCB0aGUgKipuZXh0Kiogc3RhdGUgb2YgdGhlIHRyZWUsIGFuZCB0aGUgY2hhbmdlIGxpc3RlbmVyc1xuICAgKiB3aWxsIGJlIG5vdGlmaWVkLlxuICAgKlxuICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvbmx5IHN1cHBvcnRzIHBsYWluIG9iamVjdCBhY3Rpb25zLiBJZiB5b3Ugd2FudCB0b1xuICAgKiBkaXNwYXRjaCBhIFByb21pc2UsIGFuIE9ic2VydmFibGUsIGEgdGh1bmssIG9yIHNvbWV0aGluZyBlbHNlLCB5b3UgbmVlZCB0b1xuICAgKiB3cmFwIHlvdXIgc3RvcmUgY3JlYXRpbmcgZnVuY3Rpb24gaW50byB0aGUgY29ycmVzcG9uZGluZyBtaWRkbGV3YXJlLiBGb3JcbiAgICogZXhhbXBsZSwgc2VlIHRoZSBkb2N1bWVudGF0aW9uIGZvciB0aGUgYHJlZHV4LXRodW5rYCBwYWNrYWdlLiBFdmVuIHRoZVxuICAgKiBtaWRkbGV3YXJlIHdpbGwgZXZlbnR1YWxseSBkaXNwYXRjaCBwbGFpbiBvYmplY3QgYWN0aW9ucyB1c2luZyB0aGlzIG1ldGhvZC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGFjdGlvbiBBIHBsYWluIG9iamVjdCByZXByZXNlbnRpbmcg4oCcd2hhdCBjaGFuZ2Vk4oCdLiBJdCBpc1xuICAgKiBhIGdvb2QgaWRlYSB0byBrZWVwIGFjdGlvbnMgc2VyaWFsaXphYmxlIHNvIHlvdSBjYW4gcmVjb3JkIGFuZCByZXBsYXkgdXNlclxuICAgKiBzZXNzaW9ucywgb3IgdXNlIHRoZSB0aW1lIHRyYXZlbGxpbmcgYHJlZHV4LWRldnRvb2xzYC4gQW4gYWN0aW9uIG11c3QgaGF2ZVxuICAgKiBhIGB0eXBlYCBwcm9wZXJ0eSB3aGljaCBtYXkgbm90IGJlIGB1bmRlZmluZWRgLiBJdCBpcyBhIGdvb2QgaWRlYSB0byB1c2VcbiAgICogc3RyaW5nIGNvbnN0YW50cyBmb3IgYWN0aW9uIHR5cGVzLlxuICAgKlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBGb3IgY29udmVuaWVuY2UsIHRoZSBzYW1lIGFjdGlvbiBvYmplY3QgeW91IGRpc3BhdGNoZWQuXG4gICAqXG4gICAqIE5vdGUgdGhhdCwgaWYgeW91IHVzZSBhIGN1c3RvbSBtaWRkbGV3YXJlLCBpdCBtYXkgd3JhcCBgZGlzcGF0Y2goKWAgdG9cbiAgICogcmV0dXJuIHNvbWV0aGluZyBlbHNlIChmb3IgZXhhbXBsZSwgYSBQcm9taXNlIHlvdSBjYW4gYXdhaXQpLlxuICAgKi9cbiAgZnVuY3Rpb24gZGlzcGF0Y2goYWN0aW9uKSB7XG4gICAgaWYgKCFfdXRpbHNJc1BsYWluT2JqZWN0MlsnZGVmYXVsdCddKGFjdGlvbikpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQWN0aW9ucyBtdXN0IGJlIHBsYWluIG9iamVjdHMuICcgKyAnVXNlIGN1c3RvbSBtaWRkbGV3YXJlIGZvciBhc3luYyBhY3Rpb25zLicpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgYWN0aW9uLnR5cGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FjdGlvbnMgbWF5IG5vdCBoYXZlIGFuIHVuZGVmaW5lZCBcInR5cGVcIiBwcm9wZXJ0eS4gJyArICdIYXZlIHlvdSBtaXNzcGVsbGVkIGEgY29uc3RhbnQ/Jyk7XG4gICAgfVxuXG4gICAgaWYgKGlzRGlzcGF0Y2hpbmcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmVkdWNlcnMgbWF5IG5vdCBkaXNwYXRjaCBhY3Rpb25zLicpO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBpc0Rpc3BhdGNoaW5nID0gdHJ1ZTtcbiAgICAgIGN1cnJlbnRTdGF0ZSA9IGN1cnJlbnRSZWR1Y2VyKGN1cnJlbnRTdGF0ZSwgYWN0aW9uKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaXNEaXNwYXRjaGluZyA9IGZhbHNlO1xuICAgIH1cblxuICAgIGxpc3RlbmVycy5zbGljZSgpLmZvckVhY2goZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgICByZXR1cm4gbGlzdGVuZXIoKTtcbiAgICB9KTtcbiAgICByZXR1cm4gYWN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcGxhY2VzIHRoZSByZWR1Y2VyIGN1cnJlbnRseSB1c2VkIGJ5IHRoZSBzdG9yZSB0byBjYWxjdWxhdGUgdGhlIHN0YXRlLlxuICAgKlxuICAgKiBZb3UgbWlnaHQgbmVlZCB0aGlzIGlmIHlvdXIgYXBwIGltcGxlbWVudHMgY29kZSBzcGxpdHRpbmcgYW5kIHlvdSB3YW50IHRvXG4gICAqIGxvYWQgc29tZSBvZiB0aGUgcmVkdWNlcnMgZHluYW1pY2FsbHkuIFlvdSBtaWdodCBhbHNvIG5lZWQgdGhpcyBpZiB5b3VcbiAgICogaW1wbGVtZW50IGEgaG90IHJlbG9hZGluZyBtZWNoYW5pc20gZm9yIFJlZHV4LlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBuZXh0UmVkdWNlciBUaGUgcmVkdWNlciBmb3IgdGhlIHN0b3JlIHRvIHVzZSBpbnN0ZWFkLlxuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIGZ1bmN0aW9uIHJlcGxhY2VSZWR1Y2VyKG5leHRSZWR1Y2VyKSB7XG4gICAgY3VycmVudFJlZHVjZXIgPSBuZXh0UmVkdWNlcjtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IEFjdGlvblR5cGVzLklOSVQgfSk7XG4gIH1cblxuICAvLyBXaGVuIGEgc3RvcmUgaXMgY3JlYXRlZCwgYW4gXCJJTklUXCIgYWN0aW9uIGlzIGRpc3BhdGNoZWQgc28gdGhhdCBldmVyeVxuICAvLyByZWR1Y2VyIHJldHVybnMgdGhlaXIgaW5pdGlhbCBzdGF0ZS4gVGhpcyBlZmZlY3RpdmVseSBwb3B1bGF0ZXNcbiAgLy8gdGhlIGluaXRpYWwgc3RhdGUgdHJlZS5cbiAgZGlzcGF0Y2goeyB0eXBlOiBBY3Rpb25UeXBlcy5JTklUIH0pO1xuXG4gIHJldHVybiB7XG4gICAgZGlzcGF0Y2g6IGRpc3BhdGNoLFxuICAgIHN1YnNjcmliZTogc3Vic2NyaWJlLFxuICAgIGdldFN0YXRlOiBnZXRTdGF0ZSxcbiAgICByZXBsYWNlUmVkdWNlcjogcmVwbGFjZVJlZHVjZXJcbiAgfTtcbn1cbn0se1wiLi91dGlscy9pc1BsYWluT2JqZWN0XCI6MjR9XSwxOTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9jcmVhdGVTdG9yZSA9IHJlcXVpcmUoJy4vY3JlYXRlU3RvcmUnKTtcblxudmFyIF9jcmVhdGVTdG9yZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jcmVhdGVTdG9yZSk7XG5cbnZhciBfdXRpbHNDb21iaW5lUmVkdWNlcnMgPSByZXF1aXJlKCcuL3V0aWxzL2NvbWJpbmVSZWR1Y2VycycpO1xuXG52YXIgX3V0aWxzQ29tYmluZVJlZHVjZXJzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3V0aWxzQ29tYmluZVJlZHVjZXJzKTtcblxudmFyIF91dGlsc0JpbmRBY3Rpb25DcmVhdG9ycyA9IHJlcXVpcmUoJy4vdXRpbHMvYmluZEFjdGlvbkNyZWF0b3JzJyk7XG5cbnZhciBfdXRpbHNCaW5kQWN0aW9uQ3JlYXRvcnMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdXRpbHNCaW5kQWN0aW9uQ3JlYXRvcnMpO1xuXG52YXIgX3V0aWxzQXBwbHlNaWRkbGV3YXJlID0gcmVxdWlyZSgnLi91dGlscy9hcHBseU1pZGRsZXdhcmUnKTtcblxudmFyIF91dGlsc0FwcGx5TWlkZGxld2FyZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF91dGlsc0FwcGx5TWlkZGxld2FyZSk7XG5cbnZhciBfdXRpbHNDb21wb3NlID0gcmVxdWlyZSgnLi91dGlscy9jb21wb3NlJyk7XG5cbnZhciBfdXRpbHNDb21wb3NlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3V0aWxzQ29tcG9zZSk7XG5cbmV4cG9ydHMuY3JlYXRlU3RvcmUgPSBfY3JlYXRlU3RvcmUyWydkZWZhdWx0J107XG5leHBvcnRzLmNvbWJpbmVSZWR1Y2VycyA9IF91dGlsc0NvbWJpbmVSZWR1Y2VyczJbJ2RlZmF1bHQnXTtcbmV4cG9ydHMuYmluZEFjdGlvbkNyZWF0b3JzID0gX3V0aWxzQmluZEFjdGlvbkNyZWF0b3JzMlsnZGVmYXVsdCddO1xuZXhwb3J0cy5hcHBseU1pZGRsZXdhcmUgPSBfdXRpbHNBcHBseU1pZGRsZXdhcmUyWydkZWZhdWx0J107XG5leHBvcnRzLmNvbXBvc2UgPSBfdXRpbHNDb21wb3NlMlsnZGVmYXVsdCddO1xufSx7XCIuL2NyZWF0ZVN0b3JlXCI6MTgsXCIuL3V0aWxzL2FwcGx5TWlkZGxld2FyZVwiOjIwLFwiLi91dGlscy9iaW5kQWN0aW9uQ3JlYXRvcnNcIjoyMSxcIi4vdXRpbHMvY29tYmluZVJlZHVjZXJzXCI6MjIsXCIuL3V0aWxzL2NvbXBvc2VcIjoyM31dLDIwOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gYXBwbHlNaWRkbGV3YXJlO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfY29tcG9zZSA9IHJlcXVpcmUoJy4vY29tcG9zZScpO1xuXG52YXIgX2NvbXBvc2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY29tcG9zZSk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIHN0b3JlIGVuaGFuY2VyIHRoYXQgYXBwbGllcyBtaWRkbGV3YXJlIHRvIHRoZSBkaXNwYXRjaCBtZXRob2RcbiAqIG9mIHRoZSBSZWR1eCBzdG9yZS4gVGhpcyBpcyBoYW5keSBmb3IgYSB2YXJpZXR5IG9mIHRhc2tzLCBzdWNoIGFzIGV4cHJlc3NpbmdcbiAqIGFzeW5jaHJvbm91cyBhY3Rpb25zIGluIGEgY29uY2lzZSBtYW5uZXIsIG9yIGxvZ2dpbmcgZXZlcnkgYWN0aW9uIHBheWxvYWQuXG4gKlxuICogU2VlIGByZWR1eC10aHVua2AgcGFja2FnZSBhcyBhbiBleGFtcGxlIG9mIHRoZSBSZWR1eCBtaWRkbGV3YXJlLlxuICpcbiAqIEJlY2F1c2UgbWlkZGxld2FyZSBpcyBwb3RlbnRpYWxseSBhc3luY2hyb25vdXMsIHRoaXMgc2hvdWxkIGJlIHRoZSBmaXJzdFxuICogc3RvcmUgZW5oYW5jZXIgaW4gdGhlIGNvbXBvc2l0aW9uIGNoYWluLlxuICpcbiAqIE5vdGUgdGhhdCBlYWNoIG1pZGRsZXdhcmUgd2lsbCBiZSBnaXZlbiB0aGUgYGRpc3BhdGNoYCBhbmQgYGdldFN0YXRlYCBmdW5jdGlvbnNcbiAqIGFzIG5hbWVkIGFyZ3VtZW50cy5cbiAqXG4gKiBAcGFyYW0gey4uLkZ1bmN0aW9ufSBtaWRkbGV3YXJlcyBUaGUgbWlkZGxld2FyZSBjaGFpbiB0byBiZSBhcHBsaWVkLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBBIHN0b3JlIGVuaGFuY2VyIGFwcGx5aW5nIHRoZSBtaWRkbGV3YXJlLlxuICovXG5cbmZ1bmN0aW9uIGFwcGx5TWlkZGxld2FyZSgpIHtcbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIG1pZGRsZXdhcmVzID0gQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgbWlkZGxld2FyZXNbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKG5leHQpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHJlZHVjZXIsIGluaXRpYWxTdGF0ZSkge1xuICAgICAgdmFyIHN0b3JlID0gbmV4dChyZWR1Y2VyLCBpbml0aWFsU3RhdGUpO1xuICAgICAgdmFyIF9kaXNwYXRjaCA9IHN0b3JlLmRpc3BhdGNoO1xuICAgICAgdmFyIGNoYWluID0gW107XG5cbiAgICAgIHZhciBtaWRkbGV3YXJlQVBJID0ge1xuICAgICAgICBnZXRTdGF0ZTogc3RvcmUuZ2V0U3RhdGUsXG4gICAgICAgIGRpc3BhdGNoOiBmdW5jdGlvbiBkaXNwYXRjaChhY3Rpb24pIHtcbiAgICAgICAgICByZXR1cm4gX2Rpc3BhdGNoKGFjdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBjaGFpbiA9IG1pZGRsZXdhcmVzLm1hcChmdW5jdGlvbiAobWlkZGxld2FyZSkge1xuICAgICAgICByZXR1cm4gbWlkZGxld2FyZShtaWRkbGV3YXJlQVBJKTtcbiAgICAgIH0pO1xuICAgICAgX2Rpc3BhdGNoID0gX2NvbXBvc2UyWydkZWZhdWx0J10uYXBwbHkodW5kZWZpbmVkLCBjaGFpbikoc3RvcmUuZGlzcGF0Y2gpO1xuXG4gICAgICByZXR1cm4gX2V4dGVuZHMoe30sIHN0b3JlLCB7XG4gICAgICAgIGRpc3BhdGNoOiBfZGlzcGF0Y2hcbiAgICAgIH0pO1xuICAgIH07XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xufSx7XCIuL2NvbXBvc2VcIjoyM31dLDIxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGJpbmRBY3Rpb25DcmVhdG9ycztcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX3V0aWxzTWFwVmFsdWVzID0gcmVxdWlyZSgnLi4vdXRpbHMvbWFwVmFsdWVzJyk7XG5cbnZhciBfdXRpbHNNYXBWYWx1ZXMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdXRpbHNNYXBWYWx1ZXMpO1xuXG5mdW5jdGlvbiBiaW5kQWN0aW9uQ3JlYXRvcihhY3Rpb25DcmVhdG9yLCBkaXNwYXRjaCkge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBkaXNwYXRjaChhY3Rpb25DcmVhdG9yLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKSk7XG4gIH07XG59XG5cbi8qKlxuICogVHVybnMgYW4gb2JqZWN0IHdob3NlIHZhbHVlcyBhcmUgYWN0aW9uIGNyZWF0b3JzLCBpbnRvIGFuIG9iamVjdCB3aXRoIHRoZVxuICogc2FtZSBrZXlzLCBidXQgd2l0aCBldmVyeSBmdW5jdGlvbiB3cmFwcGVkIGludG8gYSBgZGlzcGF0Y2hgIGNhbGwgc28gdGhleVxuICogbWF5IGJlIGludm9rZWQgZGlyZWN0bHkuIFRoaXMgaXMganVzdCBhIGNvbnZlbmllbmNlIG1ldGhvZCwgYXMgeW91IGNhbiBjYWxsXG4gKiBgc3RvcmUuZGlzcGF0Y2goTXlBY3Rpb25DcmVhdG9ycy5kb1NvbWV0aGluZygpKWAgeW91cnNlbGYganVzdCBmaW5lLlxuICpcbiAqIEZvciBjb252ZW5pZW5jZSwgeW91IGNhbiBhbHNvIHBhc3MgYSBzaW5nbGUgZnVuY3Rpb24gYXMgdGhlIGZpcnN0IGFyZ3VtZW50LFxuICogYW5kIGdldCBhIGZ1bmN0aW9uIGluIHJldHVybi5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufE9iamVjdH0gYWN0aW9uQ3JlYXRvcnMgQW4gb2JqZWN0IHdob3NlIHZhbHVlcyBhcmUgYWN0aW9uXG4gKiBjcmVhdG9yIGZ1bmN0aW9ucy4gT25lIGhhbmR5IHdheSB0byBvYnRhaW4gaXQgaXMgdG8gdXNlIEVTNiBgaW1wb3J0ICogYXNgXG4gKiBzeW50YXguIFlvdSBtYXkgYWxzbyBwYXNzIGEgc2luZ2xlIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGRpc3BhdGNoIFRoZSBgZGlzcGF0Y2hgIGZ1bmN0aW9uIGF2YWlsYWJsZSBvbiB5b3VyIFJlZHV4XG4gKiBzdG9yZS5cbiAqXG4gKiBAcmV0dXJucyB7RnVuY3Rpb258T2JqZWN0fSBUaGUgb2JqZWN0IG1pbWlja2luZyB0aGUgb3JpZ2luYWwgb2JqZWN0LCBidXQgd2l0aFxuICogZXZlcnkgYWN0aW9uIGNyZWF0b3Igd3JhcHBlZCBpbnRvIHRoZSBgZGlzcGF0Y2hgIGNhbGwuIElmIHlvdSBwYXNzZWQgYVxuICogZnVuY3Rpb24gYXMgYGFjdGlvbkNyZWF0b3JzYCwgdGhlIHJldHVybiB2YWx1ZSB3aWxsIGFsc28gYmUgYSBzaW5nbGVcbiAqIGZ1bmN0aW9uLlxuICovXG5cbmZ1bmN0aW9uIGJpbmRBY3Rpb25DcmVhdG9ycyhhY3Rpb25DcmVhdG9ycywgZGlzcGF0Y2gpIHtcbiAgaWYgKHR5cGVvZiBhY3Rpb25DcmVhdG9ycyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBiaW5kQWN0aW9uQ3JlYXRvcihhY3Rpb25DcmVhdG9ycywgZGlzcGF0Y2gpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBhY3Rpb25DcmVhdG9ycyAhPT0gJ29iamVjdCcgfHwgYWN0aW9uQ3JlYXRvcnMgPT09IG51bGwgfHwgYWN0aW9uQ3JlYXRvcnMgPT09IHVuZGVmaW5lZCkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tZXEtbnVsbFxuICAgIHRocm93IG5ldyBFcnJvcignYmluZEFjdGlvbkNyZWF0b3JzIGV4cGVjdGVkIGFuIG9iamVjdCBvciBhIGZ1bmN0aW9uLCBpbnN0ZWFkIHJlY2VpdmVkICcgKyAoYWN0aW9uQ3JlYXRvcnMgPT09IG51bGwgPyAnbnVsbCcgOiB0eXBlb2YgYWN0aW9uQ3JlYXRvcnMpICsgJy4gJyArICdEaWQgeW91IHdyaXRlIFwiaW1wb3J0IEFjdGlvbkNyZWF0b3JzIGZyb21cIiBpbnN0ZWFkIG9mIFwiaW1wb3J0ICogYXMgQWN0aW9uQ3JlYXRvcnMgZnJvbVwiPycpO1xuICB9XG5cbiAgcmV0dXJuIF91dGlsc01hcFZhbHVlczJbJ2RlZmF1bHQnXShhY3Rpb25DcmVhdG9ycywgZnVuY3Rpb24gKGFjdGlvbkNyZWF0b3IpIHtcbiAgICByZXR1cm4gYmluZEFjdGlvbkNyZWF0b3IoYWN0aW9uQ3JlYXRvciwgZGlzcGF0Y2gpO1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG59LHtcIi4uL3V0aWxzL21hcFZhbHVlc1wiOjI1fV0sMjI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuKGZ1bmN0aW9uIChwcm9jZXNzKXtcbid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGNvbWJpbmVSZWR1Y2VycztcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX2NyZWF0ZVN0b3JlID0gcmVxdWlyZSgnLi4vY3JlYXRlU3RvcmUnKTtcblxudmFyIF91dGlsc0lzUGxhaW5PYmplY3QgPSByZXF1aXJlKCcuLi91dGlscy9pc1BsYWluT2JqZWN0Jyk7XG5cbnZhciBfdXRpbHNJc1BsYWluT2JqZWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3V0aWxzSXNQbGFpbk9iamVjdCk7XG5cbnZhciBfdXRpbHNNYXBWYWx1ZXMgPSByZXF1aXJlKCcuLi91dGlscy9tYXBWYWx1ZXMnKTtcblxudmFyIF91dGlsc01hcFZhbHVlczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF91dGlsc01hcFZhbHVlcyk7XG5cbnZhciBfdXRpbHNQaWNrID0gcmVxdWlyZSgnLi4vdXRpbHMvcGljaycpO1xuXG52YXIgX3V0aWxzUGljazIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF91dGlsc1BpY2spO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG5cbmZ1bmN0aW9uIGdldFVuZGVmaW5lZFN0YXRlRXJyb3JNZXNzYWdlKGtleSwgYWN0aW9uKSB7XG4gIHZhciBhY3Rpb25UeXBlID0gYWN0aW9uICYmIGFjdGlvbi50eXBlO1xuICB2YXIgYWN0aW9uTmFtZSA9IGFjdGlvblR5cGUgJiYgJ1wiJyArIGFjdGlvblR5cGUudG9TdHJpbmcoKSArICdcIicgfHwgJ2FuIGFjdGlvbic7XG5cbiAgcmV0dXJuICdSZWR1Y2VyIFwiJyArIGtleSArICdcIiByZXR1cm5lZCB1bmRlZmluZWQgaGFuZGxpbmcgJyArIGFjdGlvbk5hbWUgKyAnLiAnICsgJ1RvIGlnbm9yZSBhbiBhY3Rpb24sIHlvdSBtdXN0IGV4cGxpY2l0bHkgcmV0dXJuIHRoZSBwcmV2aW91cyBzdGF0ZS4nO1xufVxuXG5mdW5jdGlvbiBnZXRVbmV4cGVjdGVkU3RhdGVLZXlXYXJuaW5nTWVzc2FnZShpbnB1dFN0YXRlLCBvdXRwdXRTdGF0ZSwgYWN0aW9uKSB7XG4gIHZhciByZWR1Y2VyS2V5cyA9IE9iamVjdC5rZXlzKG91dHB1dFN0YXRlKTtcbiAgdmFyIGFyZ3VtZW50TmFtZSA9IGFjdGlvbiAmJiBhY3Rpb24udHlwZSA9PT0gX2NyZWF0ZVN0b3JlLkFjdGlvblR5cGVzLklOSVQgPyAnaW5pdGlhbFN0YXRlIGFyZ3VtZW50IHBhc3NlZCB0byBjcmVhdGVTdG9yZScgOiAncHJldmlvdXMgc3RhdGUgcmVjZWl2ZWQgYnkgdGhlIHJlZHVjZXInO1xuXG4gIGlmIChyZWR1Y2VyS2V5cy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gJ1N0b3JlIGRvZXMgbm90IGhhdmUgYSB2YWxpZCByZWR1Y2VyLiBNYWtlIHN1cmUgdGhlIGFyZ3VtZW50IHBhc3NlZCAnICsgJ3RvIGNvbWJpbmVSZWR1Y2VycyBpcyBhbiBvYmplY3Qgd2hvc2UgdmFsdWVzIGFyZSByZWR1Y2Vycy4nO1xuICB9XG5cbiAgaWYgKCFfdXRpbHNJc1BsYWluT2JqZWN0MlsnZGVmYXVsdCddKGlucHV0U3RhdGUpKSB7XG4gICAgcmV0dXJuICdUaGUgJyArIGFyZ3VtZW50TmFtZSArICcgaGFzIHVuZXhwZWN0ZWQgdHlwZSBvZiBcIicgKyAoe30pLnRvU3RyaW5nLmNhbGwoaW5wdXRTdGF0ZSkubWF0Y2goL1xccyhbYS16fEEtWl0rKS8pWzFdICsgJ1wiLiBFeHBlY3RlZCBhcmd1bWVudCB0byBiZSBhbiBvYmplY3Qgd2l0aCB0aGUgZm9sbG93aW5nICcgKyAoJ2tleXM6IFwiJyArIHJlZHVjZXJLZXlzLmpvaW4oJ1wiLCBcIicpICsgJ1wiJyk7XG4gIH1cblxuICB2YXIgdW5leHBlY3RlZEtleXMgPSBPYmplY3Qua2V5cyhpbnB1dFN0YXRlKS5maWx0ZXIoZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiByZWR1Y2VyS2V5cy5pbmRleE9mKGtleSkgPCAwO1xuICB9KTtcblxuICBpZiAodW5leHBlY3RlZEtleXMubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiAnVW5leHBlY3RlZCAnICsgKHVuZXhwZWN0ZWRLZXlzLmxlbmd0aCA+IDEgPyAna2V5cycgOiAna2V5JykgKyAnICcgKyAoJ1wiJyArIHVuZXhwZWN0ZWRLZXlzLmpvaW4oJ1wiLCBcIicpICsgJ1wiIGZvdW5kIGluICcgKyBhcmd1bWVudE5hbWUgKyAnLiAnKSArICdFeHBlY3RlZCB0byBmaW5kIG9uZSBvZiB0aGUga25vd24gcmVkdWNlciBrZXlzIGluc3RlYWQ6ICcgKyAoJ1wiJyArIHJlZHVjZXJLZXlzLmpvaW4oJ1wiLCBcIicpICsgJ1wiLiBVbmV4cGVjdGVkIGtleXMgd2lsbCBiZSBpZ25vcmVkLicpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGFzc2VydFJlZHVjZXJTYW5pdHkocmVkdWNlcnMpIHtcbiAgT2JqZWN0LmtleXMocmVkdWNlcnMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIHZhciByZWR1Y2VyID0gcmVkdWNlcnNba2V5XTtcbiAgICB2YXIgaW5pdGlhbFN0YXRlID0gcmVkdWNlcih1bmRlZmluZWQsIHsgdHlwZTogX2NyZWF0ZVN0b3JlLkFjdGlvblR5cGVzLklOSVQgfSk7XG5cbiAgICBpZiAodHlwZW9mIGluaXRpYWxTdGF0ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmVkdWNlciBcIicgKyBrZXkgKyAnXCIgcmV0dXJuZWQgdW5kZWZpbmVkIGR1cmluZyBpbml0aWFsaXphdGlvbi4gJyArICdJZiB0aGUgc3RhdGUgcGFzc2VkIHRvIHRoZSByZWR1Y2VyIGlzIHVuZGVmaW5lZCwgeW91IG11c3QgJyArICdleHBsaWNpdGx5IHJldHVybiB0aGUgaW5pdGlhbCBzdGF0ZS4gVGhlIGluaXRpYWwgc3RhdGUgbWF5ICcgKyAnbm90IGJlIHVuZGVmaW5lZC4nKTtcbiAgICB9XG5cbiAgICB2YXIgdHlwZSA9ICdAQHJlZHV4L1BST0JFX1VOS05PV05fQUNUSU9OXycgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoNykuc3BsaXQoJycpLmpvaW4oJy4nKTtcbiAgICBpZiAodHlwZW9mIHJlZHVjZXIodW5kZWZpbmVkLCB7IHR5cGU6IHR5cGUgfSkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlZHVjZXIgXCInICsga2V5ICsgJ1wiIHJldHVybmVkIHVuZGVmaW5lZCB3aGVuIHByb2JlZCB3aXRoIGEgcmFuZG9tIHR5cGUuICcgKyAoJ0RvblxcJ3QgdHJ5IHRvIGhhbmRsZSAnICsgX2NyZWF0ZVN0b3JlLkFjdGlvblR5cGVzLklOSVQgKyAnIG9yIG90aGVyIGFjdGlvbnMgaW4gXCJyZWR1eC8qXCIgJykgKyAnbmFtZXNwYWNlLiBUaGV5IGFyZSBjb25zaWRlcmVkIHByaXZhdGUuIEluc3RlYWQsIHlvdSBtdXN0IHJldHVybiB0aGUgJyArICdjdXJyZW50IHN0YXRlIGZvciBhbnkgdW5rbm93biBhY3Rpb25zLCB1bmxlc3MgaXQgaXMgdW5kZWZpbmVkLCAnICsgJ2luIHdoaWNoIGNhc2UgeW91IG11c3QgcmV0dXJuIHRoZSBpbml0aWFsIHN0YXRlLCByZWdhcmRsZXNzIG9mIHRoZSAnICsgJ2FjdGlvbiB0eXBlLiBUaGUgaW5pdGlhbCBzdGF0ZSBtYXkgbm90IGJlIHVuZGVmaW5lZC4nKTtcbiAgICB9XG4gIH0pO1xufVxuXG4vKipcbiAqIFR1cm5zIGFuIG9iamVjdCB3aG9zZSB2YWx1ZXMgYXJlIGRpZmZlcmVudCByZWR1Y2VyIGZ1bmN0aW9ucywgaW50byBhIHNpbmdsZVxuICogcmVkdWNlciBmdW5jdGlvbi4gSXQgd2lsbCBjYWxsIGV2ZXJ5IGNoaWxkIHJlZHVjZXIsIGFuZCBnYXRoZXIgdGhlaXIgcmVzdWx0c1xuICogaW50byBhIHNpbmdsZSBzdGF0ZSBvYmplY3QsIHdob3NlIGtleXMgY29ycmVzcG9uZCB0byB0aGUga2V5cyBvZiB0aGUgcGFzc2VkXG4gKiByZWR1Y2VyIGZ1bmN0aW9ucy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gcmVkdWNlcnMgQW4gb2JqZWN0IHdob3NlIHZhbHVlcyBjb3JyZXNwb25kIHRvIGRpZmZlcmVudFxuICogcmVkdWNlciBmdW5jdGlvbnMgdGhhdCBuZWVkIHRvIGJlIGNvbWJpbmVkIGludG8gb25lLiBPbmUgaGFuZHkgd2F5IHRvIG9idGFpblxuICogaXQgaXMgdG8gdXNlIEVTNiBgaW1wb3J0ICogYXMgcmVkdWNlcnNgIHN5bnRheC4gVGhlIHJlZHVjZXJzIG1heSBuZXZlciByZXR1cm5cbiAqIHVuZGVmaW5lZCBmb3IgYW55IGFjdGlvbi4gSW5zdGVhZCwgdGhleSBzaG91bGQgcmV0dXJuIHRoZWlyIGluaXRpYWwgc3RhdGVcbiAqIGlmIHRoZSBzdGF0ZSBwYXNzZWQgdG8gdGhlbSB3YXMgdW5kZWZpbmVkLCBhbmQgdGhlIGN1cnJlbnQgc3RhdGUgZm9yIGFueVxuICogdW5yZWNvZ25pemVkIGFjdGlvbi5cbiAqXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IEEgcmVkdWNlciBmdW5jdGlvbiB0aGF0IGludm9rZXMgZXZlcnkgcmVkdWNlciBpbnNpZGUgdGhlXG4gKiBwYXNzZWQgb2JqZWN0LCBhbmQgYnVpbGRzIGEgc3RhdGUgb2JqZWN0IHdpdGggdGhlIHNhbWUgc2hhcGUuXG4gKi9cblxuZnVuY3Rpb24gY29tYmluZVJlZHVjZXJzKHJlZHVjZXJzKSB7XG4gIHZhciBmaW5hbFJlZHVjZXJzID0gX3V0aWxzUGljazJbJ2RlZmF1bHQnXShyZWR1Y2VycywgZnVuY3Rpb24gKHZhbCkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsID09PSAnZnVuY3Rpb24nO1xuICB9KTtcbiAgdmFyIHNhbml0eUVycm9yO1xuXG4gIHRyeSB7XG4gICAgYXNzZXJ0UmVkdWNlclNhbml0eShmaW5hbFJlZHVjZXJzKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHNhbml0eUVycm9yID0gZTtcbiAgfVxuXG4gIHZhciBkZWZhdWx0U3RhdGUgPSBfdXRpbHNNYXBWYWx1ZXMyWydkZWZhdWx0J10oZmluYWxSZWR1Y2VycywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH0pO1xuXG4gIHJldHVybiBmdW5jdGlvbiBjb21iaW5hdGlvbihzdGF0ZSwgYWN0aW9uKSB7XG4gICAgaWYgKHN0YXRlID09PSB1bmRlZmluZWQpIHN0YXRlID0gZGVmYXVsdFN0YXRlO1xuXG4gICAgaWYgKHNhbml0eUVycm9yKSB7XG4gICAgICB0aHJvdyBzYW5pdHlFcnJvcjtcbiAgICB9XG5cbiAgICB2YXIgZmluYWxTdGF0ZSA9IF91dGlsc01hcFZhbHVlczJbJ2RlZmF1bHQnXShmaW5hbFJlZHVjZXJzLCBmdW5jdGlvbiAocmVkdWNlciwga2V5KSB7XG4gICAgICB2YXIgbmV3U3RhdGUgPSByZWR1Y2VyKHN0YXRlW2tleV0sIGFjdGlvbik7XG4gICAgICBpZiAodHlwZW9mIG5ld1N0YXRlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB2YXIgZXJyb3JNZXNzYWdlID0gZ2V0VW5kZWZpbmVkU3RhdGVFcnJvck1lc3NhZ2Uoa2V5LCBhY3Rpb24pO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3JNZXNzYWdlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXdTdGF0ZTtcbiAgICB9KTtcblxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICB2YXIgd2FybmluZ01lc3NhZ2UgPSBnZXRVbmV4cGVjdGVkU3RhdGVLZXlXYXJuaW5nTWVzc2FnZShzdGF0ZSwgZmluYWxTdGF0ZSwgYWN0aW9uKTtcbiAgICAgIGlmICh3YXJuaW5nTWVzc2FnZSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKHdhcm5pbmdNZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmluYWxTdGF0ZTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG59KS5jYWxsKHRoaXMscmVxdWlyZSgnX3Byb2Nlc3MnKSlcbn0se1wiLi4vY3JlYXRlU3RvcmVcIjoxOCxcIi4uL3V0aWxzL2lzUGxhaW5PYmplY3RcIjoyNCxcIi4uL3V0aWxzL21hcFZhbHVlc1wiOjI1LFwiLi4vdXRpbHMvcGlja1wiOjI2LFwiX3Byb2Nlc3NcIjoxNX1dLDIzOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbi8qKlxuICogQ29tcG9zZXMgc2luZ2xlLWFyZ3VtZW50IGZ1bmN0aW9ucyBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gKlxuICogQHBhcmFtIHsuLi5GdW5jdGlvbn0gZnVuY3MgVGhlIGZ1bmN0aW9ucyB0byBjb21wb3NlLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBBIGZ1bmN0aW9uIG9idGFpbmVkIGJ5IGNvbXBvc2luZyBmdW5jdGlvbnMgZnJvbSByaWdodCB0b1xuICogbGVmdC4gRm9yIGV4YW1wbGUsIGNvbXBvc2UoZiwgZywgaCkgaXMgaWRlbnRpY2FsIHRvIGFyZyA9PiBmKGcoaChhcmcpKSkuXG4gKi9cblwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBjb21wb3NlO1xuXG5mdW5jdGlvbiBjb21wb3NlKCkge1xuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgZnVuY3MgPSBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBmdW5jc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoYXJnKSB7XG4gICAgcmV0dXJuIGZ1bmNzLnJlZHVjZVJpZ2h0KGZ1bmN0aW9uIChjb21wb3NlZCwgZikge1xuICAgICAgcmV0dXJuIGYoY29tcG9zZWQpO1xuICAgIH0sIGFyZyk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1tcImRlZmF1bHRcIl07XG59LHt9XSwyNDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzWydkZWZhdWx0J10gPSBpc1BsYWluT2JqZWN0O1xudmFyIGZuVG9TdHJpbmcgPSBmdW5jdGlvbiBmblRvU3RyaW5nKGZuKSB7XG4gIHJldHVybiBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChmbik7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7YW55fSBvYmogVGhlIG9iamVjdCB0byBpbnNwZWN0LlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIGFyZ3VtZW50IGFwcGVhcnMgdG8gYmUgYSBwbGFpbiBvYmplY3QuXG4gKi9cblxuZnVuY3Rpb24gaXNQbGFpbk9iamVjdChvYmopIHtcbiAgaWYgKCFvYmogfHwgdHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgcHJvdG8gPSB0eXBlb2Ygb2JqLmNvbnN0cnVjdG9yID09PSAnZnVuY3Rpb24nID8gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaikgOiBPYmplY3QucHJvdG90eXBlO1xuXG4gIGlmIChwcm90byA9PT0gbnVsbCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgdmFyIGNvbnN0cnVjdG9yID0gcHJvdG8uY29uc3RydWN0b3I7XG5cbiAgcmV0dXJuIHR5cGVvZiBjb25zdHJ1Y3RvciA9PT0gJ2Z1bmN0aW9uJyAmJiBjb25zdHJ1Y3RvciBpbnN0YW5jZW9mIGNvbnN0cnVjdG9yICYmIGZuVG9TdHJpbmcoY29uc3RydWN0b3IpID09PSBmblRvU3RyaW5nKE9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xufSx7fV0sMjU6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuLyoqXG4gKiBBcHBsaWVzIGEgZnVuY3Rpb24gdG8gZXZlcnkga2V5LXZhbHVlIHBhaXIgaW5zaWRlIGFuIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIG1hcHBlciBmdW5jdGlvbiB0aGF0IHJlY2VpdmVzIHRoZSB2YWx1ZSBhbmQgdGhlIGtleS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IEEgbmV3IG9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZSBtYXBwZWQgdmFsdWVzIGZvciB0aGUga2V5cy5cbiAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IG1hcFZhbHVlcztcblxuZnVuY3Rpb24gbWFwVmFsdWVzKG9iaiwgZm4pIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikucmVkdWNlKGZ1bmN0aW9uIChyZXN1bHQsIGtleSkge1xuICAgIHJlc3VsdFtrZXldID0gZm4ob2JqW2tleV0sIGtleSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSwge30pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdO1xufSx7fV0sMjY6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuLyoqXG4gKiBQaWNrcyBrZXktdmFsdWUgcGFpcnMgZnJvbSBhbiBvYmplY3Qgd2hlcmUgdmFsdWVzIHNhdGlzZnkgYSBwcmVkaWNhdGUuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIHBpY2sgZnJvbS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBwcmVkaWNhdGUgdGhlIHZhbHVlcyBtdXN0IHNhdGlzZnkgdG8gYmUgY29waWVkLlxuICogQHJldHVybnMge09iamVjdH0gVGhlIG9iamVjdCB3aXRoIHRoZSB2YWx1ZXMgdGhhdCBzYXRpc2ZpZWQgdGhlIHByZWRpY2F0ZS5cbiAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHBpY2s7XG5cbmZ1bmN0aW9uIHBpY2sob2JqLCBmbikge1xuICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5yZWR1Y2UoZnVuY3Rpb24gKHJlc3VsdCwga2V5KSB7XG4gICAgaWYgKGZuKG9ialtrZXldKSkge1xuICAgICAgcmVzdWx0W2tleV0gPSBvYmpba2V5XTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSwge30pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdO1xufSx7fV0sMjc6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBTb3VuZENsb3VkIChjbGllbnRJZCkge1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBTb3VuZENsb3VkKSkge1xuICAgICAgICByZXR1cm4gbmV3IFNvdW5kQ2xvdWQoY2xpZW50SWQpO1xuICAgIH1cblxuICAgIGlmICghY2xpZW50SWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTb3VuZENsb3VkIEFQSSBjbGllbnRJZCBpcyByZXF1aXJlZCwgZ2V0IGl0IC0gaHR0cHM6Ly9kZXZlbG9wZXJzLnNvdW5kY2xvdWQuY29tLycpO1xuICAgIH1cblxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gICAgdGhpcy5fY2xpZW50SWQgPSBjbGllbnRJZDtcbiAgICB0aGlzLl9iYXNlVXJsID0gJ2h0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tJztcblxuICAgIHRoaXMucGxheWluZyA9IGZhbHNlO1xuICAgIHRoaXMuZHVyYXRpb24gPSAwO1xuXG4gICAgdGhpcy5hdWRpbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2F1ZGlvJyk7XG59XG5cblNvdW5kQ2xvdWQucHJvdG90eXBlLnJlc29sdmUgPSBmdW5jdGlvbiAodXJsLCBjYWxsYmFjaykge1xuICAgIGlmICghdXJsKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignU291bmRDbG91ZCB0cmFjayBvciBwbGF5bGlzdCB1cmwgaXMgcmVxdWlyZWQnKTtcbiAgICB9XG5cbiAgICB1cmwgPSB0aGlzLl9iYXNlVXJsICsgJy9yZXNvbHZlLmpzb24/dXJsPScgKyB1cmwgKyAnJmNsaWVudF9pZD0nICsgdGhpcy5fY2xpZW50SWQ7XG5cbiAgICB0aGlzLl9qc29ucCh1cmwsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7XG4gICAgICAgICAgICB2YXIgdHJhY2tzID0gZGF0YTtcbiAgICAgICAgICAgIGRhdGEgPSB7dHJhY2tzOiB0cmFja3N9O1xuICAgICAgICAgICAgdGhpcy5fcGxheWxpc3QgPSBkYXRhO1xuICAgICAgICB9IGVsc2UgaWYgKGRhdGEudHJhY2tzKSB7XG4gICAgICAgICAgICB0aGlzLl9wbGF5bGlzdCA9IGRhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl90cmFjayA9IGRhdGE7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmR1cmF0aW9uID0gZGF0YS5kdXJhdGlvbiAmJiAhaXNOYU4oZGF0YS5kdXJhdGlvbikgP1xuICAgICAgICAgICAgZGF0YS5kdXJhdGlvbiAvIDEwMDAgOiAvLyBjb252ZXJ0IHRvIHNlY29uZHNcbiAgICAgICAgICAgIDA7IC8vIG5vIGR1cmF0aW9uIGlzIHplcm9cblxuICAgICAgICBjYWxsYmFjayhkYXRhKTtcbiAgICB9LmJpbmQodGhpcykpO1xuXG59O1xuXG5Tb3VuZENsb3VkLnByb3RvdHlwZS5fanNvbnAgPSBmdW5jdGlvbiAodXJsLCBjYWxsYmFjaykge1xuICAgIHZhciB0YXJnZXQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF0gfHwgZG9jdW1lbnQuaGVhZDtcbiAgICB2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG5cbiAgICB2YXIgaWQgPSAnanNvbnBfY2FsbGJhY2tfJyArIE1hdGgucm91bmQoMTAwMDAwICogTWF0aC5yYW5kb20oKSk7XG4gICAgd2luZG93W2lkXSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIGlmIChzY3JpcHQucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgc2NyaXB0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgfVxuICAgICAgICB3aW5kb3dbaWRdID0gZnVuY3Rpb24gKCkge307XG4gICAgICAgIGNhbGxiYWNrKGRhdGEpO1xuICAgIH07XG5cbiAgICBzY3JpcHQuc3JjID0gdXJsICsgKHVybC5pbmRleE9mKCc/JykgPj0gMCA/ICcmJyA6ICc/JykgKyAnY2FsbGJhY2s9JyArIGlkO1xuICAgIHRhcmdldC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShzY3JpcHQsIHRhcmdldCk7XG59O1xuXG5Tb3VuZENsb3VkLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uIChlLCBmbikge1xuICAgIHRoaXMuX2V2ZW50c1tlXSA9IGZuO1xuICAgIHRoaXMuYXVkaW8uYWRkRXZlbnRMaXN0ZW5lcihlLCBmbiwgZmFsc2UpO1xufTtcblxuU291bmRDbG91ZC5wcm90b3R5cGUub2ZmID0gZnVuY3Rpb24gKGUsIGZuKSB7XG4gICAgdGhpcy5fZXZlbnRzW2VdID0gbnVsbDtcbiAgICB0aGlzLmF1ZGlvLnJlbW92ZUV2ZW50TGlzdGVuZXIoZSwgZm4pO1xufTtcblxuU291bmRDbG91ZC5wcm90b3R5cGUudW5iaW5kQWxsID0gZnVuY3Rpb24gKCkge1xuICAgIGZvciAodmFyIGUgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICAgIHZhciBmbiA9IHRoaXMuX2V2ZW50c1tlXTtcbiAgICAgICAgaWYgKGZuKSB7XG4gICAgICAgICAgICB0aGlzLm9mZihlLCBmbik7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5Tb3VuZENsb3VkLnByb3RvdHlwZS5wcmVsb2FkID0gZnVuY3Rpb24gKHN0cmVhbVVybCkge1xuICAgIHRoaXMuX3RyYWNrID0ge3N0cmVhbV91cmw6IHN0cmVhbVVybH07XG4gICAgdGhpcy5hdWRpby5zcmMgPSBzdHJlYW1VcmwgKyAnP2NsaWVudF9pZD0nICsgdGhpcy5fY2xpZW50SWQ7XG59O1xuXG5Tb3VuZENsb3VkLnByb3RvdHlwZS5wbGF5ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcblxuICAgIHRoaXMuX3BsYXlsaXN0ID0ge1xuICAgICAgICB0cmFja3M6IFtcbiAgICAgICAgICAgIHsgc3RyZWFtX3VybDogJy9hdWRpby9leGl0Lm1wMycgfSxcbiAgICAgICAgICAgIHsgc3RyZWFtX3VybDogJy9hdWRpby9naG9zdC5tcDMnIH0sXG4gICAgICAgICAgICB7IHN0cmVhbV91cmw6ICcvYXVkaW8vc2Vjb25kX3NraW4ubXAzJyB9LFxuICAgICAgICAgICAgeyBzdHJlYW1fdXJsOiAnL2F1ZGlvL3JlZmxlY3Rpb24ubXAzJyB9LFxuICAgICAgICAgICAgeyBzdHJlYW1fdXJsOiAnL2F1ZGlvL2ZhcmV3ZWxsLm1wMycgfSxcbiAgICAgICAgICAgIHsgc3RyZWFtX3VybDogJy9hdWRpby9zdGlsbG5lc3MubXAzJyB9LFxuICAgICAgICAgICAgeyBzdHJlYW1fdXJsOiAnL2F1ZGlvL3lvdW5nX2d1bnMubXAzJyB9LFxuICAgICAgICAgICAgeyBzdHJlYW1fdXJsOiAnL2F1ZGlvL2lubm9jZW50Lm1wMycgfSxcbiAgICAgICAgICAgIHsgc3RyZWFtX3VybDogJy9hdWRpby93YWtlLm1wMycgfVxuICAgICAgICBdXG4gICAgfTtcblxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIHZhciBzcmM7XG5cbiAgICBpZiAob3B0aW9ucy5zdHJlYW1VcmwpIHtcbiAgICAgICAgc3JjID0gb3B0aW9ucy5zdHJlYW1Vcmw7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9wbGF5bGlzdCkge1xuICAgICAgICB2YXIgbGVuZ3RoID0gdGhpcy5fcGxheWxpc3QudHJhY2tzLmxlbmd0aDtcbiAgICAgICAgaWYgKGxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5fcGxheWxpc3RJbmRleCA9IG9wdGlvbnMucGxheWxpc3RJbmRleCB8fCAwO1xuXG4gICAgICAgICAgICAvLyBiZSBzaWxlbnQgaWYgaW5kZXggaXMgb3V0IG9mIHJhbmdlXG4gICAgICAgICAgICBpZiAodGhpcy5fcGxheWxpc3RJbmRleCA+PSBsZW5ndGggfHwgdGhpcy5fcGxheWxpc3RJbmRleCA8IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wbGF5bGlzdEluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzcmMgPSB0aGlzLl9wbGF5bGlzdC50cmFja3NbdGhpcy5fcGxheWxpc3RJbmRleF0uc3RyZWFtX3VybDtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5fdHJhY2spIHtcbiAgICAgICAgc3JjID0gdGhpcy5fdHJhY2suc3RyZWFtX3VybDtcbiAgICB9XG5cbiAgICBpZiAoIXNyYykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZXJlIGlzIG5vIHRyYWNrcyB0byBwbGF5LCB1c2UgYHN0cmVhbVVybGAgb3B0aW9uIG9yIGBsb2FkYCBtZXRob2QnKTtcbiAgICB9XG5cbiAgICBzcmMgKz0gJz9jbGllbnRfaWQ9JyArIHRoaXMuX2NsaWVudElkO1xuXG4gICAgaWYgKHNyYyAhPT0gdGhpcy5hdWRpby5zcmMpIHtcbiAgICAgICAgdGhpcy5hdWRpby5zcmMgPSBzcmM7XG4gICAgfVxuXG4gICAgdGhpcy5wbGF5aW5nID0gc3JjO1xuICAgIHRoaXMuYXVkaW8ucGxheSgpO1xufTtcblxuU291bmRDbG91ZC5wcm90b3R5cGUucGF1c2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5hdWRpby5wYXVzZSgpO1xuICAgIHRoaXMucGxheWluZyA9IGZhbHNlO1xufTtcblxuU291bmRDbG91ZC5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmF1ZGlvLnBhdXNlKCk7XG4gICAgdGhpcy5hdWRpby5jdXJyZW50VGltZSA9IDA7XG4gICAgdGhpcy5wbGF5aW5nID0gZmFsc2U7XG59O1xuXG5Tb3VuZENsb3VkLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB0cmFja3NMZW5ndGggPSB0aGlzLl9wbGF5bGlzdC50cmFja3MubGVuZ3RoO1xuICAgIGlmICh0aGlzLl9wbGF5bGlzdEluZGV4ID49IHRyYWNrc0xlbmd0aCAtIDEpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5fcGxheWxpc3QgJiYgdHJhY2tzTGVuZ3RoKSB7XG4gICAgICAgIHRoaXMucGxheSh7cGxheWxpc3RJbmRleDogKyt0aGlzLl9wbGF5bGlzdEluZGV4fSk7XG4gICAgfVxufTtcblxuU291bmRDbG91ZC5wcm90b3R5cGUucHJldmlvdXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuX3BsYXlsaXN0SW5kZXggPD0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLl9wbGF5bGlzdCAmJiB0aGlzLl9wbGF5bGlzdC50cmFja3MubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMucGxheSh7cGxheWxpc3RJbmRleDogLS10aGlzLl9wbGF5bGlzdEluZGV4fSk7XG4gICAgfVxufTtcblxuU291bmRDbG91ZC5wcm90b3R5cGUuc2VlayA9IGZ1bmN0aW9uIChlKSB7XG4gICAgaWYgKCF0aGlzLmF1ZGlvLnJlYWR5U3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YXIgcGVyY2VudCA9IGUub2Zmc2V0WCAvIGUudGFyZ2V0Lm9mZnNldFdpZHRoIHx8IChlLmxheWVyWCAtIGUudGFyZ2V0Lm9mZnNldExlZnQpIC8gZS50YXJnZXQub2Zmc2V0V2lkdGg7XG4gICAgdGhpcy5hdWRpby5jdXJyZW50VGltZSA9IHBlcmNlbnQgKiAodGhpcy5hdWRpby5kdXJhdGlvbiB8fCAwKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU291bmRDbG91ZDtcblxufSx7fV0sMjg6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5mZXRjaFRyYWNrcyA9IGZldGNoVHJhY2tzO1xuZXhwb3J0cy5wbGF5ID0gcGxheTtcbmV4cG9ydHMucmVzdW1lID0gcmVzdW1lO1xuZXhwb3J0cy5wYXVzZSA9IHBhdXNlO1xuZXhwb3J0cy5wcmV2ID0gcHJldjtcbmV4cG9ydHMubmV4dCA9IG5leHQ7XG5leHBvcnRzLmVuZCA9IGVuZDtcbmV4cG9ydHMuY2hhbmdlQmFja2dyb3VuZCA9IGNoYW5nZUJhY2tncm91bmQ7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9zb3VuZGNsb3VkQXVkaW8gPSByZXF1aXJlKCdzb3VuZGNsb3VkLWF1ZGlvJyk7XG5cbnZhciBfc291bmRjbG91ZEF1ZGlvMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3NvdW5kY2xvdWRBdWRpbyk7XG5cbnZhciBfY29uc3RhbnRzID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKTtcblxudmFyIEZFVENIX1RSQUNLUyA9ICdGRVRDSF9UUkFDS1MnO1xuZXhwb3J0cy5GRVRDSF9UUkFDS1MgPSBGRVRDSF9UUkFDS1M7XG52YXIgRkVUQ0hfVFJBQ0tTX0VSUk9SID0gJ0ZFVENIX1RSQUNLU19FUlJPUic7XG5leHBvcnRzLkZFVENIX1RSQUNLU19FUlJPUiA9IEZFVENIX1RSQUNLU19FUlJPUjtcbnZhciBGRVRDSF9UUkFDS1NfU1VDQ0VTUyA9ICdGRVRDSF9UUkFDS1NfU1VDQ0VTUyc7XG5cbmV4cG9ydHMuRkVUQ0hfVFJBQ0tTX1NVQ0NFU1MgPSBGRVRDSF9UUkFDS1NfU1VDQ0VTUztcblxuZnVuY3Rpb24gZmV0Y2hUcmFja3MocGxheWVyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkaXNwYXRjaCkge1xuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IEZFVENIX1RSQUNLUyB9KTtcblxuICAgICAgICBwbGF5ZXIucmVzb2x2ZShfY29uc3RhbnRzLlJFU09MVkVfVVJMLCBmdW5jdGlvbiAocGxheWxpc3QpIHtcbiAgICAgICAgICAgIGlmICghcGxheWxpc3QpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGlzcGF0Y2goe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBGRVRDSF9UUkFDS1NfRVJST1IsXG4gICAgICAgICAgICAgICAgICAgIHBheWxvYWQ6IGVyclxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZGlzcGF0Y2goe1xuICAgICAgICAgICAgICAgIHR5cGU6IEZFVENIX1RSQUNLU19TVUNDRVNTLFxuICAgICAgICAgICAgICAgIHBheWxvYWQ6IHBsYXllclxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG59XG5cbnZhciBQTEFZID0gJ1BMQVknO1xuZXhwb3J0cy5QTEFZID0gUExBWTtcbnZhciBQQVVTRSA9ICdQQVVTRSc7XG5leHBvcnRzLlBBVVNFID0gUEFVU0U7XG52YXIgUFJFViA9ICdQUkVWJztcbmV4cG9ydHMuUFJFViA9IFBSRVY7XG52YXIgTkVYVCA9ICdORVhUJztcbmV4cG9ydHMuTkVYVCA9IE5FWFQ7XG52YXIgRU5EID0gJ0VORCc7XG5cbmV4cG9ydHMuRU5EID0gRU5EO1xuXG5mdW5jdGlvbiBwbGF5KHBsYXllciwgaW5kZXgpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGRpc3BhdGNoLCBnZXRTdGF0ZSkge1xuICAgICAgICB2YXIgdHJhY2tJbmRleCA9IGluZGV4ICE9PSB1bmRlZmluZWQgPyBpbmRleCA6IGdldFN0YXRlKCkuY3VycmVudFRyYWNrSW5kZXg7XG4gICAgICAgIHBsYXllci5wbGF5KHsgcGxheWxpc3RJbmRleDogdHJhY2tJbmRleCB9KTtcblxuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IFBMQVksIHBheWxvYWQ6IHBsYXllciB9KTtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiByZXN1bWUocGxheWVyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkaXNwYXRjaCkge1xuICAgICAgICBwbGF5ZXIuYXVkaW8ucGxheSgpO1xuXG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogUExBWSwgcGF5bG9hZDogcGxheWVyIH0pO1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIHBhdXNlKHBsYXllcikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZGlzcGF0Y2gpIHtcbiAgICAgICAgcGxheWVyLnBhdXNlKCk7XG5cbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBQQVVTRSwgcGF5bG9hZDogcGxheWVyIH0pO1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIHByZXYocGxheWVyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkaXNwYXRjaCkge1xuICAgICAgICBwbGF5ZXIucHJldmlvdXMoKTtcblxuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IFBSRVYsIHBheWxvYWQ6IHBsYXllciB9KTtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBuZXh0KHBsYXllcikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZGlzcGF0Y2gpIHtcbiAgICAgICAgcGxheWVyLm5leHQoKTtcblxuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IE5FWFQsIHBheWxvYWQ6IHBsYXllciB9KTtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBlbmQocGxheWVyKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogRU5ELFxuICAgICAgICBwYXlsb2FkOiBwbGF5ZXJcbiAgICB9O1xufVxuXG52YXIgQ0hBTkdFX0JBQ0tHUk9VTkQgPSAnQ0hBTkdFX0JBQ0tHUk9VTkQnO1xuXG5leHBvcnRzLkNIQU5HRV9CQUNLR1JPVU5EID0gQ0hBTkdFX0JBQ0tHUk9VTkQ7XG5cbmZ1bmN0aW9uIGNoYW5nZUJhY2tncm91bmQoX3JlZikge1xuICAgIHZhciBodWUgPSBfcmVmLmh1ZTtcbiAgICB2YXIgc2F0dXJhdGlvbiA9IF9yZWYuc2F0dXJhdGlvbjtcbiAgICB2YXIgbGlnaHRuZXNzID0gX3JlZi5saWdodG5lc3M7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBDSEFOR0VfQkFDS0dST1VORCxcbiAgICAgICAgcGF5bG9hZDoge1xuICAgICAgICAgICAgaHVlOiBodWUsXG4gICAgICAgICAgICBzYXR1cmF0aW9uOiBzYXR1cmF0aW9uLFxuICAgICAgICAgICAgbGlnaHRuZXNzOiBsaWdodG5lc3NcbiAgICAgICAgfVxuICAgIH07XG59XG5cbn0se1wiLi9jb25zdGFudHNcIjozMCxcInNvdW5kY2xvdWQtYXVkaW9cIjoyN31dLDI5OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX3NvdW5kY2xvdWRBdWRpbyA9IHJlcXVpcmUoJ3NvdW5kY2xvdWQtYXVkaW8nKTtcblxudmFyIF9zb3VuZGNsb3VkQXVkaW8yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc291bmRjbG91ZEF1ZGlvKTtcblxudmFyIF9yZWR1eCA9IHJlcXVpcmUoJ3JlZHV4Jyk7XG5cbnZhciBfcmVkdXhMb2dnZXIgPSByZXF1aXJlKCdyZWR1eC1sb2dnZXInKTtcblxudmFyIF9yZWR1eExvZ2dlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWR1eExvZ2dlcik7XG5cbnZhciBfcmVkdXhUaHVuayA9IHJlcXVpcmUoJ3JlZHV4LXRodW5rJyk7XG5cbnZhciBfcmVkdXhUaHVuazIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWR1eFRodW5rKTtcblxudmFyIF9yZWR1Y2VyID0gcmVxdWlyZSgnLi9yZWR1Y2VyJyk7XG5cbnZhciBfcmVkdWNlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWR1Y2VyKTtcblxudmFyIF9hY3Rpb25zID0gcmVxdWlyZSgnLi9hY3Rpb25zJyk7XG5cbnZhciBfY29uc3RhbnRzID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKTtcblxudmFyIF9kb20gPSByZXF1aXJlKCcuL2RvbScpO1xuXG52YXIgX3Zpc3VhbGl6ZXIgPSByZXF1aXJlKCcuL3Zpc3VhbGl6ZXInKTtcblxudmFyIF92aXN1YWxpemVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Zpc3VhbGl6ZXIpO1xuXG52YXIgX3JvdXRlciA9IHJlcXVpcmUoJy4vcm91dGVyJyk7XG5cbnZhciBfcm91dGVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JvdXRlcik7XG5cbnZhciBsb2dnZXIgPSAoMCwgX3JlZHV4TG9nZ2VyMlsnZGVmYXVsdCddKSgpO1xudmFyIHN0b3JlID0gKDAsIF9yZWR1eC5hcHBseU1pZGRsZXdhcmUpKF9yZWR1eFRodW5rMlsnZGVmYXVsdCddLCBsb2dnZXIpKF9yZWR1eC5jcmVhdGVTdG9yZSkoX3JlZHVjZXIyWydkZWZhdWx0J10pO1xudmFyIHBsYXllciA9IG5ldyBfc291bmRjbG91ZEF1ZGlvMlsnZGVmYXVsdCddKF9jb25zdGFudHMuQ0xJRU5UX0lEKTtcblxuc3RvcmUuZGlzcGF0Y2goKDAsIF9hY3Rpb25zLmZldGNoVHJhY2tzKShwbGF5ZXIpKTtcblxuKDAsIF9kb20uYmluZEV2ZW50cykocGxheWVyLCBzdG9yZS5kaXNwYXRjaCwgc3RvcmUuZ2V0U3RhdGUpO1xuKDAsIF9kb20uYmluZENsYXNzZXMpKHBsYXllciwgc3RvcmUpO1xuXG4oMCwgX3Zpc3VhbGl6ZXIyWydkZWZhdWx0J10pKHBsYXllciwgc3RvcmUpO1xuXG59LHtcIi4vYWN0aW9uc1wiOjI4LFwiLi9jb25zdGFudHNcIjozMCxcIi4vZG9tXCI6MzEsXCIuL3JlZHVjZXJcIjozMixcIi4vcm91dGVyXCI6MzMsXCIuL3Zpc3VhbGl6ZXJcIjozNSxcInJlZHV4XCI6MTksXCJyZWR1eC1sb2dnZXJcIjoxNixcInJlZHV4LXRodW5rXCI6MTcsXCJzb3VuZGNsb3VkLWF1ZGlvXCI6Mjd9XSwzMDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbnZhciBSRVNPTFZFX1VSTCA9IFwiaHR0cHM6Ly9zb3VuZGNsb3VkLmNvbS90aGVhaXJvbmVhcnRoL3NldHMvdGVzdFwiO1xuZXhwb3J0cy5SRVNPTFZFX1VSTCA9IFJFU09MVkVfVVJMO1xudmFyIENMSUVOVF9JRCA9IFwiMjg3ZTBhNDcwYWNlZWM3ZDUwNWFiNDFlMTg5MmZkZGNcIjtcbmV4cG9ydHMuQ0xJRU5UX0lEID0gQ0xJRU5UX0lEO1xuXG59LHt9XSwzMTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmJpbmRFdmVudHMgPSBiaW5kRXZlbnRzO1xuZXhwb3J0cy5iaW5kQ2xhc3NlcyA9IGJpbmRDbGFzc2VzO1xuXG52YXIgX2FjdGlvbnMgPSByZXF1aXJlKCcuL2FjdGlvbnMnKTtcblxudmFyIHBsYXlCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGxheScpO1xudmFyIHBhdXNlQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhdXNlJyk7XG52YXIgbmV4dEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXh0Jyk7XG52YXIgcHJldkJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcmV2Jyk7XG52YXIgcGxheWVyRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdGVuJyk7XG52YXIgc2NydWJiZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2NydWJiZXInKTtcbnZhciBzY3J1YmJlclBsYXllZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzY3J1YmJlcl9fcGxheWVkJyk7XG52YXIgb3ZlcmxheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvdmVybGF5Jyk7XG52YXIgYm9keSA9IGRvY3VtZW50LmJvZHk7XG52YXIgbmF2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25hdicpO1xudmFyIHBhZ2VOYXZzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc3VibmF2ID4gbGkgPiBhJykpO1xudmFyIG5hdlRyYWNrbGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduYXYtdHJhY2tsaXN0Jyk7XG52YXIgdHJhY2tMaXN0ID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudHJhY2tsaXN0JykpO1xudmFyIHNlY3Rpb25zID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2VjdGlvbicpKTtcblxuZnVuY3Rpb24gZ2V0SW5kZXgobGkpIHtcbiAgICB2YXIgY2hpbGRyZW4gPSBBcnJheS5mcm9tKGxpLnBhcmVudE5vZGUuY2hpbGRyZW4pO1xuXG4gICAgcmV0dXJuIGNoaWxkcmVuLmluZGV4T2YobGkpO1xufVxuXG5mdW5jdGlvbiBzZXRBY3RpdmVTZWN0aW9uKGlkKSB7XG4gICAgdmFyIGNsYXNzTGlzdCA9IEFycmF5LmZyb20oYm9keS5jbGFzc0xpc3QpLmZpbmQoZnVuY3Rpb24gKGNscykge1xuICAgICAgICByZXR1cm4gKC8tLWFjdGl2ZS8udGVzdChjbHMpXG4gICAgICAgICk7XG4gICAgfSk7XG5cbiAgICBib2R5LmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NMaXN0KTtcbiAgICBib2R5LmNsYXNzTGlzdC5hZGQoaWQgKyAnLS1hY3RpdmUnKTtcbn1cblxuZnVuY3Rpb24gYWN0aXZhdGVFbChlbHMsIGZpbHRlckZuKSB7XG4gICAgZWxzLm1hcChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgICAgIHJldHVybiBlbDtcbiAgICB9KS5maWx0ZXIoZmlsdGVyRm4pLm1hcChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgZWwuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgIHJldHVybiBlbDtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gYmluZEV2ZW50cyhwbGF5ZXIsIGRpc3BhdGNoLCBnZXRTdGF0ZSkge1xuXG4gICAgcGxheWVyLm9uKCdlbmRlZCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciB0cmFja0xpc3QgPSBwbGF5ZXIuX3BsYXlsaXN0O1xuICAgICAgICB2YXIgY3VycmVudFRyYWNrSW5kZXggPSBnZXRTdGF0ZSgpLmN1cnJlbnRUcmFja0luZGV4O1xuXG4gICAgICAgIGlmIChjdXJyZW50VHJhY2tJbmRleCArIDEgPj0gdHJhY2tMaXN0Lmxlbmd0aCkge1xuICAgICAgICAgICAgZGlzcGF0Y2goKDAsIF9hY3Rpb25zLmVuZCkocGxheWVyKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL2Rpc3BhdGNoKGVuZChwbGF5ZXIpKTtcbiAgICAgICAgICAgIGRpc3BhdGNoKCgwLCBfYWN0aW9ucy5uZXh0KShwbGF5ZXIpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcGxheWVyLm9uKCd0aW1ldXBkYXRlJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIGR1cmF0aW9uID0gcGxheWVyLmF1ZGlvLmR1cmF0aW9uO1xuICAgICAgICB2YXIgY3VycmVudFRpbWUgPSBwbGF5ZXIuYXVkaW8uY3VycmVudFRpbWU7XG4gICAgICAgIHZhciBwZXJjZW50ID0gY3VycmVudFRpbWUgLyBkdXJhdGlvbiAqIDEwMDtcbiAgICAgICAgc2NydWJiZXJQbGF5ZWQuc3R5bGUud2lkdGggPSBwZXJjZW50ICsgJyUnO1xuICAgIH0pO1xuXG4gICAgcGxheUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciBzdGF0ZSA9IGdldFN0YXRlKCk7XG4gICAgICAgIHZhciBpc1BsYXlpbmcgPSBzdGF0ZS5pc1BsYXlpbmc7XG4gICAgICAgIHZhciBpc1BhdXNlZCA9IHN0YXRlLmlzUGF1c2VkO1xuXG4gICAgICAgIGlmIChpc1BhdXNlZCkge1xuICAgICAgICAgICAgZGlzcGF0Y2goKDAsIF9hY3Rpb25zLnJlc3VtZSkocGxheWVyKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoIWlzUGxheWluZykge1xuICAgICAgICAgICAgZGlzcGF0Y2goKDAsIF9hY3Rpb25zLnBsYXkpKHBsYXllcikpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBwYXVzZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciBpc1BsYXlpbmcgPSBnZXRTdGF0ZSgpLmlzUGxheWluZztcblxuICAgICAgICBpZiAoaXNQbGF5aW5nKSB7XG4gICAgICAgICAgICBkaXNwYXRjaCgoMCwgX2FjdGlvbnMucGF1c2UpKHBsYXllcikpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBuZXh0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZGlzcGF0Y2goKDAsIF9hY3Rpb25zLm5leHQpKHBsYXllcikpO1xuICAgIH0pO1xuXG4gICAgcHJldkJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGRpc3BhdGNoKCgwLCBfYWN0aW9ucy5wcmV2KShwbGF5ZXIpKTtcbiAgICB9KTtcblxuICAgIHNjcnViYmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIG9mZnNldCA9IGUub2Zmc2V0WDtcbiAgICAgICAgdmFyIHdpZHRoID0gc2NydWJiZXIub2Zmc2V0V2lkdGg7XG4gICAgICAgIHZhciBwZXJjZW50ID0gb2Zmc2V0IC8gd2lkdGg7XG4gICAgICAgIHBsYXllci5hdWRpby5jdXJyZW50VGltZSA9IHBlcmNlbnQgKiAocGxheWVyLmF1ZGlvLmR1cmF0aW9uIHx8IDApO1xuICAgIH0pO1xuXG4gICAgbmF2VHJhY2tsaXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKGUudGFyZ2V0ICYmIGUudGFyZ2V0Lm5vZGVOYW1lID09PSAnQScpIHtcbiAgICAgICAgICAgIHZhciB0YXJnZXQgPSBlLnRhcmdldDtcbiAgICAgICAgICAgIHZhciBwYXJlbnROb2RlID0gdGFyZ2V0LnBhcmVudE5vZGU7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSBnZXRJbmRleChwYXJlbnROb2RlKTtcblxuICAgICAgICAgICAgZGlzcGF0Y2goKDAsIF9hY3Rpb25zLnBsYXkpKHBsYXllciwgaW5kZXgpKTtcblxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgbmF2LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKGUudGFyZ2V0ICYmIGUudGFyZ2V0Lm5vZGVOYW1lID09PSAnQScpIHtcbiAgICAgICAgICAgIHZhciBoYXNoID0gZS50YXJnZXQuaGFzaDtcbiAgICAgICAgICAgIHZhciBpZCA9IGhhc2ggJiYgaGFzaC5zbGljZSgxKSB8fCAnbGlzdGVuJztcblxuICAgICAgICAgICAgLy9hY3RpdmF0ZUVsKHBhZ2VOYXZzLCBlbCA9PiBlbC5oYXNoID09PSBoYXNoKTtcbiAgICAgICAgICAgIC8vYWN0aXZhdGVFbChzZWN0aW9ucywgZWwgPT4gZWwuZ2V0QXR0cmlidXRlKCdpZCcpID09PSBpZCk7XG4gICAgICAgICAgICBzZXRBY3RpdmVTZWN0aW9uKGlkKTtcblxuICAgICAgICAgICAgaWYgKHdpbmRvdy5oaXN0b3J5KSB7XG4gICAgICAgICAgICAgICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHsgYWN0aXZlU2VjdGlvbjogaWQgfSwgbnVsbCwgaGFzaCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIGFjdGl2ZVNlY3Rpb24gPSBlLnN0YXRlLmFjdGl2ZVNlY3Rpb247XG5cbiAgICAgICAgaWYgKGFjdGl2ZVNlY3Rpb24pIHtcbiAgICAgICAgICAgIHNldEFjdGl2ZVNlY3Rpb24oYWN0aXZlU2VjdGlvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXRBY3RpdmVTZWN0aW9uKCdsaXN0ZW4nKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKGRvY3VtZW50LmxvY2F0aW9uLmhhc2gpIHtcbiAgICAgICAgdmFyIGhhc2ggPSBkb2N1bWVudC5sb2NhdGlvbi5oYXNoO1xuXG4gICAgICAgIHNldEFjdGl2ZVNlY3Rpb24oaGFzaC5zbGljZSgxKSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBiaW5kQ2xhc3NlcyhwbGF5ZXIsIHN0b3JlKSB7XG5cbiAgICBzdG9yZS5zdWJzY3JpYmUoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc3RhdGUgPSBzdG9yZS5nZXRTdGF0ZSgpO1xuICAgICAgICB2YXIgaHVlID0gc3RhdGUuaHVlO1xuICAgICAgICB2YXIgc2F0dXJhdGlvbiA9IHN0YXRlLnNhdHVyYXRpb247XG4gICAgICAgIHZhciBsaWdodG5lc3MgPSBzdGF0ZS5saWdodG5lc3M7XG4gICAgICAgIHZhciBvcGFjaXR5ID0gc3RhdGUub3BhY2l0eTtcbiAgICAgICAgdmFyIGN1cnJlbnRUcmFja0luZGV4ID0gc3RhdGUuY3VycmVudFRyYWNrSW5kZXg7XG5cbiAgICAgICAgb3ZlcmxheS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnaHNsYSgnICsgaHVlICsgJywgJyArIHNhdHVyYXRpb24gKyAnJSwgJyArIGxpZ2h0bmVzcyArICclLCAnICsgb3BhY2l0eSArICcpJztcblxuICAgICAgICAvLy5maWx0ZXIoKGxpc3QsIGlkeCkgPT4ge1xuICAgICAgICAvL2NvbnNvbGUubG9nKGlkeCk7XG4gICAgICAgIC8vaWR4ID09PSBjdXJyZW50VHJhY2tJbmRleDtcbiAgICAgICAgLy99KVxuICAgICAgICAvLy5tYXAobGlzdCA9PiBsaXN0LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpKTtcblxuICAgICAgICBpZiAoc3RhdGUuaXNQbGF5aW5nKSB7XG4gICAgICAgICAgICBwbGF5ZXJFbC5jbGFzc0xpc3QuYWRkKCdpc1BsYXlpbmcnKTtcbiAgICAgICAgICAgIHBsYXllckVsLmNsYXNzTGlzdC5yZW1vdmUoJ2lzUGF1c2VkJyk7XG4gICAgICAgICAgICBzY3J1YmJlci5zdHlsZS53aWR0aCA9ICcxMDAlJztcblxuICAgICAgICAgICAgdHJhY2tMaXN0Lm1hcChmdW5jdGlvbiAobGlzdCkge1xuICAgICAgICAgICAgICAgIHZhciBjaGlsZHJlbiA9IEFycmF5LmZyb20obGlzdC5jaGlsZHJlbik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gY2hpbGRyZW4ubWFwKGZ1bmN0aW9uIChsaSkge1xuICAgICAgICAgICAgICAgICAgICBsaS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpO1xuICAgICAgICAgICAgICAgIH0pLmZpbHRlcihmdW5jdGlvbiAobGksIGlkeCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaWR4ID09PSBjdXJyZW50VHJhY2tJbmRleDtcbiAgICAgICAgICAgICAgICB9KS5tYXAoZnVuY3Rpb24gKGxpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsaS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKHN0YXRlLmlzUGF1c2VkKSB7XG4gICAgICAgICAgICBwbGF5ZXJFbC5jbGFzc0xpc3QucmVtb3ZlKCdpc1BsYXlpbmcnKTtcbiAgICAgICAgICAgIHBsYXllckVsLmNsYXNzTGlzdC5hZGQoJ2lzUGF1c2VkJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwbGF5ZXJFbC5jbGFzc0xpc3QucmVtb3ZlKCdpc1BsYXlpbmcnKTtcbiAgICAgICAgICAgIHBsYXllckVsLmNsYXNzTGlzdC5yZW1vdmUoJ2lzUGF1c2VkJyk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxufSx7XCIuL2FjdGlvbnNcIjoyOH1dLDMyOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9hY3Rpb25zID0gcmVxdWlyZSgnLi9hY3Rpb25zJyk7XG5cbnZhciBpbml0aWFsU3RhdGUgPSB7XG4gICAgaXNGZXRjaGluZzogZmFsc2UsXG4gICAgaXNQbGF5aW5nOiBmYWxzZSxcbiAgICBpc1BhdXNlZDogZmFsc2UsXG4gICAgY3VycmVudFRyYWNrSW5kZXg6IDAsXG4gICAgaHVlOiAwLFxuICAgIHNhdHVyYXRpb246IDAsXG4gICAgb3BhY2l0eTogMC42XG59O1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBmdW5jdGlvbiAoc3RhdGUsIGFjdGlvbikge1xuICAgIGlmIChzdGF0ZSA9PT0gdW5kZWZpbmVkKSBzdGF0ZSA9IGluaXRpYWxTdGF0ZTtcblxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICAgICAgY2FzZSBfYWN0aW9ucy5GRVRDSF9UUkFDS1M6XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgICAgICBpc0ZldGNoaW5nOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgY2FzZSBfYWN0aW9ucy5GRVRDSF9UUkFDS1NfRVJST1I6XG4gICAgICAgIGNhc2UgX2FjdGlvbnMuRkVUQ0hfVFJBQ0tTX1NVQ0NFU1M6XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgICAgICBpc0ZldGNoaW5nOiBmYWxzZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIGNhc2UgX2FjdGlvbnMuUExBWTpcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xuICAgICAgICAgICAgICAgIGlzUGxheWluZzogdHJ1ZSxcbiAgICAgICAgICAgICAgICBpc1BhdXNlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgY3VycmVudFRyYWNrSW5kZXg6IGFjdGlvbi5wYXlsb2FkLl9wbGF5bGlzdEluZGV4XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgY2FzZSBfYWN0aW9ucy5QQVVTRTpcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xuICAgICAgICAgICAgICAgIGlzUGxheWluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgaXNQYXVzZWQ6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICBjYXNlIF9hY3Rpb25zLk5FWFQ6XG4gICAgICAgIGNhc2UgX2FjdGlvbnMuUFJFVjpcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRUcmFja0luZGV4OiBhY3Rpb24ucGF5bG9hZC5fcGxheWxpc3RJbmRleCxcbiAgICAgICAgICAgICAgICBpc1BsYXlpbmc6IHRydWUsXG4gICAgICAgICAgICAgICAgaXNQYXVzZWQ6IGZhbHNlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgY2FzZSBfYWN0aW9ucy5FTkQ6XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgICAgICBpc1BsYXlpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGlzUGF1c2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBodWU6IDAsXG4gICAgICAgICAgICAgICAgc2F0dXJhdGlvbjogMCxcbiAgICAgICAgICAgICAgICBjdXJyZW50VHJhY2tJbmRleDogMCxcbiAgICAgICAgICAgICAgICBsaWdodG5lc3M6IDAsXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIGNhc2UgX2FjdGlvbnMuQ0hBTkdFX0JBQ0tHUk9VTkQ6XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgICAgICBodWU6IGFjdGlvbi5wYXlsb2FkLmh1ZSB8fCBzdGF0ZS5odWUsXG4gICAgICAgICAgICAgICAgc2F0dXJhdGlvbjogYWN0aW9uLnBheWxvYWQuc2F0dXJhdGlvbiB8fCBzdGF0ZS5zYXR1cmF0aW9uLFxuICAgICAgICAgICAgICAgIGxpZ2h0bmVzczogYWN0aW9uLnBheWxvYWQubGlnaHRuZXNzIHx8IHN0YXRlLmxpZ2h0bmVzc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG5cbn0se1wiLi9hY3Rpb25zXCI6Mjh9XSwzMzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzWydkZWZhdWx0J10gPSBjcmVhdGVSb3V0ZXI7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9wYWdlID0gcmVxdWlyZSgncGFnZScpO1xuXG52YXIgX3BhZ2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcGFnZSk7XG5cbnZhciBwYWdlTmF2RWxzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc3VibmF2ID4gbGkgPiBhJykpO1xuXG5mdW5jdGlvbiBjcmVhdGVSb3V0ZXIoKSB7XG4gICAgZnVuY3Rpb24gcm91dGUoY3R4LCBuZXh0KSB7XG4gICAgICAgIHZhciBoYXNoID0gY3R4Lmhhc2g7XG5cbiAgICAgICAgcGFnZU5hdkVscy5tYXAoZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIHJldHVybiBlbDtcbiAgICAgICAgfSkuZmlsdGVyKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgcmV0dXJuIGVsLmhyZWYgPSBoYXNoO1xuICAgICAgICB9KS5tYXAoZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgICByZXR1cm4gZWwuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgICgwLCBfcGFnZTJbJ2RlZmF1bHQnXSkoJyonLCByb3V0ZSk7XG4gICAgKDAsIF9wYWdlMlsnZGVmYXVsdCddKSgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcblxufSx7XCJwYWdlXCI6MTN9XSwzNDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9sb2Rhc2hGdW5jdGlvbk9uY2UgPSByZXF1aXJlKCdsb2Rhc2gvZnVuY3Rpb24vb25jZScpO1xuXG52YXIgX2xvZGFzaEZ1bmN0aW9uT25jZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9sb2Rhc2hGdW5jdGlvbk9uY2UpO1xuXG52YXIgX3NwaGVyZSA9IHJlcXVpcmUoJy4vc3BoZXJlJyk7XG5cbnZhciBfc3BoZXJlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3NwaGVyZSk7XG5cbnZhciBfbW91bnRhaW5zID0gcmVxdWlyZSgnLi9tb3VudGFpbnMnKTtcblxudmFyIF9tb3VudGFpbnMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbW91bnRhaW5zKTtcblxudmFyIFBPSU5UUyA9IDI1NjtcbmV4cG9ydHMuUE9JTlRTID0gUE9JTlRTO1xudmFyIElOSVRfUE9JTlRTID0gNTA7XG5leHBvcnRzLklOSVRfUE9JTlRTID0gSU5JVF9QT0lOVFM7XG52YXIgYW1wbGl0dWRlID0gNTtcbmV4cG9ydHMuYW1wbGl0dWRlID0gYW1wbGl0dWRlO1xudmFyIEFOR0xFID0gMTA7XG5leHBvcnRzLkFOR0xFID0gQU5HTEU7XG52YXIgUkFESVVTID0gMTAwO1xuZXhwb3J0cy5SQURJVVMgPSBSQURJVVM7XG52YXIgQ09MT1JfQU1QID0gMC40O1xuXG5leHBvcnRzLkNPTE9SX0FNUCA9IENPTE9SX0FNUDtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IHtcblxuICAgIC8vIEV4aXRcbiAgICBcIjBcIjoge1xuICAgICAgICB2aXN1YWxpemVyOiBfc3BoZXJlMlsnZGVmYXVsdCddLFxuICAgICAgICBodWU6IDMyLFxuICAgICAgICBzYXR1cmF0aW9uOiA1MCxcbiAgICAgICAgbGlnaHRuZXNzOiA4MVxuICAgIH0sXG5cbiAgICAvLyBHaG9zdFxuICAgIFwiMVwiOiB7XG4gICAgICAgIHZpc3VhbGl6ZXI6IF9tb3VudGFpbnMyWydkZWZhdWx0J10sXG4gICAgICAgIGh1ZTogMzAsXG4gICAgICAgIHNhdHVyYXRpb246IDg0LFxuICAgICAgICBsaWdodG5lc3M6IDg0LFxuICAgICAgICBoaXRwb2ludHM6IFs4OV1cbiAgICB9LFxuXG4gICAgLy8gU2Vjb25kIFNraW5cbiAgICBcIjJcIjoge1xuICAgICAgICB2aXN1YWxpemVyOiBfc3BoZXJlMlsnZGVmYXVsdCddLFxuICAgICAgICBodWU6IDIxMyxcbiAgICAgICAgc2F0dXJhdGlvbjogNTAsXG4gICAgICAgIGxpZ2h0bmVzczogMjlcbiAgICB9LFxuXG4gICAgLy8gUmVmbGVjdGlvblxuICAgIFwiM1wiOiB7XG4gICAgICAgIHZpc3VhbGl6ZXI6IF9zcGhlcmUyWydkZWZhdWx0J10sXG4gICAgICAgIGh1ZTogMjI3LFxuICAgICAgICBzYXR1cmF0aW9uOiA1MCxcbiAgICAgICAgbGlnaHRuZXNzOiA5XG4gICAgfSxcblxuICAgIC8vRmFyZXdlbGxcbiAgICBcIjRcIjoge1xuICAgICAgICB2aXN1YWxpemVyOiBfc3BoZXJlMlsnZGVmYXVsdCddLFxuICAgICAgICBodWU6IDIzMCxcbiAgICAgICAgc2F0dXJhdGlvbjogNTAsXG4gICAgICAgIGxpZ2h0bmVzczogMlxuICAgIH0sXG5cbiAgICAvLyBTdGlsbG5lc3NcbiAgICBcIjVcIjoge1xuICAgICAgICB2aXN1YWxpemVyOiBfc3BoZXJlMlsnZGVmYXVsdCddLFxuICAgICAgICBodWU6IDcsXG4gICAgICAgIHNhdHVyYXRpb246IDUwLFxuICAgICAgICBsaWdodG5lc3M6IDE0XG4gICAgfSxcblxuICAgIC8vIFlvdW5nIEd1bnNcbiAgICBcIjZcIjoge1xuICAgICAgICB2aXN1YWxpemVyOiBfc3BoZXJlMlsnZGVmYXVsdCddLFxuICAgICAgICBodWU6IDIsXG4gICAgICAgIHNhdHVyYXRpb246IDIzLFxuICAgICAgICBsaWdodG5lc3M6IDQ2XG4gICAgfSxcblxuICAgIC8vIElubm9jZW50XG4gICAgXCI3XCI6IHtcbiAgICAgICAgdmlzdWFsaXplcjogX3NwaGVyZTJbJ2RlZmF1bHQnXSxcbiAgICAgICAgaHVlOiAyNixcbiAgICAgICAgc2F0dXJhdGlvbjogNDksXG4gICAgICAgIGxpZ2h0bmVzczogNjdcbiAgICB9LFxuXG4gICAgLy8gV2FrZVxuICAgIFwiOFwiOiB7XG4gICAgICAgIHZpc3VhbGl6ZXI6IF9zcGhlcmUyWydkZWZhdWx0J10sXG4gICAgICAgIGh1ZTogMTc1LFxuICAgICAgICBzYXR1cmF0aW9uOiAxNyxcbiAgICAgICAgbGlnaHRuZXNzOiA3OFxuICAgIH1cbn07XG5cbn0se1wiLi9tb3VudGFpbnNcIjozNixcIi4vc3BoZXJlXCI6MzcsXCJsb2Rhc2gvZnVuY3Rpb24vb25jZVwiOjN9XSwzNTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzWydkZWZhdWx0J10gPSBjcmVhdGVWaXN1YWxpemVyO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfbG9kYXNoVXRpbGl0eVJhbmdlID0gcmVxdWlyZSgnbG9kYXNoL3V0aWxpdHkvcmFuZ2UnKTtcblxudmFyIF9sb2Rhc2hVdGlsaXR5UmFuZ2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbG9kYXNoVXRpbGl0eVJhbmdlKTtcblxudmFyIF9sb2Rhc2hOdW1iZXJJblJhbmdlID0gcmVxdWlyZSgnbG9kYXNoL251bWJlci9pblJhbmdlJyk7XG5cbnZhciBfbG9kYXNoTnVtYmVySW5SYW5nZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9sb2Rhc2hOdW1iZXJJblJhbmdlKTtcblxudmFyIF9sb2Rhc2hGdW5jdGlvbk9uY2UgPSByZXF1aXJlKCdsb2Rhc2gvZnVuY3Rpb24vb25jZScpO1xuXG52YXIgX2xvZGFzaEZ1bmN0aW9uT25jZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9sb2Rhc2hGdW5jdGlvbk9uY2UpO1xuXG52YXIgX3NwaGVyZSA9IHJlcXVpcmUoJy4vc3BoZXJlJyk7XG5cbnZhciBfc3BoZXJlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3NwaGVyZSk7XG5cbnZhciBfYWN0aW9ucyA9IHJlcXVpcmUoJy4uL2FjdGlvbnMnKTtcblxudmFyIF9jb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZycpO1xuXG52YXIgX2NvbmZpZzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jb25maWcpO1xuXG5mdW5jdGlvbiByZW5kZXIocGxheWVyLCBzdG9yZSwgYW5hbHlzZXIsIGZyZXFCeXRlRGF0YSwgcGFwZXIpIHtcblxuICAgIC8vcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlci5iaW5kKG51bGwsIHBsYXllciwgc3RvcmUsIGFuYWx5c2VyLCBmcmVxQnl0ZURhdGEsIHBhdGgpKTtcbiAgICAvL3NldEludGVydmFsKCgpID0+IHJlbmRlcihwbGF5ZXIsIHN0b3JlLCBhbmFseXNlciwgZnJlcUJ5dGVEYXRhLCBwYXRoLCByKSwgMTAwMCk7XG4gICAgdmFyIHN0YXRlID0gc3RvcmUuZ2V0U3RhdGUoKTtcbiAgICB2YXIgY3VycmVudFRyYWNrSW5kZXggPSBzdGF0ZS5jdXJyZW50VHJhY2tJbmRleDtcbiAgICB2YXIgdHJhY2tDb25maWcgPSBfY29uZmlnMlsnZGVmYXVsdCddW2N1cnJlbnRUcmFja0luZGV4XTtcbiAgICB2YXIgY3JlYXRlVmlzdWFsaXplciA9IHRyYWNrQ29uZmlnLnZpc3VhbGl6ZXI7XG4gICAgdmFyIHN0cm9rZUNvbG9yID0gdHJhY2tDb25maWcuc3Ryb2tlQ29sb3I7XG4gICAgdmFyIGhpdHBvaW50cyA9IHRyYWNrQ29uZmlnLmhpdHBvaW50cztcblxuICAgIHN0b3JlLmRpc3BhdGNoKCgwLCBfYWN0aW9ucy5jaGFuZ2VCYWNrZ3JvdW5kKSh7XG4gICAgICAgIGh1ZTogdHJhY2tDb25maWcuaHVlLFxuICAgICAgICBzYXR1cmF0aW9uOiB0cmFja0NvbmZpZy5zYXR1cmF0aW9uLFxuICAgICAgICBsaWdodG5lc3M6IHRyYWNrQ29uZmlnLmxpZ2h0bmVzc1xuICAgIH0pKTtcblxuICAgIGZ1bmN0aW9uIHJ1bigpIHtcbiAgICAgICAgdmFyIHZpc3VhbGl6ZXIgPSBjcmVhdGVWaXN1YWxpemVyKHBhcGVyLCBwbGF5ZXIsIHN0b3JlLCB0cmFja0NvbmZpZyk7XG5cbiAgICAgICAgcmV0dXJuIHBhcGVyLnZpZXcub25GcmFtZSA9IGZ1bmN0aW9uIChldmVudCkge1xuXG4gICAgICAgICAgICBpZiAoZXZlbnQuY291bnQgJSA1ID09PSAwKSB7XG5cbiAgICAgICAgICAgICAgICBhbmFseXNlci5nZXRCeXRlRnJlcXVlbmN5RGF0YShmcmVxQnl0ZURhdGEpO1xuXG4gICAgICAgICAgICAgICAgdmlzdWFsaXplcihmcmVxQnl0ZURhdGEsIGV2ZW50KTtcblxuICAgICAgICAgICAgICAgIHBhcGVyLnZpZXcuZHJhdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHZhciBkaXNwb3NlID0gc3RvcmUuc3Vic2NyaWJlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHN0YXRlID0gc3RvcmUuZ2V0U3RhdGUoKTtcblxuICAgICAgICBpZiAoY3VycmVudFRyYWNrSW5kZXggIT09IHN0YXRlLmN1cnJlbnRUcmFja0luZGV4KSB7XG4gICAgICAgICAgICBjdXJyZW50VHJhY2tJbmRleCA9IHN0YXRlLmN1cnJlbnRUcmFja0luZGV4O1xuICAgICAgICAgICAgdHJhY2tDb25maWcgPSBfY29uZmlnMlsnZGVmYXVsdCddW2N1cnJlbnRUcmFja0luZGV4XTtcbiAgICAgICAgICAgIGNyZWF0ZVZpc3VhbGl6ZXIgPSB0cmFja0NvbmZpZy52aXN1YWxpemVyO1xuICAgICAgICAgICAgc3Ryb2tlQ29sb3IgPSB0cmFja0NvbmZpZy5zdHJva2VDb2xvcjtcblxuICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goKDAsIF9hY3Rpb25zLmNoYW5nZUJhY2tncm91bmQpKHtcbiAgICAgICAgICAgICAgICBodWU6IHRyYWNrQ29uZmlnLmh1ZSxcbiAgICAgICAgICAgICAgICBzYXR1cmF0aW9uOiB0cmFja0NvbmZpZy5zYXR1cmF0aW9uLFxuICAgICAgICAgICAgICAgIGxpZ2h0bmVzczogdHJhY2tDb25maWcubGlnaHRuZXNzXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIHBhcGVyLnZpZXcub2ZmKCdmcmFtZScpO1xuXG4gICAgICAgICAgICBydW4oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc3RhdGUuaXNQbGF5aW5nKSB7XG4gICAgICAgICAgICBwYXBlci52aWV3Lm9mZignZnJhbWUnKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJ1bigpO1xufVxuXG5mdW5jdGlvbiBpbml0UGF0aCh0b3RhbFdpZHRoLCB0b3RhbEhlaWdodCkge1xuXG4gICAgdmFyIHBhdGggPSBuZXcgcGFwZXIuUGF0aCgpO1xuXG4gICAgcGF0aC5jbG9zZWQgPSBmYWxzZTtcbiAgICBwYXRoLnN0cm9rZVdpZHRoID0gMTtcbiAgICBwYXRoLnN0cm9rZUNvbG9yID0gJ3JnYmEoMCwwLDAsMCknO1xuXG4gICAgdmFyIG1pZFggPSB0b3RhbFdpZHRoIC8gMjtcbiAgICB2YXIgbWlkWSA9IHRvdGFsSGVpZ2h0IC8gMjtcbiAgICB2YXIgc3RhcnRYID0gbWlkWCAtIF9jb25maWcuUE9JTlRTIC8gMjtcblxuICAgIGZ1bmN0aW9uIGluaXREcmF3KHBvaW50KSB7XG4gICAgICAgIHBhdGguYWRkKHBvaW50KTtcbiAgICAgICAgcGFwZXIudmlldy5kcmF3KCk7XG4gICAgfVxuXG4gICAgKDAsIF9sb2Rhc2hVdGlsaXR5UmFuZ2UyWydkZWZhdWx0J10pKF9jb25maWcuUE9JTlRTKS5tYXAoZnVuY3Rpb24gKGksIGlkeCkge1xuICAgICAgICB2YXIgcG9pbnQgPSBuZXcgcGFwZXIuUG9pbnQoMCwgMCk7XG5cbiAgICAgICAgcGF0aC5hZGQocG9pbnQpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHBhdGg7XG59XG5cbmZ1bmN0aW9uIGluaXRQYXBlcihjYW52YXMpIHtcbiAgICBwYXBlci5zZXR1cChjYW52YXMpO1xuICAgIHBhcGVyLnZpZXcuZmlsbENvbG9yID0gJ3JnYigyNTUsMjU1LDIzMyknO1xuXG4gICAgcmV0dXJuIHBhcGVyO1xuXG4gICAgLy9yZXR1cm4gaW5pdFBhdGgocGFwZXIudmlldy5zaXplLndpZHRoLCBwYXBlci52aWV3LnNpemUuaGVpZ2h0KTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlVmlzdWFsaXplcihwbGF5ZXIsIHN0b3JlKSB7XG4gICAgdmFyIGF1ZGlvID0gcGxheWVyLmF1ZGlvO1xuICAgIGF1ZGlvLmNyb3NzT3JpZ2luID0gJ2Fub255bW91cyc7XG4gICAgdmFyIGNvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0KCk7XG4gICAgdmFyIGFuYWx5c2VyID0gY29udGV4dC5jcmVhdGVBbmFseXNlcigpO1xuICAgIHZhciBzb3VyY2UgPSBjb250ZXh0LmNyZWF0ZU1lZGlhRWxlbWVudFNvdXJjZShhdWRpbyk7XG4gICAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aXN1YWxpemVyJyk7XG4gICAgdmFyIGZyZXFCeXRlRGF0YSA9IG5ldyBVaW50OEFycmF5KGFuYWx5c2VyLmZyZXF1ZW5jeUJpbkNvdW50KTtcblxuICAgIHNvdXJjZS5jb25uZWN0KGFuYWx5c2VyKTtcbiAgICBhbmFseXNlci5jb25uZWN0KGNvbnRleHQuZGVzdGluYXRpb24pO1xuXG4gICAgdmFyIHBhcGVyID0gaW5pdFBhcGVyKGNhbnZhcyk7XG5cbiAgICB2YXIgZGlzcG9zZSA9IHN0b3JlLnN1YnNjcmliZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzdGF0ZSA9IHN0b3JlLmdldFN0YXRlKCk7XG5cbiAgICAgICAgaWYgKHN0YXRlLmlzUGxheWluZykge1xuICAgICAgICAgICAgLy8gSnVzdCBsaXN0ZW4gZm9yIHRoZSBmaXJzdCBwbGF5IGFuZCBjYW5jZWwgdGhlIHN1YnNjcmlwdGlvblxuICAgICAgICAgICAgLy8gYWZ0ZXIgdGhhdC5cbiAgICAgICAgICAgIGRpc3Bvc2UoKTtcblxuICAgICAgICAgICAgcmVuZGVyKHBsYXllciwgc3RvcmUsIGFuYWx5c2VyLCBmcmVxQnl0ZURhdGEsIHBhcGVyKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcblxufSx7XCIuLi9hY3Rpb25zXCI6MjgsXCIuL2NvbmZpZ1wiOjM0LFwiLi9zcGhlcmVcIjozNyxcImxvZGFzaC9mdW5jdGlvbi9vbmNlXCI6MyxcImxvZGFzaC9udW1iZXIvaW5SYW5nZVwiOjExLFwibG9kYXNoL3V0aWxpdHkvcmFuZ2VcIjoxMn1dLDM2OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGdlbmVyYXRlTW91bnRhaW5zO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfbG9kYXNoVXRpbGl0eVJhbmdlID0gcmVxdWlyZSgnbG9kYXNoL3V0aWxpdHkvcmFuZ2UnKTtcblxudmFyIF9sb2Rhc2hVdGlsaXR5UmFuZ2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbG9kYXNoVXRpbGl0eVJhbmdlKTtcblxudmFyIF9sb2Rhc2hGdW5jdGlvbk9uY2UgPSByZXF1aXJlKCdsb2Rhc2gvZnVuY3Rpb24vb25jZScpO1xuXG52YXIgX2xvZGFzaEZ1bmN0aW9uT25jZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9sb2Rhc2hGdW5jdGlvbk9uY2UpO1xuXG52YXIgX2NvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnJyk7XG5cbnZhciBfYWN0aW9ucyA9IHJlcXVpcmUoJy4uL2FjdGlvbnMnKTtcblxudmFyIG1heEFscGhhID0gMC4zO1xuXG5mdW5jdGlvbiBpbml0TW91bnRhaW4ocGFwZXIpIHtcbiAgICB2YXIgbWlycm9yZWQgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IGFyZ3VtZW50c1sxXTtcblxuICAgIHZhciBwYXRoID0gbmV3IHBhcGVyLlBhdGgoKTtcbiAgICB2YXIgd2lkdGggPSBwYXBlci52aWV3LnNpemUud2lkdGg7XG4gICAgdmFyIGhlaWdodCA9IHBhcGVyLnZpZXcuc2l6ZS5oZWlnaHQ7XG4gICAgdmFyIHdpZHRoT2Zmc2V0ID0gNTA7XG4gICAgdmFyIHJlZCA9IDM2O1xuXG4gICAgcmVkICs9IDIwO1xuXG4gICAgcGF0aC5jbG9zZWQgPSBmYWxzZTtcbiAgICBwYXRoLnBvc2l0aW9uLnggPSAwO1xuICAgIHBhdGgucG9zaXRpb24ueSA9IHBhcGVyLnZpZXcuc2l6ZS5oZWlnaHQ7XG4gICAgcGF0aC5zdHJva2VDb2xvciA9ICdyZ2JhKCcgKyByZWQgKyAnLCA3MCwgMTExLCAwLjMpJztcbiAgICBwYXRoLmZpbGxDb2xvciA9ICdyZ2JhKCcgKyByZWQgKyAnLCA3MCwgMTExLCAwKSc7XG4gICAgcGF0aC5taXJyb3JlZCA9IG1pcnJvcmVkO1xuXG4gICAgcGF0aC5hZGQobmV3IHBhcGVyLlBvaW50KG1pcnJvcmVkID8gd2lkdGggKyB3aWR0aE9mZnNldCA6IC13aWR0aE9mZnNldCwgaGVpZ2h0KSk7XG5cbiAgICBwYXRoLnBvc2l0aW9uLnkgPSBwYXBlci52aWV3LnNpemUuaGVpZ2h0O1xuXG4gICAgcGF0aC5zbW9vdGgoKTtcblxuICAgIHJldHVybiBwYXRoO1xufVxuXG5mdW5jdGlvbiBpbml0U3VuKHBhcGVyKSB7XG4gICAgdmFyIHBhdGggPSBuZXcgcGFwZXIuUGF0aCgpO1xuICAgIHZhciB3aWR0aCA9IHBhcGVyLnZpZXcuc2l6ZS53aWR0aDtcbiAgICB2YXIgaGVpZ2h0ID0gcGFwZXIudmlldy5zaXplLmhlaWdodDtcbiAgICB2YXIgcmFkaXVzID0gMTAwO1xuXG4gICAgcGF0aC5zdHJva2VDb2xvciA9ICdyZ2JhKDE0NCwgOTIsIDkwLCAwLjUpJztcbiAgICBwYXRoLmZpbGxDb2xvciA9ICdyZ2JhKDE0NCwgOTIsIDkwLCAwKSc7XG4gICAgcGF0aC5zdHJva2VXaWR0aCA9IDE7XG4gICAgcGF0aC5zbW9vdGgoKTtcblxuICAgIHBhdGgucG9zaXRpb24ueCA9IHdpZHRoICogMC4yNTtcbiAgICBwYXRoLnBvc2l0aW9uLnkgPSAxMDA7XG5cbiAgICByZXR1cm4gcGF0aDtcbn1cblxudmFyIGRpbUxpZ2h0cyA9ICgwLCBfbG9kYXNoRnVuY3Rpb25PbmNlMlsnZGVmYXVsdCddKShmdW5jdGlvbiAoc3RvcmUpIHtcbiAgICB2YXIgc3RhdGUgPSBzdG9yZS5nZXRTdGF0ZSgpO1xuXG4gICAgc3RvcmUuZGlzcGF0Y2goKDAsIF9hY3Rpb25zLmNoYW5nZUJhY2tncm91bmQpKHtcbiAgICAgICAgaHVlOiBzdGF0ZS5odWUgLSA1XG4gICAgfSkpO1xufSk7XG5cbmZ1bmN0aW9uIGdlbmVyYXRlTW91bnRhaW5zKHBhcGVyLCBwbGF5ZXIsIHN0b3JlLCB0cmFja0NvbmZpZykge1xuXG4gICAgdmFyIHdpZHRoID0gcGFwZXIudmlldy5zaXplLndpZHRoO1xuICAgIHZhciBoZWlnaHQgPSBwYXBlci52aWV3LnNpemUuaGVpZ2h0O1xuICAgIHZhciBoaXRwb2ludHMgPSB0cmFja0NvbmZpZy5oaXRwb2ludHMgfHwgW107XG4gICAgdmFyIGhpdHMgPSBbXTtcbiAgICB2YXIgY3VycmVudEhpdHBvaW50SW5kZXggPSAwO1xuXG4gICAgdmFyIG1vdW50YWlucyA9IFtpbml0TW91bnRhaW4ocGFwZXIpXTtcbiAgICB2YXIgaW50ZXJ2YWwgPSB3aWR0aCAvIF9jb25maWcuUE9JTlRTO1xuICAgIHZhciBjdXJyZW50TW91bnRhaW5JbmRleCA9IDA7XG4gICAgdmFyIGhlaWdodE9mZnNldCA9IDA7XG5cbiAgICB2YXIgc3VuID0gaW5pdFN1bihwYXBlcik7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKGRhdGEsIGV2ZW50KSB7XG5cbiAgICAgICAgdmFyIGN1cnJlbnRIaXRwb2ludCA9IGhpdHBvaW50cy5sZW5ndGggJiYgaGl0cG9pbnRzW2N1cnJlbnRIaXRwb2ludEluZGV4XTtcblxuICAgICAgICBpZiAoY3VycmVudEhpdHBvaW50ICYmIHBsYXllci5hdWRpby5jdXJyZW50VGltZSA+IGN1cnJlbnRIaXRwb2ludCkge1xuICAgICAgICAgICAgaWYgKGhpdHMuaW5kZXhPZihjdXJyZW50SGl0cG9pbnQpID09PSAtMSkge1xuICAgICAgICAgICAgICAgIGhpdHMucHVzaChjdXJyZW50SGl0cG9pbnQpO1xuICAgICAgICAgICAgICAgICsrY3VycmVudEhpdHBvaW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vdW50YWlucyFcbiAgICAgICAgICpcbiAgICAgICAgICovXG4gICAgICAgIHZhciBtb3VudGFpbiA9IG1vdW50YWluc1tjdXJyZW50TW91bnRhaW5JbmRleF07XG4gICAgICAgIHZhciBsYXN0TW91bnRhaW4gPSBtb3VudGFpbnNbY3VycmVudE1vdW50YWluSW5kZXggLSAxXTtcbiAgICAgICAgdmFyIGxlbmd0aCA9IG1vdW50YWluLnNlZ21lbnRzLmxlbmd0aDtcblxuICAgICAgICBpZiAobGFzdE1vdW50YWluICYmIGxhc3RNb3VudGFpbi5hbmltYXRpbmdGaWxsKSB7XG4gICAgICAgICAgICBpZiAobGFzdE1vdW50YWluLmZpbGxDb2xvci5hbHBoYSA8IG1heEFscGhhKSB7XG4gICAgICAgICAgICAgICAgbGFzdE1vdW50YWluLmZpbGxDb2xvci5hbHBoYSArPSAwLjAxO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsYXN0TW91bnRhaW4uYW5pbWF0aW5nRmlsbCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1vdW50YWlucy5sZW5ndGggPj0gMCAmJiBtb3VudGFpbnMubGVuZ3RoIDw9IDQpIHtcblxuICAgICAgICAgICAgaWYgKGV2ZW50LmNvdW50ICE9PSAwICYmIGV2ZW50LmNvdW50ICUgX2NvbmZpZy5QT0lOVFMgPT09IDApIHtcbiAgICAgICAgICAgICAgICBoZWlnaHRPZmZzZXQgKz0gMjA7XG4gICAgICAgICAgICAgICAgbW91bnRhaW5zLnB1c2goaW5pdE1vdW50YWluKHBhcGVyLCAhbW91bnRhaW4ubWlycm9yZWQpKTtcblxuICAgICAgICAgICAgICAgICsrY3VycmVudE1vdW50YWluSW5kZXg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChsZW5ndGggKyAxID49IF9jb25maWcuUE9JTlRTKSB7XG4gICAgICAgICAgICAgICAgdmFyIHggPSBtb3VudGFpbi5taXJyb3JlZCA/IDAgOiB3aWR0aDtcbiAgICAgICAgICAgICAgICB2YXIgcG9pbnQgPSBuZXcgcGFwZXIuUG9pbnQoeCwgaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICBtb3VudGFpbi5hZGQocG9pbnQpO1xuICAgICAgICAgICAgICAgIG1vdW50YWluLmFuaW1hdGluZ0ZpbGwgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgaSA9IGxlbmd0aCArIDE7XG4gICAgICAgICAgICAgICAgdmFyIHggPSBtb3VudGFpbi5taXJyb3JlZCA/IHdpZHRoIC0gaSAqIGludGVydmFsIDogaSAqIGludGVydmFsO1xuICAgICAgICAgICAgICAgIHZhciB5ID0gaGVpZ2h0IC0gZGF0YVtpXSAqIChfY29uZmlnLmFtcGxpdHVkZSAvIDIwKSAtIGhlaWdodE9mZnNldDtcbiAgICAgICAgICAgICAgICB2YXIgcG9pbnQgPSBuZXcgcGFwZXIuUG9pbnQoeCwgeSk7XG4gICAgICAgICAgICAgICAgbW91bnRhaW4uYWRkKHBvaW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoaXRzLmxlbmd0aCA+PSAxKSB7XG5cbiAgICAgICAgICAgIGRpbUxpZ2h0cyhzdG9yZSk7XG5cbiAgICAgICAgICAgIHZhciB4UG9zID0gd2lkdGggKiAwLjI1O1xuICAgICAgICAgICAgdmFyIHlQb3MgPSAyMDA7XG4gICAgICAgICAgICB2YXIgc2VncyA9IHN1bi5zZWdtZW50cy5sZW5ndGg7XG4gICAgICAgICAgICB2YXIgaSA9IHNlZ3MgKyAxO1xuICAgICAgICAgICAgdmFyIHJhZGl1cyA9IDc1O1xuXG4gICAgICAgICAgICBpZiAoc2VncyA8PSBfY29uZmlnLlBPSU5UUykge1xuICAgICAgICAgICAgICAgIHZhciB4ID0gcmFkaXVzICogTWF0aC5jb3MocmFkaXVzICogaSkgKyB4UG9zO1xuICAgICAgICAgICAgICAgIHZhciB5ID0gcmFkaXVzICogTWF0aC5zaW4ocmFkaXVzICogaSkgKyB5UG9zO1xuICAgICAgICAgICAgICAgIHZhciBwb2ludCA9IG5ldyBwYXBlci5Qb2ludCh4LCB5KTtcblxuICAgICAgICAgICAgICAgIHN1bi5hZGQocG9pbnQpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHNlZ3MgPiAzMCAmJiBzdW4uZmlsbENvbG9yLmFscGhhIDwgMC41KSB7XG4gICAgICAgICAgICAgICAgICAgIHN1bi5maWxsQ29sb3IucmVkICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIHN1bi5maWxsQ29sb3IuYWxwaGEgKz0gMC4wMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHN1bi5wb3NpdGlvbi55IDwgaGVpZ2h0IC0gMjAwKSB7XG4gICAgICAgICAgICAgICAgc3VuLnBvc2l0aW9uLnkgKz0gMC4xO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG5cbn0se1wiLi4vYWN0aW9uc1wiOjI4LFwiLi9jb25maWdcIjozNCxcImxvZGFzaC9mdW5jdGlvbi9vbmNlXCI6MyxcImxvZGFzaC91dGlsaXR5L3JhbmdlXCI6MTJ9XSwzNzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzWydkZWZhdWx0J10gPSBnZW5lcmF0ZVNwaGVyZTtcblxudmFyIF9jb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZycpO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZVNwaGVyZShkYXRhLCBwYXRoKSB7XG5cbiAgICByZXR1cm4gcGF0aC5zZWdtZW50cy5tYXAoZnVuY3Rpb24gKHNlZ21lbnQsIGkpIHtcblxuICAgICAgICBwYXRoLnN0cm9rZUNvbG9yID0gJ3JnYmEoMjU2LCAyNTYsIDI1NiwgMSknO1xuICAgICAgICBwYXRoLnN0cm9rZVdpZHRoID0gMTtcblxuICAgICAgICB2YXIgeFBvcyA9IHBhcGVyLnZpZXcuc2l6ZS53aWR0aCAvIDI7XG4gICAgICAgIHZhciB5UG9zID0gcGFwZXIudmlldy5zaXplLmhlaWdodCAvIDI7XG4gICAgICAgIHZhciBtYWduaXR1ZGUgPSBkYXRhW2ldICogKDAuMiAqIChfY29uZmlnLmFtcGxpdHVkZSAvIDIwKSk7XG4gICAgICAgIHZhciB4ID0gX2NvbmZpZy5SQURJVVMgKiBNYXRoLmNvcyhfY29uZmlnLlJBRElVUyAqIG1hZ25pdHVkZSkgKyB4UG9zO1xuICAgICAgICB2YXIgeSA9IF9jb25maWcuUkFESVVTICogTWF0aC5zaW4oX2NvbmZpZy5SQURJVVMgKiBtYWduaXR1ZGUpICsgeVBvcztcblxuICAgICAgICBzZWdtZW50LnBvaW50LnggPSB4O1xuICAgICAgICBzZWdtZW50LnBvaW50LnkgPSB5O1xuXG4gICAgICAgIHJldHVybiBzZWdtZW50O1xuICAgIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcblxufSx7XCIuL2NvbmZpZ1wiOjM0fV19LHt9LFsyOV0pO1xuIl0sImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
