const mongoose = require('mongoose');

const CartsSchema = mongoose.Schema({
    productTitle:{
        type:String,
        required:true,
    },
    images: {
          type:String,
          required:true
    },
    size:{
        type:String,
    },
    ram:{
        type:String,
    },
    price:{
        type:Number,
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
    },
    subTotal:{
        type:Number,
        required:true,
    },
    productId:{
        type:String,
        required:true,
    },
    userId:{
        type:String,
        required:true,
    }
    

})

CartsSchema.virtual('id').get(function (){
    return this._id.toHexString();
});
CartsSchema.set('toJSON',{
    virtuals : true,
});

exports.Carts = mongoose.model("Carts",CartsSchema)
exports.CartsSchema = CartsSchema;