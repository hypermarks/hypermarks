'use strict';

var mongoose = require('mongoose')
  , elmongo = require('elmongo')
  , Schema = mongoose.Schema
  , config = require('../../config/config')()
 // , Bookmark = mongoose.model('Bookmark')
;

var addressSchema = new Schema({
    sani_url: String
  , working_url: String
  , favicon: String
  , content: String
  , title: String
}, { collection: 'addresses' }); //Set Mongo collection name explicitly

addressSchema.statics = {


  clone: function (address_id, block_id, user_id,  BookmarkObj, bookmark_id, callback) {
    console.log(bookmark_id)
    var Self = this;
    Self.findById(address_id, function (err, address) {
      if (!address) return callback(new Error('No Address found at this _id.'));

      //opts._ancestor=bookmark_id;

      //var merged = _.defaults(opts, bookmark.toObject());
      //merged._id = undefined;

      // bookmark._address=address_id, 
      // bookmark._ancestor=bookmark_id,
      // bookmark.save();//Self(merged).save(callback);

      new BookmarkObj({
        sani_url : address.sani_url,
        user_url : address.sani_url,
        _user: user_id,
        block: block_id,
        _address:address_id, 
        _ancestor: bookmark_id})
        .save(function(err){
          //console.log(this)
          var bm=this.emitted? this.emitted.complete[0]:{};
          callback(err, bm);
        });//Self(merged).save(callback);
    });
  },

  upsert: function (opts, cb) {
    var Self = this;
    Self.findOne({
      'sani_url': opts.sani_url
    }, function (err, address) {
      if (err) {
        return cb(err);
      }
      if (!address) { //We need to create a new address if it does not exist.
        address = new Self();
      }
      
      address.working_url = opts.page.working_url;
      address.favicon_url = opts.page.favicon_url || 'false';
      address.sani_url = opts.sani_url;
      address.content = opts.page.content;
      address.title = opts.page.title;

      opts.address_id = address._id; //Keep the _id for later
      return address.save(cb(null, opts));
    });
  }
};

// add the elastic plugin
addressSchema.plugin(elmongo, { host: config.es, port: config.esport });

// configure search options
elmongo.search.config({ host: config.es, port: config.esport })

module.exports = mongoose.model('Address', addressSchema);