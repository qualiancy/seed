
var exports = module.exports = require('dragonfly')('SeedError');

exports.register('not found', {
    message: 'Record not found in storage'
  , code: 'ENOTFOUND'
  , ctx: 'Store'
});

exports.register('no id', {
    message: 'Data missing Id'
  , code: 'EBADDATA'
  , code: 'Store'
});
