/*!
 * seed - memory store # extends ../store.js
 * Copyright(c) 2011 Jake Luer <@jakeluer>
 * MIT Licensed
 */

var Store = require('./store')
  , utils = require('../utils')
  , uid = new utils.Flake();

/**
 * # Store
 *
 * The default store template that can be extended
 * by storage engines. Declares default sync option.
 *
 * @api prototype
 */

var MemoryStore = module.exports = Seed.Store.extend({

    initialize: function () {
      this.store = {};
    }

  /**
   * # .set()
   *
   * Create or update: Set the whole value of an entry
   * in the store. Creates an ID if one does not exist.
   *
   * @public {Object} seed prepared model from sync.
   * @api public
   */

  , set: function (seed) {
      var promise = new oath(),
          self = this;

      nextTick(function() {
        var id = seed.data.id;
        if (!id) {
          id = uid.gen();
          seed.data.id = id;
        }
        self.store[id] = seed.data;
        promise.resolve(self.store[id]);
      });

      return promise;
    }

    /**
     * # .get()
     *
     * Read: Get the value of an entry in the store
     * given an ID.
     *
     * @public {Object} seed prepared model from sync.
     * @api public
     */

  , get: function (seed) {
      var promise = new oath(),
          self = this,
          id = seed.data.id;

      nextTick(function() {
        if (self.store[id]) {
          promise.resolve(self.store[id]);
        } else {
          promise.reject({ code: 3, message: 'seed doesn\'t exist on server'});
        }
      });

      return promise;
    }

    /**
     * # .destroy()
     *
     * Delete: Remove an entry from the database. Emits
     * an error message if no Id in object or object doesn't
     * exist.
     *
     * @public {Object} seed prepared model from sync.
     * @api public
     */

  , destroy: function (seed) {
      var promise = new oath(),
          self = this;

      nextTick(function() {
        var id = seed.data.id;
        if (!id) { return promise.reject({ code: 1, message: 'can\'t read without an id' });}
        if (!self.store[id]) { return promise.reject({ code: 3, message: 'seed doesn\'t exist on server'}); }

        if (self.store[id]) delete self.store[id];
        promise.resolve(id);
      });

      return promise;
    }

});