var mongoose = require('mongoose');
var Reservation = require('./reservation');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: String,
})

userSchema.methods.reserve = function (bicId, startDate, endDate, callback){
    var reserve = new Reservation({
        user: this._id, 
        bicycle: bicId, 
        startDate: startDate, 
        endDate: endDate 
    });

    console.log(reserve);
    reserve.save(callback);
}

module.exports = mongoose.model('User', userSchema);