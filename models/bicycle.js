var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bicycleShema = new Schema({
    code: Number,
    color: String,
    model: String,
    location: {
        type: [Number], index: { type: '2dsphere', sparse: true}
    }
});

bicycleShema.statics.createInstance = function(code, color, model, location){
    return new this({
        code: code,
        color: color,
        model: model,
        location: location
    });
}

bicycleShema.methods.toString = function(){
    return 'code: ' +this.code+ ' | color: ' +this.color;
};

bicycleShema.statics.allBicycles = function(callback){
    return this.find({}, callback);
}

bicycleShema.statics.add = function(bic, callback){
    return this.create(bic,callback);
}

bicycleShema.statics.findByCode = function(code, callback){
    return this.findOne({code: code}, callback);
}

bicycleShema.statics.removeByCode = function(code, callback){
    return this.deleteOne({code: code}, callback);
}



module.exports = mongoose.model('Bicycle', bicycleShema);
