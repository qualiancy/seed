/*!
 * Seed :: EventEmitter
 * Copyright(c) 2011-2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * External module dependancies
 */

var Drip = require('drip')
  , inherits = require('super');

/*!
 * main export
 */

module.exports = EventEmitter;

/**
 * # EventEmitter (constructor)
 *
 * Provide a consistent Drip implemntation
 * accross all components.
 */

function EventEmitter() {
  Drip.call(this, { delimeter: ':' });
}

inherits(EventEmitter, Drip);
