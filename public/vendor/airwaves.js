/*
       ( ( ( ( ( airwaves ) ) ) ) )

    Broadcast on a dedicated frequency
      Copyright 2012, David Chambers
*/

var Channel, airwaves, remove, split, subscribe,
  __slice = [].slice,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

remove = function(array, value) {
  var idx;
  idx = 0;
  while (idx < array.length) {
    if (array[idx] === value) {
      array.splice(idx, 1);
    } else {
      idx += 1;
    }
  }
};

split = function(fn) {
  return function() {
    var args, n, names;
    names = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return fn.call.apply(fn, [this, (function() {
      var _i, _len, _ref, _results;
      _ref = ("" + names).split(/[,\s]+/);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        n = _ref[_i];
        if (n) {
          _results.push(n);
        }
      }
      return _results;
    })()].concat(__slice.call(args)));
  };
};

subscribe = function(propertyName) {
  return function(names, fn) {
    var name, _i, _len;
    for (_i = 0, _len = names.length; _i < _len; _i++) {
      name = names[_i];
      if (!Object.prototype.hasOwnProperty.call(this.subscriptions, name)) {
        this.subscriptions[name] = {
          ints: [],
          subs: []
        };
      }
      this.subscriptions[name][propertyName].push(fn);
    }
  };
};

Channel = (function() {

  function Channel() {
    this.subscriptions = {};
    this.stack = [];
  }

  Channel.prototype.intercept = split(subscribe('ints'));

  Channel.prototype.subscribe = split(subscribe('subs'));

  Channel.prototype.unsubscribe = split(function(names, fn) {
    var name, _i, _len;
    for (_i = 0, _len = names.length; _i < _len; _i++) {
      name = names[_i];
      if (fn === void 0) {
        delete this.subscriptions[name];
      } else if (Object.prototype.hasOwnProperty.call(this.subscriptions, name)) {
        remove(this.subscriptions[name].ints, fn);
        remove(this.subscriptions[name].subs, fn);
      }
    }
  });

  Channel.prototype.broadcast = split(function() {
    var args, name, names, next, queue, sub, wrap, _i, _len;
    names = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    for (_i = 0, _len = names.length; _i < _len; _i++) {
      name = names[_i];
      if (__indexOf.call(this.stack, name) >= 0) {
        continue;
      }
      if (!Object.prototype.hasOwnProperty.call(this.subscriptions, name)) {
        continue;
      }
      this.stack.push(name);
      queue = this.subscriptions[name].ints.slice(0);
      wrap = function(fn) {
        return function() {
          var args, next;
          next = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
          fn.apply(null, args);
          return next.apply(null, args);
        };
      };
      queue.push.apply(queue, (function() {
        var _j, _len1, _ref, _results;
        _ref = this.subscriptions[name].subs;
        _results = [];
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          sub = _ref[_j];
          _results.push(wrap(sub));
        }
        return _results;
      }).call(this));
      next = function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (queue.length) {
          return queue.shift().apply(null, [next].concat(__slice.call(args)));
        }
      };
      try {
        next.apply(null, args);
      } finally {
        this.stack.pop();
      }
    }
  });

  return Channel;

})();

airwaves = {
  Channel: Channel,
  version: '0.2.2'
};

if (typeof module !== 'undefined') {
  module.exports = airwaves;
} else if (typeof define === 'function' && define.amd) {
  define(airwaves);
} else {
  window.airwaves = airwaves;
}
