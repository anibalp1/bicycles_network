var mongoose = require('mongoose');
var moment = require('moment');
var Schema = mongoose.Schema;

var reservationSchema = new Schema({
    startDate: Date,
    endDate: Date,
    bicycle: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Bicycle'
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
});

reservationSchema.methods.reservedDays = function () {
    return moment(this.endDate).diff(moment(this.startDate), 'days') + 1;
}

module.exports = mongoose.model('Reservation', reservationSchema);