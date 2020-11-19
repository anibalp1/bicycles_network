var mongoose = require('mongoose');
var Reservation = require('./reservation');
const uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

const bcrypt = require('bcrypt');
const saltRounds = 10;
const crypto = require('crypto');
const Token = require('../models/token');
const mailer = require('../mailer/mailer'); 

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
        unique: true,
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

userSchema.plugin(uniqueValidator, { message: 'The {PATH} already exists'});

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

userSchema.methods.send_welcome_email = function(callback){
    const token = new Token({_userId: this.id, token: crypto.randomBytes(16).toString('hex')});
    const email_destination = this.email;
    token.save(function(err){
        if(err) return console.log(err.message);

        const mailOptions = {
            from: 'no-reply@bicycleNetwork.com',
            to: email_destination,
            subject: 'Account Verification',
            text: 'Hi, \n\n' + 'To validate your account please click the next link: \n' + 'http://localhost:3000' + '\/token/confirmation\/' +token.token + '\n'
        }

        mailer.sendMail(mailOptions, function(err){
            if(err) {   return console.log(err.message); }

            console.log('A verificaation mail has been send to: ' +email_destination +'.'); 
        });

    });
}

userSchema.methods.resetPassword = function(cb) {
    const token = new Token({_userId: this.id, token: crypto.randomBytes(16).toString('hex')});
    const email_destination = this.email;
    token.save(function(err) {
        if (err) { return cb(err); }

        const mailOptions = {
            from: 'no-reply@bicycleNetwork.com',
            to: email_destination,
            subject: 'Password Reset',
            text: 'Hi,\n\n' + 'Please click on this link to reset your account password:\n' + 'http://localhost:3000' + '\/resetPassword\/' + token.token + '\n'
        }

        mailer.sendMail(mailOptions, function(err) {
            if (err) { return cb(err); }
            console.log('An email to reset the password was sent to ' + email_destination + '.');
        });

        cb(null);
    });
};

module.exports = mongoose.model('User', userSchema);