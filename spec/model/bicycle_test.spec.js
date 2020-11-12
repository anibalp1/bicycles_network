var mongoose = require('mongoose');
var Bicycle = require('../../models/bicycle');

describe('Testing Bicycles', function(){

    beforeAll(function(done) {

        var mongoDB = 'mongodb://localhost/testdb';
        mongoose.connect(mongoDB, {  useNewUrlParser: true, useUnifiedTopology: true });

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'console error'));
        db.once('open', function(){
            console.log('We are connected to test database!');
            done();
        });
        // mongoose.connection.close(done);

    });

    afterEach((done)=> {
        Bicycle.deleteMany({}, function(err, success){
            if(err) console.log(err);
            done();
        });
    });

    afterAll(function(done) {
        mongoose.connection.close(done);
    });

    describe('Bicycle.createInstance', ()=> {
        it('Create a Bicycle instance', ()=> {
            var bic = Bicycle.createInstance(1, "green", "urban", [-34.5, -98.53]);

            expect(bic.code).toBe(1);
            expect(bic.color).toBe("green");
            expect(bic.model).toBe("urban");
            expect(bic.location[0]).toEqual(-34.5);
            expect(bic.location[1]).toEqual(-98.53);
            
        });
    });

    describe('Bicycle.allBicycles', ()=> {
        it('Start Empty', (done)=> {
            Bicycle.allBicycles(function(err, bicycles){
                expect(bicycles.length).toBe(0);
                done();
            });
        });
    });

    describe('Bicycle.add', ()=> {
        it('Adds just one bicycle', (done)=> {
            var bic = new Bicycle({code: 1, color: "green", model: "urban"});
            Bicycle.add(bic, function(err, newBicycle){ 
                if(err) console.log(err);
                Bicycle.allBicycles(function(err, allBicycles){
                    expect(allBicycles.length).toEqual(1);
                    expect(allBicycles[0].code).toEqual(bic.code);
                    done();
                });
            });
        });
            
    });
    
    describe('Bicycle.findByCode', ()=> {
        it('Find a bicycle by it code', (done)=> {
            Bicycle.allBicycles(function(err, bicycles){
                expect(bicycles.length).toBe(0);

                var bic = new Bicycle({code: 1, color: "green", model: "urban"});
                Bicycle.add(bic, function(err, newBicycle){
                    if(err) console.log(err);
                    
                    var bic2 = new Bicycle({code: 2, color: "red", model: "bmx"});
                    Bicycle.add(bic2, function(err, newBicycle){
                        if(err) console.log(err);
                       
                        Bicycle.findByCode(1, function (err, targetBic) {
                            expect(targetBic.code).toBe(bic.code);
                            expect(targetBic.color).toBe(bic.color);
                            expect(targetBic.model).toBe(bic.model);
                            
                            done();
                        })
                    });
                });
            });
        });
            
    });

    describe('Bicycle.deleteByCode', ()=> {
        it('Find a bicycle by its code and delete it', (done)=> {
            Bicycle.allBicycles(function(err, bicycles){
                expect(bicycles.length).toBe(0);

                var bic = new Bicycle({code: 1, color: "green", model: "urban"});
                Bicycle.add(bic, function(err, newBicycle){
                    if(err) console.log(err);
                    
                    Bicycle.removeByCode(1, function (err, targetBic) {
                        if(err) console.log(err);

                        Bicycle.allBicycles(function(err, allBicycles) {
                           if(err) console.log(err);
                           
                           expect(allBicycles.length).toBe(0);
                           done();
                        });
                    })
                });
            });
        });
            
    });
    
    
});