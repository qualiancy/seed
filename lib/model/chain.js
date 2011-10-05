var utils = require('../utils'),
    oath = require('oath');

var Chain = function (model, options) {
  if (!model) throw new Error('model required to start chain');
  this.model = model;
  options = options || {};
  utils.merge(options, { context: model });
  oath.call(this, options);
};

utils.merge(Chain.prototype, oath.prototype);

Chain.prototype.get = function (prop) {
  var o = new oath({ parent: this, context: this.model }),
      model = this.model;
  
  this.then(
      function () { o.resolve(model.get(prop)); },
      function () { o.reject(model); }
    );
  
  return o;
};

Chain.prototype.set = function (props, opts) {
  var model = this.model;
  
  return this.then(
      function () { model.set(props, opts); }
    );
};

Chain.prototype.serialize = function () {
  var o = new oath({ parent: this, context: this.model }),
      model = this.model;
  
  this.then(
      function () { o.resolve(model.serialize()); },
      function () { o.reject(model); }
    );
  
  return o;
};

var sync_wrap = function (model, action, options, success, failure) {
  var save_chain = new Chain(model, { parent: this, context: model });
  
  if (utils.isFunction(options)) {
    failure = success;
    success = options;
    options = {};
  }
  
  options = options || {};
  
  var savefn = function () {
    model[action](options, function (err) {
      if (err) {
        save_chain.reject(err);
        return;
      }
      save_chain.resolve();
    });
  };
  
  save_chain.then(success, failure);
  this.then(savefn);
  
  return save_chain;
};

Chain.prototype.save = function (options, success, failure) {
  return sync_wrap.call(this, this.model, 'save', options, success, failure);
};

Chain.prototype.fetch = function (options, success, failure) {
  return sync_wrap.call(this, this.model, 'fetch', options, success, failure);
};

Chain.prototype.destroy = function (options, success, failure) {
  return sync_wrap.call(this, this.model, 'destroy', options, success, failure);
};


Chain.prototype.exec = function () {
  if (this._options.parent) throw new Error('Cannot exec on child chain');
  
  this.resolve();
};

module.exports = Chain;