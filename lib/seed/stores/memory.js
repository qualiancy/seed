/*!
 * seed - memory store # extends ../store.js
 * Copyright(c) 2011-2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

var Store = require('../store')
  , Promise = require('../base/promise')
  , Hash = require('../hash')
  , SeedError = require('../base/error')
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

    name: 'MemoryStore'

  , initialize: function () {
      this.store = Object.create(null);
    }

    /**
     * # .set()
     *
     * Create or update: Set the whole value of an entry
     * in the store. Creates an ID if one does not exist.
     *
     * @param {Object} seed prepared model from sync.
     * @api public
     */

  , set: function (seed) {
      var self = this
        , promise = new Promise()
        , id = seed.data._id
        , type = seed.collection;

      if (!id) {
        id = uid.gen();
        seed.data._id = id;
      }

      process.nextTick(function () {
        if (!self.store[type]) self.store[type] = new Hash();
        self.store[type].set(id, seed.data);
        promise.resolve(self.store[type].get(id));
      });

      return promise.promise;
    }

    /**
     * # .get()
     *
     * Read: Get the value of an entry in the store
     * given an ID.
     *
     * @param {Object} seed prepared model from sync.
     * @api public
     */

  , get: function (seed) {
      var self = this
        , promise = new Promise()
        , id = seed.data._id
        , type = seed.collection
        , group = this.store[type];

      process.nextTick(function () {
        if (!group) return promise.reject(new SeedError('seed type doesn\'t exist in store'));
        var res = group.get(id);
        if (res) promise.resolve(res);
        else promise.reject(new SeedError('seed doesn\'t exist on server'));
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
      var promise = new Promise()
        , id = seed.data._id
        , type = seed.collection
        , group = this.store[type];

      process.nextTick(function () {
        if (!id) return promise.reject(new SeedError('can\'t read without an id' ));
        if (!group) return promise.reject(new SeedError('seed type doesn\'t exist in store'));
        group.del(id);
        promise.resolve(id);
      });

      return promise.promise;
    }

  , fetch: function (seed) {
      var promise = new Promise()
        , type = seed.collection
        , query = seed.query
        , group = this.store[type]
        , res = [];

      process.nextTick(function () {
        if (!group) return promise.reject(new SeedError('seed type doesn\'t exist in store'));
        group.find(query).each(function (value) { res.push(value); });
        promise.resolve(res);
      });

      return promise.promise;
    }

});
