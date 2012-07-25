/*!
 * seed
 * Copyright(c) 2011-2012 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

var Seed = module.exports = {};

Seed.version = '0.4.4';

// Utility Constructors
Seed.Promise = require('./seed/base/promise');
Seed.EventEmitter = require('./seed/base/events');
Seed.Query = require('./seed/base/query');
Seed.Hash = require('./seed/base/hash');

// Custom Errors
Seed.errors = {};
Seed.errors.model = require('./seed/errors/model');
Seed.errors.graph = require('./seed/errors/graph');
Seed.errors.store = require('./seed/errors/store');

// Seed Constructors
Seed.Schema = require('./seed/schema');
Seed.Model = require('./seed/model');
Seed.Graph = require('./seed/graph');

// Utils
Seed.utils = require('./seed/utils');
Seed.async = require('./seed/base/async');

// Unique ID Strategies
Seed.ObjectId = Seed.utils.Flake;
Seed.Flake = Seed.utils.Flake;
Seed.Crystal = Seed.utils.Crystal;

// Expose storage prototype for extending
Seed.Store = require('./seed/store');

// Build-in storage modules
Seed.MemoryStore = require('./seed/stores/memory.js');
