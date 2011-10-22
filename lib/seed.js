/*!
 * seed
 * Copyright(c) 2011 Jake Luer <@jakeluer>
 * MIT Licensed
 */

module.exports = Seed = {};

Seed.version = '0.0.7';

Seed.Hash = require('./hash/hash');
Seed.Model = require('./model/model');
Seed.Collection = require('./collection/collection');
Seed.Graph = require('./graph/graph');


// Build-in storage modules
Seed.MemoryStore = require('./store/memory.js');
Seed.FileStore = require('./store/file.js');