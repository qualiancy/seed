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

module.exports = {};

/*!
 * Get all utilities from `utils` folder and provide
 * access as a getter onto our exported variable.
 */

fs.readdirSync(__dirname).forEach(function(filename){
  if (!/\.js$/.test(filename)) return;
  if (filename == 'index.js') return;
  var name = path.basename(filename, '.js');
  Object.defineProperty(module.exports, name,
    { get: function () {
        return require('./' + name);
      }
    , enumerable: true
  });
});
