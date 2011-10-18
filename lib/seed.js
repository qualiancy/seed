/*!
 * seed
 * Copyright(c) 2011 Jake Luer <@jakeluer>
 * MIT Licensed
 */

exports.version = '0.0.7';

exports.model = require('./model');
exports.collection = require('./collection');

exports.MemoryStore = require('./store/memory.js');