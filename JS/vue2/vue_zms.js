/*!
 * Vue_zms.js v0.0.1
 * (c) 2022-08-24 张梦思
 * Released under the MIT License.
 */
(function (global, factory) {
    // debugger
    if (typeof exports === 'object' && typeof module != 'undefined') {
        module.exports = factory()
    }
    else if (typeof define === 'function' && define.amd) {
        define(factory)
    }
    else {
        if (typeof globalThis !== 'undefined') {
            // 最终走到了这里，其实浏览器环境中this === globalThis
            global = globalThis
        } else {
            global = global || self
        }
        global.Vue = factory()
    }
})(this, (function () {
    'use strict';

    var emptyObject = Object.freeze({});
    var isArray = Array.isArray;

    // These helpers produce better VM code in JS engines due to their explicitness and function inlining.
    function isUndef(v) {
        return v === undefined || v === null;
    }
    function isDef(v) {
        return v !== undefined && v !== null;
    }
    function isTrue(v) {
        return v === true;
    }
    function isFalse(v) {
        return v === false;
    }

    // Check if value is primitive.
    function isPrimitive(value) {
        return (typeof value === 'string' ||
            typeof value === 'number' ||
            // $flow-disable-line
            typeof value === 'symbol' ||
            typeof value === 'boolean');
    }
    function isFunction(value) {
        return typeof value === 'function';
    }

    // Quick object check - this is primarily used to tell objects from primitive values when we know the value is a JSON-compliant type.
    function isObject(obj) {
        return obj !== null && typeof obj === 'object';
    }

    // Get the raw type string of a value, e.g., [object Object].
    var _toString = Object.prototype.toString;
    function toRawType(value) {
        return _toString.call(value).slice(8, -1);
    }

    // Strict object type check. Only returns true for plain JavaScript objects.
    function isPlainObject(obj) {
        return _toString.call(obj) === '[object Object]';
    }

    function isRegExp(v) {
        return _toString.call(v) === '[object RegExp]';
    }

    // Check if val is a valid array index.
    function isValidArrayIndex(val) {
        var n = parseFloat(String(val));
        return n >= 0 && Math.floor(n) === n && isFinite(val);
    }

    function isPromise(val) {
        return (isDef(val) &&
            typeof val.then === 'function' &&
            typeof val.catch === 'function');
    }

    // Convert a value to a string that is actually rendered.
    function toString(val) {
        return val == null
            ? ''
            : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
                ? JSON.stringify(val, null, 2)
                : String(val);
    }

    // Convert an input value to a number for persistence.If the conversion fails, return original string.
    function toNumber(val) {
        var n = parseFloat(val);
        return isNaN(n) ? val : n;
    }

    // Make a map and return a function for checking if a key is in that map.
    function makeMap(str, expectsLowerCase) {
        var map = Object.create(null);
        var list = str.split(',');
        for (var i = 0; i < list.length; i++) {
            map[list[i]] = true;
        }
        if (expectsLowerCase) {
            return function (val) { return map[val.toLowerCase()]; }
        } else {
            return function (val) { return map[val]; }
        }
    }

    // Check if a tag is a built-in tag.
    var isBuiltInTag = makeMap('slot,component', true);

    // Check if an attribute is a reserved attribute.
    var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

    // Remove an item from an array.
    function remove$2(arr, item) {
        if (arr.length) {
            var index = arr.indexOf(item);
            if (index > -1) {
                return arr.splice(index, 1);
            }
        }
    }

    // Check whether an object has the property.
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    function hasOwn(obj, key) {
        return hasOwnProperty.call(obj, key);
    }

    // Create a cached version of a pure function.
    function cached(fn) {
        var cache = Object.create(null);
        return function cachedFn(str) {
            var hit = cache[str];
            return hit || (cache[str] = fn(str));
        };
    }

    // Camelize a hyphen-delimited string.
    var camelizeRE = /-(\w)/g;
    var camelize = cached(function (str) {
        return str.replace(camelizeRE, function (_, c) {
            return (c ? c.toUpperCase() : '');
        });
    });

    // Capitalize a string.
    var capitalize = cached(function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    });

    // Hyphenate a camelCase string.
    var hyphenateRE = /\B([A-Z])/g;
    var hyphenate = cached(function (str) {
        return str.replace(hyphenateRE, '-$1').toLowerCase();
    });

    /**
     * Simple bind polyfill for environments that do not support it,
     * e.g., PhantomJS 1.x. Technically, we don't need this anymore
     * since native bind is now performant enough in most browsers.
     * But removing it would mean breaking code that was able to run in
     * PhantomJS 1.x, so this must be kept for backward compatibility.
     */
    /* istanbul ignore next */
    function polyfillBind(fn, ctx) {
        function boundFn(a) {
            var l = arguments.length;
            return l
                ? l > 1
                    ? fn.apply(ctx, arguments)
                    : fn.call(ctx, a)
                : fn.call(ctx);
        }
        boundFn._length = fn.length;
        return boundFn;
    }
    function nativeBind(fn, ctx) {
        return fn.bind(ctx);
    }
    // @ts-expect-error bind cannot be `undefined`
    var bind$1 = Function.prototype.bind ? nativeBind : polyfillBind;




















}));