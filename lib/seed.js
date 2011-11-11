/*!
 * seed
 * Copyright(c) 2011 Jake Luer <@jakeluer>
 * MIT Licensed
 */

module.exports = Seed = {};

Seed.version = '0.0.11';

// Constructors
Seed.Schema = require('./schema/schema');
Seed.Hash = require('./hash/hash');
Seed.Model = require('./model/model');
Seed.Graph = require('./graph/graph');

// Helpers
Seed.Comparator = require('./hash/comparator');

Seed.ObjectId = require('tea').UID;

// Expose storage prototype for extending
Seed._Store = require('./store/store');

// Build-in storage modules
Seed.MemoryStore = require('./store/memory.js');