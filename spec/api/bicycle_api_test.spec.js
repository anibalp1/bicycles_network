var Bicycle = require('../../models/bicycle');
var request = require('request');
var server = require('../../bin/www');

beforeEach(()=>{
    Bicycle.deleteMany({}, function(err, success){
        if(err) console.log(err);
    });
});

describe('Bicycle Api', ()=> {

    describe('Get Bicycles /', ()=> {
        it('Status 200', (done)=> {
            var bic = new Bicycle({code: 1, color: "green", model: "urban"});
            bic.save();

            request.get('http://localhost:3000/api/bicycles', function(error, response, body){
                var result = JSON.parse(body);
                expect(response.statusCode).toBe(200);
                expect(result.bicycles.length).toBe(1);

                done();
            });
        });
    });

    describe('Post Bicycle /create', ()=> {
        it('Status 200', (done)=> {
            var headers = {'content-type' : 'application/json'};
            var bic = '{"code":10, "color":"red", "model":"urban", "location": [18.477770, -69.915592]}';

            request.post({
                headers: headers,
                url: 'http://localhost:3000/api/bicycles/create',
                body: bic
            }, function(error, response, body){
                expect(response.statusCode).toBe(200);
                
                var result = JSON.parse(body);
                console.log(result);

                expect(result.bicycle.color).toBe("red");
                expect(result.bicycle.model).toBe("urban");
                
                done();
            });
        });
    });

    describe('Post Bicycle /update ', ()=> {
        it('Status 200', (done)=> {
            var headers = {'content-type' : 'application/json'};
            var bic = new Bicycle({code: 10,color: "red",model: "urban",location: [18.477770, -69.915592]});
            bic.save();
            
            var updatedBic = '{"code":10, "color":"blue", "model":"mountain", "location": [18.477770, -69.915592]}';

            request.post({
                headers: headers,
                url: 'http://localhost:3000/api/bicycles/update',
                body: updatedBic
            }, function(error, response, body){
                Bicycle.findByCode(10, function(err, bicycle){
                    
                    expect(response.statusCode).toBe(200);
                    expect(bicycle.color).toBe("blue");
                    expect(bicycle.model).toBe("mountain");

                    done();
                });
            });
        });
    });

    describe('Post Bicycle /delete', ()=> {
        it('Status 204', (done)=> {
            var headers = {'content-type' : 'application/json'};
            var bic = new Bicycle({ code: 10, color: "red", model: "urban", location: [18.477770, -69.915592] });
            bic.save();

            request.delete({
                headers: headers,
                url: 'http://localhost:3000/api/bicycles/delete',
                body: '{"code": 10}'
            }, function(error, response, body){
                expect(response.statusCode).toBe(204);
                if (error) console.log(error);
                Bicycle.allBicycles(function(err, bicycles){    
                    if (err) console.log(err);      
                    expect(bicycles.length).toBe(0);

                    done();
                });
            });
        });
    });
});

