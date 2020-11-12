var Bicycle = require('../../models/bicycle');
var request = require('request');
var server = require('../../bin/www');

beforeEach(()=>{
    Bicycle.allBicycles = [];
});

describe('Bicycle Api', ()=> {
    describe('Get Bicycles /', ()=> {
        it('Status 200', ()=> {
            expect(Bicycle.allBicycles.length).toBe(0);

            var bic = new Bicycle(1, 'red', 'urban', [18.480289, -69.853922]);
            Bicycle.add(bic);

            request.get('http://localhost:3000/api/bicycles', function(error, response, body){
                expect(response.statusCode).toBe(200);
            });
        });
    });

    describe('Post Bicycle /create', ()=> {
        it('Status 200', (done)=> {
            var headers = {'content-type' : 'application/json'};
            var bic = '{"id":10, "color":"red", "model":"urban", "location": [18.477770, -69.915592]}';

            request.post({
                headers: headers,
                url: 'http://localhost:3000/api/bicycles/create',
                body: bic
            }, function(error, response, body){
                expect(response.statusCode).toBe(200);
                expect(Bicycle.findByid(10).color).toBe("red");
                done();
            });
        });
    });

    describe('Post Bicycle /update', ()=> {
        it('Status 200', (done)=> {
            var headers = {'content-type' : 'application/json'};
            var bic = new Bicycle(10, "red", "urban", [18.477770, -69.915592]);
            Bicycle.add(bic);
            
            var updatedBic = '{"id":10, "color":"blue", "model":"mountain", "location": [18.477770, -69.915592]}';

            request.post({
                headers: headers,
                url: 'http://localhost:3000/api/bicycles/update',
                body: updatedBic
            }, function(error, response, body){
                expect(response.statusCode).toBe(200);
                expect(Bicycle.findByid(10).color).toBe("blue");
                expect(Bicycle.findByid(10).model).toBe("mountain");

                done();
            });
        });
    });

    describe('Post Bicycle /delete', ()=> {
        it('Status 200', (done)=> {
            var headers = {'content-type' : 'application/json'};
            var bic = new Bicycle(10, "red", "urban", [18.477770, -69.915592]);
            Bicycle.add(bic);

            request.delete({
                headers: headers,
                url: 'http://localhost:3000/api/bicycles/delete',
                body: '{"id": 10}'
            }, function(error, response, body){
                expect(response.statusCode).toBe(204);
                expect(Bicycle.allBicycles.length).toBe(0);

                done();
            });
        });
    });
});

