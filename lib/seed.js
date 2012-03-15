/*!
 * seed
 * Copyright(c) 2011-2012 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

var Seed = module.exports = {};

Seed.version = '0.2.2';

// Utility Constructors
Seed.Promise = require('./seed/promise');
Seed.EventEmitter = require('./seed/events');
Seed.Query = require('./seed/query');

// Seed Constructors
Seed.Schema = require('./seed/schema');
Seed.Hash = require('./seed/hash');
Seed.Model = require('./seed/model');
Seed.Graph = require('./seed/graph');

// Custom Error
Seed.SeedError = require('./seed/error');

// Utils
Seed.utils = require('./seed/utils');

// Unique ID Strategies
Seed.ObjectId = Seed.utils.Flake;
Seed.Flake = Seed.utils.Flake;
Seed.Crystal = Seed.utils.Crystal;

// Expose storage prototype for extending
Seed.Store = require('./seed/store');

// Build-in storage modules
Seed.MemoryStore = require('./seed/stores/memory.js');
