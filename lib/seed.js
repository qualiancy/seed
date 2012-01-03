/*!
 * seed
 * Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

var Seed = module.exports = {};

Seed.version = '0.1.5';

// Constructors
Seed.Schema = require('./seed/schema');
Seed.Hash = require('./seed/hash');
Seed.Model = require('./seed/model');
Seed.Graph = require('./seed/graph');

// Utils
Seed.utils = require('./seed/utils');

// Helpers
Seed.Comparator = require('./seed/comparator');
Seed.Filter = require('./seed/filter');
Seed.Query = require('./seed/query');

Seed.ObjectId = Seed.utils.Flake;

// Expose storage prototype for extending
Seed.Store = require('./seed/store');

// Build-in storage modules
Seed.MemoryStore = require('./seed/stores/memory.js');