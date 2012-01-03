/*!
 * seed
 * Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

var Seed = module.exports = {};

Seed.version = '0.1.5';

// Constructors
Seed.Schema = require('./schema');
Seed.Hash = require('./hash');
Seed.Model = require('./model');
Seed.Graph = require('./graph');

// Utils
Seed.utils = require('./utils');

// Helpers
Seed.Comparator = require('./helpers/comparator');
Seed.Filter = require('./helpers/filter');
Seed.Query = require('./hash/query');

Seed.ObjectId = Seed.utils.Flake;

// Expose storage prototype for extending
Seed.Store = require('./store');

// Build-in storage modules
Seed.MemoryStore = require('./store/memory.js');