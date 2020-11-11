var Bicycle = function (id, color, model, location) {
    this.id = id;
    this.color = color;
    this.model = model;
    this.location = location;
}

Bicycle.prototype.toString = function(){
    return 'id: '+ this.id + " | color: " + this.color;
}

Bicycle.allBicycles = [];
Bicycle.add = function (aBicycle){
    Bicycle.allBicycles.push(aBicycle);
}
Bicycle.remove = function(aBicycle){
    Bicycle.allBicycles.push(aBicycle);
}
Bicycle.findByid = function(aBicycleId){
    var result = Bicycle.allBicycles.find(x => x.id == aBicycleId);
    if(result)
        return result;
    else
        throw new Error(`There is no bicycle with the id: ${aBicycleId}`);
}
Bicycle.removeById = function(aBicycleId){
    for(var i=0; i<Bicycle.allBicycles.length; i++){
        if(Bicycle.allBicycles[i].id == aBicycleId){
            Bicycle.allBicycles.splice(i,1);
            break;
        }
    }
}


// var a = new Bicycle(1, 'red', 'urban', [18.480289, -69.853922]);
// var b = new Bicycle(2, 'blue', 'urban', [18.480289, -69.850152]);

// Bicycle.add(a);
// Bicycle.add(b);

module.exports = Bicycle;