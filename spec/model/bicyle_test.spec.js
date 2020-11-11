var Bicycle = require('../../models/bicycle');

beforeEach(()=>{
    Bicycle.allBicycles = [];
});

describe('Bicycle.allBicycles', ()=> {
    it('start empty', ()=> {
        expect(Bicycle.allBicycles.length).toBe(0);
    })
});

describe('Bicycle.add', ()=> {
    it('add one', ()=> {
        expect(Bicycle.allBicycles.length).toBe(0);

        var a = new Bicycle(1, 'red', 'urban', [18.480289, -69.853922]);
        Bicycle.add(a);

        expect(Bicycle.allBicycles.length).toBe(1);
        expect(Bicycle.allBicycles[0]).toBe(a);
    });
});

describe('Bicycle.findById', ()=> {
    it('must return the bicycle with given id', ()=> {
        expect(Bicycle.allBicycles.length).toBe(0);

        var bic = new Bicycle(1, 'red', 'urban', [18.480289, -69.853922]);
        var bic2 = new Bicycle(2, 'blue', 'urban', [18.480289, -69.853922]);

        Bicycle.add(bic);
        Bicycle.add(bic2);

        var targetBicycle = Bicycle.findByid(1);
        expect(targetBicycle.id).toBe(1);
        expect(targetBicycle.color).toBe(targetBicycle.color);
        expect(targetBicycle.model).toBe(targetBicycle.model);

    })
});

describe('Bicycle.deleteById', ()=> {
    it('must delete the bicycle with given id', ()=> {
        expect(Bicycle.allBicycles.length).toBe(0);

        var bic = new Bicycle(1, 'red', 'urban', [18.480289, -69.853922]);
    
        Bicycle.add(bic);

        expect(Bicycle.allBicycles.length).toBe(1);
        var targetBicycle = Bicycle.removeById(1);
        expect(Bicycle.allBicycles.length).toBe(0);
    })
});
