/*!
 * seed
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

// version
exports.version = '1.0.0-alpha';

// Custom Errors
exports.errors = {};
exports.errors.model = require('./lib/errors/model');
exports.errors.graph = require('./lib/errors/graph');
exports.errors.store = require('./lib/errors/store');

// exports Constructors
exports.Filter = require('./lib/filter');
exports.Hash = require('./lib/hash');
exports.Struct = require('./lib/struct');
exports.Model = require('./lib/model');
exports.Graph = require('./lib/graph');

// Utils
exports.utils = require('./lib/utils');

// Unique ID Strategies
exports.ObjectId = exports.utils.Flake;
exports.Flake = exports.utils.Flake;
exports.Crystal = exports.utils.Crystal;

// Expose storage prototype for extending
exports.Store = require('./lib/store');

// Build-in storage modules
exports.MemoryStore = require('./lib/stores/memory.js');
