/*!
 * seed - memory store # extends ../store.js
 * Copyright(c) 2011 Jake Luer <@jakeluer>
 * MIT Licensed
 */

var Store = require('./index')
  , Hash = require('../hash')
  , utils = require('../utils')
  , uid = new utils.Flake();

/*!
 * # Notes
 *
 * Using process.nextTick is not actually needed here
 * but is used in order to demonstrate what a async
 * Storage API would look like.
 */

/**
 * # Store
 *
 * The default store template that can be extended
 * by storage engines. Declares default sync option.
 *
 * @api prototype
 */

var MemoryStore = module.exports = Store.extend({

    initialize: function () {
      this.store = new Hash();
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
      var promise = new this.Promise()
        , self = this;

      process.nextTick(function() {
        var id = seed.data.id;
        if (!id) {
          id = uid.gen();
          seed.data.id = id;
        }
        self.store.set(id, seed.data);
        promise.resolve(self.store.get(id));
      });

      return promise.promise;
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
      var promise = new this.Promise(),
          self = this,
          id = seed.data.id;

      process.nextTick(function() {
        var res = self.store.get(id);
        if (res) {
          promise.resolve(res);
        } else {
          promise.reject({ code: 3, message: 'seed doesn\'t exist on server'});
        }
      });

      return promise.promise;
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
      var promise = new this.Promise(),
          self = this;

      process.nextTick(function() {
        var id = seed.data.id;
        if (!id) { return promise.reject({ code: 1, message: 'can\'t read without an id' });}
        if (!self.store.get(id)) { return promise.reject({ code: 3, message: 'seed doesn\'t exist on server'}); }

        self.store.del(id);
        promise.resolve(id);
      });

      return promise.promise;
    }

});