/*!
 * Seed :: Schema
 * Copyright(c) 2011-2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * External module dependancies
 */

var util = require('util');

/*!
 * Seed component dependancies
 */

var _ = require('./utils')
  , Hash = require('./hash')
  , Query = require('./query')
  , EventEmitter = require('./events');

/*!
 * main export
 */

module.exports = Schema;

function Schema (definition) {
  EventEmitter.call(this);

  this.paths = new Hash();

  iteratePaths.call(this, '', definition);

  // make sure _id is an index
  if (!this.paths.has('_id')) {
    this.paths.set('_id',
      { index: true }
    );
  } else {
    var def = this.paths.get('_id');
    def.index = true;
    this.paths.set('_id', def);
  }
}

Schema.Type = require('./schematypes');

util.inherits(Schema, EventEmitter);

Object.defineProperty(Schema.prototype, 'indexes',
  { get: function () {
      return this.paths.find({ 'index': true });
    }
});

Object.defineProperty(Schema.prototype, 'required',
  { get: function () {
      return this.paths.find({ $or:
        [ { 'required': true } ]
      });
    }
});

Schema.prototype.validate = function (data) {
  var self = this
    , valid = true
    , required = this.required;

  this.paths.each(function (def, path) {
    var datum = Query.getPathValue(path, data);

    if (required.has(path) && !datum)
      return valid = false;

    if (datum && def.type) {
      var casted = self.castAsType(def, datum);
      if (!casted.validate()) return valid = false;
    }
  });

  return valid;
};

function iteratePaths (path, definition) {
  var def;
  for (var name in definition) {
    def = definition[name];

    // basic def: { first_name: String }
    if ((def && 'function' === typeof def) || def.name) {
      this.paths.set(path + name, { type: def });

    // complex def: { first_name: { type: String, index: true } [..]
    } else if (def.type && 'function' == typeof def.type) {
      var spec = { type: def.type };
      _.merge(spec, def);
      this.paths.set(path +  name, spec);

    // nested
    } else {
      iteratePaths.call(this, path + name + '.', def);
    }
  }
}

Schema.prototype.castAsType = function (path, data) {
  var type = new Schema.Type[path.type.name](path, data);
  return type;
};
