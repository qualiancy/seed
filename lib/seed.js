/*!
 * seed
 * Copyright(c) 2011 Jake Luer <@jakeluer>
 * MIT Licensed
 */

module.exports = Seed = {};

Seed.version = '0.0.7';

Seed.Model = require('./model');
Seed.Collection = require('./collection');

Seed.MemoryStore = require('./store/memory.js');