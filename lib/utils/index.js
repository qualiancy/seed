/*!
 * Seed :: Utilities Loader
 * Copyright(c) 2011-2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * External module dependancies
 */

var fs = require('fs')
  , path = require('path');

/*!
 * Local variables
 */

var _utils = {};

/*!
 * Get all utilities from `utils` folder and provide
 * access as a getter onto our exported variable.
 */

fs.readdirSync(__dirname).forEach(function(filename){
  if (!/\.js$/.test(filename)) return;
  if (filename == '/index.js') return;
  var name = path.basename(filename, '.js');
  Object.defineProperty(_utils, name,
    { get: function () {
        return require('./' + name);
      }
    , enumerable: true
  });
});

/*!
 * Mount the utilities to the export
 */

for (var exp in _utils) {
  var util = _utils[exp];
  exports = _utils.object.merge(exports, util);
}
