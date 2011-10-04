/**
 * seed
 */
exports.version = '0.0.4';

exports.model = require('./model');
exports.collection = require('./collection');
exports.storage = require('./storage');

exports.merge = require('./utils').merge;
exports.extend = require('./utils').extend;