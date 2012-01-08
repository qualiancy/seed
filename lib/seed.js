/*!
 * seed
 * Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

var Seed = module.exports = {};

Seed.version = '0.1.7';

// Constructors
Seed.Schema = require('./seed/schema');
Seed.Hash = require('./seed/hash');
Seed.Model = require('./seed/model');
Seed.Graph = require('./seed/graph');
Seed.Query = require('./seed/query');

// Helpers
Seed.comparators = require('./seed/helpers/comparators');
Seed.filters = require('./seed/helpers/filters');

// Utils
Seed.utils = require('./seed/utils');
Seed.ObjectId = Seed.utils.Flake;

// Expose storage prototype for extending
Seed.Store = require('./seed/store');

// Build-in storage modules
Seed.MemoryStore = require('./seed/stores/memory.js');