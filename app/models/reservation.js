'use strict';

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
;

var reservationSchema = new Schema({
    username: String
  , email: String
});

reservationSchema.statics = {

  reserve: function (username, email, callback) {
    var Self = this;
    Self.findOne({$or: [ {username: username}, {email: email} ] }, function (err, result){
      if (err) return callback(err);
      if (result) {
        if (result.username === username) return callback('username');
        if (result.email === email) return callback('email');
      }
      
      
      var reservation = new Self();
      reservation.email = email;
      reservation.username = username;

      return reservation.save(callback(null));
    });
  }

}

module.exports = mongoose.model('Reservation', reservationSchema);