/*!
 * Seed - MemoryStore Constructor
 * Copyright(c) 2011-2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

var async = require('../base/async')
  , errors = require('../errors/store')
  , Hash = require('../base/hash')
  , Promise = require('../base/promise')
  , Store = require('../store')
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

      if (!this.store[type]) this.store[type] = new Hash();
      var group = this.store[type];

      if (!id) {
        id = uid.gen();
        seed.data._id = id;
      }

      async.nextTick(function () {
        group.set(id, seed.data);
        promise.resolve(group.get(id));
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
        , type = seed.collection;

      if (!this.store[type]) this.store[type] = new Hash();
      var group = this.store[type];

      async.nextTick(function () {
        var res = group.get(id);
        if (res) promise.resolve(res);
        else promise.reject(errors.create('not found'));
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
        , type = seed.collection;

      if (!this.store[type]) this.store[type] = new Hash();
      var group = this.store[type];

      async.nextTick(function () {
        if (!id) return promise.reject(errors.create('no id'));
        group.del(id);
        promise.resolve(id);
      });

      return promise.promise;
    }

  , fetch: function (seed) {
      var promise = new Promise()
        , type = seed.collection
        , query = seed.query
        , res = [];

      if (!this.store[type]) this.store[type] = new Hash();
      var group = this.store[type];

      async.nextTick(function () {
        group.find(query).each(function (value) { res.push(value); });
        promise.resolve(res);
      });

      return promise.promise;
    }

});
