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

},{"../internal/isIterateeCall":8}],12:[function(require,module,exports){
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
},{"_process":14,"path-to-regexp":13}],13:[function(require,module,exports){
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

},{"isarray":1}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){
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
},{}],17:[function(require,module,exports){
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
},{"./utils/isPlainObject":23}],18:[function(require,module,exports){
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
},{"./createStore":17,"./utils/applyMiddleware":19,"./utils/bindActionCreators":20,"./utils/combineReducers":21,"./utils/compose":22}],19:[function(require,module,exports){
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
},{"./compose":22}],20:[function(require,module,exports){
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
},{"../utils/mapValues":24}],21:[function(require,module,exports){
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
},{"../createStore":17,"../utils/isPlainObject":23,"../utils/mapValues":24,"../utils/pick":25,"_process":14}],22:[function(require,module,exports){
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
},{}],23:[function(require,module,exports){
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
},{}],24:[function(require,module,exports){
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
},{}],25:[function(require,module,exports){
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
},{}],26:[function(require,module,exports){
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

},{}],27:[function(require,module,exports){
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

},{"./constants":29,"soundcloud-audio":26}],28:[function(require,module,exports){
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

},{"./actions":27,"./constants":29,"./dom":30,"./reducer":31,"./router":32,"./visualizer":36,"redux":18,"redux-logger":15,"redux-thunk":16,"soundcloud-audio":26}],29:[function(require,module,exports){
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

},{}],30:[function(require,module,exports){
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

},{"./actions":27,"./constants":29}],31:[function(require,module,exports){
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

},{"./actions":27}],32:[function(require,module,exports){
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

},{"page":12}],33:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = randomBetween;

function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = exports["default"];

},{}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodashFunctionOnce = require('lodash/function/once');

var _lodashFunctionOnce2 = _interopRequireDefault(_lodashFunctionOnce);

var POINTS = 256;
exports.POINTS = POINTS;
var INIT_POINTS = 50;
exports.INIT_POINTS = INIT_POINTS;
var amplitude = 0.5;
exports.amplitude = amplitude;
var ANGLE = 10;
exports.ANGLE = ANGLE;
var RADIUS = 200;
exports.RADIUS = RADIUS;
var COLOR_AMP = 0.4;
exports.COLOR_AMP = COLOR_AMP;
var MAX_ALPHA = 0.1;

exports.MAX_ALPHA = MAX_ALPHA;
var FRAME_THROTTLE = 5;

exports.FRAME_THROTTLE = FRAME_THROTTLE;
exports['default'] = {

    // Exit
    "0": {
        hue: 32,
        saturation: 50,
        lightness: 81,
        strokeColor: 'rgba(144, 92, 90, 0.5)',
        fillColor: 'rgba(144, 92, 90, 0.5)'
    },

    // Ghost
    "1": {
        hue: 30,
        saturation: 84,
        lightness: 84,
        hitpoints: [89, 150],
        strokeColor: 'rgba(155, 199, 243, 0.5)',
        fillColor: 'rgba(155, 199, 243, 0.5)'
    },

    // Second Skin
    "2": {
        hue: 213,
        saturation: 50,
        lightness: 29,
        strokeColor: 'rgba(112, 112, 112, 0.5)',
        fillColor: 'rgba(112, 112, 112, 0.5)'
    },

    // Reflection
    "3": {
        hue: 227,
        saturation: 50,
        lightness: 9,
        strokeColor: 'rgba(144, 92, 90, 0.5)',
        fillColor: 'rgba(250, 250, 250, 0.5)'
    },

    //Farewell
    "4": {
        hue: 230,
        saturation: 50,
        lightness: 2,
        strokeColor: 'rgba(250, 250, 250, 0.5)',
        fillColor: 'rgba(19, 14, 45, 0.4)'
    },

    // Stillness
    "5": {
        hue: 7,
        saturation: 50,
        lightness: 14,
        strokeColor: 'rgba(18, 45, 48, 0.5)',
        fillColor: 'rgba(18, 45, 48, 0.5)'
    },

    // Young Guns
    "6": {
        hue: 2,
        saturation: 23,
        lightness: 46,
        strokeColor: 'rgba(86, 128, 129, 0.5)',
        fillColor: 'rgba(86, 128, 129, 0.5)'
    },

    // Innocent
    "7": {
        hue: 26,
        saturation: 49,
        lightness: 67,
        strokeColor: 'rgba(119, 167, 204, 0.5)',
        fillColor: 'rgba(119, 167, 204, 0.5)'
    },

    // Wake
    "8": {
        hue: 175,
        saturation: 17,
        lightness: 78,
        strokeColor: 'rgba(10, 10, 10, 0.5)',
        fillColor: 'rgba(198, 177, 179, 0.5)'
    }
};

},{"lodash/function/once":3}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = generate;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodashUtilityRange = require('lodash/utility/range');

var _lodashUtilityRange2 = _interopRequireDefault(_lodashUtilityRange);

var _lodashFunctionOnce = require('lodash/function/once');

var _lodashFunctionOnce2 = _interopRequireDefault(_lodashFunctionOnce);

var _config = require('./config');

var _actions = require('../actions');

var _utilsRandomBetween = require('../utils/randomBetween');

var _utilsRandomBetween2 = _interopRequireDefault(_utilsRandomBetween);

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

function initPath(paper, config) {
    var path = new paper.Path();
    var width = paper.view.size.width;
    var height = paper.view.size.height;
    var radius = 100;

    //path.strokeColor = config.strokeColor || '#444';
    //path.fillColor = config.fillColor || '#444';
    path.strokeWidth = 1;
    path.smooth();

    var interval = width / _config.POINTS;

    (0, _lodashUtilityRange2['default'])(_config.POINTS).map(function (pnt, i) {
        if (i === 0) {
            path.add(new paper.Point(-100, 0));
        } else if (i === _config.POINTS - 1) {
            path.add(new paper.Point(width + 200, 0));
        } else {
            path.add(new paper.Point(pnt * interval, 0));
        }
    });

    path.position.y = height;

    return path;
}

function dimPath(path) {
    return path.fillColor.alpha -= 0.01;
}

function shouldDim(path) {
    return path.fillColor && path.fillColor.alpha && path.fillColor.alpha > _config.MAX_ALPHA;
}

var heightChange = 1;
var paths = [];
var currentPathIndex = -1;
var path = undefined;

function generate(paper, player, store, trackConfig) {

    var width = paper.view.size.width;
    var height = paper.view.size.height;

    heightChange += 0.01;

    paper.project.clear();

    var barHeight = undefined;
    path = initPath(paper);
    path.strokeColor = trackConfig.strokeColor || '#444';
    path.fillColor = trackConfig.fillColor || '#444';

    return function (data, event) {

        for (var i = 0; i < _config.POINTS; i++) {
            if (i !== 0 && i !== _config.POINTS - 1) {
                var segment = path.segments[i];
                barHeight = data[i] * _config.amplitude * heightChange;
                segment.point.y = height - barHeight;
            }
        }
    };
}

module.exports = exports['default'];

},{"../actions":27,"../utils/randomBetween":33,"./config":34,"lodash/function/once":3,"lodash/utility/range":11}],36:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

exports['default'] = createVisualizer;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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

    function run() {
        var visualizer = (0, _freq2['default'])(paper, player, store, trackConfig);

        return paper.view.onFrame = function (event) {

            if (event.count % _config.FRAME_THROTTLE === 0) {

                analyser.getByteFrequencyData(freqByteData);

                visualizer(freqByteData, event);

                paper.view.draw();
            }
        };
    }

    paper.view.onResize = run;

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
        }

        if (!state.isPlaying) {
            paper.view.off('frame');
        } else {
            run();
        }
    });

    return paper;
}

function initPaper(canvas) {
    paper.setup(canvas);
    paper.view.fillColor = 'rgb(255,255,233)';

    return paper;
}

function initAudio(player) {
    var audio = player.audio;
    audio.crossOrigin = 'anonymous';
    var context = new AudioContext();
    var analyser = context.createAnalyser();
    var source = context.createMediaElementSource(audio);
    var freqByteData = new Uint8Array(analyser.frequencyBinCount);

    source.connect(analyser);
    analyser.connect(context.destination);

    return [analyser, freqByteData];
}

function createVisualizer(player, store) {
    var canvas = document.getElementById('visualizer');

    var _initAudio = initAudio(player);

    var _initAudio2 = _slicedToArray(_initAudio, 2);

    var analyser = _initAudio2[0];
    var freqByteData = _initAudio2[1];

    var paper = initPaper(canvas);

    return render(player, store, analyser, freqByteData, paper);
}

