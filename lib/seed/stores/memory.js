/*!
 * seed - memory store # extends ../store.js
 * Copyright(c) 2011 Jake Luer <@jakeluer>
 * MIT Licensed
 */

var Store = require('../store')
  , Promise = require('oath')
  , Hash = require('../hash')
  , SeedError = require('../error')
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
      var promise = new Promise()
        , self = this;

      process.nextTick(function() {
        var id = seed.data.id
          , type = seed.collection;
        if (!id) {
          id = uid.gen();
          seed.data.id = id;
        }

        if (!self.store[type])
          self.store[type] = new Hash();

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
     * @public {Object} seed prepared model from sync.
     * @api public
     */

  , get: function (seed) {
      var promise = new Promise()
        , self = this
        , id = seed.data.id
        , type = seed.collection;

      process.nextTick(function() {
        var group = self.store[type];
        if (!group) {
          promise.reject(new SeedError('seed type doesn\'t exist in store'));
          return;
        }

        var res = group.get(id);
        if (res) {
          promise.resolve(res);
        } else {
          promise.reject(new SeedError('seed doesn\'t exist on server'));
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
      var promise = new Promise()
        , self = this;

      process.nextTick(function() {
        var id = seed.data.id
          , type = seed.collection
          , group = self.store[type];

        if (!id) return promise.reject(new SeedError('can\'t read without an id' ));
        if (!group) return promise.reject(new SeedError('seed type doesn\'t exist in store'));

        if (group.get(id)) group.del(id);
        if (group.length == 0) delete self.store[type];
        promise.resolve(id);
      });

      return promise.promise;
    }

  , fetch: function (seed) {
      var promise = new Promise()
        , self = this;

      process.nextTick(function () {
        var type = seed.collection
          , query = seed.query
          , group = self.store[type]
          , res = [];

        if (!group) return promise.reject(new SeedError('seed type doesn\'t exist in store'));
        group.find(query).each(function (value) {
          res.push(value);
        });
        promise.resolve(res);
      });

      return promise.promise;
    }

});
