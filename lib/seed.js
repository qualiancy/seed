/*!
 * seed
 * Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

var Seed = module.exports = {};

Seed.version = '0.1.0';

// Constructors
Seed.Schema = require('./schema');
Seed.Hash = require('./hash');
Seed.Model = require('./model');
Seed.Graph = require('./graph');

// Helpers
Seed.Comparator = require('./hash/comparator');

Seed.ObjectId = require('tea').UID;

// Expose storage prototype for extending
Seed._Store = require('./store');

// Build-in storage modules
Seed.MemoryStore = require('./store/memory.js');