module.exports = exports['default'];

},{"../actions":27,"./config":34,"./freq":35}]},{},[28]);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJidW5kbGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkoezE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xubW9kdWxlLmV4cG9ydHMgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIChhcnIpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcnIpID09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuXG59LHt9XSwyOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbi8qKiBVc2VkIGFzIHRoZSBgVHlwZUVycm9yYCBtZXNzYWdlIGZvciBcIkZ1bmN0aW9uc1wiIG1ldGhvZHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGZ1bmNgLCB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBhbmQgYXJndW1lbnRzXG4gKiBvZiB0aGUgY3JlYXRlZCBmdW5jdGlvbiwgd2hpbGUgaXQncyBjYWxsZWQgbGVzcyB0aGFuIGBuYCB0aW1lcy4gU3Vic2VxdWVudFxuICogY2FsbHMgdG8gdGhlIGNyZWF0ZWQgZnVuY3Rpb24gcmV0dXJuIHRoZSByZXN1bHQgb2YgdGhlIGxhc3QgYGZ1bmNgIGludm9jYXRpb24uXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtudW1iZXJ9IG4gVGhlIG51bWJlciBvZiBjYWxscyBhdCB3aGljaCBgZnVuY2AgaXMgbm8gbG9uZ2VyIGludm9rZWQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byByZXN0cmljdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHJlc3RyaWN0ZWQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIGpRdWVyeSgnI2FkZCcpLm9uKCdjbGljaycsIF8uYmVmb3JlKDUsIGFkZENvbnRhY3RUb0xpc3QpKTtcbiAqIC8vID0+IGFsbG93cyBhZGRpbmcgdXAgdG8gNCBjb250YWN0cyB0byB0aGUgbGlzdFxuICovXG5mdW5jdGlvbiBiZWZvcmUobiwgZnVuYykge1xuICB2YXIgcmVzdWx0O1xuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgIGlmICh0eXBlb2YgbiA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB2YXIgdGVtcCA9IG47XG4gICAgICBuID0gZnVuYztcbiAgICAgIGZ1bmMgPSB0ZW1wO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBpZiAoLS1uID4gMCkge1xuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgICBpZiAobiA8PSAxKSB7XG4gICAgICBmdW5jID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJlZm9yZTtcblxufSx7fV0sMzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG52YXIgYmVmb3JlID0gcmVxdWlyZSgnLi9iZWZvcmUnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBpcyByZXN0cmljdGVkIHRvIGludm9raW5nIGBmdW5jYCBvbmNlLiBSZXBlYXQgY2FsbHNcbiAqIHRvIHRoZSBmdW5jdGlvbiByZXR1cm4gdGhlIHZhbHVlIG9mIHRoZSBmaXJzdCBjYWxsLiBUaGUgYGZ1bmNgIGlzIGludm9rZWRcbiAqIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIGFuZCBhcmd1bWVudHMgb2YgdGhlIGNyZWF0ZWQgZnVuY3Rpb24uXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gcmVzdHJpY3QuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyByZXN0cmljdGVkIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgaW5pdGlhbGl6ZSA9IF8ub25jZShjcmVhdGVBcHBsaWNhdGlvbik7XG4gKiBpbml0aWFsaXplKCk7XG4gKiBpbml0aWFsaXplKCk7XG4gKiAvLyBgaW5pdGlhbGl6ZWAgaW52b2tlcyBgY3JlYXRlQXBwbGljYXRpb25gIG9uY2VcbiAqL1xuZnVuY3Rpb24gb25jZShmdW5jKSB7XG4gIHJldHVybiBiZWZvcmUoMiwgZnVuYyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb25jZTtcblxufSx7XCIuL2JlZm9yZVwiOjJ9XSw0OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucHJvcGVydHlgIHdpdGhvdXQgc3VwcG9ydCBmb3IgZGVlcCBwYXRocy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVByb3BlcnR5KGtleSkge1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVByb3BlcnR5O1xuXG59LHt9XSw1OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbnZhciBiYXNlUHJvcGVydHkgPSByZXF1aXJlKCcuL2Jhc2VQcm9wZXJ0eScpO1xuXG4vKipcbiAqIEdldHMgdGhlIFwibGVuZ3RoXCIgcHJvcGVydHkgdmFsdWUgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCB0byBhdm9pZCBhIFtKSVQgYnVnXShodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTQyNzkyKVxuICogdGhhdCBhZmZlY3RzIFNhZmFyaSBvbiBhdCBsZWFzdCBpT1MgOC4xLTguMyBBUk02NC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIFwibGVuZ3RoXCIgdmFsdWUuXG4gKi9cbnZhciBnZXRMZW5ndGggPSBiYXNlUHJvcGVydHkoJ2xlbmd0aCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdldExlbmd0aDtcblxufSx7XCIuL2Jhc2VQcm9wZXJ0eVwiOjR9XSw2OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbnZhciBnZXRMZW5ndGggPSByZXF1aXJlKCcuL2dldExlbmd0aCcpLFxuICAgIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi9pc0xlbmd0aCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0FycmF5TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiBpc0xlbmd0aChnZXRMZW5ndGgodmFsdWUpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0FycmF5TGlrZTtcblxufSx7XCIuL2dldExlbmd0aFwiOjUsXCIuL2lzTGVuZ3RoXCI6OX1dLDc6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuLyoqIFVzZWQgdG8gZGV0ZWN0IHVuc2lnbmVkIGludGVnZXIgdmFsdWVzLiAqL1xudmFyIHJlSXNVaW50ID0gL15cXGQrJC87XG5cbi8qKlxuICogVXNlZCBhcyB0aGUgW21heGltdW0gbGVuZ3RoXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1udW1iZXIubWF4X3NhZmVfaW50ZWdlcilcbiAqIG9mIGFuIGFycmF5LWxpa2UgdmFsdWUuXG4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgaW5kZXguXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHBhcmFtIHtudW1iZXJ9IFtsZW5ndGg9TUFYX1NBRkVfSU5URUdFUl0gVGhlIHVwcGVyIGJvdW5kcyBvZiBhIHZhbGlkIGluZGV4LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBpbmRleCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0luZGV4KHZhbHVlLCBsZW5ndGgpIHtcbiAgdmFsdWUgPSAodHlwZW9mIHZhbHVlID09ICdudW1iZXInIHx8IHJlSXNVaW50LnRlc3QodmFsdWUpKSA/ICt2YWx1ZSA6IC0xO1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG4gIHJldHVybiB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDwgbGVuZ3RoO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzSW5kZXg7XG5cbn0se31dLDg6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xudmFyIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpLFxuICAgIGlzSW5kZXggPSByZXF1aXJlKCcuL2lzSW5kZXgnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2xhbmcvaXNPYmplY3QnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgdGhlIHByb3ZpZGVkIGFyZ3VtZW50cyBhcmUgZnJvbSBhbiBpdGVyYXRlZSBjYWxsLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgdmFsdWUgYXJndW1lbnQuXG4gKiBAcGFyYW0geyp9IGluZGV4IFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgaW5kZXggb3Iga2V5IGFyZ3VtZW50LlxuICogQHBhcmFtIHsqfSBvYmplY3QgVGhlIHBvdGVudGlhbCBpdGVyYXRlZSBvYmplY3QgYXJndW1lbnQuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGFyZ3VtZW50cyBhcmUgZnJvbSBhbiBpdGVyYXRlZSBjYWxsLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSXRlcmF0ZWVDYWxsKHZhbHVlLCBpbmRleCwgb2JqZWN0KSB7XG4gIGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgdHlwZSA9IHR5cGVvZiBpbmRleDtcbiAgaWYgKHR5cGUgPT0gJ251bWJlcidcbiAgICAgID8gKGlzQXJyYXlMaWtlKG9iamVjdCkgJiYgaXNJbmRleChpbmRleCwgb2JqZWN0Lmxlbmd0aCkpXG4gICAgICA6ICh0eXBlID09ICdzdHJpbmcnICYmIGluZGV4IGluIG9iamVjdCkpIHtcbiAgICB2YXIgb3RoZXIgPSBvYmplY3RbaW5kZXhdO1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdmFsdWUgPyAodmFsdWUgPT09IG90aGVyKSA6IChvdGhlciAhPT0gb3RoZXIpO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0l0ZXJhdGVlQ2FsbDtcblxufSx7XCIuLi9sYW5nL2lzT2JqZWN0XCI6MTAsXCIuL2lzQXJyYXlMaWtlXCI6NixcIi4vaXNJbmRleFwiOjd9XSw5OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbi8qKlxuICogVXNlZCBhcyB0aGUgW21heGltdW0gbGVuZ3RoXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1udW1iZXIubWF4X3NhZmVfaW50ZWdlcilcbiAqIG9mIGFuIGFycmF5LWxpa2UgdmFsdWUuXG4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIGlzIGJhc2VkIG9uIFtgVG9MZW5ndGhgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy10b2xlbmd0aCkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBsZW5ndGgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNMZW5ndGgodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJiB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNMZW5ndGg7XG5cbn0se31dLDEwOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlIFtsYW5ndWFnZSB0eXBlXShodHRwczovL2VzNS5naXRodWIuaW8vI3g4KSBvZiBgT2JqZWN0YC5cbiAqIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoMSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICAvLyBBdm9pZCBhIFY4IEpJVCBidWcgaW4gQ2hyb21lIDE5LTIwLlxuICAvLyBTZWUgaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTIyOTEgZm9yIG1vcmUgZGV0YWlscy5cbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAhIXZhbHVlICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3Q7XG5cbn0se31dLDExOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbnZhciBpc0l0ZXJhdGVlQ2FsbCA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2lzSXRlcmF0ZWVDYWxsJyk7XG5cbi8qIE5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlQ2VpbCA9IE1hdGguY2VpbCxcbiAgICBuYXRpdmVNYXggPSBNYXRoLm1heDtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIG51bWJlcnMgKHBvc2l0aXZlIGFuZC9vciBuZWdhdGl2ZSkgcHJvZ3Jlc3NpbmcgZnJvbVxuICogYHN0YXJ0YCB1cCB0bywgYnV0IG5vdCBpbmNsdWRpbmcsIGBlbmRgLiBJZiBgZW5kYCBpcyBub3Qgc3BlY2lmaWVkIGl0J3NcbiAqIHNldCB0byBgc3RhcnRgIHdpdGggYHN0YXJ0YCB0aGVuIHNldCB0byBgMGAuIElmIGBlbmRgIGlzIGxlc3MgdGhhbiBgc3RhcnRgXG4gKiBhIHplcm8tbGVuZ3RoIHJhbmdlIGlzIGNyZWF0ZWQgdW5sZXNzIGEgbmVnYXRpdmUgYHN0ZXBgIGlzIHNwZWNpZmllZC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IFV0aWxpdHlcbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9MF0gVGhlIHN0YXJ0IG9mIHRoZSByYW5nZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBlbmQgVGhlIGVuZCBvZiB0aGUgcmFuZ2UuXG4gKiBAcGFyYW0ge251bWJlcn0gW3N0ZXA9MV0gVGhlIHZhbHVlIHRvIGluY3JlbWVudCBvciBkZWNyZW1lbnQgYnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBhcnJheSBvZiBudW1iZXJzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnJhbmdlKDQpO1xuICogLy8gPT4gWzAsIDEsIDIsIDNdXG4gKlxuICogXy5yYW5nZSgxLCA1KTtcbiAqIC8vID0+IFsxLCAyLCAzLCA0XVxuICpcbiAqIF8ucmFuZ2UoMCwgMjAsIDUpO1xuICogLy8gPT4gWzAsIDUsIDEwLCAxNV1cbiAqXG4gKiBfLnJhbmdlKDAsIC00LCAtMSk7XG4gKiAvLyA9PiBbMCwgLTEsIC0yLCAtM11cbiAqXG4gKiBfLnJhbmdlKDEsIDQsIDApO1xuICogLy8gPT4gWzEsIDEsIDFdXG4gKlxuICogXy5yYW5nZSgwKTtcbiAqIC8vID0+IFtdXG4gKi9cbmZ1bmN0aW9uIHJhbmdlKHN0YXJ0LCBlbmQsIHN0ZXApIHtcbiAgaWYgKHN0ZXAgJiYgaXNJdGVyYXRlZUNhbGwoc3RhcnQsIGVuZCwgc3RlcCkpIHtcbiAgICBlbmQgPSBzdGVwID0gdW5kZWZpbmVkO1xuICB9XG4gIHN0YXJ0ID0gK3N0YXJ0IHx8IDA7XG4gIHN0ZXAgPSBzdGVwID09IG51bGwgPyAxIDogKCtzdGVwIHx8IDApO1xuXG4gIGlmIChlbmQgPT0gbnVsbCkge1xuICAgIGVuZCA9IHN0YXJ0O1xuICAgIHN0YXJ0ID0gMDtcbiAgfSBlbHNlIHtcbiAgICBlbmQgPSArZW5kIHx8IDA7XG4gIH1cbiAgLy8gVXNlIGBBcnJheShsZW5ndGgpYCBzbyBlbmdpbmVzIGxpa2UgQ2hha3JhIGFuZCBWOCBhdm9pZCBzbG93ZXIgbW9kZXMuXG4gIC8vIFNlZSBodHRwczovL3lvdXR1LmJlL1hBcUlwR1U4WlprI3Q9MTdtMjVzIGZvciBtb3JlIGRldGFpbHMuXG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gbmF0aXZlTWF4KG5hdGl2ZUNlaWwoKGVuZCAtIHN0YXJ0KSAvIChzdGVwIHx8IDEpKSwgMCksXG4gICAgICByZXN1bHQgPSBBcnJheShsZW5ndGgpO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgcmVzdWx0W2luZGV4XSA9IHN0YXJ0O1xuICAgIHN0YXJ0ICs9IHN0ZXA7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByYW5nZTtcblxufSx7XCIuLi9pbnRlcm5hbC9pc0l0ZXJhdGVlQ2FsbFwiOjh9XSwxMjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4oZnVuY3Rpb24gKHByb2Nlc3Mpe1xuICAvKiBnbG9iYWxzIHJlcXVpcmUsIG1vZHVsZSAqL1xuXG4gICd1c2Ugc3RyaWN0JztcblxuICAvKipcbiAgICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAgICovXG5cbiAgdmFyIHBhdGh0b1JlZ2V4cCA9IHJlcXVpcmUoJ3BhdGgtdG8tcmVnZXhwJyk7XG5cbiAgLyoqXG4gICAqIE1vZHVsZSBleHBvcnRzLlxuICAgKi9cblxuICBtb2R1bGUuZXhwb3J0cyA9IHBhZ2U7XG5cbiAgLyoqXG4gICAqIERldGVjdCBjbGljayBldmVudFxuICAgKi9cbiAgdmFyIGNsaWNrRXZlbnQgPSAoJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBkb2N1bWVudCkgJiYgZG9jdW1lbnQub250b3VjaHN0YXJ0ID8gJ3RvdWNoc3RhcnQnIDogJ2NsaWNrJztcblxuICAvKipcbiAgICogVG8gd29yayBwcm9wZXJseSB3aXRoIHRoZSBVUkxcbiAgICogaGlzdG9yeS5sb2NhdGlvbiBnZW5lcmF0ZWQgcG9seWZpbGwgaW4gaHR0cHM6Ly9naXRodWIuY29tL2Rldm90ZS9IVE1MNS1IaXN0b3J5LUFQSVxuICAgKi9cblxuICB2YXIgbG9jYXRpb24gPSAoJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiB3aW5kb3cpICYmICh3aW5kb3cuaGlzdG9yeS5sb2NhdGlvbiB8fCB3aW5kb3cubG9jYXRpb24pO1xuXG4gIC8qKlxuICAgKiBQZXJmb3JtIGluaXRpYWwgZGlzcGF0Y2guXG4gICAqL1xuXG4gIHZhciBkaXNwYXRjaCA9IHRydWU7XG5cblxuICAvKipcbiAgICogRGVjb2RlIFVSTCBjb21wb25lbnRzIChxdWVyeSBzdHJpbmcsIHBhdGhuYW1lLCBoYXNoKS5cbiAgICogQWNjb21tb2RhdGVzIGJvdGggcmVndWxhciBwZXJjZW50IGVuY29kaW5nIGFuZCB4LXd3dy1mb3JtLXVybGVuY29kZWQgZm9ybWF0LlxuICAgKi9cbiAgdmFyIGRlY29kZVVSTENvbXBvbmVudHMgPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBCYXNlIHBhdGguXG4gICAqL1xuXG4gIHZhciBiYXNlID0gJyc7XG5cbiAgLyoqXG4gICAqIFJ1bm5pbmcgZmxhZy5cbiAgICovXG5cbiAgdmFyIHJ1bm5pbmc7XG5cbiAgLyoqXG4gICAqIEhhc2hCYW5nIG9wdGlvblxuICAgKi9cblxuICB2YXIgaGFzaGJhbmcgPSBmYWxzZTtcblxuICAvKipcbiAgICogUHJldmlvdXMgY29udGV4dCwgZm9yIGNhcHR1cmluZ1xuICAgKiBwYWdlIGV4aXQgZXZlbnRzLlxuICAgKi9cblxuICB2YXIgcHJldkNvbnRleHQ7XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGBwYXRoYCB3aXRoIGNhbGxiYWNrIGBmbigpYCxcbiAgICogb3Igcm91dGUgYHBhdGhgLCBvciByZWRpcmVjdGlvbixcbiAgICogb3IgYHBhZ2Uuc3RhcnQoKWAuXG4gICAqXG4gICAqICAgcGFnZShmbik7XG4gICAqICAgcGFnZSgnKicsIGZuKTtcbiAgICogICBwYWdlKCcvdXNlci86aWQnLCBsb2FkLCB1c2VyKTtcbiAgICogICBwYWdlKCcvdXNlci8nICsgdXNlci5pZCwgeyBzb21lOiAndGhpbmcnIH0pO1xuICAgKiAgIHBhZ2UoJy91c2VyLycgKyB1c2VyLmlkKTtcbiAgICogICBwYWdlKCcvZnJvbScsICcvdG8nKVxuICAgKiAgIHBhZ2UoKTtcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd8RnVuY3Rpb259IHBhdGhcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4uLi5cbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgZnVuY3Rpb24gcGFnZShwYXRoLCBmbikge1xuICAgIC8vIDxjYWxsYmFjaz5cbiAgICBpZiAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIHBhdGgpIHtcbiAgICAgIHJldHVybiBwYWdlKCcqJywgcGF0aCk7XG4gICAgfVxuXG4gICAgLy8gcm91dGUgPHBhdGg+IHRvIDxjYWxsYmFjayAuLi4+XG4gICAgaWYgKCdmdW5jdGlvbicgPT09IHR5cGVvZiBmbikge1xuICAgICAgdmFyIHJvdXRlID0gbmV3IFJvdXRlKHBhdGgpO1xuICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgcGFnZS5jYWxsYmFja3MucHVzaChyb3V0ZS5taWRkbGV3YXJlKGFyZ3VtZW50c1tpXSkpO1xuICAgICAgfVxuICAgICAgLy8gc2hvdyA8cGF0aD4gd2l0aCBbc3RhdGVdXG4gICAgfSBlbHNlIGlmICgnc3RyaW5nJyA9PT0gdHlwZW9mIHBhdGgpIHtcbiAgICAgIHBhZ2VbJ3N0cmluZycgPT09IHR5cGVvZiBmbiA/ICdyZWRpcmVjdCcgOiAnc2hvdyddKHBhdGgsIGZuKTtcbiAgICAgIC8vIHN0YXJ0IFtvcHRpb25zXVxuICAgIH0gZWxzZSB7XG4gICAgICBwYWdlLnN0YXJ0KHBhdGgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayBmdW5jdGlvbnMuXG4gICAqL1xuXG4gIHBhZ2UuY2FsbGJhY2tzID0gW107XG4gIHBhZ2UuZXhpdHMgPSBbXTtcblxuICAvKipcbiAgICogQ3VycmVudCBwYXRoIGJlaW5nIHByb2Nlc3NlZFxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgcGFnZS5jdXJyZW50ID0gJyc7XG5cbiAgLyoqXG4gICAqIE51bWJlciBvZiBwYWdlcyBuYXZpZ2F0ZWQgdG8uXG4gICAqIEB0eXBlIHtudW1iZXJ9XG4gICAqXG4gICAqICAgICBwYWdlLmxlbiA9PSAwO1xuICAgKiAgICAgcGFnZSgnL2xvZ2luJyk7XG4gICAqICAgICBwYWdlLmxlbiA9PSAxO1xuICAgKi9cblxuICBwYWdlLmxlbiA9IDA7XG5cbiAgLyoqXG4gICAqIEdldCBvciBzZXQgYmFzZXBhdGggdG8gYHBhdGhgLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBwYWdlLmJhc2UgPSBmdW5jdGlvbihwYXRoKSB7XG4gICAgaWYgKDAgPT09IGFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBiYXNlO1xuICAgIGJhc2UgPSBwYXRoO1xuICB9O1xuXG4gIC8qKlxuICAgKiBCaW5kIHdpdGggdGhlIGdpdmVuIGBvcHRpb25zYC5cbiAgICpcbiAgICogT3B0aW9uczpcbiAgICpcbiAgICogICAgLSBgY2xpY2tgIGJpbmQgdG8gY2xpY2sgZXZlbnRzIFt0cnVlXVxuICAgKiAgICAtIGBwb3BzdGF0ZWAgYmluZCB0byBwb3BzdGF0ZSBbdHJ1ZV1cbiAgICogICAgLSBgZGlzcGF0Y2hgIHBlcmZvcm0gaW5pdGlhbCBkaXNwYXRjaCBbdHJ1ZV1cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgcGFnZS5zdGFydCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBpZiAocnVubmluZykgcmV0dXJuO1xuICAgIHJ1bm5pbmcgPSB0cnVlO1xuICAgIGlmIChmYWxzZSA9PT0gb3B0aW9ucy5kaXNwYXRjaCkgZGlzcGF0Y2ggPSBmYWxzZTtcbiAgICBpZiAoZmFsc2UgPT09IG9wdGlvbnMuZGVjb2RlVVJMQ29tcG9uZW50cykgZGVjb2RlVVJMQ29tcG9uZW50cyA9IGZhbHNlO1xuICAgIGlmIChmYWxzZSAhPT0gb3B0aW9ucy5wb3BzdGF0ZSkgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgb25wb3BzdGF0ZSwgZmFsc2UpO1xuICAgIGlmIChmYWxzZSAhPT0gb3B0aW9ucy5jbGljaykge1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihjbGlja0V2ZW50LCBvbmNsaWNrLCBmYWxzZSk7XG4gICAgfVxuICAgIGlmICh0cnVlID09PSBvcHRpb25zLmhhc2hiYW5nKSBoYXNoYmFuZyA9IHRydWU7XG4gICAgaWYgKCFkaXNwYXRjaCkgcmV0dXJuO1xuICAgIHZhciB1cmwgPSAoaGFzaGJhbmcgJiYgfmxvY2F0aW9uLmhhc2guaW5kZXhPZignIyEnKSkgPyBsb2NhdGlvbi5oYXNoLnN1YnN0cigyKSArIGxvY2F0aW9uLnNlYXJjaCA6IGxvY2F0aW9uLnBhdGhuYW1lICsgbG9jYXRpb24uc2VhcmNoICsgbG9jYXRpb24uaGFzaDtcbiAgICBwYWdlLnJlcGxhY2UodXJsLCBudWxsLCB0cnVlLCBkaXNwYXRjaCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFVuYmluZCBjbGljayBhbmQgcG9wc3RhdGUgZXZlbnQgaGFuZGxlcnMuXG4gICAqXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIHBhZ2Uuc3RvcCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICghcnVubmluZykgcmV0dXJuO1xuICAgIHBhZ2UuY3VycmVudCA9ICcnO1xuICAgIHBhZ2UubGVuID0gMDtcbiAgICBydW5uaW5nID0gZmFsc2U7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihjbGlja0V2ZW50LCBvbmNsaWNrLCBmYWxzZSk7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgb25wb3BzdGF0ZSwgZmFsc2UpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTaG93IGBwYXRoYCB3aXRoIG9wdGlvbmFsIGBzdGF0ZWAgb2JqZWN0LlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICAgKiBAcGFyYW0ge09iamVjdH0gc3RhdGVcbiAgICogQHBhcmFtIHtCb29sZWFufSBkaXNwYXRjaFxuICAgKiBAcmV0dXJuIHtDb250ZXh0fVxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBwYWdlLnNob3cgPSBmdW5jdGlvbihwYXRoLCBzdGF0ZSwgZGlzcGF0Y2gsIHB1c2gpIHtcbiAgICB2YXIgY3R4ID0gbmV3IENvbnRleHQocGF0aCwgc3RhdGUpO1xuICAgIHBhZ2UuY3VycmVudCA9IGN0eC5wYXRoO1xuICAgIGlmIChmYWxzZSAhPT0gZGlzcGF0Y2gpIHBhZ2UuZGlzcGF0Y2goY3R4KTtcbiAgICBpZiAoZmFsc2UgIT09IGN0eC5oYW5kbGVkICYmIGZhbHNlICE9PSBwdXNoKSBjdHgucHVzaFN0YXRlKCk7XG4gICAgcmV0dXJuIGN0eDtcbiAgfTtcblxuICAvKipcbiAgICogR29lcyBiYWNrIGluIHRoZSBoaXN0b3J5XG4gICAqIEJhY2sgc2hvdWxkIGFsd2F5cyBsZXQgdGhlIGN1cnJlbnQgcm91dGUgcHVzaCBzdGF0ZSBhbmQgdGhlbiBnbyBiYWNrLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aCAtIGZhbGxiYWNrIHBhdGggdG8gZ28gYmFjayBpZiBubyBtb3JlIGhpc3RvcnkgZXhpc3RzLCBpZiB1bmRlZmluZWQgZGVmYXVsdHMgdG8gcGFnZS5iYXNlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbc3RhdGVdXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIHBhZ2UuYmFjayA9IGZ1bmN0aW9uKHBhdGgsIHN0YXRlKSB7XG4gICAgaWYgKHBhZ2UubGVuID4gMCkge1xuICAgICAgLy8gdGhpcyBtYXkgbmVlZCBtb3JlIHRlc3RpbmcgdG8gc2VlIGlmIGFsbCBicm93c2Vyc1xuICAgICAgLy8gd2FpdCBmb3IgdGhlIG5leHQgdGljayB0byBnbyBiYWNrIGluIGhpc3RvcnlcbiAgICAgIGhpc3RvcnkuYmFjaygpO1xuICAgICAgcGFnZS5sZW4tLTtcbiAgICB9IGVsc2UgaWYgKHBhdGgpIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHBhZ2Uuc2hvdyhwYXRoLCBzdGF0ZSk7XG4gICAgICB9KTtcbiAgICB9ZWxzZXtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHBhZ2Uuc2hvdyhiYXNlLCBzdGF0ZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cblxuICAvKipcbiAgICogUmVnaXN0ZXIgcm91dGUgdG8gcmVkaXJlY3QgZnJvbSBvbmUgcGF0aCB0byBvdGhlclxuICAgKiBvciBqdXN0IHJlZGlyZWN0IHRvIGFub3RoZXIgcm91dGVcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGZyb20gLSBpZiBwYXJhbSAndG8nIGlzIHVuZGVmaW5lZCByZWRpcmVjdHMgdG8gJ2Zyb20nXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbdG9dXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuICBwYWdlLnJlZGlyZWN0ID0gZnVuY3Rpb24oZnJvbSwgdG8pIHtcbiAgICAvLyBEZWZpbmUgcm91dGUgZnJvbSBhIHBhdGggdG8gYW5vdGhlclxuICAgIGlmICgnc3RyaW5nJyA9PT0gdHlwZW9mIGZyb20gJiYgJ3N0cmluZycgPT09IHR5cGVvZiB0bykge1xuICAgICAgcGFnZShmcm9tLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcGFnZS5yZXBsYWNlKHRvKTtcbiAgICAgICAgfSwgMCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBXYWl0IGZvciB0aGUgcHVzaCBzdGF0ZSBhbmQgcmVwbGFjZSBpdCB3aXRoIGFub3RoZXJcbiAgICBpZiAoJ3N0cmluZycgPT09IHR5cGVvZiBmcm9tICYmICd1bmRlZmluZWQnID09PSB0eXBlb2YgdG8pIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHBhZ2UucmVwbGFjZShmcm9tKTtcbiAgICAgIH0sIDApO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogUmVwbGFjZSBgcGF0aGAgd2l0aCBvcHRpb25hbCBgc3RhdGVgIG9iamVjdC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlXG4gICAqIEByZXR1cm4ge0NvbnRleHR9XG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG5cbiAgcGFnZS5yZXBsYWNlID0gZnVuY3Rpb24ocGF0aCwgc3RhdGUsIGluaXQsIGRpc3BhdGNoKSB7XG4gICAgdmFyIGN0eCA9IG5ldyBDb250ZXh0KHBhdGgsIHN0YXRlKTtcbiAgICBwYWdlLmN1cnJlbnQgPSBjdHgucGF0aDtcbiAgICBjdHguaW5pdCA9IGluaXQ7XG4gICAgY3R4LnNhdmUoKTsgLy8gc2F2ZSBiZWZvcmUgZGlzcGF0Y2hpbmcsIHdoaWNoIG1heSByZWRpcmVjdFxuICAgIGlmIChmYWxzZSAhPT0gZGlzcGF0Y2gpIHBhZ2UuZGlzcGF0Y2goY3R4KTtcbiAgICByZXR1cm4gY3R4O1xuICB9O1xuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCB0aGUgZ2l2ZW4gYGN0eGAuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjdHhcbiAgICogQGFwaSBwcml2YXRlXG4gICAqL1xuXG4gIHBhZ2UuZGlzcGF0Y2ggPSBmdW5jdGlvbihjdHgpIHtcbiAgICB2YXIgcHJldiA9IHByZXZDb250ZXh0LFxuICAgICAgaSA9IDAsXG4gICAgICBqID0gMDtcblxuICAgIHByZXZDb250ZXh0ID0gY3R4O1xuXG4gICAgZnVuY3Rpb24gbmV4dEV4aXQoKSB7XG4gICAgICB2YXIgZm4gPSBwYWdlLmV4aXRzW2orK107XG4gICAgICBpZiAoIWZuKSByZXR1cm4gbmV4dEVudGVyKCk7XG4gICAgICBmbihwcmV2LCBuZXh0RXhpdCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbmV4dEVudGVyKCkge1xuICAgICAgdmFyIGZuID0gcGFnZS5jYWxsYmFja3NbaSsrXTtcblxuICAgICAgaWYgKGN0eC5wYXRoICE9PSBwYWdlLmN1cnJlbnQpIHtcbiAgICAgICAgY3R4LmhhbmRsZWQgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKCFmbikgcmV0dXJuIHVuaGFuZGxlZChjdHgpO1xuICAgICAgZm4oY3R4LCBuZXh0RW50ZXIpO1xuICAgIH1cblxuICAgIGlmIChwcmV2KSB7XG4gICAgICBuZXh0RXhpdCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXh0RW50ZXIoKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFVuaGFuZGxlZCBgY3R4YC4gV2hlbiBpdCdzIG5vdCB0aGUgaW5pdGlhbFxuICAgKiBwb3BzdGF0ZSB0aGVuIHJlZGlyZWN0LiBJZiB5b3Ugd2lzaCB0byBoYW5kbGVcbiAgICogNDA0cyBvbiB5b3VyIG93biB1c2UgYHBhZ2UoJyonLCBjYWxsYmFjaylgLlxuICAgKlxuICAgKiBAcGFyYW0ge0NvbnRleHR9IGN0eFxuICAgKiBAYXBpIHByaXZhdGVcbiAgICovXG5cbiAgZnVuY3Rpb24gdW5oYW5kbGVkKGN0eCkge1xuICAgIGlmIChjdHguaGFuZGxlZCkgcmV0dXJuO1xuICAgIHZhciBjdXJyZW50O1xuXG4gICAgaWYgKGhhc2hiYW5nKSB7XG4gICAgICBjdXJyZW50ID0gYmFzZSArIGxvY2F0aW9uLmhhc2gucmVwbGFjZSgnIyEnLCAnJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN1cnJlbnQgPSBsb2NhdGlvbi5wYXRobmFtZSArIGxvY2F0aW9uLnNlYXJjaDtcbiAgICB9XG5cbiAgICBpZiAoY3VycmVudCA9PT0gY3R4LmNhbm9uaWNhbFBhdGgpIHJldHVybjtcbiAgICBwYWdlLnN0b3AoKTtcbiAgICBjdHguaGFuZGxlZCA9IGZhbHNlO1xuICAgIGxvY2F0aW9uLmhyZWYgPSBjdHguY2Fub25pY2FsUGF0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhbiBleGl0IHJvdXRlIG9uIGBwYXRoYCB3aXRoXG4gICAqIGNhbGxiYWNrIGBmbigpYCwgd2hpY2ggd2lsbCBiZSBjYWxsZWRcbiAgICogb24gdGhlIHByZXZpb3VzIGNvbnRleHQgd2hlbiBhIG5ld1xuICAgKiBwYWdlIGlzIHZpc2l0ZWQuXG4gICAqL1xuICBwYWdlLmV4aXQgPSBmdW5jdGlvbihwYXRoLCBmbikge1xuICAgIGlmICh0eXBlb2YgcGF0aCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIHBhZ2UuZXhpdCgnKicsIHBhdGgpO1xuICAgIH1cblxuICAgIHZhciByb3V0ZSA9IG5ldyBSb3V0ZShwYXRoKTtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7ICsraSkge1xuICAgICAgcGFnZS5leGl0cy5wdXNoKHJvdXRlLm1pZGRsZXdhcmUoYXJndW1lbnRzW2ldKSk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBSZW1vdmUgVVJMIGVuY29kaW5nIGZyb20gdGhlIGdpdmVuIGBzdHJgLlxuICAgKiBBY2NvbW1vZGF0ZXMgd2hpdGVzcGFjZSBpbiBib3RoIHgtd3d3LWZvcm0tdXJsZW5jb2RlZFxuICAgKiBhbmQgcmVndWxhciBwZXJjZW50LWVuY29kZWQgZm9ybS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJ9IFVSTCBjb21wb25lbnQgdG8gZGVjb2RlXG4gICAqL1xuICBmdW5jdGlvbiBkZWNvZGVVUkxFbmNvZGVkVVJJQ29tcG9uZW50KHZhbCkge1xuICAgIGlmICh0eXBlb2YgdmFsICE9PSAnc3RyaW5nJykgeyByZXR1cm4gdmFsOyB9XG4gICAgcmV0dXJuIGRlY29kZVVSTENvbXBvbmVudHMgPyBkZWNvZGVVUklDb21wb25lbnQodmFsLnJlcGxhY2UoL1xcKy9nLCAnICcpKSA6IHZhbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIGEgbmV3IFwicmVxdWVzdFwiIGBDb250ZXh0YFxuICAgKiB3aXRoIHRoZSBnaXZlbiBgcGF0aGAgYW5kIG9wdGlvbmFsIGluaXRpYWwgYHN0YXRlYC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIGZ1bmN0aW9uIENvbnRleHQocGF0aCwgc3RhdGUpIHtcbiAgICBpZiAoJy8nID09PSBwYXRoWzBdICYmIDAgIT09IHBhdGguaW5kZXhPZihiYXNlKSkgcGF0aCA9IGJhc2UgKyAoaGFzaGJhbmcgPyAnIyEnIDogJycpICsgcGF0aDtcbiAgICB2YXIgaSA9IHBhdGguaW5kZXhPZignPycpO1xuXG4gICAgdGhpcy5jYW5vbmljYWxQYXRoID0gcGF0aDtcbiAgICB0aGlzLnBhdGggPSBwYXRoLnJlcGxhY2UoYmFzZSwgJycpIHx8ICcvJztcbiAgICBpZiAoaGFzaGJhbmcpIHRoaXMucGF0aCA9IHRoaXMucGF0aC5yZXBsYWNlKCcjIScsICcnKSB8fCAnLyc7XG5cbiAgICB0aGlzLnRpdGxlID0gZG9jdW1lbnQudGl0bGU7XG4gICAgdGhpcy5zdGF0ZSA9IHN0YXRlIHx8IHt9O1xuICAgIHRoaXMuc3RhdGUucGF0aCA9IHBhdGg7XG4gICAgdGhpcy5xdWVyeXN0cmluZyA9IH5pID8gZGVjb2RlVVJMRW5jb2RlZFVSSUNvbXBvbmVudChwYXRoLnNsaWNlKGkgKyAxKSkgOiAnJztcbiAgICB0aGlzLnBhdGhuYW1lID0gZGVjb2RlVVJMRW5jb2RlZFVSSUNvbXBvbmVudCh+aSA/IHBhdGguc2xpY2UoMCwgaSkgOiBwYXRoKTtcbiAgICB0aGlzLnBhcmFtcyA9IHt9O1xuXG4gICAgLy8gZnJhZ21lbnRcbiAgICB0aGlzLmhhc2ggPSAnJztcbiAgICBpZiAoIWhhc2hiYW5nKSB7XG4gICAgICBpZiAoIX50aGlzLnBhdGguaW5kZXhPZignIycpKSByZXR1cm47XG4gICAgICB2YXIgcGFydHMgPSB0aGlzLnBhdGguc3BsaXQoJyMnKTtcbiAgICAgIHRoaXMucGF0aCA9IHBhcnRzWzBdO1xuICAgICAgdGhpcy5oYXNoID0gZGVjb2RlVVJMRW5jb2RlZFVSSUNvbXBvbmVudChwYXJ0c1sxXSkgfHwgJyc7XG4gICAgICB0aGlzLnF1ZXJ5c3RyaW5nID0gdGhpcy5xdWVyeXN0cmluZy5zcGxpdCgnIycpWzBdO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFeHBvc2UgYENvbnRleHRgLlxuICAgKi9cblxuICBwYWdlLkNvbnRleHQgPSBDb250ZXh0O1xuXG4gIC8qKlxuICAgKiBQdXNoIHN0YXRlLlxuICAgKlxuICAgKiBAYXBpIHByaXZhdGVcbiAgICovXG5cbiAgQ29udGV4dC5wcm90b3R5cGUucHVzaFN0YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgcGFnZS5sZW4rKztcbiAgICBoaXN0b3J5LnB1c2hTdGF0ZSh0aGlzLnN0YXRlLCB0aGlzLnRpdGxlLCBoYXNoYmFuZyAmJiB0aGlzLnBhdGggIT09ICcvJyA/ICcjIScgKyB0aGlzLnBhdGggOiB0aGlzLmNhbm9uaWNhbFBhdGgpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTYXZlIHRoZSBjb250ZXh0IHN0YXRlLlxuICAgKlxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBDb250ZXh0LnByb3RvdHlwZS5zYXZlID0gZnVuY3Rpb24oKSB7XG4gICAgaGlzdG9yeS5yZXBsYWNlU3RhdGUodGhpcy5zdGF0ZSwgdGhpcy50aXRsZSwgaGFzaGJhbmcgJiYgdGhpcy5wYXRoICE9PSAnLycgPyAnIyEnICsgdGhpcy5wYXRoIDogdGhpcy5jYW5vbmljYWxQYXRoKTtcbiAgfTtcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBgUm91dGVgIHdpdGggdGhlIGdpdmVuIEhUVFAgYHBhdGhgLFxuICAgKiBhbmQgYW4gYXJyYXkgb2YgYGNhbGxiYWNrc2AgYW5kIGBvcHRpb25zYC5cbiAgICpcbiAgICogT3B0aW9uczpcbiAgICpcbiAgICogICAtIGBzZW5zaXRpdmVgICAgIGVuYWJsZSBjYXNlLXNlbnNpdGl2ZSByb3V0ZXNcbiAgICogICAtIGBzdHJpY3RgICAgICAgIGVuYWJsZSBzdHJpY3QgbWF0Y2hpbmcgZm9yIHRyYWlsaW5nIHNsYXNoZXNcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMuXG4gICAqIEBhcGkgcHJpdmF0ZVxuICAgKi9cblxuICBmdW5jdGlvbiBSb3V0ZShwYXRoLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdGhpcy5wYXRoID0gKHBhdGggPT09ICcqJykgPyAnKC4qKScgOiBwYXRoO1xuICAgIHRoaXMubWV0aG9kID0gJ0dFVCc7XG4gICAgdGhpcy5yZWdleHAgPSBwYXRodG9SZWdleHAodGhpcy5wYXRoLFxuICAgICAgdGhpcy5rZXlzID0gW10sXG4gICAgICBvcHRpb25zLnNlbnNpdGl2ZSxcbiAgICAgIG9wdGlvbnMuc3RyaWN0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHBvc2UgYFJvdXRlYC5cbiAgICovXG5cbiAgcGFnZS5Sb3V0ZSA9IFJvdXRlO1xuXG4gIC8qKlxuICAgKiBSZXR1cm4gcm91dGUgbWlkZGxld2FyZSB3aXRoXG4gICAqIHRoZSBnaXZlbiBjYWxsYmFjayBgZm4oKWAuXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBSb3V0ZS5wcm90b3R5cGUubWlkZGxld2FyZSA9IGZ1bmN0aW9uKGZuKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiBmdW5jdGlvbihjdHgsIG5leHQpIHtcbiAgICAgIGlmIChzZWxmLm1hdGNoKGN0eC5wYXRoLCBjdHgucGFyYW1zKSkgcmV0dXJuIGZuKGN0eCwgbmV4dCk7XG4gICAgICBuZXh0KCk7XG4gICAgfTtcbiAgfTtcblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhpcyByb3V0ZSBtYXRjaGVzIGBwYXRoYCwgaWYgc29cbiAgICogcG9wdWxhdGUgYHBhcmFtc2AuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICogQGFwaSBwcml2YXRlXG4gICAqL1xuXG4gIFJvdXRlLnByb3RvdHlwZS5tYXRjaCA9IGZ1bmN0aW9uKHBhdGgsIHBhcmFtcykge1xuICAgIHZhciBrZXlzID0gdGhpcy5rZXlzLFxuICAgICAgcXNJbmRleCA9IHBhdGguaW5kZXhPZignPycpLFxuICAgICAgcGF0aG5hbWUgPSB+cXNJbmRleCA/IHBhdGguc2xpY2UoMCwgcXNJbmRleCkgOiBwYXRoLFxuICAgICAgbSA9IHRoaXMucmVnZXhwLmV4ZWMoZGVjb2RlVVJJQ29tcG9uZW50KHBhdGhuYW1lKSk7XG5cbiAgICBpZiAoIW0pIHJldHVybiBmYWxzZTtcblxuICAgIGZvciAodmFyIGkgPSAxLCBsZW4gPSBtLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICB2YXIga2V5ID0ga2V5c1tpIC0gMV07XG4gICAgICB2YXIgdmFsID0gZGVjb2RlVVJMRW5jb2RlZFVSSUNvbXBvbmVudChtW2ldKTtcbiAgICAgIGlmICh2YWwgIT09IHVuZGVmaW5lZCB8fCAhKGhhc093blByb3BlcnR5LmNhbGwocGFyYW1zLCBrZXkubmFtZSkpKSB7XG4gICAgICAgIHBhcmFtc1trZXkubmFtZV0gPSB2YWw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cblxuICAvKipcbiAgICogSGFuZGxlIFwicG9wdWxhdGVcIiBldmVudHMuXG4gICAqL1xuXG4gIHZhciBvbnBvcHN0YXRlID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbG9hZGVkID0gZmFsc2U7XG4gICAgaWYgKCd1bmRlZmluZWQnID09PSB0eXBlb2Ygd2luZG93KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnKSB7XG4gICAgICBsb2FkZWQgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGxvYWRlZCA9IHRydWU7XG4gICAgICAgIH0sIDApO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbiBvbnBvcHN0YXRlKGUpIHtcbiAgICAgIGlmICghbG9hZGVkKSByZXR1cm47XG4gICAgICBpZiAoZS5zdGF0ZSkge1xuICAgICAgICB2YXIgcGF0aCA9IGUuc3RhdGUucGF0aDtcbiAgICAgICAgcGFnZS5yZXBsYWNlKHBhdGgsIGUuc3RhdGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFnZS5zaG93KGxvY2F0aW9uLnBhdGhuYW1lICsgbG9jYXRpb24uaGFzaCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9O1xuICB9KSgpO1xuICAvKipcbiAgICogSGFuZGxlIFwiY2xpY2tcIiBldmVudHMuXG4gICAqL1xuXG4gIGZ1bmN0aW9uIG9uY2xpY2soZSkge1xuXG4gICAgaWYgKDEgIT09IHdoaWNoKGUpKSByZXR1cm47XG5cbiAgICBpZiAoZS5tZXRhS2V5IHx8IGUuY3RybEtleSB8fCBlLnNoaWZ0S2V5KSByZXR1cm47XG4gICAgaWYgKGUuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xuXG5cblxuICAgIC8vIGVuc3VyZSBsaW5rXG4gICAgdmFyIGVsID0gZS50YXJnZXQ7XG4gICAgd2hpbGUgKGVsICYmICdBJyAhPT0gZWwubm9kZU5hbWUpIGVsID0gZWwucGFyZW50Tm9kZTtcbiAgICBpZiAoIWVsIHx8ICdBJyAhPT0gZWwubm9kZU5hbWUpIHJldHVybjtcblxuXG5cbiAgICAvLyBJZ25vcmUgaWYgdGFnIGhhc1xuICAgIC8vIDEuIFwiZG93bmxvYWRcIiBhdHRyaWJ1dGVcbiAgICAvLyAyLiByZWw9XCJleHRlcm5hbFwiIGF0dHJpYnV0ZVxuICAgIGlmIChlbC5oYXNBdHRyaWJ1dGUoJ2Rvd25sb2FkJykgfHwgZWwuZ2V0QXR0cmlidXRlKCdyZWwnKSA9PT0gJ2V4dGVybmFsJykgcmV0dXJuO1xuXG4gICAgLy8gZW5zdXJlIG5vbi1oYXNoIGZvciB0aGUgc2FtZSBwYXRoXG4gICAgdmFyIGxpbmsgPSBlbC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcbiAgICBpZiAoIWhhc2hiYW5nICYmIGVsLnBhdGhuYW1lID09PSBsb2NhdGlvbi5wYXRobmFtZSAmJiAoZWwuaGFzaCB8fCAnIycgPT09IGxpbmspKSByZXR1cm47XG5cblxuXG4gICAgLy8gQ2hlY2sgZm9yIG1haWx0bzogaW4gdGhlIGhyZWZcbiAgICBpZiAobGluayAmJiBsaW5rLmluZGV4T2YoJ21haWx0bzonKSA+IC0xKSByZXR1cm47XG5cbiAgICAvLyBjaGVjayB0YXJnZXRcbiAgICBpZiAoZWwudGFyZ2V0KSByZXR1cm47XG5cbiAgICAvLyB4LW9yaWdpblxuICAgIGlmICghc2FtZU9yaWdpbihlbC5ocmVmKSkgcmV0dXJuO1xuXG5cblxuICAgIC8vIHJlYnVpbGQgcGF0aFxuICAgIHZhciBwYXRoID0gZWwucGF0aG5hbWUgKyBlbC5zZWFyY2ggKyAoZWwuaGFzaCB8fCAnJyk7XG5cbiAgICAvLyBzdHJpcCBsZWFkaW5nIFwiL1tkcml2ZSBsZXR0ZXJdOlwiIG9uIE5XLmpzIG9uIFdpbmRvd3NcbiAgICBpZiAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHBhdGgubWF0Y2goL15cXC9bYS16QS1aXTpcXC8vKSkge1xuICAgICAgcGF0aCA9IHBhdGgucmVwbGFjZSgvXlxcL1thLXpBLVpdOlxcLy8sICcvJyk7XG4gICAgfVxuXG4gICAgLy8gc2FtZSBwYWdlXG4gICAgdmFyIG9yaWcgPSBwYXRoO1xuXG4gICAgaWYgKHBhdGguaW5kZXhPZihiYXNlKSA9PT0gMCkge1xuICAgICAgcGF0aCA9IHBhdGguc3Vic3RyKGJhc2UubGVuZ3RoKTtcbiAgICB9XG5cbiAgICBpZiAoaGFzaGJhbmcpIHBhdGggPSBwYXRoLnJlcGxhY2UoJyMhJywgJycpO1xuXG4gICAgaWYgKGJhc2UgJiYgb3JpZyA9PT0gcGF0aCkgcmV0dXJuO1xuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHBhZ2Uuc2hvdyhvcmlnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFdmVudCBidXR0b24uXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHdoaWNoKGUpIHtcbiAgICBlID0gZSB8fCB3aW5kb3cuZXZlbnQ7XG4gICAgcmV0dXJuIG51bGwgPT09IGUud2hpY2ggPyBlLmJ1dHRvbiA6IGUud2hpY2g7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgYGhyZWZgIGlzIHRoZSBzYW1lIG9yaWdpbi5cbiAgICovXG5cbiAgZnVuY3Rpb24gc2FtZU9yaWdpbihocmVmKSB7XG4gICAgdmFyIG9yaWdpbiA9IGxvY2F0aW9uLnByb3RvY29sICsgJy8vJyArIGxvY2F0aW9uLmhvc3RuYW1lO1xuICAgIGlmIChsb2NhdGlvbi5wb3J0KSBvcmlnaW4gKz0gJzonICsgbG9jYXRpb24ucG9ydDtcbiAgICByZXR1cm4gKGhyZWYgJiYgKDAgPT09IGhyZWYuaW5kZXhPZihvcmlnaW4pKSk7XG4gIH1cblxuICBwYWdlLnNhbWVPcmlnaW4gPSBzYW1lT3JpZ2luO1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZSgnX3Byb2Nlc3MnKSlcbn0se1wiX3Byb2Nlc3NcIjoxNCxcInBhdGgtdG8tcmVnZXhwXCI6MTN9XSwxMzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG52YXIgaXNBcnJheSA9IHJlcXVpcmUoJ2lzYXJyYXknKTtcblxuLyoqXG4gKiBFeHBvc2UgYHBhdGhUb1JlZ2V4cGAuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gcGF0aFRvUmVnZXhwO1xuXG4vKipcbiAqIFRoZSBtYWluIHBhdGggbWF0Y2hpbmcgcmVnZXhwIHV0aWxpdHkuXG4gKlxuICogQHR5cGUge1JlZ0V4cH1cbiAqL1xudmFyIFBBVEhfUkVHRVhQID0gbmV3IFJlZ0V4cChbXG4gIC8vIE1hdGNoIGVzY2FwZWQgY2hhcmFjdGVycyB0aGF0IHdvdWxkIG90aGVyd2lzZSBhcHBlYXIgaW4gZnV0dXJlIG1hdGNoZXMuXG4gIC8vIFRoaXMgYWxsb3dzIHRoZSB1c2VyIHRvIGVzY2FwZSBzcGVjaWFsIGNoYXJhY3RlcnMgdGhhdCB3b24ndCB0cmFuc2Zvcm0uXG4gICcoXFxcXFxcXFwuKScsXG4gIC8vIE1hdGNoIEV4cHJlc3Mtc3R5bGUgcGFyYW1ldGVycyBhbmQgdW4tbmFtZWQgcGFyYW1ldGVycyB3aXRoIGEgcHJlZml4XG4gIC8vIGFuZCBvcHRpb25hbCBzdWZmaXhlcy4gTWF0Y2hlcyBhcHBlYXIgYXM6XG4gIC8vXG4gIC8vIFwiLzp0ZXN0KFxcXFxkKyk/XCIgPT4gW1wiL1wiLCBcInRlc3RcIiwgXCJcXGQrXCIsIHVuZGVmaW5lZCwgXCI/XCJdXG4gIC8vIFwiL3JvdXRlKFxcXFxkKylcIiA9PiBbdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgXCJcXGQrXCIsIHVuZGVmaW5lZF1cbiAgJyhbXFxcXC8uXSk/KD86XFxcXDooXFxcXHcrKSg/OlxcXFwoKCg/OlxcXFxcXFxcLnxbXildKSopXFxcXCkpP3xcXFxcKCgoPzpcXFxcXFxcXC58W14pXSkqKVxcXFwpKShbKyo/XSk/JyxcbiAgLy8gTWF0Y2ggcmVnZXhwIHNwZWNpYWwgY2hhcmFjdGVycyB0aGF0IGFyZSBhbHdheXMgZXNjYXBlZC5cbiAgJyhbLisqPz1eIToke30oKVtcXFxcXXxcXFxcL10pJ1xuXS5qb2luKCd8JyksICdnJyk7XG5cbi8qKlxuICogRXNjYXBlIHRoZSBjYXB0dXJpbmcgZ3JvdXAgYnkgZXNjYXBpbmcgc3BlY2lhbCBjaGFyYWN0ZXJzIGFuZCBtZWFuaW5nLlxuICpcbiAqIEBwYXJhbSAge1N0cmluZ30gZ3JvdXBcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZnVuY3Rpb24gZXNjYXBlR3JvdXAgKGdyb3VwKSB7XG4gIHJldHVybiBncm91cC5yZXBsYWNlKC8oWz0hOiRcXC8oKV0pL2csICdcXFxcJDEnKTtcbn1cblxuLyoqXG4gKiBBdHRhY2ggdGhlIGtleXMgYXMgYSBwcm9wZXJ0eSBvZiB0aGUgcmVnZXhwLlxuICpcbiAqIEBwYXJhbSAge1JlZ0V4cH0gcmVcbiAqIEBwYXJhbSAge0FycmF5fSAga2V5c1xuICogQHJldHVybiB7UmVnRXhwfVxuICovXG5mdW5jdGlvbiBhdHRhY2hLZXlzIChyZSwga2V5cykge1xuICByZS5rZXlzID0ga2V5cztcbiAgcmV0dXJuIHJlO1xufVxuXG4vKipcbiAqIEdldCB0aGUgZmxhZ3MgZm9yIGEgcmVnZXhwIGZyb20gdGhlIG9wdGlvbnMuXG4gKlxuICogQHBhcmFtICB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGZsYWdzIChvcHRpb25zKSB7XG4gIHJldHVybiBvcHRpb25zLnNlbnNpdGl2ZSA/ICcnIDogJ2knO1xufVxuXG4vKipcbiAqIFB1bGwgb3V0IGtleXMgZnJvbSBhIHJlZ2V4cC5cbiAqXG4gKiBAcGFyYW0gIHtSZWdFeHB9IHBhdGhcbiAqIEBwYXJhbSAge0FycmF5fSAga2V5c1xuICogQHJldHVybiB7UmVnRXhwfVxuICovXG5mdW5jdGlvbiByZWdleHBUb1JlZ2V4cCAocGF0aCwga2V5cykge1xuICAvLyBVc2UgYSBuZWdhdGl2ZSBsb29rYWhlYWQgdG8gbWF0Y2ggb25seSBjYXB0dXJpbmcgZ3JvdXBzLlxuICB2YXIgZ3JvdXBzID0gcGF0aC5zb3VyY2UubWF0Y2goL1xcKCg/IVxcPykvZyk7XG5cbiAgaWYgKGdyb3Vwcykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZ3JvdXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBrZXlzLnB1c2goe1xuICAgICAgICBuYW1lOiAgICAgIGksXG4gICAgICAgIGRlbGltaXRlcjogbnVsbCxcbiAgICAgICAgb3B0aW9uYWw6ICBmYWxzZSxcbiAgICAgICAgcmVwZWF0OiAgICBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGF0dGFjaEtleXMocGF0aCwga2V5cyk7XG59XG5cbi8qKlxuICogVHJhbnNmb3JtIGFuIGFycmF5IGludG8gYSByZWdleHAuXG4gKlxuICogQHBhcmFtICB7QXJyYXl9ICBwYXRoXG4gKiBAcGFyYW0gIHtBcnJheX0gIGtleXNcbiAqIEBwYXJhbSAge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7UmVnRXhwfVxuICovXG5mdW5jdGlvbiBhcnJheVRvUmVnZXhwIChwYXRoLCBrZXlzLCBvcHRpb25zKSB7XG4gIHZhciBwYXJ0cyA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcGF0aC5sZW5ndGg7IGkrKykge1xuICAgIHBhcnRzLnB1c2gocGF0aFRvUmVnZXhwKHBhdGhbaV0sIGtleXMsIG9wdGlvbnMpLnNvdXJjZSk7XG4gIH1cblxuICB2YXIgcmVnZXhwID0gbmV3IFJlZ0V4cCgnKD86JyArIHBhcnRzLmpvaW4oJ3wnKSArICcpJywgZmxhZ3Mob3B0aW9ucykpO1xuICByZXR1cm4gYXR0YWNoS2V5cyhyZWdleHAsIGtleXMpO1xufVxuXG4vKipcbiAqIFJlcGxhY2UgdGhlIHNwZWNpZmljIHRhZ3Mgd2l0aCByZWdleHAgc3RyaW5ncy5cbiAqXG4gKiBAcGFyYW0gIHtTdHJpbmd9IHBhdGhcbiAqIEBwYXJhbSAge0FycmF5fSAga2V5c1xuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5mdW5jdGlvbiByZXBsYWNlUGF0aCAocGF0aCwga2V5cykge1xuICB2YXIgaW5kZXggPSAwO1xuXG4gIGZ1bmN0aW9uIHJlcGxhY2UgKF8sIGVzY2FwZWQsIHByZWZpeCwga2V5LCBjYXB0dXJlLCBncm91cCwgc3VmZml4LCBlc2NhcGUpIHtcbiAgICBpZiAoZXNjYXBlZCkge1xuICAgICAgcmV0dXJuIGVzY2FwZWQ7XG4gICAgfVxuXG4gICAgaWYgKGVzY2FwZSkge1xuICAgICAgcmV0dXJuICdcXFxcJyArIGVzY2FwZTtcbiAgICB9XG5cbiAgICB2YXIgcmVwZWF0ICAgPSBzdWZmaXggPT09ICcrJyB8fCBzdWZmaXggPT09ICcqJztcbiAgICB2YXIgb3B0aW9uYWwgPSBzdWZmaXggPT09ICc/JyB8fCBzdWZmaXggPT09ICcqJztcblxuICAgIGtleXMucHVzaCh7XG4gICAgICBuYW1lOiAgICAgIGtleSB8fCBpbmRleCsrLFxuICAgICAgZGVsaW1pdGVyOiBwcmVmaXggfHwgJy8nLFxuICAgICAgb3B0aW9uYWw6ICBvcHRpb25hbCxcbiAgICAgIHJlcGVhdDogICAgcmVwZWF0XG4gICAgfSk7XG5cbiAgICBwcmVmaXggPSBwcmVmaXggPyAoJ1xcXFwnICsgcHJlZml4KSA6ICcnO1xuICAgIGNhcHR1cmUgPSBlc2NhcGVHcm91cChjYXB0dXJlIHx8IGdyb3VwIHx8ICdbXicgKyAocHJlZml4IHx8ICdcXFxcLycpICsgJ10rPycpO1xuXG4gICAgaWYgKHJlcGVhdCkge1xuICAgICAgY2FwdHVyZSA9IGNhcHR1cmUgKyAnKD86JyArIHByZWZpeCArIGNhcHR1cmUgKyAnKSonO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25hbCkge1xuICAgICAgcmV0dXJuICcoPzonICsgcHJlZml4ICsgJygnICsgY2FwdHVyZSArICcpKT8nO1xuICAgIH1cblxuICAgIC8vIEJhc2ljIHBhcmFtZXRlciBzdXBwb3J0LlxuICAgIHJldHVybiBwcmVmaXggKyAnKCcgKyBjYXB0dXJlICsgJyknO1xuICB9XG5cbiAgcmV0dXJuIHBhdGgucmVwbGFjZShQQVRIX1JFR0VYUCwgcmVwbGFjZSk7XG59XG5cbi8qKlxuICogTm9ybWFsaXplIHRoZSBnaXZlbiBwYXRoIHN0cmluZywgcmV0dXJuaW5nIGEgcmVndWxhciBleHByZXNzaW9uLlxuICpcbiAqIEFuIGVtcHR5IGFycmF5IGNhbiBiZSBwYXNzZWQgaW4gZm9yIHRoZSBrZXlzLCB3aGljaCB3aWxsIGhvbGQgdGhlXG4gKiBwbGFjZWhvbGRlciBrZXkgZGVzY3JpcHRpb25zLiBGb3IgZXhhbXBsZSwgdXNpbmcgYC91c2VyLzppZGAsIGBrZXlzYCB3aWxsXG4gKiBjb250YWluIGBbeyBuYW1lOiAnaWQnLCBkZWxpbWl0ZXI6ICcvJywgb3B0aW9uYWw6IGZhbHNlLCByZXBlYXQ6IGZhbHNlIH1dYC5cbiAqXG4gKiBAcGFyYW0gIHsoU3RyaW5nfFJlZ0V4cHxBcnJheSl9IHBhdGhcbiAqIEBwYXJhbSAge0FycmF5fSAgICAgICAgICAgICAgICAgW2tleXNdXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgICAgICAgIFtvcHRpb25zXVxuICogQHJldHVybiB7UmVnRXhwfVxuICovXG5mdW5jdGlvbiBwYXRoVG9SZWdleHAgKHBhdGgsIGtleXMsIG9wdGlvbnMpIHtcbiAga2V5cyA9IGtleXMgfHwgW107XG5cbiAgaWYgKCFpc0FycmF5KGtleXMpKSB7XG4gICAgb3B0aW9ucyA9IGtleXM7XG4gICAga2V5cyA9IFtdO1xuICB9IGVsc2UgaWYgKCFvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgaWYgKHBhdGggaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICByZXR1cm4gcmVnZXhwVG9SZWdleHAocGF0aCwga2V5cywgb3B0aW9ucyk7XG4gIH1cblxuICBpZiAoaXNBcnJheShwYXRoKSkge1xuICAgIHJldHVybiBhcnJheVRvUmVnZXhwKHBhdGgsIGtleXMsIG9wdGlvbnMpO1xuICB9XG5cbiAgdmFyIHN0cmljdCA9IG9wdGlvbnMuc3RyaWN0O1xuICB2YXIgZW5kID0gb3B0aW9ucy5lbmQgIT09IGZhbHNlO1xuICB2YXIgcm91dGUgPSByZXBsYWNlUGF0aChwYXRoLCBrZXlzKTtcbiAgdmFyIGVuZHNXaXRoU2xhc2ggPSBwYXRoLmNoYXJBdChwYXRoLmxlbmd0aCAtIDEpID09PSAnLyc7XG5cbiAgLy8gSW4gbm9uLXN0cmljdCBtb2RlIHdlIGFsbG93IGEgc2xhc2ggYXQgdGhlIGVuZCBvZiBtYXRjaC4gSWYgdGhlIHBhdGggdG9cbiAgLy8gbWF0Y2ggYWxyZWFkeSBlbmRzIHdpdGggYSBzbGFzaCwgd2UgcmVtb3ZlIGl0IGZvciBjb25zaXN0ZW5jeS4gVGhlIHNsYXNoXG4gIC8vIGlzIHZhbGlkIGF0IHRoZSBlbmQgb2YgYSBwYXRoIG1hdGNoLCBub3QgaW4gdGhlIG1pZGRsZS4gVGhpcyBpcyBpbXBvcnRhbnRcbiAgLy8gaW4gbm9uLWVuZGluZyBtb2RlLCB3aGVyZSBcIi90ZXN0L1wiIHNob3VsZG4ndCBtYXRjaCBcIi90ZXN0Ly9yb3V0ZVwiLlxuICBpZiAoIXN0cmljdCkge1xuICAgIHJvdXRlID0gKGVuZHNXaXRoU2xhc2ggPyByb3V0ZS5zbGljZSgwLCAtMikgOiByb3V0ZSkgKyAnKD86XFxcXC8oPz0kKSk/JztcbiAgfVxuXG4gIGlmIChlbmQpIHtcbiAgICByb3V0ZSArPSAnJCc7XG4gIH0gZWxzZSB7XG4gICAgLy8gSW4gbm9uLWVuZGluZyBtb2RlLCB3ZSBuZWVkIHRoZSBjYXB0dXJpbmcgZ3JvdXBzIHRvIG1hdGNoIGFzIG11Y2ggYXNcbiAgICAvLyBwb3NzaWJsZSBieSB1c2luZyBhIHBvc2l0aXZlIGxvb2thaGVhZCB0byB0aGUgZW5kIG9yIG5leHQgcGF0aCBzZWdtZW50LlxuICAgIHJvdXRlICs9IHN0cmljdCAmJiBlbmRzV2l0aFNsYXNoID8gJycgOiAnKD89XFxcXC98JCknO1xuICB9XG5cbiAgcmV0dXJuIGF0dGFjaEtleXMobmV3IFJlZ0V4cCgnXicgKyByb3V0ZSwgZmxhZ3Mob3B0aW9ucykpLCBrZXlzKTtcbn1cblxufSx7XCJpc2FycmF5XCI6MX1dLDE0OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBzZXRUaW1lb3V0KGRyYWluUXVldWUsIDApO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuXG59LHt9XSwxNTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbnZhciBwYWQgPSBmdW5jdGlvbiBwYWQobnVtKSB7XG4gIHJldHVybiAoXCIwXCIgKyBudW0pLnNsaWNlKC0yKTtcbn07XG5cbi8vIFVzZSB0aGUgbmV3IHBlcmZvcm1hbmNlIGFwaSB0byBnZXQgYmV0dGVyIHByZWNpc2lvbiBpZiBhdmFpbGFibGVcbnZhciB0aW1lciA9IHR5cGVvZiBwZXJmb3JtYW5jZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgcGVyZm9ybWFuY2Uubm93ID09PSBcImZ1bmN0aW9uXCIgPyBwZXJmb3JtYW5jZSA6IERhdGU7XG5cbi8qKlxuICogQ3JlYXRlcyBsb2dnZXIgd2l0aCBmb2xsb3dlZCBvcHRpb25zXG4gKlxuICogQG5hbWVzcGFjZVxuICogQHByb3BlcnR5IHtvYmplY3R9IG9wdGlvbnMgLSBvcHRpb25zIGZvciBsb2dnZXJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBvcHRpb25zLmxldmVsIC0gY29uc29sZVtsZXZlbF1cbiAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBvcHRpb25zLmxvZ2dlciAtIGltcGxlbWVudGF0aW9uIG9mIHRoZSBgY29uc29sZWAgQVBJLlxuICogQHByb3BlcnR5IHtib29sZWFufSBvcHRpb25zLmNvbGxhcHNlZCAtIGlzIGdyb3VwIGNvbGxhcHNlZD9cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gb3B0aW9ucy5wcmVkaWNhdGUgLSBjb25kaXRpb24gd2hpY2ggcmVzb2x2ZXMgbG9nZ2VyIGJlaGF2aW9yXG4gKiBAcHJvcGVydHkge2Jvb2x9IG9wdGlvbnMuZHVyYXRpb24gLSBwcmludCBkdXJhdGlvbiBvZiBlYWNoIGFjdGlvbj9cbiAqIEBwcm9wZXJ0eSB7Ym9vbH0gb3B0aW9ucy50aW1lc3RhbXAgLSBwcmludCB0aW1lc3RhbXAgd2l0aCBlYWNoIGFjdGlvbj9cbiAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb259IG9wdGlvbnMudHJhbnNmb3JtZXIgLSB0cmFuc2Zvcm0gc3RhdGUgYmVmb3JlIHByaW50XG4gKiBAcHJvcGVydHkge2Z1bmN0aW9ufSBvcHRpb25zLmFjdGlvblRyYW5zZm9ybWVyIC0gdHJhbnNmb3JtIGFjdGlvbiBiZWZvcmUgcHJpbnRcbiAqL1xuXG5mdW5jdGlvbiBjcmVhdGVMb2dnZXIoKSB7XG4gIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMF07XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChfcmVmKSB7XG4gICAgdmFyIGdldFN0YXRlID0gX3JlZi5nZXRTdGF0ZTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKG5leHQpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgICAgIHZhciBsZXZlbCA9IG9wdGlvbnMubGV2ZWw7XG4gICAgICAgIHZhciBsb2dnZXIgPSBvcHRpb25zLmxvZ2dlcjtcbiAgICAgICAgdmFyIGNvbGxhcHNlZCA9IG9wdGlvbnMuY29sbGFwc2VkO1xuICAgICAgICB2YXIgcHJlZGljYXRlID0gb3B0aW9ucy5wcmVkaWNhdGU7XG4gICAgICAgIHZhciBfb3B0aW9ucyRkdXJhdGlvbiA9IG9wdGlvbnMuZHVyYXRpb247XG4gICAgICAgIHZhciBkdXJhdGlvbiA9IF9vcHRpb25zJGR1cmF0aW9uID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IF9vcHRpb25zJGR1cmF0aW9uO1xuICAgICAgICB2YXIgX29wdGlvbnMkdGltZXN0YW1wID0gb3B0aW9ucy50aW1lc3RhbXA7XG4gICAgICAgIHZhciB0aW1lc3RhbXAgPSBfb3B0aW9ucyR0aW1lc3RhbXAgPT09IHVuZGVmaW5lZCA/IHRydWUgOiBfb3B0aW9ucyR0aW1lc3RhbXA7XG4gICAgICAgIHZhciBfb3B0aW9ucyR0cmFuc2Zvcm1lciA9IG9wdGlvbnMudHJhbnNmb3JtZXI7XG4gICAgICAgIHZhciB0cmFuc2Zvcm1lciA9IF9vcHRpb25zJHRyYW5zZm9ybWVyID09PSB1bmRlZmluZWQgPyBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICAgIH0gOiBfb3B0aW9ucyR0cmFuc2Zvcm1lcjtcbiAgICAgICAgdmFyIF9vcHRpb25zJGFjdGlvblRyYW5zZm9ybWVyID0gb3B0aW9ucy5hY3Rpb25UcmFuc2Zvcm1lcjtcbiAgICAgICAgdmFyIGFjdGlvblRyYW5zZm9ybWVyID0gX29wdGlvbnMkYWN0aW9uVHJhbnNmb3JtZXIgPT09IHVuZGVmaW5lZCA/IGZ1bmN0aW9uIChhY3RuKSB7XG4gICAgICAgICAgcmV0dXJuIGFjdG47XG4gICAgICAgIH0gOiBfb3B0aW9ucyRhY3Rpb25UcmFuc2Zvcm1lcjtcblxuICAgICAgICB2YXIgY29uc29sZSA9IGxvZ2dlciB8fCB3aW5kb3cuY29uc29sZTtcblxuICAgICAgICAvLyBleGl0IGlmIGNvbnNvbGUgdW5kZWZpbmVkXG4gICAgICAgIGlmICh0eXBlb2YgY29uc29sZSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIHJldHVybiBuZXh0KGFjdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBleGl0IGVhcmx5IGlmIHByZWRpY2F0ZSBmdW5jdGlvbiByZXR1cm5zIGZhbHNlXG4gICAgICAgIGlmICh0eXBlb2YgcHJlZGljYXRlID09PSBcImZ1bmN0aW9uXCIgJiYgIXByZWRpY2F0ZShnZXRTdGF0ZSwgYWN0aW9uKSkge1xuICAgICAgICAgIHJldHVybiBuZXh0KGFjdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc3RhcnRlZCA9IHRpbWVyLm5vdygpO1xuICAgICAgICB2YXIgcHJldlN0YXRlID0gdHJhbnNmb3JtZXIoZ2V0U3RhdGUoKSk7XG5cbiAgICAgICAgdmFyIHJldHVyblZhbHVlID0gbmV4dChhY3Rpb24pO1xuICAgICAgICB2YXIgdG9vayA9IHRpbWVyLm5vdygpIC0gc3RhcnRlZDtcblxuICAgICAgICB2YXIgbmV4dFN0YXRlID0gdHJhbnNmb3JtZXIoZ2V0U3RhdGUoKSk7XG5cbiAgICAgICAgLy8gZm9ybWF0dGVyc1xuICAgICAgICB2YXIgdGltZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgIHZhciBpc0NvbGxhcHNlZCA9IHR5cGVvZiBjb2xsYXBzZWQgPT09IFwiZnVuY3Rpb25cIiA/IGNvbGxhcHNlZChnZXRTdGF0ZSwgYWN0aW9uKSA6IGNvbGxhcHNlZDtcblxuICAgICAgICB2YXIgZm9ybWF0dGVkVGltZSA9IHRpbWVzdGFtcCA/IFwiIEAgXCIgKyB0aW1lLmdldEhvdXJzKCkgKyBcIjpcIiArIHBhZCh0aW1lLmdldE1pbnV0ZXMoKSkgKyBcIjpcIiArIHBhZCh0aW1lLmdldFNlY29uZHMoKSkgOiBcIlwiO1xuICAgICAgICB2YXIgZm9ybWF0dGVkRHVyYXRpb24gPSBkdXJhdGlvbiA/IFwiIGluIFwiICsgdG9vay50b0ZpeGVkKDIpICsgXCIgbXNcIiA6IFwiXCI7XG4gICAgICAgIHZhciBmb3JtYXR0ZWRBY3Rpb24gPSBhY3Rpb25UcmFuc2Zvcm1lcihhY3Rpb24pO1xuICAgICAgICB2YXIgbWVzc2FnZSA9IFwiYWN0aW9uIFwiICsgZm9ybWF0dGVkQWN0aW9uLnR5cGUgKyBmb3JtYXR0ZWRUaW1lICsgZm9ybWF0dGVkRHVyYXRpb247XG5cbiAgICAgICAgLy8gcmVuZGVyXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaXNDb2xsYXBzZWQgPyBjb25zb2xlLmdyb3VwQ29sbGFwc2VkKG1lc3NhZ2UpIDogY29uc29sZS5ncm91cChtZXNzYWdlKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxldmVsKSB7XG4gICAgICAgICAgY29uc29sZVtsZXZlbF0oXCIlYyBwcmV2IHN0YXRlXCIsIFwiY29sb3I6ICM5RTlFOUU7IGZvbnQtd2VpZ2h0OiBib2xkXCIsIHByZXZTdGF0ZSk7XG4gICAgICAgICAgY29uc29sZVtsZXZlbF0oXCIlYyBhY3Rpb25cIiwgXCJjb2xvcjogIzAzQTlGNDsgZm9udC13ZWlnaHQ6IGJvbGRcIiwgZm9ybWF0dGVkQWN0aW9uKTtcbiAgICAgICAgICBjb25zb2xlW2xldmVsXShcIiVjIG5leHQgc3RhdGVcIiwgXCJjb2xvcjogIzRDQUY1MDsgZm9udC13ZWlnaHQ6IGJvbGRcIiwgbmV4dFN0YXRlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIiVjIHByZXYgc3RhdGVcIiwgXCJjb2xvcjogIzlFOUU5RTsgZm9udC13ZWlnaHQ6IGJvbGRcIiwgcHJldlN0YXRlKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIiVjIGFjdGlvblwiLCBcImNvbG9yOiAjMDNBOUY0OyBmb250LXdlaWdodDogYm9sZFwiLCBmb3JtYXR0ZWRBY3Rpb24pO1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiJWMgbmV4dCBzdGF0ZVwiLCBcImNvbG9yOiAjNENBRjUwOyBmb250LXdlaWdodDogYm9sZFwiLCBuZXh0U3RhdGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zb2xlLmdyb3VwRW5kKCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIuKAlOKAlCBsb2cgZW5kIOKAlOKAlFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgICAgIH07XG4gICAgfTtcbiAgfTtcbn1cblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBjcmVhdGVMb2dnZXI7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdO1xufSx7fV0sMTY6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1snZGVmYXVsdCddID0gdGh1bmtNaWRkbGV3YXJlO1xuXG5mdW5jdGlvbiB0aHVua01pZGRsZXdhcmUoX3JlZikge1xuICB2YXIgZGlzcGF0Y2ggPSBfcmVmLmRpc3BhdGNoO1xuICB2YXIgZ2V0U3RhdGUgPSBfcmVmLmdldFN0YXRlO1xuXG4gIHJldHVybiBmdW5jdGlvbiAobmV4dCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIGFjdGlvbiA9PT0gJ2Z1bmN0aW9uJyA/IGFjdGlvbihkaXNwYXRjaCwgZ2V0U3RhdGUpIDogbmV4dChhY3Rpb24pO1xuICAgIH07XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xufSx7fV0sMTc6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1snZGVmYXVsdCddID0gY3JlYXRlU3RvcmU7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF91dGlsc0lzUGxhaW5PYmplY3QgPSByZXF1aXJlKCcuL3V0aWxzL2lzUGxhaW5PYmplY3QnKTtcblxudmFyIF91dGlsc0lzUGxhaW5PYmplY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdXRpbHNJc1BsYWluT2JqZWN0KTtcblxuLyoqXG4gKiBUaGVzZSBhcmUgcHJpdmF0ZSBhY3Rpb24gdHlwZXMgcmVzZXJ2ZWQgYnkgUmVkdXguXG4gKiBGb3IgYW55IHVua25vd24gYWN0aW9ucywgeW91IG11c3QgcmV0dXJuIHRoZSBjdXJyZW50IHN0YXRlLlxuICogSWYgdGhlIGN1cnJlbnQgc3RhdGUgaXMgdW5kZWZpbmVkLCB5b3UgbXVzdCByZXR1cm4gdGhlIGluaXRpYWwgc3RhdGUuXG4gKiBEbyBub3QgcmVmZXJlbmNlIHRoZXNlIGFjdGlvbiB0eXBlcyBkaXJlY3RseSBpbiB5b3VyIGNvZGUuXG4gKi9cbnZhciBBY3Rpb25UeXBlcyA9IHtcbiAgSU5JVDogJ0BAcmVkdXgvSU5JVCdcbn07XG5cbmV4cG9ydHMuQWN0aW9uVHlwZXMgPSBBY3Rpb25UeXBlcztcbi8qKlxuICogQ3JlYXRlcyBhIFJlZHV4IHN0b3JlIHRoYXQgaG9sZHMgdGhlIHN0YXRlIHRyZWUuXG4gKiBUaGUgb25seSB3YXkgdG8gY2hhbmdlIHRoZSBkYXRhIGluIHRoZSBzdG9yZSBpcyB0byBjYWxsIGBkaXNwYXRjaCgpYCBvbiBpdC5cbiAqXG4gKiBUaGVyZSBzaG91bGQgb25seSBiZSBhIHNpbmdsZSBzdG9yZSBpbiB5b3VyIGFwcC4gVG8gc3BlY2lmeSBob3cgZGlmZmVyZW50XG4gKiBwYXJ0cyBvZiB0aGUgc3RhdGUgdHJlZSByZXNwb25kIHRvIGFjdGlvbnMsIHlvdSBtYXkgY29tYmluZSBzZXZlcmFsIHJlZHVjZXJzXG4gKiBpbnRvIGEgc2luZ2xlIHJlZHVjZXIgZnVuY3Rpb24gYnkgdXNpbmcgYGNvbWJpbmVSZWR1Y2Vyc2AuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVkdWNlciBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgbmV4dCBzdGF0ZSB0cmVlLCBnaXZlblxuICogdGhlIGN1cnJlbnQgc3RhdGUgdHJlZSBhbmQgdGhlIGFjdGlvbiB0byBoYW5kbGUuXG4gKlxuICogQHBhcmFtIHthbnl9IFtpbml0aWFsU3RhdGVdIFRoZSBpbml0aWFsIHN0YXRlLiBZb3UgbWF5IG9wdGlvbmFsbHkgc3BlY2lmeSBpdFxuICogdG8gaHlkcmF0ZSB0aGUgc3RhdGUgZnJvbSB0aGUgc2VydmVyIGluIHVuaXZlcnNhbCBhcHBzLCBvciB0byByZXN0b3JlIGFcbiAqIHByZXZpb3VzbHkgc2VyaWFsaXplZCB1c2VyIHNlc3Npb24uXG4gKiBJZiB5b3UgdXNlIGBjb21iaW5lUmVkdWNlcnNgIHRvIHByb2R1Y2UgdGhlIHJvb3QgcmVkdWNlciBmdW5jdGlvbiwgdGhpcyBtdXN0IGJlXG4gKiBhbiBvYmplY3Qgd2l0aCB0aGUgc2FtZSBzaGFwZSBhcyBgY29tYmluZVJlZHVjZXJzYCBrZXlzLlxuICpcbiAqIEByZXR1cm5zIHtTdG9yZX0gQSBSZWR1eCBzdG9yZSB0aGF0IGxldHMgeW91IHJlYWQgdGhlIHN0YXRlLCBkaXNwYXRjaCBhY3Rpb25zXG4gKiBhbmQgc3Vic2NyaWJlIHRvIGNoYW5nZXMuXG4gKi9cblxuZnVuY3Rpb24gY3JlYXRlU3RvcmUocmVkdWNlciwgaW5pdGlhbFN0YXRlKSB7XG4gIGlmICh0eXBlb2YgcmVkdWNlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgdGhlIHJlZHVjZXIgdG8gYmUgYSBmdW5jdGlvbi4nKTtcbiAgfVxuXG4gIHZhciBjdXJyZW50UmVkdWNlciA9IHJlZHVjZXI7XG4gIHZhciBjdXJyZW50U3RhdGUgPSBpbml0aWFsU3RhdGU7XG4gIHZhciBsaXN0ZW5lcnMgPSBbXTtcbiAgdmFyIGlzRGlzcGF0Y2hpbmcgPSBmYWxzZTtcblxuICAvKipcbiAgICogUmVhZHMgdGhlIHN0YXRlIHRyZWUgbWFuYWdlZCBieSB0aGUgc3RvcmUuXG4gICAqXG4gICAqIEByZXR1cm5zIHthbnl9IFRoZSBjdXJyZW50IHN0YXRlIHRyZWUgb2YgeW91ciBhcHBsaWNhdGlvbi5cbiAgICovXG4gIGZ1bmN0aW9uIGdldFN0YXRlKCkge1xuICAgIHJldHVybiBjdXJyZW50U3RhdGU7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGNoYW5nZSBsaXN0ZW5lci4gSXQgd2lsbCBiZSBjYWxsZWQgYW55IHRpbWUgYW4gYWN0aW9uIGlzIGRpc3BhdGNoZWQsXG4gICAqIGFuZCBzb21lIHBhcnQgb2YgdGhlIHN0YXRlIHRyZWUgbWF5IHBvdGVudGlhbGx5IGhhdmUgY2hhbmdlZC4gWW91IG1heSB0aGVuXG4gICAqIGNhbGwgYGdldFN0YXRlKClgIHRvIHJlYWQgdGhlIGN1cnJlbnQgc3RhdGUgdHJlZSBpbnNpZGUgdGhlIGNhbGxiYWNrLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBBIGNhbGxiYWNrIHRvIGJlIGludm9rZWQgb24gZXZlcnkgZGlzcGF0Y2guXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gQSBmdW5jdGlvbiB0byByZW1vdmUgdGhpcyBjaGFuZ2UgbGlzdGVuZXIuXG4gICAqL1xuICBmdW5jdGlvbiBzdWJzY3JpYmUobGlzdGVuZXIpIHtcbiAgICBsaXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gdW5zdWJzY3JpYmUoKSB7XG4gICAgICB2YXIgaW5kZXggPSBsaXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lcik7XG4gICAgICBsaXN0ZW5lcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoZXMgYW4gYWN0aW9uLiBJdCBpcyB0aGUgb25seSB3YXkgdG8gdHJpZ2dlciBhIHN0YXRlIGNoYW5nZS5cbiAgICpcbiAgICogVGhlIGByZWR1Y2VyYCBmdW5jdGlvbiwgdXNlZCB0byBjcmVhdGUgdGhlIHN0b3JlLCB3aWxsIGJlIGNhbGxlZCB3aXRoIHRoZVxuICAgKiBjdXJyZW50IHN0YXRlIHRyZWUgYW5kIHRoZSBnaXZlbiBgYWN0aW9uYC4gSXRzIHJldHVybiB2YWx1ZSB3aWxsXG4gICAqIGJlIGNvbnNpZGVyZWQgdGhlICoqbmV4dCoqIHN0YXRlIG9mIHRoZSB0cmVlLCBhbmQgdGhlIGNoYW5nZSBsaXN0ZW5lcnNcbiAgICogd2lsbCBiZSBub3RpZmllZC5cbiAgICpcbiAgICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb25seSBzdXBwb3J0cyBwbGFpbiBvYmplY3QgYWN0aW9ucy4gSWYgeW91IHdhbnQgdG9cbiAgICogZGlzcGF0Y2ggYSBQcm9taXNlLCBhbiBPYnNlcnZhYmxlLCBhIHRodW5rLCBvciBzb21ldGhpbmcgZWxzZSwgeW91IG5lZWQgdG9cbiAgICogd3JhcCB5b3VyIHN0b3JlIGNyZWF0aW5nIGZ1bmN0aW9uIGludG8gdGhlIGNvcnJlc3BvbmRpbmcgbWlkZGxld2FyZS4gRm9yXG4gICAqIGV4YW1wbGUsIHNlZSB0aGUgZG9jdW1lbnRhdGlvbiBmb3IgdGhlIGByZWR1eC10aHVua2AgcGFja2FnZS4gRXZlbiB0aGVcbiAgICogbWlkZGxld2FyZSB3aWxsIGV2ZW50dWFsbHkgZGlzcGF0Y2ggcGxhaW4gb2JqZWN0IGFjdGlvbnMgdXNpbmcgdGhpcyBtZXRob2QuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhY3Rpb24gQSBwbGFpbiBvYmplY3QgcmVwcmVzZW50aW5nIOKAnHdoYXQgY2hhbmdlZOKAnS4gSXQgaXNcbiAgICogYSBnb29kIGlkZWEgdG8ga2VlcCBhY3Rpb25zIHNlcmlhbGl6YWJsZSBzbyB5b3UgY2FuIHJlY29yZCBhbmQgcmVwbGF5IHVzZXJcbiAgICogc2Vzc2lvbnMsIG9yIHVzZSB0aGUgdGltZSB0cmF2ZWxsaW5nIGByZWR1eC1kZXZ0b29sc2AuIEFuIGFjdGlvbiBtdXN0IGhhdmVcbiAgICogYSBgdHlwZWAgcHJvcGVydHkgd2hpY2ggbWF5IG5vdCBiZSBgdW5kZWZpbmVkYC4gSXQgaXMgYSBnb29kIGlkZWEgdG8gdXNlXG4gICAqIHN0cmluZyBjb25zdGFudHMgZm9yIGFjdGlvbiB0eXBlcy5cbiAgICpcbiAgICogQHJldHVybnMge09iamVjdH0gRm9yIGNvbnZlbmllbmNlLCB0aGUgc2FtZSBhY3Rpb24gb2JqZWN0IHlvdSBkaXNwYXRjaGVkLlxuICAgKlxuICAgKiBOb3RlIHRoYXQsIGlmIHlvdSB1c2UgYSBjdXN0b20gbWlkZGxld2FyZSwgaXQgbWF5IHdyYXAgYGRpc3BhdGNoKClgIHRvXG4gICAqIHJldHVybiBzb21ldGhpbmcgZWxzZSAoZm9yIGV4YW1wbGUsIGEgUHJvbWlzZSB5b3UgY2FuIGF3YWl0KS5cbiAgICovXG4gIGZ1bmN0aW9uIGRpc3BhdGNoKGFjdGlvbikge1xuICAgIGlmICghX3V0aWxzSXNQbGFpbk9iamVjdDJbJ2RlZmF1bHQnXShhY3Rpb24pKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FjdGlvbnMgbXVzdCBiZSBwbGFpbiBvYmplY3RzLiAnICsgJ1VzZSBjdXN0b20gbWlkZGxld2FyZSBmb3IgYXN5bmMgYWN0aW9ucy4nKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGFjdGlvbi50eXBlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBY3Rpb25zIG1heSBub3QgaGF2ZSBhbiB1bmRlZmluZWQgXCJ0eXBlXCIgcHJvcGVydHkuICcgKyAnSGF2ZSB5b3UgbWlzc3BlbGxlZCBhIGNvbnN0YW50PycpO1xuICAgIH1cblxuICAgIGlmIChpc0Rpc3BhdGNoaW5nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlZHVjZXJzIG1heSBub3QgZGlzcGF0Y2ggYWN0aW9ucy4nKTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgaXNEaXNwYXRjaGluZyA9IHRydWU7XG4gICAgICBjdXJyZW50U3RhdGUgPSBjdXJyZW50UmVkdWNlcihjdXJyZW50U3RhdGUsIGFjdGlvbik7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlzRGlzcGF0Y2hpbmcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBsaXN0ZW5lcnMuc2xpY2UoKS5mb3JFYWNoKGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgICAgcmV0dXJuIGxpc3RlbmVyKCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGFjdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXBsYWNlcyB0aGUgcmVkdWNlciBjdXJyZW50bHkgdXNlZCBieSB0aGUgc3RvcmUgdG8gY2FsY3VsYXRlIHRoZSBzdGF0ZS5cbiAgICpcbiAgICogWW91IG1pZ2h0IG5lZWQgdGhpcyBpZiB5b3VyIGFwcCBpbXBsZW1lbnRzIGNvZGUgc3BsaXR0aW5nIGFuZCB5b3Ugd2FudCB0b1xuICAgKiBsb2FkIHNvbWUgb2YgdGhlIHJlZHVjZXJzIGR5bmFtaWNhbGx5LiBZb3UgbWlnaHQgYWxzbyBuZWVkIHRoaXMgaWYgeW91XG4gICAqIGltcGxlbWVudCBhIGhvdCByZWxvYWRpbmcgbWVjaGFuaXNtIGZvciBSZWR1eC5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gbmV4dFJlZHVjZXIgVGhlIHJlZHVjZXIgZm9yIHRoZSBzdG9yZSB0byB1c2UgaW5zdGVhZC5cbiAgICogQHJldHVybnMge3ZvaWR9XG4gICAqL1xuICBmdW5jdGlvbiByZXBsYWNlUmVkdWNlcihuZXh0UmVkdWNlcikge1xuICAgIGN1cnJlbnRSZWR1Y2VyID0gbmV4dFJlZHVjZXI7XG4gICAgZGlzcGF0Y2goeyB0eXBlOiBBY3Rpb25UeXBlcy5JTklUIH0pO1xuICB9XG5cbiAgLy8gV2hlbiBhIHN0b3JlIGlzIGNyZWF0ZWQsIGFuIFwiSU5JVFwiIGFjdGlvbiBpcyBkaXNwYXRjaGVkIHNvIHRoYXQgZXZlcnlcbiAgLy8gcmVkdWNlciByZXR1cm5zIHRoZWlyIGluaXRpYWwgc3RhdGUuIFRoaXMgZWZmZWN0aXZlbHkgcG9wdWxhdGVzXG4gIC8vIHRoZSBpbml0aWFsIHN0YXRlIHRyZWUuXG4gIGRpc3BhdGNoKHsgdHlwZTogQWN0aW9uVHlwZXMuSU5JVCB9KTtcblxuICByZXR1cm4ge1xuICAgIGRpc3BhdGNoOiBkaXNwYXRjaCxcbiAgICBzdWJzY3JpYmU6IHN1YnNjcmliZSxcbiAgICBnZXRTdGF0ZTogZ2V0U3RhdGUsXG4gICAgcmVwbGFjZVJlZHVjZXI6IHJlcGxhY2VSZWR1Y2VyXG4gIH07XG59XG59LHtcIi4vdXRpbHMvaXNQbGFpbk9iamVjdFwiOjIzfV0sMTg6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfY3JlYXRlU3RvcmUgPSByZXF1aXJlKCcuL2NyZWF0ZVN0b3JlJyk7XG5cbnZhciBfY3JlYXRlU3RvcmUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY3JlYXRlU3RvcmUpO1xuXG52YXIgX3V0aWxzQ29tYmluZVJlZHVjZXJzID0gcmVxdWlyZSgnLi91dGlscy9jb21iaW5lUmVkdWNlcnMnKTtcblxudmFyIF91dGlsc0NvbWJpbmVSZWR1Y2VyczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF91dGlsc0NvbWJpbmVSZWR1Y2Vycyk7XG5cbnZhciBfdXRpbHNCaW5kQWN0aW9uQ3JlYXRvcnMgPSByZXF1aXJlKCcuL3V0aWxzL2JpbmRBY3Rpb25DcmVhdG9ycycpO1xuXG52YXIgX3V0aWxzQmluZEFjdGlvbkNyZWF0b3JzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3V0aWxzQmluZEFjdGlvbkNyZWF0b3JzKTtcblxudmFyIF91dGlsc0FwcGx5TWlkZGxld2FyZSA9IHJlcXVpcmUoJy4vdXRpbHMvYXBwbHlNaWRkbGV3YXJlJyk7XG5cbnZhciBfdXRpbHNBcHBseU1pZGRsZXdhcmUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdXRpbHNBcHBseU1pZGRsZXdhcmUpO1xuXG52YXIgX3V0aWxzQ29tcG9zZSA9IHJlcXVpcmUoJy4vdXRpbHMvY29tcG9zZScpO1xuXG52YXIgX3V0aWxzQ29tcG9zZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF91dGlsc0NvbXBvc2UpO1xuXG5leHBvcnRzLmNyZWF0ZVN0b3JlID0gX2NyZWF0ZVN0b3JlMlsnZGVmYXVsdCddO1xuZXhwb3J0cy5jb21iaW5lUmVkdWNlcnMgPSBfdXRpbHNDb21iaW5lUmVkdWNlcnMyWydkZWZhdWx0J107XG5leHBvcnRzLmJpbmRBY3Rpb25DcmVhdG9ycyA9IF91dGlsc0JpbmRBY3Rpb25DcmVhdG9yczJbJ2RlZmF1bHQnXTtcbmV4cG9ydHMuYXBwbHlNaWRkbGV3YXJlID0gX3V0aWxzQXBwbHlNaWRkbGV3YXJlMlsnZGVmYXVsdCddO1xuZXhwb3J0cy5jb21wb3NlID0gX3V0aWxzQ29tcG9zZTJbJ2RlZmF1bHQnXTtcbn0se1wiLi9jcmVhdGVTdG9yZVwiOjE3LFwiLi91dGlscy9hcHBseU1pZGRsZXdhcmVcIjoxOSxcIi4vdXRpbHMvYmluZEFjdGlvbkNyZWF0b3JzXCI6MjAsXCIuL3V0aWxzL2NvbWJpbmVSZWR1Y2Vyc1wiOjIxLFwiLi91dGlscy9jb21wb3NlXCI6MjJ9XSwxOTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGFwcGx5TWlkZGxld2FyZTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX2NvbXBvc2UgPSByZXF1aXJlKCcuL2NvbXBvc2UnKTtcblxudmFyIF9jb21wb3NlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NvbXBvc2UpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBzdG9yZSBlbmhhbmNlciB0aGF0IGFwcGxpZXMgbWlkZGxld2FyZSB0byB0aGUgZGlzcGF0Y2ggbWV0aG9kXG4gKiBvZiB0aGUgUmVkdXggc3RvcmUuIFRoaXMgaXMgaGFuZHkgZm9yIGEgdmFyaWV0eSBvZiB0YXNrcywgc3VjaCBhcyBleHByZXNzaW5nXG4gKiBhc3luY2hyb25vdXMgYWN0aW9ucyBpbiBhIGNvbmNpc2UgbWFubmVyLCBvciBsb2dnaW5nIGV2ZXJ5IGFjdGlvbiBwYXlsb2FkLlxuICpcbiAqIFNlZSBgcmVkdXgtdGh1bmtgIHBhY2thZ2UgYXMgYW4gZXhhbXBsZSBvZiB0aGUgUmVkdXggbWlkZGxld2FyZS5cbiAqXG4gKiBCZWNhdXNlIG1pZGRsZXdhcmUgaXMgcG90ZW50aWFsbHkgYXN5bmNocm9ub3VzLCB0aGlzIHNob3VsZCBiZSB0aGUgZmlyc3RcbiAqIHN0b3JlIGVuaGFuY2VyIGluIHRoZSBjb21wb3NpdGlvbiBjaGFpbi5cbiAqXG4gKiBOb3RlIHRoYXQgZWFjaCBtaWRkbGV3YXJlIHdpbGwgYmUgZ2l2ZW4gdGhlIGBkaXNwYXRjaGAgYW5kIGBnZXRTdGF0ZWAgZnVuY3Rpb25zXG4gKiBhcyBuYW1lZCBhcmd1bWVudHMuXG4gKlxuICogQHBhcmFtIHsuLi5GdW5jdGlvbn0gbWlkZGxld2FyZXMgVGhlIG1pZGRsZXdhcmUgY2hhaW4gdG8gYmUgYXBwbGllZC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gQSBzdG9yZSBlbmhhbmNlciBhcHBseWluZyB0aGUgbWlkZGxld2FyZS5cbiAqL1xuXG5mdW5jdGlvbiBhcHBseU1pZGRsZXdhcmUoKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBtaWRkbGV3YXJlcyA9IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIG1pZGRsZXdhcmVzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChuZXh0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChyZWR1Y2VyLCBpbml0aWFsU3RhdGUpIHtcbiAgICAgIHZhciBzdG9yZSA9IG5leHQocmVkdWNlciwgaW5pdGlhbFN0YXRlKTtcbiAgICAgIHZhciBfZGlzcGF0Y2ggPSBzdG9yZS5kaXNwYXRjaDtcbiAgICAgIHZhciBjaGFpbiA9IFtdO1xuXG4gICAgICB2YXIgbWlkZGxld2FyZUFQSSA9IHtcbiAgICAgICAgZ2V0U3RhdGU6IHN0b3JlLmdldFN0YXRlLFxuICAgICAgICBkaXNwYXRjaDogZnVuY3Rpb24gZGlzcGF0Y2goYWN0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuIF9kaXNwYXRjaChhY3Rpb24pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgY2hhaW4gPSBtaWRkbGV3YXJlcy5tYXAoZnVuY3Rpb24gKG1pZGRsZXdhcmUpIHtcbiAgICAgICAgcmV0dXJuIG1pZGRsZXdhcmUobWlkZGxld2FyZUFQSSk7XG4gICAgICB9KTtcbiAgICAgIF9kaXNwYXRjaCA9IF9jb21wb3NlMlsnZGVmYXVsdCddLmFwcGx5KHVuZGVmaW5lZCwgY2hhaW4pKHN0b3JlLmRpc3BhdGNoKTtcblxuICAgICAgcmV0dXJuIF9leHRlbmRzKHt9LCBzdG9yZSwge1xuICAgICAgICBkaXNwYXRjaDogX2Rpc3BhdGNoXG4gICAgICB9KTtcbiAgICB9O1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcbn0se1wiLi9jb21wb3NlXCI6MjJ9XSwyMDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzWydkZWZhdWx0J10gPSBiaW5kQWN0aW9uQ3JlYXRvcnM7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF91dGlsc01hcFZhbHVlcyA9IHJlcXVpcmUoJy4uL3V0aWxzL21hcFZhbHVlcycpO1xuXG52YXIgX3V0aWxzTWFwVmFsdWVzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3V0aWxzTWFwVmFsdWVzKTtcblxuZnVuY3Rpb24gYmluZEFjdGlvbkNyZWF0b3IoYWN0aW9uQ3JlYXRvciwgZGlzcGF0Y2gpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZGlzcGF0Y2goYWN0aW9uQ3JlYXRvci5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cykpO1xuICB9O1xufVxuXG4vKipcbiAqIFR1cm5zIGFuIG9iamVjdCB3aG9zZSB2YWx1ZXMgYXJlIGFjdGlvbiBjcmVhdG9ycywgaW50byBhbiBvYmplY3Qgd2l0aCB0aGVcbiAqIHNhbWUga2V5cywgYnV0IHdpdGggZXZlcnkgZnVuY3Rpb24gd3JhcHBlZCBpbnRvIGEgYGRpc3BhdGNoYCBjYWxsIHNvIHRoZXlcbiAqIG1heSBiZSBpbnZva2VkIGRpcmVjdGx5LiBUaGlzIGlzIGp1c3QgYSBjb252ZW5pZW5jZSBtZXRob2QsIGFzIHlvdSBjYW4gY2FsbFxuICogYHN0b3JlLmRpc3BhdGNoKE15QWN0aW9uQ3JlYXRvcnMuZG9Tb21ldGhpbmcoKSlgIHlvdXJzZWxmIGp1c3QgZmluZS5cbiAqXG4gKiBGb3IgY29udmVuaWVuY2UsIHlvdSBjYW4gYWxzbyBwYXNzIGEgc2luZ2xlIGZ1bmN0aW9uIGFzIHRoZSBmaXJzdCBhcmd1bWVudCxcbiAqIGFuZCBnZXQgYSBmdW5jdGlvbiBpbiByZXR1cm4uXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbnxPYmplY3R9IGFjdGlvbkNyZWF0b3JzIEFuIG9iamVjdCB3aG9zZSB2YWx1ZXMgYXJlIGFjdGlvblxuICogY3JlYXRvciBmdW5jdGlvbnMuIE9uZSBoYW5keSB3YXkgdG8gb2J0YWluIGl0IGlzIHRvIHVzZSBFUzYgYGltcG9ydCAqIGFzYFxuICogc3ludGF4LiBZb3UgbWF5IGFsc28gcGFzcyBhIHNpbmdsZSBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBkaXNwYXRjaCBUaGUgYGRpc3BhdGNoYCBmdW5jdGlvbiBhdmFpbGFibGUgb24geW91ciBSZWR1eFxuICogc3RvcmUuXG4gKlxuICogQHJldHVybnMge0Z1bmN0aW9ufE9iamVjdH0gVGhlIG9iamVjdCBtaW1pY2tpbmcgdGhlIG9yaWdpbmFsIG9iamVjdCwgYnV0IHdpdGhcbiAqIGV2ZXJ5IGFjdGlvbiBjcmVhdG9yIHdyYXBwZWQgaW50byB0aGUgYGRpc3BhdGNoYCBjYWxsLiBJZiB5b3UgcGFzc2VkIGFcbiAqIGZ1bmN0aW9uIGFzIGBhY3Rpb25DcmVhdG9yc2AsIHRoZSByZXR1cm4gdmFsdWUgd2lsbCBhbHNvIGJlIGEgc2luZ2xlXG4gKiBmdW5jdGlvbi5cbiAqL1xuXG5mdW5jdGlvbiBiaW5kQWN0aW9uQ3JlYXRvcnMoYWN0aW9uQ3JlYXRvcnMsIGRpc3BhdGNoKSB7XG4gIGlmICh0eXBlb2YgYWN0aW9uQ3JlYXRvcnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gYmluZEFjdGlvbkNyZWF0b3IoYWN0aW9uQ3JlYXRvcnMsIGRpc3BhdGNoKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgYWN0aW9uQ3JlYXRvcnMgIT09ICdvYmplY3QnIHx8IGFjdGlvbkNyZWF0b3JzID09PSBudWxsIHx8IGFjdGlvbkNyZWF0b3JzID09PSB1bmRlZmluZWQpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWVxLW51bGxcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2JpbmRBY3Rpb25DcmVhdG9ycyBleHBlY3RlZCBhbiBvYmplY3Qgb3IgYSBmdW5jdGlvbiwgaW5zdGVhZCByZWNlaXZlZCAnICsgKGFjdGlvbkNyZWF0b3JzID09PSBudWxsID8gJ251bGwnIDogdHlwZW9mIGFjdGlvbkNyZWF0b3JzKSArICcuICcgKyAnRGlkIHlvdSB3cml0ZSBcImltcG9ydCBBY3Rpb25DcmVhdG9ycyBmcm9tXCIgaW5zdGVhZCBvZiBcImltcG9ydCAqIGFzIEFjdGlvbkNyZWF0b3JzIGZyb21cIj8nKTtcbiAgfVxuXG4gIHJldHVybiBfdXRpbHNNYXBWYWx1ZXMyWydkZWZhdWx0J10oYWN0aW9uQ3JlYXRvcnMsIGZ1bmN0aW9uIChhY3Rpb25DcmVhdG9yKSB7XG4gICAgcmV0dXJuIGJpbmRBY3Rpb25DcmVhdG9yKGFjdGlvbkNyZWF0b3IsIGRpc3BhdGNoKTtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xufSx7XCIuLi91dGlscy9tYXBWYWx1ZXNcIjoyNH1dLDIxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbihmdW5jdGlvbiAocHJvY2Vzcyl7XG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzWydkZWZhdWx0J10gPSBjb21iaW5lUmVkdWNlcnM7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9jcmVhdGVTdG9yZSA9IHJlcXVpcmUoJy4uL2NyZWF0ZVN0b3JlJyk7XG5cbnZhciBfdXRpbHNJc1BsYWluT2JqZWN0ID0gcmVxdWlyZSgnLi4vdXRpbHMvaXNQbGFpbk9iamVjdCcpO1xuXG52YXIgX3V0aWxzSXNQbGFpbk9iamVjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF91dGlsc0lzUGxhaW5PYmplY3QpO1xuXG52YXIgX3V0aWxzTWFwVmFsdWVzID0gcmVxdWlyZSgnLi4vdXRpbHMvbWFwVmFsdWVzJyk7XG5cbnZhciBfdXRpbHNNYXBWYWx1ZXMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdXRpbHNNYXBWYWx1ZXMpO1xuXG52YXIgX3V0aWxzUGljayA9IHJlcXVpcmUoJy4uL3V0aWxzL3BpY2snKTtcblxudmFyIF91dGlsc1BpY2syID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdXRpbHNQaWNrKTtcblxuLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuXG5mdW5jdGlvbiBnZXRVbmRlZmluZWRTdGF0ZUVycm9yTWVzc2FnZShrZXksIGFjdGlvbikge1xuICB2YXIgYWN0aW9uVHlwZSA9IGFjdGlvbiAmJiBhY3Rpb24udHlwZTtcbiAgdmFyIGFjdGlvbk5hbWUgPSBhY3Rpb25UeXBlICYmICdcIicgKyBhY3Rpb25UeXBlLnRvU3RyaW5nKCkgKyAnXCInIHx8ICdhbiBhY3Rpb24nO1xuXG4gIHJldHVybiAnUmVkdWNlciBcIicgKyBrZXkgKyAnXCIgcmV0dXJuZWQgdW5kZWZpbmVkIGhhbmRsaW5nICcgKyBhY3Rpb25OYW1lICsgJy4gJyArICdUbyBpZ25vcmUgYW4gYWN0aW9uLCB5b3UgbXVzdCBleHBsaWNpdGx5IHJldHVybiB0aGUgcHJldmlvdXMgc3RhdGUuJztcbn1cblxuZnVuY3Rpb24gZ2V0VW5leHBlY3RlZFN0YXRlS2V5V2FybmluZ01lc3NhZ2UoaW5wdXRTdGF0ZSwgb3V0cHV0U3RhdGUsIGFjdGlvbikge1xuICB2YXIgcmVkdWNlcktleXMgPSBPYmplY3Qua2V5cyhvdXRwdXRTdGF0ZSk7XG4gIHZhciBhcmd1bWVudE5hbWUgPSBhY3Rpb24gJiYgYWN0aW9uLnR5cGUgPT09IF9jcmVhdGVTdG9yZS5BY3Rpb25UeXBlcy5JTklUID8gJ2luaXRpYWxTdGF0ZSBhcmd1bWVudCBwYXNzZWQgdG8gY3JlYXRlU3RvcmUnIDogJ3ByZXZpb3VzIHN0YXRlIHJlY2VpdmVkIGJ5IHRoZSByZWR1Y2VyJztcblxuICBpZiAocmVkdWNlcktleXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuICdTdG9yZSBkb2VzIG5vdCBoYXZlIGEgdmFsaWQgcmVkdWNlci4gTWFrZSBzdXJlIHRoZSBhcmd1bWVudCBwYXNzZWQgJyArICd0byBjb21iaW5lUmVkdWNlcnMgaXMgYW4gb2JqZWN0IHdob3NlIHZhbHVlcyBhcmUgcmVkdWNlcnMuJztcbiAgfVxuXG4gIGlmICghX3V0aWxzSXNQbGFpbk9iamVjdDJbJ2RlZmF1bHQnXShpbnB1dFN0YXRlKSkge1xuICAgIHJldHVybiAnVGhlICcgKyBhcmd1bWVudE5hbWUgKyAnIGhhcyB1bmV4cGVjdGVkIHR5cGUgb2YgXCInICsgKHt9KS50b1N0cmluZy5jYWxsKGlucHV0U3RhdGUpLm1hdGNoKC9cXHMoW2EtenxBLVpdKykvKVsxXSArICdcIi4gRXhwZWN0ZWQgYXJndW1lbnQgdG8gYmUgYW4gb2JqZWN0IHdpdGggdGhlIGZvbGxvd2luZyAnICsgKCdrZXlzOiBcIicgKyByZWR1Y2VyS2V5cy5qb2luKCdcIiwgXCInKSArICdcIicpO1xuICB9XG5cbiAgdmFyIHVuZXhwZWN0ZWRLZXlzID0gT2JqZWN0LmtleXMoaW5wdXRTdGF0ZSkuZmlsdGVyKGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gcmVkdWNlcktleXMuaW5kZXhPZihrZXkpIDwgMDtcbiAgfSk7XG5cbiAgaWYgKHVuZXhwZWN0ZWRLZXlzLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gJ1VuZXhwZWN0ZWQgJyArICh1bmV4cGVjdGVkS2V5cy5sZW5ndGggPiAxID8gJ2tleXMnIDogJ2tleScpICsgJyAnICsgKCdcIicgKyB1bmV4cGVjdGVkS2V5cy5qb2luKCdcIiwgXCInKSArICdcIiBmb3VuZCBpbiAnICsgYXJndW1lbnROYW1lICsgJy4gJykgKyAnRXhwZWN0ZWQgdG8gZmluZCBvbmUgb2YgdGhlIGtub3duIHJlZHVjZXIga2V5cyBpbnN0ZWFkOiAnICsgKCdcIicgKyByZWR1Y2VyS2V5cy5qb2luKCdcIiwgXCInKSArICdcIi4gVW5leHBlY3RlZCBrZXlzIHdpbGwgYmUgaWdub3JlZC4nKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhc3NlcnRSZWR1Y2VyU2FuaXR5KHJlZHVjZXJzKSB7XG4gIE9iamVjdC5rZXlzKHJlZHVjZXJzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICB2YXIgcmVkdWNlciA9IHJlZHVjZXJzW2tleV07XG4gICAgdmFyIGluaXRpYWxTdGF0ZSA9IHJlZHVjZXIodW5kZWZpbmVkLCB7IHR5cGU6IF9jcmVhdGVTdG9yZS5BY3Rpb25UeXBlcy5JTklUIH0pO1xuXG4gICAgaWYgKHR5cGVvZiBpbml0aWFsU3RhdGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlZHVjZXIgXCInICsga2V5ICsgJ1wiIHJldHVybmVkIHVuZGVmaW5lZCBkdXJpbmcgaW5pdGlhbGl6YXRpb24uICcgKyAnSWYgdGhlIHN0YXRlIHBhc3NlZCB0byB0aGUgcmVkdWNlciBpcyB1bmRlZmluZWQsIHlvdSBtdXN0ICcgKyAnZXhwbGljaXRseSByZXR1cm4gdGhlIGluaXRpYWwgc3RhdGUuIFRoZSBpbml0aWFsIHN0YXRlIG1heSAnICsgJ25vdCBiZSB1bmRlZmluZWQuJyk7XG4gICAgfVxuXG4gICAgdmFyIHR5cGUgPSAnQEByZWR1eC9QUk9CRV9VTktOT1dOX0FDVElPTl8nICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDcpLnNwbGl0KCcnKS5qb2luKCcuJyk7XG4gICAgaWYgKHR5cGVvZiByZWR1Y2VyKHVuZGVmaW5lZCwgeyB0eXBlOiB0eXBlIH0pID09PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZWR1Y2VyIFwiJyArIGtleSArICdcIiByZXR1cm5lZCB1bmRlZmluZWQgd2hlbiBwcm9iZWQgd2l0aCBhIHJhbmRvbSB0eXBlLiAnICsgKCdEb25cXCd0IHRyeSB0byBoYW5kbGUgJyArIF9jcmVhdGVTdG9yZS5BY3Rpb25UeXBlcy5JTklUICsgJyBvciBvdGhlciBhY3Rpb25zIGluIFwicmVkdXgvKlwiICcpICsgJ25hbWVzcGFjZS4gVGhleSBhcmUgY29uc2lkZXJlZCBwcml2YXRlLiBJbnN0ZWFkLCB5b3UgbXVzdCByZXR1cm4gdGhlICcgKyAnY3VycmVudCBzdGF0ZSBmb3IgYW55IHVua25vd24gYWN0aW9ucywgdW5sZXNzIGl0IGlzIHVuZGVmaW5lZCwgJyArICdpbiB3aGljaCBjYXNlIHlvdSBtdXN0IHJldHVybiB0aGUgaW5pdGlhbCBzdGF0ZSwgcmVnYXJkbGVzcyBvZiB0aGUgJyArICdhY3Rpb24gdHlwZS4gVGhlIGluaXRpYWwgc3RhdGUgbWF5IG5vdCBiZSB1bmRlZmluZWQuJyk7XG4gICAgfVxuICB9KTtcbn1cblxuLyoqXG4gKiBUdXJucyBhbiBvYmplY3Qgd2hvc2UgdmFsdWVzIGFyZSBkaWZmZXJlbnQgcmVkdWNlciBmdW5jdGlvbnMsIGludG8gYSBzaW5nbGVcbiAqIHJlZHVjZXIgZnVuY3Rpb24uIEl0IHdpbGwgY2FsbCBldmVyeSBjaGlsZCByZWR1Y2VyLCBhbmQgZ2F0aGVyIHRoZWlyIHJlc3VsdHNcbiAqIGludG8gYSBzaW5nbGUgc3RhdGUgb2JqZWN0LCB3aG9zZSBrZXlzIGNvcnJlc3BvbmQgdG8gdGhlIGtleXMgb2YgdGhlIHBhc3NlZFxuICogcmVkdWNlciBmdW5jdGlvbnMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHJlZHVjZXJzIEFuIG9iamVjdCB3aG9zZSB2YWx1ZXMgY29ycmVzcG9uZCB0byBkaWZmZXJlbnRcbiAqIHJlZHVjZXIgZnVuY3Rpb25zIHRoYXQgbmVlZCB0byBiZSBjb21iaW5lZCBpbnRvIG9uZS4gT25lIGhhbmR5IHdheSB0byBvYnRhaW5cbiAqIGl0IGlzIHRvIHVzZSBFUzYgYGltcG9ydCAqIGFzIHJlZHVjZXJzYCBzeW50YXguIFRoZSByZWR1Y2VycyBtYXkgbmV2ZXIgcmV0dXJuXG4gKiB1bmRlZmluZWQgZm9yIGFueSBhY3Rpb24uIEluc3RlYWQsIHRoZXkgc2hvdWxkIHJldHVybiB0aGVpciBpbml0aWFsIHN0YXRlXG4gKiBpZiB0aGUgc3RhdGUgcGFzc2VkIHRvIHRoZW0gd2FzIHVuZGVmaW5lZCwgYW5kIHRoZSBjdXJyZW50IHN0YXRlIGZvciBhbnlcbiAqIHVucmVjb2duaXplZCBhY3Rpb24uXG4gKlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBBIHJlZHVjZXIgZnVuY3Rpb24gdGhhdCBpbnZva2VzIGV2ZXJ5IHJlZHVjZXIgaW5zaWRlIHRoZVxuICogcGFzc2VkIG9iamVjdCwgYW5kIGJ1aWxkcyBhIHN0YXRlIG9iamVjdCB3aXRoIHRoZSBzYW1lIHNoYXBlLlxuICovXG5cbmZ1bmN0aW9uIGNvbWJpbmVSZWR1Y2VycyhyZWR1Y2Vycykge1xuICB2YXIgZmluYWxSZWR1Y2VycyA9IF91dGlsc1BpY2syWydkZWZhdWx0J10ocmVkdWNlcnMsIGZ1bmN0aW9uICh2YWwpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ2Z1bmN0aW9uJztcbiAgfSk7XG4gIHZhciBzYW5pdHlFcnJvcjtcblxuICB0cnkge1xuICAgIGFzc2VydFJlZHVjZXJTYW5pdHkoZmluYWxSZWR1Y2Vycyk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBzYW5pdHlFcnJvciA9IGU7XG4gIH1cblxuICB2YXIgZGVmYXVsdFN0YXRlID0gX3V0aWxzTWFwVmFsdWVzMlsnZGVmYXVsdCddKGZpbmFsUmVkdWNlcnMsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9KTtcblxuICByZXR1cm4gZnVuY3Rpb24gY29tYmluYXRpb24oc3RhdGUsIGFjdGlvbikge1xuICAgIGlmIChzdGF0ZSA9PT0gdW5kZWZpbmVkKSBzdGF0ZSA9IGRlZmF1bHRTdGF0ZTtcblxuICAgIGlmIChzYW5pdHlFcnJvcikge1xuICAgICAgdGhyb3cgc2FuaXR5RXJyb3I7XG4gICAgfVxuXG4gICAgdmFyIGZpbmFsU3RhdGUgPSBfdXRpbHNNYXBWYWx1ZXMyWydkZWZhdWx0J10oZmluYWxSZWR1Y2VycywgZnVuY3Rpb24gKHJlZHVjZXIsIGtleSkge1xuICAgICAgdmFyIG5ld1N0YXRlID0gcmVkdWNlcihzdGF0ZVtrZXldLCBhY3Rpb24pO1xuICAgICAgaWYgKHR5cGVvZiBuZXdTdGF0ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdmFyIGVycm9yTWVzc2FnZSA9IGdldFVuZGVmaW5lZFN0YXRlRXJyb3JNZXNzYWdlKGtleSwgYWN0aW9uKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yTWVzc2FnZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3U3RhdGU7XG4gICAgfSk7XG5cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgdmFyIHdhcm5pbmdNZXNzYWdlID0gZ2V0VW5leHBlY3RlZFN0YXRlS2V5V2FybmluZ01lc3NhZ2Uoc3RhdGUsIGZpbmFsU3RhdGUsIGFjdGlvbik7XG4gICAgICBpZiAod2FybmluZ01lc3NhZ2UpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih3YXJuaW5nTWVzc2FnZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZpbmFsU3RhdGU7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xufSkuY2FsbCh0aGlzLHJlcXVpcmUoJ19wcm9jZXNzJykpXG59LHtcIi4uL2NyZWF0ZVN0b3JlXCI6MTcsXCIuLi91dGlscy9pc1BsYWluT2JqZWN0XCI6MjMsXCIuLi91dGlscy9tYXBWYWx1ZXNcIjoyNCxcIi4uL3V0aWxzL3BpY2tcIjoyNSxcIl9wcm9jZXNzXCI6MTR9XSwyMjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4vKipcbiAqIENvbXBvc2VzIHNpbmdsZS1hcmd1bWVudCBmdW5jdGlvbnMgZnJvbSByaWdodCB0byBsZWZ0LlxuICpcbiAqIEBwYXJhbSB7Li4uRnVuY3Rpb259IGZ1bmNzIFRoZSBmdW5jdGlvbnMgdG8gY29tcG9zZS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gQSBmdW5jdGlvbiBvYnRhaW5lZCBieSBjb21wb3NpbmcgZnVuY3Rpb25zIGZyb20gcmlnaHQgdG9cbiAqIGxlZnQuIEZvciBleGFtcGxlLCBjb21wb3NlKGYsIGcsIGgpIGlzIGlkZW50aWNhbCB0byBhcmcgPT4gZihnKGgoYXJnKSkpLlxuICovXG5cInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gY29tcG9zZTtcblxuZnVuY3Rpb24gY29tcG9zZSgpIHtcbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGZ1bmNzID0gQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgZnVuY3NbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKGFyZykge1xuICAgIHJldHVybiBmdW5jcy5yZWR1Y2VSaWdodChmdW5jdGlvbiAoY29tcG9zZWQsIGYpIHtcbiAgICAgIHJldHVybiBmKGNvbXBvc2VkKTtcbiAgICB9LCBhcmcpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdO1xufSx7fV0sMjM6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1snZGVmYXVsdCddID0gaXNQbGFpbk9iamVjdDtcbnZhciBmblRvU3RyaW5nID0gZnVuY3Rpb24gZm5Ub1N0cmluZyhmbikge1xuICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZm4pO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge2FueX0gb2JqIFRoZSBvYmplY3QgdG8gaW5zcGVjdC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSBhcmd1bWVudCBhcHBlYXJzIHRvIGJlIGEgcGxhaW4gb2JqZWN0LlxuICovXG5cbmZ1bmN0aW9uIGlzUGxhaW5PYmplY3Qob2JqKSB7XG4gIGlmICghb2JqIHx8IHR5cGVvZiBvYmogIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIHByb3RvID0gdHlwZW9mIG9iai5jb25zdHJ1Y3RvciA9PT0gJ2Z1bmN0aW9uJyA/IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopIDogT2JqZWN0LnByb3RvdHlwZTtcblxuICBpZiAocHJvdG8gPT09IG51bGwpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHZhciBjb25zdHJ1Y3RvciA9IHByb3RvLmNvbnN0cnVjdG9yO1xuXG4gIHJldHVybiB0eXBlb2YgY29uc3RydWN0b3IgPT09ICdmdW5jdGlvbicgJiYgY29uc3RydWN0b3IgaW5zdGFuY2VvZiBjb25zdHJ1Y3RvciAmJiBmblRvU3RyaW5nKGNvbnN0cnVjdG9yKSA9PT0gZm5Ub1N0cmluZyhPYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcbn0se31dLDI0OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbi8qKlxuICogQXBwbGllcyBhIGZ1bmN0aW9uIHRvIGV2ZXJ5IGtleS12YWx1ZSBwYWlyIGluc2lkZSBhbiBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgc291cmNlIG9iamVjdC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBtYXBwZXIgZnVuY3Rpb24gdGhhdCByZWNlaXZlcyB0aGUgdmFsdWUgYW5kIHRoZSBrZXkuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBBIG5ldyBvYmplY3QgdGhhdCBjb250YWlucyB0aGUgbWFwcGVkIHZhbHVlcyBmb3IgdGhlIGtleXMuXG4gKi9cblwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBtYXBWYWx1ZXM7XG5cbmZ1bmN0aW9uIG1hcFZhbHVlcyhvYmosIGZuKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhvYmopLnJlZHVjZShmdW5jdGlvbiAocmVzdWx0LCBrZXkpIHtcbiAgICByZXN1bHRba2V5XSA9IGZuKG9ialtrZXldLCBrZXkpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sIHt9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzW1wiZGVmYXVsdFwiXTtcbn0se31dLDI1OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbi8qKlxuICogUGlja3Mga2V5LXZhbHVlIHBhaXJzIGZyb20gYW4gb2JqZWN0IHdoZXJlIHZhbHVlcyBzYXRpc2Z5IGEgcHJlZGljYXRlLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBwaWNrIGZyb20uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgcHJlZGljYXRlIHRoZSB2YWx1ZXMgbXVzdCBzYXRpc2Z5IHRvIGJlIGNvcGllZC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBvYmplY3Qgd2l0aCB0aGUgdmFsdWVzIHRoYXQgc2F0aXNmaWVkIHRoZSBwcmVkaWNhdGUuXG4gKi9cblwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBwaWNrO1xuXG5mdW5jdGlvbiBwaWNrKG9iaiwgZm4pIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikucmVkdWNlKGZ1bmN0aW9uIChyZXN1bHQsIGtleSkge1xuICAgIGlmIChmbihvYmpba2V5XSkpIHtcbiAgICAgIHJlc3VsdFtrZXldID0gb2JqW2tleV07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sIHt9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzW1wiZGVmYXVsdFwiXTtcbn0se31dLDI2OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gU291bmRDbG91ZCAoY2xpZW50SWQpIHtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgU291bmRDbG91ZCkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTb3VuZENsb3VkKGNsaWVudElkKTtcbiAgICB9XG5cbiAgICBpZiAoIWNsaWVudElkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignU291bmRDbG91ZCBBUEkgY2xpZW50SWQgaXMgcmVxdWlyZWQsIGdldCBpdCAtIGh0dHBzOi8vZGV2ZWxvcGVycy5zb3VuZGNsb3VkLmNvbS8nKTtcbiAgICB9XG5cbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAgIHRoaXMuX2NsaWVudElkID0gY2xpZW50SWQ7XG4gICAgdGhpcy5fYmFzZVVybCA9ICdodHRwczovL2FwaS5zb3VuZGNsb3VkLmNvbSc7XG5cbiAgICB0aGlzLnBsYXlpbmcgPSBmYWxzZTtcbiAgICB0aGlzLmR1cmF0aW9uID0gMDtcblxuICAgIHRoaXMuYXVkaW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhdWRpbycpO1xufVxuXG5Tb3VuZENsb3VkLnByb3RvdHlwZS5yZXNvbHZlID0gZnVuY3Rpb24gKHVybCwgY2FsbGJhY2spIHtcbiAgICBpZiAoIXVybCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NvdW5kQ2xvdWQgdHJhY2sgb3IgcGxheWxpc3QgdXJsIGlzIHJlcXVpcmVkJyk7XG4gICAgfVxuXG4gICAgdXJsID0gdGhpcy5fYmFzZVVybCArICcvcmVzb2x2ZS5qc29uP3VybD0nICsgdXJsICsgJyZjbGllbnRfaWQ9JyArIHRoaXMuX2NsaWVudElkO1xuXG4gICAgdGhpcy5fanNvbnAodXJsLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgICAgICAgICAgdmFyIHRyYWNrcyA9IGRhdGE7XG4gICAgICAgICAgICBkYXRhID0ge3RyYWNrczogdHJhY2tzfTtcbiAgICAgICAgICAgIHRoaXMuX3BsYXlsaXN0ID0gZGF0YTtcbiAgICAgICAgfSBlbHNlIGlmIChkYXRhLnRyYWNrcykge1xuICAgICAgICAgICAgdGhpcy5fcGxheWxpc3QgPSBkYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fdHJhY2sgPSBkYXRhO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kdXJhdGlvbiA9IGRhdGEuZHVyYXRpb24gJiYgIWlzTmFOKGRhdGEuZHVyYXRpb24pID9cbiAgICAgICAgICAgIGRhdGEuZHVyYXRpb24gLyAxMDAwIDogLy8gY29udmVydCB0byBzZWNvbmRzXG4gICAgICAgICAgICAwOyAvLyBubyBkdXJhdGlvbiBpcyB6ZXJvXG5cbiAgICAgICAgY2FsbGJhY2soZGF0YSk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbn07XG5cblNvdW5kQ2xvdWQucHJvdG90eXBlLl9qc29ucCA9IGZ1bmN0aW9uICh1cmwsIGNhbGxiYWNrKSB7XG4gICAgdmFyIHRhcmdldCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXSB8fCBkb2N1bWVudC5oZWFkO1xuICAgIHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcblxuICAgIHZhciBpZCA9ICdqc29ucF9jYWxsYmFja18nICsgTWF0aC5yb3VuZCgxMDAwMDAgKiBNYXRoLnJhbmRvbSgpKTtcbiAgICB3aW5kb3dbaWRdID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgaWYgKHNjcmlwdC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICBzY3JpcHQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzY3JpcHQpO1xuICAgICAgICB9XG4gICAgICAgIHdpbmRvd1tpZF0gPSBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgY2FsbGJhY2soZGF0YSk7XG4gICAgfTtcblxuICAgIHNjcmlwdC5zcmMgPSB1cmwgKyAodXJsLmluZGV4T2YoJz8nKSA+PSAwID8gJyYnIDogJz8nKSArICdjYWxsYmFjaz0nICsgaWQ7XG4gICAgdGFyZ2V0LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHNjcmlwdCwgdGFyZ2V0KTtcbn07XG5cblNvdW5kQ2xvdWQucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gKGUsIGZuKSB7XG4gICAgdGhpcy5fZXZlbnRzW2VdID0gZm47XG4gICAgdGhpcy5hdWRpby5hZGRFdmVudExpc3RlbmVyKGUsIGZuLCBmYWxzZSk7XG59O1xuXG5Tb3VuZENsb3VkLnByb3RvdHlwZS5vZmYgPSBmdW5jdGlvbiAoZSwgZm4pIHtcbiAgICB0aGlzLl9ldmVudHNbZV0gPSBudWxsO1xuICAgIHRoaXMuYXVkaW8ucmVtb3ZlRXZlbnRMaXN0ZW5lcihlLCBmbik7XG59O1xuXG5Tb3VuZENsb3VkLnByb3RvdHlwZS51bmJpbmRBbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgZm9yICh2YXIgZSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgICAgdmFyIGZuID0gdGhpcy5fZXZlbnRzW2VdO1xuICAgICAgICBpZiAoZm4pIHtcbiAgICAgICAgICAgIHRoaXMub2ZmKGUsIGZuKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cblNvdW5kQ2xvdWQucHJvdG90eXBlLnByZWxvYWQgPSBmdW5jdGlvbiAoc3RyZWFtVXJsKSB7XG4gICAgdGhpcy5fdHJhY2sgPSB7c3RyZWFtX3VybDogc3RyZWFtVXJsfTtcbiAgICB0aGlzLmF1ZGlvLnNyYyA9IHN0cmVhbVVybCArICc/Y2xpZW50X2lkPScgKyB0aGlzLl9jbGllbnRJZDtcbn07XG5cblNvdW5kQ2xvdWQucHJvdG90eXBlLnBsYXkgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIHZhciBzcmM7XG5cbiAgICBpZiAob3B0aW9ucy5zdHJlYW1VcmwpIHtcbiAgICAgICAgc3JjID0gb3B0aW9ucy5zdHJlYW1Vcmw7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9wbGF5bGlzdCkge1xuICAgICAgICB2YXIgbGVuZ3RoID0gdGhpcy5fcGxheWxpc3QudHJhY2tzLmxlbmd0aDtcbiAgICAgICAgaWYgKGxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5fcGxheWxpc3RJbmRleCA9IG9wdGlvbnMucGxheWxpc3RJbmRleCB8fCAwO1xuXG4gICAgICAgICAgICAvLyBiZSBzaWxlbnQgaWYgaW5kZXggaXMgb3V0IG9mIHJhbmdlXG4gICAgICAgICAgICBpZiAodGhpcy5fcGxheWxpc3RJbmRleCA+PSBsZW5ndGggfHwgdGhpcy5fcGxheWxpc3RJbmRleCA8IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wbGF5bGlzdEluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzcmMgPSB0aGlzLl9wbGF5bGlzdC50cmFja3NbdGhpcy5fcGxheWxpc3RJbmRleF0uc3RyZWFtX3VybDtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5fdHJhY2spIHtcbiAgICAgICAgc3JjID0gdGhpcy5fdHJhY2suc3RyZWFtX3VybDtcbiAgICB9XG5cbiAgICBpZiAoIXNyYykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZXJlIGlzIG5vIHRyYWNrcyB0byBwbGF5LCB1c2UgYHN0cmVhbVVybGAgb3B0aW9uIG9yIGBsb2FkYCBtZXRob2QnKTtcbiAgICB9XG5cbiAgICBzcmMgKz0gJyZjbGllbnRfaWQ9JyArIHRoaXMuX2NsaWVudElkO1xuXG4gICAgaWYgKHNyYyAhPT0gdGhpcy5hdWRpby5zcmMpIHtcbiAgICAgICAgdGhpcy5hdWRpby5zcmMgPSBzcmM7XG4gICAgfVxuXG4gICAgdGhpcy5wbGF5aW5nID0gc3JjO1xuICAgIHRoaXMuYXVkaW8ucGxheSgpO1xufTtcblxuU291bmRDbG91ZC5wcm90b3R5cGUucGF1c2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5hdWRpby5wYXVzZSgpO1xuICAgIHRoaXMucGxheWluZyA9IGZhbHNlO1xufTtcblxuU291bmRDbG91ZC5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmF1ZGlvLnBhdXNlKCk7XG4gICAgdGhpcy5hdWRpby5jdXJyZW50VGltZSA9IDA7XG4gICAgdGhpcy5wbGF5aW5nID0gZmFsc2U7XG59O1xuXG5Tb3VuZENsb3VkLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB0cmFja3NMZW5ndGggPSB0aGlzLl9wbGF5bGlzdC50cmFja3MubGVuZ3RoO1xuICAgIGlmICh0aGlzLl9wbGF5bGlzdEluZGV4ID49IHRyYWNrc0xlbmd0aCAtIDEpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5fcGxheWxpc3QgJiYgdHJhY2tzTGVuZ3RoKSB7XG4gICAgICAgIHRoaXMucGxheSh7cGxheWxpc3RJbmRleDogKyt0aGlzLl9wbGF5bGlzdEluZGV4fSk7XG4gICAgfVxufTtcblxuU291bmRDbG91ZC5wcm90b3R5cGUucHJldmlvdXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuX3BsYXlsaXN0SW5kZXggPD0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLl9wbGF5bGlzdCAmJiB0aGlzLl9wbGF5bGlzdC50cmFja3MubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMucGxheSh7cGxheWxpc3RJbmRleDogLS10aGlzLl9wbGF5bGlzdEluZGV4fSk7XG4gICAgfVxufTtcblxuU291bmRDbG91ZC5wcm90b3R5cGUuc2VlayA9IGZ1bmN0aW9uIChlKSB7XG4gICAgaWYgKCF0aGlzLmF1ZGlvLnJlYWR5U3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YXIgcGVyY2VudCA9IGUub2Zmc2V0WCAvIGUudGFyZ2V0Lm9mZnNldFdpZHRoIHx8IChlLmxheWVyWCAtIGUudGFyZ2V0Lm9mZnNldExlZnQpIC8gZS50YXJnZXQub2Zmc2V0V2lkdGg7XG4gICAgdGhpcy5hdWRpby5jdXJyZW50VGltZSA9IHBlcmNlbnQgKiAodGhpcy5hdWRpby5kdXJhdGlvbiB8fCAwKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU291bmRDbG91ZDtcblxufSx7fV0sMjc6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5mZXRjaFRyYWNrcyA9IGZldGNoVHJhY2tzO1xuZXhwb3J0cy5wbGF5ID0gcGxheTtcbmV4cG9ydHMucmVzdW1lID0gcmVzdW1lO1xuZXhwb3J0cy5wYXVzZSA9IHBhdXNlO1xuZXhwb3J0cy5wcmV2ID0gcHJldjtcbmV4cG9ydHMubmV4dCA9IG5leHQ7XG5leHBvcnRzLmVuZCA9IGVuZDtcbmV4cG9ydHMuY2hhbmdlQmFja2dyb3VuZCA9IGNoYW5nZUJhY2tncm91bmQ7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9zb3VuZGNsb3VkQXVkaW8gPSByZXF1aXJlKCdzb3VuZGNsb3VkLWF1ZGlvJyk7XG5cbnZhciBfc291bmRjbG91ZEF1ZGlvMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3NvdW5kY2xvdWRBdWRpbyk7XG5cbnZhciBfY29uc3RhbnRzID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKTtcblxudmFyIEZFVENIX1RSQUNLUyA9ICdGRVRDSF9UUkFDS1MnO1xuZXhwb3J0cy5GRVRDSF9UUkFDS1MgPSBGRVRDSF9UUkFDS1M7XG52YXIgRkVUQ0hfVFJBQ0tTX0VSUk9SID0gJ0ZFVENIX1RSQUNLU19FUlJPUic7XG5leHBvcnRzLkZFVENIX1RSQUNLU19FUlJPUiA9IEZFVENIX1RSQUNLU19FUlJPUjtcbnZhciBGRVRDSF9UUkFDS1NfU1VDQ0VTUyA9ICdGRVRDSF9UUkFDS1NfU1VDQ0VTUyc7XG5cbmV4cG9ydHMuRkVUQ0hfVFJBQ0tTX1NVQ0NFU1MgPSBGRVRDSF9UUkFDS1NfU1VDQ0VTUztcblxuZnVuY3Rpb24gZmV0Y2hUcmFja3MocGxheWVyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkaXNwYXRjaCkge1xuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IEZFVENIX1RSQUNLUyB9KTtcblxuICAgICAgICBwbGF5ZXIucmVzb2x2ZShfY29uc3RhbnRzLlJFU09MVkVfVVJMLCBmdW5jdGlvbiAocGxheWxpc3QpIHtcbiAgICAgICAgICAgIGlmICghcGxheWxpc3QpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGlzcGF0Y2goe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBGRVRDSF9UUkFDS1NfRVJST1IsXG4gICAgICAgICAgICAgICAgICAgIHBheWxvYWQ6IGVyclxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZGlzcGF0Y2goe1xuICAgICAgICAgICAgICAgIHR5cGU6IEZFVENIX1RSQUNLU19TVUNDRVNTLFxuICAgICAgICAgICAgICAgIHBheWxvYWQ6IHBsYXllclxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG59XG5cbnZhciBQTEFZID0gJ1BMQVknO1xuZXhwb3J0cy5QTEFZID0gUExBWTtcbnZhciBQQVVTRSA9ICdQQVVTRSc7XG5leHBvcnRzLlBBVVNFID0gUEFVU0U7XG52YXIgUFJFViA9ICdQUkVWJztcbmV4cG9ydHMuUFJFViA9IFBSRVY7XG52YXIgTkVYVCA9ICdORVhUJztcbmV4cG9ydHMuTkVYVCA9IE5FWFQ7XG52YXIgRU5EID0gJ0VORCc7XG5cbmV4cG9ydHMuRU5EID0gRU5EO1xuXG5mdW5jdGlvbiBwbGF5KHBsYXllciwgaW5kZXgpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGRpc3BhdGNoLCBnZXRTdGF0ZSkge1xuICAgICAgICB2YXIgdHJhY2tJbmRleCA9IGluZGV4ICE9PSB1bmRlZmluZWQgPyBpbmRleCA6IGdldFN0YXRlKCkuY3VycmVudFRyYWNrSW5kZXg7XG4gICAgICAgIHBsYXllci5wbGF5KHsgcGxheWxpc3RJbmRleDogdHJhY2tJbmRleCB9KTtcblxuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IFBMQVksIHBheWxvYWQ6IHBsYXllciB9KTtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiByZXN1bWUocGxheWVyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkaXNwYXRjaCkge1xuICAgICAgICBwbGF5ZXIuYXVkaW8ucGxheSgpO1xuXG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogUExBWSwgcGF5bG9hZDogcGxheWVyIH0pO1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIHBhdXNlKHBsYXllcikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZGlzcGF0Y2gpIHtcbiAgICAgICAgcGxheWVyLnBhdXNlKCk7XG5cbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBQQVVTRSwgcGF5bG9hZDogcGxheWVyIH0pO1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIHByZXYocGxheWVyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkaXNwYXRjaCkge1xuICAgICAgICBwbGF5ZXIucHJldmlvdXMoKTtcblxuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IFBSRVYsIHBheWxvYWQ6IHBsYXllciB9KTtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBuZXh0KHBsYXllcikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZGlzcGF0Y2gpIHtcbiAgICAgICAgcGxheWVyLm5leHQoKTtcblxuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IE5FWFQsIHBheWxvYWQ6IHBsYXllciB9KTtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBlbmQocGxheWVyKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogRU5ELFxuICAgICAgICBwYXlsb2FkOiBwbGF5ZXJcbiAgICB9O1xufVxuXG52YXIgQ0hBTkdFX0JBQ0tHUk9VTkQgPSAnQ0hBTkdFX0JBQ0tHUk9VTkQnO1xuXG5leHBvcnRzLkNIQU5HRV9CQUNLR1JPVU5EID0gQ0hBTkdFX0JBQ0tHUk9VTkQ7XG5cbmZ1bmN0aW9uIGNoYW5nZUJhY2tncm91bmQoX3JlZikge1xuICAgIHZhciBodWUgPSBfcmVmLmh1ZTtcbiAgICB2YXIgc2F0dXJhdGlvbiA9IF9yZWYuc2F0dXJhdGlvbjtcbiAgICB2YXIgbGlnaHRuZXNzID0gX3JlZi5saWdodG5lc3M7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBDSEFOR0VfQkFDS0dST1VORCxcbiAgICAgICAgcGF5bG9hZDoge1xuICAgICAgICAgICAgaHVlOiBodWUsXG4gICAgICAgICAgICBzYXR1cmF0aW9uOiBzYXR1cmF0aW9uLFxuICAgICAgICAgICAgbGlnaHRuZXNzOiBsaWdodG5lc3NcbiAgICAgICAgfVxuICAgIH07XG59XG5cbn0se1wiLi9jb25zdGFudHNcIjoyOSxcInNvdW5kY2xvdWQtYXVkaW9cIjoyNn1dLDI4OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX3NvdW5kY2xvdWRBdWRpbyA9IHJlcXVpcmUoJ3NvdW5kY2xvdWQtYXVkaW8nKTtcblxudmFyIF9zb3VuZGNsb3VkQXVkaW8yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc291bmRjbG91ZEF1ZGlvKTtcblxudmFyIF9yZWR1eCA9IHJlcXVpcmUoJ3JlZHV4Jyk7XG5cbnZhciBfcmVkdXhMb2dnZXIgPSByZXF1aXJlKCdyZWR1eC1sb2dnZXInKTtcblxudmFyIF9yZWR1eExvZ2dlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWR1eExvZ2dlcik7XG5cbnZhciBfcmVkdXhUaHVuayA9IHJlcXVpcmUoJ3JlZHV4LXRodW5rJyk7XG5cbnZhciBfcmVkdXhUaHVuazIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWR1eFRodW5rKTtcblxudmFyIF9yZWR1Y2VyID0gcmVxdWlyZSgnLi9yZWR1Y2VyJyk7XG5cbnZhciBfcmVkdWNlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWR1Y2VyKTtcblxudmFyIF9hY3Rpb25zID0gcmVxdWlyZSgnLi9hY3Rpb25zJyk7XG5cbnZhciBfY29uc3RhbnRzID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKTtcblxudmFyIF9kb20gPSByZXF1aXJlKCcuL2RvbScpO1xuXG52YXIgX3Zpc3VhbGl6ZXIgPSByZXF1aXJlKCcuL3Zpc3VhbGl6ZXInKTtcblxudmFyIF92aXN1YWxpemVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Zpc3VhbGl6ZXIpO1xuXG52YXIgX3JvdXRlciA9IHJlcXVpcmUoJy4vcm91dGVyJyk7XG5cbnZhciBfcm91dGVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JvdXRlcik7XG5cbnZhciBsb2dnZXIgPSAoMCwgX3JlZHV4TG9nZ2VyMlsnZGVmYXVsdCddKSgpO1xudmFyIHN0b3JlID0gKDAsIF9yZWR1eC5hcHBseU1pZGRsZXdhcmUpKF9yZWR1eFRodW5rMlsnZGVmYXVsdCddLCBsb2dnZXIpKF9yZWR1eC5jcmVhdGVTdG9yZSkoX3JlZHVjZXIyWydkZWZhdWx0J10pO1xudmFyIHBsYXllciA9IG5ldyBfc291bmRjbG91ZEF1ZGlvMlsnZGVmYXVsdCddKF9jb25zdGFudHMuQ0xJRU5UX0lEKTtcblxuc3RvcmUuZGlzcGF0Y2goKDAsIF9hY3Rpb25zLmZldGNoVHJhY2tzKShwbGF5ZXIpKTtcblxuKDAsIF9kb20uYmluZEV2ZW50cykocGxheWVyLCBzdG9yZS5kaXNwYXRjaCwgc3RvcmUuZ2V0U3RhdGUpO1xuKDAsIF9kb20uYmluZENsYXNzZXMpKHBsYXllciwgc3RvcmUpO1xuXG4oMCwgX3Zpc3VhbGl6ZXIyWydkZWZhdWx0J10pKHBsYXllciwgc3RvcmUpO1xuXG59LHtcIi4vYWN0aW9uc1wiOjI3LFwiLi9jb25zdGFudHNcIjoyOSxcIi4vZG9tXCI6MzAsXCIuL3JlZHVjZXJcIjozMSxcIi4vcm91dGVyXCI6MzIsXCIuL3Zpc3VhbGl6ZXJcIjozNixcInJlZHV4XCI6MTgsXCJyZWR1eC1sb2dnZXJcIjoxNSxcInJlZHV4LXRodW5rXCI6MTYsXCJzb3VuZGNsb3VkLWF1ZGlvXCI6MjZ9XSwyOTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xudmFyIFJFU09MVkVfVVJMID0gXCJodHRwczovL3NvdW5kY2xvdWQuY29tL3RoZWFpcm9uZWFydGgvc2V0cy90aGUtYWlyLW9uLWVhcnRoL3MtUmliVEJcIjtcbmV4cG9ydHMuUkVTT0xWRV9VUkwgPSBSRVNPTFZFX1VSTDtcbnZhciBDTElFTlRfSUQgPSBcIjI4N2UwYTQ3MGFjZWVjN2Q1MDVhYjQxZTE4OTJmZGRjXCI7XG5cbmV4cG9ydHMuQ0xJRU5UX0lEID0gQ0xJRU5UX0lEO1xudmFyIFRSQUNLX05BTUVTID0ge1xuICAgIDA6ICdleGl0JyxcbiAgICAxOiAnZ2hvc3QnLFxuICAgIDI6ICdzZWNvbmRfc2tpbicsXG4gICAgMzogJ3JlZmxlY3Rpb24nLFxuICAgIDQ6ICdmYXJld2VsbCcsXG4gICAgNTogJ3N0aWxsbmVzcycsXG4gICAgNjogJ3lvdW5nX2d1bnMnLFxuICAgIDc6ICdpbm5vY2VudCcsXG4gICAgODogJ3dha2UnXG59O1xuZXhwb3J0cy5UUkFDS19OQU1FUyA9IFRSQUNLX05BTUVTO1xuXG59LHt9XSwzMDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmJpbmRFdmVudHMgPSBiaW5kRXZlbnRzO1xuZXhwb3J0cy5iaW5kQ2xhc3NlcyA9IGJpbmRDbGFzc2VzO1xuXG52YXIgX2FjdGlvbnMgPSByZXF1aXJlKCcuL2FjdGlvbnMnKTtcblxudmFyIF9jb25zdGFudHMgPSByZXF1aXJlKCcuL2NvbnN0YW50cycpO1xuXG52YXIgcGxheUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwbGF5Jyk7XG52YXIgcGF1c2VCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGF1c2UnKTtcbnZhciBuZXh0QnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25leHQnKTtcbnZhciBwcmV2QnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ByZXYnKTtcbnZhciBwbGF5ZXJFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXN0ZW4nKTtcbnZhciBzY3J1YmJlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzY3J1YmJlcicpO1xudmFyIHNjcnViYmVyUGxheWVkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NjcnViYmVyX19wbGF5ZWQnKTtcbnZhciBvdmVybGF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ292ZXJsYXknKTtcbnZhciBib2R5ID0gZG9jdW1lbnQuYm9keTtcbnZhciBuYXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmF2Jyk7XG52YXIgcGFnZU5hdnMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zdWJuYXYgPiBsaSA+IGEnKSk7XG52YXIgbmF2VHJhY2tsaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25hdi10cmFja2xpc3QnKTtcbnZhciB0cmFja0xpc3QgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50cmFja2xpc3QnKSk7XG52YXIgc2VjdGlvbnMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZWN0aW9uJykpO1xuXG5mdW5jdGlvbiBnZXRJbmRleChsaSkge1xuICAgIHZhciBjaGlsZHJlbiA9IEFycmF5LmZyb20obGkucGFyZW50Tm9kZS5jaGlsZHJlbik7XG5cbiAgICByZXR1cm4gY2hpbGRyZW4uaW5kZXhPZihsaSk7XG59XG5cbmZ1bmN0aW9uIHNldEFjdGl2ZVNlY3Rpb24oaWQpIHtcbiAgICB2YXIgY2xhc3NMaXN0ID0gQXJyYXkuZnJvbShib2R5LmNsYXNzTGlzdCkuZmluZChmdW5jdGlvbiAoY2xzKSB7XG4gICAgICAgIHJldHVybiAoLy0tYWN0aXZlLy50ZXN0KGNscylcbiAgICAgICAgKTtcbiAgICB9KTtcblxuICAgIGJvZHkuY2xhc3NMaXN0LnJlbW92ZShjbGFzc0xpc3QpO1xuICAgIGJvZHkuY2xhc3NMaXN0LmFkZChpZCArICctLWFjdGl2ZScpO1xufVxuXG5mdW5jdGlvbiBzZXRBY3RpdmVUcmFja0NsYXNzKGN1cnJlbnRUcmFja0luZGV4KSB7XG4gICAgdmFyIHRyYWNrQ2xhc3MgPSBBcnJheS5mcm9tKGJvZHkuY2xhc3NMaXN0KS5maW5kKGZ1bmN0aW9uIChjbHMpIHtcbiAgICAgICAgcmV0dXJuICgvdHJhY2stLS8udGVzdChjbHMpXG4gICAgICAgICk7XG4gICAgfSk7XG4gICAgdmFyIHRyYWNrTmFtZSA9IF9jb25zdGFudHMuVFJBQ0tfTkFNRVNbY3VycmVudFRyYWNrSW5kZXhdO1xuXG4gICAgYm9keS5jbGFzc0xpc3QucmVtb3ZlKHRyYWNrQ2xhc3MpO1xuICAgIGJvZHkuY2xhc3NMaXN0LmFkZCgndHJhY2stLScgKyB0cmFja05hbWUpO1xufVxuXG5mdW5jdGlvbiBhY3RpdmF0ZUVsKGVscywgZmlsdGVyRm4pIHtcbiAgICBlbHMubWFwKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgcmV0dXJuIGVsO1xuICAgIH0pLmZpbHRlcihmaWx0ZXJGbikubWFwKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgcmV0dXJuIGVsO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBiaW5kRXZlbnRzKHBsYXllciwgZGlzcGF0Y2gsIGdldFN0YXRlKSB7XG5cbiAgICBwbGF5ZXIub24oJ2VuZGVkJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIHRyYWNrTGlzdCA9IHBsYXllci5fcGxheWxpc3Q7XG4gICAgICAgIHZhciBjdXJyZW50VHJhY2tJbmRleCA9IGdldFN0YXRlKCkuY3VycmVudFRyYWNrSW5kZXg7XG5cbiAgICAgICAgaWYgKGN1cnJlbnRUcmFja0luZGV4ICsgMSA+PSB0cmFja0xpc3QubGVuZ3RoKSB7XG4gICAgICAgICAgICBkaXNwYXRjaCgoMCwgX2FjdGlvbnMuZW5kKShwbGF5ZXIpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vZGlzcGF0Y2goZW5kKHBsYXllcikpO1xuICAgICAgICAgICAgZGlzcGF0Y2goKDAsIF9hY3Rpb25zLm5leHQpKHBsYXllcikpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBwbGF5ZXIub24oJ3RpbWV1cGRhdGUnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgZHVyYXRpb24gPSBwbGF5ZXIuYXVkaW8uZHVyYXRpb247XG4gICAgICAgIHZhciBjdXJyZW50VGltZSA9IHBsYXllci5hdWRpby5jdXJyZW50VGltZTtcbiAgICAgICAgdmFyIHBlcmNlbnQgPSBjdXJyZW50VGltZSAvIGR1cmF0aW9uICogMTAwO1xuICAgICAgICBzY3J1YmJlclBsYXllZC5zdHlsZS53aWR0aCA9IHBlcmNlbnQgKyAnJSc7XG4gICAgfSk7XG5cbiAgICBwbGF5QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIHN0YXRlID0gZ2V0U3RhdGUoKTtcbiAgICAgICAgdmFyIGlzUGxheWluZyA9IHN0YXRlLmlzUGxheWluZztcbiAgICAgICAgdmFyIGlzUGF1c2VkID0gc3RhdGUuaXNQYXVzZWQ7XG5cbiAgICAgICAgaWYgKGlzUGF1c2VkKSB7XG4gICAgICAgICAgICBkaXNwYXRjaCgoMCwgX2FjdGlvbnMucmVzdW1lKShwbGF5ZXIpKTtcbiAgICAgICAgfSBlbHNlIGlmICghaXNQbGF5aW5nKSB7XG4gICAgICAgICAgICBkaXNwYXRjaCgoMCwgX2FjdGlvbnMucGxheSkocGxheWVyKSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHBhdXNlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIGlzUGxheWluZyA9IGdldFN0YXRlKCkuaXNQbGF5aW5nO1xuXG4gICAgICAgIGlmIChpc1BsYXlpbmcpIHtcbiAgICAgICAgICAgIGRpc3BhdGNoKCgwLCBfYWN0aW9ucy5wYXVzZSkocGxheWVyKSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIG5leHRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBkaXNwYXRjaCgoMCwgX2FjdGlvbnMubmV4dCkocGxheWVyKSk7XG4gICAgfSk7XG5cbiAgICBwcmV2QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZGlzcGF0Y2goKDAsIF9hY3Rpb25zLnByZXYpKHBsYXllcikpO1xuICAgIH0pO1xuXG4gICAgc2NydWJiZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgb2Zmc2V0ID0gZS5vZmZzZXRYO1xuICAgICAgICB2YXIgd2lkdGggPSBzY3J1YmJlci5vZmZzZXRXaWR0aDtcbiAgICAgICAgdmFyIHBlcmNlbnQgPSBvZmZzZXQgLyB3aWR0aDtcbiAgICAgICAgcGxheWVyLmF1ZGlvLmN1cnJlbnRUaW1lID0gcGVyY2VudCAqIChwbGF5ZXIuYXVkaW8uZHVyYXRpb24gfHwgMCk7XG4gICAgfSk7XG5cbiAgICBuYXZUcmFja2xpc3QuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoZS50YXJnZXQgJiYgZS50YXJnZXQubm9kZU5hbWUgPT09ICdBJykge1xuICAgICAgICAgICAgdmFyIHRhcmdldCA9IGUudGFyZ2V0O1xuICAgICAgICAgICAgdmFyIHBhcmVudE5vZGUgPSB0YXJnZXQucGFyZW50Tm9kZTtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IGdldEluZGV4KHBhcmVudE5vZGUpO1xuXG4gICAgICAgICAgICBkaXNwYXRjaCgoMCwgX2FjdGlvbnMucGxheSkocGxheWVyLCBpbmRleCkpO1xuXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBuYXYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoZS50YXJnZXQgJiYgZS50YXJnZXQubm9kZU5hbWUgPT09ICdBJykge1xuICAgICAgICAgICAgdmFyIGhhc2ggPSBlLnRhcmdldC5oYXNoO1xuICAgICAgICAgICAgdmFyIGlkID0gaGFzaCAmJiBoYXNoLnNsaWNlKDEpIHx8ICdsaXN0ZW4nO1xuXG4gICAgICAgICAgICAvL2FjdGl2YXRlRWwocGFnZU5hdnMsIGVsID0+IGVsLmhhc2ggPT09IGhhc2gpO1xuICAgICAgICAgICAgLy9hY3RpdmF0ZUVsKHNlY3Rpb25zLCBlbCA9PiBlbC5nZXRBdHRyaWJ1dGUoJ2lkJykgPT09IGlkKTtcbiAgICAgICAgICAgIHNldEFjdGl2ZVNlY3Rpb24oaWQpO1xuXG4gICAgICAgICAgICBpZiAod2luZG93Lmhpc3RvcnkpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoeyBhY3RpdmVTZWN0aW9uOiBpZCB9LCBudWxsLCBoYXNoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgYWN0aXZlU2VjdGlvbiA9IGUuc3RhdGUuYWN0aXZlU2VjdGlvbjtcblxuICAgICAgICBpZiAoYWN0aXZlU2VjdGlvbikge1xuICAgICAgICAgICAgc2V0QWN0aXZlU2VjdGlvbihhY3RpdmVTZWN0aW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNldEFjdGl2ZVNlY3Rpb24oJ2xpc3RlbicpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoZG9jdW1lbnQubG9jYXRpb24uaGFzaCkge1xuICAgICAgICB2YXIgaGFzaCA9IGRvY3VtZW50LmxvY2F0aW9uLmhhc2g7XG5cbiAgICAgICAgc2V0QWN0aXZlU2VjdGlvbihoYXNoLnNsaWNlKDEpKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGJpbmRDbGFzc2VzKHBsYXllciwgc3RvcmUpIHtcblxuICAgIHN0b3JlLnN1YnNjcmliZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzdGF0ZSA9IHN0b3JlLmdldFN0YXRlKCk7XG4gICAgICAgIHZhciBodWUgPSBzdGF0ZS5odWU7XG4gICAgICAgIHZhciBzYXR1cmF0aW9uID0gc3RhdGUuc2F0dXJhdGlvbjtcbiAgICAgICAgdmFyIGxpZ2h0bmVzcyA9IHN0YXRlLmxpZ2h0bmVzcztcbiAgICAgICAgdmFyIG9wYWNpdHkgPSBzdGF0ZS5vcGFjaXR5O1xuICAgICAgICB2YXIgY3VycmVudFRyYWNrSW5kZXggPSBzdGF0ZS5jdXJyZW50VHJhY2tJbmRleDtcblxuICAgICAgICBvdmVybGF5LnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICdoc2xhKCcgKyBodWUgKyAnLCAnICsgc2F0dXJhdGlvbiArICclLCAnICsgbGlnaHRuZXNzICsgJyUsICcgKyBvcGFjaXR5ICsgJyknO1xuXG4gICAgICAgIC8vLmZpbHRlcigobGlzdCwgaWR4KSA9PiB7XG4gICAgICAgIC8vY29uc29sZS5sb2coaWR4KTtcbiAgICAgICAgLy9pZHggPT09IGN1cnJlbnRUcmFja0luZGV4O1xuICAgICAgICAvL30pXG4gICAgICAgIC8vLm1hcChsaXN0ID0+IGxpc3QuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJykpO1xuXG4gICAgICAgIGlmIChzdGF0ZS5pc1BsYXlpbmcpIHtcbiAgICAgICAgICAgIHBsYXllckVsLmNsYXNzTGlzdC5hZGQoJ2lzUGxheWluZycpO1xuICAgICAgICAgICAgcGxheWVyRWwuY2xhc3NMaXN0LnJlbW92ZSgnaXNQYXVzZWQnKTtcbiAgICAgICAgICAgIHNjcnViYmVyLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuXG4gICAgICAgICAgICBzZXRBY3RpdmVUcmFja0NsYXNzKGN1cnJlbnRUcmFja0luZGV4KTtcblxuICAgICAgICAgICAgdHJhY2tMaXN0Lm1hcChmdW5jdGlvbiAobGlzdCkge1xuICAgICAgICAgICAgICAgIHZhciBjaGlsZHJlbiA9IEFycmF5LmZyb20obGlzdC5jaGlsZHJlbik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gY2hpbGRyZW4ubWFwKGZ1bmN0aW9uIChsaSkge1xuICAgICAgICAgICAgICAgICAgICBsaS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpO1xuICAgICAgICAgICAgICAgIH0pLmZpbHRlcihmdW5jdGlvbiAobGksIGlkeCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaWR4ID09PSBjdXJyZW50VHJhY2tJbmRleDtcbiAgICAgICAgICAgICAgICB9KS5tYXAoZnVuY3Rpb24gKGxpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsaS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKHN0YXRlLmlzUGF1c2VkKSB7XG4gICAgICAgICAgICBwbGF5ZXJFbC5jbGFzc0xpc3QucmVtb3ZlKCdpc1BsYXlpbmcnKTtcbiAgICAgICAgICAgIHBsYXllckVsLmNsYXNzTGlzdC5hZGQoJ2lzUGF1c2VkJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwbGF5ZXJFbC5jbGFzc0xpc3QucmVtb3ZlKCdpc1BsYXlpbmcnKTtcbiAgICAgICAgICAgIHBsYXllckVsLmNsYXNzTGlzdC5yZW1vdmUoJ2lzUGF1c2VkJyk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxufSx7XCIuL2FjdGlvbnNcIjoyNyxcIi4vY29uc3RhbnRzXCI6Mjl9XSwzMTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfYWN0aW9ucyA9IHJlcXVpcmUoJy4vYWN0aW9ucycpO1xuXG52YXIgaW5pdGlhbFN0YXRlID0ge1xuICAgIGlzRmV0Y2hpbmc6IGZhbHNlLFxuICAgIGlzUGxheWluZzogZmFsc2UsXG4gICAgaXNQYXVzZWQ6IGZhbHNlLFxuICAgIGN1cnJlbnRUcmFja0luZGV4OiAwLFxuICAgIGh1ZTogMCxcbiAgICBzYXR1cmF0aW9uOiAwLFxuICAgIG9wYWNpdHk6IDAuNlxufTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gZnVuY3Rpb24gKHN0YXRlLCBhY3Rpb24pIHtcbiAgICBpZiAoc3RhdGUgPT09IHVuZGVmaW5lZCkgc3RhdGUgPSBpbml0aWFsU3RhdGU7XG5cbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgICAgIGNhc2UgX2FjdGlvbnMuRkVUQ0hfVFJBQ0tTOlxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgICAgICAgICAgaXNGZXRjaGluZzogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIGNhc2UgX2FjdGlvbnMuRkVUQ0hfVFJBQ0tTX0VSUk9SOlxuICAgICAgICBjYXNlIF9hY3Rpb25zLkZFVENIX1RSQUNLU19TVUNDRVNTOlxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgICAgICAgICAgaXNGZXRjaGluZzogZmFsc2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICBjYXNlIF9hY3Rpb25zLlBMQVk6XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgICAgICBpc1BsYXlpbmc6IHRydWUsXG4gICAgICAgICAgICAgICAgaXNQYXVzZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGN1cnJlbnRUcmFja0luZGV4OiBhY3Rpb24ucGF5bG9hZC5fcGxheWxpc3RJbmRleFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIGNhc2UgX2FjdGlvbnMuUEFVU0U6XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgICAgICBpc1BsYXlpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGlzUGF1c2VkOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgY2FzZSBfYWN0aW9ucy5ORVhUOlxuICAgICAgICBjYXNlIF9hY3Rpb25zLlBSRVY6XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50VHJhY2tJbmRleDogYWN0aW9uLnBheWxvYWQuX3BsYXlsaXN0SW5kZXgsXG4gICAgICAgICAgICAgICAgaXNQbGF5aW5nOiB0cnVlLFxuICAgICAgICAgICAgICAgIGlzUGF1c2VkOiBmYWxzZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIGNhc2UgX2FjdGlvbnMuRU5EOlxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgICAgICAgICAgaXNQbGF5aW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBpc1BhdXNlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgaHVlOiAwLFxuICAgICAgICAgICAgICAgIHNhdHVyYXRpb246IDAsXG4gICAgICAgICAgICAgICAgY3VycmVudFRyYWNrSW5kZXg6IDAsXG4gICAgICAgICAgICAgICAgbGlnaHRuZXNzOiAwLFxuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICBjYXNlIF9hY3Rpb25zLkNIQU5HRV9CQUNLR1JPVU5EOlxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XG4gICAgICAgICAgICAgICAgaHVlOiBhY3Rpb24ucGF5bG9hZC5odWUgfHwgc3RhdGUuaHVlLFxuICAgICAgICAgICAgICAgIHNhdHVyYXRpb246IGFjdGlvbi5wYXlsb2FkLnNhdHVyYXRpb24gfHwgc3RhdGUuc2F0dXJhdGlvbixcbiAgICAgICAgICAgICAgICBsaWdodG5lc3M6IGFjdGlvbi5wYXlsb2FkLmxpZ2h0bmVzcyB8fCBzdGF0ZS5saWdodG5lc3NcbiAgICAgICAgICAgIH0pO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuXG59LHtcIi4vYWN0aW9uc1wiOjI3fV0sMzI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1snZGVmYXVsdCddID0gY3JlYXRlUm91dGVyO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfcGFnZSA9IHJlcXVpcmUoJ3BhZ2UnKTtcblxudmFyIF9wYWdlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3BhZ2UpO1xuXG52YXIgcGFnZU5hdkVscyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnN1Ym5hdiA+IGxpID4gYScpKTtcblxuZnVuY3Rpb24gY3JlYXRlUm91dGVyKCkge1xuICAgIGZ1bmN0aW9uIHJvdXRlKGN0eCwgbmV4dCkge1xuICAgICAgICB2YXIgaGFzaCA9IGN0eC5oYXNoO1xuXG4gICAgICAgIHBhZ2VOYXZFbHMubWFwKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgICAgICAgICByZXR1cm4gZWw7XG4gICAgICAgIH0pLmZpbHRlcihmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICAgIHJldHVybiBlbC5ocmVmID0gaGFzaDtcbiAgICAgICAgfSkubWFwKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgcmV0dXJuIGVsLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAoMCwgX3BhZ2UyWydkZWZhdWx0J10pKCcqJywgcm91dGUpO1xuICAgICgwLCBfcGFnZTJbJ2RlZmF1bHQnXSkoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG5cbn0se1wicGFnZVwiOjEyfV0sMzM6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gcmFuZG9tQmV0d2VlbjtcblxuZnVuY3Rpb24gcmFuZG9tQmV0d2VlbihtaW4sIG1heCkge1xuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkgKyBtaW4pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdO1xuXG59LHt9XSwzNDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4ndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9sb2Rhc2hGdW5jdGlvbk9uY2UgPSByZXF1aXJlKCdsb2Rhc2gvZnVuY3Rpb24vb25jZScpO1xuXG52YXIgX2xvZGFzaEZ1bmN0aW9uT25jZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9sb2Rhc2hGdW5jdGlvbk9uY2UpO1xuXG52YXIgUE9JTlRTID0gMjU2O1xuZXhwb3J0cy5QT0lOVFMgPSBQT0lOVFM7XG52YXIgSU5JVF9QT0lOVFMgPSA1MDtcbmV4cG9ydHMuSU5JVF9QT0lOVFMgPSBJTklUX1BPSU5UUztcbnZhciBhbXBsaXR1ZGUgPSAwLjU7XG5leHBvcnRzLmFtcGxpdHVkZSA9IGFtcGxpdHVkZTtcbnZhciBBTkdMRSA9IDEwO1xuZXhwb3J0cy5BTkdMRSA9IEFOR0xFO1xudmFyIFJBRElVUyA9IDIwMDtcbmV4cG9ydHMuUkFESVVTID0gUkFESVVTO1xudmFyIENPTE9SX0FNUCA9IDAuNDtcbmV4cG9ydHMuQ09MT1JfQU1QID0gQ09MT1JfQU1QO1xudmFyIE1BWF9BTFBIQSA9IDAuMTtcblxuZXhwb3J0cy5NQVhfQUxQSEEgPSBNQVhfQUxQSEE7XG52YXIgRlJBTUVfVEhST1RUTEUgPSA1O1xuXG5leHBvcnRzLkZSQU1FX1RIUk9UVExFID0gRlJBTUVfVEhST1RUTEU7XG5leHBvcnRzWydkZWZhdWx0J10gPSB7XG5cbiAgICAvLyBFeGl0XG4gICAgXCIwXCI6IHtcbiAgICAgICAgaHVlOiAzMixcbiAgICAgICAgc2F0dXJhdGlvbjogNTAsXG4gICAgICAgIGxpZ2h0bmVzczogODEsXG4gICAgICAgIHN0cm9rZUNvbG9yOiAncmdiYSgxNDQsIDkyLCA5MCwgMC41KScsXG4gICAgICAgIGZpbGxDb2xvcjogJ3JnYmEoMTQ0LCA5MiwgOTAsIDAuNSknXG4gICAgfSxcblxuICAgIC8vIEdob3N0XG4gICAgXCIxXCI6IHtcbiAgICAgICAgaHVlOiAzMCxcbiAgICAgICAgc2F0dXJhdGlvbjogODQsXG4gICAgICAgIGxpZ2h0bmVzczogODQsXG4gICAgICAgIGhpdHBvaW50czogWzg5LCAxNTBdLFxuICAgICAgICBzdHJva2VDb2xvcjogJ3JnYmEoMTU1LCAxOTksIDI0MywgMC41KScsXG4gICAgICAgIGZpbGxDb2xvcjogJ3JnYmEoMTU1LCAxOTksIDI0MywgMC41KSdcbiAgICB9LFxuXG4gICAgLy8gU2Vjb25kIFNraW5cbiAgICBcIjJcIjoge1xuICAgICAgICBodWU6IDIxMyxcbiAgICAgICAgc2F0dXJhdGlvbjogNTAsXG4gICAgICAgIGxpZ2h0bmVzczogMjksXG4gICAgICAgIHN0cm9rZUNvbG9yOiAncmdiYSgxMTIsIDExMiwgMTEyLCAwLjUpJyxcbiAgICAgICAgZmlsbENvbG9yOiAncmdiYSgxMTIsIDExMiwgMTEyLCAwLjUpJ1xuICAgIH0sXG5cbiAgICAvLyBSZWZsZWN0aW9uXG4gICAgXCIzXCI6IHtcbiAgICAgICAgaHVlOiAyMjcsXG4gICAgICAgIHNhdHVyYXRpb246IDUwLFxuICAgICAgICBsaWdodG5lc3M6IDksXG4gICAgICAgIHN0cm9rZUNvbG9yOiAncmdiYSgxNDQsIDkyLCA5MCwgMC41KScsXG4gICAgICAgIGZpbGxDb2xvcjogJ3JnYmEoMjUwLCAyNTAsIDI1MCwgMC41KSdcbiAgICB9LFxuXG4gICAgLy9GYXJld2VsbFxuICAgIFwiNFwiOiB7XG4gICAgICAgIGh1ZTogMjMwLFxuICAgICAgICBzYXR1cmF0aW9uOiA1MCxcbiAgICAgICAgbGlnaHRuZXNzOiAyLFxuICAgICAgICBzdHJva2VDb2xvcjogJ3JnYmEoMjUwLCAyNTAsIDI1MCwgMC41KScsXG4gICAgICAgIGZpbGxDb2xvcjogJ3JnYmEoMTksIDE0LCA0NSwgMC40KSdcbiAgICB9LFxuXG4gICAgLy8gU3RpbGxuZXNzXG4gICAgXCI1XCI6IHtcbiAgICAgICAgaHVlOiA3LFxuICAgICAgICBzYXR1cmF0aW9uOiA1MCxcbiAgICAgICAgbGlnaHRuZXNzOiAxNCxcbiAgICAgICAgc3Ryb2tlQ29sb3I6ICdyZ2JhKDE4LCA0NSwgNDgsIDAuNSknLFxuICAgICAgICBmaWxsQ29sb3I6ICdyZ2JhKDE4LCA0NSwgNDgsIDAuNSknXG4gICAgfSxcblxuICAgIC8vIFlvdW5nIEd1bnNcbiAgICBcIjZcIjoge1xuICAgICAgICBodWU6IDIsXG4gICAgICAgIHNhdHVyYXRpb246IDIzLFxuICAgICAgICBsaWdodG5lc3M6IDQ2LFxuICAgICAgICBzdHJva2VDb2xvcjogJ3JnYmEoODYsIDEyOCwgMTI5LCAwLjUpJyxcbiAgICAgICAgZmlsbENvbG9yOiAncmdiYSg4NiwgMTI4LCAxMjksIDAuNSknXG4gICAgfSxcblxuICAgIC8vIElubm9jZW50XG4gICAgXCI3XCI6IHtcbiAgICAgICAgaHVlOiAyNixcbiAgICAgICAgc2F0dXJhdGlvbjogNDksXG4gICAgICAgIGxpZ2h0bmVzczogNjcsXG4gICAgICAgIHN0cm9rZUNvbG9yOiAncmdiYSgxMTksIDE2NywgMjA0LCAwLjUpJyxcbiAgICAgICAgZmlsbENvbG9yOiAncmdiYSgxMTksIDE2NywgMjA0LCAwLjUpJ1xuICAgIH0sXG5cbiAgICAvLyBXYWtlXG4gICAgXCI4XCI6IHtcbiAgICAgICAgaHVlOiAxNzUsXG4gICAgICAgIHNhdHVyYXRpb246IDE3LFxuICAgICAgICBsaWdodG5lc3M6IDc4LFxuICAgICAgICBzdHJva2VDb2xvcjogJ3JnYmEoMTAsIDEwLCAxMCwgMC41KScsXG4gICAgICAgIGZpbGxDb2xvcjogJ3JnYmEoMTk4LCAxNzcsIDE3OSwgMC41KSdcbiAgICB9XG59O1xuXG59LHtcImxvZGFzaC9mdW5jdGlvbi9vbmNlXCI6M31dLDM1OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGdlbmVyYXRlO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfbG9kYXNoVXRpbGl0eVJhbmdlID0gcmVxdWlyZSgnbG9kYXNoL3V0aWxpdHkvcmFuZ2UnKTtcblxudmFyIF9sb2Rhc2hVdGlsaXR5UmFuZ2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbG9kYXNoVXRpbGl0eVJhbmdlKTtcblxudmFyIF9sb2Rhc2hGdW5jdGlvbk9uY2UgPSByZXF1aXJlKCdsb2Rhc2gvZnVuY3Rpb24vb25jZScpO1xuXG52YXIgX2xvZGFzaEZ1bmN0aW9uT25jZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9sb2Rhc2hGdW5jdGlvbk9uY2UpO1xuXG52YXIgX2NvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnJyk7XG5cbnZhciBfYWN0aW9ucyA9IHJlcXVpcmUoJy4uL2FjdGlvbnMnKTtcblxudmFyIF91dGlsc1JhbmRvbUJldHdlZW4gPSByZXF1aXJlKCcuLi91dGlscy9yYW5kb21CZXR3ZWVuJyk7XG5cbnZhciBfdXRpbHNSYW5kb21CZXR3ZWVuMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3V0aWxzUmFuZG9tQmV0d2Vlbik7XG5cbmZ1bmN0aW9uIGluaXRNb3VudGFpbihwYXBlcikge1xuICAgIHZhciBtaXJyb3JlZCA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogYXJndW1lbnRzWzFdO1xuXG4gICAgdmFyIHBhdGggPSBuZXcgcGFwZXIuUGF0aCgpO1xuICAgIHZhciB3aWR0aCA9IHBhcGVyLnZpZXcuc2l6ZS53aWR0aDtcbiAgICB2YXIgaGVpZ2h0ID0gcGFwZXIudmlldy5zaXplLmhlaWdodDtcbiAgICB2YXIgd2lkdGhPZmZzZXQgPSA1MDtcbiAgICB2YXIgcmVkID0gMzY7XG5cbiAgICByZWQgKz0gMjA7XG5cbiAgICBwYXRoLmNsb3NlZCA9IGZhbHNlO1xuICAgIHBhdGgucG9zaXRpb24ueCA9IDA7XG4gICAgcGF0aC5wb3NpdGlvbi55ID0gcGFwZXIudmlldy5zaXplLmhlaWdodDtcbiAgICBwYXRoLnN0cm9rZUNvbG9yID0gJ3JnYmEoJyArIHJlZCArICcsIDcwLCAxMTEsIDAuMyknO1xuICAgIHBhdGguZmlsbENvbG9yID0gJ3JnYmEoJyArIHJlZCArICcsIDcwLCAxMTEsIDApJztcbiAgICBwYXRoLm1pcnJvcmVkID0gbWlycm9yZWQ7XG5cbiAgICBwYXRoLmFkZChuZXcgcGFwZXIuUG9pbnQobWlycm9yZWQgPyB3aWR0aCArIHdpZHRoT2Zmc2V0IDogLXdpZHRoT2Zmc2V0LCBoZWlnaHQpKTtcblxuICAgIHBhdGgucG9zaXRpb24ueSA9IHBhcGVyLnZpZXcuc2l6ZS5oZWlnaHQ7XG5cbiAgICBwYXRoLnNtb290aCgpO1xuXG4gICAgcmV0dXJuIHBhdGg7XG59XG5cbmZ1bmN0aW9uIGluaXRQYXRoKHBhcGVyLCBjb25maWcpIHtcbiAgICB2YXIgcGF0aCA9IG5ldyBwYXBlci5QYXRoKCk7XG4gICAgdmFyIHdpZHRoID0gcGFwZXIudmlldy5zaXplLndpZHRoO1xuICAgIHZhciBoZWlnaHQgPSBwYXBlci52aWV3LnNpemUuaGVpZ2h0O1xuICAgIHZhciByYWRpdXMgPSAxMDA7XG5cbiAgICAvL3BhdGguc3Ryb2tlQ29sb3IgPSBjb25maWcuc3Ryb2tlQ29sb3IgfHwgJyM0NDQnO1xuICAgIC8vcGF0aC5maWxsQ29sb3IgPSBjb25maWcuZmlsbENvbG9yIHx8ICcjNDQ0JztcbiAgICBwYXRoLnN0cm9rZVdpZHRoID0gMTtcbiAgICBwYXRoLnNtb290aCgpO1xuXG4gICAgdmFyIGludGVydmFsID0gd2lkdGggLyBfY29uZmlnLlBPSU5UUztcblxuICAgICgwLCBfbG9kYXNoVXRpbGl0eVJhbmdlMlsnZGVmYXVsdCddKShfY29uZmlnLlBPSU5UUykubWFwKGZ1bmN0aW9uIChwbnQsIGkpIHtcbiAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICAgIHBhdGguYWRkKG5ldyBwYXBlci5Qb2ludCgtMTAwLCAwKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaSA9PT0gX2NvbmZpZy5QT0lOVFMgLSAxKSB7XG4gICAgICAgICAgICBwYXRoLmFkZChuZXcgcGFwZXIuUG9pbnQod2lkdGggKyAyMDAsIDApKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhdGguYWRkKG5ldyBwYXBlci5Qb2ludChwbnQgKiBpbnRlcnZhbCwgMCkpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBwYXRoLnBvc2l0aW9uLnkgPSBoZWlnaHQ7XG5cbiAgICByZXR1cm4gcGF0aDtcbn1cblxuZnVuY3Rpb24gZGltUGF0aChwYXRoKSB7XG4gICAgcmV0dXJuIHBhdGguZmlsbENvbG9yLmFscGhhIC09IDAuMDE7XG59XG5cbmZ1bmN0aW9uIHNob3VsZERpbShwYXRoKSB7XG4gICAgcmV0dXJuIHBhdGguZmlsbENvbG9yICYmIHBhdGguZmlsbENvbG9yLmFscGhhICYmIHBhdGguZmlsbENvbG9yLmFscGhhID4gX2NvbmZpZy5NQVhfQUxQSEE7XG59XG5cbnZhciBoZWlnaHRDaGFuZ2UgPSAxO1xudmFyIHBhdGhzID0gW107XG52YXIgY3VycmVudFBhdGhJbmRleCA9IC0xO1xudmFyIHBhdGggPSB1bmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGdlbmVyYXRlKHBhcGVyLCBwbGF5ZXIsIHN0b3JlLCB0cmFja0NvbmZpZykge1xuXG4gICAgdmFyIHdpZHRoID0gcGFwZXIudmlldy5zaXplLndpZHRoO1xuICAgIHZhciBoZWlnaHQgPSBwYXBlci52aWV3LnNpemUuaGVpZ2h0O1xuXG4gICAgaGVpZ2h0Q2hhbmdlICs9IDAuMDE7XG5cbiAgICBwYXBlci5wcm9qZWN0LmNsZWFyKCk7XG5cbiAgICB2YXIgYmFySGVpZ2h0ID0gdW5kZWZpbmVkO1xuICAgIHBhdGggPSBpbml0UGF0aChwYXBlcik7XG4gICAgcGF0aC5zdHJva2VDb2xvciA9IHRyYWNrQ29uZmlnLnN0cm9rZUNvbG9yIHx8ICcjNDQ0JztcbiAgICBwYXRoLmZpbGxDb2xvciA9IHRyYWNrQ29uZmlnLmZpbGxDb2xvciB8fCAnIzQ0NCc7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKGRhdGEsIGV2ZW50KSB7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfY29uZmlnLlBPSU5UUzsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoaSAhPT0gMCAmJiBpICE9PSBfY29uZmlnLlBPSU5UUyAtIDEpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VnbWVudCA9IHBhdGguc2VnbWVudHNbaV07XG4gICAgICAgICAgICAgICAgYmFySGVpZ2h0ID0gZGF0YVtpXSAqIF9jb25maWcuYW1wbGl0dWRlICogaGVpZ2h0Q2hhbmdlO1xuICAgICAgICAgICAgICAgIHNlZ21lbnQucG9pbnQueSA9IGhlaWdodCAtIGJhckhlaWdodDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddO1xuXG59LHtcIi4uL2FjdGlvbnNcIjoyNyxcIi4uL3V0aWxzL3JhbmRvbUJldHdlZW5cIjozMyxcIi4vY29uZmlnXCI6MzQsXCJsb2Rhc2gvZnVuY3Rpb24vb25jZVwiOjMsXCJsb2Rhc2gvdXRpbGl0eS9yYW5nZVwiOjExfV0sMzY6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX3NsaWNlZFRvQXJyYXkgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBzbGljZUl0ZXJhdG9yKGFyciwgaSkgeyB2YXIgX2FyciA9IFtdOyB2YXIgX24gPSB0cnVlOyB2YXIgX2QgPSBmYWxzZTsgdmFyIF9lID0gdW5kZWZpbmVkOyB0cnkgeyBmb3IgKHZhciBfaSA9IGFycltTeW1ib2wuaXRlcmF0b3JdKCksIF9zOyAhKF9uID0gKF9zID0gX2kubmV4dCgpKS5kb25lKTsgX24gPSB0cnVlKSB7IF9hcnIucHVzaChfcy52YWx1ZSk7IGlmIChpICYmIF9hcnIubGVuZ3RoID09PSBpKSBicmVhazsgfSB9IGNhdGNoIChlcnIpIHsgX2QgPSB0cnVlOyBfZSA9IGVycjsgfSBmaW5hbGx5IHsgdHJ5IHsgaWYgKCFfbiAmJiBfaVsncmV0dXJuJ10pIF9pWydyZXR1cm4nXSgpOyB9IGZpbmFsbHkgeyBpZiAoX2QpIHRocm93IF9lOyB9IH0gcmV0dXJuIF9hcnI7IH0gcmV0dXJuIGZ1bmN0aW9uIChhcnIsIGkpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgeyByZXR1cm4gYXJyOyB9IGVsc2UgaWYgKFN5bWJvbC5pdGVyYXRvciBpbiBPYmplY3QoYXJyKSkgeyByZXR1cm4gc2xpY2VJdGVyYXRvcihhcnIsIGkpOyB9IGVsc2UgeyB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGF0dGVtcHQgdG8gZGVzdHJ1Y3R1cmUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlJyk7IH0gfTsgfSkoKTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gY3JlYXRlVmlzdWFsaXplcjtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX2ZyZXEgPSByZXF1aXJlKCcuL2ZyZXEnKTtcblxudmFyIF9mcmVxMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2ZyZXEpO1xuXG52YXIgX2FjdGlvbnMgPSByZXF1aXJlKCcuLi9hY3Rpb25zJyk7XG5cbnZhciBfY29uZmlnID0gcmVxdWlyZSgnLi9jb25maWcnKTtcblxudmFyIF9jb25maWcyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY29uZmlnKTtcblxuZnVuY3Rpb24gcmVuZGVyKHBsYXllciwgc3RvcmUsIGFuYWx5c2VyLCBmcmVxQnl0ZURhdGEsIHBhcGVyKSB7XG5cbiAgICB2YXIgc3RhdGUgPSBzdG9yZS5nZXRTdGF0ZSgpO1xuICAgIHZhciBjdXJyZW50VHJhY2tJbmRleCA9IHN0YXRlLmN1cnJlbnRUcmFja0luZGV4O1xuICAgIHZhciB0cmFja0NvbmZpZyA9IF9jb25maWcyWydkZWZhdWx0J11bY3VycmVudFRyYWNrSW5kZXhdO1xuICAgIHZhciBzdHJva2VDb2xvciA9IHRyYWNrQ29uZmlnLnN0cm9rZUNvbG9yO1xuICAgIHZhciBoaXRwb2ludHMgPSB0cmFja0NvbmZpZy5oaXRwb2ludHM7XG5cbiAgICBmdW5jdGlvbiBydW4oKSB7XG4gICAgICAgIHZhciB2aXN1YWxpemVyID0gKDAsIF9mcmVxMlsnZGVmYXVsdCddKShwYXBlciwgcGxheWVyLCBzdG9yZSwgdHJhY2tDb25maWcpO1xuXG4gICAgICAgIHJldHVybiBwYXBlci52aWV3Lm9uRnJhbWUgPSBmdW5jdGlvbiAoZXZlbnQpIHtcblxuICAgICAgICAgICAgaWYgKGV2ZW50LmNvdW50ICUgX2NvbmZpZy5GUkFNRV9USFJPVFRMRSA9PT0gMCkge1xuXG4gICAgICAgICAgICAgICAgYW5hbHlzZXIuZ2V0Qnl0ZUZyZXF1ZW5jeURhdGEoZnJlcUJ5dGVEYXRhKTtcblxuICAgICAgICAgICAgICAgIHZpc3VhbGl6ZXIoZnJlcUJ5dGVEYXRhLCBldmVudCk7XG5cbiAgICAgICAgICAgICAgICBwYXBlci52aWV3LmRyYXcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwYXBlci52aWV3Lm9uUmVzaXplID0gcnVuO1xuXG4gICAgdmFyIGRpc3Bvc2UgPSBzdG9yZS5zdWJzY3JpYmUoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc3RhdGUgPSBzdG9yZS5nZXRTdGF0ZSgpO1xuXG4gICAgICAgIGlmIChjdXJyZW50VHJhY2tJbmRleCAhPT0gc3RhdGUuY3VycmVudFRyYWNrSW5kZXgpIHtcbiAgICAgICAgICAgIGN1cnJlbnRUcmFja0luZGV4ID0gc3RhdGUuY3VycmVudFRyYWNrSW5kZXg7XG4gICAgICAgICAgICB0cmFja0NvbmZpZyA9IF9jb25maWcyWydkZWZhdWx0J11bY3VycmVudFRyYWNrSW5kZXhdO1xuICAgICAgICAgICAgc3Ryb2tlQ29sb3IgPSB0cmFja0NvbmZpZy5zdHJva2VDb2xvcjtcblxuICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goKDAsIF9hY3Rpb25zLmNoYW5nZUJhY2tncm91bmQpKHtcbiAgICAgICAgICAgICAgICBodWU6IHRyYWNrQ29uZmlnLmh1ZSxcbiAgICAgICAgICAgICAgICBzYXR1cmF0aW9uOiB0cmFja0NvbmZpZy5zYXR1cmF0aW9uLFxuICAgICAgICAgICAgICAgIGxpZ2h0bmVzczogdHJhY2tDb25maWcubGlnaHRuZXNzXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXN0YXRlLmlzUGxheWluZykge1xuICAgICAgICAgICAgcGFwZXIudmlldy5vZmYoJ2ZyYW1lJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBydW4oKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHBhcGVyO1xufVxuXG5mdW5jdGlvbiBpbml0UGFwZXIoY2FudmFzKSB7XG4gICAgcGFwZXIuc2V0dXAoY2FudmFzKTtcbiAgICBwYXBlci52aWV3LmZpbGxDb2xvciA9ICdyZ2IoMjU1LDI1NSwyMzMpJztcblxuICAgIHJldHVybiBwYXBlcjtcbn1cblxuZnVuY3Rpb24gaW5pdEF1ZGlvKHBsYXllcikge1xuICAgIHZhciBhdWRpbyA9IHBsYXllci5hdWRpbztcbiAgICBhdWRpby5jcm9zc09yaWdpbiA9ICdhbm9ueW1vdXMnO1xuICAgIHZhciBjb250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xuICAgIHZhciBhbmFseXNlciA9IGNvbnRleHQuY3JlYXRlQW5hbHlzZXIoKTtcbiAgICB2YXIgc291cmNlID0gY29udGV4dC5jcmVhdGVNZWRpYUVsZW1lbnRTb3VyY2UoYXVkaW8pO1xuICAgIHZhciBmcmVxQnl0ZURhdGEgPSBuZXcgVWludDhBcnJheShhbmFseXNlci5mcmVxdWVuY3lCaW5Db3VudCk7XG5cbiAgICBzb3VyY2UuY29ubmVjdChhbmFseXNlcik7XG4gICAgYW5hbHlzZXIuY29ubmVjdChjb250ZXh0LmRlc3RpbmF0aW9uKTtcblxuICAgIHJldHVybiBbYW5hbHlzZXIsIGZyZXFCeXRlRGF0YV07XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVZpc3VhbGl6ZXIocGxheWVyLCBzdG9yZSkge1xuICAgIHZhciBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlzdWFsaXplcicpO1xuXG4gICAgdmFyIF9pbml0QXVkaW8gPSBpbml0QXVkaW8ocGxheWVyKTtcblxuICAgIHZhciBfaW5pdEF1ZGlvMiA9IF9zbGljZWRUb0FycmF5KF9pbml0QXVkaW8sIDIpO1xuXG4gICAgdmFyIGFuYWx5c2VyID0gX2luaXRBdWRpbzJbMF07XG4gICAgdmFyIGZyZXFCeXRlRGF0YSA9IF9pbml0QXVkaW8yWzFdO1xuXG4gICAgdmFyIHBhcGVyID0gaW5pdFBhcGVyKGNhbnZhcyk7XG5cbiAgICByZXR1cm4gcmVuZGVyKHBsYXllciwgc3RvcmUsIGFuYWx5c2VyLCBmcmVxQnl0ZURhdGEsIHBhcGVyKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG5cbn0se1wiLi4vYWN0aW9uc1wiOjI3LFwiLi9jb25maWdcIjozNCxcIi4vZnJlcVwiOjM1fV19LHt9LFsyOF0pO1xuIl0sImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
