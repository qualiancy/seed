
var exports = module.exports = require('dragonfly')('SeedError');

exports.register('no store', {
    message: 'No storage defined.'
  , code: 'ENOSTORE'
  , ctx: 'Graph'
});

exports.register('no type', {
    message: 'Missing model type constructor.'
  , code: 'ENOMODELDEF'
  , ctx: 'Graph'
});

exports.register('no id', {
    message: 'Missing parameter for Graph set.'
  , code: 'ENOID'
  , ctx: 'Graph'
});

