
var exports = module.exports = require('dragonfly')('SeedError');

exports.register('no store', {
    message: 'No storage defined.'
  , code: 'ENOSTORE'
  , ctx: 'Model'
});

exports.register('not valid', {
    message: 'Attributes did not validate.'
  , code: 'ENOTVALID'
  , ctx: 'Model'
});

exports.register('no data', {
    message: 'Fetch returned returned no data.'
  , code: 'ENOTFOUND'
  , ctx: 'Model'
});

exports.register('no dbref', {
    message: 'DBRef undefined.'
  , code: 'ENODBREF'
  , ctx: 'Model'
});

exports.register('no type', {
    message: 'Missing model type constructor.'
  , code: 'ENOMODELDEF'
  , ctx: 'Model'
});
