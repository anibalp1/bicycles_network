var mongoose = require('mongoose');
var Reservation = require('./reservation');
var Schema = mongoose.Schema;

const bcrypt = require('bcrypt');
const saltRounds = 10;

const validateEmail = function(email){
    const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return re.test(email);
}

var userSchema = new Schema({
    name: {
        type: String, 
        trim: true,
        required: [true, 'The name is required']
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'The email is required'],
        lowercase: true, 
        validate: [validateEmail, 'write a valid email'],
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/]
    },
    password: {
        type: String,
        required: [true, 'The password is required'],
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    validated: {
        type: Boolean,
        default: false
    }
});

userSchema.pre('save', function(next){
    if(this.isModified('password')){
        this.password = bcrypt.hashSync(this.password, saltRounds);
    }
    next();
});

userSchema.methods.validatePassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

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