var mongoose = require('mongoose');
var User = require('../../models/user');
var Reservation = require('../../models/reservation');
var Bicycle = require('../../models/bicycle');

describe('Testing Users ', function() {
    beforeAll(function(done) {

        var mongoDB = 'mongodb://localhost/testdb';
        mongoose.connect(mongoDB, {  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'console error'));
        db.once('open', function(){
            console.log('We are connected to test database!');
            done();
        });
    });

    afterEach((done)=> {
        Reservation.deleteMany({}, function(err, success) {
           if(err) console.log(err);
           User.deleteMany({}, function(err, success){
                if(err) console.log(err);
                Bicycle.deleteMany({}, function(err, success){
                    if(err) console.log(err);
                    done();
                });
           }); 
        });
    });

    afterAll(function(done) {
        mongoose.connection.close(done);
    });

    describe('A reservation is made by user', ()=> {
        it('The reservation must exists', (done) => {
            const user = new User({name: 'Samuel'});
            user.save();

            const bicycle = new Bicycle({ code: 1, color: 'green', model: 'urban'});
            bicycle.save();

            var today = new Date();
            var tomorrow = new Date();
            tomorrow.setDate(today.getDate() + 1);

            user.reserve(bicycle.id, today, tomorrow, function(err, reservation){
                Reservation.find({}).populate('user').populate('bicycle').exec(function(err, reservations) {
                    console.log(reservations[0]);
                    
                    expect(reservations.length).toBe(1);
                    expect(reservations[0].reservedDays()).toBe(2);
                    expect(reservations[0].bicycle.code).toBe(1);
                    expect(reservations[0].user.name).toBe(user.name);
                    
                    done();
                });
            });

        });

    });


});