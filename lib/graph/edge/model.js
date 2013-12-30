var async = require('../../base/async')
  , Model = require('../../model');

var EdgeSchema = require('./schema');

module.exports = Model.extend({

    schema: EdgeSchema

  , load: function (cb) {
      async.parallel([
          this.loadX.bind(this)
        , this.loadY.bind(this)
      ], function (err) {
        if (err) return cb(err);
        cb(null);
      });
    }

  , loadX: function (cb) {
      this.loadRef('x', cb);
    }

  , loadY: function (cb) {
      this.loadRef('y', cb);
    }

});
