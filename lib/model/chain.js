/*!
 * seed - model#chain
 * Copyright(c) 2011 Jake Luer <@jakeluer>
 * MIT Licensed
 */

var utils = require('../utils'),
    oath = require('oath');

/**
 * # Chain
 * 
 * The module extends the model and allows any action 
 * on a model to be called in a chain. 
 * 
 * #### Example
 * 
 *      model
 *        .chain()
 *        .set({key: 'value'})
 *        .save(successFn, failureFn)
 *          .then(doSomething)
 *          .get('key')
 *            .then(workWithKeyValue)
 *            .pop()
 *          .pop()
 *        .exec();
 * 
 * @api private prototype
 */

var Chain = function (model, options) {
  if (!model) throw new Error('model required to start chain');
  this.model = model;
  options = options || {};
  utils.merge(options, { context: model });
  oath.call(this, options);
};

/*!
 * Merge with `oath' promise constructor.
 */

utils.merge(Chain.prototype, oath.prototype);

/**
 * # .get()
 * 
 * Get an attribute from a model and return as parameter to
 * any function chained thereafter. Context is changed
 * so must `.pop()` to get back to executing chain on model.
 * 
 * #### Example
 * 
 *        model
 *          .chain()
 *          .get('prop', withResultFn)
 *          .exec();
 * 
 * @param {String} property
 * @api public
 * @see lib/model.js
 */

Chain.prototype.get = function (prop, fn) {
  var model = this.model;
  
  
  return this.then(
    function () {
      if (fn && 'function' === typeof fn) {
        var val = model.get(prop); 
        fn.call(model, val);
      }
    }
  );
};

/**
 * # .set()
 * 
 * Set attribute(s) in a model. Does not change chain
 * context so subsequent change calls are still on model.
 * 
 * #### Example
 * 
 *        model
 *          .chain()
 *          .set({ key: 'value' })
 *          .exec();
 * 
 * @param {Object} property
 * @param {Object} options
 * @api public
 * @see lib/model.js
 */

Chain.prototype.set = function (props, opts) {
  var model = this.model;
  
  return this.then(
      function () { model.set(props, opts); }
    );
};

/**
 * # .serialize()
 * 
 * Get JSON string of model attributes and return as parameter to
 * any function chained thereafter. Context is changed
 * so must `.pop()` to get back to executing chain on model.
 * 
 * Only valid follow-up until `.pop()` is `.then`.
 * 
 * #### Example
 * 
 *        model
 *          .chain()
 *          .serialize(withResultFn)
 *          .exec();
 * 
 * @param {String} property
 * @api public
 * @see lib/model.js
 */

Chain.prototype.serialize = function (fn) {
  var model = this.model;
  
  
  return this.then(
    function () { 
      if (fn && 'function' === typeof fn) {
        var result = model.serialize();
        fn.call(model, fn);
      }
    }
  );
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

Chain.prototype.exec = function () {
  if (this._options.parent) throw new Error('Cannot exec on child chain');
  
  this.resolve();
};

module.exports = Chain;