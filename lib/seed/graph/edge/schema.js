var Schema = require('../../Schema');

module.exports = new Schema({

    x: {
        type: Schema.Type.DBRef
      , required: true
    }

  , y: {
        type: Schema.Type.DBRef
      , required: true
    }

  , rel: {
        type: String
      , required: true
    }

});
