'use strict';

var mongoose = require('mongoose')
  , elmongo = require('elmongo')
  , Schema = mongoose.Schema
;

var addressSchema = new Schema({
    sani_url: String
  , working_url: String
  , favicon: String
  , content: String
  , title: String
});

addressSchema.statics = {

  upsert: function (opts, cb) {
    var Self = this;
    Self.findOne({
      'sani_url': opts.sani_url
    }, function (err, address) {
      if (err) {
        return cb(err);
      }

      console.log(address || 'no address found, creating new');

      if (!address) { //We need to create a new address if it does not exist.
        var address = new Self();
      }
      
      address.working_url = opts.page.working_url;
      address.favicon_url = opts.page.favicon_url || 'false';
      address.sani_url = opts.sani_url;
      address.content = opts.page.content;
      address.title = opts.page.title;

      opts.address_id = address._id; //Keep the _id for later
      console.log('saved address: ', address);
      return address.save(cb(err, opts));
    });
  }

};

// add the elastic plugin
addressSchema.plugin(elmongo, { host: 'localhost', port: 9200, prefix: 'test' });

module.exports = mongoose.model('Address', addressSchema);