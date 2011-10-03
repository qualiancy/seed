/**
 * seed
 */
exports.version = '0.0.4';

exports.model = require('./model');

exports.collection = require('./collection');

exports.extend = require('./utils').extend;
exports._extend = require('./utils')._extend;