var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var placeSchema = new Schema(
  {
    name:         { type: String },
    location:     { type: Array },
    address:      { type: String },
    notes:        { type: String },
    author:       { type: Schema.ObjectId, ref: 'User'},
    creation:     { type: Date, default: Date.now },
    visited:      { type: Boolean },
    geoplacedata: { type: String }
  },
  {
    collection: 'places'
  }
);

placeSchema.method.getGMapJSON = function(){
    return JSON.parse( this.geoplacedata );
};

module.exports = mongoose.model('Place', placeSchema);
