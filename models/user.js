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
    },
    googleId: String,
    facebookId: String
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

userSchema.statics.findOneOrCreateByGoogle = function findOneOrCreate(condition,callback) {
    const self = this;
    console.log(condition);
    self.findOne({
            $or: [
                { 'googleId': condition.id },
                { 'email': condition.emails[0].value },
            ],
        },
        function (err, result) {
            if (result) {
                callback(err, result);
            } else {
                console.log('==========CONDITION==========');
                console.log(condition);
                let values = {};
                values.googleId = condition.id;
                values.email = condition.emails[0].value;
                values.name = condition.displayName || 'NAMELESS';
                values.validated = true;
                values.password = crypto.randomBytes(16).toString('hex');
                console.log('==========VALUES==========');
                console.log(values);
                self.create(values, (err, result) => {
                    if (err) console.log(err);
                    return callback(err, result);
                });
            }
        });
}

userSchema.statics.findOneOrCreateByFacebook = function findOneOrCreate(condition,callback) {
    const self = this;
    console.log(condition);
    self.findOne({
            $or: [
                { 'facebookId': condition.id },
                { 'email': condition.emails[0].value },
            ],
        },
        function (err, result) {
            if (result) {
                callback(err, result);
            } else {
                console.log('==========CONDITION==========');
                console.log(condition);
                let values = {};
                values.googleId = condition.id;
                values.email = condition.emails[0].value;
                values.name = condition.displayName || 'NAMELESS';
                values.validated = true;
                values.password = crypto.randomBytes(16).toString('hex');
                console.log('==========VALUES==========');
                console.log(values);
                self.create(values, (err, result) => {
                    if (err) console.log(err);
                    return callback(err, result);
                });
            }
        });
}

userSchema.methods.send_welcome_email = function(callback){
    const token = new Token({_userId: this.id, token: crypto.randomBytes(16).toString('hex')});
    const email_destination = this.email;
    token.save(function(err){
        if(err) return console.log(err.message);

        const mailOptions = {
            from: process.env.SENDGRID_EMAIL,
            to: email_destination,
            subject: 'Account Verification',
            text: 'Hi, \n\n' + 'To validate your account please click the next link: \n' + process.env.HOST + '\/token/confirmation\/' +token.token + '\n'
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
            from: process.env.SENDGRID_EMAIL,
            to: email_destination,
            subject: 'Password Reset',
            text: 'Hi,\n\n' + 'Please click on this link to reset your account password:\n' + process.env.HOST + '\/session\/resetPassword\/' + token.token + '\n'
        }

        mailer.sendMail(mailOptions, function(err) {
            if (err) { return cb(err); }
            console.log('An email to reset the password was sent to ' + email_destination + '.');
        });

        cb(null);
    });
};

module.exports = mongoose.model('User', userSchema);